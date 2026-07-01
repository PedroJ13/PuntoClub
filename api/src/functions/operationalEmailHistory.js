const { app } = require("@azure/functions");
const { ApiError } = require("../lib/errors");
const { handle, ok } = require("../lib/http");
const {
  parsePositiveInteger,
  validateOperationalEmailHistoryQuery,
} = require("../lib/validators");
const repository = require("../lib/repository");
const { requireSessionIdentity } = require("./companyAuth");

async function getOperationalEmailHistoryCompanyId(
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

app.http("listOperationalEmailHistory", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/operational-email-history",
  handler: handle(async (request) => {
    const companyId = await getOperationalEmailHistoryCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validateOperationalEmailHistoryQuery(request.query);
    const result = await repository.listOperationalEmailHistory(
      companyId,
      filters,
    );
    return ok(result);
  }),
});

module.exports = {
  getOperationalEmailHistoryCompanyId,
};
