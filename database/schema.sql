-- Punto Club MVP initial schema for Azure SQL Database.
-- Assumptions:
-- - Monetary values use decimal(18,2).
-- - Points are whole units; the API calculates/rounds points_earned consistently.
-- - Timestamps are stored in UTC using datetime2.
-- - Point balance is calculated from purchases minus redemptions.

CREATE TABLE dbo.Companies (
    id bigint IDENTITY(1,1) NOT NULL,
    name nvarchar(160) NOT NULL,
    email nvarchar(254) NULL,
    phone nvarchar(32) NULL,
    logo_url nvarchar(2048) NULL,
    points_percentage decimal(5,2) NOT NULL,
    status varchar(20) NOT NULL CONSTRAINT DF_Companies_status DEFAULT ('active'),
    created_at datetime2(0) NOT NULL CONSTRAINT DF_Companies_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at datetime2(0) NOT NULL CONSTRAINT DF_Companies_updated_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Companies PRIMARY KEY CLUSTERED (id),
    CONSTRAINT CK_Companies_points_percentage CHECK (points_percentage > 0 AND points_percentage <= 100),
    CONSTRAINT CK_Companies_status CHECK (status IN ('active', 'inactive'))
);
GO

CREATE TABLE dbo.Customers (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    name nvarchar(160) NOT NULL,
    phone nvarchar(32) NOT NULL,
    email nvarchar(254) NULL,
    created_at datetime2(0) NOT NULL CONSTRAINT DF_Customers_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at datetime2(0) NOT NULL CONSTRAINT DF_Customers_updated_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Customers PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Customers_company_id_id UNIQUE (company_id, id),
    CONSTRAINT FK_Customers_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id)
);
GO

CREATE TABLE dbo.Purchases (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    invoice_number nvarchar(80) NOT NULL,
    purchase_date date NOT NULL,
    amount decimal(18,2) NOT NULL,
    points_earned int NOT NULL,
    created_at datetime2(0) NOT NULL CONSTRAINT DF_Purchases_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Purchases PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_Purchases_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT FK_Purchases_Customers FOREIGN KEY (company_id, customer_id) REFERENCES dbo.Customers(company_id, id),
    CONSTRAINT CK_Purchases_amount CHECK (amount > 0),
    CONSTRAINT CK_Purchases_points_earned CHECK (points_earned > 0)
);
GO

CREATE TABLE dbo.Redemptions (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    redemption_date date NOT NULL,
    points_redeemed int NOT NULL,
    note nvarchar(500) NULL,
    created_at datetime2(0) NOT NULL CONSTRAINT DF_Redemptions_created_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Redemptions PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_Redemptions_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT FK_Redemptions_Customers FOREIGN KEY (company_id, customer_id) REFERENCES dbo.Customers(company_id, id),
    CONSTRAINT CK_Redemptions_points_redeemed CHECK (points_redeemed > 0)
);
GO

-- One invoice number cannot be reused inside the same company.
CREATE UNIQUE INDEX UX_Purchases_company_invoice
ON dbo.Purchases (company_id, invoice_number);
GO

-- Initial customer uniqueness rule for MVP: phone identifies a customer inside one company.
CREATE UNIQUE INDEX UX_Customers_company_phone
ON dbo.Customers (company_id, phone);
GO

CREATE UNIQUE INDEX UX_Customers_company_email
ON dbo.Customers (company_id, email)
WHERE email IS NOT NULL;
GO

CREATE INDEX IX_Customers_company_name
ON dbo.Customers (company_id, name);
GO

CREATE INDEX IX_Purchases_customer_date
ON dbo.Purchases (company_id, customer_id, purchase_date DESC)
INCLUDE (amount, points_earned, invoice_number);
GO

CREATE INDEX IX_Redemptions_customer_date
ON dbo.Redemptions (company_id, customer_id, redemption_date DESC)
INCLUDE (points_redeemed);
GO

-- Balance helper view: current points per customer.
CREATE VIEW dbo.CustomerPointBalances
AS
SELECT
    c.company_id,
    c.id AS customer_id,
    COALESCE(p.points_earned, 0) AS points_earned,
    COALESCE(r.points_redeemed, 0) AS points_redeemed,
    COALESCE(p.points_earned, 0) - COALESCE(r.points_redeemed, 0) AS points_balance
FROM dbo.Customers AS c
OUTER APPLY (
    SELECT SUM(purchases.points_earned) AS points_earned
    FROM dbo.Purchases AS purchases
    WHERE purchases.company_id = c.company_id
      AND purchases.customer_id = c.id
) AS p
OUTER APPLY (
    SELECT SUM(redemptions.points_redeemed) AS points_redeemed
    FROM dbo.Redemptions AS redemptions
    WHERE redemptions.company_id = c.company_id
      AND redemptions.customer_id = c.id
) AS r;
GO

-- Recommended insertion path for redemptions. The API should also validate balance
-- for user-friendly errors, but this procedure protects consistency at write time.
CREATE PROCEDURE dbo.RegisterRedemption
    @company_id bigint,
    @customer_id bigint,
    @redemption_date date,
    @points_redeemed int,
    @note nvarchar(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF @points_redeemed <= 0
    BEGIN
        THROW 50001, 'points_redeemed must be positive.', 1;
    END;

    BEGIN TRANSACTION;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Customers WITH (UPDLOCK, HOLDLOCK)
        WHERE company_id = @company_id
          AND id = @customer_id
    )
    BEGIN
        THROW 50002, 'Customer does not exist for company.', 1;
    END;

    DECLARE @available_points int;

    SELECT @available_points = points_balance
    FROM dbo.CustomerPointBalances
    WHERE company_id = @company_id
      AND customer_id = @customer_id;

    IF @available_points < @points_redeemed
    BEGIN
        THROW 50003, 'Insufficient point balance.', 1;
    END;

    INSERT INTO dbo.Redemptions (
        company_id,
        customer_id,
        redemption_date,
        points_redeemed,
        note
    )
    VALUES (
        @company_id,
        @customer_id,
        @redemption_date,
        @points_redeemed,
        @note
    );

    COMMIT TRANSACTION;
END;
GO

-- Validation queries after loading sample data:
-- 1. Duplicate invoices should be impossible:
--    SELECT company_id, invoice_number, COUNT(*) AS duplicates
--    FROM dbo.Purchases
--    GROUP BY company_id, invoice_number
--    HAVING COUNT(*) > 1;
--
-- 2. Customer balances should be available for operational lookup:
--    SELECT company_id, customer_id, points_earned, points_redeemed, points_balance
--    FROM dbo.CustomerPointBalances;
--
-- 3. Customer search by company should use the customer indexes:
--    SELECT id, name, phone, email
--    FROM dbo.Customers
--    WHERE company_id = @company_id
--      AND (phone = @search OR email = @search OR name LIKE @search_like);
