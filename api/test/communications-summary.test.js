const test = require("node:test");
const assert = require("node:assert/strict");

const { ApiError } = require("../src/lib/errors");
const {
  getCommunicationsSummaryCompanyId,
  isPromotionalSendEnabled,
  readCommunicationsSummary,
} = require("../src/functions/communicationsSummary");

function makeRequest({ companyId = "10" } = {}) {
  return {
    params: { companyId },
  };
}

test("communications summary requires authenticated company session", async () => {
  await assert.rejects(
    () =>
      getCommunicationsSummaryCompanyId(makeRequest(), () => {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
      }),
    (error) => error instanceof ApiError && error.status === 401,
  );
});

test("communications summary rejects route company different from session", async () => {
  await assert.rejects(
    () =>
      getCommunicationsSummaryCompanyId(
        makeRequest({ companyId: "11" }),
        async () => ({ company: { id: "10" } }),
      ),
    (error) =>
      error instanceof ApiError &&
      error.status === 403 &&
      error.code === "FORBIDDEN",
  );
});

test("communications summary uses session company and promotional flag", async () => {
  const calls = [];
  const summary = await readCommunicationsSummary({
    request: makeRequest({ companyId: "8" }),
    getIdentity: async () => ({ company: { id: "8" } }),
    env: { PROMOTIONAL_EMAIL_SEND_ENABLED: "true" },
    repositoryAdapter: {
      async ensureActiveCompany(companyId) {
        calls.push(["ensureActiveCompany", companyId]);
      },
      async getCommunicationsSummary(companyId, options) {
        calls.push(["getCommunicationsSummary", companyId, options]);
        return {
          operationalActiveCount: 3,
          promotionalSubscribedCount: 12,
          promotionalUnsubscribedCount: 2,
          promotionalSendStatus: options.promotionalSendEnabled
            ? "active"
            : "paused",
          promotionalSendStatusLabel: options.promotionalSendEnabled
            ? "Activas"
            : "Pausadas",
          campaignDraftCount: 1,
          campaignSentCount: 4,
          generatedAt: "2026-07-07T00:00:00.000Z",
        };
      },
    },
  });

  assert.deepEqual(calls, [
    ["ensureActiveCompany", 8],
    ["getCommunicationsSummary", 8, { promotionalSendEnabled: true }],
  ]);
  assert.equal(summary.promotionalSendStatus, "active");
});

test("promotional send flag is disabled unless explicitly true", () => {
  assert.equal(isPromotionalSendEnabled({}), false);
  assert.equal(
    isPromotionalSendEnabled({ PROMOTIONAL_EMAIL_SEND_ENABLED: "false" }),
    false,
  );
  assert.equal(
    isPromotionalSendEnabled({ PROMOTIONAL_EMAIL_SEND_ENABLED: "TRUE" }),
    true,
  );
  assert.equal(
    isPromotionalSendEnabled({
      EMAIL_SEND_MODE: "disabled",
      PROMOTIONAL_EMAIL_SEND_ENABLED: "true",
    }),
    false,
  );
});
