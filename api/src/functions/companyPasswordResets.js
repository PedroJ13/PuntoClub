const { app } = require('@azure/functions');
const { ApiError } = require('../lib/errors');
const {
  assertCompanyPasswordResetEnabled,
  formatPasswordResetCompletedResponse,
  formatPasswordResetRequestedResponse,
  formatPasswordResetValidation,
  generatePasswordResetToken,
  getPasswordResetExpiresAt,
  hashPasswordResetToken,
  validatePasswordResetToken
} = require('../lib/companyPasswordResets');
const { hashPassword: createPasswordHash } = require('../lib/companyAuth');
const { handle, ok, readJson } = require('../lib/http');
const { assertInternalAdminAuthorized } = require('../lib/internalAdmin');
const {
  validateCompanyPasswordResetCompletePayload,
  validateCompanyPasswordResetRequestPayload
} = require('../lib/validators');
const notifier = require('../lib/notifier');
const repository = require('../lib/repository');

app.http('createCompanyPasswordReset', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-password-resets',
  handler: handle(async (request, context) => {
    assertCompanyPasswordResetEnabled();
    const adminToken = String(request.headers.get('x-puntoclub-admin-token') || '').trim();
    const isAdminRequest = Boolean(adminToken);
    if (isAdminRequest) {
      assertInternalAdminAuthorized(request);
    }

    const payload = validateCompanyPasswordResetRequestPayload(await readJson(request));
    const token = generatePasswordResetToken();
    let reset;

    try {
      reset = await repository.createCompanyPasswordReset(
        payload.email,
        hashPasswordResetToken(token),
        getPasswordResetExpiresAt(),
        { actorLabel: isAdminRequest ? process.env.COMPANY_PASSWORD_RESET_ACTOR_LABEL || 'internal' : 'public-login' }
      );
    } catch (error) {
      if (!isAdminRequest && error instanceof ApiError && error.code === 'COMPANY_USER_NOT_FOUND') {
        return ok({
          email: payload.email,
          status: 'accepted',
          sentAt: new Date().toISOString()
        });
      }

      throw error;
    }

    await notifier.notifyCompanyPasswordResetCreated(reset, token, context);

    return ok(formatPasswordResetRequestedResponse(reset));
  })
});

app.http('validateCompanyPasswordReset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'company-password-resets/validate',
  handler: handle(async (request) => {
    const token = validatePasswordResetToken(request.query.get('token'));
    const reset = await repository.getCompanyPasswordResetByTokenHash(hashPasswordResetToken(token));

    return ok(formatPasswordResetValidation(reset));
  })
});

app.http('completeCompanyPasswordReset', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-password-resets/complete',
  handler: handle(async (request) => {
    const payload = validateCompanyPasswordResetCompletePayload(await readJson(request));
    const token = validatePasswordResetToken(payload.token);
    const result = await repository.completeCompanyPasswordReset(
      hashPasswordResetToken(token),
      createPasswordHash(payload.password)
    );

    return ok(formatPasswordResetCompletedResponse(result));
  })
});
