const test = require("node:test");
const assert = require("node:assert/strict");

const { ApiError } = require("../src/lib/errors");
const {
  validateOperationalEmailHistoryQuery,
} = require("../src/lib/validators");
const {
  getOperationalEmailHistoryCompanyId,
} = require("../src/functions/operationalEmailHistory");

function makeRequest({ companyId = "10", query = new Map() } = {}) {
  return {
    params: { companyId },
    query,
  };
}

test("operational email history query accepts supported filters", () => {
  const filters = validateOperationalEmailHistoryQuery(
    new Map([
      ["from", "2026-06-01"],
      ["to", "2026-06-30"],
      ["type", "welcome"],
      ["status", "sent"],
      ["search", "maria@example.com"],
      ["limit", "50"],
    ]),
  );

  assert.deepEqual(filters, {
    from: "2026-06-01",
    to: "2026-06-30",
    type: "welcome",
    status: "sent",
    search: "maria@example.com",
    limit: 50,
  });
});

test("operational email history query rejects invalid type and range", () => {
  assert.throws(
    () =>
      validateOperationalEmailHistoryQuery(
        new Map([
          ["from", "2026-06-30"],
          ["to", "2026-06-01"],
          ["type", "promotion"],
          ["status", "sent"],
        ]),
      ),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
});

test("operational email history requires authenticated company session", async () => {
  await assert.rejects(
    () =>
      getOperationalEmailHistoryCompanyId(makeRequest(), () => {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
      }),
    (error) => error instanceof ApiError && error.status === 401,
  );
});

test("operational email history rejects route company different from session", async () => {
  await assert.rejects(
    () =>
      getOperationalEmailHistoryCompanyId(
        makeRequest({ companyId: "11" }),
        async () => ({ company: { id: "10" } }),
      ),
    (error) =>
      error instanceof ApiError &&
      error.status === 403 &&
      error.code === "FORBIDDEN",
  );
});

test("operational email history uses route company when it matches session", async () => {
  const companyId = await getOperationalEmailHistoryCompanyId(
    makeRequest({ companyId: "10" }),
    async () => ({ company: { id: "10" } }),
  );

  assert.equal(companyId, 10);
});
