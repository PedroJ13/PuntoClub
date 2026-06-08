const crypto = require('node:crypto');
const { ApiError } = require('./errors');

const sessionTokenByteLength = 32;
const defaultSessionTtlHours = 12;
const passwordAlgorithm = 'pbkdf2_sha256';
const defaultPasswordParams = {
  iterations: 310000,
  keylen: 32,
  digest: 'sha256'
};

function getSessionCookieName(env = process.env) {
  return env.COMPANY_SESSION_COOKIE_NAME && env.COMPANY_SESSION_COOKIE_NAME.trim()
    ? env.COMPANY_SESSION_COOKIE_NAME.trim()
    : 'puntoclub_company_session';
}

function generateSessionToken() {
  return crypto.randomBytes(sessionTokenByteLength).toString('base64url');
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(String(token || ''), 'utf8').digest();
}

function getSessionExpiresAt(now = new Date(), env = process.env) {
  const hours = Number(env.COMPANY_SESSION_TTL_HOURS || defaultSessionTtlHours);
  const safeHours = Number.isInteger(hours) && hours > 0 && hours <= 24 * 14 ? hours : defaultSessionTtlHours;
  return new Date(now.getTime() + safeHours * 60 * 60 * 1000);
}

function hashPassword(password, options = {}) {
  const salt = options.salt || crypto.randomBytes(16).toString('base64url');
  const iterations = Number(options.iterations || defaultPasswordParams.iterations);
  const keylen = Number(options.keylen || defaultPasswordParams.keylen);
  const digest = options.digest || defaultPasswordParams.digest;
  const passwordHash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('base64');

  return {
    passwordHash,
    passwordAlgorithm,
    passwordParams: JSON.stringify({ iterations, keylen, digest, salt })
  };
}

function parsePasswordParams(passwordParams) {
  try {
    const params = JSON.parse(passwordParams);
    if (
      Number.isInteger(params.iterations) &&
      Number.isInteger(params.keylen) &&
      typeof params.digest === 'string' &&
      typeof params.salt === 'string'
    ) {
      return params;
    }
  } catch {
    // Fall through to a generic unauthorized error.
  }

  throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password.');
}

function verifyPassword(password, user) {
  if (!user || user.passwordAlgorithm !== passwordAlgorithm || !user.passwordHash || !user.passwordParams) {
    return false;
  }

  const params = parsePasswordParams(user.passwordParams);
  const candidate = crypto.pbkdf2Sync(password, params.salt, params.iterations, params.keylen, params.digest);
  const expected = Buffer.from(user.passwordHash, 'base64');

  if (candidate.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidate, expected);
}

function readSessionTokenFromRequest(request, env = process.env) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieName = getSessionCookieName(env);
  const cookies = cookieHeader.split(';').map((part) => part.trim()).filter(Boolean);

  for (const cookie of cookies) {
    const separator = cookie.indexOf('=');
    if (separator <= 0) {
      continue;
    }

    const name = cookie.slice(0, separator);
    const value = cookie.slice(separator + 1);
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

function isSecureCookie(env = process.env) {
  if (env.COMPANY_SESSION_COOKIE_SECURE === 'false') {
    return false;
  }

  return env.COMPANY_SESSION_COOKIE_SECURE === 'true' || Boolean(env.WEBSITE_SITE_NAME) || env.NODE_ENV === 'production';
}

function buildSessionCookie(token, expiresAt, env = process.env) {
  const parts = [
    `${getSessionCookieName(env)}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Expires=${expiresAt.toUTCString()}`
  ];

  if (isSecureCookie(env)) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function buildClearSessionCookie(env = process.env) {
  const parts = [
    `${getSessionCookieName(env)}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ];

  if (isSecureCookie(env)) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function formatAuthIdentity(identity) {
  return {
    user: {
      id: identity.user.id,
      email: identity.user.email,
      displayName: identity.user.displayName,
      role: identity.user.role,
      status: identity.user.status
    },
    company: {
      id: identity.company.id,
      name: identity.company.name,
      status: identity.company.status
    }
  };
}

function formatInvitationAcceptedResponse(result) {
  return {
    companyId: result.company.id,
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    companyStatus: result.company.status,
    createdAt: result.user.createdAt
  };
}

module.exports = {
  buildClearSessionCookie,
  buildSessionCookie,
  formatAuthIdentity,
  formatInvitationAcceptedResponse,
  generateSessionToken,
  getSessionExpiresAt,
  hashPassword,
  hashSessionToken,
  passwordAlgorithm,
  readSessionTokenFromRequest,
  verifyPassword
};
