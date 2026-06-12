const test = require('node:test');
const assert = require('node:assert/strict');

const {
  mapCompanyInvitation,
  mapCompanyRegistrationRequest,
  mapCompanySettings,
  mapCompanyUser,
  mapMyCompany,
  toApiId,
  toIsoTimestamp
} = require('../src/lib/repository');

test('toApiId serializes bigint identifiers as strings', () => {
  assert.equal(toApiId(10), '10');
  assert.equal(toApiId('9007199254740993'), '9007199254740993');
  assert.equal(toApiId(null), null);
});

test('toIsoTimestamp serializes Date values as complete UTC timestamps', () => {
  assert.equal(toIsoTimestamp(new Date('2026-06-02T15:20:00Z')), '2026-06-02T15:20:00.000Z');
});

test('mapCompanySettings serializes SQL row to API contract', () => {
  assert.deepEqual(
    mapCompanySettings({
      id: 1,
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      logo_url: 'https://example.com/logo.png',
      points_percentage: '5.00',
      status: 'active',
      updated_at: new Date('2026-06-02T15:20:00Z')
    }),
    {
      id: '1',
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      logoUrl: 'https://example.com/logo.png',
      pointsPercentage: 5,
      status: 'active',
      updatedAt: '2026-06-02T15:20:00.000Z'
    }
  );
});

test('mapCompanyRegistrationRequest serializes SQL row to API contract', () => {
  assert.deepEqual(
    mapCompanyRegistrationRequest({
      id: 200,
      company_name: 'Cafe Central',
      company_email: 'hola@cafecentral.test',
      company_phone: '+50622223333',
      company_address: 'San Jose',
      contact_name: 'Maria Soto',
      contact_email: 'maria@cafecentral.test',
      contact_phone: null,
      requested_logo_blob_path: 'registration-requests/200/logo/logo-id.png',
      requested_logo_content_type: 'image/png',
      status: 'pending',
      reviewed_at: null,
      reviewed_by_label: null,
      review_note: null,
      approved_company_id: null,
      created_at: new Date('2026-06-07T18:30:00Z'),
      updated_at: new Date('2026-06-07T18:30:00Z')
    }),
    {
      id: '200',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyPhone: '+50622223333',
      companyAddress: 'San Jose',
      contactName: 'Maria Soto',
      contactEmail: 'maria@cafecentral.test',
      contactPhone: null,
      requestedLogo: {
        available: true,
        contentType: 'image/png'
      },
      status: 'pending',
      reviewedAt: null,
      reviewedByLabel: null,
      reviewNote: null,
      approvedCompanyId: null,
      createdAt: '2026-06-07T18:30:00.000Z',
      updatedAt: '2026-06-07T18:30:00.000Z'
    }
  );
});

test('mapCompanyInvitation serializes SQL row without token data', () => {
  assert.deepEqual(
    mapCompanyInvitation({
      id: 300,
      company_id: 10,
      registration_request_id: 200,
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expires_at: new Date('2026-06-14T19:00:00Z'),
      accepted_at: null,
      revoked_at: null,
      created_at: new Date('2026-06-07T19:00:00Z'),
      created_by_label: 'internal'
    }),
    {
      id: '300',
      companyId: '10',
      registrationRequestId: '200',
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expiresAt: '2026-06-14T19:00:00.000Z',
      acceptedAt: null,
      revokedAt: null,
      createdAt: '2026-06-07T19:00:00.000Z',
      createdByLabel: 'internal'
    }
  );
});

test('mapCompanyUser serializes SQL row without external subject', () => {
  assert.deepEqual(
    mapCompanyUser({
      id: 400,
      company_id: 10,
      email: 'owner@cafecentral.test',
      display_name: 'Maria Soto',
      role: 'owner',
      status: 'active',
      auth_provider: 'entra_external_id',
      external_subject: 'not-exposed',
      last_login_at: null,
      created_at: new Date('2026-06-07T20:10:00Z'),
      updated_at: new Date('2026-06-07T20:10:00Z')
    }),
    {
      id: '400',
      companyId: '10',
      email: 'owner@cafecentral.test',
      displayName: 'Maria Soto',
      role: 'owner',
      status: 'active',
      authProvider: 'entra_external_id',
      lastLoginAt: null,
      createdAt: '2026-06-07T20:10:00.000Z',
      updatedAt: '2026-06-07T20:10:00.000Z'
    }
  );
});

test('mapMyCompany exposes controlled logo URL and hides blob path', () => {
  assert.deepEqual(
    mapMyCompany({
      id: 10,
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      address: 'San Jose',
      logo_blob_path: 'companies/10/logo/logo.png',
      logo_content_type: 'image/png',
      logo_updated_at: new Date('2026-06-07T20:20:00Z'),
      points_percentage: '5.00',
      status: 'active',
      updated_at: new Date('2026-06-07T20:20:00Z')
    }),
    {
      id: '10',
      name: 'Cafe Central',
      email: 'hola@cafecentral.test',
      phone: '+50622223333',
      address: 'San Jose',
      logoUrl: '/api/my-company/logo',
      logoContentType: 'image/png',
      logoUpdatedAt: '2026-06-07T20:20:00.000Z',
      pointsPercentage: 5,
      status: 'active',
      updatedAt: '2026-06-07T20:20:00.000Z'
    }
  );
});
