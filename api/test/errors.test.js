const test = require('node:test');
const assert = require('node:assert/strict');

const { mapSqlError } = require('../src/lib/errors');

test('maps duplicate invoice SQL errors to API conflict', () => {
  const error = mapSqlError({ number: 2601, message: 'Cannot insert duplicate key row in object with unique index UX_Purchases_company_invoice.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'DUPLICATE_INVOICE');
});

test('maps duplicate customer SQL errors to API conflict', () => {
  const error = mapSqlError({ number: 2627, message: 'Violation of UNIQUE KEY constraint UX_Customers_company_phone.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'DUPLICATE_CUSTOMER');
});

test('maps RegisterRedemption insufficient balance to conflict', () => {
  const error = mapSqlError({ number: 50003, message: 'Insufficient point balance.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'INSUFFICIENT_POINTS');
});

test('maps company email duplicate to company conflict', () => {
  const error = mapSqlError({ number: 2601, message: 'Cannot insert duplicate key row with unique index UX_Companies_email.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'COMPANY_ALREADY_EXISTS');
});

test('maps pending registration duplicate to pending conflict', () => {
  const error = mapSqlError({ number: 2601, message: 'Cannot insert duplicate key row with unique index UX_CompanyRegistrationRequests_pending_company_email.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'REGISTRATION_ALREADY_PENDING');
});

test('maps pending invitation duplicate to pending conflict', () => {
  const error = mapSqlError({ number: 2627, message: 'Violation of UNIQUE KEY constraint UX_CompanyInvitations_pending_company_email.' });
  assert.equal(error.status, 409);
  assert.equal(error.code, 'INVITATION_ALREADY_PENDING');
});

test('maps company user duplicates to user conflict', () => {
  const byEmail = mapSqlError({ number: 2601, message: 'Cannot insert duplicate key row with unique index UX_CompanyUsers_company_email.' });
  assert.equal(byEmail.status, 409);
  assert.equal(byEmail.code, 'COMPANY_USER_ALREADY_EXISTS');

  const bySubject = mapSqlError({ number: 2627, message: 'Violation of UNIQUE KEY constraint UX_CompanyUsers_auth_subject.' });
  assert.equal(bySubject.status, 409);
  assert.equal(bySubject.code, 'COMPANY_USER_ALREADY_EXISTS');
});

test('maps transient SQL availability errors to service unavailable', () => {
  const unavailable = mapSqlError({
    code: 'ELOGIN',
    message: "Database 'sql-db-puntoclub' on server 'sqlserver-pj13-brazil.database.windows.net' is not currently available."
  });
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.code, 'SERVICE_UNAVAILABLE');

  const timeout = mapSqlError({ code: 'ETIMEOUT', message: 'Connection timeout.' });
  assert.equal(timeout.status, 503);
  assert.equal(timeout.code, 'SERVICE_UNAVAILABLE');
});
