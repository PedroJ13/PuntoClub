-- Punto Club controlled company registration, invitations, and company users.
-- Review-only migration prepared by SQL DEV for TASK-121.
-- Do not apply to Azure SQL until Product / Architect / Release and Backend/API approve it.
--
-- Recommended prevalidation queries before applying:
--
-- 1. Company email duplicates that would block UX_Companies_email:
--    SELECT email, COUNT(*) AS duplicates
--    FROM dbo.Companies
--    WHERE email IS NOT NULL
--    GROUP BY email
--    HAVING COUNT(*) > 1;
--
-- 2. Existing company statuses outside the target lifecycle:
--    SELECT status, COUNT(*) AS rows_count
--    FROM dbo.Companies
--    GROUP BY status
--    HAVING status NOT IN ('pending_activation', 'active', 'inactive');
--
-- 3. Existing audit events outside the expanded event catalog:
--    SELECT event_type, COUNT(*) AS rows_count
--    FROM dbo.OperationalAuditEvents
--    WHERE OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NOT NULL
--      AND event_type NOT IN (
--          'customer.created',
--          'purchase.registered',
--          'redemption.registered',
--          'customer.rejected_duplicate',
--          'purchase.rejected_duplicate_invoice',
--          'redemption.rejected_insufficient_points',
--          'company.settings.updated',
--          'company.registration.submitted',
--          'company.registration.approved',
--          'company.registration.rejected',
--          'company.invitation.created',
--          'company.invitation.accepted',
--          'company.invitation.revoked',
--          'company.user.created',
--          'company.user.disabled',
--          'company.logo.updated'
--      )
--    GROUP BY event_type;

IF COL_LENGTH('dbo.Companies', 'address') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD address nvarchar(300) NULL;
END;
GO

IF COL_LENGTH('dbo.Companies', 'logo_blob_path') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD logo_blob_path nvarchar(512) NULL;
END;
GO

IF COL_LENGTH('dbo.Companies', 'logo_content_type') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD logo_content_type nvarchar(100) NULL;
END;
GO

IF COL_LENGTH('dbo.Companies', 'logo_updated_at') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD logo_updated_at datetime2(0) NULL;
END;
GO

IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.Companies')
      AND name = 'CK_Companies_status'
)
BEGIN
    ALTER TABLE dbo.Companies
    DROP CONSTRAINT CK_Companies_status;
END;
GO

ALTER TABLE dbo.Companies WITH CHECK
ADD CONSTRAINT CK_Companies_status CHECK (
    status IN ('pending_activation', 'active', 'inactive')
);
GO

ALTER TABLE dbo.Companies
CHECK CONSTRAINT CK_Companies_status;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.Companies')
      AND name = 'CK_Companies_logo_content_type'
)
BEGIN
    ALTER TABLE dbo.Companies WITH CHECK
    ADD CONSTRAINT CK_Companies_logo_content_type CHECK (
        logo_content_type IS NULL
        OR logo_content_type IN ('image/png', 'image/jpeg', 'image/webp')
    );

    ALTER TABLE dbo.Companies
    CHECK CONSTRAINT CK_Companies_logo_content_type;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.Companies')
      AND name = 'UX_Companies_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_Companies_email
    ON dbo.Companies (email)
    WHERE email IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyRegistrationRequests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CompanyRegistrationRequests (
        id bigint IDENTITY(1,1) NOT NULL,
        company_name nvarchar(160) NOT NULL,
        company_email nvarchar(254) NOT NULL,
        company_phone nvarchar(32) NULL,
        company_address nvarchar(300) NOT NULL,
        contact_name nvarchar(160) NULL,
        contact_email nvarchar(254) NOT NULL,
        contact_phone nvarchar(32) NULL,
        requested_logo_blob_path nvarchar(512) NULL,
        requested_logo_content_type nvarchar(100) NULL,
        status varchar(30) NOT NULL
            CONSTRAINT DF_CompanyRegistrationRequests_status DEFAULT ('pending'),
        reviewed_at datetime2(0) NULL,
        reviewed_by_label nvarchar(120) NULL,
        review_note nvarchar(500) NULL,
        approved_company_id bigint NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyRegistrationRequests_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyRegistrationRequests_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_CompanyRegistrationRequests PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_CompanyRegistrationRequests_ApprovedCompany
            FOREIGN KEY (approved_company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_CompanyRegistrationRequests_status CHECK (
            status IN ('pending', 'approved', 'rejected', 'cancelled')
        ),
        CONSTRAINT CK_CompanyRegistrationRequests_logo_content_type CHECK (
            requested_logo_content_type IS NULL
            OR requested_logo_content_type IN ('image/png', 'image/jpeg', 'image/webp')
        )
    );
END;
GO

IF OBJECT_ID('dbo.CompanyRegistrationRequests', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyRegistrationRequests')
      AND name = 'IX_CompanyRegistrationRequests_status_created'
)
BEGIN
    CREATE INDEX IX_CompanyRegistrationRequests_status_created
    ON dbo.CompanyRegistrationRequests (status, created_at DESC, id DESC)
    INCLUDE (company_name, company_email, contact_email);
END;
GO

IF OBJECT_ID('dbo.CompanyRegistrationRequests', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyRegistrationRequests')
      AND name = 'UX_CompanyRegistrationRequests_pending_company_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyRegistrationRequests_pending_company_email
    ON dbo.CompanyRegistrationRequests (company_email)
    WHERE status = 'pending';
END;
GO

IF OBJECT_ID('dbo.CompanyInvitations', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CompanyInvitations (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        registration_request_id bigint NULL,
        email nvarchar(254) NOT NULL,
        token_hash varbinary(32) NOT NULL,
        role varchar(30) NOT NULL
            CONSTRAINT DF_CompanyInvitations_role DEFAULT ('owner'),
        status varchar(30) NOT NULL
            CONSTRAINT DF_CompanyInvitations_status DEFAULT ('pending'),
        expires_at datetime2(0) NOT NULL,
        accepted_at datetime2(0) NULL,
        revoked_at datetime2(0) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyInvitations_created_at DEFAULT (SYSUTCDATETIME()),
        created_by_label nvarchar(120) NULL,
        CONSTRAINT PK_CompanyInvitations PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_CompanyInvitations_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_CompanyInvitations_RegistrationRequests
            FOREIGN KEY (registration_request_id) REFERENCES dbo.CompanyRegistrationRequests(id),
        CONSTRAINT CK_CompanyInvitations_role CHECK (
            role IN ('owner', 'admin', 'staff')
        ),
        CONSTRAINT CK_CompanyInvitations_status CHECK (
            status IN ('pending', 'accepted', 'revoked', 'expired')
        )
    );
END;
GO

IF OBJECT_ID('dbo.CompanyInvitations', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyInvitations')
      AND name = 'UX_CompanyInvitations_token_hash'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyInvitations_token_hash
    ON dbo.CompanyInvitations (token_hash);
END;
GO

IF OBJECT_ID('dbo.CompanyInvitations', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyInvitations')
      AND name = 'UX_CompanyInvitations_pending_company_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyInvitations_pending_company_email
    ON dbo.CompanyInvitations (company_id, email)
    WHERE status = 'pending';
END;
GO

IF OBJECT_ID('dbo.CompanyInvitations', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyInvitations')
      AND name = 'IX_CompanyInvitations_company_status'
)
BEGIN
    CREATE INDEX IX_CompanyInvitations_company_status
    ON dbo.CompanyInvitations (company_id, status, created_at DESC)
    INCLUDE (email, role, expires_at);
END;
GO

IF OBJECT_ID('dbo.CompanyInvitations', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyInvitations')
      AND name = 'IX_CompanyInvitations_email_status'
)
BEGIN
    CREATE INDEX IX_CompanyInvitations_email_status
    ON dbo.CompanyInvitations (email, status, expires_at);
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CompanyUsers (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        email nvarchar(254) NOT NULL,
        display_name nvarchar(160) NULL,
        role varchar(30) NOT NULL
            CONSTRAINT DF_CompanyUsers_role DEFAULT ('owner'),
        status varchar(30) NOT NULL
            CONSTRAINT DF_CompanyUsers_status DEFAULT ('active'),
        auth_provider varchar(40) NOT NULL
            CONSTRAINT DF_CompanyUsers_auth_provider DEFAULT ('entra_external_id'),
        external_subject nvarchar(255) NOT NULL,
        last_login_at datetime2(0) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyUsers_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanyUsers_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_CompanyUsers PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_CompanyUsers_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_CompanyUsers_role CHECK (
            role IN ('owner', 'admin', 'staff')
        ),
        CONSTRAINT CK_CompanyUsers_status CHECK (
            status IN ('invited', 'active', 'disabled')
        ),
        CONSTRAINT CK_CompanyUsers_auth_provider CHECK (
            auth_provider IN ('entra_external_id')
        )
    );
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'UX_CompanyUsers_company_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyUsers_company_email
    ON dbo.CompanyUsers (company_id, email);
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'UX_CompanyUsers_auth_subject'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyUsers_auth_subject
    ON dbo.CompanyUsers (auth_provider, external_subject);
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'IX_CompanyUsers_company_status'
)
BEGIN
    CREATE INDEX IX_CompanyUsers_company_status
    ON dbo.CompanyUsers (company_id, status, role)
    INCLUDE (email, display_name);
END;
GO

IF OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents')
          AND name = 'CK_OperationalAuditEvents_event_type'
    )
    BEGIN
        ALTER TABLE dbo.OperationalAuditEvents
        DROP CONSTRAINT CK_OperationalAuditEvents_event_type;
    END;

    ALTER TABLE dbo.OperationalAuditEvents WITH CHECK
    ADD CONSTRAINT CK_OperationalAuditEvents_event_type CHECK (
        event_type IN (
            'customer.created',
            'purchase.registered',
            'redemption.registered',
            'customer.rejected_duplicate',
            'purchase.rejected_duplicate_invoice',
            'redemption.rejected_insufficient_points',
            'company.settings.updated',
            'company.registration.submitted',
            'company.registration.approved',
            'company.registration.rejected',
            'company.invitation.created',
            'company.invitation.accepted',
            'company.invitation.revoked',
            'company.user.created',
            'company.user.disabled',
            'company.logo.updated'
        )
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_event_type;
END;
GO

IF OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents')
          AND name = 'CK_OperationalAuditEvents_entity_type'
    )
    BEGIN
        ALTER TABLE dbo.OperationalAuditEvents
        DROP CONSTRAINT CK_OperationalAuditEvents_entity_type;
    END;

    ALTER TABLE dbo.OperationalAuditEvents WITH CHECK
    ADD CONSTRAINT CK_OperationalAuditEvents_entity_type CHECK (
        entity_type IN (
            'customer',
            'purchase',
            'redemption',
            'company',
            'company_registration_request',
            'company_invitation',
            'company_user'
        )
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_entity_type;
END;
GO
