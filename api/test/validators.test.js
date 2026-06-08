const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculatePointsEarned,
  isAllowedCompanyStatus,
  isAllowedCompanyUserStatus,
  isAllowedInvitationStatus,
  isAllowedRegistrationRequestStatus,
  normalizeEmail,
  validateAuditEventsQuery,
  validateActivityReportQuery,
  validateCompanyInvitationPayload,
  validateCompanyRegistrationRequestPayload,
  validateCompanyRegistrationReviewPayload,
  validateCompanyRole,
  validateCompanySettingsPatchPayload,
  validateCompanyAuthLoginPayload,
  validateCustomerPayload,
  validateInvitationAcceptPayload,
  validateLogoFileMetadata,
  validateMyCompanyPatchPayload,
  validatePurchasePayload,
  validateRedemptionPayload
} = require('../src/lib/validators');

function query(values) {
  return new URLSearchParams(values);
}

test('calculatePointsEarned rounds server-side', () => {
  assert.equal(calculatePointsEarned(25000, 5), 1250);
  assert.equal(calculatePointsEarned(99.99, 5), 5);
});

test('purchase payload rejects frontend pointsEarned', () => {
  assert.throws(
    () => validatePurchasePayload({
      customerId: 1,
      invoiceNumber: 'FAC-1',
      purchaseDate: '2026-06-02',
      amount: 1000,
      pointsEarned: 50
    }),
    /One or more fields are invalid/
  );
});

test('customer payload normalizes optional email', () => {
  assert.deepEqual(
    validateCustomerPayload({ name: ' Maria ', phone: ' 8888 ', email: '' }),
    { name: 'Maria', phone: '8888', email: null }
  );
});

test('normalizeEmail trims and lowercases email values', () => {
  assert.equal(normalizeEmail('  HOLA@CafeCentral.TEST '), 'hola@cafecentral.test');
  assert.equal(normalizeEmail(''), '');
});

test('company registration request requires address and normalizes emails', () => {
  assert.deepEqual(
    validateCompanyRegistrationRequestPayload({
      companyName: ' Cafe Central ',
      companyEmail: ' HOLA@CafeCentral.TEST ',
      companyPhone: ' +50622223333 ',
      companyAddress: ' San Jose ',
      contactName: ' Maria ',
      contactEmail: ' MARIA@CafeCentral.TEST ',
      contactPhone: ''
    }),
    {
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyPhone: '+50622223333',
      companyAddress: 'San Jose',
      contactName: 'Maria',
      contactEmail: 'maria@cafecentral.test',
      contactPhone: null
    }
  );
});

test('company registration request rejects forbidden fields', () => {
  assert.throws(
    () => validateCompanyRegistrationRequestPayload({
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyAddress: 'San Jose',
      contactEmail: 'maria@cafecentral.test',
      requestedLogoUrl: 'https://example.com/logo.png',
      companyId: '1',
      password: 'secret'
    }),
    /One or more fields are invalid/
  );
});

test('company registration review validates approve and reject payloads', () => {
  assert.deepEqual(
    validateCompanyRegistrationReviewPayload({ reviewNote: ' ok ', pointsPercentage: '6.5' }, 'approve'),
    { reviewNote: 'ok', pointsPercentage: 6.5 }
  );

  assert.throws(
    () => validateCompanyRegistrationReviewPayload({}, 'reject'),
    /One or more fields are invalid/
  );
});

test('company invitation payload validates role and normalizes email', () => {
  assert.deepEqual(
    validateCompanyInvitationPayload({
      companyId: '10',
      registrationRequestId: '200',
      email: ' OWNER@CafeCentral.TEST ',
      role: 'owner'
    }),
    {
      companyId: 10,
      registrationRequestId: 200,
      email: 'owner@cafecentral.test',
      role: 'owner'
    }
  );

  assert.throws(
    () => validateCompanyInvitationPayload({ companyId: 10, email: 'owner@example.com', role: 'superadmin' }),
    /One or more fields are invalid/
  );
});

test('company role and status helpers constrain known values', () => {
  assert.equal(validateCompanyRole(undefined), 'owner');
  assert.equal(validateCompanyRole('staff'), 'staff');
  assert.throws(() => validateCompanyRole('superadmin'), /One or more fields are invalid/);
  assert.equal(isAllowedCompanyStatus('pending_activation'), true);
  assert.equal(isAllowedCompanyStatus('deleted'), false);
  assert.equal(isAllowedRegistrationRequestStatus('approved'), true);
  assert.equal(isAllowedInvitationStatus('revoked'), true);
  assert.equal(isAllowedCompanyUserStatus('disabled'), true);
});

test('invitation accept payload requires password and rejects frontend authority fields', () => {
  assert.deepEqual(
    validateInvitationAcceptPayload({ token: 'abc123', displayName: ' Maria ', password: 'Password123' }),
    { token: 'abc123', displayName: 'Maria', password: 'Password123' }
  );

  assert.throws(
    () => validateInvitationAcceptPayload({ token: 'abc123', password: 'short', externalSubject: 'sub', companyId: '10' }),
    /One or more fields are invalid/
  );
});

test('company auth login payload normalizes email and keeps password opaque', () => {
  assert.deepEqual(
    validateCompanyAuthLoginPayload({ email: ' OWNER@CafeCentral.TEST ', password: 'Password123' }),
    { email: 'owner@cafecentral.test', password: 'Password123' }
  );

  assert.throws(
    () => validateCompanyAuthLoginPayload({ email: 'bad', password: '' }),
    /One or more fields are invalid/
  );
});

test('my-company patch validates editable fields and rejects controlled fields', () => {
  assert.deepEqual(
    validateMyCompanyPatchPayload({
      name: ' Cafe Central ',
      phone: '',
      address: ' San Jose ',
      pointsPercentage: '8'
    }),
    {
      patch: {
        name: 'Cafe Central',
        phone: null,
        address: 'San Jose',
        pointsPercentage: 8
      },
      providedFields: ['name', 'phone', 'address', 'pointsPercentage']
    }
  );

  assert.throws(
    () => validateMyCompanyPatchPayload({ email: 'new@example.com', logoUrl: 'https://example.com/logo.png' }),
    /One or more fields are invalid/
  );
});

test('logo metadata validator accepts safe images and rejects svg or oversized files', () => {
  assert.deepEqual(
    validateLogoFileMetadata({ contentType: 'image/png', size: 512, filename: 'logo.png' }, { maxBytes: 1024 }),
    { contentType: 'image/png', size: 512, filename: 'logo.png' }
  );

  assert.throws(
    () => validateLogoFileMetadata({ contentType: 'image/svg+xml', size: 512, filename: 'logo.svg' }, { maxBytes: 1024 }),
    /One or more fields are invalid/
  );

  assert.throws(
    () => validateLogoFileMetadata({ contentType: 'image/jpeg', size: 2048, filename: 'logo.jpg' }, { maxBytes: 1024 }),
    /One or more fields are invalid/
  );
});

test('company settings patch normalizes editable fields', () => {
  assert.deepEqual(
    validateCompanySettingsPatchPayload({
      name: ' Cafe Central ',
      email: '',
      phone: ' +50622223333 ',
      logoUrl: null,
      pointsPercentage: '7.5'
    }),
    {
      patch: {
        name: 'Cafe Central',
        email: null,
        phone: '+50622223333',
        logoUrl: null,
        pointsPercentage: 7.5
      },
      providedFields: ['name', 'email', 'phone', 'logoUrl', 'pointsPercentage']
    }
  );
});

test('company settings patch validates percentage, email, phone and logo URL', () => {
  assert.throws(
    () => validateCompanySettingsPatchPayload({
      email: 'invalid',
      phone: '123',
      logoUrl: 'ftp://example.com/logo.png',
      pointsPercentage: 101
    }),
    /One or more fields are invalid/
  );
});

test('company settings patch requires at least one editable field', () => {
  assert.throws(
    () => validateCompanySettingsPatchPayload({}),
    /One or more fields are invalid/
  );
});

test('redemption payload requires positive integer points', () => {
  assert.throws(
    () => validateRedemptionPayload({
      customerId: 1,
      redemptionDate: '2026-06-02',
      pointsRedeemed: 0
    }),
    /One or more fields are invalid/
  );
});

test('activity report query defaults type to all', () => {
  assert.deepEqual(
    validateActivityReportQuery(query({ from: '2026-06-01', to: '2026-06-07' })),
    { from: '2026-06-01', to: '2026-06-07', type: 'all' }
  );
});

test('activity report query validates type', () => {
  assert.throws(
    () => validateActivityReportQuery(query({ from: '2026-06-01', to: '2026-06-07', type: 'refund' })),
    /One or more fields are invalid/
  );
});

test('activity report query validates date order and max range', () => {
  assert.throws(
    () => validateActivityReportQuery(query({ from: '2026-06-07', to: '2026-06-01' })),
    /One or more fields are invalid/
  );

  assert.throws(
    () => validateActivityReportQuery(query({ from: '2026-06-01', to: '2026-07-02' })),
    /One or more fields are invalid/
  );
});

test('audit events query defaults limit to 25', () => {
  assert.deepEqual(
    validateAuditEventsQuery(query({ from: '2026-06-01', to: '2026-06-07' })),
    { from: '2026-06-01', to: '2026-06-07', limit: 25 }
  );
});

test('audit events query validates allowed limits', () => {
  assert.deepEqual(
    validateAuditEventsQuery(query({ from: '2026-06-01', to: '2026-06-07', limit: '10' })),
    { from: '2026-06-01', to: '2026-06-07', limit: 10 }
  );

  assert.throws(
    () => validateAuditEventsQuery(query({ from: '2026-06-01', to: '2026-06-07', limit: '100' })),
    /One or more fields are invalid/
  );
});

test('audit events query validates date order and max range', () => {
  assert.throws(
    () => validateAuditEventsQuery(query({ from: '2026-06-07', to: '2026-06-01' })),
    /One or more fields are invalid/
  );

  assert.throws(
    () => validateAuditEventsQuery(query({ from: '2026-06-01', to: '2026-07-02' })),
    /One or more fields are invalid/
  );
});
