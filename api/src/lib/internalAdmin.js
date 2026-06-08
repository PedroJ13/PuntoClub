const crypto = require('node:crypto');
const { ApiError } = require('./errors');

const internalAdminHeaderName = 'x-puntoclub-admin-token';

function normalizeToken(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getHeaderValue(request, name) {
  if (!request || !request.headers || typeof request.headers.get !== 'function') {
    return '';
  }

  return normalizeToken(request.headers.get(name));
}

function tokensMatch(actualToken, expectedToken) {
  const actual = Buffer.from(normalizeToken(actualToken), 'utf8');
  const expected = Buffer.from(normalizeToken(expectedToken), 'utf8');

  if (!actual.length || !expected.length || actual.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(actual, expected);
}

function assertInternalAdminAuthorized(request, env = process.env) {
  const expectedToken = normalizeToken(env.INTERNAL_ADMIN_TOKEN);
  const actualToken = getHeaderValue(request, internalAdminHeaderName);

  if (!tokensMatch(actualToken, expectedToken)) {
    throw new ApiError(403, 'FORBIDDEN', 'Internal admin authorization failed.');
  }
}

module.exports = {
  assertInternalAdminAuthorized,
  internalAdminHeaderName,
  tokensMatch
};
