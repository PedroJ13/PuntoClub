const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const {
  assertAuthAttemptAllowed,
  clearAuthAttemptLimit,
  recordAuthAttemptFailure,
  scopes
} = require('../lib/authRateLimit');
const {
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
} = require('../lib/companyInvitations');
const { formatInvitationAcceptedResponse: formatAcceptedAuthResponse, hashPassword: createPasswordHash } = require('../lib/companyAuth');
const { created, handle, ok, readJson } = require('../lib/http');
const { assertInternalAdminAuthorized } = require('../lib/internalAdmin');
const { parsePositiveInteger, validateCompanyInvitationPayload, validateInvitationAcceptPayload } = require('../lib/validators');
const notifier = require('../lib/notifier');
const repository = require('../lib/repository');

app.http('createCompanyInvitation', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-invitations',
  handler: handle(async (request, context) => {
    assertCompanyInvitationManagementEnabled();
    assertInternalAdminAuthorized(request);
    const payload = validateCompanyInvitationPayload(await readJson(request));
    const token = generateInvitationToken();
    const invitation = await repository.createCompanyInvitation(
      payload,
      hashInvitationToken(token),
      getInvitationExpiresAt(),
      { actorLabel: getCompanyInvitationActorLabel() }
    );

    await notifier.notifyCompanyInvitationCreated(invitation, token, context);
    await auditBestEffort(context, formatCompanyInvitationCreatedAuditEvent(invitation, context));

    return created(formatCompanyInvitationCreatedResponse(invitation));
  })
});

app.http('validateCompanyInvitation', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'company-invitations/validate',
  handler: handle(async (request) => {
    const token = validateInvitationToken(request.query.get('token'));
    const invitation = await repository.getCompanyInvitationByTokenHash(hashInvitationToken(token));

    return ok(formatCompanyInvitationValidation(invitation));
  })
});

app.http('resendCompanyInvitation', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-invitations/{invitationId}/resend',
  handler: handle(async (request, context) => {
    assertCompanyInvitationManagementEnabled();
    assertInternalAdminAuthorized(request);
    const invitationId = parsePositiveInteger(request.params.invitationId, 'invitationId');
    const token = generateInvitationToken();
    const invitation = await repository.rotateCompanyInvitationToken(invitationId, hashInvitationToken(token));

    await notifier.notifyCompanyInvitationCreated(invitation, token, context);

    return ok(formatCompanyInvitationResentResponse(invitation));
  })
});

app.http('acceptCompanyInvitation', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-invitations/accept',
  handler: handle(async (request, context) => {
    const body = await readJson(request);
    const token = validateInvitationToken(body && body.token);
    const tokenHash = hashInvitationToken(token);
    await assertAuthAttemptAllowed(repository, scopes.companyInvitationToken, tokenHash);

    let result;
    try {
      const payload = validateInvitationAcceptPayload(body);
      result = await repository.acceptCompanyInvitationWithPassword(
        tokenHash,
        payload,
        createPasswordHash(payload.password)
      );
    } catch (error) {
      await recordAuthAttemptFailure(repository, scopes.companyInvitationToken, tokenHash);
      throw error;
    }

    await clearAuthAttemptLimit(repository, scopes.companyInvitationToken, tokenHash);

    await auditBestEffort(context, {
      companyId: result.company.id,
      eventType: 'company.invitation.accepted',
      entityType: 'company_invitation',
      entityId: result.invitation.id,
      actorLabel: result.user.email,
      metadata: {
        role: result.user.role,
        requestId: context && context.invocationId ? context.invocationId : null
      }
    });

    await auditBestEffort(context, {
      companyId: result.company.id,
      eventType: 'company.user.created',
      entityType: 'company_user',
      entityId: result.user.id,
      actorLabel: result.user.email,
      metadata: {
        role: result.user.role,
        authProvider: 'local_password',
        requestId: context && context.invocationId ? context.invocationId : null
      }
    });

    return created(formatAcceptedAuthResponse(result));
  })
});
