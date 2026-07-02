-- Punto Club promotional campaign images metadata.
-- Non-destructive migration: stores image metadata only; image binaries live in Blob Storage.
-- Do not enable public blob access. Email rendering should use an opaque public API route.

IF OBJECT_ID('dbo.PromotionalCampaignImages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PromotionalCampaignImages (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        campaign_id bigint NOT NULL,
        status varchar(20) NOT NULL
            CONSTRAINT DF_PromotionalCampaignImages_status DEFAULT ('active'),
        blob_container nvarchar(63) NOT NULL,
        blob_path nvarchar(512) NOT NULL,
        public_id uniqueidentifier NOT NULL
            CONSTRAINT DF_PromotionalCampaignImages_public_id DEFAULT (NEWID()),
        original_file_name nvarchar(255) NOT NULL,
        content_type varchar(80) NOT NULL,
        size_bytes int NOT NULL,
        checksum_sha256 varbinary(32) NULL,
        alt_text nvarchar(160) NULL,
        created_by_user_id bigint NULL,
        updated_by_user_id bigint NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaignImages_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_PromotionalCampaignImages_updated_at DEFAULT (SYSUTCDATETIME()),
        replaced_at datetime2(0) NULL,
        deleted_at datetime2(0) NULL,
        CONSTRAINT PK_PromotionalCampaignImages PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_PromotionalCampaignImages_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_PromotionalCampaignImages_PromotionalCampaigns
            FOREIGN KEY (campaign_id) REFERENCES dbo.PromotionalCampaigns(id),
        CONSTRAINT FK_PromotionalCampaignImages_CreatedBy
            FOREIGN KEY (created_by_user_id) REFERENCES dbo.CompanyUsers(id),
        CONSTRAINT FK_PromotionalCampaignImages_UpdatedBy
            FOREIGN KEY (updated_by_user_id) REFERENCES dbo.CompanyUsers(id),
        CONSTRAINT CK_PromotionalCampaignImages_status CHECK (
            status IN ('active', 'replaced', 'deleted')
        ),
        CONSTRAINT CK_PromotionalCampaignImages_content_type CHECK (
            content_type IN ('image/jpeg', 'image/png', 'image/webp')
        ),
        CONSTRAINT CK_PromotionalCampaignImages_size CHECK (
            size_bytes > 0 AND size_bytes <= 1048576
        )
    );
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignImages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaignImages')
      AND name = 'UX_PromotionalCampaignImages_public_id'
)
BEGIN
    CREATE UNIQUE INDEX UX_PromotionalCampaignImages_public_id
    ON dbo.PromotionalCampaignImages (public_id);
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignImages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaignImages')
      AND name = 'UX_PromotionalCampaignImages_active_campaign'
)
BEGIN
    CREATE UNIQUE INDEX UX_PromotionalCampaignImages_active_campaign
    ON dbo.PromotionalCampaignImages (company_id, campaign_id)
    WHERE status = 'active';
END;
GO

IF OBJECT_ID('dbo.PromotionalCampaignImages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.PromotionalCampaignImages')
      AND name = 'IX_PromotionalCampaignImages_campaign_status'
)
BEGIN
    CREATE INDEX IX_PromotionalCampaignImages_campaign_status
    ON dbo.PromotionalCampaignImages (company_id, campaign_id, status, updated_at DESC)
    INCLUDE (content_type, size_bytes, original_file_name, public_id);
END;
GO
