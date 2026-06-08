const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
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
const { created, handle, ok, readJson } = require('../lib/http');
const { parsePositiveInteger, validateCompanyInvitationPayload } = require('../lib/validators');
const notifier = require('../lib/notifier');
const repository = require('../lib/repository');

app.http('createCompanyInvitation', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-invitations',
  handler: handle(async (request, context) => {
    assertCompanyInvitationManagementEnabled();
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
    const invitationId = parsePositiveInteger(request.params.invitationId, 'invitationId');
    const token = generateInvitationToken();
    const invitation = await repository.rotateCompanyInvitationToken(invitationId, hashInvitationToken(token));

    await notifier.notifyCompanyInvitationCreated(invitation, token, context);

    return ok(formatCompanyInvitationResentResponse(invitation));
  })
});
