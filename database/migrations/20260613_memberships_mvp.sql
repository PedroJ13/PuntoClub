-- Punto Club memberships MVP.
-- Non-destructive migration: adds loyalty feature flags, membership plan/benefit tables,
-- customer memberships, benefit usage ledger, and expands audit allowlists.

IF COL_LENGTH('dbo.Companies', 'loyalty_points_enabled') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD loyalty_points_enabled bit NOT NULL
        CONSTRAINT DF_Companies_loyalty_points_enabled DEFAULT (1);
END;
GO

IF COL_LENGTH('dbo.Companies', 'loyalty_memberships_enabled') IS NULL
BEGIN
    ALTER TABLE dbo.Companies
    ADD loyalty_memberships_enabled bit NOT NULL
        CONSTRAINT DF_Companies_loyalty_memberships_enabled DEFAULT (0);
END;
GO

IF OBJECT_ID('dbo.MembershipPlans', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MembershipPlans (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        name nvarchar(160) NOT NULL,
        description nvarchar(500) NULL,
        duration_days int NOT NULL,
        price decimal(18,2) NOT NULL,
        renewal_notice_days int NOT NULL
            CONSTRAINT DF_MembershipPlans_renewal_notice_days DEFAULT (5),
        status varchar(20) NOT NULL
            CONSTRAINT DF_MembershipPlans_status DEFAULT ('active'),
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipPlans_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipPlans_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_MembershipPlans PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_MembershipPlans_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT CK_MembershipPlans_duration_days CHECK (duration_days > 0),
        CONSTRAINT CK_MembershipPlans_price CHECK (price >= 0),
        CONSTRAINT CK_MembershipPlans_renewal_notice_days CHECK (renewal_notice_days >= 0),
        CONSTRAINT CK_MembershipPlans_status CHECK (status IN ('active', 'inactive'))
    );
END;
GO

IF OBJECT_ID('dbo.MembershipPlans', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipPlans')
      AND name = 'IX_MembershipPlans_company_status'
)
BEGIN
    CREATE INDEX IX_MembershipPlans_company_status
    ON dbo.MembershipPlans (company_id, status, name)
    INCLUDE (duration_days, price, renewal_notice_days, updated_at);
END;
GO

IF OBJECT_ID('dbo.MembershipBenefits', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MembershipBenefits (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        membership_plan_id bigint NOT NULL,
        name nvarchar(160) NOT NULL,
        description nvarchar(500) NULL,
        benefit_type varchar(30) NOT NULL,
        applies_to_type varchar(30) NOT NULL
            CONSTRAINT DF_MembershipBenefits_applies_to_type DEFAULT ('text'),
        applies_to_name nvarchar(160) NULL,
        discount_percent decimal(5,2) NULL,
        included_quantity int NULL,
        usage_limit int NULL,
        usage_period varchar(30) NOT NULL
            CONSTRAINT DF_MembershipBenefits_usage_period DEFAULT ('none'),
        status varchar(20) NOT NULL
            CONSTRAINT DF_MembershipBenefits_status DEFAULT ('active'),
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipBenefits_created_at DEFAULT (SYSUTCDATETIME()),
        updated_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipBenefits_updated_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_MembershipBenefits PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_MembershipBenefits_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_MembershipBenefits_MembershipPlans
            FOREIGN KEY (membership_plan_id) REFERENCES dbo.MembershipPlans(id),
        CONSTRAINT CK_MembershipBenefits_type CHECK (
            benefit_type IN ('informational', 'discount', 'allowance', 'free_item')
        ),
        CONSTRAINT CK_MembershipBenefits_applies_to_type CHECK (
            applies_to_type IN ('product', 'service', 'category', 'text')
        ),
        CONSTRAINT CK_MembershipBenefits_usage_period CHECK (
            usage_period IN ('none', 'day', 'week', 'month', 'membership_term')
        ),
        CONSTRAINT CK_MembershipBenefits_status CHECK (status IN ('active', 'inactive')),
        CONSTRAINT CK_MembershipBenefits_discount_percent CHECK (
            discount_percent IS NULL
            OR (discount_percent > 0 AND discount_percent <= 100)
        ),
        CONSTRAINT CK_MembershipBenefits_included_quantity CHECK (
            included_quantity IS NULL OR included_quantity > 0
        ),
        CONSTRAINT CK_MembershipBenefits_usage_limit CHECK (
            usage_limit IS NULL OR usage_limit > 0
        ),
        CONSTRAINT CK_MembershipBenefits_discount_required CHECK (
            benefit_type <> 'discount'
            OR (discount_percent IS NOT NULL AND discount_percent > 0 AND discount_percent <= 100)
        ),
        CONSTRAINT CK_MembershipBenefits_controlled_usage CHECK (
            benefit_type IN ('informational', 'discount')
            OR (usage_period <> 'none' AND usage_limit IS NOT NULL AND included_quantity IS NOT NULL)
        )
    );
END;
GO

IF OBJECT_ID('dbo.MembershipBenefits', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipBenefits')
      AND name = 'IX_MembershipBenefits_plan_status'
)
BEGIN
    CREATE INDEX IX_MembershipBenefits_plan_status
    ON dbo.MembershipBenefits (company_id, membership_plan_id, status)
    INCLUDE (
        name,
        benefit_type,
        applies_to_type,
        applies_to_name,
        discount_percent,
        included_quantity,
        usage_limit,
        usage_period,
        updated_at
    );
END;
GO

IF OBJECT_ID('dbo.CustomerMemberships', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CustomerMemberships (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        membership_plan_id bigint NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        status varchar(20) NOT NULL
            CONSTRAINT DF_CustomerMemberships_status DEFAULT ('active'),
        price_paid decimal(18,2) NOT NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_CustomerMemberships_created_at DEFAULT (SYSUTCDATETIME()),
        cancelled_at datetime2(0) NULL,
        cancelled_by_label nvarchar(160) NULL,
        cancel_note nvarchar(500) NULL,
        CONSTRAINT PK_CustomerMemberships PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_CustomerMemberships_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_CustomerMemberships_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT FK_CustomerMemberships_MembershipPlans
            FOREIGN KEY (membership_plan_id) REFERENCES dbo.MembershipPlans(id),
        CONSTRAINT CK_CustomerMemberships_dates CHECK (end_date >= start_date),
        CONSTRAINT CK_CustomerMemberships_price_paid CHECK (price_paid >= 0),
        CONSTRAINT CK_CustomerMemberships_status CHECK (status IN ('active', 'expired', 'cancelled')),
        CONSTRAINT CK_CustomerMemberships_cancelled CHECK (
            (status <> 'cancelled' AND cancelled_at IS NULL)
            OR (status = 'cancelled' AND cancelled_at IS NOT NULL)
        )
    );
END;
GO

IF OBJECT_ID('dbo.CustomerMemberships', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CustomerMemberships')
      AND name = 'IX_CustomerMemberships_customer_status_dates'
)
BEGIN
    CREATE INDEX IX_CustomerMemberships_customer_status_dates
    ON dbo.CustomerMemberships (company_id, customer_id, status, start_date, end_date)
    INCLUDE (membership_plan_id, price_paid, created_at);
END;
GO

IF OBJECT_ID('dbo.CustomerMemberships', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.CustomerMemberships')
      AND name = 'UX_CustomerMemberships_one_active_per_customer'
)
BEGIN
    CREATE UNIQUE INDEX UX_CustomerMemberships_one_active_per_customer
    ON dbo.CustomerMemberships (company_id, customer_id)
    WHERE status = 'active';
END;
GO

IF OBJECT_ID('dbo.MembershipBenefitUsages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MembershipBenefitUsages (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        customer_membership_id bigint NOT NULL,
        membership_benefit_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        used_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipBenefitUsages_used_at DEFAULT (SYSUTCDATETIME()),
        usage_date date NOT NULL,
        usage_period_start_date date NOT NULL,
        quantity int NOT NULL
            CONSTRAINT DF_MembershipBenefitUsages_quantity DEFAULT (1),
        note nvarchar(500) NULL,
        created_by_label nvarchar(160) NULL,
        CONSTRAINT PK_MembershipBenefitUsages PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_MembershipBenefitUsages_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_MembershipBenefitUsages_CustomerMemberships
            FOREIGN KEY (customer_membership_id) REFERENCES dbo.CustomerMemberships(id),
        CONSTRAINT FK_MembershipBenefitUsages_MembershipBenefits
            FOREIGN KEY (membership_benefit_id) REFERENCES dbo.MembershipBenefits(id),
        CONSTRAINT FK_MembershipBenefitUsages_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT CK_MembershipBenefitUsages_quantity CHECK (quantity > 0)
    );
END;
GO

IF OBJECT_ID('dbo.MembershipBenefitUsages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipBenefitUsages')
      AND name = 'IX_MembershipBenefitUsages_period'
)
BEGIN
    CREATE INDEX IX_MembershipBenefitUsages_period
    ON dbo.MembershipBenefitUsages (
        company_id,
        customer_id,
        membership_benefit_id,
        usage_period_start_date
    )
    INCLUDE (customer_membership_id, quantity, used_at);
END;
GO

IF OBJECT_ID('dbo.MembershipBenefitUsages', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipBenefitUsages')
      AND name = 'IX_MembershipBenefitUsages_membership'
)
BEGIN
    CREATE INDEX IX_MembershipBenefitUsages_membership
    ON dbo.MembershipBenefitUsages (company_id, customer_membership_id, used_at DESC)
    INCLUDE (membership_benefit_id, customer_id, usage_date, quantity);
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
            'company.logo.updated',
            'membership.plan.created',
            'membership.plan.updated',
            'membership.benefit.created',
            'membership.benefit.updated',
            'customer.membership.activated',
            'customer.membership.cancelled',
            'membership.benefit.used'
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
            'company_user',
            'membership_plan',
            'membership_benefit',
            'customer_membership',
            'membership_benefit_usage'
        )
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_entity_type;
END;
GO
