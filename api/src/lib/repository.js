const { ApiError } = require('./errors');
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
  createCustomer,
  createPurchase,
  createRedemption,
  customerExists,
  ensureActiveCompany,
  getActivity,
  getActivityReport,
  getBalance,
  getCompanySettings,
  listCustomers,
  mapCompanyInvitation,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
  mapCompanyUser,
  mapMyCompany,
  toApiId,
  toIsoTimestamp,
  updateCompanySettings
};
