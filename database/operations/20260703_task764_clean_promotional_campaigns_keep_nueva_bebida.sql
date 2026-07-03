/*
Punto Club - TASK-764
Prepare safe cleanup of promotional test campaigns.

Purpose:
- Delete promotional test campaigns while keeping the approved campaign:
  company_id = 8, campaign_id = 19, name = 'Nuevo', subject = 'Nueva Bebida'.

Strict non-goals:
- Do not delete customers.
- Do not modify points, purchases, redemptions, memberships, benefits or ledgers.
- Do not modify CustomerPromotionalEmailPreferences.
- Do not delete or modify PromotionalUnsubscribeEvents.
- Do not delete physical blobs from storage.
- Do not send emails.

Execution model:
- Dry-run by default.
- To apply in a future approved task, set @DryRun = 0 and @ConfirmTask = 'TASK-764-APPLY'.
- Review every SELECT result set before applying.
- Save/export the result sets as execution evidence before commit.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @DryRun bit = 1;
DECLARE @ConfirmTask nvarchar(40) = N'DRY-RUN';

DECLARE @CompanyId bigint = 8;
DECLARE @KeepCampaignId bigint = 19;
DECLARE @ExpectedKeepName nvarchar(160) = N'Nuevo';
DECLARE @ExpectedKeepSubject nvarchar(200) = N'Nueva Bebida';
DECLARE @ExpectedActiveImagePublicId uniqueidentifier = 'D750ABD9-206B-456F-9345-8C42A03271C8';
DECLARE @RequireRecentSentRecipient bit = 1;

-- Optional: set only if Product confirms the exact target email is mandatory.
-- Current read-only evidence after TASK-760 found a recent recipient for campaign 19,
-- but not for pj13eros@hotmail.com.
DECLARE @ExpectedRecentRecipientEmail nvarchar(254) = NULL;

IF OBJECT_ID('dbo.PromotionalCampaigns', 'U') IS NULL
BEGIN
    THROW 52000, 'dbo.PromotionalCampaigns does not exist.', 1;
END;

IF OBJECT_ID('dbo.PromotionalCampaignImages', 'U') IS NULL
BEGIN
    THROW 52001, 'dbo.PromotionalCampaignImages does not exist.', 1;
END;

IF OBJECT_ID('dbo.PromotionalCampaignRecipients', 'U') IS NULL
BEGIN
    THROW 52002, 'dbo.PromotionalCampaignRecipients does not exist.', 1;
END;

IF OBJECT_ID('dbo.PromotionalUnsubscribeEvents', 'U') IS NULL
BEGIN
    THROW 52003, 'dbo.PromotionalUnsubscribeEvents does not exist.', 1;
END;

IF @DryRun = 0 AND @ConfirmTask <> N'TASK-764-APPLY'
BEGIN
    THROW 52004, 'Set @ConfirmTask = TASK-764-APPLY before applying cleanup.', 1;
END;

DROP TABLE IF EXISTS #KeepCampaign;
DROP TABLE IF EXISTS #CampaignsToDelete;
DROP TABLE IF EXISTS #RecipientsToDelete;
DROP TABLE IF EXISTS #ImagesToDelete;
DROP TABLE IF EXISTS #BlockingUnsubscribeEvents;

SELECT
    campaigns.id AS campaign_id,
    campaigns.company_id,
    campaigns.name,
    campaigns.subject,
    campaigns.status,
    campaigns.include_points,
    campaigns.recipient_limit,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.created_at,
    campaigns.updated_at,
    images.id AS active_image_id,
    images.public_id AS active_image_public_id,
    images.original_file_name AS active_image_file_name,
    images.content_type AS active_image_content_type,
    images.size_bytes AS active_image_size_bytes,
    images.created_at AS active_image_created_at,
    images.updated_at AS active_image_updated_at,
    COUNT(recipients.id) AS recipient_count,
    SUM(CASE WHEN recipients.status = 'sent' THEN 1 ELSE 0 END) AS sent_recipient_count,
    SUM(CASE WHEN recipients.provider = 'acs-email' THEN 1 ELSE 0 END) AS acs_recipient_count,
    SUM(CASE
        WHEN @ExpectedRecentRecipientEmail IS NOT NULL
         AND LOWER(recipients.recipient_email) = LOWER(@ExpectedRecentRecipientEmail)
        THEN 1 ELSE 0 END) AS expected_email_recipient_count
INTO #KeepCampaign
FROM dbo.PromotionalCampaigns AS campaigns
LEFT JOIN dbo.PromotionalCampaignImages AS images
    ON images.company_id = campaigns.company_id
   AND images.campaign_id = campaigns.id
   AND images.status = 'active'
LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
    ON recipients.company_id = campaigns.company_id
   AND recipients.campaign_id = campaigns.id
WHERE campaigns.company_id = @CompanyId
  AND campaigns.id = @KeepCampaignId
GROUP BY
    campaigns.id,
    campaigns.company_id,
    campaigns.name,
    campaigns.subject,
    campaigns.status,
    campaigns.include_points,
    campaigns.recipient_limit,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.created_at,
    campaigns.updated_at,
    images.id,
    images.public_id,
    images.original_file_name,
    images.content_type,
    images.size_bytes,
    images.created_at,
    images.updated_at;

IF NOT EXISTS (SELECT 1 FROM #KeepCampaign)
BEGIN
    THROW 52005, 'Keep campaign was not found.', 1;
END;

IF EXISTS (
    SELECT 1
    FROM #KeepCampaign
    WHERE name <> @ExpectedKeepName
       OR subject <> @ExpectedKeepSubject
       OR active_image_public_id <> @ExpectedActiveImagePublicId
       OR (@RequireRecentSentRecipient = 1 AND sent_recipient_count < 1)
       OR (@ExpectedRecentRecipientEmail IS NOT NULL AND expected_email_recipient_count < 1)
)
BEGIN
    SELECT * FROM #KeepCampaign;
    THROW 52006, 'Keep campaign does not match expected name, subject, active image or recent recipient guard.', 1;
END;

SELECT
    campaigns.id AS campaign_id,
    campaigns.company_id,
    campaigns.name,
    campaigns.subject,
    campaigns.status,
    campaigns.include_points,
    campaigns.recipient_limit,
    campaigns.confirmed_at,
    campaigns.sent_at,
    campaigns.created_at,
    campaigns.updated_at
INTO #CampaignsToDelete
FROM dbo.PromotionalCampaigns AS campaigns
WHERE campaigns.company_id = @CompanyId
  AND campaigns.id <> @KeepCampaignId;

SELECT
    recipients.id AS recipient_id,
    recipients.company_id,
    recipients.campaign_id,
    recipients.customer_id,
    recipients.status,
    recipients.provider,
    CASE WHEN recipients.provider_message_id IS NULL THEN 0 ELSE 1 END AS has_provider_message_id,
    recipients.selected_at,
    recipients.sent_at,
    recipients.updated_at
INTO #RecipientsToDelete
FROM dbo.PromotionalCampaignRecipients AS recipients
INNER JOIN #CampaignsToDelete AS campaigns
    ON campaigns.company_id = recipients.company_id
   AND campaigns.campaign_id = recipients.campaign_id;

SELECT
    images.id AS image_id,
    images.company_id,
    images.campaign_id,
    images.status,
    images.original_file_name,
    images.content_type,
    images.size_bytes,
    images.public_id,
    images.created_at,
    images.updated_at
INTO #ImagesToDelete
FROM dbo.PromotionalCampaignImages AS images
INNER JOIN #CampaignsToDelete AS campaigns
    ON campaigns.company_id = images.company_id
   AND campaigns.campaign_id = images.campaign_id;

SELECT
    events.id AS unsubscribe_event_id,
    events.company_id,
    events.customer_id,
    events.campaign_id,
    events.recipient_id,
    events.source,
    events.created_at
INTO #BlockingUnsubscribeEvents
FROM dbo.PromotionalUnsubscribeEvents AS events
LEFT JOIN #CampaignsToDelete AS campaigns
    ON campaigns.company_id = events.company_id
   AND campaigns.campaign_id = events.campaign_id
LEFT JOIN #RecipientsToDelete AS recipients
    ON recipients.recipient_id = events.recipient_id
WHERE campaigns.campaign_id IS NOT NULL
   OR recipients.recipient_id IS NOT NULL;

-- Evidence 1: execution parameters.
SELECT
    @DryRun AS dry_run,
    @ConfirmTask AS confirm_task,
    @CompanyId AS company_id,
    @KeepCampaignId AS keep_campaign_id,
    @ExpectedKeepName AS expected_keep_name,
    @ExpectedKeepSubject AS expected_keep_subject,
    @ExpectedActiveImagePublicId AS expected_active_image_public_id,
    @RequireRecentSentRecipient AS require_recent_sent_recipient,
    CASE WHEN @ExpectedRecentRecipientEmail IS NULL THEN 0 ELSE 1 END AS expected_recent_recipient_email_required,
    SYSUTCDATETIME() AS generated_at_utc;

-- Evidence 2: campaign that will be preserved.
SELECT * FROM #KeepCampaign;

-- Evidence 3: campaigns that would be deleted.
SELECT * FROM #CampaignsToDelete ORDER BY updated_at DESC, campaign_id DESC;

-- Evidence 4: images metadata that would be deleted. Physical blobs are not deleted by this script.
SELECT * FROM #ImagesToDelete ORDER BY updated_at DESC, image_id DESC;

-- Evidence 5: recipients that would be deleted.
SELECT * FROM #RecipientsToDelete ORDER BY updated_at DESC, recipient_id DESC;

-- Evidence 6: unsubscribe events that block apply.
SELECT * FROM #BlockingUnsubscribeEvents ORDER BY created_at DESC, unsubscribe_event_id DESC;

-- Evidence 7: count summary before cleanup.
SELECT
    'keep_campaigns' AS item,
    COUNT(*) AS row_count
FROM #KeepCampaign
UNION ALL
SELECT 'campaigns_to_delete', COUNT(*) FROM #CampaignsToDelete
UNION ALL
SELECT 'images_to_delete', COUNT(*) FROM #ImagesToDelete
UNION ALL
SELECT 'recipients_to_delete', COUNT(*) FROM #RecipientsToDelete
UNION ALL
SELECT 'blocking_unsubscribe_events', COUNT(*) FROM #BlockingUnsubscribeEvents
UNION ALL
SELECT 'customer_preferences_untouched', COUNT(*) FROM dbo.CustomerPromotionalEmailPreferences WHERE company_id = @CompanyId
UNION ALL
SELECT 'unsubscribe_events_untouched', COUNT(*) FROM dbo.PromotionalUnsubscribeEvents WHERE company_id = @CompanyId
UNION ALL
SELECT 'customers_untouched', COUNT(*) FROM dbo.Customers WHERE company_id = @CompanyId
UNION ALL
SELECT 'purchases_untouched', COUNT(*) FROM dbo.Purchases WHERE company_id = @CompanyId
UNION ALL
SELECT 'redemptions_untouched', COUNT(*) FROM dbo.Redemptions WHERE company_id = @CompanyId
UNION ALL
SELECT 'customer_memberships_untouched', COUNT(*) FROM dbo.CustomerMemberships WHERE company_id = @CompanyId;

IF EXISTS (SELECT 1 FROM #BlockingUnsubscribeEvents)
BEGIN
    IF @DryRun = 0
    BEGIN
        THROW 52007, 'Apply stopped: campaigns/recipients to delete are referenced by PromotionalUnsubscribeEvents.', 1;
    END;

    PRINT 'DRY RUN: blocking PromotionalUnsubscribeEvents found. Apply would stop.';
    RETURN;
END;

IF NOT EXISTS (SELECT 1 FROM #CampaignsToDelete)
BEGIN
    PRINT 'No promotional campaigns matched deletion scope.';
    RETURN;
END;

BEGIN TRANSACTION;

    DELETE recipients
    FROM dbo.PromotionalCampaignRecipients AS recipients
    INNER JOIN #RecipientsToDelete AS cleanup
        ON cleanup.recipient_id = recipients.id;

    DELETE images
    FROM dbo.PromotionalCampaignImages AS images
    INNER JOIN #ImagesToDelete AS cleanup
        ON cleanup.image_id = images.id;

    DELETE campaigns
    FROM dbo.PromotionalCampaigns AS campaigns
    INNER JOIN #CampaignsToDelete AS cleanup
        ON cleanup.company_id = campaigns.company_id
       AND cleanup.campaign_id = campaigns.id;

    -- Post-change validation inside the transaction.
    SELECT
        'remaining_deleted_campaigns' AS item,
        COUNT(*) AS row_count
    FROM dbo.PromotionalCampaigns AS campaigns
    INNER JOIN #CampaignsToDelete AS cleanup
        ON cleanup.company_id = campaigns.company_id
       AND cleanup.campaign_id = campaigns.id
    UNION ALL
    SELECT 'remaining_deleted_images', COUNT(*)
    FROM dbo.PromotionalCampaignImages AS images
    INNER JOIN #ImagesToDelete AS cleanup
        ON cleanup.image_id = images.id
    UNION ALL
    SELECT 'remaining_deleted_recipients', COUNT(*)
    FROM dbo.PromotionalCampaignRecipients AS recipients
    INNER JOIN #RecipientsToDelete AS cleanup
        ON cleanup.recipient_id = recipients.id
    UNION ALL
    SELECT 'kept_campaign_exists', COUNT(*)
    FROM dbo.PromotionalCampaigns
    WHERE company_id = @CompanyId
      AND id = @KeepCampaignId;

    SELECT
        campaigns.id AS campaign_id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.status,
        images.public_id AS active_image_public_id,
        COUNT(recipients.id) AS recipient_count
    FROM dbo.PromotionalCampaigns AS campaigns
    LEFT JOIN dbo.PromotionalCampaignImages AS images
        ON images.company_id = campaigns.company_id
       AND images.campaign_id = campaigns.id
       AND images.status = 'active'
    LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.company_id = campaigns.company_id
       AND recipients.campaign_id = campaigns.id
    WHERE campaigns.company_id = @CompanyId
    GROUP BY
        campaigns.id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.status,
        images.public_id
    ORDER BY campaigns.id;

    IF EXISTS (
        SELECT 1
        FROM dbo.PromotionalCampaigns AS campaigns
        INNER JOIN #CampaignsToDelete AS cleanup
            ON cleanup.company_id = campaigns.company_id
           AND cleanup.campaign_id = campaigns.id
    )
    BEGIN
        THROW 52008, 'Post-validation failed: some campaigns to delete still exist.', 1;
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.PromotionalCampaigns
        WHERE company_id = @CompanyId
          AND id = @KeepCampaignId
    )
    BEGIN
        THROW 52009, 'Post-validation failed: keep campaign is missing.', 1;
    END;

    IF @DryRun = 1
    BEGIN
        PRINT 'DRY RUN: rolling back campaign cleanup. Set @DryRun = 0 and @ConfirmTask = TASK-764-APPLY to commit.';
        ROLLBACK TRANSACTION;
    END
    ELSE
    BEGIN
        PRINT 'APPLY MODE: committing campaign cleanup.';
        COMMIT TRANSACTION;
    END;

-- Rollback plan after commit:
-- 1. Use the evidence result sets to reconstruct deleted campaigns, image metadata and recipients if Product approves.
-- 2. Reinsert campaigns before image metadata and recipients.
-- 3. Physical blobs are not deleted by this script, so image metadata may be restorable if blob paths remain valid.
-- 4. Do not restore by memory; use saved result sets only.
