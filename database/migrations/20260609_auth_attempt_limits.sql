-- Punto Club auth rate limiting / lockout state.
-- Stores only SHA-256-sized hashes of email, IP, invitation token, or equivalent subjects.
-- Never store raw passwords, raw tokens, cookies, emails, IPs, or connection strings here.
--
-- Recommended prevalidation queries before applying:
--
-- 1. Existing table check:
--    SELECT OBJECT_ID('dbo.AuthAttemptLimits', 'U') AS auth_attempt_limits_object_id;
--
-- 2. If the table already exists, check unsupported scopes:
--    SELECT scope, COUNT(*) AS rows_count
--    FROM dbo.AuthAttemptLimits
--    GROUP BY scope
--    HAVING scope NOT IN (
--        'company_login_email',
--        'company_login_ip',
--        'company_invitation_token',
--        'company_invitation_ip'
--    );
--
-- 3. If the table already exists, check duplicate logical rows:
--    SELECT scope, subject_hash, COUNT(*) AS duplicates
--    FROM dbo.AuthAttemptLimits
--    GROUP BY scope, subject_hash
--    HAVING COUNT(*) > 1;

IF OBJECT_ID('dbo.AuthAttemptLimits', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuthAttemptLimits (
        id bigint IDENTITY(1,1) NOT NULL,
        scope varchar(40) NOT NULL,
        subject_hash varbinary(32) NOT NULL,
        window_started_at datetime2(0) NOT NULL,
        failed_count int NOT NULL
            CONSTRAINT DF_AuthAttemptLimits_failed_count DEFAULT (0),
        locked_until datetime2(0) NULL,
        last_failed_at datetime2(0) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_AuthAttemptLimits_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_AuthAttemptLimits_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_AuthAttemptLimits PRIMARY KEY CLUSTERED (id),
        CONSTRAINT CK_AuthAttemptLimits_scope CHECK (
            scope IN (
                'company_login_email',
                'company_login_ip',
                'company_invitation_token',
                'company_invitation_ip'
            )
        ),
        CONSTRAINT CK_AuthAttemptLimits_subject_hash_length CHECK (
            DATALENGTH(subject_hash) = 32
        ),
        CONSTRAINT CK_AuthAttemptLimits_failed_count CHECK (
            failed_count >= 0
        ),
        CONSTRAINT CK_AuthAttemptLimits_lock_window CHECK (
            locked_until IS NULL
            OR locked_until >= window_started_at
        )
    );
END;
GO

IF OBJECT_ID('dbo.AuthAttemptLimits', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.AuthAttemptLimits')
      AND name = 'UX_AuthAttemptLimits_scope_subject_hash'
)
BEGIN
    CREATE UNIQUE INDEX UX_AuthAttemptLimits_scope_subject_hash
    ON dbo.AuthAttemptLimits (scope, subject_hash);
END;
GO

IF OBJECT_ID('dbo.AuthAttemptLimits', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.AuthAttemptLimits')
      AND name = 'IX_AuthAttemptLimits_locked_until'
)
BEGIN
    CREATE INDEX IX_AuthAttemptLimits_locked_until
    ON dbo.AuthAttemptLimits (locked_until)
    INCLUDE (scope, failed_count, updated_at)
    WHERE locked_until IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.AuthAttemptLimits', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.AuthAttemptLimits')
      AND name = 'IX_AuthAttemptLimits_updated_at'
)
BEGIN
    CREATE INDEX IX_AuthAttemptLimits_updated_at
    ON dbo.AuthAttemptLimits (updated_at)
    INCLUDE (scope, locked_until, failed_count);
END;
GO
