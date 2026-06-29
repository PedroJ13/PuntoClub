-- Punto Club operational emails MVP.
-- Non-destructive migration: adds per-company operational email settings,
-- idempotent operational email events, and basic message/attempt logs.
-- Scope intentionally excludes promotional campaigns and bulk sends.

IF OBJECT_ID('dbo.CompanyOperationalEmailSettings', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CompanyOperationalEmailSettings (
        company_id bigint NOT NULL,
        welcome_enabled bit NOT NULL
            CONSTRAINT DF_CompanyOperationalEmailSettings_welcome_enabled DEFAULT (1),
        purchase_enabled bit NOT NULL
            CONSTRAINT DF_CompanyOperationalEmailSettings_purchase_enabled DEFAULT (1),
        redemption_enabled bit NOT NULL
            CONSTRAINT DF_CompanyOperationalEmailSettings_redemption_enabled DEFAULT (1),
        reply_to_email nvarchar(254) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyOperationalEmailSettings_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyOperationalEmailSettings_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_CompanyOperationalEmailSettings PRIMARY KEY CLUSTERED (company_id),
        CONSTRAINT FK_CompanyOperationalEmailSettings_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id)
    );
END;
GO

IF OBJECT_ID('dbo.OperationalEmailEvents', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OperationalEmailEvents (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        event_type varchar(40) NOT NULL,
        idempotency_key nvarchar(160) NOT NULL,
        source_entity_type varchar(40) NOT NULL,
        source_entity_id bigint NOT NULL,
        customer_id bigint NULL,
        status varchar(20) NOT NULL
            CONSTRAINT DF_OperationalEmailEvents_status DEFAULT ('pending'),
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalEmailEvents_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalEmailEvents_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_OperationalEmailEvents PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_OperationalEmailEvents_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_OperationalEmailEvents_event_type CHECK (
            event_type IN ('welcome', 'purchase', 'redemption')
        ),
        CONSTRAINT CK_OperationalEmailEvents_source_entity_type CHECK (
            source_entity_type IN ('customer', 'purchase', 'redemption')
        ),
        CONSTRAINT CK_OperationalEmailEvents_status CHECK (
            status IN ('pending', 'skipped', 'sent', 'failed')
        )
    );
END;
GO

IF OBJECT_ID('dbo.OperationalEmailEvents', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalEmailEvents')
      AND name = 'UX_OperationalEmailEvents_company_idempotency'
)
BEGIN
    CREATE UNIQUE INDEX UX_OperationalEmailEvents_company_idempotency
    ON dbo.OperationalEmailEvents (company_id, idempotency_key);
END;
GO

IF OBJECT_ID('dbo.OperationalEmailEvents', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalEmailEvents')
      AND name = 'IX_OperationalEmailEvents_company_created'
)
BEGIN
    CREATE INDEX IX_OperationalEmailEvents_company_created
    ON dbo.OperationalEmailEvents (company_id, created_at DESC, id DESC)
    INCLUDE (event_type, source_entity_type, source_entity_id, customer_id, status);
END;
GO

IF OBJECT_ID('dbo.OperationalEmailMessages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OperationalEmailMessages (
        id bigint IDENTITY(1,1) NOT NULL,
        event_id bigint NOT NULL,
        company_id bigint NOT NULL,
        customer_id bigint NULL,
        recipient_email nvarchar(254) NULL,
        subject nvarchar(200) NULL,
        status varchar(20) NOT NULL
            CONSTRAINT DF_OperationalEmailMessages_status DEFAULT ('pending'),
        provider varchar(40) NULL,
        provider_message_id nvarchar(200) NULL,
        last_error nvarchar(1000) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalEmailMessages_created_at DEFAULT (SYSUTCDATETIME()),
        sent_at datetime2(0) NULL,
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalEmailMessages_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_OperationalEmailMessages PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_OperationalEmailMessages_OperationalEmailEvents
            FOREIGN KEY (event_id) REFERENCES dbo.OperationalEmailEvents(id),
        CONSTRAINT FK_OperationalEmailMessages_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_OperationalEmailMessages_status CHECK (
            status IN ('pending', 'skipped', 'sent', 'failed')
        )
    );
END;
GO

IF OBJECT_ID('dbo.OperationalEmailMessages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalEmailMessages')
      AND name = 'IX_OperationalEmailMessages_event'
)
BEGIN
    CREATE INDEX IX_OperationalEmailMessages_event
    ON dbo.OperationalEmailMessages (event_id, id);
END;
GO

IF OBJECT_ID('dbo.OperationalEmailAttempts', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OperationalEmailAttempts (
        id bigint IDENTITY(1,1) NOT NULL,
        message_id bigint NOT NULL,
        event_id bigint NOT NULL,
        company_id bigint NOT NULL,
        attempt_number int NOT NULL,
        provider varchar(40) NOT NULL,
        status varchar(20) NOT NULL,
        provider_message_id nvarchar(200) NULL,
        error_message nvarchar(1000) NULL,
        attempted_at datetime2(0) NOT NULL
            CONSTRAINT DF_OperationalEmailAttempts_attempted_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_OperationalEmailAttempts PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_OperationalEmailAttempts_OperationalEmailMessages
            FOREIGN KEY (message_id) REFERENCES dbo.OperationalEmailMessages(id),
        CONSTRAINT FK_OperationalEmailAttempts_OperationalEmailEvents
            FOREIGN KEY (event_id) REFERENCES dbo.OperationalEmailEvents(id),
        CONSTRAINT FK_OperationalEmailAttempts_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_OperationalEmailAttempts_attempt_number CHECK (attempt_number > 0),
        CONSTRAINT CK_OperationalEmailAttempts_status CHECK (
            status IN ('skipped', 'sent', 'failed')
        )
    );
END;
GO

IF OBJECT_ID('dbo.OperationalEmailAttempts', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.OperationalEmailAttempts')
      AND name = 'IX_OperationalEmailAttempts_message'
)
BEGIN
    CREATE INDEX IX_OperationalEmailAttempts_message
    ON dbo.OperationalEmailAttempts (message_id, attempt_number);
END;
GO
