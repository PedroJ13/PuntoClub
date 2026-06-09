const crypto = require('node:crypto');
const { ApiError } = require('./errors');

const scopes = {
  companyLoginEmail: 'company_login_email',
  companyLoginIp: 'company_login_ip',
  companyInvitationToken: 'company_invitation_token',
  companyInvitationIp: 'company_invitation_ip'
};

const defaultPolicy = {
  maxFailures: 5,
  windowMinutes: 15,
  lockMinutes: 15
};

function tooManyAttemptsError() {
  return new ApiError(429, 'TOO_MANY_ATTEMPTS', 'Too many attempts. Please try again later.');
}

function hashRateLimitSubject(value) {
  return crypto.createHash('sha256').update(String(value || ''), 'utf8').digest();
}

function getClientIp() {
  return null;
}

function normalizePolicy(policy = {}) {
  const maxFailures = Number(policy.maxFailures || defaultPolicy.maxFailures);
  const windowMinutes = Number(policy.windowMinutes || defaultPolicy.windowMinutes);
  const lockMinutes = Number(policy.lockMinutes || defaultPolicy.lockMinutes);

  return {
    maxFailures: Number.isInteger(maxFailures) && maxFailures > 0 ? maxFailures : defaultPolicy.maxFailures,
    windowMinutes: Number.isInteger(windowMinutes) && windowMinutes > 0 ? windowMinutes : defaultPolicy.windowMinutes,
    lockMinutes: Number.isInteger(lockMinutes) && lockMinutes > 0 ? lockMinutes : defaultPolicy.lockMinutes
  };
}

function isLocked(limit, now = new Date()) {
  return Boolean(limit && limit.lockedUntil && new Date(limit.lockedUntil) > now);
}

function getFailedAttemptUpdate(current, policy = defaultPolicy, now = new Date()) {
  const normalizedPolicy = normalizePolicy(policy);
  const windowMs = normalizedPolicy.windowMinutes * 60 * 1000;
  const lockMs = normalizedPolicy.lockMinutes * 60 * 1000;
  const currentWindowStartedAt = current && current.windowStartedAt
    ? new Date(current.windowStartedAt)
    : null;
  const windowExpired = !currentWindowStartedAt || now.getTime() - currentWindowStartedAt.getTime() >= windowMs;
  const failedCount = windowExpired ? 1 : Number(current.failedCount || 0) + 1;

  return {
    windowStartedAt: windowExpired ? now : currentWindowStartedAt,
    failedCount,
    lockedUntil: failedCount >= normalizedPolicy.maxFailures ? new Date(now.getTime() + lockMs) : null,
    lastFailedAt: now
  };
}

async function assertAuthAttemptAllowed(repository, scope, subjectHash, now = new Date()) {
  const limit = await repository.getAuthAttemptLimit(scope, subjectHash);
  if (isLocked(limit, now)) {
    throw tooManyAttemptsError();
  }
}

async function recordAuthAttemptFailure(repository, scope, subjectHash, policy = defaultPolicy, now = new Date()) {
  return repository.recordAuthAttemptFailure(scope, subjectHash, normalizePolicy(policy), now);
}

async function clearAuthAttemptLimit(repository, scope, subjectHash) {
  return repository.clearAuthAttemptLimit(scope, subjectHash);
}

module.exports = {
  assertAuthAttemptAllowed,
  clearAuthAttemptLimit,
  defaultPolicy,
  getClientIp,
  getFailedAttemptUpdate,
  hashRateLimitSubject,
  isLocked,
  recordAuthAttemptFailure,
  scopes,
  tooManyAttemptsError
};
