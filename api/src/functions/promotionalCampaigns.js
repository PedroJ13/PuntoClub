const { app } = require("@azure/functions");
const { ApiError } = require("../lib/errors");
const { created, handle, ok, readJson } = require("../lib/http");
const {
  parsePositiveInteger,
  validatePromotionalCampaignListQuery,
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientQuery,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalSendPayload,
  validatePromotionalUnsubscribePayload,
} = require("../lib/validators");
const notifier = require("../lib/notifier");
const repository = require("../lib/repository");
const {
  buildCampaignImageBlobPath,
  downloadCampaignImageBlob,
  getCampaignAssetConfig,
  parseCampaignImageMultipart,
  uploadCampaignImageBlob,
  validateCampaignImageFile,
} = require("../lib/campaignAssetStorage");
const { requireSessionIdentity } = require("./companyAuth");

const defaultPreviewCustomer = {
  name: "Maria Fernandez",
  email: "maria@example.com",
  pointsBalance: 1250,
};

function isPromotionalSendEnabled() {
  return (
    String(process.env.PROMOTIONAL_EMAIL_SEND_ENABLED || "").toLowerCase() ===
    "true"
  );
}

function renderTemplate(value, { company, customer, campaign }) {
  return String(value || "")
    .replaceAll("{{customer.name}}", customer.name || "cliente")
    .replaceAll("{{company.name}}", company.name || "Punto Club")
    .replaceAll(
      "{{points.currentBalance}}",
      String(customer.pointsBalance || 0),
    )
    .replaceAll("{{promotion.validUntil}}", campaign.validUntil || "");
}

function buildAbsoluteApiUrl(path, request) {
  if (/^https?:\/\//i.test(String(path || ""))) {
    return path;
  }

  const publicApiBaseUrl = String(
    process.env.PUBLIC_API_BASE_URL || "",
  ).replace(/\/$/, "");
  const appPublicBaseUrl = String(
    process.env.APP_PUBLIC_BASE_URL || "",
  ).replace(/\/$/, "");
  const requestApiBaseUrl =
    request && request.url
      ? new URL("/api", request.url).toString().replace(/\/$/, "")
      : "";
  const apiBaseUrl =
    publicApiBaseUrl ||
    requestApiBaseUrl ||
    (appPublicBaseUrl ? `${appPublicBaseUrl}/api` : "");

  return apiBaseUrl
    ? `${apiBaseUrl}${String(path || "").replace(/^\/api/, "")}`
    : path;
}

function buildPreview(
  campaign,
  company,
  customer = defaultPreviewCustomer,
  options = {},
) {
  const bodyText = renderTemplate(campaign.bodyText, {
    company,
    customer,
    campaign,
  });
  const pointsLine = campaign.includePoints
    ? `Tienes ${customer.pointsBalance || 0} puntos disponibles en ${company.name}.`
    : null;

  return {
    subject: renderTemplate(campaign.subject, { company, customer, campaign }),
    bodyText,
    pointsLine,
    footerText: `Recibes este correo porque aceptas promociones de ${company.name} en Punto Club. Puedes dejar de recibir promociones sin perder tus puntos, beneficios, membresias ni historial.`,
    sampleCustomer: customer,
    image: campaign.image
      ? {
          fileName: campaign.image.fileName,
          altText:
            campaign.image.altText || campaign.name || "Imagen de promocion",
          imageUrl: options.absoluteImageUrl
            ? buildAbsoluteApiUrl(campaign.image.imageUrl, options.request)
            : campaign.image.imageUrl,
        }
      : null,
    sendBlocked: !isPromotionalSendEnabled(),
    blockReason: isPromotionalSendEnabled() ? null : "feature_flag_disabled",
  };
}

function buildPromotionalEmail(
  campaign,
  company,
  recipient,
  emailConfig,
  options = {},
) {
  const customer = {
    name: recipient.customerName || "cliente",
    email: recipient.currentRecipientEmail || recipient.recipientEmail,
    pointsBalance: recipient.pointsBalanceSnapshot || 0,
  };
  const preview = buildPreview(campaign, company, customer, {
    absoluteImageUrl: true,
    request: options.request,
  });
  const pointsText =
    campaign.includePoints && preview.pointsLine
      ? `\n\n${preview.pointsLine}`
      : "";
  const footerText = preview.footerText;
  const plainText = [
    preview.bodyText,
    pointsText,
    "",
    footerText,
    "Para dejar de recibir promociones, solicita la baja a la empresa desde Punto Club.",
  ]
    .filter(Boolean)
    .join("\n");
  const html = [
    '<div style="margin:0;padding:24px;background:#f5f7f8;font-family:Arial,sans-serif;color:#172026;line-height:1.5">',
    '<div style="max-width:640px;margin:0 auto">',
    '<div style="margin:0 0 14px;font-size:14px;font-weight:700;color:#115e59">Punto Club</div>',
    '<div style="border:1px solid #d9e1e5;border-radius:8px;background:#ffffff;padding:24px">',
    `<h1 style="font-size:22px;line-height:1.2;margin:0 0 12px;color:#172026">${notifier.escapeHtml(preview.subject)}</h1>`,
    preview.image
      ? `<img src="${notifier.escapeHtml(preview.image.imageUrl)}" alt="${notifier.escapeHtml(preview.image.altText)}" style="display:block;width:100%;max-width:592px;height:auto;margin:0 0 16px;border-radius:6px" />`
      : "",
    `<p>${notifier.escapeHtml(preview.bodyText).replaceAll("\n", "<br>")}</p>`,
    preview.pointsLine
      ? `<p><strong>Puntos disponibles:</strong> ${notifier.escapeHtml(preview.pointsLine)}</p>`
      : "",
    `<p style="font-size:13px;color:#5f6d75">${notifier.escapeHtml(footerText)}</p>`,
    '<p style="font-size:13px;color:#5f6d75">Para dejar de recibir promociones, solicita la baja a la empresa desde Punto Club.</p>',
    "</div>",
    "</div>",
    "</div>",
  ].join("");

  return {
    senderAddress: emailConfig.senderAddress,
    senderDisplayName: emailConfig.senderDisplayName,
    to: [{ address: customer.email, displayName: customer.name }],
    subject: preview.subject,
    plainText,
    html,
  };
}

function getPromotionalRecipientSkipReason(recipient) {
  const email = String(
    recipient.currentRecipientEmail || recipient.recipientEmail || "",
  ).trim();

  if (recipient.currentPreferenceStatus !== "subscribed") {
    return recipient.currentPreferenceStatus || "unsubscribed";
  }

  if (!email || !email.includes("@")) {
    return "missing_email";
  }

  return null;
}

async function sendPromotionalCampaignToRecipients({
  companyId,
  campaignId,
  customerIds,
  emailConfig,
  request,
  sendEmail = (message) => notifier.sendEmailViaAcs(message, emailConfig),
  repositoryAdapter = repository,
}) {
  if (Array.isArray(customerIds)) {
    await repositoryAdapter.replacePromotionalCampaignRecipients(
      companyId,
      campaignId,
      customerIds,
    );
  }

  const campaign = await repositoryAdapter.beginPromotionalCampaignSend(
    companyId,
    campaignId,
  );
  const [company, recipients] = await Promise.all([
    repositoryAdapter.getCompanySettings(companyId),
    repositoryAdapter.listPendingPromotionalCampaignRecipientsForSend(
      companyId,
      campaignId,
    ),
  ]);
  if (
    typeof repositoryAdapter.getActivePromotionalCampaignImage === "function"
  ) {
    campaign.image = await repositoryAdapter.getActivePromotionalCampaignImage(
      companyId,
      campaignId,
    );
  }
  const results = [];

  for (const recipient of recipients) {
    const skipReason = getPromotionalRecipientSkipReason(recipient);

    if (skipReason) {
      const skipped =
        await repositoryAdapter.recordPromotionalCampaignRecipientResult(
          companyId,
          campaignId,
          recipient.id,
          {
            status: "skipped",
            provider: "acs-email",
            skipReason,
            reason: skipReason,
          },
        );
      results.push(skipped);
      continue;
    }

    try {
      const message = buildPromotionalEmail(
        campaign,
        company,
        recipient,
        emailConfig,
        { request },
      );
      const sendResult = await sendEmail(message);
      const saved =
        await repositoryAdapter.recordPromotionalCampaignRecipientResult(
          companyId,
          campaignId,
          recipient.id,
          {
            status: sendResult.status === "sent" ? "sent" : "failed",
            provider: sendResult.provider || "acs-email",
            providerMessageId: sendResult.id,
            lastError:
              sendResult.status === "sent"
                ? null
                : sendResult.reason || "provider_not_sent",
          },
        );
      results.push(saved);
    } catch (error) {
      const failed =
        await repositoryAdapter.recordPromotionalCampaignRecipientResult(
          companyId,
          campaignId,
          recipient.id,
          {
            status: "failed",
            provider: "acs-email",
            lastError: error && error.message ? error.message : "send_failed",
          },
        );
      results.push(failed);
    }
  }

  const completedCampaign =
    await repositoryAdapter.completePromotionalCampaignSend(
      companyId,
      campaignId,
    );

  return {
    campaign: completedCampaign,
    summary: {
      selected: recipients.length,
      sent: results.filter((recipient) => recipient.status === "sent").length,
      failed: results.filter((recipient) => recipient.status === "failed")
        .length,
      skipped: results.filter((recipient) => recipient.status === "skipped")
        .length,
    },
    recipients: results,
  };
}

async function updatePromotionalCampaignContent({
  request,
  repositoryAdapter = repository,
  getIdentity = requireSessionIdentity,
}) {
  const companyId = await getPromotionalCompanyId(request, getIdentity);
  await repositoryAdapter.ensureActiveCompany(companyId);
  const campaignId = await getCampaignId(request);
  const { patch } = validatePromotionalCampaignPayload(
    await readJson(request),
    {
      partial: true,
    },
  );
  const current = await repositoryAdapter.getPromotionalCampaignById(
    companyId,
    campaignId,
  );

  if (!["draft", "ready"].includes(current.status)) {
    throw new ApiError(
      409,
      "PROMOTIONAL_CAMPAIGN_NOT_EDITABLE",
      "Promotional campaign can only be changed before sending.",
    );
  }

  const campaign = await repositoryAdapter.updatePromotionalCampaign(
    companyId,
    campaignId,
    {
      name: patch.name ?? current.name,
      subject: patch.subject ?? current.subject,
      bodyText: patch.bodyText ?? current.bodyText,
      includePoints: Object.prototype.hasOwnProperty.call(
        patch,
        "includePoints",
      )
        ? patch.includePoints
        : current.includePoints,
    },
  );

  if (
    typeof repositoryAdapter.getActivePromotionalCampaignImage === "function"
  ) {
    campaign.image = await repositoryAdapter.getActivePromotionalCampaignImage(
      companyId,
      campaignId,
    );
  }

  return { campaign };
}

async function getCampaignId(request) {
  return parsePositiveInteger(request.params.campaignId, "campaignId");
}

async function getPromotionalCompanyId(
  request,
  getIdentity = requireSessionIdentity,
) {
  const routeCompanyId = parsePositiveInteger(
    request.params.companyId,
    "companyId",
  );
  const identity = await getIdentity(request);
  const sessionCompanyId = parsePositiveInteger(
    identity?.company?.id,
    "sessionCompanyId",
  );

  if (routeCompanyId !== sessionCompanyId) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "Company session is not allowed to access this company.",
    );
  }

  return sessionCompanyId;
}

app.http("listPromotionalCampaigns", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validatePromotionalCampaignListQuery(request.query);
    const result = await repository.listPromotionalCampaigns(
      companyId,
      filters,
    );
    return ok(result);
  }),
});

app.http("createPromotionalCampaign", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validatePromotionalCampaignPayload(await readJson(request));
    const campaign = await repository.createPromotionalCampaign(
      companyId,
      payload,
    );
    return created(campaign);
  }),
});

app.http("getPromotionalCampaign", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const [campaign, recipients] = await Promise.all([
      repository.getPromotionalCampaignById(companyId, campaignId),
      repository.listPromotionalCampaignRecipients(companyId, campaignId),
    ]);
    campaign.image = await repository.getActivePromotionalCampaignImage(
      companyId,
      campaignId,
    );
    return ok({ campaign, recipients });
  }),
});

app.http("updatePromotionalCampaign", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}",
  handler: handle(async (request) => {
    return ok(await updatePromotionalCampaignContent({ request }));
  }),
});

app.http("previewPromotionalCampaign", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/preview",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const [campaign, company, image] = await Promise.all([
      repository.getPromotionalCampaignById(companyId, campaignId),
      repository.getCompanySettings(companyId),
      repository.getActivePromotionalCampaignImage(companyId, campaignId),
    ]);
    campaign.image = image;
    await repository.updatePromotionalCampaignPreviewAt(companyId, campaignId);
    return ok(
      buildPreview(campaign, company, defaultPreviewCustomer, { request }),
    );
  }),
});

app.http("getPromotionalCampaignImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/image",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    await repository.getPromotionalCampaignById(companyId, campaignId);
    const image = await repository.getActivePromotionalCampaignImage(
      companyId,
      campaignId,
    );
    return ok({ image });
  }),
});

app.http("uploadPromotionalCampaignImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/image",
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const companyId = await getPromotionalCompanyId(
      request,
      async () => identity,
    );
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const campaign = await repository.getPromotionalCampaignById(
      companyId,
      campaignId,
    );

    if (!["draft", "ready"].includes(campaign.status)) {
      throw new ApiError(
        409,
        "PROMOTIONAL_CAMPAIGN_NOT_EDITABLE",
        "Promotional campaign image can only be changed before sending.",
      );
    }

    const config = getCampaignAssetConfig();
    const body = Buffer.from(await request.arrayBuffer());
    const file = parseCampaignImageMultipart(
      body,
      request.headers.get("content-type"),
    );
    const metadata = validateCampaignImageFile(file, {
      maxBytes: config.maxBytes,
      allowedMimeTypes: config.allowedMimeTypes,
    });
    const blobPath = buildCampaignImageBlobPath(
      companyId,
      campaignId,
      metadata.contentType,
    );

    await uploadCampaignImageBlob(blobPath, file.buffer, metadata.contentType, {
      config,
    });
    const image = await repository.replacePromotionalCampaignImage(
      companyId,
      campaignId,
      {
        blobContainer: config.container,
        blobPath,
        originalFileName: metadata.originalFileName,
        contentType: metadata.contentType,
        sizeBytes: metadata.size,
        checksumSha256: metadata.checksumSha256,
        altText: campaign.name,
      },
      {
        createdByUserId: identity.user.id,
        updatedByUserId: identity.user.id,
      },
    );

    return ok({ image });
  }),
});

app.http("deletePromotionalCampaignImage", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/image",
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const companyId = await getPromotionalCompanyId(
      request,
      async () => identity,
    );
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    await repository.getPromotionalCampaignById(companyId, campaignId);
    await repository.deletePromotionalCampaignImage(companyId, campaignId, {
      updatedByUserId: identity.user.id,
    });
    return ok({ deleted: true });
  }),
});

app.http("renderPromotionalCampaignImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "public/promotional-campaign-images/{publicId}",
  handler: handle(async (request) => {
    const publicId = String(request.params.publicId || "").trim();

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        publicId,
      )
    ) {
      throw new ApiError(
        404,
        "PROMOTIONAL_CAMPAIGN_IMAGE_NOT_FOUND",
        "Campaign image was not found.",
      );
    }

    const image =
      await repository.getPromotionalCampaignImageByPublicId(publicId);
    const buffer = await downloadCampaignImageBlob(image.blobPath, {
      config: getCampaignAssetConfig(),
    });

    return {
      status: 200,
      body: buffer,
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Length": String(buffer.length),
        "Content-Type": image.contentType,
      },
    };
  }),
});

app.http("listPromotionalRecipients", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-recipients",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validatePromotionalRecipientQuery(request.query);
    const result = await repository.listPromotionalRecipients(
      companyId,
      filters,
    );
    return ok(result);
  }),
});

app.http("selectPromotionalCampaignRecipients", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/recipients",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const payload = validatePromotionalRecipientSelectionPayload(
      await readJson(request),
    );
    const result = await repository.replacePromotionalCampaignRecipients(
      companyId,
      campaignId,
      payload.customerIds,
    );
    return ok(result);
  }),
});

app.http("sendPromotionalCampaign", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/send",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const payload = validatePromotionalSendPayload(await readJson(request));

    if (!isPromotionalSendEnabled()) {
      throw new ApiError(
        423,
        "PROMOTIONAL_SEND_BLOCKED",
        "Promotional sending is blocked by feature flag.",
      );
    }

    const emailConfig = notifier.getEmailConfig();
    if (!emailConfig.enabled) {
      throw new ApiError(
        503,
        "PROMOTIONAL_EMAIL_NOT_CONFIGURED",
        "Promotional email sender is not configured.",
      );
    }

    const result = await sendPromotionalCampaignToRecipients({
      companyId,
      campaignId,
      customerIds: payload.customerIds,
      emailConfig,
      request,
    });
    return ok(result);
  }),
});

app.http("unsubscribePromotionalCustomer", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-unsubscribe",
  handler: handle(async (request) => {
    const companyId = await getPromotionalCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validatePromotionalUnsubscribePayload(
      await readJson(request),
    );
    const result = await repository.unsubscribePromotionalCustomer(
      companyId,
      payload,
    );
    return ok(result);
  }),
});

module.exports = {
  buildPromotionalEmail,
  buildPreview,
  getPromotionalCompanyId,
  getPromotionalRecipientSkipReason,
  sendPromotionalCampaignToRecipients,
  updatePromotionalCampaignContent,
};
