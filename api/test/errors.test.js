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
