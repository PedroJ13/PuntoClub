const crypto = require('node:crypto');
const { ApiError, validationError } = require('./errors');

const tokenByteLength = 32;
const tokenPattern = /^[A-Za-z0-9_-]{32,512}$/;

function assertCompanyPasswordResetEnabled(env = process.env) {
  if (env.COMPANY_PASSWORD_RESET_ENABLED !== 'true') {
    throw new ApiError(403, 'FORBIDDEN', 'Company password reset is not enabled.');
  }
}

function generatePasswordResetToken() {
  return crypto.randomBytes(tokenByteLength).toString('base64url');
}

function validatePasswordResetToken(token) {
  if (typeof token !== 'string' || !tokenPattern.test(token.trim())) {
    throw validationError([{ field: 'token', message: 'token is required and must be a valid reset token.' }]);
  }

  return token.trim();
}

function hashPasswordResetToken(token) {
  return crypto.createHash('sha256').update(validatePasswordResetToken(token), 'utf8').digest();
}

function getPasswordResetExpiresAt(now = new Date(), env = process.env) {
  const minutes = Number(env.COMPANY_PASSWORD_RESET_EXPIRES_MINUTES || 60);
  const safeMinutes = Number.isInteger(minutes) && minutes > 0 && minutes <= 24 * 60 ? minutes : 60;
  return new Date(now.getTime() + safeMinutes * 60 * 1000);
}

function formatPasswordResetRequestedResponse(reset) {
  return {
    id: reset.id,
    email: reset.email,
    status: reset.status,
    expiresAt: reset.expiresAt,
    sentAt: reset.sentAt
  };
}

function formatPasswordResetValidation(reset, now = new Date()) {
  if (!reset) {
    return { valid: false, reason: 'invalid' };
  }

  if (reset.status === 'used') {
    return { valid: false, reason: 'used' };
  }

  if (reset.status === 'expired' || new Date(reset.expiresAt) < now) {
    return { valid: false, reason: 'expired' };
  }

  if (reset.status !== 'pending') {
    return { valid: false, reason: 'invalid' };
  }

  return {
    valid: true,
    resetId: reset.id,
    companyName: reset.companyName,
    email: reset.email,
    expiresAt: reset.expiresAt
  };
}

function formatPasswordResetCompletedResponse(result) {
  return {
    ok: true,
    email: result.email,
    companyName: result.companyName,
    completedAt: result.completedAt
  };
}

module.exports = {
  assertCompanyPasswordResetEnabled,
  formatPasswordResetCompletedResponse,
  formatPasswordResetRequestedResponse,
  formatPasswordResetValidation,
  generatePasswordResetToken,
  getPasswordResetExpiresAt,
  hashPasswordResetToken,
  validatePasswordResetToken
};
