const { ApiError } = require('./errors');
const { getPool, getSql } = require('./db');

function toIsoTimestamp(value) {
  return value instanceof Date ? value.toISOString() : value;
}

function toIsoDate(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function mapCustomer(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    createdAt: toIsoTimestamp(row.created_at),
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
    id: row.id,
    customerId: row.customer_id,
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
    customerId: row.customer_id,
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
    id: row.id,
    date: toIsoDate(row.activity_date),
    invoiceNumber: row.invoice_number || undefined,
    amount: row.amount == null ? undefined : Number(row.amount),
    note: row.note || undefined,
    points: row.points
  }));
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

  const activity = await getActivity(companyId, payload.customerId);
  const balance = await getBalance(companyId, payload.customerId);
  const latest = activity.find((item) => item.type === 'redemption' && item.points === -payload.pointsRedeemed);

  return {
    id: latest ? latest.id : null,
    customerId: payload.customerId,
    redemptionDate: payload.redemptionDate,
    pointsRedeemed: payload.pointsRedeemed,
    note: payload.note,
    createdAt: latest ? latest.date : null,
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
  getBalance,
  listCustomers
};
