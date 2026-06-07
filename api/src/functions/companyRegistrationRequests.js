const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
} = require('../lib/companyRegistration');
const { created, handle, ok, readJson } = require('../lib/http');
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
  handler: handle(async (request) => {
    const payload = validateCompanyRegistrationRequestPayload(await readJson(request));
    const registrationRequest = await repository.createCompanyRegistrationRequest(payload);
    await notifier.notifyCompanyRegistrationSubmitted(registrationRequest);

    return created(formatCompanyRegistrationCreatedResponse(registrationRequest));
  })
});

app.http('approveCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/approve',
  handler: handle(async (request, context) => {
    assertCompanyRegistrationReviewEnabled();
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'approve');
    const result = await repository.approveCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel()
    });

    await auditBestEffort(context, formatCompanyRegistrationApprovedAuditEvent(result, context));

    return ok(result);
  })
});

app.http('rejectCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/reject',
  handler: handle(async (request) => {
    assertCompanyRegistrationReviewEnabled();
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'reject');
    const result = await repository.rejectCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel()
    });

    return ok(formatCompanyRegistrationRejectedResponse(result));
  })
});
