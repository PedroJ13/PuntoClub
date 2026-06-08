const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError } = require('../src/lib/errors');
const { assertCompanyInvitationManagementEnabled } = require('../src/lib/companyInvitations');
const { assertCompanyRegistrationReviewEnabled } = require('../src/lib/companyRegistration');
const {
  assertInternalAdminAuthorized,
  internalAdminHeaderName,
  tokensMatch
} = require('../src/lib/internalAdmin');

function makeRequest(token) {
  return {
    headers: {
      get(name) {
        return name === internalAdminHeaderName ? token : null;
      }
    }
  };
}

function assertRegistrationInternalAccess(request, env) {
  assertCompanyRegistrationReviewEnabled(env);
  assertInternalAdminAuthorized(request, env);
}

function assertInvitationInternalAccess(request, env) {
  assertCompanyInvitationManagementEnabled(env);
  assertInternalAdminAuthorized(request, env);
}

test('tokensMatch requires non-empty equal tokens without exposing values', () => {
  assert.equal(tokensMatch('secret-token', 'secret-token'), true);
  assert.equal(tokensMatch('secret-token', 'wrong-token'), false);
  assert.equal(tokensMatch('', 'secret-token'), false);
  assert.equal(tokensMatch('secret-token', ''), false);
});

test('registration internal access rejects when feature flag is disabled', () => {
  assert.throws(
    () => assertRegistrationInternalAccess(makeRequest('secret-token'), {
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('registration internal access rejects enabled flag without token', () => {
  assert.throws(
    () => assertRegistrationInternalAccess(makeRequest(null), {
      COMPANY_REGISTRATION_REVIEW_ENABLED: 'true',
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('registration internal access rejects enabled flag with wrong token', () => {
  assert.throws(
    () => assertRegistrationInternalAccess(makeRequest('wrong-token'), {
      COMPANY_REGISTRATION_REVIEW_ENABLED: 'true',
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('registration internal access allows enabled flag with correct token', () => {
  assert.doesNotThrow(() => assertRegistrationInternalAccess(makeRequest('secret-token'), {
    COMPANY_REGISTRATION_REVIEW_ENABLED: 'true',
    INTERNAL_ADMIN_TOKEN: 'secret-token'
  }));
});

test('invitation internal access rejects when feature flag is disabled', () => {
  assert.throws(
    () => assertInvitationInternalAccess(makeRequest('secret-token'), {
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('invitation internal access rejects enabled flag without token', () => {
  assert.throws(
    () => assertInvitationInternalAccess(makeRequest(null), {
      COMPANY_INVITATION_MANAGEMENT_ENABLED: 'true',
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('invitation internal access rejects enabled flag with wrong token', () => {
  assert.throws(
    () => assertInvitationInternalAccess(makeRequest('wrong-token'), {
      COMPANY_INVITATION_MANAGEMENT_ENABLED: 'true',
      INTERNAL_ADMIN_TOKEN: 'secret-token'
    }),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );
});

test('invitation internal access allows enabled flag with correct token', () => {
  assert.doesNotThrow(() => assertInvitationInternalAccess(makeRequest('secret-token'), {
    COMPANY_INVITATION_MANAGEMENT_ENABLED: 'true',
    INTERNAL_ADMIN_TOKEN: 'secret-token'
  }));
});
