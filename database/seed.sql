-- Punto Club MVP minimal seed for development/pilot.
-- Execute after database/schema.sql.
-- Do not store connection strings or secrets in this file.
--
-- Recommended execution order:
--   1. database/schema.sql
--   2. database/seed.sql
--
-- The pilot company is inserted with id = 1 because TASK-007/TASK-008
-- and QA use PILOT_COMPANY_ID = 1 as the trusted server-side company id.

SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.Companies
    WHERE id = 1
)
BEGIN
    SET IDENTITY_INSERT dbo.Companies ON;

    INSERT INTO dbo.Companies (
        id,
        name,
        email,
        phone,
        logo_url,
        points_percentage,
        status
    )
    VALUES (
        1,
        N'Cafe Central',
        NULL,
        NULL,
        NULL,
        5.00,
        'active'
    );

    SET IDENTITY_INSERT dbo.Companies OFF;
END
ELSE
BEGIN
    UPDATE dbo.Companies
    SET
        name = N'Cafe Central',
        points_percentage = 5.00,
        status = 'active',
        updated_at = SYSUTCDATETIME()
    WHERE id = 1;
END;

COMMIT TRANSACTION;
GO

-- Validation queries:
--
-- Confirm pilot company:
-- SELECT id, name, points_percentage, status
-- FROM dbo.Companies
-- WHERE id = 1;
--
-- Expected:
-- id = 1
-- name = Cafe Central
-- points_percentage = 5.00
-- status = active
--
-- QA customer data intentionally is not preloaded in this minimal seed.
-- QA should create these records through API/UI to validate the MVP flows:
-- - Maria Soto, +50688887777, maria@example.com
-- - Carlos Mora, +50677776666, carlos@example.com
