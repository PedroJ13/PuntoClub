const { app } = require('@azure/functions');
const { ApiError } = require('../lib/errors');
const {
  assertAuthAttemptAllowed,
  clearAuthAttemptLimit,
  hashRateLimitSubject,
  recordAuthAttemptFailure,
  scopes
} = require('../lib/authRateLimit');
const {
  buildClearSessionCookie,
  buildSessionCookie,
  formatAuthIdentity,
  generateSessionToken,
  getSessionExpiresAt,
  hashSessionToken,
  readSessionTokenFromRequest,
  verifyPassword
} = require('../lib/companyAuth');
const { handle, jsonWithHeaders, ok, readJson } = require('../lib/http');
const { validateCompanyAuthLoginPayload } = require('../lib/validators');
const repository = require('../lib/repository');

async function requireSessionIdentity(request) {
  const token = readSessionTokenFromRequest(request);
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authentication is required.');
  }

  return repository.getAuthIdentityBySessionTokenHash(hashSessionToken(token));
}

app.http('companyAuthLogin', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-auth/login',
  handler: handle(async (request) => {
    const payload = validateCompanyAuthLoginPayload(await readJson(request));
    const emailSubjectHash = hashRateLimitSubject(payload.email);
    await assertAuthAttemptAllowed(repository, scopes.companyLoginEmail, emailSubjectHash);

    const user = await repository.getLocalPasswordUserByEmail(payload.email);

    if (
      !user ||
      user.status !== 'active' ||
      user.company_status !== 'active' ||
      !verifyPassword(payload.password, {
        passwordAlgorithm: user.password_algorithm,
        passwordHash: user.password_hash,
        passwordParams: user.password_params
      })
    ) {
      await recordAuthAttemptFailure(repository, scopes.companyLoginEmail, emailSubjectHash);
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password.');
    }

    const token = generateSessionToken();
    const expiresAt = getSessionExpiresAt();
    await repository.createCompanySession(user.company_id, user.id, hashSessionToken(token), expiresAt);
    await clearAuthAttemptLimit(repository, scopes.companyLoginEmail, emailSubjectHash);

    return jsonWithHeaders(200, formatAuthIdentity({
      user: {
        id: String(user.id),
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        status: user.status
      },
      company: {
        id: String(user.company_id),
        name: user.company_name,
        status: user.company_status
      }
    }), {
      'Set-Cookie': buildSessionCookie(token, expiresAt)
    });
  })
});

app.http('companyAuthLogout', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-auth/logout',
  handler: handle(async (request) => {
    const token = readSessionTokenFromRequest(request);
    if (token) {
      await repository.revokeCompanySession(hashSessionToken(token));
    }

    return jsonWithHeaders(200, { ok: true }, {
      'Set-Cookie': buildClearSessionCookie()
    });
  })
});

app.http('getMe', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'me',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    return ok(formatAuthIdentity(identity));
  })
});

module.exports = {
  requireSessionIdentity
};
