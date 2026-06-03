const { app } = require('@azure/functions');
const { getCompanyId, handle, ok } = require('../lib/http');
const repository = require('../lib/repository');

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
