const { app } = require("@azure/functions");
const { ApiError } = require("../lib/errors");
const { handle, ok } = require("../lib/http");
const { parsePositiveInteger } = require("../lib/validators");
const notifier = require("../lib/notifier");
const repository = require("../lib/repository");
const { requireSessionIdentity } = require("./companyAuth");

function isPromotionalSendEnabled(env = process.env) {
  if (notifier.isEmailSendDisabled(env)) {
    return false;
  }

  return (
    String(env.PROMOTIONAL_EMAIL_SEND_ENABLED || "").toLowerCase() === "true"
  );
}

async function getCommunicationsSummaryCompanyId(
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

async function readCommunicationsSummary({
  request,
  repositoryAdapter = repository,
  getIdentity = requireSessionIdentity,
  env = process.env,
}) {
  const companyId = await getCommunicationsSummaryCompanyId(
    request,
    getIdentity,
  );
  await repositoryAdapter.ensureActiveCompany(companyId);
  return repositoryAdapter.getCommunicationsSummary(companyId, {
    promotionalSendEnabled: isPromotionalSendEnabled(env),
  });
}

app.http("getCommunicationsSummary", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/communications/summary",
  handler: handle(async (request) => {
    return ok(await readCommunicationsSummary({ request }));
  }),
});

module.exports = {
  getCommunicationsSummaryCompanyId,
  isPromotionalSendEnabled,
  readCommunicationsSummary,
};
