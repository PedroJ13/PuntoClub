-- Punto Club company local auth and server-side sessions.
-- Review-only migration prepared by SQL DEV for TASK-159.
-- Do not apply to Azure SQL until Product / Architect / Release explicitly approves it.
--
-- Recommended prevalidation queries before applying:
--
-- 1. CompanyUsers auth providers outside the target catalog:
--    SELECT auth_provider, COUNT(*) AS rows_count
--    FROM dbo.CompanyUsers
--    GROUP BY auth_provider
--    HAVING auth_provider NOT IN ('local_password', 'entra_external_id');
--
-- 2. Duplicate local-password emails that would block simple email login:
--    SELECT email, COUNT(*) AS duplicates
--    FROM dbo.CompanyUsers
--    WHERE auth_provider = 'local_password'
--    GROUP BY email
--    HAVING COUNT(*) > 1;
--
-- 3. Duplicate external identity subjects that would block the filtered unique index:
--    SELECT auth_provider, external_subject, COUNT(*) AS duplicates
--    FROM dbo.CompanyUsers
--    WHERE external_subject IS NOT NULL
--    GROUP BY auth_provider, external_subject
--    HAVING COUNT(*) > 1;
--
-- 4. Entra users without an external subject:
--    SELECT id, company_id, email
--    FROM dbo.CompanyUsers
--    WHERE auth_provider = 'entra_external_id'
--      AND external_subject IS NULL;

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
          AND name = 'CK_CompanyUsers_auth_provider'
    )
    BEGIN
        ALTER TABLE dbo.CompanyUsers
        DROP CONSTRAINT CK_CompanyUsers_auth_provider;
    END;

    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
          AND name = 'CK_CompanyUsers_password_required'
    )
    BEGIN
        ALTER TABLE dbo.CompanyUsers
        DROP CONSTRAINT CK_CompanyUsers_password_required;
    END;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'UX_CompanyUsers_auth_subject'
)
BEGIN
    DROP INDEX UX_CompanyUsers_auth_subject
    ON dbo.CompanyUsers;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND EXISTS (
    SELECT 1
    FROM sys.default_constraints AS dc
    JOIN sys.columns AS c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND c.name = 'auth_provider'
)
BEGIN
    DECLARE @defaultConstraintName sysname;
    DECLARE @dropDefaultSql nvarchar(max);

    SELECT @defaultConstraintName = dc.name
    FROM sys.default_constraints AS dc
    JOIN sys.columns AS c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND c.name = 'auth_provider';

    SET @dropDefaultSql = N'ALTER TABLE dbo.CompanyUsers DROP CONSTRAINT ' + QUOTENAME(@defaultConstraintName);
    EXEC sp_executesql @dropDefaultSql;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints AS dc
    JOIN sys.columns AS c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND c.name = 'auth_provider'
)
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD CONSTRAINT DF_CompanyUsers_auth_provider DEFAULT ('local_password') FOR auth_provider;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'external_subject'
      AND is_nullable = 0
)
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ALTER COLUMN external_subject nvarchar(255) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_hash') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_hash nvarchar(512) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_algorithm') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_algorithm varchar(40) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_params') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_params nvarchar(300) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_updated_at') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_updated_at datetime2(0) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_failed_attempts') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_failed_attempts int NOT NULL
        CONSTRAINT DF_CompanyUsers_password_failed_attempts DEFAULT (0);
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND COL_LENGTH('dbo.CompanyUsers', 'password_locked_until') IS NULL
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD password_locked_until datetime2(0) NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'CK_CompanyUsers_auth_provider'
)
BEGIN
    ALTER TABLE dbo.CompanyUsers WITH CHECK
    ADD CONSTRAINT CK_CompanyUsers_auth_provider CHECK (
        auth_provider IN ('local_password', 'entra_external_id')
    );

    ALTER TABLE dbo.CompanyUsers
    CHECK CONSTRAINT CK_CompanyUsers_auth_provider;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'CK_CompanyUsers_password_required'
)
BEGIN
    ALTER TABLE dbo.CompanyUsers WITH CHECK
    ADD CONSTRAINT CK_CompanyUsers_password_required CHECK (
        (
            auth_provider = 'local_password'
            AND external_subject IS NULL
            AND (
                status = 'invited'
                OR (
                    password_hash IS NOT NULL
                    AND password_algorithm IS NOT NULL
                    AND password_updated_at IS NOT NULL
                )
            )
        )
        OR (
            auth_provider = 'entra_external_id'
            AND external_subject IS NOT NULL
            AND password_hash IS NULL
            AND password_algorithm IS NULL
            AND password_params IS NULL
            AND password_updated_at IS NULL
        )
    );

    ALTER TABLE dbo.CompanyUsers
    CHECK CONSTRAINT CK_CompanyUsers_password_required;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'CK_CompanyUsers_password_failed_attempts'
)
BEGIN
    ALTER TABLE dbo.CompanyUsers WITH CHECK
    ADD CONSTRAINT CK_CompanyUsers_password_failed_attempts CHECK (
        password_failed_attempts >= 0
    );

    ALTER TABLE dbo.CompanyUsers
    CHECK CONSTRAINT CK_CompanyUsers_password_failed_attempts;
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
    ON dbo.CompanyUsers (auth_provider, external_subject)
    WHERE external_subject IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'UX_CompanyUsers_local_password_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanyUsers_local_password_email
    ON dbo.CompanyUsers (email)
    WHERE auth_provider = 'local_password';
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'IX_CompanyUsers_login_email'
)
BEGIN
    CREATE INDEX IX_CompanyUsers_login_email
    ON dbo.CompanyUsers (email, auth_provider, status)
    INCLUDE (
        id,
        company_id,
        role,
        display_name,
        password_hash,
        password_algorithm,
        password_params,
        password_locked_until
    );
END;
GO

IF OBJECT_ID('dbo.CompanyUsers', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.key_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.CompanyUsers')
      AND name = 'UQ_CompanyUsers_company_id_id'
)
BEGIN
    ALTER TABLE dbo.CompanyUsers
    ADD CONSTRAINT UQ_CompanyUsers_company_id_id UNIQUE (company_id, id);
END;
GO

IF OBJECT_ID('dbo.CompanySessions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CompanySessions (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        company_user_id bigint NOT NULL,
        token_hash varbinary(32) NOT NULL,
        status varchar(30) NOT NULL
            CONSTRAINT DF_CompanySessions_status DEFAULT ('active'),
        expires_at datetime2(0) NOT NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CompanySessions_created_at DEFAULT (SYSUTCDATETIME()),
        last_seen_at datetime2(0) NULL,
        revoked_at datetime2(0) NULL,
        CONSTRAINT PK_CompanySessions PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_CompanySessions_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_CompanySessions_CompanyUsers
            FOREIGN KEY (company_id, company_user_id)
            REFERENCES dbo.CompanyUsers(company_id, id),
        CONSTRAINT CK_CompanySessions_token_hash_length CHECK (
            DATALENGTH(token_hash) = 32
        ),
        CONSTRAINT CK_CompanySessions_status CHECK (
            status IN ('active', 'revoked', 'expired')
        ),
        CONSTRAINT CK_CompanySessions_expiration CHECK (
            expires_at > created_at
        ),
        CONSTRAINT CK_CompanySessions_revoked_at CHECK (
            (status = 'revoked' AND revoked_at IS NOT NULL)
            OR (status <> 'revoked')
        )
    );
END;
GO

IF OBJECT_ID('dbo.CompanySessions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanySessions')
      AND name = 'UX_CompanySessions_token_hash'
)
BEGIN
    CREATE UNIQUE INDEX UX_CompanySessions_token_hash
    ON dbo.CompanySessions (token_hash);
END;
GO

IF OBJECT_ID('dbo.CompanySessions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanySessions')
      AND name = 'IX_CompanySessions_company_user_status'
)
BEGIN
    CREATE INDEX IX_CompanySessions_company_user_status
    ON dbo.CompanySessions (company_id, company_user_id, status, expires_at DESC)
    INCLUDE (last_seen_at, revoked_at);
END;
GO

IF OBJECT_ID('dbo.CompanySessions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CompanySessions')
      AND name = 'IX_CompanySessions_status_expiration'
)
BEGIN
    CREATE INDEX IX_CompanySessions_status_expiration
    ON dbo.CompanySessions (status, expires_at)
    INCLUDE (company_id, company_user_id);
END;
GO
