const { app } = require('@azure/functions');
const { getCompanyId, handle, ok } = require('../lib/http');
const {
  validateActivityReportQuery,
  validateMembershipFinancialReportQuery
} = require('../lib/validators');
const repository = require('../lib/repository');
const { requireSessionIdentity } = require('./companyAuth');

app.http('getActivityReport', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/reports/activity',
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const filters = validateActivityReportQuery(request.query);
    const report = await repository.getActivityReport(companyId, filters);
    return ok(report);
  })
});

app.http('getMembershipFinancialReport', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'reports/memberships-financial',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    await repository.ensureActiveCompany(identity.company.id);
    const filters = validateMembershipFinancialReportQuery(new URL(request.url).searchParams);
    const report = await repository.getMembershipFinancialReport(identity.company.id, filters);
    return ok(report);
  })
});
