-- Read-only report for one legacy import batch.
-- Set @import_batch_id before running.

DECLARE @import_batch_id uniqueidentifier = NULL;

IF @import_batch_id IS NULL
BEGIN
    THROW 51100, 'Set @import_batch_id before running legacy import report.', 1;
END;

SELECT *
FROM dbo.LegacyImportBatchSummary
WHERE import_batch_id = @import_batch_id;

SELECT
    severity,
    code,
    COUNT(*) AS count
FROM dbo.LegacyImportValidationMessages
WHERE import_batch_id = @import_batch_id
GROUP BY severity, code
ORDER BY
    CASE severity
        WHEN 'error' THEN 1
        WHEN 'warning' THEN 2
        ELSE 3
    END,
    code;

SELECT
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message,
    created_at
FROM dbo.LegacyImportValidationMessages
WHERE import_batch_id = @import_batch_id
ORDER BY
    CASE severity
        WHEN 'error' THEN 1
        WHEN 'warning' THEN 2
        ELSE 3
    END,
    source_file,
    source_row_number,
    id;
