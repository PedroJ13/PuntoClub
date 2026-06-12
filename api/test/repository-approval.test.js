const test = require('node:test');
const assert = require('node:assert/strict');

function makeSqlMock(queryLog) {
  class Transaction {
    async begin() {
      queryLog.push({ kind: 'begin' });
    }

    async commit() {
      queryLog.push({ kind: 'commit' });
    }

    async rollback() {
      queryLog.push({ kind: 'rollback' });
    }
  }

  class Request {
    constructor() {
      this.inputs = {};
    }

    input(name, _type, value) {
      this.inputs[name] = value;
      return this;
    }

    async query(sqlText) {
      queryLog.push({ kind: 'query', sqlText, inputs: { ...this.inputs } });

      if (sqlText.includes('FROM dbo.CompanyRegistrationRequests WITH')) {
        return {
          recordset: [{
            id: 200,
            company_name: 'Cafe Central',
            company_email: 'owner@cafecentral.test',
            company_phone: '+50622223333',
            company_address: 'San Jose',
            contact_name: 'Maria Soto',
            contact_email: 'maria@cafecentral.test',
            contact_phone: '+50688889999',
            requested_logo_blob_path: 'registration-requests/200/logo/logo-id.png',
            requested_logo_content_type: 'image/png'
          }]
        };
      }

      if (sqlText.includes('INSERT INTO dbo.Companies')) {
        return {
          recordset: [{
            id: 10,
            name: 'Cafe Central',
            email: 'owner@cafecentral.test',
            phone: '+50622223333',
            address: 'San Jose',
            logo_blob_path: this.inputs.logo_blob_path,
            logo_content_type: this.inputs.logo_content_type,
            logo_updated_at: new Date('2026-06-07T19:00:00Z'),
            points_percentage: '5.00',
            status: 'pending_activation',
            updated_at: new Date('2026-06-07T19:00:00Z')
          }]
        };
      }

      if (sqlText.includes('UPDATE dbo.CompanyRegistrationRequests')) {
        return {
          recordset: [{
            id: 200,
            company_name: 'Cafe Central',
            company_email: 'owner@cafecentral.test',
            company_phone: '+50622223333',
            company_address: 'San Jose',
            contact_name: 'Maria Soto',
            contact_email: 'maria@cafecentral.test',
            contact_phone: '+50688889999',
            requested_logo_blob_path: 'registration-requests/200/logo/logo-id.png',
            requested_logo_content_type: 'image/png',
            status: 'approved',
            reviewed_at: new Date('2026-06-07T19:01:00Z'),
            reviewed_by_label: 'internal',
            review_note: null,
            approved_company_id: 10,
            created_at: new Date('2026-06-07T18:30:00Z'),
            updated_at: new Date('2026-06-07T19:01:00Z')
          }]
        };
      }

      if (sqlText.includes('INSERT INTO dbo.CompanyInvitations')) {
        return {
          recordset: [{
            id: 300,
            company_id: this.inputs.company_id,
            registration_request_id: this.inputs.registration_request_id,
            email: this.inputs.email,
            role: this.inputs.role,
            status: 'pending',
            expires_at: this.inputs.expires_at,
            accepted_at: null,
            revoked_at: null,
            created_at: new Date('2026-06-07T19:02:00Z'),
            created_by_label: this.inputs.created_by_label
          }]
        };
      }

      throw new Error(`Unexpected query: ${sqlText}`);
    }
  }

  const stringType = () => 'string';
  return {
    BigInt: 'bigint',
    DateTime2: 'datetime2',
    Decimal: stringType,
    NVarChar: stringType,
    Request,
    Transaction,
    VarBinary: stringType,
    VarChar: stringType
  };
}

test('approveCompanyRegistrationRequest creates owner invitation with token hash in the approval transaction', async () => {
  const dbPath = require.resolve('../src/lib/db');
  const repositoryPath = require.resolve('../src/lib/repository');
  const db = require(dbPath);
  const originalGetPool = db.getPool;
  const originalGetSql = db.getSql;
  const queryLog = [];
  const tokenHash = Buffer.alloc(32, 7);
  const expiresAt = new Date('2026-06-14T19:00:00Z');

  db.getPool = async () => ({});
  db.getSql = () => makeSqlMock(queryLog);
  delete require.cache[repositoryPath];

  try {
    const repository = require(repositoryPath);
    const result = await repository.approveCompanyRegistrationRequest(200, {}, {
      actorLabel: 'internal',
      invitation: {
        tokenHash,
        expiresAt
      }
    });

    assert.equal(result.company.id, '10');
    assert.equal(result.company.logoUrl, '/api/my-company/logo');
    assert.equal(result.company.logoContentType, 'image/png');
    assert.deepEqual(result.invitation, {
      id: '300',
      companyId: '10',
      registrationRequestId: '200',
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expiresAt: '2026-06-14T19:00:00.000Z',
      acceptedAt: null,
      revokedAt: null,
      createdAt: '2026-06-07T19:02:00.000Z',
      createdByLabel: 'internal',
      companyName: 'Cafe Central'
    });

    const invitationInsert = queryLog.find((entry) => entry.kind === 'query' && entry.sqlText.includes('INSERT INTO dbo.CompanyInvitations'));
    const companyInsert = queryLog.find((entry) => entry.kind === 'query' && entry.sqlText.includes('INSERT INTO dbo.Companies'));
    assert.equal(companyInsert.inputs.logo_blob_path, 'registration-requests/200/logo/logo-id.png');
    assert.equal(companyInsert.inputs.logo_content_type, 'image/png');
    assert.equal(invitationInsert.inputs.email, 'owner@cafecentral.test');
    assert.equal(invitationInsert.inputs.role, 'owner');
    assert.equal(invitationInsert.inputs.token_hash, tokenHash);
    assert.equal(Object.prototype.hasOwnProperty.call(invitationInsert.inputs, 'token'), false);
    assert.equal(queryLog.some((entry) => entry.kind === 'commit'), true);
  } finally {
    db.getPool = originalGetPool;
    db.getSql = originalGetSql;
    delete require.cache[repositoryPath];
  }
});
