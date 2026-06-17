const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateExpirationAlert,
  calculateMembershipEndDate,
  calculateUsagePeriodStartDate,
  mapCompanyInvitation,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
  mapCompanyUser,
  mapCustomerMembership,
  mapMembershipBenefit,
  mapMembershipBenefitUsage,
  mapMembershipExpirationAlert,
  mapMembershipFinancialReportTransaction,
  mapMembershipPlan,
  mapMembershipTransaction,
  mapMyCompany,
  toApiId,
  toIsoTimestamp
} = require('../src/lib/repository');

test('toApiId serializes bigint identifiers as strings', () => {
  assert.equal(toApiId(10), '10');
  assert.equal(toApiId('9007199254740993'), '9007199254740993');
  assert.equal(toApiId(null), null);
});

test('toIsoTimestamp serializes Date values as complete UTC timestamps', () => {
  assert.equal(toIsoTimestamp(new Date('2026-06-02T15:20:00Z')), '2026-06-02T15:20:00.000Z');
});

test('mapCompanySettings serializes SQL row to API contract', () => {
  assert.deepEqual(
    mapCompanySettings({
      id: 1,
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      logo_url: 'https://example.com/logo.png',
      points_percentage: '5.00',
      loyalty_points_enabled: true,
      loyalty_memberships_enabled: false,
      status: 'active',
      updated_at: new Date('2026-06-02T15:20:00Z')
    }),
    {
      id: '1',
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      logoUrl: 'https://example.com/logo.png',
      pointsPercentage: 5,
      loyaltyPointsEnabled: true,
      loyaltyMembershipsEnabled: false,
      status: 'active',
      updatedAt: '2026-06-02T15:20:00.000Z'
    }
  );
});

test('mapCompanyRegistrationRequest serializes SQL row to API contract', () => {
  assert.deepEqual(
    mapCompanyRegistrationRequest({
      id: 200,
      company_name: 'Cafe Central',
      company_email: 'hola@cafecentral.test',
      company_phone: '+50622223333',
      company_address: 'San Jose',
      contact_name: 'Maria Soto',
      contact_email: 'maria@cafecentral.test',
      contact_phone: null,
      requested_logo_blob_path: 'registration-requests/200/logo/logo-id.png',
      requested_logo_content_type: 'image/png',
      status: 'pending',
      reviewed_at: null,
      reviewed_by_label: null,
      review_note: null,
      approved_company_id: null,
      created_at: new Date('2026-06-07T18:30:00Z'),
      updated_at: new Date('2026-06-07T18:30:00Z')
    }),
    {
      id: '200',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyPhone: '+50622223333',
      companyAddress: 'San Jose',
      contactName: 'Maria Soto',
      contactEmail: 'maria@cafecentral.test',
      contactPhone: null,
      requestedLogo: {
        available: true,
        contentType: 'image/png'
      },
      status: 'pending',
      reviewedAt: null,
      reviewedByLabel: null,
      reviewNote: null,
      approvedCompanyId: null,
      createdAt: '2026-06-07T18:30:00.000Z',
      updatedAt: '2026-06-07T18:30:00.000Z'
    }
  );
});

test('mapCompanyInvitation serializes SQL row without token data', () => {
  assert.deepEqual(
    mapCompanyInvitation({
      id: 300,
      company_id: 10,
      registration_request_id: 200,
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expires_at: new Date('2026-06-14T19:00:00Z'),
      accepted_at: null,
      revoked_at: null,
      created_at: new Date('2026-06-07T19:00:00Z'),
      created_by_label: 'internal'
    }),
    {
      id: '300',
      companyId: '10',
      registrationRequestId: '200',
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expiresAt: '2026-06-14T19:00:00.000Z',
      acceptedAt: null,
      revokedAt: null,
      createdAt: '2026-06-07T19:00:00.000Z',
      createdByLabel: 'internal'
    }
  );
});

test('mapCompanyUser serializes SQL row without external subject', () => {
  assert.deepEqual(
    mapCompanyUser({
      id: 400,
      company_id: 10,
      email: 'owner@cafecentral.test',
      display_name: 'Maria Soto',
      role: 'owner',
      status: 'active',
      auth_provider: 'entra_external_id',
      external_subject: 'not-exposed',
      last_login_at: null,
      created_at: new Date('2026-06-07T20:10:00Z'),
      updated_at: new Date('2026-06-07T20:10:00Z')
    }),
    {
      id: '400',
      companyId: '10',
      email: 'owner@cafecentral.test',
      displayName: 'Maria Soto',
      role: 'owner',
      status: 'active',
      authProvider: 'entra_external_id',
      lastLoginAt: null,
      createdAt: '2026-06-07T20:10:00.000Z',
      updatedAt: '2026-06-07T20:10:00.000Z'
    }
  );
});

test('mapMyCompany exposes controlled logo URL and hides blob path', () => {
  assert.deepEqual(
    mapMyCompany({
      id: 10,
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      address: 'San Jose',
      logo_blob_path: 'companies/10/logo/logo.png',
      logo_content_type: 'image/png',
      logo_updated_at: new Date('2026-06-07T20:20:00Z'),
      points_percentage: '5.00',
      loyalty_points_enabled: true,
      loyalty_memberships_enabled: true,
      status: 'active',
      updated_at: new Date('2026-06-07T20:20:00Z')
    }),
    {
      id: '10',
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      address: 'San Jose',
      logoUrl: '/api/my-company/logo',
      logoContentType: 'image/png',
      logoUpdatedAt: '2026-06-07T20:20:00.000Z',
      pointsPercentage: 5,
      loyaltyPointsEnabled: true,
      loyaltyMembershipsEnabled: true,
      status: 'active',
      updatedAt: '2026-06-07T20:20:00.000Z'
    }
  );
});

test('mapMembershipPlan serializes SQL row to API contract', () => {
  assert.deepEqual(
    mapMembershipPlan({
      id: 500,
      company_id: 10,
      name: 'Club Oro',
      description: 'Beneficios premium',
      duration_days: 30,
      price: '12000.00',
      renewal_notice_days: 5,
      status: 'active',
      benefit_count: 2,
      created_at: new Date('2026-06-13T10:00:00Z'),
      updated_at: new Date('2026-06-13T10:30:00Z')
    }),
    {
      id: '500',
      companyId: '10',
      name: 'Club Oro',
      description: 'Beneficios premium',
      durationDays: 30,
      price: 12000,
      renewalNoticeDays: 5,
      status: 'active',
      benefitCount: 2,
      createdAt: '2026-06-13T10:00:00.000Z',
      updatedAt: '2026-06-13T10:30:00.000Z'
    }
  );
});

test('mapMembershipBenefit serializes optional numeric fields', () => {
  assert.deepEqual(
    mapMembershipBenefit({
      id: 700,
      membership_plan_id: 500,
      name: 'Cafe mensual',
      description: null,
      benefit_type: 'allowance',
      applies_to_type: 'product',
      applies_to_name: 'Cafe frio',
      discount_percent: null,
      included_quantity: '2.00',
      usage_limit: 2,
      usage_period: 'month',
      status: 'active',
      created_at: new Date('2026-06-13T11:00:00Z'),
      updated_at: new Date('2026-06-13T11:00:00Z')
    }),
    {
      id: '700',
      planId: '500',
      name: 'Cafe mensual',
      description: null,
      benefitType: 'allowance',
      appliesToType: 'product',
      appliesToName: 'Cafe frio',
      discountPercent: null,
      includedQuantity: 2,
      usageLimit: 2,
      usagePeriod: 'month',
      status: 'active',
      createdAt: '2026-06-13T11:00:00.000Z',
      updatedAt: '2026-06-13T11:00:00.000Z'
    }
  );
});

test('calculateMembershipEndDate uses an inclusive membership term', () => {
  assert.equal(calculateMembershipEndDate('2026-06-13', 30), '2026-07-12');
});

test('calculateExpirationAlert classifies date-only expiration windows', () => {
  const today = new Date('2026-06-13T12:00:00Z');

  assert.deepEqual(calculateExpirationAlert('2026-06-20', { today, warningDays: 5 }), {
    state: 'none',
    daysUntilExpiration: 7,
    message: null
  });
  assert.deepEqual(calculateExpirationAlert('2026-06-18', { today, warningDays: 5 }), {
    state: 'expiring_soon',
    daysUntilExpiration: 5,
    message: 'La membresia vence en 5 dias.'
  });
  assert.deepEqual(calculateExpirationAlert('2026-06-13', { today, warningDays: 5 }), {
    state: 'expires_today',
    daysUntilExpiration: 0,
    message: 'La membresia vence hoy.'
  });
  assert.deepEqual(calculateExpirationAlert('2026-06-12', { today, warningDays: 5 }), {
    state: 'expired',
    daysUntilExpiration: -1,
    message: 'La membresia esta vencida.'
  });
});

test('calculateUsagePeriodStartDate derives ledger grouping dates', () => {
  assert.equal(calculateUsagePeriodStartDate('2026-06-17', 'day', '2026-06-13'), '2026-06-17');
  assert.equal(calculateUsagePeriodStartDate('2026-06-17', 'week', '2026-06-13'), '2026-06-15');
  assert.equal(calculateUsagePeriodStartDate('2026-06-21', 'week', '2026-06-13'), '2026-06-15');
  assert.equal(calculateUsagePeriodStartDate('2026-06-17', 'month', '2026-06-13'), '2026-06-01');
  assert.equal(calculateUsagePeriodStartDate('2026-06-17', 'membership_term', '2026-06-13'), '2026-06-13');
});

test('mapCustomerMembership serializes plan and expiration alert', () => {
  assert.deepEqual(
    mapCustomerMembership({
      id: 900,
      company_id: 10,
      customer_id: 20,
      membership_plan_id: 500,
      plan_name: 'Club Oro',
      renewal_notice_days: 5,
      start_date: new Date('2026-06-13T00:00:00Z'),
      end_date: new Date('2026-06-18T00:00:00Z'),
      status: 'active',
      price_paid: '12000.00',
      created_at: new Date('2026-06-13T10:00:00Z'),
      cancelled_at: null,
      cancelled_by_label: null,
      cancel_note: null
    }, { today: new Date('2026-06-13T12:00:00Z') }),
    {
      id: '900',
      companyId: '10',
      customerId: '20',
      planId: '500',
      membershipPlanId: '500',
      planName: 'Club Oro',
      plan: {
        id: '500',
        name: 'Club Oro'
      },
      startDate: '2026-06-13',
      endDate: '2026-06-18',
      status: 'active',
      pricePaid: 12000,
      expirationAlert: {
        state: 'expiring_soon',
        daysUntilExpiration: 5,
        message: 'La membresia vence en 5 dias.'
      },
      createdAt: '2026-06-13T10:00:00.000Z',
      cancelledAt: null,
      cancelledByLabel: null,
      cancelNote: null
    }
  );
});

test('mapMembershipBenefitUsage serializes ledger rows', () => {
  assert.deepEqual(
    mapMembershipBenefitUsage({
      id: 1000,
      company_id: 10,
      customer_id: 20,
      customer_membership_id: 900,
      membership_benefit_id: 700,
      benefit_name: 'Cafe mensual',
      benefit_type: 'allowance',
      membership_plan_id: 500,
      plan_name: 'Club Oro',
      usage_date: new Date('2026-06-13T00:00:00Z'),
      usage_period_start_date: new Date('2026-06-01T00:00:00Z'),
      quantity: 1,
      note: 'Cafe entregado',
      used_at: new Date('2026-06-13T14:00:00Z'),
      created_by_label: 'owner@cafecentral.test'
    }),
    {
      id: '1000',
      companyId: '10',
      customerId: '20',
      customerMembershipId: '900',
      benefitId: '700',
      membershipBenefitId: '700',
      benefitName: 'Cafe mensual',
      benefitType: 'allowance',
      planId: '500',
      membershipPlanId: '500',
      planName: 'Club Oro',
      usageDate: '2026-06-13',
      usagePeriodStartDate: '2026-06-01',
      quantity: 1,
      note: 'Cafe entregado',
      usedAt: '2026-06-13T14:00:00.000Z',
      createdByLabel: 'owner@cafecentral.test'
    }
  );
});

test('mapMembershipExpirationAlert serializes customer-facing alert rows', () => {
  assert.deepEqual(
    mapMembershipExpirationAlert({
      id: 900,
      company_id: 10,
      customer_id: 20,
      membership_plan_id: 500,
      customer_name: 'Maria Soto',
      customer_phone: '+50688887777',
      customer_email: 'maria@example.test',
      plan_name: 'Club Oro',
      start_date: new Date('2026-05-15T00:00:00Z'),
      end_date: new Date('2026-06-13T00:00:00Z'),
      status: 'active'
    }, { today: new Date('2026-06-13T12:00:00Z'), withinDays: 5 }),
    {
      id: '900',
      companyId: '10',
      customerId: '20',
      customerName: 'Maria Soto',
      customerPhone: '+50688887777',
      customerEmail: 'maria@example.test',
      customerMembershipId: '900',
      planId: '500',
      membershipPlanId: '500',
      planName: 'Club Oro',
      startDate: '2026-05-15',
      endDate: '2026-06-13',
      status: 'active',
      daysUntilExpiration: 0,
      state: 'expires_today',
      message: 'La membresia vence hoy.'
    }
  );
});

test('mapMembershipTransaction serializes economic ledger rows', () => {
  assert.deepEqual(
    mapMembershipTransaction({
      id: 1100,
      company_id: 10,
      customer_id: 20,
      customer_membership_id: 900,
      membership_plan_id: 500,
      plan_name: 'Club Oro',
      transaction_type: 'renewal',
      payment_method: 'card',
      amount: '15000.00',
      transaction_date: new Date('2026-06-14T00:00:00Z'),
      note: 'Renovacion mensual',
      created_at: new Date('2026-06-14T15:00:00Z'),
      created_by_label: 'owner@cafecentral.test'
    }),
    {
      id: '1100',
      companyId: '10',
      customerId: '20',
      customerMembershipId: '900',
      planId: '500',
      membershipPlanId: '500',
      planName: 'Club Oro',
      transactionType: 'renewal',
      paymentMethod: 'card',
      amount: 15000,
      transactionDate: '2026-06-14',
      note: 'Renovacion mensual',
      createdAt: '2026-06-14T15:00:00.000Z',
      createdByLabel: 'owner@cafecentral.test'
    }
  );
});

test('mapMembershipFinancialReportTransaction keeps zero amount and customer fields', () => {
  assert.deepEqual(
    mapMembershipFinancialReportTransaction({
      id: 1101,
      customer_id: 20,
      customer_name: 'Maria Soto',
      customer_phone: '+50688887777',
      customer_email: 'maria@example.test',
      customer_membership_id: 901,
      membership_plan_id: 500,
      plan_name: 'Club Oro',
      transaction_type: 'new_membership',
      payment_method: 'cash',
      amount: '0.00',
      transaction_date: new Date('2026-06-14T00:00:00Z'),
      created_at: new Date('2026-06-14T15:05:00Z'),
      note: null
    }),
    {
      id: '1101',
      customerId: '20',
      customerName: 'Maria Soto',
      customerPhone: '+50688887777',
      customerEmail: 'maria@example.test',
      customerMembershipId: '901',
      planId: '500',
      membershipPlanId: '500',
      planName: 'Club Oro',
      transactionType: 'new_membership',
      paymentMethod: 'cash',
      amount: 0,
      transactionDate: '2026-06-14',
      createdAt: '2026-06-14T15:05:00.000Z',
      note: null
    }
  );
});
