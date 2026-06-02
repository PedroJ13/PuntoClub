const { app } = require('@azure/functions');
const { getCompanyId, handle, created, readJson } = require('../lib/http');
const { ApiError } = require('../lib/errors');
const { calculatePointsEarned, validatePurchasePayload } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('createPurchase', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/purchases',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    const company = await repository.ensureActiveCompany(companyId);
    const payload = validatePurchasePayload(await readJson(request));

    if (!(await repository.customerExists(companyId, payload.customerId))) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }

    const pointsEarned = calculatePointsEarned(payload.amount, company.points_percentage);
    const purchase = await repository.createPurchase(companyId, payload, pointsEarned);
    return created(purchase);
  })
});
