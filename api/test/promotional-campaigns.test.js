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
  buildPromotionalEmail,
  getPromotionalRecipientSkipReason,
  getPromotionalCompanyId,
  sendPromotionalCampaignToRecipients,
} = require("../src/functions/promotionalCampaigns");

function makePromotionRequest({ companyId = "10" } = {}) {
  return {
    params: { companyId },
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
  assert.deepEqual(validatePromotionalSendPayload({ confirmSend: true }), {
    confirmSend: true,
  });

  assert.throws(
    () => validatePromotionalSendPayload({ confirmSend: false }),
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

test("promotional email renders only the selected recipient message", () => {
  const email = buildPromotionalEmail(
    {
      subject: "Hola {{customer.name}}",
      bodyText: "Tienes una promo en {{company.name}}.",
      includePoints: true,
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
});

test("promotional send skips unsubscribed recipients and sends selected subscribed recipients", async () => {
  const sentMessages = [];
  const savedResults = [];
  const fakeRepository = {
    async beginPromotionalCampaignSend() {
      return {
        id: "5",
        name: "Promo controlada",
        subject: "Promo {{customer.name}}",
        bodyText: "Hola {{customer.name}}, promo de {{company.name}}.",
        includePoints: true,
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
    emailConfig: {
      senderAddress: "DoNotReply@example.com",
      senderDisplayName: "Punto Club",
    },
    repositoryAdapter: fakeRepository,
    async sendEmail(message) {
      sentMessages.push(message);
      return { provider: "acs-email", status: "sent", id: "message-1" };
    },
  });

  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].to[0].address, "ana@example.com");
  assert.deepEqual(result.summary, {
    selected: 2,
    sent: 1,
    failed: 0,
    skipped: 1,
  });
  assert.equal(savedResults[1].result.status, "skipped");
  assert.equal(savedResults[1].result.skipReason, "unsubscribed");
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
