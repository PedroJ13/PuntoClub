const { app } = require('@azure/functions');
const { getCompanyId, handle, created, readJson } = require('../lib/http');
const { mapSqlError } = require('../lib/errors');
const { auditBestEffort } = require('../lib/audit');
const { validateRedemptionPayload } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('createRedemption', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/redemptions',
  handler: handle(async (request, context) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validateRedemptionPayload(await readJson(request));
    let redemption;
    try {
      redemption = await repository.createRedemption(companyId, payload);
    } catch (error) {
      const mapped = mapSqlError(error);
      if (mapped.code === 'INSUFFICIENT_POINTS') {
        await auditBestEffort(context, {
          companyId,
          eventType: 'redemption.rejected_insufficient_points',
          entityType: 'redemption',
          customerId: payload.customerId,
          metadata: {
            redemptionDate: payload.redemptionDate,
            pointsRedeemed: payload.pointsRedeemed
          }
        });
      }
      throw error;
    }

    await auditBestEffort(context, {
      companyId,
      eventType: 'redemption.registered',
      entityType: 'redemption',
      entityId: redemption.id,
      customerId: redemption.customerId,
      metadata: {
        redemptionDate: redemption.redemptionDate,
        pointsRedeemed: redemption.pointsRedeemed,
        balanceAfter: redemption.balanceAfter
      }
    });

    return created(redemption);
  })
});
