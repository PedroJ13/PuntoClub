const { app } = require('@azure/functions');
const { getCompanyId, handle, created, readJson } = require('../lib/http');
const { ApiError, mapSqlError } = require('../lib/errors');
const { auditBestEffort } = require('../lib/audit');
const { calculatePointsEarned, validatePurchasePayload } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('createPurchase', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/purchases',
  handler: handle(async (request, context) => {
    const companyId = getCompanyId(request);
    const company = await repository.ensureActiveCompany(companyId);
    const payload = validatePurchasePayload(await readJson(request));

    if (!(await repository.customerExists(companyId, payload.customerId))) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }

    const pointsEarned = calculatePointsEarned(payload.amount, company.points_percentage);
    let purchase;
    try {
      purchase = await repository.createPurchase(companyId, payload, pointsEarned);
    } catch (error) {
      const mapped = mapSqlError(error);
      if (mapped.code === 'DUPLICATE_INVOICE') {
        await auditBestEffort(context, {
          companyId,
          eventType: 'purchase.rejected_duplicate_invoice',
          entityType: 'purchase',
          customerId: payload.customerId,
          metadata: {
            invoiceNumber: payload.invoiceNumber,
            purchaseDate: payload.purchaseDate
          }
        });
      }
      throw error;
    }

    await auditBestEffort(context, {
      companyId,
      eventType: 'purchase.registered',
      entityType: 'purchase',
      entityId: purchase.id,
      customerId: purchase.customerId,
      metadata: {
        invoiceNumber: purchase.invoiceNumber,
        purchaseDate: purchase.purchaseDate,
        amount: purchase.amount,
        pointsEarned: purchase.pointsEarned
      }
    });

    return created(purchase);
  })
});
