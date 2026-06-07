const test = require('node:test');
const assert = require('node:assert/strict');

const { mapCompanySettings, toApiId, toIsoTimestamp } = require('../src/lib/repository');

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
      status: 'active',
      updatedAt: '2026-06-02T15:20:00.000Z'
    }
  );
});
