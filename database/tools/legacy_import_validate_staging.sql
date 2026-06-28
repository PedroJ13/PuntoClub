-- Validate one legacy import batch in staging.
-- Set @import_batch_id before running.
-- This script writes validation messages only to dbo.LegacyImportValidationMessages.
-- It does not modify operational tables.

DECLARE @import_batch_id uniqueidentifier = NULL;

IF @import_batch_id IS NULL
BEGIN
    THROW 51000, 'Set @import_batch_id before running legacy staging validation.', 1;
END;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.LegacyImportBatches
    WHERE import_batch_id = @import_batch_id
)
BEGIN
    THROW 51001, 'Legacy import batch does not exist.', 1;
END;

DELETE FROM dbo.LegacyImportValidationMessages
WHERE import_batch_id = @import_batch_id;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'batch',
    'info',
    'VALIDATION_STARTED',
    'Legacy import staging validation started.';

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'customer',
    'LegacyImportCustomerRows',
    id,
    source_file,
    source_row_number,
    'error',
    'CUSTOMER_MISSING_MATCH_IDENTIFIER',
    'Customer row must include at least one of legacy_customer_id, phone, or email.'
FROM dbo.LegacyImportCustomerRows
WHERE import_batch_id = @import_batch_id
  AND NULLIF(LTRIM(RTRIM(COALESCE(legacy_customer_id, ''))), '') IS NULL
  AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_phone, phone, ''))), '') IS NULL
  AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_email, email, ''))), '') IS NULL;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    rows.import_batch_id,
    'customer',
    'LegacyImportCustomerRows',
    rows.id,
    rows.source_file,
    rows.source_row_number,
    'error',
    'CUSTOMER_DUPLICATE_LEGACY_ID',
    'legacy_customer_id is repeated inside the batch.'
FROM dbo.LegacyImportCustomerRows AS rows
INNER JOIN (
    SELECT legacy_customer_id
    FROM dbo.LegacyImportCustomerRows
    WHERE import_batch_id = @import_batch_id
      AND NULLIF(LTRIM(RTRIM(COALESCE(legacy_customer_id, ''))), '') IS NOT NULL
    GROUP BY legacy_customer_id
    HAVING COUNT(*) > 1
) AS duplicates
    ON duplicates.legacy_customer_id = rows.legacy_customer_id
WHERE rows.import_batch_id = @import_batch_id;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    rows.import_batch_id,
    'customer',
    'LegacyImportCustomerRows',
    rows.id,
    rows.source_file,
    rows.source_row_number,
    'warning',
    'CUSTOMER_DUPLICATE_PHONE',
    'Phone is repeated inside the customer staging rows.'
FROM dbo.LegacyImportCustomerRows AS rows
INNER JOIN (
    SELECT normalized_phone
    FROM dbo.LegacyImportCustomerRows
    WHERE import_batch_id = @import_batch_id
      AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_phone, ''))), '') IS NOT NULL
    GROUP BY normalized_phone
    HAVING COUNT(*) > 1
) AS duplicates
    ON duplicates.normalized_phone = rows.normalized_phone
WHERE rows.import_batch_id = @import_batch_id;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    rows.import_batch_id,
    'customer',
    'LegacyImportCustomerRows',
    rows.id,
    rows.source_file,
    rows.source_row_number,
    'warning',
    'CUSTOMER_DUPLICATE_EMAIL',
    'Email is repeated inside the customer staging rows.'
FROM dbo.LegacyImportCustomerRows AS rows
INNER JOIN (
    SELECT normalized_email
    FROM dbo.LegacyImportCustomerRows
    WHERE import_batch_id = @import_batch_id
      AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_email, ''))), '') IS NOT NULL
    GROUP BY normalized_email
    HAVING COUNT(*) > 1
) AS duplicates
    ON duplicates.normalized_email = rows.normalized_email
WHERE rows.import_batch_id = @import_batch_id;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'error',
    'MOVEMENT_MISSING_CUSTOMER_IDENTIFIER',
    'Movement row must include at least one of legacy_customer_id, phone, or email.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND NULLIF(LTRIM(RTRIM(COALESCE(legacy_customer_id, ''))), '') IS NULL
  AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_phone, phone, ''))), '') IS NULL
  AND NULLIF(LTRIM(RTRIM(COALESCE(normalized_email, email, ''))), '') IS NULL;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'error',
    'MOVEMENT_INVALID_DATE',
    'Movement transaction_date_raw must be a valid date.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND TRY_CONVERT(date, transaction_date_raw) IS NULL;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'warning',
    'MOVEMENT_FUTURE_DATE',
    'Movement date is in the future and requires review.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND TRY_CONVERT(date, transaction_date_raw) > CONVERT(date, SYSUTCDATETIME());

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'error',
    'MOVEMENT_UNKNOWN_TYPE',
    'Movement type is not supported by the legacy migration contract.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND COALESCE(transaction_type, '') NOT IN (
      'purchase',
      'redemption',
      'points_adjustment_positive',
      'points_adjustment_negative',
      'legacy_balance_import',
      'legacy_balance_reconciliation'
  );

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'error',
    'MOVEMENT_INVALID_POINTS',
    'Movement points_raw must be an integer.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND (
      NULLIF(LTRIM(RTRIM(COALESCE(points_raw, ''))), '') IS NULL
      OR TRY_CONVERT(int, points_raw) IS NULL
  );

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    @import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    id,
    source_file,
    source_row_number,
    'error',
    'MOVEMENT_NEGATIVE_POINTS_NOT_ALLOWED',
    'Negative points require transaction_type points_adjustment_negative and manual approval.'
FROM dbo.LegacyImportMovementRows
WHERE import_batch_id = @import_batch_id
  AND TRY_CONVERT(int, points_raw) < 0
  AND transaction_type <> 'points_adjustment_negative';

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    rows.import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    rows.id,
    rows.source_file,
    rows.source_row_number,
    'error',
    'MOVEMENT_DUPLICATE_LEGACY_TRANSACTION_ID',
    'legacy_transaction_id is repeated inside the batch.'
FROM dbo.LegacyImportMovementRows AS rows
INNER JOIN (
    SELECT legacy_transaction_id
    FROM dbo.LegacyImportMovementRows
    WHERE import_batch_id = @import_batch_id
      AND NULLIF(LTRIM(RTRIM(COALESCE(legacy_transaction_id, ''))), '') IS NOT NULL
    GROUP BY legacy_transaction_id
    HAVING COUNT(*) > 1
) AS duplicates
    ON duplicates.legacy_transaction_id = rows.legacy_transaction_id
WHERE rows.import_batch_id = @import_batch_id;

INSERT INTO dbo.LegacyImportValidationMessages (
    import_batch_id,
    entity_type,
    row_table,
    row_id,
    source_file,
    source_row_number,
    severity,
    code,
    message
)
SELECT
    movements.import_batch_id,
    'movement',
    'LegacyImportMovementRows',
    movements.id,
    movements.source_file,
    movements.source_row_number,
    'error',
    'MOVEMENT_CUSTOMER_NOT_FOUND_IN_STAGING',
    'Movement references a customer not present in customer staging rows.'
FROM dbo.LegacyImportMovementRows AS movements
WHERE movements.import_batch_id = @import_batch_id
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.LegacyImportCustomerRows AS customers
      WHERE customers.import_batch_id = movements.import_batch_id
        AND (
            (NULLIF(COALESCE(movements.legacy_customer_id, ''), '') IS NOT NULL
             AND customers.legacy_customer_id = movements.legacy_customer_id)
            OR (NULLIF(COALESCE(movements.normalized_phone, ''), '') IS NOT NULL
                AND customers.normalized_phone = movements.normalized_phone)
            OR (NULLIF(COALESCE(movements.normalized_email, ''), '') IS NOT NULL
                AND customers.normalized_email = movements.normalized_email)
        )
  );

UPDATE dbo.LegacyImportBatches
SET
    validated_at = SYSUTCDATETIME(),
    import_status = CASE
        WHEN EXISTS (
            SELECT 1
            FROM dbo.LegacyImportValidationMessages
            WHERE import_batch_id = @import_batch_id
              AND severity = 'error'
        )
        THEN 'rejected'
        ELSE 'validated'
    END
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

SELECT *
FROM dbo.LegacyImportBatchSummary
WHERE import_batch_id = @import_batch_id;
