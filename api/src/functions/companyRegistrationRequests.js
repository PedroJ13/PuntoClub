const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationApprovedResponse,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
} = require('../lib/companyRegistration');
const {
  formatCompanyInvitationCreatedAuditEvent,
  generateInvitationToken,
  getInvitationExpiresAt,
  hashInvitationToken
} = require('../lib/companyInvitations');
const { created, handle, ok, readJson } = require('../lib/http');
const { assertInternalAdminAuthorized } = require('../lib/internalAdmin');
const {
  parsePositiveInteger,
  validateCompanyRegistrationRequestPayload,
  validateCompanyRegistrationReviewPayload
} = require('../lib/validators');
const notifier = require('../lib/notifier');
const repository = require('../lib/repository');

app.http('createCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests',
  handler: handle(async (request, context) => {
    const payload = validateCompanyRegistrationRequestPayload(await readJson(request));
    const registrationRequest = await repository.createCompanyRegistrationRequest(payload);
    await notifier.notifyCompanyRegistrationSubmitted(registrationRequest, context);

    return created(formatCompanyRegistrationCreatedResponse(registrationRequest));
  })
});

app.http('approveCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/approve',
  handler: handle(async (request, context) => {
    assertCompanyRegistrationReviewEnabled();
    assertInternalAdminAuthorized(request);
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'approve');
    const invitationToken = generateInvitationToken();
    const result = await repository.approveCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel(),
      invitation: {
        tokenHash: hashInvitationToken(invitationToken),
        expiresAt: getInvitationExpiresAt()
      }
    });

    if (result.invitation) {
      await notifier.notifyCompanyInvitationCreated(result.invitation, invitationToken, context);
      await auditBestEffort(context, formatCompanyInvitationCreatedAuditEvent(result.invitation, context));
    }
    await auditBestEffort(context, formatCompanyRegistrationApprovedAuditEvent(result, context));

    return ok(formatCompanyRegistrationApprovedResponse(result));
  })
});

app.http('rejectCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/reject',
  handler: handle(async (request) => {
    assertCompanyRegistrationReviewEnabled();
    assertInternalAdminAuthorized(request);
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'reject');
    const result = await repository.rejectCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel()
    });

    return ok(formatCompanyRegistrationRejectedResponse(result));
  })
});
