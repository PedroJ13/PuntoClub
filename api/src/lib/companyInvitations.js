const crypto = require('node:crypto');
const { ApiError, validationError } = require('./errors');

const tokenByteLength = 32;
const tokenPattern = /^[A-Za-z0-9_-]{32,512}$/;

function assertCompanyInvitationManagementEnabled(env = process.env) {
  if (env.COMPANY_INVITATION_MANAGEMENT_ENABLED !== 'true') {
    throw new ApiError(403, 'FORBIDDEN', 'Company invitation management is not enabled.');
  }
}

function getCompanyInvitationActorLabel(env = process.env) {
  const actorLabel = env.COMPANY_INVITATION_ACTOR_LABEL || env.COMPANY_REGISTRATION_REVIEW_ACTOR_LABEL;
  return actorLabel && actorLabel.trim() ? actorLabel.trim() : 'internal';
}

function generateInvitationToken() {
  return crypto.randomBytes(tokenByteLength).toString('base64url');
}

function validateInvitationToken(token) {
  if (typeof token !== 'string' || !tokenPattern.test(token.trim())) {
    throw validationError([{ field: 'token', message: 'token is required and must be a valid invitation token.' }]);
  }

  return token.trim();
}

function hashInvitationToken(token) {
  return crypto.createHash('sha256').update(validateInvitationToken(token), 'utf8').digest();
}

function addDays(date, days) {
  return new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
}

function getInvitationExpiresAt(now = new Date(), env = process.env) {
  const days = Number(env.COMPANY_INVITATION_EXPIRES_DAYS || 7);
  const safeDays = Number.isInteger(days) && days > 0 && days <= 30 ? days : 7;
  return addDays(now, safeDays);
}

function formatCompanyInvitationCreatedResponse(invitation) {
  return {
    id: invitation.id,
    companyId: invitation.companyId,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt
  };
}

function formatCompanyInvitationResentResponse(invitation, now = new Date()) {
  return {
    id: invitation.id,
    status: invitation.status,
    email: invitation.email,
    expiresAt: invitation.expiresAt,
    resentAt: now.toISOString()
  };
}

function formatCompanyInvitationValidation(invitation, now = new Date()) {
  if (!invitation) {
    return { valid: false, reason: 'invalid' };
  }

  if (invitation.status === 'accepted') {
    return { valid: false, reason: 'accepted' };
  }

  if (invitation.status === 'revoked') {
    return { valid: false, reason: 'revoked' };
  }

  if (invitation.status === 'expired' || new Date(invitation.expiresAt) < now) {
    return { valid: false, reason: 'expired' };
  }

  if (invitation.status !== 'pending') {
    return { valid: false, reason: 'invalid' };
  }

  return {
    valid: true,
    invitationId: invitation.id,
    companyId: invitation.companyId,
    companyName: invitation.companyName,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt
  };
}

function formatCompanyInvitationCreatedAuditEvent(invitation, context) {
  return {
    companyId: invitation.companyId,
    eventType: 'company.invitation.created',
    entityType: 'company_invitation',
    entityId: invitation.id,
    actorLabel: invitation.createdByLabel,
    metadata: {
      role: invitation.role,
      requestId: context && context.invocationId ? context.invocationId : null
    }
  };
}

module.exports = {
  assertCompanyInvitationManagementEnabled,
  formatCompanyInvitationCreatedAuditEvent,
  formatCompanyInvitationCreatedResponse,
  formatCompanyInvitationResentResponse,
  formatCompanyInvitationValidation,
  generateInvitationToken,
  getCompanyInvitationActorLabel,
  getInvitationExpiresAt,
  hashInvitationToken,
  validateInvitationToken
};
