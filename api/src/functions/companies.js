const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const { getCompanyId, handle, ok, readJson } = require('../lib/http');
const { validateCompanySettingsPatchPayload } = require('../lib/validators');
const repository = require('../lib/repository');

function getChangedFields(current, patch, providedFields) {
  return providedFields.filter((field) => {
    if (field === 'pointsPercentage') {
      return Number(current[field]) !== Number(patch[field]);
    }

    return (current[field] || null) !== (patch[field] || null);
  });
}

app.http('getCompanySettings', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/settings',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    const settings = await repository.getCompanySettings(companyId);
    return ok(settings);
  })
});

app.http('updateCompanySettings', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/settings',
  handler: handle(async (request, context) => {
    const companyId = getCompanyId(request);
    const current = await repository.getCompanySettings(companyId);
    const { patch, providedFields } = validateCompanySettingsPatchPayload(await readJson(request));
    const changedFields = getChangedFields(current, patch, providedFields);

    if (!changedFields.length) {
      return ok(current);
    }

    const updated = await repository.updateCompanySettings(companyId, {
      name: Object.prototype.hasOwnProperty.call(patch, 'name') ? patch.name : current.name,
      email: Object.prototype.hasOwnProperty.call(patch, 'email') ? patch.email : current.email,
      phone: Object.prototype.hasOwnProperty.call(patch, 'phone') ? patch.phone : current.phone,
      logoUrl: Object.prototype.hasOwnProperty.call(patch, 'logoUrl') ? patch.logoUrl : current.logoUrl,
      pointsPercentage: Object.prototype.hasOwnProperty.call(patch, 'pointsPercentage')
        ? patch.pointsPercentage
        : current.pointsPercentage
    });

    await auditBestEffort(context, {
      companyId,
      eventType: 'company.settings.updated',
      entityType: 'company',
      entityId: companyId,
      metadata: {
        changedFields,
        requestId: context && context.invocationId ? context.invocationId : null,
        affectsPurchases: 'future_only'
      }
    });

    return ok(updated);
  })
});
