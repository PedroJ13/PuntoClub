const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const { getCompanyId, handle, ok, readJson } = require('../lib/http');
const { validateOperationalEmailSettingsPayload } = require('../lib/validators');
const repository = require('../lib/repository');

function getChangedFields(current, next) {
  return ['welcomeEnabled', 'purchaseEnabled', 'redemptionEnabled', 'replyToEmail']
    .filter((field) => (current[field] || null) !== (next[field] || null));
}

app.http('getOperationalEmailSettings', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/operational-email-settings',
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    const settings = await repository.getOperationalEmailSettings(companyId);
    return ok(settings);
  })
});

app.http('updateOperationalEmailSettings', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/operational-email-settings',
  handler: handle(async (request, context) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const current = await repository.getOperationalEmailSettings(companyId);
    const payload = validateOperationalEmailSettingsPayload(await readJson(request));
    const changedFields = getChangedFields(current, payload);

    if (!changedFields.length) {
      return ok(current);
    }

    const settings = await repository.updateOperationalEmailSettings(companyId, payload);
    await auditBestEffort(context, {
      companyId,
      eventType: 'company.settings.updated',
      entityType: 'company',
      entityId: companyId,
      metadata: {
        changedFields: changedFields.map((field) => `operationalEmail.${field}`),
        requestId: context && context.invocationId ? context.invocationId : null
      }
    });

    return ok(settings);
  })
});
