-- Punto Club operational audit events.
-- Non-destructive migration: creates a new table and indexes only.

IF OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OperationalAuditEvents (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        event_type varchar(80) NOT NULL,
        entity_type varchar(40) NOT NULL,
        entity_id bigint NULL,
        customer_id bigint NULL,
        occurred_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalAuditEvents_occurred_at DEFAULT (SYSUTCDATETIME()),
        actor_label nvarchar(120) NULL,
        source varchar(40) NOT NULL
            CONSTRAINT DF_OperationalAuditEvents_source DEFAULT ('api'),
        metadata nvarchar(max) NULL,
        CONSTRAINT PK_OperationalAuditEvents PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_OperationalAuditEvents_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_OperationalAuditEvents_Customers
            FOREIGN KEY (company_id, customer_id) REFERENCES dbo.Customers(company_id, id),
        CONSTRAINT CK_OperationalAuditEvents_event_type CHECK (
            event_type IN (
                'customer.created',
                'purchase.registered',
                'redemption.registered',
                'customer.rejected_duplicate',
                'purchase.rejected_duplicate_invoice',
                'redemption.rejected_insufficient_points'
            )
        ),
        CONSTRAINT CK_OperationalAuditEvents_entity_type CHECK (
            entity_type IN ('customer', 'purchase', 'redemption')
        ),
        CONSTRAINT CK_OperationalAuditEvents_source CHECK (
            source IN ('api', 'web', 'system', 'manual')
        ),
        CONSTRAINT CK_OperationalAuditEvents_metadata_json CHECK (
            metadata IS NULL OR ISJSON(metadata) = 1
        )
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalAuditEvents')
      AND name = 'IX_OperationalAuditEvents_company_date'
)
BEGIN
    CREATE INDEX IX_OperationalAuditEvents_company_date
    ON dbo.OperationalAuditEvents (company_id, occurred_at DESC, id DESC)
    INCLUDE (event_type, entity_type, entity_id, customer_id, actor_label, source);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalAuditEvents')
      AND name = 'IX_OperationalAuditEvents_company_customer_date'
)
BEGIN
    CREATE INDEX IX_OperationalAuditEvents_company_customer_date
    ON dbo.OperationalAuditEvents (company_id, customer_id, occurred_at DESC, id DESC)
    INCLUDE (event_type, entity_type, entity_id, actor_label, source)
    WHERE customer_id IS NOT NULL;
END;
GO
