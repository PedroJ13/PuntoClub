const { app } = require("@azure/functions");
const { ApiError } = require("../lib/errors");
const { created, getCompanyId, handle, ok, readJson } = require("../lib/http");
const {
  parsePositiveInteger,
  validatePromotionalCampaignListQuery,
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientQuery,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalUnsubscribePayload,
} = require("../lib/validators");
const repository = require("../lib/repository");

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

function buildPreview(campaign, company, customer = defaultPreviewCustomer) {
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
    sendBlocked: !isPromotionalSendEnabled(),
    blockReason: isPromotionalSendEnabled() ? null : "feature_flag_disabled",
  };
}

async function getCampaignId(request) {
  return parsePositiveInteger(request.params.campaignId, "campaignId");
}

app.http("listPromotionalCampaigns", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
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
    const companyId = await getCompanyId(request);
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
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const [campaign, recipients] = await Promise.all([
      repository.getPromotionalCampaignById(companyId, campaignId),
      repository.listPromotionalCampaignRecipients(companyId, campaignId),
    ]);
    return ok({ campaign, recipients });
  }),
});

app.http("previewPromotionalCampaign", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-campaigns/{campaignId}/preview",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const [campaign, company] = await Promise.all([
      repository.getPromotionalCampaignById(companyId, campaignId),
      repository.getCompanySettings(companyId),
    ]);
    await repository.updatePromotionalCampaignPreviewAt(companyId, campaignId);
    return ok(buildPreview(campaign, company));
  }),
});

app.http("listPromotionalRecipients", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-recipients",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
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
    const companyId = await getCompanyId(request);
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
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const campaignId = await getCampaignId(request);
    const campaign = await repository.getPromotionalCampaignById(
      companyId,
      campaignId,
    );

    if (!isPromotionalSendEnabled()) {
      throw new ApiError(
        423,
        "PROMOTIONAL_SEND_BLOCKED",
        "Promotional sending is blocked by feature flag.",
      );
    }

    if (campaign.recipientCount > campaign.recipientLimit) {
      throw new ApiError(
        409,
        "PROMOTIONAL_RECIPIENT_LIMIT_EXCEEDED",
        "Promotional recipient limit exceeded.",
      );
    }

    throw new ApiError(
      423,
      "PROMOTIONAL_SEND_BLOCKED",
      "Promotional sending requires an explicit release decision before ACS is called.",
    );
  }),
});

app.http("unsubscribePromotionalCustomer", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/promotional-unsubscribe",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
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
