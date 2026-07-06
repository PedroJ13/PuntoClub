const { app } = require("@azure/functions");
const { getCompanyId, handle, ok, created, readJson } = require("../lib/http");
const { ApiError, mapSqlError } = require("../lib/errors");
const { auditBestEffort } = require("../lib/audit");
const {
  validateCustomerPayload,
  validateCustomerPatchPayload,
} = require("../lib/validators");
const operationalEmails = require("../lib/operationalEmails");
const repository = require("../lib/repository");

app.http("listCustomers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const items = await repository.listCustomers(
      companyId,
      request.query.get("search"),
    );
    return ok({ items });
  }),
});

app.http("createCustomer", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers",
  handler: handle(async (request, context) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const payload = validateCustomerPayload(await readJson(request));
    let customer;
    try {
      customer = await repository.createCustomer(companyId, payload);
    } catch (error) {
      const mapped = mapSqlError(error);
      if (mapped.code === "DUPLICATE_CUSTOMER") {
        await auditBestEffort(context, {
          companyId,
          eventType: "customer.rejected_duplicate",
          entityType: "customer",
          metadata: { reason: "duplicate_customer" },
        });
      }
      throw error;
    }

    await auditBestEffort(context, {
      companyId,
      eventType: "customer.created",
      entityType: "customer",
      entityId: customer.id,
      customerId: customer.id,
      metadata: { emailProvided: Boolean(customer.email) },
    });

    await operationalEmails.sendOperationalEmailBestEffort(
      repository,
      {
        companyId,
        eventType: "welcome",
        idempotencyKey: `welcome:customer:${customer.id}`,
        sourceEntityType: "customer",
        sourceEntityId: customer.id,
        customerId: customer.id,
      },
      {
        company: await repository.getCompanySettings(companyId),
        customer,
      },
      context,
    );

    return created(customer);
  }),
});

app.http("updateCustomer", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers/{customerId}",
  handler: handle(async (request, context) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const customerId = Number(request.params.customerId);
    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer does not exist for this company.",
      );
    }

    const { patch } = validateCustomerPatchPayload(await readJson(request));
    let customer;
    try {
      customer = await repository.updateCustomer(companyId, customerId, patch);
    } catch (error) {
      const mapped = mapSqlError(error);
      if (mapped.code === "DUPLICATE_CUSTOMER") {
        await auditBestEffort(context, {
          companyId,
          eventType: "customer.rejected_duplicate",
          entityType: "customer",
          entityId: String(customerId),
          customerId: String(customerId),
          metadata: { reason: "duplicate_customer_update" },
        });
      }
      throw error;
    }

    await auditBestEffort(context, {
      companyId,
      eventType: "customer.updated",
      entityType: "customer",
      entityId: customer.id,
      customerId: customer.id,
      metadata: { birthDateProvided: Boolean(customer.birthDate) },
    });

    return ok(customer);
  }),
});

app.http("listTodayBirthdayCustomers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers/birthdays/today",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    return ok(await repository.listBirthdayCustomersToday(companyId));
  }),
});

app.http("getCustomerBalance", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers/{customerId}/balance",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const customerId = Number(request.params.customerId);
    if (!Number.isInteger(customerId) || customerId <= 0) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer does not exist for this company.",
      );
    }
    const balance = await repository.getBalance(companyId, customerId);
    return ok(balance);
  }),
});

app.http("getCustomerActivity", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "companies/{companyId}/customers/{customerId}/activity",
  handler: handle(async (request) => {
    const companyId = await getCompanyId(request);
    await repository.ensureActiveCompany(companyId);
    const customerId = Number(request.params.customerId);
    if (
      !Number.isInteger(customerId) ||
      customerId <= 0 ||
      !(await repository.customerExists(companyId, customerId))
    ) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer does not exist for this company.",
      );
    }
    const [balance, items] = await Promise.all([
      repository.getBalance(companyId, customerId),
      repository.getActivity(companyId, customerId),
    ]);
    return ok({ customerId, balance, items });
  }),
});
