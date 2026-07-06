/*
  TASK-774 - Fecha de nacimiento de clientes y tipo de campana promocional.

  No aplicar automaticamente en Azure SQL. Esta migracion queda preparada para
  decision posterior de release.
*/

SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;
GO

IF COL_LENGTH('dbo.Customers', 'birth_date') IS NULL
BEGIN
  ALTER TABLE dbo.Customers
    ADD birth_date date NULL;
END;
GO

IF COL_LENGTH('dbo.Customers', 'birth_month') IS NULL
BEGIN
  ALTER TABLE dbo.Customers
    ADD birth_month AS (DATEPART(month, birth_date)) PERSISTED;
END;
GO

IF COL_LENGTH('dbo.Customers', 'birth_day') IS NULL
BEGIN
  ALTER TABLE dbo.Customers
    ADD birth_day AS (DATEPART(day, birth_date)) PERSISTED;
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_Customers_birth_date_not_future
ON dbo.Customers
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (
    SELECT 1
    FROM inserted
    WHERE birth_date > CONVERT(date, SYSUTCDATETIME())
  )
  BEGIN
    THROW 51074, 'Customer birth_date cannot be in the future.', 1;
  END;
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = 'IX_Customers_company_birth_month_day'
    AND object_id = OBJECT_ID('dbo.Customers')
)
BEGIN
  CREATE INDEX IX_Customers_company_birth_month_day
    ON dbo.Customers (company_id, birth_month, birth_day)
    INCLUDE (id, name, phone, email, birth_date)
    WHERE birth_date IS NOT NULL;
END;
GO

IF COL_LENGTH('dbo.PromotionalCampaigns', 'campaign_type') IS NULL
BEGIN
  ALTER TABLE dbo.PromotionalCampaigns
    ADD campaign_type varchar(20) NOT NULL
      CONSTRAINT DF_PromotionalCampaigns_campaign_type DEFAULT ('comun')
      WITH VALUES;
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.check_constraints
  WHERE name = 'CK_PromotionalCampaigns_campaign_type'
    AND parent_object_id = OBJECT_ID('dbo.PromotionalCampaigns')
)
BEGIN
  ALTER TABLE dbo.PromotionalCampaigns WITH CHECK
    ADD CONSTRAINT CK_PromotionalCampaigns_campaign_type
    CHECK (campaign_type IN ('comun', 'cumpleanos'));
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = 'IX_PromotionalCampaigns_company_type_status_created'
    AND object_id = OBJECT_ID('dbo.PromotionalCampaigns')
)
BEGIN
  CREATE INDEX IX_PromotionalCampaigns_company_type_status_created
    ON dbo.PromotionalCampaigns (company_id, campaign_type, status, created_at DESC, id DESC);
END;
GO

COMMIT TRANSACTION;
GO
