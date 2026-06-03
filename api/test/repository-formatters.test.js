const test = require('node:test');
const assert = require('node:assert/strict');

const { toApiId, toIsoTimestamp } = require('../src/lib/repository');

test('toApiId serializes bigint identifiers as strings', () => {
  assert.equal(toApiId(10), '10');
  assert.equal(toApiId('9007199254740993'), '9007199254740993');
  assert.equal(toApiId(null), null);
});

test('toIsoTimestamp serializes Date values as complete UTC timestamps', () => {
  assert.equal(toIsoTimestamp(new Date('2026-06-02T15:20:00Z')), '2026-06-02T15:20:00.000Z');
});
