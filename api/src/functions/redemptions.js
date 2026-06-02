const { app } = require('@azure/functions');
const { getCompanyId, handle, created, readJson } = require('../lib/http');
const { validateRedemptionPayload } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('createRedemption', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/redemptions',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validateRedemptionPayload(await readJson(request));
    const redemption = await repository.createRedemption(companyId, payload);
    return created(redemption);
  })
});
