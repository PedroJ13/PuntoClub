const test = require('node:test');
const assert = require('node:assert/strict');

const { formatAuditEvent, parseMetadata, serializeMetadata } = require('../src/lib/audit');

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

test('parseMetadata returns parsed JSON or null', () => {
  assert.deepEqual(parseMetadata('{"reason":"duplicate"}'), { reason: 'duplicate' });
  assert.equal(parseMetadata(null), null);
  assert.equal(parseMetadata('not-json'), null);
});

test('formatAuditEvent serializes ids and parses metadata', () => {
  assert.deepEqual(
    formatAuditEvent({
      id: 7,
      occurred_at: new Date('2026-06-07T12:00:00Z'),
      event_type: 'purchase.registered',
      entity_type: 'purchase',
      entity_id: 50,
      customer_id: 10,
      customer_name: 'Maria Soto',
      actor_label: null,
      source: 'api',
      metadata: '{"invoiceNumber":"FAC-1001"}'
    }),
    {
      id: '7',
      occurredAt: '2026-06-07T12:00:00.000Z',
      eventType: 'purchase.registered',
      entityType: 'purchase',
      entityId: '50',
      customerId: '10',
      customerName: 'Maria Soto',
      actorLabel: null,
      source: 'api',
      metadata: { invoiceNumber: 'FAC-1001' }
    }
  );
});
