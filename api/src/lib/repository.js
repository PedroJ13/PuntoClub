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
    status: row.status,
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapCompanyRegistrationRequest(row) {
  return {
    id: toApiId(row.id),
    companyName: row.company_name,
    companyEmail: row.company_email,
    companyPhone: row.company_phone,
    companyAddress: row.company_address,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
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
    status: row.status,
    updatedAt: toIsoTimestamp(row.updated_at)
  };
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
      SELECT id, name, email, phone, logo_url, points_percentage, status, updated_at
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
          contact_phone
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
      .input('points_percentage', sql.Decimal(5, 2), pointsPercentage)
      .query(`
        INSERT INTO dbo.Companies (
          name,
          email,
          phone,
          address,
          points_percentage,
          status
        )
        OUTPUT
          INSERTED.id,
          INSERTED.name,
          INSERTED.email,
          INSERTED.phone,
          INSERTED.address,
          INSERTED.points_percentage,
          INSERTED.status,
          INSERTED.updated_at
        VALUES (
          @name,
          @email,
          @phone,
          @address,
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
             p.invoice_number, p.amount, p.points_earned AS points
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
             -r.points_redeemed AS points
      FROM dbo.Redemptions AS r
      INNER JOIN dbo.Customers AS c
        ON c.company_id = r.company_id
       AND c.id = r.customer_id
      WHERE r.company_id = @company_id
        AND r.redemption_date >= @from
        AND r.redemption_date <= @to
        AND @type IN ('all', 'redemption')
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
    points: row.points
  }));

  const activeCustomerIds = new Set(items.map((item) => item.customerId));
  const purchases = items.filter((item) => item.type === 'purchase');
  const redemptions = items.filter((item) => item.type === 'redemption');

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

module.exports = {
  acceptCompanyInvitationWithPassword,
  approveCompanyRegistrationRequest,
  clearAuthAttemptLimit,
  createCompanySession,
  createCompanyInvitation,
  createCompanyRegistrationRequest,
  createCustomer,
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
  getCompanySettings,
  getLocalPasswordUserByEmail,
  listCustomers,
  mapCompanyInvitation,
  mapCompanyInvitationWithCompany,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
  mapCompanyUser,
  mapMyCompany,
  recordAuthAttemptFailure,
  rejectCompanyRegistrationRequest,
  revokeCompanySession,
  rotateCompanyInvitationToken,
  toApiId,
  toIsoTimestamp,
  updateCompanySettings
};
