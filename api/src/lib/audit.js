const { getPool, getSql } = require('./db');
const { toApiId, toIsoTimestamp } = require('./repository');

function serializeMetadata(metadata) {
  if (metadata == null) {
    return null;
  }

  return JSON.stringify(metadata);
}

async function recordAuditEvent({
  companyId,
  eventType,
  entityType,
  entityId = null,
  customerId = null,
  actorLabel = null,
  source = 'api',
  metadata = null
}) {
  const sql = getSql();
  const pool = await getPool();
  await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('event_type', sql.VarChar(80), eventType)
    .input('entity_type', sql.VarChar(40), entityType)
    .input('entity_id', sql.BigInt, entityId)
    .input('customer_id', sql.BigInt, customerId)
    .input('actor_label', sql.NVarChar(120), actorLabel)
    .input('source', sql.VarChar(40), source)
    .input('metadata', sql.NVarChar(sql.MAX), serializeMetadata(metadata))
    .query(`
      INSERT INTO dbo.OperationalAuditEvents (
        company_id,
        event_type,
        entity_type,
        entity_id,
        customer_id,
        actor_label,
        source,
        metadata
      )
      VALUES (
        @company_id,
        @event_type,
        @entity_type,
        @entity_id,
        @customer_id,
        @actor_label,
        @source,
        @metadata
      )
    `);
}

async function auditBestEffort(context, event) {
  try {
    await recordAuditEvent(event);
  } catch (error) {
    const message = error && error.message ? error.message : 'Unknown audit error.';
    if (context && typeof context.warn === 'function') {
      context.warn(`Audit event was not recorded: ${event.eventType}. ${message}`);
    }
  }
}

function parseMetadata(metadata) {
  if (!metadata) {
    return null;
  }

  try {
    return JSON.parse(metadata);
  } catch {
    return null;
  }
}

function formatAuditEvent(row) {
  return {
    id: toApiId(row.id),
    occurredAt: toIsoTimestamp(row.occurred_at),
    eventType: row.event_type,
    entityType: row.entity_type,
    entityId: toApiId(row.entity_id),
    customerId: toApiId(row.customer_id),
    customerName: row.customer_name || null,
    actorLabel: row.actor_label,
    source: row.source,
    metadata: parseMetadata(row.metadata)
  };
}

async function listAuditEvents(companyId, filters) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('from', sql.Date, filters.from)
    .input('to', sql.Date, filters.to)
    .input('limit', sql.Int, filters.limit)
    .query(`
      SELECT TOP (@limit)
        audit.id,
        audit.occurred_at,
        audit.event_type,
        audit.entity_type,
        audit.entity_id,
        audit.customer_id,
        customers.name AS customer_name,
        audit.actor_label,
        audit.source,
        audit.metadata
      FROM dbo.OperationalAuditEvents AS audit
      LEFT JOIN dbo.Customers AS customers
        ON customers.company_id = audit.company_id
       AND customers.id = audit.customer_id
      WHERE audit.company_id = @company_id
        AND audit.occurred_at >= CONVERT(datetime2(0), @from)
        AND audit.occurred_at < DATEADD(day, 1, CONVERT(datetime2(0), @to))
      ORDER BY audit.occurred_at DESC, audit.id DESC
    `);

  return {
    from: filters.from,
    to: filters.to,
    limit: filters.limit,
    items: result.recordset.map(formatAuditEvent)
  };
}

module.exports = {
  auditBestEffort,
  formatAuditEvent,
  listAuditEvents,
  parseMetadata,
  recordAuditEvent,
  serializeMetadata
};
