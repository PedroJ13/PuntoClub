const { ApiError } = require('./errors');
const { getFailedAttemptUpdate } = require('./authRateLimit');
const { getPool, getSql } = require('./db');

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
    updatedAt: toIsoTimestamp(row.updated_at)
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
    updatedAt: toIsoTimestamp(row.updated_at)
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
      contentType: requestedLogoAvailable ? row.requested_logo_content_type : null
    },
    status: row.status,
    reviewedAt: toIsoTimestamp(row.reviewed_at),
    reviewedByLabel: row.reviewed_by_label,
    reviewNote: row.review_note,
    approvedCompanyId: toApiId(row.approved_company_id),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
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
    createdByLabel: row.created_by_label
  };
}

function mapCompanyInvitationWithCompany(row) {
  return {
    ...mapCompanyInvitation(row),
    companyName: row.company_name || null
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
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapAuthIdentity(row) {
  return {
    user: mapCompanyUser(row),
    company: {
      id: toApiId(row.company_id),
      name: row.company_name,
      status: row.company_status
    }
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
    updatedAt: row.updated_at
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
    logoUrl: hasLogo ? '/api/my-company/logo' : null,
    logoContentType: row.logo_content_type,
    logoUpdatedAt: toIsoTimestamp(row.logo_updated_at),
    pointsPercentage: Number(row.points_percentage),
    loyaltyPointsEnabled: Boolean(row.loyalty_points_enabled),
    loyaltyMembershipsEnabled: Boolean(row.loyalty_memberships_enabled),
    status: row.status,
    updatedAt: toIsoTimestamp(row.updated_at)
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
    updatedAt: toIsoTimestamp(row.updated_at)
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
    discountPercent: row.discount_percent == null ? null : Number(row.discount_percent),
    includedQuantity: row.included_quantity == null ? null : Number(row.included_quantity),
    usageLimit: row.usage_limit,
    usagePeriod: row.usage_period,
    status: row.status,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
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
  const warningDays = Number.isInteger(options.warningDays) ? options.warningDays : 5;
  const daysUntilExpiration = Math.round((expirationDate.getTime() - today.getTime()) / 86400000);
  let state = 'none';
  let message = null;

  if (daysUntilExpiration < 0) {
    state = 'expired';
    message = 'La membresia esta vencida.';
  } else if (daysUntilExpiration === 0) {
    state = 'expires_today';
    message = 'La membresia vence hoy.';
  } else if (daysUntilExpiration <= warningDays) {
    state = 'expiring_soon';
    message = `La membresia vence en ${daysUntilExpiration} dias.`;
  }

  return {
    state,
    daysUntilExpiration,
    message
  };
}

function calculateUsagePeriodStartDate(usageDate, usagePeriod, membershipStartDate) {
  if (usagePeriod === 'membership_term') {
    return toIsoDate(membershipStartDate);
  }

  const date = parseDateOnly(usageDate);
  if (!date) {
    return usageDate;
  }

  if (usagePeriod === 'week') {
    const day = date.getUTCDay();
    const offset = day === 0 ? -6 : 1 - day;
    return toIsoDate(addDays(date, offset));
  }

  if (usagePeriod === 'month') {
    return `${toIsoDate(date).slice(0, 8)}01`;
  }

  return toIsoDate(date);
}

function mapCustomerMembership(row, options = {}) {
  const plan = {
    id: toApiId(row.membership_plan_id),
    name: row.plan_name
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
      warningDays: row.renewal_notice_days == null ? 5 : Number(row.renewal_notice_days)
    }),
    createdAt: toIsoTimestamp(row.created_at),
    cancelledAt: toIsoTimestamp(row.cancelled_at),
    cancelledByLabel: row.cancelled_by_label || null,
    cancelNote: row.cancel_note || null
  };
}

function mapMembershipExpirationAlert(row, options = {}) {
  const expirationAlert = calculateExpirationAlert(row.end_date, {
    today: options.today,
    warningDays: options.withinDays
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
    message: expirationAlert.message
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
    createdByLabel: row.created_by_label || null
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
    createdByLabel: row.created_by_label || null
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
    note: row.note || null
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
      created_by_label: row.invitation_created_by_label
    });
  }

  return registrationRequest;
}

async function ensureActiveCompany(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .query(`
      SELECT id, points_percentage
      FROM dbo.Companies
      WHERE id = @company_id
        AND status = 'active'
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  return result.recordset[0];
}

async function getAuthAttemptLimit(scope, subjectHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('scope', sql.VarChar(40), scope)
    .input('subject_hash', sql.VarBinary(32), subjectHash)
    .query(`
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

async function recordAuthAttemptFailure(scope, subjectHash, policy, now = new Date()) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const request = new sql.Request(transaction);
    const result = await request
      .input('scope', sql.VarChar(40), scope)
      .input('subject_hash', sql.VarBinary(32), subjectHash)
      .query(`
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

    const next = getFailedAttemptUpdate(mapAuthAttemptLimit(result.recordset[0]), policy, now);

    if (result.recordset.length) {
      await new sql.Request(transaction)
        .input('scope', sql.VarChar(40), scope)
        .input('subject_hash', sql.VarBinary(32), subjectHash)
        .input('window_started_at', sql.DateTime2, next.windowStartedAt)
        .input('failed_count', sql.Int, next.failedCount)
        .input('locked_until', sql.DateTime2, next.lockedUntil)
        .input('last_failed_at', sql.DateTime2, next.lastFailedAt)
        .query(`
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
        .input('scope', sql.VarChar(40), scope)
        .input('subject_hash', sql.VarBinary(32), subjectHash)
        .input('window_started_at', sql.DateTime2, next.windowStartedAt)
        .input('failed_count', sql.Int, next.failedCount)
        .input('locked_until', sql.DateTime2, next.lockedUntil)
        .input('last_failed_at', sql.DateTime2, next.lastFailedAt)
        .query(`
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
  await pool.request()
    .input('scope', sql.VarChar(40), scope)
    .input('subject_hash', sql.VarBinary(32), subjectHash)
    .query(`
      DELETE FROM dbo.AuthAttemptLimits
      WHERE scope = @scope
        AND subject_hash = @subject_hash
    `);
}

async function getCompanySettings(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
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
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  const row = result.recordset[0];
  return mapCompanySettings(row);
}

async function updateCompanySettings(companyId, settings) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('name', sql.NVarChar(160), settings.name)
    .input('email', sql.NVarChar(254), settings.email)
    .input('phone', sql.NVarChar(32), settings.phone)
    .input('logo_url', sql.NVarChar(2048), settings.logoUrl)
    .input('points_percentage', sql.Decimal(5, 2), settings.pointsPercentage)
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
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  return mapCompanySettings(result.recordset[0]);
}

async function updateCompanyLogo(companyId, logo) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('logo_blob_path', sql.NVarChar(500), logo.blobPath)
    .input('logo_content_type', sql.VarChar(80), logo.contentType)
    .query(`
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
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  return mapMyCompany(result.recordset[0]);
}

async function listCompanyRegistrationRequests(filters) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === 'all' ? null : filters.status;
  const result = await pool.request()
    .input('status', sql.VarChar(30), status)
    .input('limit', sql.Int, filters.limit)
    .query(`
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
    items: result.recordset.map(mapCompanyRegistrationRequestWithInvitation)
  };
}

async function getCompanyLogoMetadata(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
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
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  const row = result.recordset[0];
  if (!row.logo_blob_path) {
    throw new ApiError(404, 'COMPANY_LOGO_NOT_FOUND', 'Company logo was not found.');
  }

  return {
    blobPath: row.logo_blob_path,
    contentType: row.logo_content_type,
    updatedAt: toIsoTimestamp(row.logo_updated_at)
  };
}

async function createCompanyRegistrationRequest(payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_name', sql.NVarChar(160), payload.companyName)
    .input('company_email', sql.NVarChar(254), payload.companyEmail)
    .input('company_phone', sql.NVarChar(32), payload.companyPhone)
    .input('company_address', sql.NVarChar(300), payload.companyAddress)
    .input('contact_name', sql.NVarChar(160), payload.contactName)
    .input('contact_email', sql.NVarChar(254), payload.contactEmail)
    .input('contact_phone', sql.NVarChar(32), payload.contactPhone)
    .query(`
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
  const result = await pool.request()
    .input('request_id', sql.BigInt, requestId)
    .input('requested_logo_blob_path', sql.NVarChar(512), logo.blobPath)
    .input('requested_logo_content_type', sql.NVarChar(100), logo.contentType)
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
    throw new ApiError(404, 'COMPANY_REGISTRATION_REQUEST_NOT_FOUND', 'Company registration request was not found.');
  }

  return mapCompanyRegistrationRequest(result.recordset[0]);
}

async function getCompanyRegistrationRequestLogoMetadata(requestId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('request_id', sql.BigInt, requestId)
    .query(`
      SELECT
        id,
        requested_logo_blob_path,
        requested_logo_content_type
      FROM dbo.CompanyRegistrationRequests
      WHERE id = @request_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, 'COMPANY_REGISTRATION_REQUEST_NOT_FOUND', 'Company registration request was not found.');
  }

  const row = result.recordset[0];
  if (!row.requested_logo_blob_path) {
    throw new ApiError(404, 'COMPANY_REGISTRATION_LOGO_NOT_FOUND', 'Company registration request logo was not found.');
  }

  return {
    blobPath: row.requested_logo_blob_path,
    contentType: row.requested_logo_content_type
  };
}

async function approveCompanyRegistrationRequest(requestId, payload, options = {}) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  const actorLabel = options.actorLabel || 'internal';
  const pointsPercentage = payload.pointsPercentage == null ? 5 : payload.pointsPercentage;
  const invitation = options.invitation || null;

  await transaction.begin();

  try {
    const requestResult = await new sql.Request(transaction)
      .input('request_id', sql.BigInt, requestId)
      .query(`
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
      throw new ApiError(404, 'COMPANY_REGISTRATION_REQUEST_NOT_FOUND', 'Company registration request was not found.');
    }

    const request = requestResult.recordset[0];
    const companyResult = await new sql.Request(transaction)
      .input('name', sql.NVarChar(160), request.company_name)
      .input('email', sql.NVarChar(254), request.company_email)
      .input('phone', sql.NVarChar(32), request.company_phone)
      .input('address', sql.NVarChar(300), request.company_address)
      .input('logo_blob_path', sql.NVarChar(512), request.requested_logo_blob_path)
      .input('logo_content_type', sql.NVarChar(100), request.requested_logo_content_type)
      .input('points_percentage', sql.Decimal(5, 2), pointsPercentage)
      .query(`
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
      .input('request_id', sql.BigInt, requestId)
      .input('reviewed_by_label', sql.NVarChar(120), actorLabel)
      .input('review_note', sql.NVarChar(500), payload.reviewNote)
      .input('approved_company_id', sql.BigInt, companyResult.recordset[0].id)
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
        .input('company_id', sql.BigInt, companyResult.recordset[0].id)
        .input('registration_request_id', sql.BigInt, requestId)
        .input('email', sql.NVarChar(254), request.company_email)
        .input('token_hash', sql.VarBinary(32), invitation.tokenHash)
        .input('role', sql.VarChar(30), 'owner')
        .input('expires_at', sql.DateTime2, invitation.expiresAt)
        .input('created_by_label', sql.NVarChar(120), actorLabel)
        .query(`
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
        logoUrl: company.logo_blob_path ? '/api/my-company/logo' : null,
        logoContentType: company.logo_content_type,
        logoUpdatedAt: toIsoTimestamp(company.logo_updated_at),
        status: company.status,
        pointsPercentage: Number(company.points_percentage)
      }
    };

    if (invitationResult) {
      approvedRequest.invitation = {
        ...mapCompanyInvitation(invitationResult.recordset[0]),
        companyName: company.name
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

async function rejectCompanyRegistrationRequest(requestId, payload, options = {}) {
  const sql = getSql();
  const pool = await getPool();
  const actorLabel = options.actorLabel || 'internal';
  const result = await pool.request()
    .input('request_id', sql.BigInt, requestId)
    .input('reviewed_by_label', sql.NVarChar(120), actorLabel)
    .input('review_note', sql.NVarChar(500), payload.reviewNote)
    .query(`
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
    throw new ApiError(404, 'COMPANY_REGISTRATION_REQUEST_NOT_FOUND', 'Company registration request was not found.');
  }

  return mapCompanyRegistrationRequest(result.recordset[0]);
}

async function getInvitationCompany(companyId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .query(`
      SELECT id, name
      FROM dbo.Companies
      WHERE id = @company_id
        AND status IN ('pending_activation', 'active')
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  return result.recordset[0];
}

async function ensureRegistrationRequestBelongsToCompany(registrationRequestId, companyId) {
  if (registrationRequestId == null) {
    return;
  }

  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('registration_request_id', sql.BigInt, registrationRequestId)
    .input('company_id', sql.BigInt, companyId)
    .query(`
      SELECT 1 AS exists_flag
      FROM dbo.CompanyRegistrationRequests
      WHERE id = @registration_request_id
        AND approved_company_id = @company_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'One or more fields are invalid.', [
      { field: 'registrationRequestId', message: 'registrationRequestId must belong to the company.' }
    ]);
  }
}

async function createCompanyInvitation(payload, tokenHash, expiresAt, options = {}) {
  const sql = getSql();
  const pool = await getPool();
  const actorLabel = options.actorLabel || 'internal';
  const company = await getInvitationCompany(payload.companyId);
  await ensureRegistrationRequestBelongsToCompany(payload.registrationRequestId, payload.companyId);

  const result = await pool.request()
    .input('company_id', sql.BigInt, payload.companyId)
    .input('registration_request_id', sql.BigInt, payload.registrationRequestId)
    .input('email', sql.NVarChar(254), payload.email)
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .input('role', sql.VarChar(30), payload.role)
    .input('expires_at', sql.DateTime2, expiresAt)
    .input('created_by_label', sql.NVarChar(120), actorLabel)
    .query(`
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
    companyName: company.name
  };
}

async function getCompanyInvitationByTokenHash(tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .query(`
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

  return result.recordset.length ? mapCompanyInvitationWithCompany(result.recordset[0]) : null;
}

async function getCompanyInvitationById(invitationId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('invitation_id', sql.BigInt, invitationId)
    .query(`
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

  return result.recordset.length ? mapCompanyInvitationWithCompany(result.recordset[0]) : null;
}

async function rotateCompanyInvitationToken(invitationId, tokenHash) {
  const sql = getSql();
  const pool = await getPool();
  const currentResult = await pool.request()
    .input('invitation_id', sql.BigInt, invitationId)
    .query(`
      SELECT TOP (1)
        invitations.id,
        invitations.status,
        invitations.expires_at
      FROM dbo.CompanyInvitations AS invitations
      WHERE invitations.id = @invitation_id
    `);

  if (!currentResult.recordset.length) {
    throw new ApiError(404, 'INVITATION_NOT_FOUND', 'Company invitation was not found.');
  }

  const current = currentResult.recordset[0];
  if (current.status === 'accepted') {
    throw new ApiError(409, 'INVITATION_ALREADY_ACCEPTED', 'Company invitation was already accepted.');
  }

  if (current.status !== 'pending') {
    throw new ApiError(404, 'INVITATION_NOT_FOUND', 'Company invitation was not found.');
  }

  if (current.expires_at < new Date()) {
    throw new ApiError(409, 'INVITATION_EXPIRED', 'Company invitation is expired.');
  }

  const result = await pool.request()
    .input('invitation_id', sql.BigInt, invitationId)
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .query(`
      UPDATE invitations
      SET token_hash = @token_hash
      FROM dbo.CompanyInvitations AS invitations
      WHERE invitations.id = @invitation_id
        AND invitations.status = 'pending'
        AND invitations.expires_at >= SYSUTCDATETIME()
    `);

  if (!result.rowsAffected || !result.rowsAffected[0]) {
    throw new ApiError(409, 'INVITATION_EXPIRED', 'Company invitation is expired.');
  }

  return getCompanyInvitationById(invitationId);
}

async function acceptCompanyInvitationWithPassword(tokenHash, payload, passwordCredentials) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const invitationResult = await new sql.Request(transaction)
      .input('token_hash', sql.VarBinary(32), tokenHash)
      .query(`
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
      throw new ApiError(404, 'INVITATION_NOT_FOUND', 'Company invitation was not found.');
    }

    const invitation = invitationResult.recordset[0];
    if (invitation.status === 'accepted') {
      throw new ApiError(409, 'INVITATION_ALREADY_ACCEPTED', 'Company invitation was already accepted.');
    }

    if (invitation.status !== 'pending') {
      throw new ApiError(404, 'INVITATION_NOT_FOUND', 'Company invitation was not found.');
    }

    if (invitation.expires_at < new Date()) {
      throw new ApiError(409, 'INVITATION_EXPIRED', 'Company invitation is expired.');
    }

    if (!['pending_activation', 'active'].includes(invitation.company_status)) {
      throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
    }

    const userResult = await new sql.Request(transaction)
      .input('company_id', sql.BigInt, invitation.company_id)
      .input('email', sql.NVarChar(254), invitation.email)
      .input('display_name', sql.NVarChar(160), payload.displayName)
      .input('role', sql.VarChar(30), invitation.role)
      .input('password_hash', sql.NVarChar(512), passwordCredentials.passwordHash)
      .input('password_algorithm', sql.VarChar(40), passwordCredentials.passwordAlgorithm)
      .input('password_params', sql.NVarChar(300), passwordCredentials.passwordParams)
      .query(`
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

    await new sql.Request(transaction)
      .input('invitation_id', sql.BigInt, invitation.id)
      .query(`
        UPDATE dbo.CompanyInvitations
        SET
          status = 'accepted',
          accepted_at = SYSUTCDATETIME()
        WHERE id = @invitation_id
          AND status = 'pending'
      `);

    let companyStatus = invitation.company_status;
    if (invitation.role === 'owner' && invitation.company_status === 'pending_activation') {
      const companyResult = await new sql.Request(transaction)
        .input('company_id', sql.BigInt, invitation.company_id)
        .query(`
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
        status: companyStatus
      },
      invitation: {
        id: toApiId(invitation.id),
        companyId: toApiId(invitation.company_id),
        role: invitation.role
      }
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
  const result = await pool.request()
    .input('email', sql.NVarChar(254), email)
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

async function createCompanySession(companyId, companyUserId, tokenHash, expiresAt) {
  const sql = getSql();
  const pool = await getPool();
  await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('company_user_id', sql.BigInt, companyUserId)
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .input('expires_at', sql.DateTime2, expiresAt)
    .query(`
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

  await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('company_user_id', sql.BigInt, companyUserId)
    .query(`
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
  const result = await pool.request()
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .query(`
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
    throw new ApiError(401, 'UNAUTHORIZED', 'Authentication is required.');
  }

  const row = result.recordset[0];
  if (row.status !== 'active' || row.company_status !== 'active') {
    throw new ApiError(403, 'FORBIDDEN', 'Company user is not allowed to operate.');
  }

  await pool.request()
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .query(`
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
  await pool.request()
    .input('token_hash', sql.VarBinary(32), tokenHash)
    .query(`
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
  const normalizedSearch = typeof search === 'string' ? search.trim() : '';
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('search', sql.NVarChar(254), normalizedSearch || null)
    .input('search_like', sql.NVarChar(260), normalizedSearch ? `%${normalizedSearch}%` : null)
    .query(`
      SELECT TOP (50) id, name, phone, email, created_at, updated_at
      FROM dbo.Customers
      WHERE company_id = @company_id
        AND (
          @search IS NULL
          OR phone = @search
          OR email = @search
          OR name LIKE @search_like
        )
      ORDER BY name ASC, id ASC
    `);

  return result.recordset.map(mapCustomer);
}

async function createCustomer(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('name', sql.NVarChar(160), payload.name)
    .input('phone', sql.NVarChar(32), payload.phone)
    .input('email', sql.NVarChar(254), payload.email)
    .query(`
      INSERT INTO dbo.Customers (company_id, name, phone, email)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.phone, INSERTED.email, INSERTED.created_at, INSERTED.updated_at
      VALUES (@company_id, @name, @phone, @email)
    `);

  return mapCustomer(result.recordset[0]);
}

async function getCustomerById(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .query(`
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
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .query(`
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
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, payload.customerId)
    .input('invoice_number', sql.NVarChar(80), payload.invoiceNumber)
    .input('purchase_date', sql.Date, payload.purchaseDate)
    .input('amount', sql.Decimal(18, 2), payload.amount)
    .input('points_earned', sql.Int, pointsEarned)
    .query(`
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
    createdAt: toIsoTimestamp(row.created_at)
  };
}

async function getBalance(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .query(`
      SELECT customer_id, points_earned, points_redeemed, points_balance
      FROM dbo.CustomerPointBalances
      WHERE company_id = @company_id
        AND customer_id = @customer_id
    `);

  if (!result.recordset.length) {
    throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
  }

  const row = result.recordset[0];
  return {
    customerId: toApiId(row.customer_id),
    pointsEarned: row.points_earned,
    pointsRedeemed: row.points_redeemed,
    pointsBalance: row.points_balance
  };
}

async function getActivity(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .query(`
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
    points: row.points
  }));
}

async function getActivityReport(companyId, filters) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('from', sql.Date, filters.from)
    .input('to', sql.Date, filters.to)
    .input('type', sql.VarChar(20), filters.type)
    .query(`
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
    points: row.points
  }));

  const activeCustomerIds = new Set(items.map((item) => item.customerId));
  const purchases = items.filter((item) => item.type === 'purchase');
  const redemptions = items.filter((item) => item.type === 'redemption');
  const memberships = items.filter((item) => item.type === 'membership');

  return {
    from: filters.from,
    to: filters.to,
    type: filters.type,
    summary: {
      purchaseCount: purchases.length,
      purchaseAmountTotal: purchases.reduce((total, item) => total + (item.amount || 0), 0),
      pointsEarnedTotal: purchases.reduce((total, item) => total + item.points, 0),
      redemptionCount: redemptions.length,
      pointsRedeemedTotal: redemptions.reduce((total, item) => total + Math.abs(item.points), 0),
      membershipCount: memberships.length,
      activeCustomerCount: activeCustomerIds.size
    },
    items
  };
}

async function createRedemption(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, payload.customerId)
    .input('redemption_date', sql.Date, payload.redemptionDate)
    .input('points_redeemed', sql.Int, payload.pointsRedeemed)
    .input('note', sql.NVarChar(500), payload.note)
    .execute('dbo.RegisterRedemption');

  const balance = await getBalance(companyId, payload.customerId);
  const latestResult = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, payload.customerId)
    .input('redemption_date', sql.Date, payload.redemptionDate)
    .input('points_redeemed', sql.Int, payload.pointsRedeemed)
    .query(`
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
    balanceAfter: balance.pointsBalance
  };
}

async function listMembershipPlans(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === 'all' ? null : (filters.status || 'active');
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('status', sql.VarChar(20), status)
    .query(`
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
    status: filters.status || 'active',
    items: result.recordset.map(mapMembershipPlan)
  };
}

async function getMembershipPlanById(companyId, planId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('plan_id', sql.BigInt, planId)
    .query(`
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
    throw new ApiError(404, 'MEMBERSHIP_PLAN_NOT_FOUND', 'Membership plan was not found.');
  }

  return mapMembershipPlan(result.recordset[0]);
}

async function createMembershipPlan(companyId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('name', sql.NVarChar(120), payload.name)
    .input('description', sql.NVarChar(500), payload.description)
    .input('duration_days', sql.Int, payload.durationDays)
    .input('price', sql.Decimal(18, 2), payload.price)
    .input('renewal_notice_days', sql.Int, payload.renewalNoticeDays)
    .input('status', sql.VarChar(20), payload.status)
    .query(`
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
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('plan_id', sql.BigInt, planId)
    .input('name', sql.NVarChar(120), payload.name)
    .input('description', sql.NVarChar(500), payload.description)
    .input('duration_days', sql.Int, payload.durationDays)
    .input('price', sql.Decimal(18, 2), payload.price)
    .input('renewal_notice_days', sql.Int, payload.renewalNoticeDays)
    .input('status', sql.VarChar(20), payload.status)
    .query(`
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
    throw new ApiError(404, 'MEMBERSHIP_PLAN_NOT_FOUND', 'Membership plan was not found.');
  }

  return getMembershipPlanById(companyId, planId);
}

async function listMembershipBenefits(companyId, planId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status === 'all' ? null : (filters.status || 'active');
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('plan_id', sql.BigInt, planId)
    .input('status', sql.VarChar(20), status)
    .query(`
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
    status: filters.status || 'active',
    items: result.recordset.map(mapMembershipBenefit)
  };
}

async function getMembershipBenefitById(companyId, benefitId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('benefit_id', sql.BigInt, benefitId)
    .query(`
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
    throw new ApiError(404, 'MEMBERSHIP_BENEFIT_NOT_FOUND', 'Membership benefit was not found.');
  }

  return mapMembershipBenefit(result.recordset[0]);
}

async function createMembershipBenefit(companyId, planId, payload) {
  await getMembershipPlanById(companyId, planId);

  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('membership_plan_id', sql.BigInt, planId)
    .input('name', sql.NVarChar(120), payload.name)
    .input('description', sql.NVarChar(500), payload.description)
    .input('benefit_type', sql.VarChar(30), payload.benefitType)
    .input('applies_to_type', sql.VarChar(30), payload.appliesToType)
    .input('applies_to_name', sql.NVarChar(160), payload.appliesToName)
    .input('discount_percent', sql.Decimal(5, 2), payload.discountPercent)
    .input('included_quantity', sql.Decimal(18, 2), payload.includedQuantity)
    .input('usage_limit', sql.Int, payload.usageLimit)
    .input('usage_period', sql.VarChar(30), payload.usagePeriod)
    .input('status', sql.VarChar(20), payload.status)
    .query(`
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
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('benefit_id', sql.BigInt, benefitId)
    .input('name', sql.NVarChar(120), payload.name)
    .input('description', sql.NVarChar(500), payload.description)
    .input('benefit_type', sql.VarChar(30), payload.benefitType)
    .input('applies_to_type', sql.VarChar(30), payload.appliesToType)
    .input('applies_to_name', sql.NVarChar(160), payload.appliesToName)
    .input('discount_percent', sql.Decimal(5, 2), payload.discountPercent)
    .input('included_quantity', sql.Decimal(18, 2), payload.includedQuantity)
    .input('usage_limit', sql.Int, payload.usageLimit)
    .input('usage_period', sql.VarChar(30), payload.usagePeriod)
    .input('status', sql.VarChar(20), payload.status)
    .query(`
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
    throw new ApiError(404, 'MEMBERSHIP_BENEFIT_NOT_FOUND', 'Membership benefit was not found.');
  }

  return getMembershipBenefitById(companyId, benefitId);
}

async function getActiveCustomerMembership(companyId, customerId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .query(`
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

  return result.recordset.length ? mapCustomerMembership(result.recordset[0]) : null;
}

async function getCustomerMembershipById(companyId, customerId, membershipId) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .input('membership_id', sql.BigInt, membershipId)
    .query(`
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

  return result.recordset.length ? mapCustomerMembership(result.recordset[0]) : null;
}

async function createCustomerMembership(companyId, customerId, payload) {
  const sql = getSql();
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const membershipResult = await new sql.Request(transaction)
      .input('company_id', sql.BigInt, companyId)
      .input('customer_id', sql.BigInt, customerId)
      .input('membership_plan_id', sql.BigInt, payload.planId)
      .input('start_date', sql.Date, payload.startDate)
      .input('end_date', sql.Date, payload.endDate)
      .input('price_paid', sql.Decimal(18, 2), payload.pricePaid)
      .query(`
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
      .input('company_id', sql.BigInt, companyId)
      .input('customer_id', sql.BigInt, customerId)
      .input('customer_membership_id', sql.BigInt, membershipRow.id)
      .input('membership_plan_id', sql.BigInt, payload.planId)
      .input('transaction_type', sql.VarChar(30), 'new_membership')
      .input('payment_method', sql.VarChar(30), payload.paymentMethod)
      .input('amount', sql.Decimal(18, 2), payload.pricePaid)
      .input('transaction_date', sql.Date, payload.transactionDate || new Date())
      .input('note', sql.NVarChar(500), payload.note)
      .input('created_by_label', sql.NVarChar(160), payload.createdByLabel)
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
      renewal_notice_days: payload.renewalNoticeDays
    });
    membership.transaction = mapMembershipTransaction({
      ...transactionResult.recordset[0],
      plan_name: payload.planName
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

async function renewCustomerMembership(companyId, customerId, membership, plan, payload, actorLabel) {
  const sql = getSql();
  const pool = await getPool();
  const today = parseDateOnly(payload.transactionDate || new Date());
  const currentEndDate = parseDateOnly(membership.endDate);
  const isStillActive = membership.status === 'active' && currentEndDate >= today;
  const nextStartDate = isStillActive ? addDays(currentEndDate, 1) : today;
  const nextEndDate = addDays(nextStartDate, Number(plan.durationDays) - 1);
  const membershipStartDate = isStillActive ? membership.startDate : toIsoDate(nextStartDate);
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const membershipResult = await new sql.Request(transaction)
      .input('company_id', sql.BigInt, companyId)
      .input('customer_id', sql.BigInt, customerId)
      .input('customer_membership_id', sql.BigInt, membership.id)
      .input('start_date', sql.Date, membershipStartDate)
      .input('end_date', sql.Date, toIsoDate(nextEndDate))
      .input('price_paid', sql.Decimal(18, 2), payload.amount)
      .query(`
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
      throw new ApiError(404, 'CUSTOMER_MEMBERSHIP_NOT_FOUND', 'Customer membership was not found.');
    }

    const transactionResult = await new sql.Request(transaction)
      .input('company_id', sql.BigInt, companyId)
      .input('customer_id', sql.BigInt, customerId)
      .input('customer_membership_id', sql.BigInt, membership.id)
      .input('membership_plan_id', sql.BigInt, membership.planId)
      .input('transaction_type', sql.VarChar(30), 'renewal')
      .input('payment_method', sql.VarChar(30), payload.paymentMethod)
      .input('amount', sql.Decimal(18, 2), payload.amount)
      .input('transaction_date', sql.Date, payload.transactionDate)
      .input('note', sql.NVarChar(500), payload.note)
      .input('created_by_label', sql.NVarChar(160), actorLabel)
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

    const renewedMembership = mapCustomerMembership({
      ...membershipResult.recordset[0],
      plan_name: plan.name,
      renewal_notice_days: plan.renewalNoticeDays
    });
    const transactionRow = mapMembershipTransaction({
      ...transactionResult.recordset[0],
      plan_name: plan.name
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
  const status = filters.status === 'all' ? null : (filters.status || 'active');
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .input('status', sql.VarChar(20), status)
    .query(`
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
    status: filters.status || 'active',
    items: result.recordset.map((row) => mapCustomerMembership(row))
  };
}

async function createMembershipBenefitUsage(companyId, customerId, membership, benefit, payload, actorLabel) {
  const sql = getSql();
  const pool = await getPool();
  const usagePeriodStartDate = calculateUsagePeriodStartDate(
    payload.usageDate,
    benefit.usagePeriod,
    membership.startDate
  );
  const limit = benefit.usageLimit == null ? null : Number(benefit.usageLimit);

  if (limit) {
    const usageResult = await pool.request()
      .input('company_id', sql.BigInt, companyId)
      .input('customer_membership_id', sql.BigInt, membership.id)
      .input('membership_benefit_id', sql.BigInt, benefit.id)
      .input('usage_period_start_date', sql.Date, usagePeriodStartDate)
      .query(`
        SELECT COALESCE(SUM(quantity), 0) AS used_quantity
        FROM dbo.MembershipBenefitUsages
        WHERE company_id = @company_id
          AND customer_membership_id = @customer_membership_id
          AND membership_benefit_id = @membership_benefit_id
          AND usage_period_start_date = @usage_period_start_date
      `);

    const usedQuantity = Number(usageResult.recordset[0].used_quantity || 0);
    if (usedQuantity + payload.quantity > limit) {
      throw new ApiError(409, 'MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED', 'Membership benefit usage limit would be exceeded.');
    }
  }

  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_membership_id', sql.BigInt, membership.id)
    .input('membership_benefit_id', sql.BigInt, benefit.id)
    .input('customer_id', sql.BigInt, customerId)
    .input('usage_date', sql.Date, payload.usageDate)
    .input('usage_period_start_date', sql.Date, usagePeriodStartDate)
    .input('quantity', sql.Int, payload.quantity)
    .input('note', sql.NVarChar(500), payload.note)
    .input('created_by_label', sql.NVarChar(160), actorLabel)
    .query(`
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
    plan_name: membership.planName
  });
}

async function listMembershipBenefitUsages(companyId, customerId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .input('from', sql.Date, filters.from)
    .input('to', sql.Date, filters.to)
    .query(`
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
    items: result.recordset.map(mapMembershipBenefitUsage)
  };
}

async function listMembershipTransactions(companyId, customerId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('customer_id', sql.BigInt, customerId)
    .input('from', sql.Date, filters.from)
    .input('to', sql.Date, filters.to)
    .query(`
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
    items: result.recordset.map(mapMembershipTransaction)
  };
}

async function getMembershipFinancialReport(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('from', sql.Date, filters.from)
    .input('to', sql.Date, filters.to)
    .query(`
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
  const newMemberships = items.filter((item) => item.transactionType === 'new_membership');
  const renewals = items.filter((item) => item.transactionType === 'renewal');
  const paymentMethods = items.reduce((summary, item) => {
    const current = summary[item.paymentMethod] || { paymentMethod: item.paymentMethod, count: 0, amount: 0 };
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
      newMembershipAmount: newMemberships.reduce((total, item) => total + item.amount, 0),
      renewalCount: renewals.length,
      renewalAmount: renewals.reduce((total, item) => total + item.amount, 0),
      paymentMethods
    },
    items
  };
}

async function listMembershipExpirationAlerts(companyId, filters = {}) {
  const sql = getSql();
  const pool = await getPool();
  const status = filters.status || 'active';
  const withinDays = Number.isInteger(filters.withinDays) ? filters.withinDays : 5;
  const result = await pool.request()
    .input('company_id', sql.BigInt, companyId)
    .input('status', sql.VarChar(20), status)
    .input('within_days', sql.Int, withinDays)
    .query(`
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
    items: result.recordset.map((row) => mapMembershipExpirationAlert(row, {
      today: row.today_date,
      withinDays
    }))
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
  createCompanyRegistrationRequest,
  createCustomer,
  createCustomerMembership,
  createMembershipBenefitUsage,
  createMembershipBenefit,
  createMembershipPlan,
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
  getCompanyLogoMetadata,
  getCompanyRegistrationRequestLogoMetadata,
  getCompanySettings,
  getCustomerById,
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
  listCustomers,
  listCompanyRegistrationRequests,
  mapCompanyInvitation,
  mapCompanyInvitationWithCompany,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
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
  rejectCompanyRegistrationRequest,
  revokeCompanySession,
  rotateCompanyInvitationToken,
  renewCustomerMembership,
  toApiId,
  toIsoTimestamp,
  updateCompanyLogo,
  updateCompanyRegistrationRequestLogo,
  updateCompanySettings,
  updateMembershipBenefit,
  updateMembershipPlan
};
