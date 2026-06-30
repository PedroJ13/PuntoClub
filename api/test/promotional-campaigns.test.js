const test = require("node:test");
const assert = require("node:assert/strict");

const { ApiError, mapSqlError } = require("../src/lib/errors");
const {
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalUnsubscribePayload,
} = require("../src/lib/validators");
const {
  getPromotionalCompanyId,
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
