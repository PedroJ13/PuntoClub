-- Punto Club promotional campaigns MVP.
-- Non-destructive migration: adds promotional preferences, campaign drafts,
-- recipients with points snapshots, and unsubscribe events.
-- Scope intentionally keeps real sending gated by API feature flags.

IF OBJECT_ID('dbo.CustomerPromotionalEmailPreferences', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CustomerPromotionalEmailPreferences (
        company_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        promotional_status varchar(20) NOT NULL
            CONSTRAINT DF_CustomerPromotionalEmailPreferences_status DEFAULT ('subscribed'),
        unsubscribed_at datetime2(0) NULL,
        unsubscribe_source varchar(40) NULL,
        unsubscribe_reason nvarchar(300) NULL,
        suppressed_at datetime2(0) NULL,
        suppression_reason nvarchar(300) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CustomerPromotionalEmailPreferences_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_CustomerPromotionalEmailPreferences_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_CustomerPromotionalEmailPreferences
            PRIMARY KEY CLUSTERED (company_id, customer_id),
        CONSTRAINT FK_CustomerPromotionalEmailPreferences_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_CustomerPromotionalEmailPreferences_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT CK_CustomerPromotionalEmailPreferences_status CHECK (
            promotional_status IN ('subscribed', 'unsubscribed', 'suppressed')
        ),
        CONSTRAINT CK_CustomerPromotionalEmailPreferences_unsubscribe_source CHECK (
            unsubscribe_source IS NULL OR unsubscribe_source IN ('customer_link', 'company_admin', 'system')
        )
    );
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaigns', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PromotionalCampaigns (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        name nvarchar(160) NOT NULL,
        subject nvarchar(200) NOT NULL,
        body_text nvarchar(2000) NOT NULL,
        include_points bit NOT NULL
            CONSTRAINT DF_PromotionalCampaigns_include_points DEFAULT (0),
        status varchar(20) NOT NULL
            CONSTRAINT DF_PromotionalCampaigns_status DEFAULT ('draft'),
        recipient_limit int NOT NULL
            CONSTRAINT DF_PromotionalCampaigns_recipient_limit DEFAULT (5),
        created_by_user_id bigint NULL,
        last_preview_at datetime2(0) NULL,
        confirmed_at datetime2(0) NULL,
        sent_at datetime2(0) NULL,
        cancelled_at datetime2(0) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaigns_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaigns_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_PromotionalCampaigns PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_PromotionalCampaigns_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_PromotionalCampaigns_CompanyUsers
            FOREIGN KEY (created_by_user_id) REFERENCES dbo.CompanyUsers(id),
        CONSTRAINT CK_PromotionalCampaigns_status CHECK (
            status IN ('draft', 'ready', 'sending', 'sent', 'cancelled', 'failed')
        ),
        CONSTRAINT CK_PromotionalCampaigns_recipient_limit CHECK (
            recipient_limit BETWEEN 1 AND 5
        )
    );
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PromotionalCampaignRecipients (
        id bigint IDENTITY(1,1) NOT NULL,
        campaign_id bigint NOT NULL,
        company_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        recipient_email nvarchar(254) NOT NULL,
        points_balance_snapshot int NULL,
        preference_status_snapshot varchar(20) NOT NULL,
        status varchar(20) NOT NULL
            CONSTRAINT DF_PromotionalCampaignRecipients_status DEFAULT ('pending'),
        skip_reason nvarchar(300) NULL,
        provider varchar(40) NULL,
        provider_message_id nvarchar(200) NULL,
        last_error nvarchar(1000) NULL,
        selected_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaignRecipients_selected_at DEFAULT (SYSUTCDATETIME()),
        sent_at datetime2(0) NULL,
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaignRecipients_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_PromotionalCampaignRecipients PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_PromotionalCampaignRecipients_PromotionalCampaigns
            FOREIGN KEY (campaign_id) REFERENCES dbo.PromotionalCampaigns(id),
        CONSTRAINT FK_PromotionalCampaignRecipients_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_PromotionalCampaignRecipients_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT CK_PromotionalCampaignRecipients_preference_status CHECK (
            preference_status_snapshot IN ('subscribed', 'unsubscribed', 'suppressed')
        ),
        CONSTRAINT CK_PromotionalCampaignRecipients_status CHECK (
            status IN ('pending', 'sent', 'failed', 'skipped')
        )
    );
END;
GO

IF OBJECT_ID('dbo.PromotionalUnsubscribeEvents', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PromotionalUnsubscribeEvents (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        campaign_id bigint NULL,
        recipient_id bigint NULL,
        source varchar(40) NOT NULL,
        reason nvarchar(300) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalUnsubscribeEvents_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_PromotionalUnsubscribeEvents PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_PromotionalUnsubscribeEvents_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_PromotionalUnsubscribeEvents_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT FK_PromotionalUnsubscribeEvents_PromotionalCampaigns
            FOREIGN KEY (campaign_id) REFERENCES dbo.PromotionalCampaigns(id),
        CONSTRAINT FK_PromotionalUnsubscribeEvents_PromotionalCampaignRecipients
            FOREIGN KEY (recipient_id) REFERENCES dbo.PromotionalCampaignRecipients(id),
        CONSTRAINT CK_PromotionalUnsubscribeEvents_source CHECK (
            source IN ('customer_link', 'company_admin', 'system')
        )
    );
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaigns', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaigns')
      AND name = 'IX_PromotionalCampaigns_company_created'
)
BEGIN
    CREATE INDEX IX_PromotionalCampaigns_company_created
    ON dbo.PromotionalCampaigns (company_id, created_at DESC, id DESC)
    INCLUDE (name, subject, status, include_points);
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaignRecipients')
      AND name = 'UX_PromotionalCampaignRecipients_campaign_customer'
)
BEGIN
    CREATE UNIQUE INDEX UX_PromotionalCampaignRecipients_campaign_customer
    ON dbo.PromotionalCampaignRecipients (campaign_id, customer_id);
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaignRecipients')
      AND name = 'IX_PromotionalCampaignRecipients_campaign_status'
)
BEGIN
    CREATE INDEX IX_PromotionalCampaignRecipients_campaign_status
    ON dbo.PromotionalCampaignRecipients (campaign_id, status, id)
    INCLUDE (customer_id, recipient_email, points_balance_snapshot);
END;
GO

IF OBJECT_ID('dbo.CustomerPromotionalEmailPreferences', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CustomerPromotionalEmailPreferences')
      AND name = 'IX_CustomerPromotionalEmailPreferences_company_status'
)
BEGIN
    CREATE INDEX IX_CustomerPromotionalEmailPreferences_company_status
    ON dbo.CustomerPromotionalEmailPreferences (company_id, promotional_status, updated_at DESC);
END;
GO

IF OBJECT_ID('dbo.PromotionalUnsubscribeEvents', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalUnsubscribeEvents')
      AND name = 'IX_PromotionalUnsubscribeEvents_company_created'
)
BEGIN
    CREATE INDEX IX_PromotionalUnsubscribeEvents_company_created
    ON dbo.PromotionalUnsubscribeEvents (company_id, created_at DESC, id DESC)
    INCLUDE (customer_id, campaign_id, source);
END;
GO
