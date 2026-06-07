const test = require('node:test');
const assert = require('node:assert/strict');

const { serializeMetadata } = require('../src/lib/audit');

test('serializeMetadata returns null for absent metadata', () => {
  assert.equal(serializeMetadata(null), null);
  assert.equal(serializeMetadata(undefined), null);
});

test('serializeMetadata returns valid JSON without secrets by convention', () => {
  const metadata = serializeMetadata({
    invoiceNumber: 'FAC-1001',
    pointsEarned: 50,
    emailProvided: true
  });

  assert.deepEqual(JSON.parse(metadata), {
    invoiceNumber: 'FAC-1001',
    pointsEarned: 50,
    emailProvided: true
  });
});
