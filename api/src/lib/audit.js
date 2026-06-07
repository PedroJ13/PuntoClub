const { getPool, getSql } = require('./db');

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

module.exports = {
  auditBestEffort,
  recordAuditEvent,
  serializeMetadata
};
