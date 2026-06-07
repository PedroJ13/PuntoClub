const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError } = require('../src/lib/errors');
const {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
} = require('../src/lib/companyRegistration');

test('formatCompanyRegistrationCreatedResponse returns public submission contract', () => {
  assert.deepEqual(
    formatCompanyRegistrationCreatedResponse({
      id: '123',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyAddress: 'San Jose',
      status: 'pending',
      createdAt: '2026-06-07T18:30:00.000Z',
      contactEmail: 'owner@cafecentral.test'
    }),
    {
      id: '123',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyAddress: 'San Jose',
      status: 'pending',
      createdAt: '2026-06-07T18:30:00.000Z',
      message: 'Company registration request received.'
    }
  );
});

test('formatCompanyRegistrationRejectedResponse returns compact review contract', () => {
  assert.deepEqual(
    formatCompanyRegistrationRejectedResponse({
      id: '123',
      status: 'rejected',
      reviewedAt: '2026-06-07T19:00:00.000Z',
      reviewNote: 'Missing business data.'
    }),
    {
      id: '123',
      status: 'rejected',
      reviewedAt: '2026-06-07T19:00:00.000Z'
    }
  );
});

test('assertCompanyRegistrationReviewEnabled blocks review endpoints by default', () => {
  assert.throws(
    () => assertCompanyRegistrationReviewEnabled({}),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );

  assert.doesNotThrow(() => assertCompanyRegistrationReviewEnabled({ COMPANY_REGISTRATION_REVIEW_ENABLED: 'true' }));
});

test('getCompanyRegistrationReviewActorLabel defaults and trims configured actor', () => {
  assert.equal(getCompanyRegistrationReviewActorLabel({}), 'internal');
  assert.equal(getCompanyRegistrationReviewActorLabel({ COMPANY_REGISTRATION_REVIEW_ACTOR_LABEL: ' Admin API ' }), 'Admin API');
});

test('formatCompanyRegistrationApprovedAuditEvent builds approved audit payload', () => {
  assert.deepEqual(
    formatCompanyRegistrationApprovedAuditEvent(
      {
        id: '123',
        reviewedByLabel: 'Admin API',
        company: {
          id: '456'
        }
      },
      { invocationId: 'invocation-1' }
    ),
    {
      companyId: '456',
      eventType: 'company.registration.approved',
      entityType: 'company_registration_request',
      entityId: '123',
      actorLabel: 'Admin API',
      metadata: {
        approvedCompanyId: '456',
        requestId: 'invocation-1'
      }
    }
  );
});
