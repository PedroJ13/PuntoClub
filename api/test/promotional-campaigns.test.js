const test = require("node:test");
const assert = require("node:assert/strict");

const { ApiError, mapSqlError } = require("../src/lib/errors");
const {
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalSendPayload,
  validatePromotionalUnsubscribePayload,
} = require("../src/lib/validators");
const {
  buildPreview,
  buildPromotionalEmail,
  getPromotionalRecipientSkipReason,
  getPromotionalCompanyId,
  sendPromotionalCampaignToRecipients,
  updatePromotionalCampaignContent,
} = require("../src/functions/promotionalCampaigns");
const repository = require("../src/lib/repository");

function makePromotionRequest({ companyId = "10" } = {}) {
  return {
    params: { companyId },
  };
}

function makeCampaignUpdateRequest({
  companyId = "10",
  campaignId = "5",
  body = {},
} = {}) {
  return {
    params: { companyId, campaignId },
    async json() {
      return body;
    },
  };
}

test("promotional campaign payload normalizes MVP draft fields", () => {
  const payload = validatePromotionalCampaignPayload({
    name: " Promo frecuente ",
    subject: " Beneficio para clientes ",
    bodyText: "Hola {{customer.name}}, tienes una promo.",
    includePoints: true,
  });

  assert.deepEqual(payload, {
    name: "Promo frecuente",
    subject: "Beneficio para clientes",
    bodyText: "Hola {{customer.name}}, tienes una promo.",
    includePoints: true,
  });
});

test("promotional recipient selection enforces five-recipient MVP limit", () => {
  assert.throws(
    () =>
      validatePromotionalRecipientSelectionPayload({
        customerIds: [1, 2, 3, 4, 5, 6],
      }),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
});

test("promotional recipient selection rejects duplicates", () => {
  assert.throws(
    () =>
      validatePromotionalRecipientSelectionPayload({ customerIds: [10, 10] }),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
});

test("promotional unsubscribe keeps optional campaign context", () => {
  const payload = validatePromotionalUnsubscribePayload({
    customerId: "10",
    campaignId: "20",
    recipientId: "30",
    reason: "No quiero promociones",
  });

  assert.deepEqual(payload, {
    customerId: 10,
    campaignId: 20,
    recipientId: 30,
    reason: "No quiero promociones",
  });
});

test("promotional send requires explicit confirmation payload", () => {
  assert.deepEqual(
    validatePromotionalSendPayload({ confirmSend: true, customerIds: [10] }),
    {
      confirmSend: true,
      customerIds: [10],
    },
  );

  assert.throws(
    () =>
      validatePromotionalSendPayload({
        confirmSend: false,
        customerIds: [10],
      }),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
  assert.throws(
    () => validatePromotionalSendPayload({ confirmSend: true }),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
});

test("promotional endpoints require an authenticated company session", async () => {
  await assert.rejects(
    () =>
      getPromotionalCompanyId(makePromotionRequest({ companyId: "10" }), () => {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
      }),
    (error) => error instanceof ApiError && error.status === 401,
  );
});

test("promotional endpoints reject route company different from session company", async () => {
  await assert.rejects(
    () =>
      getPromotionalCompanyId(
        makePromotionRequest({ companyId: "11" }),
        async () => ({
          company: { id: "10" },
        }),
      ),
    (error) =>
      error instanceof ApiError &&
      error.status === 403 &&
      error.code === "FORBIDDEN",
  );
});

test("promotional endpoints use route company only when it matches session company", async () => {
  const companyId = await getPromotionalCompanyId(
    makePromotionRequest({ companyId: "10" }),
    async () => ({ company: { id: "10" } }),
  );

  assert.equal(companyId, 10);
});

test("promotional campaign update changes editable content for authenticated company", async () => {
  const calls = [];
  const fakeRepository = {
    async ensureActiveCompany(companyId) {
      calls.push(["ensureActiveCompany", companyId]);
    },
    async getPromotionalCampaignById(companyId, campaignId) {
      calls.push(["getPromotionalCampaignById", companyId, campaignId]);
      return {
        id: String(campaignId),
        companyId: String(companyId),
        name: "Anterior",
        subject: "Asunto anterior",
        bodyText: "Mensaje anterior",
        includePoints: false,
        status: "draft",
      };
    },
    async updatePromotionalCampaign(companyId, campaignId, payload) {
      calls.push(["updatePromotionalCampaign", companyId, campaignId, payload]);
      return {
        id: String(campaignId),
        companyId: String(companyId),
        ...payload,
        status: "draft",
      };
    },
    async getActivePromotionalCampaignImage(companyId, campaignId) {
      calls.push(["getActivePromotionalCampaignImage", companyId, campaignId]);
      return null;
    },
  };

  const result = await updatePromotionalCampaignContent({
    request: makeCampaignUpdateRequest({
      body: {
        name: "Nueva promo",
        subject: "Nuevo asunto",
        bodyText: "Nuevo mensaje",
        includePoints: true,
      },
    }),
    repositoryAdapter: fakeRepository,
    getIdentity: async () => ({ company: { id: "10" } }),
  });

  assert.equal(result.campaign.name, "Nueva promo");
  assert.equal(result.campaign.subject, "Nuevo asunto");
  assert.equal(result.campaign.bodyText, "Nuevo mensaje");
  assert.equal(result.campaign.includePoints, true);
  assert.equal(result.campaign.image, null);
  assert.deepEqual(calls[0], ["ensureActiveCompany", 10]);
  assert.equal(calls[2][0], "updatePromotionalCampaign");
});

test("promotional campaign update rejects another company session", async () => {
  await assert.rejects(
    () =>
      updatePromotionalCampaignContent({
        request: makeCampaignUpdateRequest({
          companyId: "11",
          body: {
            name: "Nueva promo",
            subject: "Nuevo asunto",
            bodyText: "Nuevo mensaje",
            includePoints: true,
          },
        }),
        repositoryAdapter: {},
        getIdentity: async () => ({ company: { id: "10" } }),
      }),
    (error) =>
      error instanceof ApiError &&
      error.status === 403 &&
      error.code === "FORBIDDEN",
  );
});

test("promotional campaign update rejects sent campaigns", async () => {
  const fakeRepository = {
    async ensureActiveCompany() {},
    async getPromotionalCampaignById(companyId, campaignId) {
      return {
        id: String(campaignId),
        companyId: String(companyId),
        name: "Enviada",
        subject: "Asunto",
        bodyText: "Mensaje",
        includePoints: true,
        status: "sent",
      };
    },
  };

  await assert.rejects(
    () =>
      updatePromotionalCampaignContent({
        request: makeCampaignUpdateRequest({
          body: {
            name: "Nueva promo",
            subject: "Nuevo asunto",
            bodyText: "Nuevo mensaje",
            includePoints: true,
          },
        }),
        repositoryAdapter: fakeRepository,
        getIdentity: async () => ({ company: { id: "10" } }),
      }),
    (error) =>
      error instanceof ApiError &&
      error.status === 409 &&
      error.code === "PROMOTIONAL_CAMPAIGN_NOT_EDITABLE",
  );
});

test("promotional email renders only the selected recipient message", () => {
  const previousPublicApiBaseUrl = process.env.PUBLIC_API_BASE_URL;
  const previousAppPublicBaseUrl = process.env.APP_PUBLIC_BASE_URL;

  try {
    delete process.env.PUBLIC_API_BASE_URL;
    process.env.APP_PUBLIC_BASE_URL = "https://puntoclub.example.test";

    const email = buildPromotionalEmail(
      {
        subject: "Hola {{customer.name}}",
        bodyText: "Tienes una promo en {{company.name}}.",
        includePoints: true,
        image: {
          imageUrl:
            "/api/public/promotional-campaign-images/11111111-1111-4111-8111-111111111111",
          altText: "Promo frecuente",
        },
      },
      { name: "Cafe Centro" },
      {
        customerName: "Ana",
        recipientEmail: "ana@example.com",
        pointsBalanceSnapshot: 42,
      },
      {
        senderAddress: "DoNotReply@example.com",
        senderDisplayName: "Punto Club",
      },
    );

    assert.equal(email.to.length, 1);
    assert.equal(email.to[0].address, "ana@example.com");
    assert.equal(email.subject, "Hola Ana");
    assert.match(email.plainText, /42 puntos/);
    assert.match(email.html, /<img/);
    assert.match(email.html, /Promo frecuente/);
    assert.match(
      email.html,
      /https:\/\/puntoclub\.example\.test\/api\/public\/promotional-campaign-images\/11111111-1111-4111-8111-111111111111/,
    );
  } finally {
    if (previousPublicApiBaseUrl === undefined) {
      delete process.env.PUBLIC_API_BASE_URL;
    } else {
      process.env.PUBLIC_API_BASE_URL = previousPublicApiBaseUrl;
    }
    if (previousAppPublicBaseUrl === undefined) {
      delete process.env.APP_PUBLIC_BASE_URL;
    } else {
      process.env.APP_PUBLIC_BASE_URL = previousAppPublicBaseUrl;
    }
  }
});

test("promotional preview includes active campaign image url", () => {
  const preview = buildPreview(
    {
      id: "5",
      name: "Promo con imagen",
      subject: "Hola {{customer.name}}",
      bodyText: "Promo de {{company.name}}.",
      includePoints: false,
      image: {
        fileName: "promo.webp",
        altText: "Promo con imagen",
        imageUrl:
          "/api/public/promotional-campaign-images/22222222-2222-4222-8222-222222222222",
      },
    },
    { name: "Cafe Centro" },
    { name: "Ana", email: "ana@example.com", pointsBalance: 42 },
  );

  assert.deepEqual(preview.image, {
    fileName: "promo.webp",
    altText: "Promo con imagen",
    imageUrl:
      "/api/public/promotional-campaign-images/22222222-2222-4222-8222-222222222222",
  });
});

test("promotional send skips unsubscribed recipients and sends selected subscribed recipients", async () => {
  const sentMessages = [];
  const savedResults = [];
  const selectedPayloads = [];
  const fakeRepository = {
    async replacePromotionalCampaignRecipients(
      companyId,
      campaignId,
      customerIds,
    ) {
      selectedPayloads.push({ companyId, campaignId, customerIds });
      return { recipients: [], skipped: [] };
    },
    async beginPromotionalCampaignSend() {
      return {
        id: "5",
        name: "Promo controlada",
        subject: "Promo {{customer.name}}",
        bodyText: "Hola {{customer.name}}, promo de {{company.name}}.",
        includePoints: true,
      };
    },
    async getActivePromotionalCampaignImage(companyId, campaignId) {
      assert.equal(companyId, 10);
      assert.equal(campaignId, 5);
      return {
        fileName: "promo.webp",
        altText: "Promo controlada",
        imageUrl:
          "/api/public/promotional-campaign-images/33333333-3333-4333-8333-333333333333",
      };
    },
    async getCompanySettings() {
      return { id: "10", name: "Cafe Centro" };
    },
    async listPendingPromotionalCampaignRecipientsForSend() {
      return [
        {
          id: "100",
          customerName: "Ana",
          recipientEmail: "ana@example.com",
          pointsBalanceSnapshot: 10,
          currentPreferenceStatus: "subscribed",
          status: "pending",
        },
        {
          id: "101",
          customerName: "Luis",
          recipientEmail: "luis@example.com",
          pointsBalanceSnapshot: 20,
          currentPreferenceStatus: "unsubscribed",
          status: "pending",
        },
      ];
    },
    async recordPromotionalCampaignRecipientResult(
      companyId,
      campaignId,
      recipientId,
      result,
    ) {
      savedResults.push({ companyId, campaignId, recipientId, result });
      return { id: recipientId, status: result.status };
    },
    async completePromotionalCampaignSend() {
      return { id: "5", status: "sent" };
    },
  };

  const result = await sendPromotionalCampaignToRecipients({
    companyId: 10,
    campaignId: 5,
    customerIds: [100, 101],
    emailConfig: {
      senderAddress: "DoNotReply@example.com",
      senderDisplayName: "Punto Club",
    },
    request: {
      url: "https://api.puntoclubcr.com/api/companies/10/promotional-campaigns/5/send",
    },
    repositoryAdapter: fakeRepository,
    async sendEmail(message) {
      sentMessages.push(message);
      return { provider: "acs-email", status: "sent", id: "message-1" };
    },
  });

  assert.deepEqual(selectedPayloads, [
    { companyId: 10, campaignId: 5, customerIds: [100, 101] },
  ]);
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].to[0].address, "ana@example.com");
  assert.match(
    sentMessages[0].html,
    /https:\/\/api\.puntoclubcr\.com\/api\/public\/promotional-campaign-images\/33333333-3333-4333-8333-333333333333/,
  );
  assert.doesNotMatch(sentMessages[0].html, /src="\/api\/public\//);
  assert.deepEqual(result.summary, {
    selected: 2,
    sent: 1,
    failed: 0,
    skipped: 1,
  });
  assert.equal(savedResults[1].result.status, "skipped");
  assert.equal(savedResults[1].result.skipReason, "unsubscribed");
});

test("promotional send blocks duplicate selected recipients before sending email", async () => {
  let sendEmailCalled = false;
  const fakeRepository = {
    async replacePromotionalCampaignRecipients() {
      throw new ApiError(
        409,
        "PROMOTIONAL_RECIPIENT_ALREADY_SELECTED",
        "Promotional recipient is already selected for this campaign.",
      );
    },
  };

  await assert.rejects(
    () =>
      sendPromotionalCampaignToRecipients({
        companyId: 10,
        campaignId: 5,
        customerIds: [100],
        emailConfig: {
          senderAddress: "DoNotReply@example.com",
          senderDisplayName: "Punto Club",
        },
        repositoryAdapter: fakeRepository,
        async sendEmail() {
          sendEmailCalled = true;
          return { provider: "acs-email", status: "sent", id: "message-1" };
        },
      }),
    (error) =>
      error instanceof ApiError &&
      error.status === 409 &&
      error.code === "PROMOTIONAL_RECIPIENT_ALREADY_SELECTED",
  );

  assert.equal(sendEmailCalled, false);
});

test("promotional send default repository adapter exports selected-recipient operations", () => {
  const requiredMethods = [
    "replacePromotionalCampaignRecipients",
    "beginPromotionalCampaignSend",
    "getCompanySettings",
    "listPendingPromotionalCampaignRecipientsForSend",
    "recordPromotionalCampaignRecipientResult",
    "completePromotionalCampaignSend",
    "getActivePromotionalCampaignImage",
  ];

  requiredMethods.forEach((methodName) => {
    assert.equal(
      typeof repository[methodName],
      "function",
      `${methodName} should be exported by repository`,
    );
  });
});

test("promotional recipient skip reason respects current preference and email", () => {
  assert.equal(
    getPromotionalRecipientSkipReason({
      recipientEmail: "cliente@example.com",
      currentPreferenceStatus: "suppressed",
    }),
    "suppressed",
  );
  assert.equal(
    getPromotionalRecipientSkipReason({
      recipientEmail: "",
      currentPreferenceStatus: "subscribed",
    }),
    "missing_email",
  );
  assert.equal(
    getPromotionalRecipientSkipReason({
      recipientEmail: "cliente@example.com",
      currentPreferenceStatus: "subscribed",
    }),
    null,
  );
});

test("promotional recipient duplicate SQL error maps to controlled conflict", () => {
  const error = mapSqlError({
    number: 2627,
    message:
      "Violation of UNIQUE KEY constraint 'UX_PromotionalCampaignRecipients_campaign_customer'.",
  });

  assert.equal(error.status, 409);
  assert.equal(error.code, "PROMOTIONAL_RECIPIENT_ALREADY_SELECTED");
});

test("promotional recipient customer FK error maps to controlled not found", () => {
  const error = mapSqlError({
    number: 547,
    message:
      "The INSERT statement conflicted with the FOREIGN KEY constraint 'FK_PromotionalCampaignRecipients_Customers'.",
  });

  assert.equal(error.status, 404);
  assert.equal(error.code, "CUSTOMER_NOT_FOUND");
});
