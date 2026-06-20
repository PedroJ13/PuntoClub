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
    contactEmail: registrationRequest.contactEmail,
    companyAddress: registrationRequest.companyAddress,
    requestedLogo: registrationRequest.requestedLogo,
    status: registrationRequest.status,
    createdAt: registrationRequest.createdAt,
    message: 'Solicitud recibida.'
  };
}

function formatCompanyRegistrationRejectedResponse(registrationRequest) {
  return {
    id: registrationRequest.id,
    status: registrationRequest.status,
    reviewedAt: registrationRequest.reviewedAt
  };
}

function formatCompanyRegistrationApprovedResponse(result) {
  const response = {
    id: result.id,
    companyName: result.companyName,
    companyEmail: result.companyEmail,
    companyPhone: result.companyPhone,
    companyAddress: result.companyAddress,
    contactName: result.contactName,
    contactEmail: result.contactEmail,
    contactPhone: result.contactPhone,
    requestedLogo: result.requestedLogo,
    status: result.status,
    reviewedAt: result.reviewedAt,
    reviewedByLabel: result.reviewedByLabel,
    reviewNote: result.reviewNote,
    approvedCompanyId: result.approvedCompanyId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    company: result.company
  };

  if (result.invitation) {
    response.invitation = {
      id: result.invitation.id,
      companyId: result.invitation.companyId,
      email: result.invitation.email,
      role: result.invitation.role,
      status: result.invitation.status,
      expiresAt: result.invitation.expiresAt,
      createdAt: result.invitation.createdAt
    };
  }

  return response;
}

function formatCompanyRegistrationRequestListItem(registrationRequest) {
  const item = {
    id: registrationRequest.id,
    companyName: registrationRequest.companyName,
    companyEmail: registrationRequest.companyEmail,
    companyPhone: registrationRequest.companyPhone,
    companyAddress: registrationRequest.companyAddress,
    contactName: registrationRequest.contactName,
    contactEmail: registrationRequest.contactEmail,
    contactPhone: registrationRequest.contactPhone,
    requestedLogo: registrationRequest.requestedLogo,
    status: registrationRequest.status,
    reviewedAt: registrationRequest.reviewedAt,
    reviewedByLabel: registrationRequest.reviewedByLabel,
    reviewNote: registrationRequest.reviewNote,
    approvedCompanyId: registrationRequest.approvedCompanyId,
    createdAt: registrationRequest.createdAt,
    updatedAt: registrationRequest.updatedAt,
    invitation: null
  };

  if (registrationRequest.invitation) {
    item.invitation = {
      id: registrationRequest.invitation.id,
      companyId: registrationRequest.invitation.companyId,
      email: registrationRequest.invitation.email,
      role: registrationRequest.invitation.role,
      status: registrationRequest.invitation.status,
      expiresAt: registrationRequest.invitation.expiresAt,
      acceptedAt: registrationRequest.invitation.acceptedAt,
      revokedAt: registrationRequest.invitation.revokedAt,
      createdAt: registrationRequest.invitation.createdAt
    };
  }

  return item;
}

function formatCompanyRegistrationRequestListResponse(result) {
  return {
    status: result.status,
    limit: result.limit,
    items: result.items.map(formatCompanyRegistrationRequestListItem)
  };
}

function formatCompanyRegistrationLogoResponse(buffer, logo) {
  const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer || '');

  return {
    status: 200,
    body,
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Length': String(body.length),
      'Content-Type': logo.contentType,
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }
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
  formatCompanyRegistrationApprovedResponse,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationLogoResponse,
  formatCompanyRegistrationRequestListItem,
  formatCompanyRegistrationRequestListResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
};
