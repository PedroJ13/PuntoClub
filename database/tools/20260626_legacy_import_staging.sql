-- Punto Club legacy import staging.
-- Safe preparation script: creates staging/audit objects only.
-- Does not insert, update, or delete operational customer/purchase/redemption data.

IF OBJECT_ID('dbo.LegacyImportBatches', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LegacyImportBatches (
        import_batch_id uniqueidentifier NOT NULL
            CONSTRAINT DF_LegacyImportBatches_import_batch_id DEFAULT (NEWID()),
        company_id bigint NOT NULL,
        source_system nvarchar(160) NOT NULL,
        source_file nvarchar(260) NULL,
        import_scenario varchar(40) NOT NULL,
        import_status varchar(30) NOT NULL
            CONSTRAINT DF_LegacyImportBatches_import_status DEFAULT ('staged'),
        dry_run_only bit NOT NULL
            CONSTRAINT DF_LegacyImportBatches_dry_run_only DEFAULT (1),
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_LegacyImportBatches_created_at DEFAULT (SYSUTCDATETIME()),
        created_by_label nvarchar(160) NULL,
        validated_at datetime2(0) NULL,
        approved_at datetime2(0) NULL,
        approved_by_label nvarchar(160) NULL,
        applied_at datetime2(0) NULL,
        invalidated_at datetime2(0) NULL,
        invalidated_by_label nvarchar(160) NULL,
        invalidation_note nvarchar(500) NULL,
        notes nvarchar(1000) NULL,
        CONSTRAINT PK_LegacyImportBatches PRIMARY KEY CLUSTERED (import_batch_id),
        CONSTRAINT FK_LegacyImportBatches_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_LegacyImportBatches_scenario CHECK (
            import_scenario IN (
                'customers_only',
                'compact_balance',
                'full_history',
                'partial_history_with_adjustment',
                'mixed_files'
            )
        ),
        CONSTRAINT CK_LegacyImportBatches_status CHECK (
            import_status IN (
                'staged',
                'validated',
                'approved',
                'applied',
                'rejected',
                'invalidated'
            )
        )
    );
END;
GO

IF OBJECT_ID('dbo.LegacyImportCustomerRows', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LegacyImportCustomerRows (
        id bigint IDENTITY(1,1) NOT NULL,
        import_batch_id uniqueidentifier NOT NULL,
        source_system nvarchar(160) NOT NULL,
        source_file nvarchar(260) NOT NULL,
        source_row_number int NOT NULL,
        legacy_customer_id nvarchar(120) NULL,
        customer_name nvarchar(160) NULL,
        phone nvarchar(32) NULL,
        email nvarchar(254) NULL,
        customer_status nvarchar(40) NULL,
        created_at_raw nvarchar(80) NULL,
        current_points_balance_raw nvarchar(80) NULL,
        balance_as_of_raw nvarchar(80) NULL,
        notes nvarchar(1000) NULL,
        normalized_customer_name nvarchar(160) NULL,
        normalized_phone nvarchar(32) NULL,
        normalized_email nvarchar(254) NULL,
        source_hash varbinary(32) NULL,
        raw_payload nvarchar(max) NULL,
        import_status varchar(30) NOT NULL
            CONSTRAINT DF_LegacyImportCustomerRows_import_status DEFAULT ('pending'),
        matched_customer_id bigint NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_LegacyImportCustomerRows_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_LegacyImportCustomerRows PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_LegacyImportCustomerRows_Batches
            FOREIGN KEY (import_batch_id) REFERENCES dbo.LegacyImportBatches(import_batch_id),
        CONSTRAINT CK_LegacyImportCustomerRows_row_number CHECK (source_row_number > 0),
        CONSTRAINT CK_LegacyImportCustomerRows_status CHECK (
            import_status IN ('pending', 'valid', 'warning', 'error', 'applied', 'rejected')
        ),
        CONSTRAINT CK_LegacyImportCustomerRows_payload_json CHECK (
            raw_payload IS NULL OR ISJSON(raw_payload) = 1
        )
    );
END;
GO

IF OBJECT_ID('dbo.LegacyImportMovementRows', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LegacyImportMovementRows (
        id bigint IDENTITY(1,1) NOT NULL,
        import_batch_id uniqueidentifier NOT NULL,
        source_system nvarchar(160) NOT NULL,
        source_file nvarchar(260) NOT NULL,
        source_row_number int NOT NULL,
        legacy_transaction_id nvarchar(120) NULL,
        legacy_customer_id nvarchar(120) NULL,
        phone nvarchar(32) NULL,
        email nvarchar(254) NULL,
        transaction_date_raw nvarchar(80) NULL,
        transaction_type varchar(50) NULL,
        amount_raw nvarchar(80) NULL,
        points_raw nvarchar(80) NULL,
        reference nvarchar(160) NULL,
        description nvarchar(500) NULL,
        normalized_phone nvarchar(32) NULL,
        normalized_email nvarchar(254) NULL,
        source_hash varbinary(32) NULL,
        raw_payload nvarchar(max) NULL,
        import_status varchar(30) NOT NULL
            CONSTRAINT DF_LegacyImportMovementRows_import_status DEFAULT ('pending'),
        matched_customer_row_id bigint NULL,
        matched_customer_id bigint NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_LegacyImportMovementRows_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_LegacyImportMovementRows PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_LegacyImportMovementRows_Batches
            FOREIGN KEY (import_batch_id) REFERENCES dbo.LegacyImportBatches(import_batch_id),
        CONSTRAINT CK_LegacyImportMovementRows_row_number CHECK (source_row_number > 0),
        CONSTRAINT CK_LegacyImportMovementRows_status CHECK (
            import_status IN ('pending', 'valid', 'warning', 'error', 'applied', 'rejected')
        ),
        CONSTRAINT CK_LegacyImportMovementRows_payload_json CHECK (
            raw_payload IS NULL OR ISJSON(raw_payload) = 1
        )
    );
END;
GO

IF OBJECT_ID('dbo.LegacyImportValidationMessages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LegacyImportValidationMessages (
        id bigint IDENTITY(1,1) NOT NULL,
        import_batch_id uniqueidentifier NOT NULL,
        entity_type varchar(30) NOT NULL,
        row_table varchar(60) NULL,
        row_id bigint NULL,
        source_file nvarchar(260) NULL,
        source_row_number int NULL,
        severity varchar(20) NOT NULL,
        code varchar(80) NOT NULL,
        message nvarchar(1000) NOT NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_LegacyImportValidationMessages_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_LegacyImportValidationMessages PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_LegacyImportValidationMessages_Batches
            FOREIGN KEY (import_batch_id) REFERENCES dbo.LegacyImportBatches(import_batch_id),
        CONSTRAINT CK_LegacyImportValidationMessages_entity CHECK (
            entity_type IN ('batch', 'customer', 'movement')
        ),
        CONSTRAINT CK_LegacyImportValidationMessages_severity CHECK (
            severity IN ('error', 'warning', 'info')
        )
    );
END;
GO

IF OBJECT_ID('dbo.LegacyImportBatches', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.LegacyImportBatches')
      AND name = 'IX_LegacyImportBatches_company_status'
)
BEGIN
    CREATE INDEX IX_LegacyImportBatches_company_status
    ON dbo.LegacyImportBatches (company_id, import_status, created_at DESC)
    INCLUDE (source_system, source_file, import_scenario);
END;
GO

IF OBJECT_ID('dbo.LegacyImportCustomerRows', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.LegacyImportCustomerRows')
      AND name = 'IX_LegacyImportCustomerRows_batch_status'
)
BEGIN
    CREATE INDEX IX_LegacyImportCustomerRows_batch_status
    ON dbo.LegacyImportCustomerRows (import_batch_id, import_status, source_row_number)
    INCLUDE (legacy_customer_id, normalized_phone, normalized_email, matched_customer_id);
END;
GO

IF OBJECT_ID('dbo.LegacyImportMovementRows', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.LegacyImportMovementRows')
      AND name = 'IX_LegacyImportMovementRows_batch_status'
)
BEGIN
    CREATE INDEX IX_LegacyImportMovementRows_batch_status
    ON dbo.LegacyImportMovementRows (import_batch_id, import_status, source_row_number)
    INCLUDE (legacy_transaction_id, legacy_customer_id, transaction_type, matched_customer_id);
END;
GO

IF OBJECT_ID('dbo.LegacyImportCustomerRows', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.LegacyImportCustomerRows')
      AND name = 'UX_LegacyImportCustomerRows_batch_hash'
)
BEGIN
    CREATE UNIQUE INDEX UX_LegacyImportCustomerRows_batch_hash
    ON dbo.LegacyImportCustomerRows (import_batch_id, source_hash)
    WHERE source_hash IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.LegacyImportMovementRows', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.LegacyImportMovementRows')
      AND name = 'UX_LegacyImportMovementRows_batch_hash'
)
BEGIN
    CREATE UNIQUE INDEX UX_LegacyImportMovementRows_batch_hash
    ON dbo.LegacyImportMovementRows (import_batch_id, source_hash)
    WHERE source_hash IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.LegacyImportBatchSummary', 'V') IS NULL
BEGIN
    EXEC('
        CREATE VIEW dbo.LegacyImportBatchSummary
        AS
        SELECT
            batch.import_batch_id,
            batch.company_id,
            batch.source_system,
            batch.source_file,
            batch.import_scenario,
            batch.import_status,
            batch.created_at,
            COUNT(DISTINCT customers.id) AS customer_rows,
            COUNT(DISTINCT movements.id) AS movement_rows,
            COUNT(DISTINCT CASE WHEN messages.severity = ''error'' THEN messages.id END) AS error_count,
            COUNT(DISTINCT CASE WHEN messages.severity = ''warning'' THEN messages.id END) AS warning_count,
            COUNT(DISTINCT CASE WHEN messages.severity = ''info'' THEN messages.id END) AS info_count
        FROM dbo.LegacyImportBatches AS batch
        LEFT JOIN dbo.LegacyImportCustomerRows AS customers
            ON customers.import_batch_id = batch.import_batch_id
        LEFT JOIN dbo.LegacyImportMovementRows AS movements
            ON movements.import_batch_id = batch.import_batch_id
        LEFT JOIN dbo.LegacyImportValidationMessages AS messages
            ON messages.import_batch_id = batch.import_batch_id
        GROUP BY
            batch.import_batch_id,
            batch.company_id,
            batch.source_system,
            batch.source_file,
            batch.import_scenario,
            batch.import_status,
            batch.created_at;
    ');
END;
GO
