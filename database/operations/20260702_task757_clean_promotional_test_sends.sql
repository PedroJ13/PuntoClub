/*
Punto Club - TASK-757
Prepare safe cleanup of promotional test send markers.

Purpose:
- Remove promotional recipient/send markers created during controlled tests.
- Reset affected campaign state so customers can be selected again in future tests.

Strict non-goals:
- Do not delete customers.
- Do not modify points, purchases, redemptions, memberships, benefits or ledgers.
- Do not delete campaigns/templates.
- Do not delete campaign images.
- Do not modify CustomerPromotionalEmailPreferences.
- Do not delete PromotionalUnsubscribeEvents.

Execution model:
- Dry-run by default.
- To apply, set @DryRun = 0 and @ConfirmTask = 'TASK-757-APPLY'.
- Review every SELECT result set before applying.
- Save/export the result sets as execution evidence before commit.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @DryRun bit = 1;
DECLARE @ConfirmTask nvarchar(40) = N'DRY-RUN';

-- Optional scope controls. Leave NULL for all companies/campaigns approved by TASK-756.
DECLARE @CompanyId bigint = NULL;
DECLARE @CampaignId bigint = NULL;

-- Safety valve. Leave NULL to clean every promotional recipient marker in scope.
-- Example: SET @SelectedFromUtc = '2026-07-01T00:00:00';
DECLARE @SelectedFromUtc datetime2(0) = NULL;
DECLARE @SelectedToUtc datetime2(0) = NULL;

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NULL
BEGIN
    THROW 51000, 'dbo.PromotionalCampaignRecipients does not exist.', 1;
END;

IF OBJECT_ID('dbo.PromotionalCampaigns', 'U') IS NULL
BEGIN
    THROW 51001, 'dbo.PromotionalCampaigns does not exist.', 1;
END;

IF @DryRun = 0 AND @ConfirmTask <> N'TASK-757-APPLY'
BEGIN
    THROW 51002, 'Set @ConfirmTask = TASK-757-APPLY before applying cleanup.', 1;
END;

DROP TABLE IF EXISTS #RecipientsToClean;
DROP TABLE IF EXISTS #CampaignsAffected;

SELECT
    recipients.id AS recipient_id,
    recipients.company_id,
    recipients.campaign_id,
    campaigns.name AS campaign_name,
    campaigns.subject AS campaign_subject,
    campaigns.status AS campaign_status_before,
    campaigns.confirmed_at AS campaign_confirmed_at_before,
    campaigns.sent_at AS campaign_sent_at_before,
    recipients.customer_id,
    customers.name AS customer_name,
    recipients.recipient_email,
    recipients.status AS recipient_status,
    recipients.skip_reason,
    recipients.provider,
    recipients.provider_message_id,
    recipients.last_error,
    recipients.selected_at,
    recipients.sent_at,
    recipients.updated_at
INTO #RecipientsToClean
FROM dbo.PromotionalCampaignRecipients AS recipients
INNER JOIN dbo.PromotionalCampaigns AS campaigns
    ON campaigns.id = recipients.campaign_id
   AND campaigns.company_id = recipients.company_id
LEFT JOIN dbo.Customers AS customers
    ON customers.company_id = recipients.company_id
   AND customers.id = recipients.customer_id
WHERE (@CompanyId IS NULL OR recipients.company_id = @CompanyId)
  AND (@CampaignId IS NULL OR recipients.campaign_id = @CampaignId)
  AND (@SelectedFromUtc IS NULL OR recipients.selected_at >= @SelectedFromUtc)
  AND (@SelectedToUtc IS NULL OR recipients.selected_at < @SelectedToUtc);

SELECT DISTINCT
    campaign_id,
    company_id,
    campaign_name,
    campaign_subject,
    campaign_status_before,
    campaign_confirmed_at_before,
    campaign_sent_at_before
INTO #CampaignsAffected
FROM #RecipientsToClean;

-- Evidence 1: execution parameters.
SELECT
    @DryRun AS dry_run,
    @ConfirmTask AS confirm_task,
    @CompanyId AS scope_company_id,
    @CampaignId AS scope_campaign_id,
    @SelectedFromUtc AS selected_from_utc,
    @SelectedToUtc AS selected_to_utc,
    SYSUTCDATETIME() AS generated_at_utc;

-- Evidence 2: totals by company/campaign/status before cleanup.
SELECT
    company_id,
    campaign_id,
    campaign_name,
    campaign_status_before,
    recipient_status,
    COUNT(*) AS recipient_count,
    MIN(selected_at) AS first_selected_at,
    MAX(updated_at) AS last_updated_at
FROM #RecipientsToClean
GROUP BY
    company_id,
    campaign_id,
    campaign_name,
    campaign_status_before,
    recipient_status
ORDER BY company_id, campaign_id, recipient_status;

-- Evidence 3: detail export. Save this result set before applying.
SELECT
    recipient_id,
    company_id,
    campaign_id,
    campaign_name,
    campaign_status_before,
    customer_id,
    customer_name,
    recipient_email,
    recipient_status,
    skip_reason,
    provider,
    provider_message_id,
    last_error,
    selected_at,
    sent_at,
    updated_at
FROM #RecipientsToClean
ORDER BY company_id, campaign_id, customer_id, recipient_id;

-- Evidence 4: affected campaign snapshot before cleanup.
SELECT
    campaigns.company_id,
    campaigns.id AS campaign_id,
    campaigns.name,
    campaigns.subject,
    campaigns.status,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.cancelled_at,
    campaigns.updated_at,
    COUNT(recipients.id) AS total_recipients_before,
    SUM(CASE WHEN recipients.status = 'pending' THEN 1 ELSE 0 END) AS pending_before,
    SUM(CASE WHEN recipients.status = 'sent' THEN 1 ELSE 0 END) AS sent_before,
    SUM(CASE WHEN recipients.status = 'failed' THEN 1 ELSE 0 END) AS failed_before,
    SUM(CASE WHEN recipients.status = 'skipped' THEN 1 ELSE 0 END) AS skipped_before
FROM dbo.PromotionalCampaigns AS campaigns
INNER JOIN #CampaignsAffected AS affected
    ON affected.campaign_id = campaigns.id
   AND affected.company_id = campaigns.company_id
LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
    ON recipients.campaign_id = campaigns.id
   AND recipients.company_id = campaigns.company_id
GROUP BY
    campaigns.company_id,
    campaigns.id,
    campaigns.name,
    campaigns.subject,
    campaigns.status,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.cancelled_at,
    campaigns.updated_at
ORDER BY campaigns.company_id, campaigns.id;

IF EXISTS (
    SELECT 1
    FROM dbo.PromotionalUnsubscribeEvents AS events
    INNER JOIN #RecipientsToClean AS cleanup
        ON cleanup.recipient_id = events.recipient_id
)
BEGIN
    SELECT
        events.id AS unsubscribe_event_id,
        events.company_id,
        events.customer_id,
        events.campaign_id,
        events.recipient_id,
        events.source,
        events.created_at
    FROM dbo.PromotionalUnsubscribeEvents AS events
    INNER JOIN #RecipientsToClean AS cleanup
        ON cleanup.recipient_id = events.recipient_id
    ORDER BY events.company_id, events.campaign_id, events.recipient_id;

    THROW 51003, 'Cleanup stopped: selected recipients are referenced by PromotionalUnsubscribeEvents. Do not delete without separate Product decision.', 1;
END;

IF NOT EXISTS (SELECT 1 FROM #RecipientsToClean)
BEGIN
    PRINT 'No promotional recipient markers matched the selected scope.';
    RETURN;
END;

BEGIN TRANSACTION;

    DELETE recipients
    FROM dbo.PromotionalCampaignRecipients AS recipients
    INNER JOIN #RecipientsToClean AS cleanup
        ON cleanup.recipient_id = recipients.id;

    UPDATE campaigns
    SET
        status = 'draft',
        confirmed_at = NULL,
        sent_at = NULL,
        updated_at = SYSUTCDATETIME()
    FROM dbo.PromotionalCampaigns AS campaigns
    INNER JOIN #CampaignsAffected AS affected
        ON affected.campaign_id = campaigns.id
       AND affected.company_id = campaigns.company_id
    WHERE campaigns.status IN ('ready', 'sending', 'sent', 'failed');

    -- Post-change validation inside the transaction.
    SELECT
        cleanup.company_id,
        cleanup.campaign_id,
        COUNT(recipients.id) AS remaining_cleaned_recipients
    FROM #RecipientsToClean AS cleanup
    LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.id = cleanup.recipient_id
    GROUP BY cleanup.company_id, cleanup.campaign_id
    ORDER BY cleanup.company_id, cleanup.campaign_id;

    SELECT
        campaigns.company_id,
        campaigns.id AS campaign_id,
        campaigns.name,
        affected.campaign_status_before,
        campaigns.status AS campaign_status_after,
        affected.campaign_confirmed_at_before,
        campaigns.confirmed_at AS campaign_confirmed_at_after,
        affected.campaign_sent_at_before,
        campaigns.sent_at AS campaign_sent_at_after,
        COUNT(recipients.id) AS total_recipients_after
    FROM dbo.PromotionalCampaigns AS campaigns
    INNER JOIN #CampaignsAffected AS affected
        ON affected.campaign_id = campaigns.id
       AND affected.company_id = campaigns.company_id
    LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.campaign_id = campaigns.id
       AND recipients.company_id = campaigns.company_id
    GROUP BY
        campaigns.company_id,
        campaigns.id,
        campaigns.name,
        affected.campaign_status_before,
        campaigns.status,
        affected.campaign_confirmed_at_before,
        campaigns.confirmed_at,
        affected.campaign_sent_at_before,
        campaigns.sent_at
    ORDER BY campaigns.company_id, campaigns.id;

    IF EXISTS (
        SELECT 1
        FROM #RecipientsToClean AS cleanup
        INNER JOIN dbo.PromotionalCampaignRecipients AS recipients
            ON recipients.id = cleanup.recipient_id
    )
    BEGIN
        THROW 51004, 'Post-validation failed: some selected recipients still exist.', 1;
    END;

    IF @DryRun = 1
    BEGIN
        PRINT 'DRY RUN: rolling back cleanup. Set @DryRun = 0 and @ConfirmTask = TASK-757-APPLY to commit.';
        ROLLBACK TRANSACTION;
    END
    ELSE
    BEGIN
        PRINT 'APPLY MODE: committing cleanup.';
        COMMIT TRANSACTION;
    END;

-- Rollback plan after commit:
-- 1. Use the Evidence 3 detail export to reconstruct deleted rows if Product approves.
-- 2. Restore campaign status/timestamps from Evidence 4 for affected campaigns.
-- 3. Do not restore by memory; use saved result sets only.
