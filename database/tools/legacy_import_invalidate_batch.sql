-- Logical rollback/invalidation for one legacy import batch.
-- Set @import_batch_id, @invalidated_by_label, and @invalidation_note before running.
-- This script does not delete staging rows and does not touch operational tables.

DECLARE @import_batch_id uniqueidentifier = NULL;
DECLARE @invalidated_by_label nvarchar(160) = NULL;
DECLARE @invalidation_note nvarchar(500) = NULL;

IF @import_batch_id IS NULL
BEGIN
    THROW 51200, 'Set @import_batch_id before invalidating a legacy import batch.', 1;
END;

IF NULLIF(LTRIM(RTRIM(COALESCE(@invalidation_note, ''))), '') IS NULL
BEGIN
    THROW 51201, 'Set @invalidation_note before invalidating a legacy import batch.', 1;
END;

BEGIN TRANSACTION;

UPDATE dbo.LegacyImportBatches
SET
    import_status = 'invalidated',
    invalidated_at = SYSUTCDATETIME(),
    invalidated_by_label = @invalidated_by_label,
    invalidation_note = @invalidation_note
WHERE import_batch_id = @import_batch_id
  AND import_status <> 'applied';

IF @@ROWCOUNT = 0
BEGIN
    ROLLBACK TRANSACTION;
    THROW 51202, 'Batch was not found or was already applied. Applied batches require a separate approved compensation plan.', 1;
END;

UPDATE dbo.LegacyImportCustomerRows
SET import_status = 'rejected'
WHERE import_batch_id = @import_batch_id
  AND import_status <> 'applied';

UPDATE dbo.LegacyImportMovementRows
SET import_status = 'rejected'
WHERE import_batch_id = @import_batch_id
  AND import_status <> 'applied';

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    severity,
    code,
    message
)
VALUES (
    @import_batch_id,
    'batch',
    'info',
    'BATCH_INVALIDATED',
    CONCAT('Batch invalidated logically. Reason: ', @invalidation_note)
);

COMMIT TRANSACTION;

SELECT *
FROM dbo.LegacyImportBatchSummary
WHERE import_batch_id = @import_batch_id;
