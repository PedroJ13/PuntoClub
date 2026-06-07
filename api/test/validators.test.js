const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculatePointsEarned,
  validateActivityReportQuery,
  validateCustomerPayload,
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
