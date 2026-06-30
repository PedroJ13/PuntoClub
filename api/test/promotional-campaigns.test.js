const test = require("node:test");
const assert = require("node:assert/strict");

const { ApiError } = require("../src/lib/errors");
const {
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalUnsubscribePayload,
} = require("../src/lib/validators");

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
