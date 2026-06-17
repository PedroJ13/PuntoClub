-- Punto Club membership transactions.
-- Non-destructive migration: creates economic ledger for membership sales and renewals.

IF OBJECT_ID('dbo.MembershipTransactions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.MembershipTransactions (
        id bigint IDENTITY(1,1) NOT NULL,
        company_id bigint NOT NULL,
        customer_id bigint NOT NULL,
        customer_membership_id bigint NOT NULL,
        membership_plan_id bigint NOT NULL,
        transaction_type varchar(30) NOT NULL,
        payment_method varchar(30) NOT NULL,
        amount decimal(18,2) NOT NULL,
        transaction_date date NOT NULL,
        note nvarchar(500) NULL,
        created_at datetime2(0) NOT NULL
            CONSTRAINT DF_MembershipTransactions_created_at DEFAULT (SYSUTCDATETIME()),
        created_by_label nvarchar(160) NULL,
        CONSTRAINT PK_MembershipTransactions PRIMARY KEY CLUSTERED (id),
        CONSTRAINT FK_MembershipTransactions_Companies
            FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
        CONSTRAINT FK_MembershipTransactions_Customers
            FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
        CONSTRAINT FK_MembershipTransactions_CustomerMemberships
            FOREIGN KEY (customer_membership_id) REFERENCES dbo.CustomerMemberships(id),
        CONSTRAINT FK_MembershipTransactions_MembershipPlans
            FOREIGN KEY (membership_plan_id) REFERENCES dbo.MembershipPlans(id),
        CONSTRAINT CK_MembershipTransactions_type CHECK (
            transaction_type IN ('new_membership', 'renewal', 'adjustment', 'cancellation')
        ),
        CONSTRAINT CK_MembershipTransactions_payment_method CHECK (
            payment_method IN ('cash', 'card', 'credit', 'transfer', 'other')
        ),
        CONSTRAINT CK_MembershipTransactions_amount CHECK (amount >= 0)
    );
END;
GO

IF OBJECT_ID('dbo.MembershipTransactions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipTransactions')
      AND name = 'IX_MembershipTransactions_company_date'
)
BEGIN
    CREATE INDEX IX_MembershipTransactions_company_date
    ON dbo.MembershipTransactions (company_id, transaction_date DESC, id DESC)
    INCLUDE (
        customer_id,
        customer_membership_id,
        membership_plan_id,
        transaction_type,
        payment_method,
        amount,
        created_at
    );
END;
GO

IF OBJECT_ID('dbo.MembershipTransactions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipTransactions')
      AND name = 'IX_MembershipTransactions_customer_date'
)
BEGIN
    CREATE INDEX IX_MembershipTransactions_customer_date
    ON dbo.MembershipTransactions (company_id, customer_id, transaction_date DESC, id DESC)
    INCLUDE (
        customer_membership_id,
        membership_plan_id,
        transaction_type,
        payment_method,
        amount,
        created_by_label
    );
END;
GO

IF OBJECT_ID('dbo.MembershipTransactions', 'U') IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.MembershipTransactions')
      AND name = 'IX_MembershipTransactions_membership_date'
)
BEGIN
    CREATE INDEX IX_MembershipTransactions_membership_date
    ON dbo.MembershipTransactions (company_id, customer_membership_id, transaction_date DESC, id DESC)
    INCLUDE (transaction_type, payment_method, amount);
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
            'customer.membership.renewed',
            'membership.benefit.used',
            'membership.transaction.created'
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
            'company_logo',
            'membership_plan',
            'membership_benefit',
            'customer_membership',
            'membership_benefit_usage',
            'membership_transaction'
        )
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_entity_type;
END;
GO
