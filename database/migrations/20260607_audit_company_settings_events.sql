-- Punto Club operational audit events for company settings.
-- Non-destructive migration: expands allowed audit event/entity values only.

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
            'company.settings.updated'
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
        entity_type IN ('customer', 'purchase', 'redemption', 'company')
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_entity_type;
END;
GO
