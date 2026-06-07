const { app } = require('@azure/functions');
const { getCompanyId, handle, ok } = require('../lib/http');
const { validateAuditEventsQuery } = require('../lib/validators');
const { listAuditEvents } = require('../lib/audit');
const repository = require('../lib/repository');

app.http('listAuditEvents', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/audit/events',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validateAuditEventsQuery(request.query);
    const events = await listAuditEvents(companyId, filters);
    return ok(events);
  })
});
