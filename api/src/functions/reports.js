const { app } = require('@azure/functions');
const { getCompanyId, handle, ok } = require('../lib/http');
const { validateActivityReportQuery } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('getActivityReport', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/reports/activity',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validateActivityReportQuery(request.query);
    const report = await repository.getActivityReport(companyId, filters);
    return ok(report);
  })
});
