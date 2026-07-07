/*
Punto Club - TASK-807
Controlled cleanup of QA birthday release data.

Purpose:
- Identify and optionally delete only QA customers/campaigns created during
  TASK-785 and TASK-802 birthday QA.

Strict non-goals:
- Do not delete real customers.
- Do not delete points, purchases, redemptions, memberships, preferences,
  unsubscribe events, non-QA operational email events or productive campaigns.
- Do not delete productive campaign images or blobs from storage.
- Do not send emails.

Execution model:
- Dry-run by default.
- To apply, set @DryRun = 0 and @ConfirmTask = 'TASK-807-APPLY'.
- Review every SELECT result set before applying.
- If any blocker appears, the script throws before deleting.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;

DECLARE @DryRun bit = 1;
DECLARE @ConfirmTask nvarchar(40) = N'DRY-RUN';

DECLARE @CompanyId bigint = 8;
DECLARE @QaCreatedFromUtc datetime2(0) = '2026-07-06T00:00:00';
DECLARE @QaCreatedToUtc datetime2(0) = '2026-07-08T23:59:59';

IF @DryRun = 0 AND @ConfirmTask <> N'TASK-807-APPLY'
BEGIN
    THROW 58070, 'Set @ConfirmTask = TASK-807-APPLY before applying cleanup.', 1;
END;

IF OBJECT_ID('dbo.Customers', 'U') IS NULL
BEGIN
    THROW 58071, 'dbo.Customers does not exist.', 1;
END;

IF OBJECT_ID('dbo.PromotionalCampaigns', 'U') IS NULL
BEGIN
    THROW 58072, 'dbo.PromotionalCampaigns does not exist.', 1;
END;

DROP TABLE IF EXISTS #QaCustomers;
DROP TABLE IF EXISTS #QaCampaigns;
DROP TABLE IF EXISTS #QaCampaignRecipients;
DROP TABLE IF EXISTS #QaCampaignImages;
DROP TABLE IF EXISTS #QaOperationalEmailEvents;
DROP TABLE IF EXISTS #QaOperationalEmailMessages;
DROP TABLE IF EXISTS #QaOperationalEmailAttempts;
DROP TABLE IF EXISTS #QaOperationalAuditEvents;
DROP TABLE IF EXISTS #CustomerBlockers;
DROP TABLE IF EXISTS #CampaignBlockers;
DROP TABLE IF EXISTS #OperationalEmailBlockers;
DROP TABLE IF EXISTS #OperationalAuditBlockers;

SELECT
    customers.id AS customer_id,
    customers.company_id,
    customers.name,
    customers.phone,
    customers.email,
    customers.birth_date,
    customers.created_at,
    customers.updated_at
INTO #QaCustomers
FROM dbo.Customers AS customers
WHERE customers.company_id = @CompanyId
  AND customers.created_at >= @QaCreatedFromUtc
  AND customers.created_at <= @QaCreatedToUtc
  AND (customers.email IS NULL OR LTRIM(RTRIM(customers.email)) = N'')
  AND (
        customers.birth_date IN ('1990-07-06', '1991-07-06', '1990-07-07')
        OR customers.name LIKE N'%QA%'
        OR customers.name LIKE N'%Prueba%'
        OR customers.name LIKE N'%Cumple%'
        OR customers.name LIKE N'%Birthday%'
      );

SELECT
    campaigns.id AS campaign_id,
    campaigns.company_id,
    campaigns.name,
    campaigns.subject,
    campaigns.campaign_type,
    campaigns.status,
    campaigns.include_points,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.created_at,
    campaigns.updated_at
INTO #QaCampaigns
FROM dbo.PromotionalCampaigns AS campaigns
WHERE campaigns.company_id = @CompanyId
  AND campaigns.created_at >= @QaCreatedFromUtc
  AND campaigns.created_at <= @QaCreatedToUtc
  AND campaigns.campaign_type = 'cumpleanos'
  AND campaigns.id <> 19
  AND campaigns.name <> N'Nuevo'
  AND campaigns.subject <> N'Nueva Bebida'
  AND (
        campaigns.name LIKE N'%QA%'
        OR campaigns.subject LIKE N'%QA%'
        OR campaigns.name LIKE N'%Cumple%'
        OR campaigns.subject LIKE N'%Cumple%'
        OR campaigns.name LIKE N'%Birthday%'
        OR campaigns.subject LIKE N'%Birthday%'
      );

SELECT
    recipients.id AS recipient_id,
    recipients.company_id,
    recipients.campaign_id,
    recipients.customer_id,
    customers.name AS customer_name,
    recipients.recipient_email,
    recipients.status,
    recipients.skip_reason,
    recipients.provider,
    CASE WHEN recipients.provider_message_id IS NULL THEN 0 ELSE 1 END AS has_provider_message_id,
    recipients.selected_at,
    recipients.sent_at,
    recipients.updated_at
INTO #QaCampaignRecipients
FROM dbo.PromotionalCampaignRecipients AS recipients
INNER JOIN #QaCampaigns AS campaigns
    ON campaigns.company_id = recipients.company_id
   AND campaigns.campaign_id = recipients.campaign_id
LEFT JOIN dbo.Customers AS customers
    ON customers.id = recipients.customer_id
   AND customers.company_id = recipients.company_id;

SELECT
    images.id AS image_id,
    images.company_id,
    images.campaign_id,
    images.status,
    images.blob_container,
    images.blob_path,
    images.public_id,
    images.original_file_name,
    images.content_type,
    images.size_bytes,
    images.created_at,
    images.updated_at,
    images.replaced_at,
    images.deleted_at
INTO #QaCampaignImages
FROM dbo.PromotionalCampaignImages AS images
INNER JOIN #QaCampaigns AS campaigns
    ON campaigns.company_id = images.company_id
   AND campaigns.campaign_id = images.campaign_id;

SELECT
    events.id AS event_id,
    events.company_id,
    events.customer_id,
    events.event_type,
    events.idempotency_key,
    events.source_entity_type,
    events.source_entity_id,
    events.status,
    events.created_at,
    events.updated_at
INTO #QaOperationalEmailEvents
FROM dbo.OperationalEmailEvents AS events
INNER JOIN #QaCustomers AS customers
    ON customers.company_id = events.company_id
   AND customers.customer_id = events.customer_id
WHERE events.event_type = 'welcome'
  AND events.source_entity_type = 'customer'
  AND events.source_entity_id = events.customer_id;

SELECT
    messages.id AS message_id,
    messages.event_id,
    messages.company_id,
    messages.customer_id,
    messages.recipient_email,
    messages.subject,
    messages.status,
    messages.provider,
    messages.provider_message_id,
    messages.last_error,
    messages.created_at,
    messages.sent_at,
    messages.updated_at
INTO #QaOperationalEmailMessages
FROM dbo.OperationalEmailMessages AS messages
INNER JOIN #QaOperationalEmailEvents AS events
    ON events.event_id = messages.event_id;

SELECT
    attempts.id AS attempt_id,
    attempts.message_id,
    attempts.event_id,
    attempts.company_id,
    attempts.attempt_number,
    attempts.provider,
    attempts.status,
    attempts.provider_message_id,
    attempts.error_message,
    attempts.attempted_at
INTO #QaOperationalEmailAttempts
FROM dbo.OperationalEmailAttempts AS attempts
INNER JOIN #QaOperationalEmailEvents AS events
    ON events.event_id = attempts.event_id;

SELECT
    audit.id AS audit_id,
    audit.company_id,
    audit.event_type,
    audit.entity_type,
    audit.entity_id,
    audit.customer_id,
    audit.occurred_at,
    audit.actor_label,
    audit.source,
    audit.metadata
INTO #QaOperationalAuditEvents
FROM dbo.OperationalAuditEvents AS audit
INNER JOIN #QaCustomers AS customers
    ON customers.company_id = audit.company_id
   AND customers.customer_id = audit.customer_id;

CREATE TABLE #CustomerBlockers (
    blocker_type varchar(80) NOT NULL,
    customer_id bigint NOT NULL,
    blocker_count int NOT NULL
);

INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
SELECT 'purchases', customers.customer_id, COUNT(*)
FROM #QaCustomers AS customers
INNER JOIN dbo.Purchases AS purchases
    ON purchases.company_id = customers.company_id
   AND purchases.customer_id = customers.customer_id
GROUP BY customers.customer_id
HAVING COUNT(*) > 0;

INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
SELECT 'redemptions', customers.customer_id, COUNT(*)
FROM #QaCustomers AS customers
INNER JOIN dbo.Redemptions AS redemptions
    ON redemptions.company_id = customers.company_id
   AND redemptions.customer_id = customers.customer_id
GROUP BY customers.customer_id
HAVING COUNT(*) > 0;

IF OBJECT_ID('dbo.CustomerPointBalances', 'V') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'point_balance_nonzero', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.CustomerPointBalances AS balances
        ON balances.company_id = customers.company_id
       AND balances.customer_id = customers.customer_id
    WHERE COALESCE(balances.points_balance, 0) <> 0
    GROUP BY customers.customer_id;
END;

IF OBJECT_ID('dbo.CustomerMemberships', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'customer_memberships', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.CustomerMemberships AS memberships
        ON memberships.company_id = customers.company_id
       AND memberships.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

IF OBJECT_ID('dbo.MembershipBenefitUsages', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'membership_benefit_usages', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.MembershipBenefitUsages AS usages
        ON usages.company_id = customers.company_id
       AND usages.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

IF OBJECT_ID('dbo.MembershipTransactions', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'membership_transactions', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.MembershipTransactions AS transactions
        ON transactions.company_id = customers.company_id
       AND transactions.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

IF OBJECT_ID('dbo.CustomerPromotionalEmailPreferences', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'promotional_preferences', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.CustomerPromotionalEmailPreferences AS preferences
        ON preferences.company_id = customers.company_id
       AND preferences.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'promotional_recipients', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.company_id = customers.company_id
       AND recipients.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

IF OBJECT_ID('dbo.PromotionalUnsubscribeEvents', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CustomerBlockers (blocker_type, customer_id, blocker_count)
    SELECT 'promotional_unsubscribe_events', customers.customer_id, COUNT(*)
    FROM #QaCustomers AS customers
    INNER JOIN dbo.PromotionalUnsubscribeEvents AS events
        ON events.company_id = customers.company_id
       AND events.customer_id = customers.customer_id
    GROUP BY customers.customer_id
    HAVING COUNT(*) > 0;
END;

CREATE TABLE #CampaignBlockers (
    blocker_type varchar(80) NOT NULL,
    campaign_id bigint NOT NULL,
    blocker_count int NOT NULL
);

CREATE TABLE #OperationalEmailBlockers (
    blocker_type varchar(80) NOT NULL,
    entity_id bigint NOT NULL,
    blocker_count int NOT NULL
);

CREATE TABLE #OperationalAuditBlockers (
    blocker_type varchar(80) NOT NULL,
    audit_id bigint NOT NULL,
    blocker_count int NOT NULL
);

INSERT INTO #OperationalAuditBlockers (blocker_type, audit_id, blocker_count)
SELECT 'audit_not_customer_created', audit_id, COUNT(*)
FROM #QaOperationalAuditEvents
WHERE event_type <> 'customer.created'
   OR entity_type <> 'customer'
   OR entity_id <> customer_id
GROUP BY audit_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalAuditBlockers (blocker_type, audit_id, blocker_count)
SELECT 'audit_email_provided_or_unknown_metadata', audit_id, COUNT(*)
FROM #QaOperationalAuditEvents
WHERE ISNULL(JSON_VALUE(metadata, '$.emailProvided'), 'true') <> 'false'
GROUP BY audit_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'event_not_skipped', event_id, COUNT(*)
FROM #QaOperationalEmailEvents
WHERE status <> 'skipped'
GROUP BY event_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'message_not_skipped', message_id, COUNT(*)
FROM #QaOperationalEmailMessages
WHERE status <> 'skipped'
GROUP BY message_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'message_has_recipient_email', message_id, COUNT(*)
FROM #QaOperationalEmailMessages
WHERE recipient_email IS NOT NULL
GROUP BY message_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'message_has_provider_message_id', message_id, COUNT(*)
FROM #QaOperationalEmailMessages
WHERE provider_message_id IS NOT NULL
GROUP BY message_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'attempt_not_skipped', attempt_id, COUNT(*)
FROM #QaOperationalEmailAttempts
WHERE status <> 'skipped'
GROUP BY attempt_id
HAVING COUNT(*) > 0;

INSERT INTO #OperationalEmailBlockers (blocker_type, entity_id, blocker_count)
SELECT 'attempt_has_provider_message_id', attempt_id, COUNT(*)
FROM #QaOperationalEmailAttempts
WHERE provider_message_id IS NOT NULL
GROUP BY attempt_id
HAVING COUNT(*) > 0;

IF OBJECT_ID('dbo.PromotionalUnsubscribeEvents', 'U') IS NOT NULL
BEGIN
    INSERT INTO #CampaignBlockers (blocker_type, campaign_id, blocker_count)
    SELECT 'promotional_unsubscribe_events', campaigns.campaign_id, COUNT(*)
    FROM #QaCampaigns AS campaigns
    INNER JOIN dbo.PromotionalUnsubscribeEvents AS events
        ON events.company_id = campaigns.company_id
       AND events.campaign_id = campaigns.campaign_id
    GROUP BY campaigns.campaign_id
    HAVING COUNT(*) > 0;
END;

-- Evidence 1: execution parameters.
SELECT
    @DryRun AS dry_run,
    @ConfirmTask AS confirm_task,
    @CompanyId AS company_id,
    @QaCreatedFromUtc AS qa_created_from_utc,
    @QaCreatedToUtc AS qa_created_to_utc,
    SYSUTCDATETIME() AS generated_at_utc;

-- Evidence 2: candidate customers.
SELECT * FROM #QaCustomers ORDER BY created_at, customer_id;

-- Evidence 3: customer blockers. Must be empty before apply.
SELECT * FROM #CustomerBlockers ORDER BY customer_id, blocker_type;

-- Evidence 4: candidate campaigns.
SELECT * FROM #QaCampaigns ORDER BY created_at, campaign_id;

-- Evidence 5: campaign recipients to delete.
SELECT * FROM #QaCampaignRecipients ORDER BY campaign_id, recipient_id;

-- Evidence 6: campaign image metadata to delete. Physical blobs are not deleted here.
SELECT * FROM #QaCampaignImages ORDER BY campaign_id, image_id;

-- Evidence 7: QA operational email events/messages/attempts to delete.
SELECT * FROM #QaOperationalEmailEvents ORDER BY customer_id, event_id;
SELECT * FROM #QaOperationalEmailMessages ORDER BY customer_id, message_id;
SELECT * FROM #QaOperationalEmailAttempts ORDER BY event_id, attempt_id;

-- Evidence 8: operational email blockers. Must be empty before apply.
SELECT * FROM #OperationalEmailBlockers ORDER BY entity_id, blocker_type;

-- Evidence 9: QA operational audit events to delete.
SELECT * FROM #QaOperationalAuditEvents ORDER BY customer_id, audit_id;

-- Evidence 10: operational audit blockers. Must be empty before apply.
SELECT * FROM #OperationalAuditBlockers ORDER BY audit_id, blocker_type;

-- Evidence 11: campaign blockers. Must be empty before apply.
SELECT * FROM #CampaignBlockers ORDER BY campaign_id, blocker_type;

-- Evidence 12: totals.
SELECT
    (SELECT COUNT(*) FROM #QaCustomers) AS candidate_customers,
    (SELECT COUNT(*) FROM #CustomerBlockers) AS customer_blockers,
    (SELECT COUNT(*) FROM #QaCampaigns) AS candidate_campaigns,
    (SELECT COUNT(*) FROM #QaCampaignRecipients) AS candidate_campaign_recipients,
    (SELECT COUNT(*) FROM #QaCampaignImages) AS candidate_campaign_images,
    (SELECT COUNT(*) FROM #QaOperationalEmailEvents) AS candidate_operational_events,
    (SELECT COUNT(*) FROM #QaOperationalEmailMessages) AS candidate_operational_messages,
    (SELECT COUNT(*) FROM #QaOperationalEmailAttempts) AS candidate_operational_attempts,
    (SELECT COUNT(*) FROM #OperationalEmailBlockers) AS operational_email_blockers,
    (SELECT COUNT(*) FROM #QaOperationalAuditEvents) AS candidate_operational_audit_events,
    (SELECT COUNT(*) FROM #OperationalAuditBlockers) AS operational_audit_blockers,
    (SELECT COUNT(*) FROM #CampaignBlockers) AS campaign_blockers;

IF @DryRun = 1
BEGIN
    PRINT 'Dry-run only. Review evidence before applying with @DryRun = 0 and @ConfirmTask = TASK-807-APPLY.';
    RETURN;
END;

IF EXISTS (SELECT 1 FROM #CustomerBlockers)
BEGIN
    THROW 58073, 'Cleanup stopped: at least one QA customer has protected dependencies.', 1;
END;

IF EXISTS (SELECT 1 FROM #CampaignBlockers)
BEGIN
    THROW 58074, 'Cleanup stopped: at least one QA campaign has protected dependencies.', 1;
END;

IF EXISTS (SELECT 1 FROM #OperationalEmailBlockers)
BEGIN
    THROW 58075, 'Cleanup stopped: at least one QA operational email row was not safely skippable.', 1;
END;

IF EXISTS (SELECT 1 FROM #OperationalAuditBlockers)
BEGIN
    THROW 58076, 'Cleanup stopped: at least one QA operational audit row was not safely removable.', 1;
END;

BEGIN TRANSACTION;

    DELETE recipients
    FROM dbo.PromotionalCampaignRecipients AS recipients
    INNER JOIN #QaCampaignRecipients AS cleanup
        ON cleanup.recipient_id = recipients.id;

    DELETE images
    FROM dbo.PromotionalCampaignImages AS images
    INNER JOIN #QaCampaignImages AS cleanup
        ON cleanup.image_id = images.id;

    DELETE campaigns
    FROM dbo.PromotionalCampaigns AS campaigns
    INNER JOIN #QaCampaigns AS cleanup
        ON cleanup.campaign_id = campaigns.id
       AND cleanup.company_id = campaigns.company_id;

    DELETE attempts
    FROM dbo.OperationalEmailAttempts AS attempts
    INNER JOIN #QaOperationalEmailAttempts AS cleanup
        ON cleanup.attempt_id = attempts.id;

    DELETE messages
    FROM dbo.OperationalEmailMessages AS messages
    INNER JOIN #QaOperationalEmailMessages AS cleanup
        ON cleanup.message_id = messages.id;

    DELETE events
    FROM dbo.OperationalEmailEvents AS events
    INNER JOIN #QaOperationalEmailEvents AS cleanup
        ON cleanup.event_id = events.id;

    DELETE audit
    FROM dbo.OperationalAuditEvents AS audit
    INNER JOIN #QaOperationalAuditEvents AS cleanup
        ON cleanup.audit_id = audit.id;

    DELETE customers
    FROM dbo.Customers AS customers
    INNER JOIN #QaCustomers AS cleanup
        ON cleanup.customer_id = customers.id
       AND cleanup.company_id = customers.company_id;

    -- Post-apply validation inside the transaction.
    SELECT
        (SELECT COUNT(*) FROM dbo.Customers AS customers
         INNER JOIN #QaCustomers AS cleanup
            ON cleanup.customer_id = customers.id
           AND cleanup.company_id = customers.company_id) AS remaining_candidate_customers,
        (SELECT COUNT(*) FROM dbo.PromotionalCampaigns AS campaigns
         INNER JOIN #QaCampaigns AS cleanup
            ON cleanup.campaign_id = campaigns.id
           AND cleanup.company_id = campaigns.company_id) AS remaining_candidate_campaigns,
        (SELECT COUNT(*) FROM dbo.PromotionalCampaignRecipients AS recipients
         INNER JOIN #QaCampaignRecipients AS cleanup
            ON cleanup.recipient_id = recipients.id) AS remaining_candidate_recipients,
        (SELECT COUNT(*) FROM dbo.PromotionalCampaignImages AS images
         INNER JOIN #QaCampaignImages AS cleanup
            ON cleanup.image_id = images.id) AS remaining_candidate_images,
        (SELECT COUNT(*) FROM dbo.OperationalEmailEvents AS events
         INNER JOIN #QaOperationalEmailEvents AS cleanup
            ON cleanup.event_id = events.id) AS remaining_candidate_operational_events,
        (SELECT COUNT(*) FROM dbo.OperationalEmailMessages AS messages
         INNER JOIN #QaOperationalEmailMessages AS cleanup
            ON cleanup.message_id = messages.id) AS remaining_candidate_operational_messages,
        (SELECT COUNT(*) FROM dbo.OperationalEmailAttempts AS attempts
         INNER JOIN #QaOperationalEmailAttempts AS cleanup
            ON cleanup.attempt_id = attempts.id) AS remaining_candidate_operational_attempts,
        (SELECT COUNT(*) FROM dbo.OperationalAuditEvents AS audit
         INNER JOIN #QaOperationalAuditEvents AS cleanup
            ON cleanup.audit_id = audit.id) AS remaining_candidate_operational_audit_events;

COMMIT TRANSACTION;

PRINT 'TASK-807 cleanup applied and committed.';
