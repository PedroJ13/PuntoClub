const { ApiError } = require('./errors');

function getCompanyRegistrationReviewActorLabel(env = process.env) {
  const actorLabel = env.COMPANY_REGISTRATION_REVIEW_ACTOR_LABEL;
  return actorLabel && actorLabel.trim() ? actorLabel.trim() : 'internal';
}

function assertCompanyRegistrationReviewEnabled(env = process.env) {
  if (env.COMPANY_REGISTRATION_REVIEW_ENABLED !== 'true') {
    throw new ApiError(403, 'FORBIDDEN', 'Company registration review is not enabled.');
  }
}

function formatCompanyRegistrationCreatedResponse(registrationRequest) {
  return {
    id: registrationRequest.id,
    companyName: registrationRequest.companyName,
    companyEmail: registrationRequest.companyEmail,
    companyAddress: registrationRequest.companyAddress,
    status: registrationRequest.status,
    createdAt: registrationRequest.createdAt,
    message: 'Company registration request received.'
  };
}

function formatCompanyRegistrationRejectedResponse(registrationRequest) {
  return {
    id: registrationRequest.id,
    status: registrationRequest.status,
    reviewedAt: registrationRequest.reviewedAt
  };
}

function formatCompanyRegistrationApprovedAuditEvent(result, context) {
  return {
    companyId: result.company.id,
    eventType: 'company.registration.approved',
    entityType: 'company_registration_request',
    entityId: result.id,
    actorLabel: result.reviewedByLabel,
    metadata: {
      approvedCompanyId: result.company.id,
      requestId: context && context.invocationId ? context.invocationId : null
    }
  };
}

module.exports = {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
};
