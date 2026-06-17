const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const { ApiError } = require('../lib/errors');
const { created, handle, ok, readJson } = require('../lib/http');
const { parsePositiveInteger } = require('../lib/validators');
const {
  validateCustomerMembershipStatusQuery,
  validateExpirationAlertsQuery,
  validateMembershipActivationPayload,
  validateMembershipBenefitPayload,
  validateMembershipBenefitUsagePayload,
  validateMembershipBenefitUsageQuery,
  validateMembershipPlanPayload,
  validateMembershipRenewalPayload,
  validateMembershipStatusQuery,
  validateMembershipTransactionsQuery
} = require('../lib/validators');
const repository = require('../lib/repository');
const { requireSessionIdentity } = require('./companyAuth');

function assertCanManageMemberships(identity) {
  if (!['owner', 'admin'].includes(identity.user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Company user is not allowed to manage memberships.');
  }
}

function mergePatch(current, patch) {
  return Object.keys(patch).reduce((next, field) => {
    next[field] = patch[field];
    return next;
  }, { ...current });
}

function requestId(context) {
  return context && context.invocationId ? context.invocationId : null;
}

async function auditMembershipChange(context, identity, eventType, entityType, entityId, metadata) {
  await auditBestEffort(context, {
    companyId: identity.company.id,
    eventType,
    entityType,
    entityId,
    customerId: metadata && metadata.customerId ? metadata.customerId : null,
    actorLabel: identity.user.email,
    metadata: {
      ...metadata,
      requestId: requestId(context)
    }
  });
}

async function assertCustomerBelongsToCompany(companyId, customerId) {
  const exists = await repository.customerExists(companyId, customerId);
  if (!exists) {
    throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
  }
}

app.http('listMembershipPlans', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'membership-plans',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const filters = validateMembershipStatusQuery(new URL(request.url).searchParams);
    const result = await repository.listMembershipPlans(identity.company.id, filters);
    return ok(result);
  })
});

app.http('createMembershipPlan', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'membership-plans',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    assertCanManageMemberships(identity);

    const payload = validateMembershipPlanPayload(await readJson(request));
    const plan = await repository.createMembershipPlan(identity.company.id, payload);

    await auditMembershipChange(context, identity, 'membership.plan.created', 'membership_plan', plan.id, {
      name: plan.name,
      status: plan.status
    });

    return created(plan);
  })
});

app.http('updateMembershipPlan', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'membership-plans/{planId}',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    assertCanManageMemberships(identity);

    const planId = parsePositiveInteger(request.params.planId, 'planId');
    const current = await repository.getMembershipPlanById(identity.company.id, planId);
    const { patch, providedFields } = validateMembershipPlanPayload(await readJson(request), { partial: true });
    const nextPayload = mergePatch(current, patch);
    const normalized = validateMembershipPlanPayload(nextPayload);
    const updated = await repository.updateMembershipPlan(identity.company.id, planId, normalized);

    await auditMembershipChange(context, identity, 'membership.plan.updated', 'membership_plan', updated.id, {
      changedFields: providedFields,
      status: updated.status
    });

    return ok(updated);
  })
});

async function setMembershipPlanStatus(request, context, status) {
  const identity = await requireSessionIdentity(request);
  assertCanManageMemberships(identity);

  const planId = parsePositiveInteger(request.params.planId, 'planId');
  const current = await repository.getMembershipPlanById(identity.company.id, planId);
  const normalized = validateMembershipPlanPayload({ ...current, status });
  const updated = await repository.updateMembershipPlan(identity.company.id, planId, normalized);

  await auditMembershipChange(context, identity, 'membership.plan.updated', 'membership_plan', updated.id, {
    changedFields: ['status'],
    previousStatus: current.status,
    status: updated.status
  });

  return ok(updated);
}

app.http('activateMembershipPlan', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'membership-plans/{planId}/activate',
  handler: handle((request, context) => setMembershipPlanStatus(request, context, 'active'))
});

app.http('deactivateMembershipPlan', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'membership-plans/{planId}/deactivate',
  handler: handle((request, context) => setMembershipPlanStatus(request, context, 'inactive'))
});

app.http('listMembershipBenefits', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'membership-plans/{planId}/benefits',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const planId = parsePositiveInteger(request.params.planId, 'planId');
    await repository.getMembershipPlanById(identity.company.id, planId);

    const filters = validateMembershipStatusQuery(new URL(request.url).searchParams);
    const result = await repository.listMembershipBenefits(identity.company.id, planId, filters);
    return ok(result);
  })
});

app.http('createMembershipBenefit', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'membership-plans/{planId}/benefits',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    assertCanManageMemberships(identity);

    const planId = parsePositiveInteger(request.params.planId, 'planId');
    const payload = validateMembershipBenefitPayload(await readJson(request));
    const benefit = await repository.createMembershipBenefit(identity.company.id, planId, payload);

    await auditMembershipChange(context, identity, 'membership.benefit.created', 'membership_benefit', benefit.id, {
      planId: benefit.planId,
      name: benefit.name,
      status: benefit.status
    });

    return created(benefit);
  })
});

app.http('updateMembershipBenefit', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'membership-benefits/{benefitId}',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    assertCanManageMemberships(identity);

    const benefitId = parsePositiveInteger(request.params.benefitId, 'benefitId');
    const current = await repository.getMembershipBenefitById(identity.company.id, benefitId);
    const { patch, providedFields } = validateMembershipBenefitPayload(await readJson(request), { partial: true });
    const nextPayload = mergePatch(current, patch);
    const normalized = validateMembershipBenefitPayload(nextPayload);
    const updated = await repository.updateMembershipBenefit(identity.company.id, benefitId, normalized);

    await auditMembershipChange(context, identity, 'membership.benefit.updated', 'membership_benefit', updated.id, {
      planId: updated.planId,
      changedFields: providedFields,
      status: updated.status
    });

    return ok(updated);
  })
});

app.http('createCustomerMembership', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/memberships',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const payload = validateMembershipActivationPayload(await readJson(request));

    await assertCustomerBelongsToCompany(identity.company.id, customerId);
    const plan = await repository.getMembershipPlanById(identity.company.id, payload.planId);
    if (plan.status !== 'active') {
      throw new ApiError(409, 'MEMBERSHIP_PLAN_INACTIVE', 'Membership plan is inactive.');
    }

    const activeMembership = await repository.getActiveCustomerMembership(identity.company.id, customerId);
    if (activeMembership) {
      throw new ApiError(409, 'CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP', 'Customer already has an active membership.');
    }

    const membership = await repository.createCustomerMembership(identity.company.id, customerId, {
      planId: payload.planId,
      planName: plan.name,
      renewalNoticeDays: plan.renewalNoticeDays,
      startDate: payload.startDate,
      endDate: repository.calculateMembershipEndDate(payload.startDate, plan.durationDays),
      pricePaid: payload.pricePaid,
      paymentMethod: payload.paymentMethod,
      note: payload.note,
      createdByLabel: identity.user.email
    });

    await auditMembershipChange(context, identity, 'customer.membership.activated', 'customer_membership', membership.id, {
      customerId,
      planId: plan.id,
      startDate: membership.startDate,
      endDate: membership.endDate,
      pricePaid: membership.pricePaid,
      paymentMethod: payload.paymentMethod,
      transactionId: membership.transaction?.id
    });

    return created(membership);
  })
});

app.http('renewCustomerMembership', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/memberships/{customerMembershipId}/renew',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const customerMembershipId = parsePositiveInteger(request.params.customerMembershipId, 'customerMembershipId');
    const payload = validateMembershipRenewalPayload(await readJson(request));

    await assertCustomerBelongsToCompany(identity.company.id, customerId);
    const membership = await repository.getCustomerMembershipById(identity.company.id, customerId, customerMembershipId);
    if (!membership) {
      throw new ApiError(404, 'CUSTOMER_MEMBERSHIP_NOT_FOUND', 'Customer membership was not found.');
    }

    if (membership.status === 'cancelled') {
      throw new ApiError(409, 'CUSTOMER_MEMBERSHIP_CANCELLED', 'Cancelled memberships cannot be renewed.');
    }

    const plan = await repository.getMembershipPlanById(identity.company.id, membership.planId);
    const result = await repository.renewCustomerMembership(
      identity.company.id,
      customerId,
      membership,
      plan,
      payload,
      identity.user.email
    );

    await auditMembershipChange(context, identity, 'customer.membership.renewed', 'customer_membership', result.membership.id, {
      customerId,
      planId: plan.id,
      previousEndDate: membership.endDate,
      startDate: result.membership.startDate,
      endDate: result.membership.endDate,
      amount: payload.amount,
      paymentMethod: payload.paymentMethod,
      transactionId: result.transaction.id
    });

    return ok(result);
  })
});

app.http('listCustomerMemberships', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/memberships',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const filters = validateCustomerMembershipStatusQuery(new URL(request.url).searchParams);

    await assertCustomerBelongsToCompany(identity.company.id, customerId);
    const result = await repository.listCustomerMemberships(identity.company.id, customerId, filters);
    return ok(result);
  })
});

app.http('createMembershipBenefitUsage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/membership-benefit-usages',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const payload = validateMembershipBenefitUsagePayload(await readJson(request));

    await assertCustomerBelongsToCompany(identity.company.id, customerId);

    const activeMembership = await repository.getActiveCustomerMembership(identity.company.id, customerId);
    if (!activeMembership) {
      throw new ApiError(409, 'CUSTOMER_MEMBERSHIP_NOT_ACTIVE', 'Customer does not have an active membership.');
    }

    if (payload.customerMembershipId && payload.customerMembershipId !== Number(activeMembership.id)) {
      throw new ApiError(409, 'CUSTOMER_MEMBERSHIP_NOT_ACTIVE', 'Provided membership is not the customer active membership.');
    }

    const benefit = await repository.getMembershipBenefitById(identity.company.id, payload.benefitId);
    if (benefit.planId !== activeMembership.planId) {
      throw new ApiError(409, 'MEMBERSHIP_BENEFIT_NOT_IN_ACTIVE_PLAN', 'Membership benefit does not belong to the active membership plan.');
    }
    if (benefit.status !== 'active') {
      throw new ApiError(409, 'MEMBERSHIP_BENEFIT_INACTIVE', 'Membership benefit is inactive.');
    }

    const usage = await repository.createMembershipBenefitUsage(
      identity.company.id,
      customerId,
      activeMembership,
      benefit,
      payload,
      identity.user.email
    );

    await auditMembershipChange(context, identity, 'membership.benefit.used', 'membership_benefit_usage', usage.id, {
      customerId,
      customerMembershipId: activeMembership.id,
      benefitId: benefit.id,
      usageDate: usage.usageDate,
      quantity: usage.quantity
    });

    return created(usage);
  })
});

app.http('listMembershipBenefitUsages', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/membership-benefit-usages',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const filters = validateMembershipBenefitUsageQuery(new URL(request.url).searchParams);

    await assertCustomerBelongsToCompany(identity.company.id, customerId);
    const result = await repository.listMembershipBenefitUsages(identity.company.id, customerId, filters);
    return ok(result);
  })
});

app.http('listMembershipTransactions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'customers/{customerId}/membership-transactions',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const customerId = parsePositiveInteger(request.params.customerId, 'customerId');
    const filters = validateMembershipTransactionsQuery(new URL(request.url).searchParams);

    await assertCustomerBelongsToCompany(identity.company.id, customerId);
    const result = await repository.listMembershipTransactions(identity.company.id, customerId, filters);
    return ok(result);
  })
});

app.http('listMembershipExpirationAlerts', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'memberships/expiration-alerts',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const filters = validateExpirationAlertsQuery(new URL(request.url).searchParams);
    const result = await repository.listMembershipExpirationAlerts(identity.company.id, filters);
    return ok(result);
  })
});
