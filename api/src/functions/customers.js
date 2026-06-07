const { app } = require('@azure/functions');
const { getCompanyId, handle, ok, created, readJson } = require('../lib/http');
const { ApiError, mapSqlError } = require('../lib/errors');
const { auditBestEffort } = require('../lib/audit');
const { validateCustomerPayload } = require('../lib/validators');
const repository = require('../lib/repository');

app.http('listCustomers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/customers',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const items = await repository.listCustomers(companyId, request.query.get('search'));
    return ok({ items });
  })
});

app.http('createCustomer', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/customers',
  handler: handle(async (request, context) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validateCustomerPayload(await readJson(request));
    let customer;
    try {
      customer = await repository.createCustomer(companyId, payload);
    } catch (error) {
      const mapped = mapSqlError(error);
      if (mapped.code === 'DUPLICATE_CUSTOMER') {
        await auditBestEffort(context, {
          companyId,
          eventType: 'customer.rejected_duplicate',
          entityType: 'customer',
          metadata: { reason: 'duplicate_customer' }
        });
      }
      throw error;
    }

    await auditBestEffort(context, {
      companyId,
      eventType: 'customer.created',
      entityType: 'customer',
      entityId: customer.id,
      customerId: customer.id,
      metadata: { emailProvided: Boolean(customer.email) }
    });

    return created(customer);
  })
});

app.http('getCustomerBalance', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/customers/{customerId}/balance',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const customerId = Number(request.params.customerId);
    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }
    const balance = await repository.getBalance(companyId, customerId);
    return ok(balance);
  })
});

app.http('getCustomerActivity', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'companies/{companyId}/customers/{customerId}/activity',
  handler: handle(async (request) => {
    const companyId = getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const customerId = Number(request.params.customerId);
    if (!Number.isInteger(customerId) || customerId <= 0 || !(await repository.customerExists(companyId, customerId))) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }
    const [balance, items] = await Promise.all([
      repository.getBalance(companyId, customerId),
      repository.getActivity(companyId, customerId)
    ]);
    return ok({ customerId, balance, items });
  })
});
