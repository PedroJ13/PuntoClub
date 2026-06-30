const { ApiError } = require("./errors");
const { getFailedAttemptUpdate } = require("./authRateLimit");
const { getPool, getSql } = require("./db");

const CUSTOMER_SEARCH_COLLATION = "Latin1_General_100_CI_AI";

function toIsoTimestamp(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function toIsoDate(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function toApiId(value) {
  return value == null ? value : String(value);
}

function mapCustomer(row) {
  return {
    id: toApiId(row.id),
    name: row.name,
    phone: row.phone,
    email: row.email,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapCompanySettings(row) {
  return {
    id: toApiId(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    logoUrl: row.logo_url,
    pointsPercentage: Number(row.points_percentage),
    loyaltyPointsEnabled: Boolean(row.loyalty_points_enabled),
    loyaltyMembershipsEnabled: Boolean(row.loyalty_memberships_enabled),
    status: row.status,
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapCompanyRegistrationRequest(row) {
  const requestedLogoAvailable = Boolean(row.requested_logo_blob_path);
  return {
    id: toApiId(row.id),
    companyName: row.company_name,
    companyEmail: row.company_email,
    companyPhone: row.company_phone,
    companyAddress: row.company_address,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    requestedLogo: {
      available: requestedLogoAvailable,
      contentType: requestedLogoAvailable
        ? row.requested_logo_content_type
        : null,
    },
    status: row.status,
    reviewedAt: toIsoTimestamp(row.reviewed_at),
    reviewedByLabel: row.reviewed_by_label,
    reviewNote: row.review_note,
    approvedCompanyId: toApiId(row.approved_company_id),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapCompanyInvitation(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    registrationRequestId: toApiId(row.registration_request_id),
    email: row.email,
    role: row.role,
    status: row.status,
    expiresAt: toIsoTimestamp(row.expires_at),
    acceptedAt: toIsoTimestamp(row.accepted_at),
    revokedAt: toIsoTimestamp(row.revoked_at),
    createdAt: toIsoTimestamp(row.created_at),
    createdByLabel: row.created_by_label,
  };
}

function mapCompanyInvitationWithCompany(row) {
  return {
    ...mapCompanyInvitation(row),
    companyName: row.company_name || null,
  };
}

function mapCompanyUser(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    authProvider: row.auth_provider,
    lastLoginAt: toIsoTimestamp(row.last_login_at),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapAuthIdentity(row) {
  return {
    user: mapCompanyUser(row),
    company: {
      id: toApiId(row.company_id),
      name: row.company_name,
      status: row.company_status,
    },
  };
}

function mapAuthAttemptLimit(row) {
  if (!row) {
    return null;
  }

  return {
    scope: row.scope,
    subjectHash: row.subject_hash,
    windowStartedAt: row.window_started_at,
    failedCount: row.failed_count,
    lockedUntil: row.locked_until,
    lastFailedAt: row.last_failed_at,
    updatedAt: row.updated_at,
  };
}

function mapMyCompany(row) {
  const hasLogo = Boolean(row.logo_blob_path);
  return {
    id: toApiId(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    logoUrl: hasLogo ? "/api/my-company/logo" : null,
    logoContentType: row.logo_content_type,
    logoUpdatedAt: toIsoTimestamp(row.logo_updated_at),
    pointsPercentage: Number(row.points_percentage),
    loyaltyPointsEnabled: Boolean(row.loyalty_points_enabled),
    loyaltyMembershipsEnabled: Boolean(row.loyalty_memberships_enabled),
    status: row.status,
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapOperationalEmailSettings(row) {
  return {
    companyId: toApiId(row.company_id),
    welcomeEnabled: Boolean(row.welcome_enabled),
    purchaseEnabled: Boolean(row.purchase_enabled),
    redemptionEnabled: Boolean(row.redemption_enabled),
    replyToEmail: row.reply_to_email || null,
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapOperationalEmailEvent(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    eventType: row.event_type,
    idempotencyKey: row.idempotency_key,
    sourceEntityType: row.source_entity_type,
    sourceEntityId: toApiId(row.source_entity_id),
    customerId: toApiId(row.customer_id),
    status: row.status,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapOperationalEmailMessage(row) {
  return {
    id: toApiId(row.id),
    eventId: toApiId(row.event_id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    recipientEmail: row.recipient_email || null,
    subject: row.subject || null,
    status: row.status,
    provider: row.provider || null,
    providerMessageId: row.provider_message_id || null,
    lastError: row.last_error || null,
    createdAt: toIsoTimestamp(row.created_at),
    sentAt: toIsoTimestamp(row.sent_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapPromotionalCampaign(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    name: row.name,
    subject: row.subject,
    bodyText: row.body_text,
    includePoints: Boolean(row.include_points),
    status: row.status,
    recipientLimit: Number(row.recipient_limit || 5),
    recipientCount: Number(row.recipient_count || 0),
    pendingCount: Number(row.pending_count || 0),
    sentCount: Number(row.sent_count || 0),
    failedCount: Number(row.failed_count || 0),
    skippedCount: Number(row.skipped_count || 0),
    lastPreviewAt: toIsoTimestamp(row.last_preview_at),
    confirmedAt: toIsoTimestamp(row.confirmed_at),
    sentAt: toIsoTimestamp(row.sent_at),
    cancelledAt: toIsoTimestamp(row.cancelled_at),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapPromotionalRecipient(row) {
  return {
    id: toApiId(row.id),
    campaignId: toApiId(row.campaign_id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    customerName: row.customer_name || null,
    recipientEmail: row.recipient_email,
    pointsBalanceSnapshot:
      row.points_balance_snapshot == null
        ? null
        : Number(row.points_balance_snapshot),
    preferenceStatusSnapshot: row.preference_status_snapshot,
    status: row.status,
    skipReason: row.skip_reason || null,
    provider: row.provider || null,
    providerMessageId: row.provider_message_id || null,
    lastError: row.last_error || null,
    selectedAt: toIsoTimestamp(row.selected_at),
    sentAt: toIsoTimestamp(row.sent_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapEligiblePromotionalCustomer(row) {
  return {
    customerId: toApiId(row.customer_id),
    name: row.name,
    email: row.email || null,
    pointsBalance: Number(row.points_balance || 0),
    promotionalStatus: row.promotional_status,
    eligible: Boolean(row.eligible),
    blockedReason: row.blocked_reason || null,
  };
}

function mapMembershipPlan(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    name: row.name,
    description: row.description,
    durationDays: row.duration_days,
    price: Number(row.price),
    renewalNoticeDays: row.renewal_notice_days,
    status: row.status,
    benefitCount: Number(row.benefit_count || 0),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapMembershipBenefit(row) {
  return {
    id: toApiId(row.id),
    planId: toApiId(row.membership_plan_id),
    name: row.name,
    description: row.description,
    benefitType: row.benefit_type,
    appliesToType: row.applies_to_type,
    appliesToName: row.applies_to_name,
    discountPercent:
      row.discount_percent == null ? null : Number(row.discount_percent),
    includedQuantity:
      row.included_quantity == null ? null : Number(row.included_quantity),
    usageLimit: row.usage_limit,
    usagePeriod: row.usage_period,
    status: row.status,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function parseDateOnly(value) {
  const text = toIsoDate(value);
  if (!text) {
    return null;
  }
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function calculateMembershipEndDate(startDate, durationDays) {
  const date = parseDateOnly(startDate);
  return toIsoDate(addDays(date, Number(durationDays) - 1));
}

function calculateExpirationAlert(endDate, options = {}) {
  const today = parseDateOnly(options.today || new Date());
  const expirationDate = parseDateOnly(endDate);
  const warningDays = Number.isInteger(options.warningDays)
    ? options.warningDays
    : 5;
  const daysUntilExpiration = Math.round(
    (expirationDate.getTime() - today.getTime()) / 86400000,
  );
  let state = "none";
  let message = null;

  if (daysUntilExpiration < 0) {
    state = "expired";
    message = "La membresia esta vencida.";
  } else if (daysUntilExpiration === 0) {
    state = "expires_today";
    message = "La membresia vence hoy.";
  } else if (daysUntilExpiration <= warningDays) {
    state = "expiring_soon";
    message = `La membresia vence en ${daysUntilExpiration} dias.`;
  }

  return {
    state,
    daysUntilExpiration,
    message,
  };
}

function calculateUsagePeriodStartDate(
  usageDate,
  usagePeriod,
  membershipStartDate,
) {
  if (usagePeriod === "membership_term") {
    return toIsoDate(membershipStartDate);
  }

  const date = parseDateOnly(usageDate);
  if (!date) {
    return usageDate;
  }

  if (usagePeriod === "week") {
    const day = date.getUTCDay();
    const offset = day === 0 ? -6 : 1 - day;
    return toIsoDate(addDays(date, offset));
  }

  if (usagePeriod === "month") {
    return `${toIsoDate(date).slice(0, 8)}01`;
  }

  return toIsoDate(date);
}

function mapCustomerMembership(row, options = {}) {
  const plan = {
    id: toApiId(row.membership_plan_id),
    name: row.plan_name,
  };

  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    planId: plan.id,
    membershipPlanId: plan.id,
    planName: plan.name,
    plan,
    startDate: toIsoDate(row.start_date),
    endDate: toIsoDate(row.end_date),
    status: row.status,
    pricePaid: row.price_paid == null ? null : Number(row.price_paid),
    expirationAlert: calculateExpirationAlert(row.end_date, {
      today: options.today,
      warningDays:
        row.renewal_notice_days == null ? 5 : Number(row.renewal_notice_days),
    }),
    createdAt: toIsoTimestamp(row.created_at),
    cancelledAt: toIsoTimestamp(row.cancelled_at),
    cancelledByLabel: row.cancelled_by_label || null,
    cancelNote: row.cancel_note || null,
  };
}

function mapMembershipExpirationAlert(row, options = {}) {
  const expirationAlert = calculateExpirationAlert(row.end_date, {
    today: options.today,
    warningDays: options.withinDays,
  });

  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    customerMembershipId: toApiId(row.id),
    planId: toApiId(row.membership_plan_id),
    membershipPlanId: toApiId(row.membership_plan_id),
    planName: row.plan_name,
    startDate: toIsoDate(row.start_date),
    endDate: toIsoDate(row.end_date),
    status: row.status,
    daysUntilExpiration: expirationAlert.daysUntilExpiration,
    state: expirationAlert.state,
    message: expirationAlert.message,
  };
}

function mapMembershipBenefitUsage(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    customerMembershipId: toApiId(row.customer_membership_id),
    benefitId: toApiId(row.membership_benefit_id),
    membershipBenefitId: toApiId(row.membership_benefit_id),
    benefitName: row.benefit_name,
    benefitType: row.benefit_type,
    planId: toApiId(row.membership_plan_id),
    membershipPlanId: toApiId(row.membership_plan_id),
    planName: row.plan_name,
    usageDate: toIsoDate(row.usage_date),
    usagePeriodStartDate: toIsoDate(row.usage_period_start_date),
    quantity: Number(row.quantity),
    note: row.note || null,
    usedAt: toIsoTimestamp(row.used_at),
    createdByLabel: row.created_by_label || null,
  };
}

function mapMembershipTransaction(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    customerId: toApiId(row.customer_id),
    customerMembershipId: toApiId(row.customer_membership_id),
    planId: toApiId(row.membership_plan_id),
    membershipPlanId: toApiId(row.membership_plan_id),
    planName: row.plan_name || null,
    transactionType: row.transaction_type,
    paymentMethod: row.payment_method,
    amount: Number(row.amount),
    transactionDate: toIsoDate(row.transaction_date),
    note: row.note || null,
    createdAt: toIsoTimestamp(row.created_at),
    createdByLabel: row.created_by_label || null,
  };
}

function mapMembershipFinancialReportTransaction(row) {
  return {
    id: toApiId(row.id),
    customerId: toApiId(row.customer_id),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    customerMembershipId: toApiId(row.customer_membership_id),
    planId: toApiId(row.membership_plan_id),
    membershipPlanId: toApiId(row.membership_plan_id),
    planName: row.plan_name || null,
    transactionType: row.transaction_type,
    paymentMethod: row.payment_method,
    amount: Number(row.amount),
    transactionDate: toIsoDate(row.transaction_date),
    createdAt: toIsoTimestamp(row.created_at),
    note: row.note || null,
  };
}

function mapCompanyRegistrationRequestWithInvitation(row) {
  const registrationRequest = mapCompanyRegistrationRequest(row);

  if (row.invitation_id) {
    registrationRequest.invitation = mapCompanyInvitation({
      id: row.invitation_id,
      company_id: row.invitation_company_id,
      registration_request_id: row.invitation_registration_request_id,
      email: row.invitation_email,
      role: row.invitation_role,
      status: row.invitation_status,
      expires_at: row.invitation_expires_at,
      accepted_at: row.invitation_accepted_at,
      revoked_at: row.invitation_revoked_at,
      created_at: row.invitation_created_at,
      created_by_label: row.invitation_created_by_label,
    });
  }

  return registrationRequest;
}

async function ensureActiveCompany(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("company_id", sql.BigInt, companyId)
    .query(`
      SELECT id, points_percentage
      FROM dbo.Companies
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return result.recordset[0];
}

async function getAuthAttemptLimit(scope, subjectHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("scope", sql.VarChar(40), scope)
    .input("subject_hash", sql.VarBinary(32), subjectHash).query(`
      SELECT TOP (1)
        scope,
        subject_hash,
        window_started_at,
        failed_count,
        locked_until,
        last_failed_at,
        updated_at
      FROM dbo.AuthAttemptLimits
      WHERE scope = @scope
        AND subject_hash = @subject_hash
    `);

  return mapAuthAttemptLimit(result.recordset[0]);
}

async function recordAuthAttemptFailure(
  scope,
  subjectHash,
  policy,
  now = new Date(),
) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const request = new sql.Request(transaction);
    const result = await request
      .input("scope", sql.VarChar(40), scope)
      .input("subject_hash", sql.VarBinary(32), subjectHash).query(`
        SELECT TOP (1)
          scope,
          subject_hash,
          window_started_at,
          failed_count,
          locked_until,
          last_failed_at,
          updated_at
        FROM dbo.AuthAttemptLimits WITH (UPDLOCK, HOLDLOCK)
        WHERE scope = @scope
          AND subject_hash = @subject_hash
      `);

    const next = getFailedAttemptUpdate(
      mapAuthAttemptLimit(result.recordset[0]),
      policy,
      now,
    );

    if (result.recordset.length) {
      await new sql.Request(transaction)
        .input("scope", sql.VarChar(40), scope)
        .input("subject_hash", sql.VarBinary(32), subjectHash)
        .input("window_started_at", sql.DateTime2, next.windowStartedAt)
        .input("failed_count", sql.Int, next.failedCount)
        .input("locked_until", sql.DateTime2, next.lockedUntil)
        .input("last_failed_at", sql.DateTime2, next.lastFailedAt).query(`
          UPDATE dbo.AuthAttemptLimits
          SET
            window_started_at = @window_started_at,
            failed_count = @failed_count,
            locked_until = @locked_until,
            last_failed_at = @last_failed_at,
            updated_at = SYSUTCDATETIME()
          WHERE scope = @scope
            AND subject_hash = @subject_hash
        `);
    } else {
      await new sql.Request(transaction)
        .input("scope", sql.VarChar(40), scope)
        .input("subject_hash", sql.VarBinary(32), subjectHash)
        .input("window_started_at", sql.DateTime2, next.windowStartedAt)
        .input("failed_count", sql.Int, next.failedCount)
        .input("locked_until", sql.DateTime2, next.lockedUntil)
        .input("last_failed_at", sql.DateTime2, next.lastFailedAt).query(`
          INSERT INTO dbo.AuthAttemptLimits (
            scope,
            subject_hash,
            window_started_at,
            failed_count,
            locked_until,
            last_failed_at
          )
          VALUES (
            @scope,
            @subject_hash,
            @window_started_at,
            @failed_count,
            @locked_until,
            @last_failed_at
          )
        `);
    }

    await transaction.commit();
    return next;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve the original failure; rollback errors are secondary here.
    }
    throw error;
  }
}

async function clearAuthAttemptLimit(scope, subjectHash) {
  const sql = getSql();
  const pool = await getPool();
  await pool
    .request()
    .input("scope", sql.VarChar(40), scope)
    .input("subject_hash", sql.VarBinary(32), subjectHash).query(`
      DELETE FROM dbo.AuthAttemptLimits
      WHERE scope = @scope
        AND subject_hash = @subject_hash
    `);
}

async function getCompanySettings(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("company_id", sql.BigInt, companyId)
    .query(`
      SELECT
        id,
        name,
        email,
        phone,
        logo_url,
        points_percentage,
        loyalty_points_enabled,
        loyalty_memberships_enabled,
        status,
        updated_at
      FROM dbo.Companies
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  const row = result.recordset[0];
  return mapCompanySettings(row);
}

async function updateCompanySettings(companyId, settings) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("name", sql.NVarChar(160), settings.name)
    .input("email", sql.NVarChar(254), settings.email)
    .input("phone", sql.NVarChar(32), settings.phone)
    .input("logo_url", sql.NVarChar(2048), settings.logoUrl)
    .input("points_percentage", sql.Decimal(5, 2), settings.pointsPercentage)
    .query(`
      UPDATE dbo.Companies
      SET
        name = @name,
        email = @email,
        phone = @phone,
        logo_url = @logo_url,
        points_percentage = @points_percentage,
        updated_at = SYSUTCDATETIME()
      OUTPUT
        INSERTED.id,
        INSERTED.name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.logo_url,
        INSERTED.points_percentage,
        INSERTED.loyalty_points_enabled,
        INSERTED.loyalty_memberships_enabled,
        INSERTED.status,
        INSERTED.updated_at
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return mapCompanySettings(result.recordset[0]);
}

async function updateCompanyLogo(companyId, logo) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("logo_blob_path", sql.NVarChar(500), logo.blobPath)
    .input("logo_content_type", sql.VarChar(80), logo.contentType).query(`
      UPDATE dbo.Companies
      SET
        logo_blob_path = @logo_blob_path,
        logo_content_type = @logo_content_type,
        logo_updated_at = SYSUTCDATETIME(),
        updated_at = SYSUTCDATETIME()
      OUTPUT
        INSERTED.id,
        INSERTED.name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.address,
        INSERTED.logo_blob_path,
        INSERTED.logo_content_type,
        INSERTED.logo_updated_at,
        INSERTED.points_percentage,
        INSERTED.loyalty_points_enabled,
        INSERTED.loyalty_memberships_enabled,
        INSERTED.status,
        INSERTED.updated_at
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return mapMyCompany(result.recordset[0]);
}

async function getOperationalEmailSettings(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("company_id", sql.BigInt, companyId)
    .query(`
      SELECT
        companies.id AS company_id,
        COALESCE(settings.welcome_enabled, CONVERT(bit, 1)) AS welcome_enabled,
        COALESCE(settings.purchase_enabled, CONVERT(bit, 1)) AS purchase_enabled,
        COALESCE(settings.redemption_enabled, CONVERT(bit, 1)) AS redemption_enabled,
        settings.reply_to_email,
        COALESCE(settings.updated_at, companies.updated_at) AS updated_at
      FROM dbo.Companies AS companies
      LEFT JOIN dbo.CompanyOperationalEmailSettings AS settings
        ON settings.company_id = companies.id
      WHERE companies.id = @company_id
        AND companies.status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return mapOperationalEmailSettings(result.recordset[0]);
}

async function updateOperationalEmailSettings(companyId, settings) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("welcome_enabled", sql.Bit, settings.welcomeEnabled)
    .input("purchase_enabled", sql.Bit, settings.purchaseEnabled)
    .input("redemption_enabled", sql.Bit, settings.redemptionEnabled)
    .input("reply_to_email", sql.NVarChar(254), settings.replyToEmail).query(`
      MERGE dbo.CompanyOperationalEmailSettings AS target
      USING (
        SELECT
          @company_id AS company_id,
          @welcome_enabled AS welcome_enabled,
          @purchase_enabled AS purchase_enabled,
          @redemption_enabled AS redemption_enabled,
          @reply_to_email AS reply_to_email
      ) AS source
      ON target.company_id = source.company_id
      WHEN MATCHED THEN
        UPDATE SET
          welcome_enabled = source.welcome_enabled,
          purchase_enabled = source.purchase_enabled,
          redemption_enabled = source.redemption_enabled,
          reply_to_email = source.reply_to_email,
          updated_at = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (
          company_id,
          welcome_enabled,
          purchase_enabled,
          redemption_enabled,
          reply_to_email
        )
        VALUES (
          source.company_id,
          source.welcome_enabled,
          source.purchase_enabled,
          source.redemption_enabled,
          source.reply_to_email
        )
      OUTPUT
        INSERTED.company_id,
        INSERTED.welcome_enabled,
        INSERTED.purchase_enabled,
        INSERTED.redemption_enabled,
        INSERTED.reply_to_email,
        INSERTED.updated_at;
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return mapOperationalEmailSettings(result.recordset[0]);
}

async function createOperationalEmailEventIfNeeded(event) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const existingResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, event.companyId)
      .input("idempotency_key", sql.NVarChar(160), event.idempotencyKey).query(`
        SELECT TOP (1)
          id,
          company_id,
          event_type,
          idempotency_key,
          source_entity_type,
          source_entity_id,
          customer_id,
          status,
          created_at,
          updated_at
        FROM dbo.OperationalEmailEvents WITH (UPDLOCK, HOLDLOCK)
        WHERE company_id = @company_id
          AND idempotency_key = @idempotency_key
      `);

    if (existingResult.recordset.length) {
      await transaction.commit();
      return {
        event: mapOperationalEmailEvent(existingResult.recordset[0]),
        created: false,
      };
    }

    const insertResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, event.companyId)
      .input("event_type", sql.VarChar(40), event.eventType)
      .input("idempotency_key", sql.NVarChar(160), event.idempotencyKey)
      .input("source_entity_type", sql.VarChar(40), event.sourceEntityType)
      .input("source_entity_id", sql.BigInt, event.sourceEntityId)
      .input("customer_id", sql.BigInt, event.customerId).query(`
        INSERT INTO dbo.OperationalEmailEvents (
          company_id,
          event_type,
          idempotency_key,
          source_entity_type,
          source_entity_id,
          customer_id
        )
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.event_type,
          INSERTED.idempotency_key,
          INSERTED.source_entity_type,
          INSERTED.source_entity_id,
          INSERTED.customer_id,
          INSERTED.status,
          INSERTED.created_at,
          INSERTED.updated_at
        VALUES (
          @company_id,
          @event_type,
          @idempotency_key,
          @source_entity_type,
          @source_entity_id,
          @customer_id
        )
      `);

    await transaction.commit();
    return {
      event: mapOperationalEmailEvent(insertResult.recordset[0]),
      created: true,
    };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve original error.
    }
    throw error;
  }
}

async function createOperationalEmailMessage(message) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("event_id", sql.BigInt, message.eventId)
    .input("company_id", sql.BigInt, message.companyId)
    .input("customer_id", sql.BigInt, message.customerId)
    .input("recipient_email", sql.NVarChar(254), message.recipientEmail)
    .input("subject", sql.NVarChar(200), message.subject)
    .input("status", sql.VarChar(20), message.status || "pending")
    .input("provider", sql.VarChar(40), message.provider)
    .input("last_error", sql.NVarChar(1000), message.lastError).query(`
      INSERT INTO dbo.OperationalEmailMessages (
        event_id,
        company_id,
        customer_id,
        recipient_email,
        subject,
        status,
        provider,
        last_error
      )
      OUTPUT
        INSERTED.id,
        INSERTED.event_id,
        INSERTED.company_id,
        INSERTED.customer_id,
        INSERTED.recipient_email,
        INSERTED.subject,
        INSERTED.status,
        INSERTED.provider,
        INSERTED.provider_message_id,
        INSERTED.last_error,
        INSERTED.created_at,
        INSERTED.sent_at,
        INSERTED.updated_at
      VALUES (
        @event_id,
        @company_id,
        @customer_id,
        @recipient_email,
        @subject,
        @status,
        @provider,
        @last_error
      )
    `);

  return mapOperationalEmailMessage(result.recordset[0]);
}

async function recordOperationalEmailAttempt(
  messageId,
  eventId,
  companyId,
  attempt,
) {
  const sql = getSql();
  const pool = await getPool();
  const status =
    attempt.status === "sent"
      ? "sent"
      : attempt.status === "failed"
        ? "failed"
        : "skipped";
  const errorMessage = attempt.errorMessage || attempt.reason || null;

  const countResult = await pool
    .request()
    .input("message_id", sql.BigInt, messageId).query(`
      SELECT COUNT(1) AS attempt_count
      FROM dbo.OperationalEmailAttempts
      WHERE message_id = @message_id
    `);
  const attemptNumber = Number(countResult.recordset[0].attempt_count || 0) + 1;

  await pool
    .request()
    .input("message_id", sql.BigInt, messageId)
    .input("event_id", sql.BigInt, eventId)
    .input("company_id", sql.BigInt, companyId)
    .input("attempt_number", sql.Int, attemptNumber)
    .input("provider", sql.VarChar(40), attempt.provider || "acs-email")
    .input("status", sql.VarChar(20), status)
    .input("provider_message_id", sql.NVarChar(200), attempt.id || null)
    .input("error_message", sql.NVarChar(1000), errorMessage).query(`
      INSERT INTO dbo.OperationalEmailAttempts (
        message_id,
        event_id,
        company_id,
        attempt_number,
        provider,
        status,
        provider_message_id,
        error_message
      )
      VALUES (
        @message_id,
        @event_id,
        @company_id,
        @attempt_number,
        @provider,
        @status,
        @provider_message_id,
        @error_message
      )
    `);

  await pool
    .request()
    .input("message_id", sql.BigInt, messageId)
    .input("event_id", sql.BigInt, eventId)
    .input("status", sql.VarChar(20), status)
    .input("provider", sql.VarChar(40), attempt.provider || "acs-email")
    .input("provider_message_id", sql.NVarChar(200), attempt.id || null)
    .input("last_error", sql.NVarChar(1000), errorMessage).query(`
      UPDATE dbo.OperationalEmailMessages
      SET
        status = @status,
        provider = @provider,
        provider_message_id = @provider_message_id,
        last_error = @last_error,
        sent_at = CASE WHEN @status = 'sent' THEN SYSUTCDATETIME() ELSE sent_at END,
        updated_at = SYSUTCDATETIME()
      WHERE id = @message_id;

      UPDATE dbo.OperationalEmailEvents
      SET
        status = @status,
        updated_at = SYSUTCDATETIME()
      WHERE id = @event_id;
    `);
}

async function listPromotionalCampaigns(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === "all" ? null : filters.status || null;
  const limit = filters.limit || 25;
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("status", sql.VarChar(20), status)
    .input("limit", sql.Int, limit).query(`
      SELECT TOP (@limit)
        campaigns.id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.body_text,
        campaigns.include_points,
        campaigns.status,
        campaigns.recipient_limit,
        campaigns.last_preview_at,
        campaigns.confirmed_at,
        campaigns.sent_at,
        campaigns.cancelled_at,
        campaigns.created_at,
        campaigns.updated_at,
        COUNT(recipients.id) AS recipient_count,
        SUM(CASE WHEN recipients.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN recipients.status = 'sent' THEN 1 ELSE 0 END) AS sent_count,
        SUM(CASE WHEN recipients.status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
        SUM(CASE WHEN recipients.status = 'skipped' THEN 1 ELSE 0 END) AS skipped_count
      FROM dbo.PromotionalCampaigns AS campaigns
      LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.campaign_id = campaigns.id
      WHERE campaigns.company_id = @company_id
        AND (@status IS NULL OR campaigns.status = @status)
      GROUP BY
        campaigns.id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.body_text,
        campaigns.include_points,
        campaigns.status,
        campaigns.recipient_limit,
        campaigns.last_preview_at,
        campaigns.confirmed_at,
        campaigns.sent_at,
        campaigns.cancelled_at,
        campaigns.created_at,
        campaigns.updated_at
      ORDER BY campaigns.created_at DESC, campaigns.id DESC
    `);

  return {
    status: filters.status || "all",
    limit,
    items: result.recordset.map(mapPromotionalCampaign),
  };
}

async function getPromotionalCampaignById(companyId, campaignId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("campaign_id", sql.BigInt, campaignId).query(`
      SELECT
        campaigns.id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.body_text,
        campaigns.include_points,
        campaigns.status,
        campaigns.recipient_limit,
        campaigns.last_preview_at,
        campaigns.confirmed_at,
        campaigns.sent_at,
        campaigns.cancelled_at,
        campaigns.created_at,
        campaigns.updated_at,
        COUNT(recipients.id) AS recipient_count,
        SUM(CASE WHEN recipients.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN recipients.status = 'sent' THEN 1 ELSE 0 END) AS sent_count,
        SUM(CASE WHEN recipients.status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
        SUM(CASE WHEN recipients.status = 'skipped' THEN 1 ELSE 0 END) AS skipped_count
      FROM dbo.PromotionalCampaigns AS campaigns
      LEFT JOIN dbo.PromotionalCampaignRecipients AS recipients
        ON recipients.campaign_id = campaigns.id
      WHERE campaigns.company_id = @company_id
        AND campaigns.id = @campaign_id
      GROUP BY
        campaigns.id,
        campaigns.company_id,
        campaigns.name,
        campaigns.subject,
        campaigns.body_text,
        campaigns.include_points,
        campaigns.status,
        campaigns.recipient_limit,
        campaigns.last_preview_at,
        campaigns.confirmed_at,
        campaigns.sent_at,
        campaigns.cancelled_at,
        campaigns.created_at,
        campaigns.updated_at
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "PROMOTIONAL_CAMPAIGN_NOT_FOUND",
      "Promotional campaign was not found.",
    );
  }

  return mapPromotionalCampaign(result.recordset[0]);
}

async function createPromotionalCampaign(companyId, payload, options = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("name", sql.NVarChar(160), payload.name)
    .input("subject", sql.NVarChar(200), payload.subject)
    .input("body_text", sql.NVarChar(2000), payload.bodyText)
    .input("include_points", sql.Bit, payload.includePoints)
    .input("created_by_user_id", sql.BigInt, options.createdByUserId || null)
    .query(`
      INSERT INTO dbo.PromotionalCampaigns (
        company_id,
        name,
        subject,
        body_text,
        include_points,
        created_by_user_id
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_id,
        INSERTED.name,
        INSERTED.subject,
        INSERTED.body_text,
        INSERTED.include_points,
        INSERTED.status,
        INSERTED.recipient_limit,
        INSERTED.last_preview_at,
        INSERTED.confirmed_at,
        INSERTED.sent_at,
        INSERTED.cancelled_at,
        INSERTED.created_at,
        INSERTED.updated_at,
        0 AS recipient_count,
        0 AS pending_count,
        0 AS sent_count,
        0 AS failed_count,
        0 AS skipped_count
      VALUES (
        @company_id,
        @name,
        @subject,
        @body_text,
        @include_points,
        @created_by_user_id
      )
    `);

  return mapPromotionalCampaign(result.recordset[0]);
}

async function updatePromotionalCampaignPreviewAt(companyId, campaignId) {
  const sql = getSql();
  const pool = await getPool();
  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("campaign_id", sql.BigInt, campaignId).query(`
      UPDATE dbo.PromotionalCampaigns
      SET
        last_preview_at = SYSUTCDATETIME(),
        updated_at = SYSUTCDATETIME()
      WHERE company_id = @company_id
        AND id = @campaign_id
    `);
}

async function listPromotionalRecipients(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status =
    filters.status === "all" ? null : filters.status || "subscribed";
  const search =
    typeof filters.search === "string" ? filters.search.trim() : "";
  const limit = filters.limit || 25;
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("status", sql.VarChar(20), status)
    .input("search", sql.NVarChar(254), search || null)
    .input("search_like", sql.NVarChar(260), search ? `%${search}%` : null)
    .input("limit", sql.Int, limit).query(`
      SELECT TOP (@limit)
        customers.id AS customer_id,
        customers.name,
        customers.email,
        COALESCE(balances.points_balance, 0) AS points_balance,
        COALESCE(preferences.promotional_status, 'subscribed') AS promotional_status,
        CONVERT(bit, CASE
          WHEN customers.email IS NOT NULL
           AND customers.email LIKE '%_@_%._%'
           AND COALESCE(preferences.promotional_status, 'subscribed') = 'subscribed'
          THEN 1 ELSE 0 END) AS eligible,
        CASE
          WHEN customers.email IS NULL OR customers.email NOT LIKE '%_@_%._%' THEN 'missing_email'
          WHEN COALESCE(preferences.promotional_status, 'subscribed') = 'unsubscribed' THEN 'unsubscribed'
          WHEN COALESCE(preferences.promotional_status, 'subscribed') = 'suppressed' THEN 'suppressed'
          ELSE NULL
        END AS blocked_reason
      FROM dbo.Customers AS customers
      LEFT JOIN dbo.CustomerPointBalances AS balances
        ON balances.company_id = customers.company_id
       AND balances.customer_id = customers.id
      LEFT JOIN dbo.CustomerPromotionalEmailPreferences AS preferences
        ON preferences.company_id = customers.company_id
       AND preferences.customer_id = customers.id
      WHERE customers.company_id = @company_id
        AND (@status IS NULL OR COALESCE(preferences.promotional_status, 'subscribed') = @status)
        AND (
          @search IS NULL
          OR customers.email COLLATE ${CUSTOMER_SEARCH_COLLATION} = @search COLLATE ${CUSTOMER_SEARCH_COLLATION}
          OR customers.name COLLATE ${CUSTOMER_SEARCH_COLLATION} LIKE @search_like COLLATE ${CUSTOMER_SEARCH_COLLATION}
          OR customers.phone = @search
        )
      ORDER BY customers.name ASC, customers.id ASC
    `);

  return {
    status: filters.status || "subscribed",
    limit,
    items: result.recordset.map(mapEligiblePromotionalCustomer),
  };
}

async function replacePromotionalCampaignRecipients(
  companyId,
  campaignId,
  customerIds,
) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const campaignResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, companyId)
      .input("campaign_id", sql.BigInt, campaignId).query(`
        SELECT id, status, recipient_limit
        FROM dbo.PromotionalCampaigns WITH (UPDLOCK, HOLDLOCK)
        WHERE company_id = @company_id
          AND id = @campaign_id
      `);

    if (!campaignResult.recordset.length) {
      throw new ApiError(
        404,
        "PROMOTIONAL_CAMPAIGN_NOT_FOUND",
        "Promotional campaign was not found.",
      );
    }

    const campaign = campaignResult.recordset[0];
    if (!["draft", "ready"].includes(campaign.status)) {
      throw new ApiError(
        409,
        "PROMOTIONAL_CAMPAIGN_NOT_EDITABLE",
        "Promotional campaign recipients cannot be changed in this status.",
      );
    }

    if (customerIds.length > Number(campaign.recipient_limit || 5)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Recipient limit exceeded.", [
        {
          field: "customerIds",
          message: `Select ${campaign.recipient_limit} recipients or fewer.`,
        },
      ]);
    }

    await new sql.Request(transaction).input(
      "campaign_id",
      sql.BigInt,
      campaignId,
    ).query(`
        DELETE FROM dbo.PromotionalCampaignRecipients
        WHERE campaign_id = @campaign_id
          AND status = 'pending'
      `);

    const inserted = [];
    const skipped = [];

    for (const customerId of customerIds) {
      const customerResult = await new sql.Request(transaction)
        .input("company_id", sql.BigInt, companyId)
        .input("customer_id", sql.BigInt, customerId).query(`
          SELECT TOP (1)
            customers.id AS customer_id,
            customers.name,
            customers.email,
            COALESCE(balances.points_balance, 0) AS points_balance,
            COALESCE(preferences.promotional_status, 'subscribed') AS promotional_status
          FROM dbo.Customers AS customers
          LEFT JOIN dbo.CustomerPointBalances AS balances
            ON balances.company_id = customers.company_id
           AND balances.customer_id = customers.id
          LEFT JOIN dbo.CustomerPromotionalEmailPreferences AS preferences
            ON preferences.company_id = customers.company_id
           AND preferences.customer_id = customers.id
          WHERE customers.company_id = @company_id
            AND customers.id = @customer_id
        `);

      if (!customerResult.recordset.length) {
        skipped.push({ customerId: toApiId(customerId), reason: "not_found" });
        continue;
      }

      const customer = customerResult.recordset[0];
      const email = String(customer.email || "").trim();
      if (
        !email ||
        !email.includes("@") ||
        customer.promotional_status !== "subscribed"
      ) {
        skipped.push({
          customerId: toApiId(customer.customer_id),
          reason:
            !email || !email.includes("@")
              ? "missing_email"
              : customer.promotional_status,
        });
        continue;
      }

      const insertResult = await new sql.Request(transaction)
        .input("campaign_id", sql.BigInt, campaignId)
        .input("company_id", sql.BigInt, companyId)
        .input("customer_id", sql.BigInt, customer.customer_id)
        .input("customer_name", sql.NVarChar(160), customer.name)
        .input("recipient_email", sql.NVarChar(254), email)
        .input(
          "points_balance_snapshot",
          sql.Int,
          Number(customer.points_balance || 0),
        )
        .input(
          "preference_status_snapshot",
          sql.VarChar(20),
          customer.promotional_status,
        ).query(`
          INSERT INTO dbo.PromotionalCampaignRecipients (
            campaign_id,
            company_id,
            customer_id,
            recipient_email,
            points_balance_snapshot,
            preference_status_snapshot
          )
          OUTPUT
            INSERTED.id,
            INSERTED.campaign_id,
            INSERTED.company_id,
            INSERTED.customer_id,
            @customer_name AS customer_name,
            INSERTED.recipient_email,
            INSERTED.points_balance_snapshot,
            INSERTED.preference_status_snapshot,
            INSERTED.status,
            INSERTED.skip_reason,
            INSERTED.provider,
            INSERTED.provider_message_id,
            INSERTED.last_error,
            INSERTED.selected_at,
            INSERTED.sent_at,
            INSERTED.updated_at
          VALUES (
            @campaign_id,
            @company_id,
            @customer_id,
            @recipient_email,
            @points_balance_snapshot,
            @preference_status_snapshot
          )
        `);

      inserted.push(mapPromotionalRecipient(insertResult.recordset[0]));
    }

    await new sql.Request(transaction)
      .input("campaign_id", sql.BigInt, campaignId)
      .input("status", sql.VarChar(20), inserted.length ? "ready" : "draft")
      .query(`
        UPDATE dbo.PromotionalCampaigns
        SET
          status = @status,
          updated_at = SYSUTCDATETIME()
        WHERE id = @campaign_id
      `);

    await transaction.commit();
    return { recipients: inserted, skipped };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve original error.
    }
    throw error;
  }
}

async function listPromotionalCampaignRecipients(companyId, campaignId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("campaign_id", sql.BigInt, campaignId).query(`
      SELECT
        recipients.id,
        recipients.campaign_id,
        recipients.company_id,
        recipients.customer_id,
        customers.name AS customer_name,
        recipients.recipient_email,
        recipients.points_balance_snapshot,
        recipients.preference_status_snapshot,
        recipients.status,
        recipients.skip_reason,
        recipients.provider,
        recipients.provider_message_id,
        recipients.last_error,
        recipients.selected_at,
        recipients.sent_at,
        recipients.updated_at
      FROM dbo.PromotionalCampaignRecipients AS recipients
      INNER JOIN dbo.Customers AS customers
        ON customers.company_id = recipients.company_id
       AND customers.id = recipients.customer_id
      WHERE recipients.company_id = @company_id
        AND recipients.campaign_id = @campaign_id
      ORDER BY recipients.id ASC
    `);

  return result.recordset.map(mapPromotionalRecipient);
}

async function unsubscribePromotionalCustomer(
  companyId,
  payload,
  options = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const source = options.source || "customer_link";

  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, payload.customerId)
    .input("source", sql.VarChar(40), source)
    .input("reason", sql.NVarChar(300), payload.reason).query(`
      MERGE dbo.CustomerPromotionalEmailPreferences AS target
      USING (
        SELECT
          @company_id AS company_id,
          @customer_id AS customer_id,
          @source AS source,
          @reason AS reason
      ) AS source
      ON target.company_id = source.company_id
     AND target.customer_id = source.customer_id
      WHEN MATCHED THEN
        UPDATE SET
          promotional_status = 'unsubscribed',
          unsubscribed_at = COALESCE(target.unsubscribed_at, SYSUTCDATETIME()),
          unsubscribe_source = source.source,
          unsubscribe_reason = source.reason,
          updated_at = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (
          company_id,
          customer_id,
          promotional_status,
          unsubscribed_at,
          unsubscribe_source,
          unsubscribe_reason
        )
        VALUES (
          source.company_id,
          source.customer_id,
          'unsubscribed',
          SYSUTCDATETIME(),
          source.source,
          source.reason
        );
    `);

  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, payload.customerId)
    .input("campaign_id", sql.BigInt, payload.campaignId)
    .input("recipient_id", sql.BigInt, payload.recipientId)
    .input("source", sql.VarChar(40), source)
    .input("reason", sql.NVarChar(300), payload.reason).query(`
      INSERT INTO dbo.PromotionalUnsubscribeEvents (
        company_id,
        customer_id,
        campaign_id,
        recipient_id,
        source,
        reason
      )
      VALUES (
        @company_id,
        @customer_id,
        @campaign_id,
        @recipient_id,
        @source,
        @reason
      )
    `);

  return {
    companyId: toApiId(companyId),
    customerId: toApiId(payload.customerId),
    promotionalStatus: "unsubscribed",
    message:
      "Baja promocional registrada. Tus puntos, beneficios e historial se mantienen.",
  };
}

async function listCompanyRegistrationRequests(filters) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === "all" ? null : filters.status;
  const result = await pool
    .request()
    .input("status", sql.VarChar(30), status)
    .input("limit", sql.Int, filters.limit).query(`
      SELECT TOP (@limit)
        requests.id,
        requests.company_name,
        requests.company_email,
        requests.company_phone,
        requests.company_address,
        requests.contact_name,
        requests.contact_email,
        requests.contact_phone,
        requests.requested_logo_blob_path,
        requests.requested_logo_content_type,
        requests.status,
        requests.reviewed_at,
        requests.reviewed_by_label,
        requests.review_note,
        requests.approved_company_id,
        requests.created_at,
        requests.updated_at,
        invitations.id AS invitation_id,
        invitations.company_id AS invitation_company_id,
        invitations.registration_request_id AS invitation_registration_request_id,
        invitations.email AS invitation_email,
        invitations.role AS invitation_role,
        invitations.status AS invitation_status,
        invitations.expires_at AS invitation_expires_at,
        invitations.accepted_at AS invitation_accepted_at,
        invitations.revoked_at AS invitation_revoked_at,
        invitations.created_at AS invitation_created_at,
        invitations.created_by_label AS invitation_created_by_label
      FROM dbo.CompanyRegistrationRequests AS requests
      OUTER APPLY (
        SELECT TOP (1)
          id,
          company_id,
          registration_request_id,
          email,
          role,
          status,
          expires_at,
          accepted_at,
          revoked_at,
          created_at,
          created_by_label
        FROM dbo.CompanyInvitations AS invitations
        WHERE invitations.registration_request_id = requests.id
        ORDER BY invitations.created_at DESC, invitations.id DESC
      ) AS invitations
      WHERE (@status IS NULL OR requests.status = @status)
      ORDER BY requests.created_at DESC, requests.id DESC
    `);

  return {
    status: filters.status,
    limit: filters.limit,
    items: result.recordset.map(mapCompanyRegistrationRequestWithInvitation),
  };
}

async function getCompanyLogoMetadata(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("company_id", sql.BigInt, companyId)
    .query(`
      SELECT
        id,
        logo_blob_path,
        logo_content_type,
        logo_updated_at
      FROM dbo.Companies
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  const row = result.recordset[0];
  if (!row.logo_blob_path) {
    throw new ApiError(
      404,
      "COMPANY_LOGO_NOT_FOUND",
      "Company logo was not found.",
    );
  }

  return {
    blobPath: row.logo_blob_path,
    contentType: row.logo_content_type,
    updatedAt: toIsoTimestamp(row.logo_updated_at),
  };
}

async function createCompanyRegistrationRequest(payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_name", sql.NVarChar(160), payload.companyName)
    .input("company_email", sql.NVarChar(254), payload.companyEmail)
    .input("company_phone", sql.NVarChar(32), payload.companyPhone)
    .input("company_address", sql.NVarChar(300), payload.companyAddress)
    .input("contact_name", sql.NVarChar(160), payload.contactName)
    .input("contact_email", sql.NVarChar(254), payload.contactEmail)
    .input("contact_phone", sql.NVarChar(32), payload.contactPhone).query(`
      INSERT INTO dbo.CompanyRegistrationRequests (
        company_name,
        company_email,
        company_phone,
        company_address,
        contact_name,
        contact_email,
        contact_phone
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_name,
        INSERTED.company_email,
        INSERTED.company_phone,
        INSERTED.company_address,
        INSERTED.contact_name,
        INSERTED.contact_email,
        INSERTED.contact_phone,
        INSERTED.requested_logo_blob_path,
        INSERTED.requested_logo_content_type,
        INSERTED.status,
        INSERTED.reviewed_at,
        INSERTED.reviewed_by_label,
        INSERTED.review_note,
        INSERTED.approved_company_id,
        INSERTED.created_at,
        INSERTED.updated_at
      VALUES (
        @company_name,
        @company_email,
        @company_phone,
        @company_address,
        @contact_name,
        @contact_email,
        @contact_phone
      )
    `);

  return mapCompanyRegistrationRequest(result.recordset[0]);
}

async function updateCompanyRegistrationRequestLogo(requestId, logo) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("request_id", sql.BigInt, requestId)
    .input("requested_logo_blob_path", sql.NVarChar(512), logo.blobPath)
    .input("requested_logo_content_type", sql.NVarChar(100), logo.contentType)
    .query(`
      UPDATE dbo.CompanyRegistrationRequests
      SET
        requested_logo_blob_path = @requested_logo_blob_path,
        requested_logo_content_type = @requested_logo_content_type,
        updated_at = SYSUTCDATETIME()
      OUTPUT
        INSERTED.id,
        INSERTED.company_name,
        INSERTED.company_email,
        INSERTED.company_phone,
        INSERTED.company_address,
        INSERTED.contact_name,
        INSERTED.contact_email,
        INSERTED.contact_phone,
        INSERTED.requested_logo_blob_path,
        INSERTED.requested_logo_content_type,
        INSERTED.status,
        INSERTED.reviewed_at,
        INSERTED.reviewed_by_label,
        INSERTED.review_note,
        INSERTED.approved_company_id,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE id = @request_id
        AND status = 'pending'
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "COMPANY_REGISTRATION_REQUEST_NOT_FOUND",
      "Company registration request was not found.",
    );
  }

  return mapCompanyRegistrationRequest(result.recordset[0]);
}

function mapCompanyPasswordReset(row) {
  return {
    id: toApiId(row.id),
    companyId: toApiId(row.company_id),
    companyUserId: toApiId(row.company_user_id),
    email: row.email,
    status: row.status,
    expiresAt: toIsoTimestamp(row.expires_at),
    sentAt: toIsoTimestamp(row.sent_at),
    usedAt: toIsoTimestamp(row.used_at),
    createdByLabel: row.created_by_label,
    companyName: row.company_name || null,
  };
}

async function getCompanyRegistrationRequestLogoMetadata(requestId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("request_id", sql.BigInt, requestId)
    .query(`
      SELECT
        id,
        requested_logo_blob_path,
        requested_logo_content_type
      FROM dbo.CompanyRegistrationRequests
      WHERE id = @request_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "COMPANY_REGISTRATION_REQUEST_NOT_FOUND",
      "Company registration request was not found.",
    );
  }

  const row = result.recordset[0];
  if (!row.requested_logo_blob_path) {
    throw new ApiError(
      404,
      "COMPANY_REGISTRATION_LOGO_NOT_FOUND",
      "Company registration request logo was not found.",
    );
  }

  return {
    blobPath: row.requested_logo_blob_path,
    contentType: row.requested_logo_content_type,
  };
}

async function approveCompanyRegistrationRequest(
  requestId,
  payload,
  options = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  const actorLabel = options.actorLabel || "internal";
  const pointsPercentage =
    payload.pointsPercentage == null ? 5 : payload.pointsPercentage;
  const invitation = options.invitation || null;

  await transaction.begin();

  try {
    const requestResult = await new sql.Request(transaction).input(
      "request_id",
      sql.BigInt,
      requestId,
    ).query(`
        SELECT TOP (1)
          id,
          company_name,
          company_email,
          company_phone,
          company_address,
          contact_name,
          contact_email,
          contact_phone,
          requested_logo_blob_path,
          requested_logo_content_type
        FROM dbo.CompanyRegistrationRequests WITH (UPDLOCK, HOLDLOCK)
        WHERE id = @request_id
          AND status = 'pending'
      `);

    if (!requestResult.recordset.length) {
      throw new ApiError(
        404,
        "COMPANY_REGISTRATION_REQUEST_NOT_FOUND",
        "Company registration request was not found.",
      );
    }

    const request = requestResult.recordset[0];
    const companyResult = await new sql.Request(transaction)
      .input("name", sql.NVarChar(160), request.company_name)
      .input("email", sql.NVarChar(254), request.company_email)
      .input("phone", sql.NVarChar(32), request.company_phone)
      .input("address", sql.NVarChar(300), request.company_address)
      .input(
        "logo_blob_path",
        sql.NVarChar(512),
        request.requested_logo_blob_path,
      )
      .input(
        "logo_content_type",
        sql.NVarChar(100),
        request.requested_logo_content_type,
      )
      .input("points_percentage", sql.Decimal(5, 2), pointsPercentage).query(`
        INSERT INTO dbo.Companies (
          name,
          email,
          phone,
          address,
          logo_blob_path,
          logo_content_type,
          logo_updated_at,
          points_percentage,
          status
        )
        OUTPUT
          INSERTED.id,
          INSERTED.name,
          INSERTED.email,
          INSERTED.phone,
          INSERTED.address,
          INSERTED.logo_blob_path,
          INSERTED.logo_content_type,
          INSERTED.logo_updated_at,
          INSERTED.points_percentage,
          INSERTED.status,
          INSERTED.updated_at
        VALUES (
          @name,
          @email,
          @phone,
          @address,
          @logo_blob_path,
          @logo_content_type,
          CASE WHEN @logo_blob_path IS NULL THEN NULL ELSE SYSUTCDATETIME() END,
          @points_percentage,
          'pending_activation'
        )
      `);

    const reviewResult = await new sql.Request(transaction)
      .input("request_id", sql.BigInt, requestId)
      .input("reviewed_by_label", sql.NVarChar(120), actorLabel)
      .input("review_note", sql.NVarChar(500), payload.reviewNote)
      .input("approved_company_id", sql.BigInt, companyResult.recordset[0].id)
      .query(`
        UPDATE dbo.CompanyRegistrationRequests
        SET
          status = 'approved',
          reviewed_at = SYSUTCDATETIME(),
          reviewed_by_label = @reviewed_by_label,
          review_note = @review_note,
          approved_company_id = @approved_company_id,
          updated_at = SYSUTCDATETIME()
        OUTPUT
          INSERTED.id,
          INSERTED.company_name,
          INSERTED.company_email,
          INSERTED.company_phone,
          INSERTED.company_address,
          INSERTED.contact_name,
          INSERTED.contact_email,
          INSERTED.contact_phone,
          INSERTED.requested_logo_blob_path,
          INSERTED.requested_logo_content_type,
          INSERTED.status,
          INSERTED.reviewed_at,
          INSERTED.reviewed_by_label,
          INSERTED.review_note,
          INSERTED.approved_company_id,
          INSERTED.created_at,
          INSERTED.updated_at
        WHERE id = @request_id
      `);

    let invitationResult = null;
    if (invitation) {
      invitationResult = await new sql.Request(transaction)
        .input("company_id", sql.BigInt, companyResult.recordset[0].id)
        .input("registration_request_id", sql.BigInt, requestId)
        .input("email", sql.NVarChar(254), request.company_email)
        .input("token_hash", sql.VarBinary(32), invitation.tokenHash)
        .input("role", sql.VarChar(30), "owner")
        .input("expires_at", sql.DateTime2, invitation.expiresAt)
        .input("created_by_label", sql.NVarChar(120), actorLabel).query(`
          INSERT INTO dbo.CompanyInvitations (
            company_id,
            registration_request_id,
            email,
            token_hash,
            role,
            expires_at,
            created_by_label
          )
          OUTPUT
            INSERTED.id,
            INSERTED.company_id,
            INSERTED.registration_request_id,
            INSERTED.email,
            INSERTED.role,
            INSERTED.status,
            INSERTED.expires_at,
            INSERTED.accepted_at,
            INSERTED.revoked_at,
            INSERTED.created_at,
            INSERTED.created_by_label
          VALUES (
            @company_id,
            @registration_request_id,
            @email,
            @token_hash,
            @role,
            @expires_at,
            @created_by_label
          )
        `);
    }

    await transaction.commit();

    const company = companyResult.recordset[0];
    const approvedRequest = {
      ...mapCompanyRegistrationRequest(reviewResult.recordset[0]),
      company: {
        id: toApiId(company.id),
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        logoUrl: company.logo_blob_path ? "/api/my-company/logo" : null,
        logoContentType: company.logo_content_type,
        logoUpdatedAt: toIsoTimestamp(company.logo_updated_at),
        status: company.status,
        pointsPercentage: Number(company.points_percentage),
      },
    };

    if (invitationResult) {
      approvedRequest.invitation = {
        ...mapCompanyInvitation(invitationResult.recordset[0]),
        companyName: company.name,
      };
    }

    return approvedRequest;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve the original failure; rollback errors are secondary here.
    }
    throw error;
  }
}

async function rejectCompanyRegistrationRequest(
  requestId,
  payload,
  options = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const actorLabel = options.actorLabel || "internal";
  const result = await pool
    .request()
    .input("request_id", sql.BigInt, requestId)
    .input("reviewed_by_label", sql.NVarChar(120), actorLabel)
    .input("review_note", sql.NVarChar(500), payload.reviewNote).query(`
      UPDATE dbo.CompanyRegistrationRequests
      SET
        status = 'rejected',
        reviewed_at = SYSUTCDATETIME(),
        reviewed_by_label = @reviewed_by_label,
        review_note = @review_note,
        updated_at = SYSUTCDATETIME()
      OUTPUT
        INSERTED.id,
        INSERTED.company_name,
        INSERTED.company_email,
        INSERTED.company_phone,
        INSERTED.company_address,
        INSERTED.contact_name,
        INSERTED.contact_email,
        INSERTED.contact_phone,
        INSERTED.status,
        INSERTED.reviewed_at,
        INSERTED.reviewed_by_label,
        INSERTED.review_note,
        INSERTED.approved_company_id,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE id = @request_id
        AND status = 'pending'
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "COMPANY_REGISTRATION_REQUEST_NOT_FOUND",
      "Company registration request was not found.",
    );
  }

  return mapCompanyRegistrationRequest(result.recordset[0]);
}

async function getInvitationCompany(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("company_id", sql.BigInt, companyId)
    .query(`
      SELECT id, name
      FROM dbo.Companies
      WHERE id = @company_id
        AND status IN ('pending_activation', 'active')
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
  }

  return result.recordset[0];
}

async function ensureRegistrationRequestBelongsToCompany(
  registrationRequestId,
  companyId,
) {
  if (registrationRequestId == null) {
    return;
  }

  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("registration_request_id", sql.BigInt, registrationRequestId)
    .input("company_id", sql.BigInt, companyId).query(`
      SELECT 1 AS exists_flag
      FROM dbo.CompanyRegistrationRequests
      WHERE id = @registration_request_id
        AND approved_company_id = @company_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "One or more fields are invalid.",
      [
        {
          field: "registrationRequestId",
          message: "registrationRequestId must belong to the company.",
        },
      ],
    );
  }
}

async function createCompanyInvitation(
  payload,
  tokenHash,
  expiresAt,
  options = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const actorLabel = options.actorLabel || "internal";
  const company = await getInvitationCompany(payload.companyId);
  await ensureRegistrationRequestBelongsToCompany(
    payload.registrationRequestId,
    payload.companyId,
  );

  const result = await pool
    .request()
    .input("company_id", sql.BigInt, payload.companyId)
    .input("registration_request_id", sql.BigInt, payload.registrationRequestId)
    .input("email", sql.NVarChar(254), payload.email)
    .input("token_hash", sql.VarBinary(32), tokenHash)
    .input("role", sql.VarChar(30), payload.role)
    .input("expires_at", sql.DateTime2, expiresAt)
    .input("created_by_label", sql.NVarChar(120), actorLabel).query(`
      INSERT INTO dbo.CompanyInvitations (
        company_id,
        registration_request_id,
        email,
        token_hash,
        role,
        expires_at,
        created_by_label
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_id,
        INSERTED.registration_request_id,
        INSERTED.email,
        INSERTED.role,
        INSERTED.status,
        INSERTED.expires_at,
        INSERTED.accepted_at,
        INSERTED.revoked_at,
        INSERTED.created_at,
        INSERTED.created_by_label
      VALUES (
        @company_id,
        @registration_request_id,
        @email,
        @token_hash,
        @role,
        @expires_at,
        @created_by_label
      )
    `);

  return {
    ...mapCompanyInvitation(result.recordset[0]),
    companyName: company.name,
  };
}

async function getCompanyInvitationByTokenHash(tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("token_hash", sql.VarBinary(32), tokenHash).query(`
      SELECT TOP (1)
        invitations.id,
        invitations.company_id,
        companies.name AS company_name,
        invitations.registration_request_id,
        invitations.email,
        invitations.role,
        invitations.status,
        invitations.expires_at,
        invitations.accepted_at,
        invitations.revoked_at,
        invitations.created_at,
        invitations.created_by_label
      FROM dbo.CompanyInvitations AS invitations
      INNER JOIN dbo.Companies AS companies
        ON companies.id = invitations.company_id
      WHERE invitations.token_hash = @token_hash
    `);

  return result.recordset.length
    ? mapCompanyInvitationWithCompany(result.recordset[0])
    : null;
}

async function getCompanyInvitationById(invitationId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("invitation_id", sql.BigInt, invitationId).query(`
      SELECT TOP (1)
        invitations.id,
        invitations.company_id,
        companies.name AS company_name,
        invitations.registration_request_id,
        invitations.email,
        invitations.role,
        invitations.status,
        invitations.expires_at,
        invitations.accepted_at,
        invitations.revoked_at,
        invitations.created_at,
        invitations.created_by_label
      FROM dbo.CompanyInvitations AS invitations
      INNER JOIN dbo.Companies AS companies
        ON companies.id = invitations.company_id
      WHERE invitations.id = @invitation_id
    `);

  return result.recordset.length
    ? mapCompanyInvitationWithCompany(result.recordset[0])
    : null;
}

async function rotateCompanyInvitationToken(invitationId, tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const currentResult = await pool
    .request()
    .input("invitation_id", sql.BigInt, invitationId).query(`
      SELECT TOP (1)
        invitations.id,
        invitations.status,
        invitations.expires_at
      FROM dbo.CompanyInvitations AS invitations
      WHERE invitations.id = @invitation_id
    `);

  if (!currentResult.recordset.length) {
    throw new ApiError(
      404,
      "INVITATION_NOT_FOUND",
      "Company invitation was not found.",
    );
  }

  const current = currentResult.recordset[0];
  if (current.status === "accepted") {
    throw new ApiError(
      409,
      "INVITATION_ALREADY_ACCEPTED",
      "Company invitation was already accepted.",
    );
  }

  if (current.status !== "pending") {
    throw new ApiError(
      404,
      "INVITATION_NOT_FOUND",
      "Company invitation was not found.",
    );
  }

  if (current.expires_at < new Date()) {
    throw new ApiError(
      409,
      "INVITATION_EXPIRED",
      "Company invitation is expired.",
    );
  }

  const result = await pool
    .request()
    .input("invitation_id", sql.BigInt, invitationId)
    .input("token_hash", sql.VarBinary(32), tokenHash).query(`
      UPDATE invitations
      SET token_hash = @token_hash
      FROM dbo.CompanyInvitations AS invitations
      WHERE invitations.id = @invitation_id
        AND invitations.status = 'pending'
        AND invitations.expires_at >= SYSUTCDATETIME()
    `);

  if (!result.rowsAffected || !result.rowsAffected[0]) {
    throw new ApiError(
      409,
      "INVITATION_EXPIRED",
      "Company invitation is expired.",
    );
  }

  return getCompanyInvitationById(invitationId);
}

async function acceptCompanyInvitationWithPassword(
  tokenHash,
  payload,
  passwordCredentials,
) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const invitationResult = await new sql.Request(transaction).input(
      "token_hash",
      sql.VarBinary(32),
      tokenHash,
    ).query(`
        SELECT TOP (1)
          invitations.id,
          invitations.company_id,
          invitations.email,
          invitations.role,
          invitations.status,
          invitations.expires_at,
          companies.name AS company_name,
          companies.status AS company_status
        FROM dbo.CompanyInvitations AS invitations WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN dbo.Companies AS companies WITH (UPDLOCK, HOLDLOCK)
          ON companies.id = invitations.company_id
        WHERE invitations.token_hash = @token_hash
      `);

    if (!invitationResult.recordset.length) {
      throw new ApiError(
        404,
        "INVITATION_NOT_FOUND",
        "Company invitation was not found.",
      );
    }

    const invitation = invitationResult.recordset[0];
    if (invitation.status === "accepted") {
      throw new ApiError(
        409,
        "INVITATION_ALREADY_ACCEPTED",
        "Company invitation was already accepted.",
      );
    }

    if (invitation.status !== "pending") {
      throw new ApiError(
        404,
        "INVITATION_NOT_FOUND",
        "Company invitation was not found.",
      );
    }

    if (invitation.expires_at < new Date()) {
      throw new ApiError(
        409,
        "INVITATION_EXPIRED",
        "Company invitation is expired.",
      );
    }

    if (!["pending_activation", "active"].includes(invitation.company_status)) {
      throw new ApiError(404, "COMPANY_NOT_FOUND", "Company was not found.");
    }

    const userResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, invitation.company_id)
      .input("email", sql.NVarChar(254), invitation.email)
      .input("display_name", sql.NVarChar(160), payload.displayName)
      .input("role", sql.VarChar(30), invitation.role)
      .input(
        "password_hash",
        sql.NVarChar(512),
        passwordCredentials.passwordHash,
      )
      .input(
        "password_algorithm",
        sql.VarChar(40),
        passwordCredentials.passwordAlgorithm,
      )
      .input(
        "password_params",
        sql.NVarChar(300),
        passwordCredentials.passwordParams,
      ).query(`
        INSERT INTO dbo.CompanyUsers (
          company_id,
          email,
          display_name,
          role,
          status,
          auth_provider,
          password_hash,
          password_algorithm,
          password_params,
          password_updated_at
        )
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.email,
          INSERTED.display_name,
          INSERTED.role,
          INSERTED.status,
          INSERTED.auth_provider,
          INSERTED.last_login_at,
          INSERTED.created_at,
          INSERTED.updated_at
        VALUES (
          @company_id,
          @email,
          @display_name,
          @role,
          'active',
          'local_password',
          @password_hash,
          @password_algorithm,
          @password_params,
          SYSUTCDATETIME()
        )
      `);

    await new sql.Request(transaction).input(
      "invitation_id",
      sql.BigInt,
      invitation.id,
    ).query(`
        UPDATE dbo.CompanyInvitations
        SET
          status = 'accepted',
          accepted_at = SYSUTCDATETIME()
        WHERE id = @invitation_id
          AND status = 'pending'
      `);

    let companyStatus = invitation.company_status;
    if (
      invitation.role === "owner" &&
      invitation.company_status === "pending_activation"
    ) {
      const companyResult = await new sql.Request(transaction).input(
        "company_id",
        sql.BigInt,
        invitation.company_id,
      ).query(`
          UPDATE dbo.Companies
          SET
            status = 'active',
            updated_at = SYSUTCDATETIME()
          OUTPUT INSERTED.status
          WHERE id = @company_id
            AND status = 'pending_activation'
        `);

      if (companyResult.recordset.length) {
        companyStatus = companyResult.recordset[0].status;
      }
    }

    await transaction.commit();

    const user = mapCompanyUser(userResult.recordset[0]);
    return {
      user,
      company: {
        id: toApiId(invitation.company_id),
        name: invitation.company_name,
        status: companyStatus,
      },
      invitation: {
        id: toApiId(invitation.id),
        companyId: toApiId(invitation.company_id),
        role: invitation.role,
      },
    };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve the original failure; rollback errors are secondary here.
    }
    throw error;
  }
}

async function getLocalPasswordUserByEmail(email) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request().input("email", sql.NVarChar(254), email)
    .query(`
      SELECT TOP (1)
        users.id,
        users.company_id,
        users.email,
        users.display_name,
        users.role,
        users.status,
        users.auth_provider,
        users.password_hash,
        users.password_algorithm,
        users.password_params,
        users.password_locked_until,
        users.last_login_at,
        users.created_at,
        users.updated_at,
        companies.name AS company_name,
        companies.status AS company_status
      FROM dbo.CompanyUsers AS users
      INNER JOIN dbo.Companies AS companies
        ON companies.id = users.company_id
      WHERE users.email = @email
        AND users.auth_provider = 'local_password'
    `);

  return result.recordset.length ? result.recordset[0] : null;
}

async function getLocalPasswordUserById(companyId, companyUserId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("company_user_id", sql.BigInt, companyUserId).query(`
      SELECT TOP (1)
        users.id,
        users.company_id,
        users.email,
        users.display_name,
        users.role,
        users.status,
        users.auth_provider,
        users.password_hash,
        users.password_algorithm,
        users.password_params,
        users.password_locked_until,
        users.last_login_at,
        users.created_at,
        users.updated_at,
        companies.name AS company_name,
        companies.status AS company_status
      FROM dbo.CompanyUsers AS users
      INNER JOIN dbo.Companies AS companies
        ON companies.id = users.company_id
      WHERE users.company_id = @company_id
        AND users.id = @company_user_id
        AND users.auth_provider = 'local_password'
    `);

  return result.recordset.length ? result.recordset[0] : null;
}

async function updateCompanyUserPassword(
  companyId,
  companyUserId,
  passwordCredentials,
  currentSessionTokenHash = null,
) {
  const sql = getSql();
  const pool = await getPool();
  const request = pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("company_user_id", sql.BigInt, companyUserId)
    .input("password_hash", sql.NVarChar(512), passwordCredentials.passwordHash)
    .input(
      "password_algorithm",
      sql.VarChar(40),
      passwordCredentials.passwordAlgorithm,
    )
    .input(
      "password_params",
      sql.NVarChar(300),
      passwordCredentials.passwordParams,
    );

  await request.query(`
    UPDATE dbo.CompanyUsers
    SET
      password_hash = @password_hash,
      password_algorithm = @password_algorithm,
      password_params = @password_params,
      password_updated_at = SYSUTCDATETIME(),
      updated_at = SYSUTCDATETIME()
    WHERE company_id = @company_id
      AND id = @company_user_id
      AND status = 'active'
      AND auth_provider = 'local_password'
  `);

  const revokeRequest = pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("company_user_id", sql.BigInt, companyUserId);
  const keepCurrentSessionPredicate = currentSessionTokenHash
    ? "AND token_hash <> @current_session_token_hash"
    : "";

  if (currentSessionTokenHash) {
    revokeRequest.input(
      "current_session_token_hash",
      sql.VarBinary(32),
      currentSessionTokenHash,
    );
  }

  await revokeRequest.query(`
    UPDATE dbo.CompanySessions
    SET
      status = 'revoked',
      revoked_at = SYSUTCDATETIME()
    WHERE company_id = @company_id
      AND company_user_id = @company_user_id
      AND status = 'active'
      ${keepCurrentSessionPredicate}
  `);

  return {
    companyId: toApiId(companyId),
    userId: toApiId(companyUserId),
    passwordUpdatedAt: new Date().toISOString(),
  };
}

async function createCompanySession(
  companyId,
  companyUserId,
  tokenHash,
  expiresAt,
) {
  const sql = getSql();
  const pool = await getPool();
  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("company_user_id", sql.BigInt, companyUserId)
    .input("token_hash", sql.VarBinary(32), tokenHash)
    .input("expires_at", sql.DateTime2, expiresAt).query(`
      INSERT INTO dbo.CompanySessions (
        company_id,
        company_user_id,
        token_hash,
        expires_at
      )
      VALUES (
        @company_id,
        @company_user_id,
        @token_hash,
        @expires_at
      )
    `);

  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("company_user_id", sql.BigInt, companyUserId).query(`
      UPDATE dbo.CompanyUsers
      SET
        last_login_at = SYSUTCDATETIME(),
        updated_at = SYSUTCDATETIME()
      WHERE company_id = @company_id
        AND id = @company_user_id
    `);
}

async function getAuthIdentityBySessionTokenHash(tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("token_hash", sql.VarBinary(32), tokenHash).query(`
      SELECT TOP (1)
        users.id,
        users.company_id,
        users.email,
        users.display_name,
        users.role,
        users.status,
        users.auth_provider,
        users.last_login_at,
        users.created_at,
        users.updated_at,
        companies.name AS company_name,
        companies.status AS company_status
      FROM dbo.CompanySessions AS sessions
      INNER JOIN dbo.CompanyUsers AS users
        ON users.company_id = sessions.company_id
       AND users.id = sessions.company_user_id
      INNER JOIN dbo.Companies AS companies
        ON companies.id = sessions.company_id
      WHERE sessions.token_hash = @token_hash
        AND sessions.status = 'active'
        AND sessions.expires_at > SYSUTCDATETIME()
    `);

  if (!result.recordset.length) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  const row = result.recordset[0];
  if (row.status !== "active" || row.company_status !== "active") {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "Company user is not allowed to operate.",
    );
  }

  await pool.request().input("token_hash", sql.VarBinary(32), tokenHash).query(`
      UPDATE dbo.CompanySessions
      SET last_seen_at = SYSUTCDATETIME()
      WHERE token_hash = @token_hash
        AND status = 'active'
    `);

  return mapAuthIdentity(row);
}

async function revokeCompanySession(tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  await pool.request().input("token_hash", sql.VarBinary(32), tokenHash).query(`
      UPDATE dbo.CompanySessions
      SET
        status = 'revoked',
        revoked_at = SYSUTCDATETIME()
      WHERE token_hash = @token_hash
        AND status = 'active'
    `);
}

async function listCustomers(companyId, search) {
  const sql = getSql();
  const pool = await getPool();
  const normalizedSearch = typeof search === "string" ? search.trim() : "";
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("search", sql.NVarChar(254), normalizedSearch || null)
    .input(
      "search_like",
      sql.NVarChar(260),
      normalizedSearch ? `%${normalizedSearch}%` : null,
    ).query(`
      SELECT TOP (50) id, name, phone, email, created_at, updated_at
      FROM dbo.Customers
      WHERE company_id = @company_id
        AND (
          @search IS NULL
          OR phone = @search
          OR email COLLATE ${CUSTOMER_SEARCH_COLLATION} = @search COLLATE ${CUSTOMER_SEARCH_COLLATION}
          OR name COLLATE ${CUSTOMER_SEARCH_COLLATION} LIKE @search_like COLLATE ${CUSTOMER_SEARCH_COLLATION}
        )
      ORDER BY name ASC, id ASC
    `);

  return result.recordset.map(mapCustomer);
}

async function createCustomer(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("name", sql.NVarChar(160), payload.name)
    .input("phone", sql.NVarChar(32), payload.phone)
    .input("email", sql.NVarChar(254), payload.email).query(`
      INSERT INTO dbo.Customers (company_id, name, phone, email)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.phone, INSERTED.email, INSERTED.created_at, INSERTED.updated_at
      VALUES (@company_id, @name, @phone, @email)
    `);

  return mapCustomer(result.recordset[0]);
}

async function createCompanyPasswordReset(
  email,
  tokenHash,
  expiresAt,
  options = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const user = await getLocalPasswordUserByEmail(email);

  if (!user || user.status !== "active" || user.company_status !== "active") {
    throw new ApiError(
      404,
      "COMPANY_USER_NOT_FOUND",
      "Company user was not found.",
    );
  }

  await pool
    .request()
    .input("company_id", sql.BigInt, user.company_id)
    .input("company_user_id", sql.BigInt, user.id).query(`
      UPDATE dbo.CompanyPasswordResets
      SET status = 'revoked'
      WHERE company_id = @company_id
        AND company_user_id = @company_user_id
        AND status = 'pending'
    `);

  const result = await pool
    .request()
    .input("company_id", sql.BigInt, user.company_id)
    .input("company_user_id", sql.BigInt, user.id)
    .input("email", sql.NVarChar(254), user.email)
    .input("token_hash", sql.VarBinary(32), tokenHash)
    .input("expires_at", sql.DateTime2, expiresAt)
    .input(
      "created_by_label",
      sql.NVarChar(120),
      options.actorLabel || "internal",
    ).query(`
      INSERT INTO dbo.CompanyPasswordResets (
        company_id,
        company_user_id,
        email,
        token_hash,
        expires_at,
        created_by_label
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_id,
        INSERTED.company_user_id,
        INSERTED.email,
        INSERTED.status,
        INSERTED.expires_at,
        INSERTED.sent_at,
        INSERTED.used_at,
        INSERTED.created_by_label
      VALUES (
        @company_id,
        @company_user_id,
        @email,
        @token_hash,
        @expires_at,
        @created_by_label
      )
    `);

  return {
    ...mapCompanyPasswordReset(result.recordset[0]),
    companyName: user.company_name,
  };
}

async function getCompanyPasswordResetByTokenHash(tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("token_hash", sql.VarBinary(32), tokenHash).query(`
      SELECT TOP (1)
        resets.id,
        resets.company_id,
        resets.company_user_id,
        resets.email,
        resets.status,
        resets.expires_at,
        resets.sent_at,
        resets.used_at,
        resets.created_by_label,
        companies.name AS company_name
      FROM dbo.CompanyPasswordResets AS resets
      INNER JOIN dbo.Companies AS companies
        ON companies.id = resets.company_id
      WHERE resets.token_hash = @token_hash
    `);

  return result.recordset.length
    ? mapCompanyPasswordReset(result.recordset[0])
    : null;
}

async function completeCompanyPasswordReset(tokenHash, passwordCredentials) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const resetResult = await new sql.Request(transaction).input(
      "token_hash",
      sql.VarBinary(32),
      tokenHash,
    ).query(`
        SELECT TOP (1)
          resets.id,
          resets.company_id,
          resets.company_user_id,
          resets.email,
          resets.status,
          resets.expires_at,
          companies.name AS company_name
        FROM dbo.CompanyPasswordResets AS resets WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN dbo.Companies AS companies WITH (UPDLOCK, HOLDLOCK)
          ON companies.id = resets.company_id
        WHERE resets.token_hash = @token_hash
      `);

    if (!resetResult.recordset.length) {
      throw new ApiError(
        404,
        "PASSWORD_RESET_NOT_FOUND",
        "Password reset was not found.",
      );
    }

    const reset = resetResult.recordset[0];
    if (reset.status === "used") {
      throw new ApiError(
        409,
        "PASSWORD_RESET_ALREADY_USED",
        "Password reset was already used.",
      );
    }

    if (reset.status !== "pending") {
      throw new ApiError(
        404,
        "PASSWORD_RESET_NOT_FOUND",
        "Password reset was not found.",
      );
    }

    if (reset.expires_at < new Date()) {
      await new sql.Request(transaction).input("reset_id", sql.BigInt, reset.id)
        .query(`
          UPDATE dbo.CompanyPasswordResets
          SET status = 'expired'
          WHERE id = @reset_id
            AND status = 'pending'
        `);
      throw new ApiError(
        409,
        "PASSWORD_RESET_EXPIRED",
        "Password reset is expired.",
      );
    }

    await new sql.Request(transaction)
      .input("company_id", sql.BigInt, reset.company_id)
      .input("company_user_id", sql.BigInt, reset.company_user_id)
      .input(
        "password_hash",
        sql.NVarChar(512),
        passwordCredentials.passwordHash,
      )
      .input(
        "password_algorithm",
        sql.VarChar(40),
        passwordCredentials.passwordAlgorithm,
      )
      .input(
        "password_params",
        sql.NVarChar(300),
        passwordCredentials.passwordParams,
      ).query(`
        UPDATE dbo.CompanyUsers
        SET
          password_hash = @password_hash,
          password_algorithm = @password_algorithm,
          password_params = @password_params,
          password_updated_at = SYSUTCDATETIME(),
          updated_at = SYSUTCDATETIME()
        WHERE company_id = @company_id
          AND id = @company_user_id
          AND status = 'active'
      `);

    await new sql.Request(transaction).input("reset_id", sql.BigInt, reset.id)
      .query(`
        UPDATE dbo.CompanyPasswordResets
        SET
          status = 'used',
          used_at = SYSUTCDATETIME()
        WHERE id = @reset_id
          AND status = 'pending'
      `);

    await new sql.Request(transaction)
      .input("company_id", sql.BigInt, reset.company_id)
      .input("company_user_id", sql.BigInt, reset.company_user_id).query(`
        UPDATE dbo.CompanySessions
        SET
          status = 'revoked',
          revoked_at = SYSUTCDATETIME()
        WHERE company_id = @company_id
          AND company_user_id = @company_user_id
          AND status = 'active'
      `);

    await transaction.commit();

    return {
      email: reset.email,
      companyName: reset.company_name,
      completedAt: new Date().toISOString(),
    };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      // Preserve the original failure.
    }
    throw error;
  }
}

async function getCustomerById(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId).query(`
      SELECT id, name, phone, email, created_at, updated_at
      FROM dbo.Customers
      WHERE company_id = @company_id
        AND id = @customer_id
    `);

  return result.recordset.length ? mapCustomer(result.recordset[0]) : null;
}

async function customerExists(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId).query(`
      SELECT 1 AS exists_flag
      FROM dbo.Customers
      WHERE company_id = @company_id
        AND id = @customer_id
    `);

  return Boolean(result.recordset.length);
}

async function createPurchase(companyId, payload, pointsEarned) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, payload.customerId)
    .input("invoice_number", sql.NVarChar(80), payload.invoiceNumber)
    .input("purchase_date", sql.Date, payload.purchaseDate)
    .input("amount", sql.Decimal(18, 2), payload.amount)
    .input("points_earned", sql.Int, pointsEarned).query(`
      INSERT INTO dbo.Purchases (company_id, customer_id, invoice_number, purchase_date, amount, points_earned)
      OUTPUT INSERTED.id, INSERTED.customer_id, INSERTED.invoice_number, INSERTED.purchase_date,
             INSERTED.amount, INSERTED.points_earned, INSERTED.created_at
      VALUES (@company_id, @customer_id, @invoice_number, @purchase_date, @amount, @points_earned)
    `);

  const row = result.recordset[0];
  return {
    id: toApiId(row.id),
    customerId: toApiId(row.customer_id),
    invoiceNumber: row.invoice_number,
    purchaseDate: toIsoDate(row.purchase_date),
    amount: Number(row.amount),
    pointsEarned: row.points_earned,
    createdAt: toIsoTimestamp(row.created_at),
  };
}

async function getBalance(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId).query(`
      SELECT customer_id, points_earned, points_redeemed, points_balance
      FROM dbo.CustomerPointBalances
      WHERE company_id = @company_id
        AND customer_id = @customer_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "CUSTOMER_NOT_FOUND",
      "Customer does not exist for this company.",
    );
  }

  const row = result.recordset[0];
  return {
    customerId: toApiId(row.customer_id),
    pointsEarned: row.points_earned,
    pointsRedeemed: row.points_redeemed,
    pointsBalance: row.points_balance,
  };
}

async function getActivity(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId).query(`
      SELECT 'purchase' AS type, id, purchase_date AS activity_date, invoice_number, amount,
             points_earned AS points, CAST(NULL AS nvarchar(500)) AS note, created_at
      FROM dbo.Purchases
      WHERE company_id = @company_id
        AND customer_id = @customer_id
      UNION ALL
      SELECT 'redemption' AS type, id, redemption_date AS activity_date, CAST(NULL AS nvarchar(80)) AS invoice_number,
             CAST(NULL AS decimal(18,2)) AS amount, -points_redeemed AS points, note, created_at
      FROM dbo.Redemptions
      WHERE company_id = @company_id
        AND customer_id = @customer_id
      ORDER BY activity_date DESC, created_at DESC, id DESC
    `);

  return result.recordset.map((row) => ({
    type: row.type,
    id: toApiId(row.id),
    date: toIsoDate(row.activity_date),
    invoiceNumber: row.invoice_number || undefined,
    amount: row.amount == null ? undefined : Number(row.amount),
    note: row.note || undefined,
    points: row.points,
  }));
}

async function getActivityReport(companyId, filters) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("from", sql.Date, filters.from)
    .input("to", sql.Date, filters.to)
    .input("type", sql.VarChar(20), filters.type).query(`
      SELECT 'purchase' AS type, p.id, p.purchase_date AS activity_date,
             p.customer_id, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
             p.invoice_number, p.amount, p.points_earned AS points,
             CAST(NULL AS nvarchar(500)) AS note
      FROM dbo.Purchases AS p
      INNER JOIN dbo.Customers AS c
        ON c.company_id = p.company_id
       AND c.id = p.customer_id
      WHERE p.company_id = @company_id
        AND p.purchase_date >= @from
        AND p.purchase_date <= @to
        AND @type IN ('all', 'purchase')
      UNION ALL
      SELECT 'redemption' AS type, r.id, r.redemption_date AS activity_date,
             r.customer_id, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
             CAST(NULL AS nvarchar(80)) AS invoice_number, CAST(NULL AS decimal(18,2)) AS amount,
             -r.points_redeemed AS points,
             r.note
      FROM dbo.Redemptions AS r
      INNER JOIN dbo.Customers AS c
        ON c.company_id = r.company_id
       AND c.id = r.customer_id
      WHERE r.company_id = @company_id
        AND r.redemption_date >= @from
        AND r.redemption_date <= @to
        AND @type IN ('all', 'redemption')
      UNION ALL
      SELECT 'membership' AS type, memberships.id, memberships.start_date AS activity_date,
             memberships.customer_id, customers.name AS customer_name, customers.phone AS customer_phone, customers.email AS customer_email,
             CAST(NULL AS nvarchar(80)) AS invoice_number, memberships.price_paid AS amount,
             CAST(0 AS int) AS points,
             CONCAT(N'Membresia activada: ', plans.name) AS note
      FROM dbo.CustomerMemberships AS memberships
      INNER JOIN dbo.Customers AS customers
        ON customers.company_id = memberships.company_id
       AND customers.id = memberships.customer_id
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = memberships.company_id
       AND plans.id = memberships.membership_plan_id
      WHERE memberships.company_id = @company_id
        AND memberships.start_date >= @from
        AND memberships.start_date <= @to
        AND @type IN ('all', 'membership')
      UNION ALL
      SELECT 'membership' AS type, usages.id, usages.usage_date AS activity_date,
             usages.customer_id, customers.name AS customer_name, customers.phone AS customer_phone, customers.email AS customer_email,
             CAST(NULL AS nvarchar(80)) AS invoice_number, CAST(NULL AS decimal(18,2)) AS amount,
             CAST(0 AS int) AS points,
             CONCAT(N'Beneficio usado: ', benefits.name, N' x', CONVERT(nvarchar(20), usages.quantity)) AS note
      FROM dbo.MembershipBenefitUsages AS usages
      INNER JOIN dbo.Customers AS customers
        ON customers.company_id = usages.company_id
       AND customers.id = usages.customer_id
      INNER JOIN dbo.MembershipBenefits AS benefits
        ON benefits.id = usages.membership_benefit_id
      WHERE usages.company_id = @company_id
        AND usages.usage_date >= @from
        AND usages.usage_date <= @to
        AND @type IN ('all', 'membership')
      ORDER BY activity_date DESC, id DESC
    `);

  const items = result.recordset.map((row) => ({
    type: row.type,
    id: toApiId(row.id),
    date: toIsoDate(row.activity_date),
    customerId: toApiId(row.customer_id),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    invoiceNumber: row.invoice_number || undefined,
    amount: row.amount == null ? undefined : Number(row.amount),
    note: row.note || undefined,
    points: row.points,
  }));

  const activeCustomerIds = new Set(items.map((item) => item.customerId));
  const purchases = items.filter((item) => item.type === "purchase");
  const redemptions = items.filter((item) => item.type === "redemption");
  const memberships = items.filter((item) => item.type === "membership");

  return {
    from: filters.from,
    to: filters.to,
    type: filters.type,
    summary: {
      purchaseCount: purchases.length,
      purchaseAmountTotal: purchases.reduce(
        (total, item) => total + (item.amount || 0),
        0,
      ),
      pointsEarnedTotal: purchases.reduce(
        (total, item) => total + item.points,
        0,
      ),
      redemptionCount: redemptions.length,
      pointsRedeemedTotal: redemptions.reduce(
        (total, item) => total + Math.abs(item.points),
        0,
      ),
      membershipCount: memberships.length,
      activeCustomerCount: activeCustomerIds.size,
    },
    items,
  };
}

function buildCustomerReportSummary(items) {
  return items.reduce(
    (summary, item) => {
      if (item.type === "purchase") {
        summary.purchaseCount += 1;
        summary.purchaseAmountTotal += Number(item.amount || 0);
        summary.pointsEarnedTotal += Number(item.points || 0);
      }

      if (item.type === "redemption") {
        summary.redemptionCount += 1;
        summary.pointsRedeemedTotal += Math.abs(Number(item.points || 0));
      }

      if (item.type === "membership") {
        summary.membershipCount += 1;
        summary.membershipAmountTotal += Number(item.amount || 0);
      }

      if (item.type === "benefit") {
        summary.benefitUsageCount += 1;
        summary.benefitQuantityTotal += Number(item.quantity || 0);
      }

      summary.movementCount += 1;
      return summary;
    },
    {
      movementCount: 0,
      purchaseCount: 0,
      purchaseAmountTotal: 0,
      pointsEarnedTotal: 0,
      redemptionCount: 0,
      pointsRedeemedTotal: 0,
      membershipCount: 0,
      membershipAmountTotal: 0,
      benefitUsageCount: 0,
      benefitQuantityTotal: 0,
    },
  );
}

async function getCustomerReport(companyId, filters) {
  const sql = getSql();
  const pool = await getPool();
  const search = filters.search.trim();
  const candidatesResult = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("search", sql.NVarChar(254), search)
    .input("search_like", sql.NVarChar(260), `%${search}%`).query(`
      SELECT TOP (6) id, name, phone, email, created_at, updated_at
      FROM dbo.Customers
      WHERE company_id = @company_id
        AND (
          phone = @search
          OR email COLLATE ${CUSTOMER_SEARCH_COLLATION} = @search COLLATE ${CUSTOMER_SEARCH_COLLATION}
          OR name COLLATE ${CUSTOMER_SEARCH_COLLATION} LIKE @search_like COLLATE ${CUSTOMER_SEARCH_COLLATION}
        )
      ORDER BY
        CASE
          WHEN phone = @search THEN 0
          WHEN email COLLATE ${CUSTOMER_SEARCH_COLLATION} = @search COLLATE ${CUSTOMER_SEARCH_COLLATION} THEN 1
          WHEN name COLLATE ${CUSTOMER_SEARCH_COLLATION} = @search COLLATE ${CUSTOMER_SEARCH_COLLATION} THEN 2
          ELSE 3
        END,
        name ASC,
        id ASC
    `);

  const candidates = candidatesResult.recordset.map(mapCustomer);
  const baseReport = {
    search,
    from: filters.from,
    to: filters.to,
    type: filters.type,
    summary: buildCustomerReportSummary([]),
    items: [],
  };

  if (candidates.length === 0) {
    return {
      ...baseReport,
      status: "not_found",
      customer: null,
      candidates: [],
    };
  }

  if (candidates.length > 1) {
    return {
      ...baseReport,
      status: "ambiguous",
      customer: null,
      candidates,
    };
  }

  const customer = candidates[0];
  const movementsResult = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customer.id)
    .input("from", sql.Date, filters.from)
    .input("to", sql.Date, filters.to)
    .input("type", sql.VarChar(20), filters.type).query(`
      SELECT 'purchase' AS type, purchases.id, purchases.purchase_date AS movement_date,
             purchases.created_at, purchases.invoice_number, purchases.amount,
             purchases.points_earned AS points,
             CAST(NULL AS int) AS quantity,
             CAST(NULL AS nvarchar(120)) AS plan_name,
             CAST(NULL AS nvarchar(120)) AS benefit_name,
             CAST(NULL AS nvarchar(500)) AS note
      FROM dbo.Purchases AS purchases
      WHERE purchases.company_id = @company_id
        AND purchases.customer_id = @customer_id
        AND purchases.purchase_date >= @from
        AND purchases.purchase_date <= @to
        AND @type IN ('all', 'purchase')
      UNION ALL
      SELECT 'redemption' AS type, redemptions.id, redemptions.redemption_date AS movement_date,
             redemptions.created_at, CAST(NULL AS nvarchar(80)) AS invoice_number,
             CAST(NULL AS decimal(18,2)) AS amount,
             -redemptions.points_redeemed AS points,
             CAST(NULL AS int) AS quantity,
             CAST(NULL AS nvarchar(120)) AS plan_name,
             CAST(NULL AS nvarchar(120)) AS benefit_name,
             redemptions.note
      FROM dbo.Redemptions AS redemptions
      WHERE redemptions.company_id = @company_id
        AND redemptions.customer_id = @customer_id
        AND redemptions.redemption_date >= @from
        AND redemptions.redemption_date <= @to
        AND @type IN ('all', 'redemption')
      UNION ALL
      SELECT 'membership' AS type, transactions.id, transactions.transaction_date AS movement_date,
             transactions.created_at, CAST(NULL AS nvarchar(80)) AS invoice_number,
             transactions.amount,
             CAST(0 AS int) AS points,
             CAST(NULL AS int) AS quantity,
             plans.name AS plan_name,
             CAST(NULL AS nvarchar(120)) AS benefit_name,
             transactions.note
      FROM dbo.MembershipTransactions AS transactions
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = transactions.company_id
       AND plans.id = transactions.membership_plan_id
      WHERE transactions.company_id = @company_id
        AND transactions.customer_id = @customer_id
        AND transactions.transaction_date >= @from
        AND transactions.transaction_date <= @to
        AND @type IN ('all', 'membership')
      UNION ALL
      SELECT 'benefit' AS type, usages.id, usages.usage_date AS movement_date,
             usages.used_at AS created_at, CAST(NULL AS nvarchar(80)) AS invoice_number,
             CAST(NULL AS decimal(18,2)) AS amount,
             CAST(0 AS int) AS points,
             usages.quantity,
             plans.name AS plan_name,
             benefits.name AS benefit_name,
             usages.note
      FROM dbo.MembershipBenefitUsages AS usages
      INNER JOIN dbo.MembershipBenefits AS benefits
        ON benefits.company_id = usages.company_id
       AND benefits.id = usages.membership_benefit_id
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = usages.company_id
       AND plans.id = benefits.membership_plan_id
      WHERE usages.company_id = @company_id
        AND usages.customer_id = @customer_id
        AND usages.usage_date >= @from
        AND usages.usage_date <= @to
        AND @type IN ('all', 'benefit')
      ORDER BY movement_date DESC, created_at DESC, id DESC
    `);

  const items = movementsResult.recordset.map((row) => ({
    type: row.type,
    id: toApiId(row.id),
    date: toIsoDate(row.movement_date),
    createdAt: toIsoTimestamp(row.created_at),
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    invoiceNumber: row.invoice_number || undefined,
    amount: row.amount == null ? undefined : Number(row.amount),
    points: row.points == null ? 0 : Number(row.points),
    quantity: row.quantity == null ? undefined : Number(row.quantity),
    planName: row.plan_name || undefined,
    benefitName: row.benefit_name || undefined,
    note: row.note || undefined,
  }));

  return {
    ...baseReport,
    status: "resolved",
    customer,
    candidates: [],
    summary: buildCustomerReportSummary(items),
    items,
  };
}

async function createRedemption(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, payload.customerId)
    .input("redemption_date", sql.Date, payload.redemptionDate)
    .input("points_redeemed", sql.Int, payload.pointsRedeemed)
    .input("note", sql.NVarChar(500), payload.note)
    .execute("dbo.RegisterRedemption");

  const balance = await getBalance(companyId, payload.customerId);
  const latestResult = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, payload.customerId)
    .input("redemption_date", sql.Date, payload.redemptionDate)
    .input("points_redeemed", sql.Int, payload.pointsRedeemed).query(`
      SELECT TOP (1) id, created_at
      FROM dbo.Redemptions
      WHERE company_id = @company_id
        AND customer_id = @customer_id
        AND redemption_date = @redemption_date
        AND points_redeemed = @points_redeemed
      ORDER BY created_at DESC, id DESC
    `);

  const latest = latestResult.recordset[0];

  return {
    id: latest ? toApiId(latest.id) : null,
    customerId: toApiId(payload.customerId),
    redemptionDate: payload.redemptionDate,
    pointsRedeemed: payload.pointsRedeemed,
    note: payload.note,
    createdAt: latest ? toIsoTimestamp(latest.created_at) : null,
    balanceAfter: balance.pointsBalance,
  };
}

async function listMembershipPlans(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === "all" ? null : filters.status || "active";
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("status", sql.VarChar(20), status).query(`
      SELECT
        plans.id,
        plans.company_id,
        plans.name,
        plans.description,
        plans.duration_days,
        plans.price,
        plans.renewal_notice_days,
        plans.status,
        plans.created_at,
        plans.updated_at,
        COUNT(benefits.id) AS benefit_count
      FROM dbo.MembershipPlans AS plans
      LEFT JOIN dbo.MembershipBenefits AS benefits
        ON benefits.membership_plan_id = plans.id
      WHERE plans.company_id = @company_id
        AND (@status IS NULL OR plans.status = @status)
      GROUP BY
        plans.id,
        plans.company_id,
        plans.name,
        plans.description,
        plans.duration_days,
        plans.price,
        plans.renewal_notice_days,
        plans.status,
        plans.created_at,
        plans.updated_at
      ORDER BY plans.created_at DESC, plans.id DESC
    `);

  return {
    status: filters.status || "active",
    items: result.recordset.map(mapMembershipPlan),
  };
}

async function getMembershipPlanById(companyId, planId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("plan_id", sql.BigInt, planId).query(`
      SELECT
        plans.id,
        plans.company_id,
        plans.name,
        plans.description,
        plans.duration_days,
        plans.price,
        plans.renewal_notice_days,
        plans.status,
        plans.created_at,
        plans.updated_at,
        COUNT(benefits.id) AS benefit_count
      FROM dbo.MembershipPlans AS plans
      LEFT JOIN dbo.MembershipBenefits AS benefits
        ON benefits.membership_plan_id = plans.id
      WHERE plans.company_id = @company_id
        AND plans.id = @plan_id
      GROUP BY
        plans.id,
        plans.company_id,
        plans.name,
        plans.description,
        plans.duration_days,
        plans.price,
        plans.renewal_notice_days,
        plans.status,
        plans.created_at,
        plans.updated_at
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "MEMBERSHIP_PLAN_NOT_FOUND",
      "Membership plan was not found.",
    );
  }

  return mapMembershipPlan(result.recordset[0]);
}

async function createMembershipPlan(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("name", sql.NVarChar(120), payload.name)
    .input("description", sql.NVarChar(500), payload.description)
    .input("duration_days", sql.Int, payload.durationDays)
    .input("price", sql.Decimal(18, 2), payload.price)
    .input("renewal_notice_days", sql.Int, payload.renewalNoticeDays)
    .input("status", sql.VarChar(20), payload.status).query(`
      INSERT INTO dbo.MembershipPlans (
        company_id,
        name,
        description,
        duration_days,
        price,
        renewal_notice_days,
        status
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_id,
        INSERTED.name,
        INSERTED.description,
        INSERTED.duration_days,
        INSERTED.price,
        INSERTED.renewal_notice_days,
        INSERTED.status,
        INSERTED.created_at,
        INSERTED.updated_at
      VALUES (
        @company_id,
        @name,
        @description,
        @duration_days,
        @price,
        @renewal_notice_days,
        @status
      )
    `);

  return mapMembershipPlan(result.recordset[0]);
}

async function updateMembershipPlan(companyId, planId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("plan_id", sql.BigInt, planId)
    .input("name", sql.NVarChar(120), payload.name)
    .input("description", sql.NVarChar(500), payload.description)
    .input("duration_days", sql.Int, payload.durationDays)
    .input("price", sql.Decimal(18, 2), payload.price)
    .input("renewal_notice_days", sql.Int, payload.renewalNoticeDays)
    .input("status", sql.VarChar(20), payload.status).query(`
      UPDATE dbo.MembershipPlans
      SET
        name = @name,
        description = @description,
        duration_days = @duration_days,
        price = @price,
        renewal_notice_days = @renewal_notice_days,
        status = @status,
        updated_at = SYSUTCDATETIME()
      WHERE company_id = @company_id
        AND id = @plan_id
    `);

  if (!result.rowsAffected[0]) {
    throw new ApiError(
      404,
      "MEMBERSHIP_PLAN_NOT_FOUND",
      "Membership plan was not found.",
    );
  }

  return getMembershipPlanById(companyId, planId);
}

async function listMembershipBenefits(companyId, planId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === "all" ? null : filters.status || "active";
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("plan_id", sql.BigInt, planId)
    .input("status", sql.VarChar(20), status).query(`
      SELECT
        benefits.id,
        benefits.membership_plan_id,
        benefits.name,
        benefits.description,
        benefits.benefit_type,
        benefits.applies_to_type,
        benefits.applies_to_name,
        benefits.discount_percent,
        benefits.included_quantity,
        benefits.usage_limit,
        benefits.usage_period,
        benefits.status,
        benefits.created_at,
        benefits.updated_at
      FROM dbo.MembershipBenefits AS benefits
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.id = benefits.membership_plan_id
      WHERE plans.company_id = @company_id
        AND benefits.membership_plan_id = @plan_id
        AND (@status IS NULL OR benefits.status = @status)
      ORDER BY benefits.created_at DESC, benefits.id DESC
    `);

  return {
    status: filters.status || "active",
    items: result.recordset.map(mapMembershipBenefit),
  };
}

async function getMembershipBenefitById(companyId, benefitId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("benefit_id", sql.BigInt, benefitId).query(`
      SELECT
        benefits.id,
        benefits.membership_plan_id,
        benefits.name,
        benefits.description,
        benefits.benefit_type,
        benefits.applies_to_type,
        benefits.applies_to_name,
        benefits.discount_percent,
        benefits.included_quantity,
        benefits.usage_limit,
        benefits.usage_period,
        benefits.status,
        benefits.created_at,
        benefits.updated_at
      FROM dbo.MembershipBenefits AS benefits
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.id = benefits.membership_plan_id
      WHERE plans.company_id = @company_id
        AND benefits.id = @benefit_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(
      404,
      "MEMBERSHIP_BENEFIT_NOT_FOUND",
      "Membership benefit was not found.",
    );
  }

  return mapMembershipBenefit(result.recordset[0]);
}

async function createMembershipBenefit(companyId, planId, payload) {
  await getMembershipPlanById(companyId, planId);

  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("membership_plan_id", sql.BigInt, planId)
    .input("name", sql.NVarChar(120), payload.name)
    .input("description", sql.NVarChar(500), payload.description)
    .input("benefit_type", sql.VarChar(30), payload.benefitType)
    .input("applies_to_type", sql.VarChar(30), payload.appliesToType)
    .input("applies_to_name", sql.NVarChar(160), payload.appliesToName)
    .input("discount_percent", sql.Decimal(5, 2), payload.discountPercent)
    .input("included_quantity", sql.Decimal(18, 2), payload.includedQuantity)
    .input("usage_limit", sql.Int, payload.usageLimit)
    .input("usage_period", sql.VarChar(30), payload.usagePeriod)
    .input("status", sql.VarChar(20), payload.status).query(`
      INSERT INTO dbo.MembershipBenefits (
        company_id,
        membership_plan_id,
        name,
        description,
        benefit_type,
        applies_to_type,
        applies_to_name,
        discount_percent,
        included_quantity,
        usage_limit,
        usage_period,
        status
      )
      OUTPUT
        INSERTED.id,
        INSERTED.membership_plan_id,
        INSERTED.name,
        INSERTED.description,
        INSERTED.benefit_type,
        INSERTED.applies_to_type,
        INSERTED.applies_to_name,
        INSERTED.discount_percent,
        INSERTED.included_quantity,
        INSERTED.usage_limit,
        INSERTED.usage_period,
        INSERTED.status,
        INSERTED.created_at,
        INSERTED.updated_at
      VALUES (
        @company_id,
        @membership_plan_id,
        @name,
        @description,
        @benefit_type,
        @applies_to_type,
        @applies_to_name,
        @discount_percent,
        @included_quantity,
        @usage_limit,
        @usage_period,
        @status
      )
    `);

  return mapMembershipBenefit(result.recordset[0]);
}

async function updateMembershipBenefit(companyId, benefitId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("benefit_id", sql.BigInt, benefitId)
    .input("name", sql.NVarChar(120), payload.name)
    .input("description", sql.NVarChar(500), payload.description)
    .input("benefit_type", sql.VarChar(30), payload.benefitType)
    .input("applies_to_type", sql.VarChar(30), payload.appliesToType)
    .input("applies_to_name", sql.NVarChar(160), payload.appliesToName)
    .input("discount_percent", sql.Decimal(5, 2), payload.discountPercent)
    .input("included_quantity", sql.Decimal(18, 2), payload.includedQuantity)
    .input("usage_limit", sql.Int, payload.usageLimit)
    .input("usage_period", sql.VarChar(30), payload.usagePeriod)
    .input("status", sql.VarChar(20), payload.status).query(`
      UPDATE benefits
      SET
        benefits.name = @name,
        benefits.description = @description,
        benefits.benefit_type = @benefit_type,
        benefits.applies_to_type = @applies_to_type,
        benefits.applies_to_name = @applies_to_name,
        benefits.discount_percent = @discount_percent,
        benefits.included_quantity = @included_quantity,
        benefits.usage_limit = @usage_limit,
        benefits.usage_period = @usage_period,
        benefits.status = @status,
        benefits.updated_at = SYSUTCDATETIME()
      FROM dbo.MembershipBenefits AS benefits
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.id = benefits.membership_plan_id
      WHERE plans.company_id = @company_id
        AND benefits.id = @benefit_id
    `);

  if (!result.rowsAffected[0]) {
    throw new ApiError(
      404,
      "MEMBERSHIP_BENEFIT_NOT_FOUND",
      "Membership benefit was not found.",
    );
  }

  return getMembershipBenefitById(companyId, benefitId);
}

async function getActiveCustomerMembership(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId).query(`
      SELECT TOP (1)
        memberships.id,
        memberships.company_id,
        memberships.customer_id,
        memberships.membership_plan_id,
        plans.name AS plan_name,
        plans.renewal_notice_days,
        memberships.start_date,
        memberships.end_date,
        memberships.status,
        memberships.price_paid,
        memberships.created_at,
        memberships.cancelled_at,
        memberships.cancelled_by_label,
        memberships.cancel_note
      FROM dbo.CustomerMemberships AS memberships
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = memberships.company_id
       AND plans.id = memberships.membership_plan_id
      WHERE memberships.company_id = @company_id
        AND memberships.customer_id = @customer_id
        AND memberships.status = 'active'
      ORDER BY memberships.created_at DESC, memberships.id DESC
    `);

  return result.recordset.length
    ? mapCustomerMembership(result.recordset[0])
    : null;
}

async function getCustomerMembershipById(companyId, customerId, membershipId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId)
    .input("membership_id", sql.BigInt, membershipId).query(`
      SELECT TOP (1)
        memberships.id,
        memberships.company_id,
        memberships.customer_id,
        memberships.membership_plan_id,
        plans.name AS plan_name,
        plans.renewal_notice_days,
        memberships.start_date,
        memberships.end_date,
        memberships.status,
        memberships.price_paid,
        memberships.created_at,
        memberships.cancelled_at,
        memberships.cancelled_by_label,
        memberships.cancel_note
      FROM dbo.CustomerMemberships AS memberships
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = memberships.company_id
       AND plans.id = memberships.membership_plan_id
      WHERE memberships.company_id = @company_id
        AND memberships.customer_id = @customer_id
        AND memberships.id = @membership_id
    `);

  return result.recordset.length
    ? mapCustomerMembership(result.recordset[0])
    : null;
}

async function createCustomerMembership(companyId, customerId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const membershipResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, companyId)
      .input("customer_id", sql.BigInt, customerId)
      .input("membership_plan_id", sql.BigInt, payload.planId)
      .input("start_date", sql.Date, payload.startDate)
      .input("end_date", sql.Date, payload.endDate)
      .input("price_paid", sql.Decimal(18, 2), payload.pricePaid).query(`
        INSERT INTO dbo.CustomerMemberships (
          company_id,
          customer_id,
          membership_plan_id,
          start_date,
          end_date,
          status,
          price_paid
        )
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.customer_id,
          INSERTED.membership_plan_id,
          INSERTED.start_date,
          INSERTED.end_date,
          INSERTED.status,
          INSERTED.price_paid,
          INSERTED.created_at,
          INSERTED.cancelled_at,
          INSERTED.cancelled_by_label,
          INSERTED.cancel_note
        VALUES (
          @company_id,
          @customer_id,
          @membership_plan_id,
          @start_date,
          @end_date,
          'active',
          @price_paid
        )
      `);

    const membershipRow = membershipResult.recordset[0];
    const transactionResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, companyId)
      .input("customer_id", sql.BigInt, customerId)
      .input("customer_membership_id", sql.BigInt, membershipRow.id)
      .input("membership_plan_id", sql.BigInt, payload.planId)
      .input("transaction_type", sql.VarChar(30), "new_membership")
      .input("payment_method", sql.VarChar(30), payload.paymentMethod)
      .input("amount", sql.Decimal(18, 2), payload.pricePaid)
      .input(
        "transaction_date",
        sql.Date,
        payload.transactionDate || new Date(),
      )
      .input("note", sql.NVarChar(500), payload.note)
      .input("created_by_label", sql.NVarChar(160), payload.createdByLabel)
      .query(`
        INSERT INTO dbo.MembershipTransactions (
          company_id,
          customer_id,
          customer_membership_id,
          membership_plan_id,
          transaction_type,
          payment_method,
          amount,
          transaction_date,
          note,
          created_by_label
        )
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.customer_id,
          INSERTED.customer_membership_id,
          INSERTED.membership_plan_id,
          INSERTED.transaction_type,
          INSERTED.payment_method,
          INSERTED.amount,
          INSERTED.transaction_date,
          INSERTED.note,
          INSERTED.created_at,
          INSERTED.created_by_label
        VALUES (
          @company_id,
          @customer_id,
          @customer_membership_id,
          @membership_plan_id,
          @transaction_type,
          @payment_method,
          @amount,
          @transaction_date,
          @note,
          @created_by_label
        )
      `);

    await transaction.commit();

    const membership = mapCustomerMembership({
      ...membershipRow,
      plan_name: payload.planName,
      renewal_notice_days: payload.renewalNoticeDays,
    });
    membership.transaction = mapMembershipTransaction({
      ...transactionResult.recordset[0],
      plan_name: payload.planName,
    });
    return membership;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      // Preserve the original SQL error for API mapping.
    }
    throw error;
  }
}

async function renewCustomerMembership(
  companyId,
  customerId,
  membership,
  plan,
  payload,
  actorLabel,
) {
  const sql = getSql();
  const pool = await getPool();
  const today = parseDateOnly(payload.transactionDate || new Date());
  const currentEndDate = parseDateOnly(membership.endDate);
  const isStillActive =
    membership.status === "active" && currentEndDate >= today;
  const nextStartDate = isStillActive ? addDays(currentEndDate, 1) : today;
  const nextEndDate = addDays(nextStartDate, Number(plan.durationDays) - 1);
  const membershipStartDate = isStillActive
    ? membership.startDate
    : toIsoDate(nextStartDate);
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const membershipResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, companyId)
      .input("customer_id", sql.BigInt, customerId)
      .input("customer_membership_id", sql.BigInt, membership.id)
      .input("start_date", sql.Date, membershipStartDate)
      .input("end_date", sql.Date, toIsoDate(nextEndDate))
      .input("price_paid", sql.Decimal(18, 2), payload.amount).query(`
        UPDATE dbo.CustomerMemberships
        SET
          start_date = @start_date,
          end_date = @end_date,
          status = 'active',
          price_paid = @price_paid
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.customer_id,
          INSERTED.membership_plan_id,
          INSERTED.start_date,
          INSERTED.end_date,
          INSERTED.status,
          INSERTED.price_paid,
          INSERTED.created_at,
          INSERTED.cancelled_at,
          INSERTED.cancelled_by_label,
          INSERTED.cancel_note
        WHERE company_id = @company_id
          AND customer_id = @customer_id
          AND id = @customer_membership_id
          AND status <> 'cancelled'
      `);

    if (!membershipResult.recordset.length) {
      throw new ApiError(
        404,
        "CUSTOMER_MEMBERSHIP_NOT_FOUND",
        "Customer membership was not found.",
      );
    }

    const transactionResult = await new sql.Request(transaction)
      .input("company_id", sql.BigInt, companyId)
      .input("customer_id", sql.BigInt, customerId)
      .input("customer_membership_id", sql.BigInt, membership.id)
      .input("membership_plan_id", sql.BigInt, membership.planId)
      .input("transaction_type", sql.VarChar(30), "renewal")
      .input("payment_method", sql.VarChar(30), payload.paymentMethod)
      .input("amount", sql.Decimal(18, 2), payload.amount)
      .input("transaction_date", sql.Date, payload.transactionDate)
      .input("note", sql.NVarChar(500), payload.note)
      .input("created_by_label", sql.NVarChar(160), actorLabel).query(`
        INSERT INTO dbo.MembershipTransactions (
          company_id,
          customer_id,
          customer_membership_id,
          membership_plan_id,
          transaction_type,
          payment_method,
          amount,
          transaction_date,
          note,
          created_by_label
        )
        OUTPUT
          INSERTED.id,
          INSERTED.company_id,
          INSERTED.customer_id,
          INSERTED.customer_membership_id,
          INSERTED.membership_plan_id,
          INSERTED.transaction_type,
          INSERTED.payment_method,
          INSERTED.amount,
          INSERTED.transaction_date,
          INSERTED.note,
          INSERTED.created_at,
          INSERTED.created_by_label
        VALUES (
          @company_id,
          @customer_id,
          @customer_membership_id,
          @membership_plan_id,
          @transaction_type,
          @payment_method,
          @amount,
          @transaction_date,
          @note,
          @created_by_label
        )
      `);

    await transaction.commit();

    const renewedMembership = mapCustomerMembership({
      ...membershipResult.recordset[0],
      plan_name: plan.name,
      renewal_notice_days: plan.renewalNoticeDays,
    });
    const transactionRow = mapMembershipTransaction({
      ...transactionResult.recordset[0],
      plan_name: plan.name,
    });
    return { membership: renewedMembership, transaction: transactionRow };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      // Preserve the original SQL error for API mapping.
    }
    throw error;
  }
}

async function listCustomerMemberships(companyId, customerId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === "all" ? null : filters.status || "active";
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId)
    .input("status", sql.VarChar(20), status).query(`
      SELECT
        memberships.id,
        memberships.company_id,
        memberships.customer_id,
        memberships.membership_plan_id,
        plans.name AS plan_name,
        plans.renewal_notice_days,
        memberships.start_date,
        memberships.end_date,
        memberships.status,
        memberships.price_paid,
        memberships.created_at,
        memberships.cancelled_at,
        memberships.cancelled_by_label,
        memberships.cancel_note
      FROM dbo.CustomerMemberships AS memberships
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = memberships.company_id
       AND plans.id = memberships.membership_plan_id
      WHERE memberships.company_id = @company_id
        AND memberships.customer_id = @customer_id
        AND (@status IS NULL OR memberships.status = @status)
      ORDER BY memberships.start_date DESC, memberships.created_at DESC, memberships.id DESC
    `);

  return {
    customerId: toApiId(customerId),
    status: filters.status || "active",
    items: result.recordset.map((row) => mapCustomerMembership(row)),
  };
}

async function createMembershipBenefitUsage(
  companyId,
  customerId,
  membership,
  benefit,
  payload,
  actorLabel,
) {
  const sql = getSql();
  const pool = await getPool();
  const usagePeriodStartDate = calculateUsagePeriodStartDate(
    payload.usageDate,
    benefit.usagePeriod,
    membership.startDate,
  );
  const limit = benefit.usageLimit == null ? null : Number(benefit.usageLimit);

  if (limit) {
    const usageResult = await pool
      .request()
      .input("company_id", sql.BigInt, companyId)
      .input("customer_membership_id", sql.BigInt, membership.id)
      .input("membership_benefit_id", sql.BigInt, benefit.id)
      .input("usage_period_start_date", sql.Date, usagePeriodStartDate).query(`
        SELECT COALESCE(SUM(quantity), 0) AS used_quantity
        FROM dbo.MembershipBenefitUsages
        WHERE company_id = @company_id
          AND customer_membership_id = @customer_membership_id
          AND membership_benefit_id = @membership_benefit_id
          AND usage_period_start_date = @usage_period_start_date
      `);

    const usedQuantity = Number(usageResult.recordset[0].used_quantity || 0);
    if (usedQuantity + payload.quantity > limit) {
      throw new ApiError(
        409,
        "MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED",
        "Membership benefit usage limit would be exceeded.",
      );
    }
  }

  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_membership_id", sql.BigInt, membership.id)
    .input("membership_benefit_id", sql.BigInt, benefit.id)
    .input("customer_id", sql.BigInt, customerId)
    .input("usage_date", sql.Date, payload.usageDate)
    .input("usage_period_start_date", sql.Date, usagePeriodStartDate)
    .input("quantity", sql.Int, payload.quantity)
    .input("note", sql.NVarChar(500), payload.note)
    .input("created_by_label", sql.NVarChar(160), actorLabel).query(`
      INSERT INTO dbo.MembershipBenefitUsages (
        company_id,
        customer_membership_id,
        membership_benefit_id,
        customer_id,
        usage_date,
        usage_period_start_date,
        quantity,
        note,
        created_by_label
      )
      OUTPUT
        INSERTED.id,
        INSERTED.company_id,
        INSERTED.customer_membership_id,
        INSERTED.membership_benefit_id,
        INSERTED.customer_id,
        INSERTED.used_at,
        INSERTED.usage_date,
        INSERTED.usage_period_start_date,
        INSERTED.quantity,
        INSERTED.note,
        INSERTED.created_by_label
      VALUES (
        @company_id,
        @customer_membership_id,
        @membership_benefit_id,
        @customer_id,
        @usage_date,
        @usage_period_start_date,
        @quantity,
        @note,
        @created_by_label
      )
    `);

  return mapMembershipBenefitUsage({
    ...result.recordset[0],
    benefit_name: benefit.name,
    benefit_type: benefit.benefitType,
    membership_plan_id: membership.planId,
    plan_name: membership.planName,
  });
}

async function listMembershipBenefitUsages(
  companyId,
  customerId,
  filters = {},
) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId)
    .input("from", sql.Date, filters.from)
    .input("to", sql.Date, filters.to).query(`
      SELECT
        usages.id,
        usages.company_id,
        usages.customer_membership_id,
        usages.membership_benefit_id,
        usages.customer_id,
        usages.used_at,
        usages.usage_date,
        usages.usage_period_start_date,
        usages.quantity,
        usages.note,
        usages.created_by_label,
        benefits.name AS benefit_name,
        benefits.benefit_type,
        plans.id AS membership_plan_id,
        plans.name AS plan_name
      FROM dbo.MembershipBenefitUsages AS usages
      INNER JOIN dbo.MembershipBenefits AS benefits
        ON benefits.id = usages.membership_benefit_id
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.id = benefits.membership_plan_id
       AND plans.company_id = usages.company_id
      WHERE usages.company_id = @company_id
        AND usages.customer_id = @customer_id
        AND usages.usage_date >= @from
        AND usages.usage_date <= @to
      ORDER BY usages.usage_date DESC, usages.used_at DESC, usages.id DESC
    `);

  return {
    customerId: toApiId(customerId),
    from: filters.from,
    to: filters.to,
    items: result.recordset.map(mapMembershipBenefitUsage),
  };
}

async function listMembershipTransactions(companyId, customerId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("customer_id", sql.BigInt, customerId)
    .input("from", sql.Date, filters.from)
    .input("to", sql.Date, filters.to).query(`
      SELECT
        transactions.id,
        transactions.company_id,
        transactions.customer_id,
        transactions.customer_membership_id,
        transactions.membership_plan_id,
        plans.name AS plan_name,
        transactions.transaction_type,
        transactions.payment_method,
        transactions.amount,
        transactions.transaction_date,
        transactions.note,
        transactions.created_at,
        transactions.created_by_label
      FROM dbo.MembershipTransactions AS transactions
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = transactions.company_id
       AND plans.id = transactions.membership_plan_id
      WHERE transactions.company_id = @company_id
        AND transactions.customer_id = @customer_id
        AND transactions.transaction_date >= @from
        AND transactions.transaction_date <= @to
      ORDER BY transactions.transaction_date DESC, transactions.created_at DESC, transactions.id DESC
    `);

  return {
    customerId: toApiId(customerId),
    from: filters.from,
    to: filters.to,
    items: result.recordset.map(mapMembershipTransaction),
  };
}

async function getMembershipFinancialReport(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("from", sql.Date, filters.from)
    .input("to", sql.Date, filters.to).query(`
      SELECT
        transactions.id,
        transactions.customer_id,
        customers.name AS customer_name,
        customers.phone AS customer_phone,
        customers.email AS customer_email,
        transactions.customer_membership_id,
        transactions.membership_plan_id,
        plans.name AS plan_name,
        transactions.transaction_type,
        transactions.payment_method,
        transactions.amount,
        transactions.transaction_date,
        transactions.created_at,
        transactions.note
      FROM dbo.MembershipTransactions AS transactions
      INNER JOIN dbo.Customers AS customers
        ON customers.company_id = transactions.company_id
       AND customers.id = transactions.customer_id
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = transactions.company_id
       AND plans.id = transactions.membership_plan_id
      WHERE transactions.company_id = @company_id
        AND transactions.transaction_date >= @from
        AND transactions.transaction_date <= @to
        AND transactions.transaction_type IN ('new_membership', 'renewal')
      ORDER BY transactions.transaction_date DESC, transactions.created_at DESC, transactions.id DESC
    `);

  const items = result.recordset.map(mapMembershipFinancialReportTransaction);
  const newMemberships = items.filter(
    (item) => item.transactionType === "new_membership",
  );
  const renewals = items.filter((item) => item.transactionType === "renewal");
  const paymentMethods = items.reduce((summary, item) => {
    const current = summary[item.paymentMethod] || {
      paymentMethod: item.paymentMethod,
      count: 0,
      amount: 0,
    };
    current.count += 1;
    current.amount += item.amount;
    summary[item.paymentMethod] = current;
    return summary;
  }, {});

  return {
    from: filters.from,
    to: filters.to,
    summary: {
      newMembershipCount: newMemberships.length,
      newMembershipAmount: newMemberships.reduce(
        (total, item) => total + item.amount,
        0,
      ),
      renewalCount: renewals.length,
      renewalAmount: renewals.reduce((total, item) => total + item.amount, 0),
      paymentMethods,
    },
    items,
  };
}

async function listMembershipExpirationAlerts(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status || "active";
  const withinDays = Number.isInteger(filters.withinDays)
    ? filters.withinDays
    : 5;
  const result = await pool
    .request()
    .input("company_id", sql.BigInt, companyId)
    .input("status", sql.VarChar(20), status)
    .input("within_days", sql.Int, withinDays).query(`
      DECLARE @today date = CONVERT(date, SYSUTCDATETIME());

      SELECT
        memberships.id,
        memberships.company_id,
        memberships.customer_id,
        memberships.membership_plan_id,
        customers.name AS customer_name,
        customers.phone AS customer_phone,
        customers.email AS customer_email,
        plans.name AS plan_name,
        memberships.start_date,
        memberships.end_date,
        memberships.status,
        @today AS today_date
      FROM dbo.CustomerMemberships AS memberships
      INNER JOIN dbo.Customers AS customers
        ON customers.company_id = memberships.company_id
       AND customers.id = memberships.customer_id
      INNER JOIN dbo.MembershipPlans AS plans
        ON plans.company_id = memberships.company_id
       AND plans.id = memberships.membership_plan_id
      WHERE memberships.company_id = @company_id
        AND (
          (
            @status = 'active'
            AND memberships.status = 'active'
            AND memberships.end_date >= @today
            AND memberships.end_date <= DATEADD(day, @within_days, @today)
          )
          OR (
            @status = 'expired'
            AND (
              memberships.status = 'expired'
              OR (memberships.status = 'active' AND memberships.end_date < @today)
            )
          )
          OR (
            @status = 'cancelled'
            AND memberships.status = 'cancelled'
          )
        )
      ORDER BY memberships.end_date ASC, memberships.id ASC
    `);

  return {
    withinDays,
    status,
    items: result.recordset.map((row) =>
      mapMembershipExpirationAlert(row, {
        today: row.today_date,
        withinDays,
      }),
    ),
  };
}

module.exports = {
  acceptCompanyInvitationWithPassword,
  approveCompanyRegistrationRequest,
  calculateExpirationAlert,
  calculateMembershipEndDate,
  calculateUsagePeriodStartDate,
  clearAuthAttemptLimit,
  createCompanySession,
  createCompanyInvitation,
  createCompanyPasswordReset,
  createCompanyRegistrationRequest,
  createCustomer,
  createCustomerMembership,
  createMembershipBenefitUsage,
  createMembershipBenefit,
  createMembershipPlan,
  createOperationalEmailEventIfNeeded,
  createOperationalEmailMessage,
  createPromotionalCampaign,
  createPurchase,
  createRedemption,
  customerExists,
  ensureActiveCompany,
  getActivity,
  getActivityReport,
  getAuthAttemptLimit,
  getAuthIdentityBySessionTokenHash,
  getBalance,
  getCompanyInvitationById,
  getCompanyInvitationByTokenHash,
  getCompanyPasswordResetByTokenHash,
  getLocalPasswordUserById,
  getCompanyLogoMetadata,
  getCompanyRegistrationRequestLogoMetadata,
  getCompanySettings,
  getCustomerReport,
  getCustomerById,
  getOperationalEmailSettings,
  getPromotionalCampaignById,
  getLocalPasswordUserByEmail,
  getMembershipFinancialReport,
  getActiveCustomerMembership,
  getCustomerMembershipById,
  getMembershipBenefitById,
  getMembershipPlanById,
  listCustomerMemberships,
  listMembershipBenefitUsages,
  listMembershipBenefits,
  listMembershipExpirationAlerts,
  listMembershipTransactions,
  listMembershipPlans,
  listPromotionalCampaignRecipients,
  listPromotionalCampaigns,
  listPromotionalRecipients,
  listCustomers,
  listCompanyRegistrationRequests,
  mapCompanyInvitation,
  mapCompanyInvitationWithCompany,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
  mapCompanyPasswordReset,
  mapCompanyUser,
  mapMembershipBenefit,
  mapMembershipBenefitUsage,
  mapCustomerMembership,
  mapMembershipExpirationAlert,
  mapMembershipFinancialReportTransaction,
  mapMembershipTransaction,
  mapMembershipPlan,
  mapMyCompany,
  recordAuthAttemptFailure,
  recordOperationalEmailAttempt,
  rejectCompanyRegistrationRequest,
  revokeCompanySession,
  completeCompanyPasswordReset,
  rotateCompanyInvitationToken,
  renewCustomerMembership,
  toApiId,
  toIsoTimestamp,
  unsubscribePromotionalCustomer,
  updateCompanyLogo,
  updateCompanyRegistrationRequestLogo,
  updateCompanySettings,
  updateCompanyUserPassword,
  updateOperationalEmailSettings,
  updatePromotionalCampaignPreviewAt,
  updateMembershipBenefit,
  updateMembershipPlan,
};
