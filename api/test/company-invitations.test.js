const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError } = require('../src/lib/errors');
const {
  assertCompanyInvitationManagementEnabled,
  formatCompanyInvitationCreatedAuditEvent,
  formatCompanyInvitationCreatedResponse,
  formatCompanyInvitationResentResponse,
  formatCompanyInvitationValidation,
  generateInvitationToken,
  getCompanyInvitationActorLabel,
  getInvitationExpiresAt,
  hashInvitationToken,
  validateInvitationToken
} = require('../src/lib/companyInvitations');
const {
  createCompanyInvitationEmail,
  createInternalInvitationSentEmail,
  getEmailConfig,
  notifyCompanyInvitationCreated
} = require('../src/lib/notifier');

const sampleInvitation = {
  id: '300',
  companyId: '10',
  companyName: 'Cafe Central',
  registrationRequestId: '200',
  email: 'owner@cafecentral.test',
  role: 'owner',
  status: 'pending',
  expiresAt: '2026-06-14T19:00:00.000Z',
  acceptedAt: null,
  revokedAt: null,
  createdAt: '2026-06-07T19:00:00.000Z',
  createdByLabel: 'internal'
};

test('generateInvitationToken creates URL-safe tokens and hashInvitationToken stores SHA-256 bytes only', () => {
  const token = generateInvitationToken();
  const hash = hashInvitationToken(token);

  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.equal(hash.length, 32);
  assert.notEqual(hash.toString('hex'), token);
});

test('validateInvitationToken rejects missing or impossible token formats', () => {
  assert.equal(validateInvitationToken('  abcdefghijklmnopqrstuvwxyzABCDEF0123456789_-  '), 'abcdefghijklmnopqrstuvwxyzABCDEF0123456789_-');
  assert.throws(
    () => validateInvitationToken('bad token with spaces'),
    (error) => error instanceof ApiError && error.status === 400 && error.code === 'VALIDATION_ERROR'
  );
});

test('company invitation management feature flag defaults to blocked', () => {
  assert.throws(
    () => assertCompanyInvitationManagementEnabled({}),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );

  assert.doesNotThrow(() => assertCompanyInvitationManagementEnabled({ COMPANY_INVITATION_MANAGEMENT_ENABLED: 'true' }));
});

test('getCompanyInvitationActorLabel prefers invitation actor setting', () => {
  assert.equal(getCompanyInvitationActorLabel({}), 'internal');
  assert.equal(getCompanyInvitationActorLabel({ COMPANY_REGISTRATION_REVIEW_ACTOR_LABEL: ' Review API ' }), 'Review API');
  assert.equal(getCompanyInvitationActorLabel({ COMPANY_INVITATION_ACTOR_LABEL: ' Invite API ' }), 'Invite API');
});

test('getInvitationExpiresAt defaults to seven days and caps invalid config', () => {
  const now = new Date('2026-06-07T19:00:00Z');

  assert.equal(getInvitationExpiresAt(now, {}).toISOString(), '2026-06-14T19:00:00.000Z');
  assert.equal(getInvitationExpiresAt(now, { COMPANY_INVITATION_EXPIRES_DAYS: '3' }).toISOString(), '2026-06-10T19:00:00.000Z');
  assert.equal(getInvitationExpiresAt(now, { COMPANY_INVITATION_EXPIRES_DAYS: '90' }).toISOString(), '2026-06-14T19:00:00.000Z');
});

test('formatCompanyInvitationCreatedResponse excludes token and hash data', () => {
  assert.deepEqual(formatCompanyInvitationCreatedResponse(sampleInvitation), {
    id: '300',
    companyId: '10',
    email: 'owner@cafecentral.test',
    role: 'owner',
    status: 'pending',
    expiresAt: '2026-06-14T19:00:00.000Z',
    createdAt: '2026-06-07T19:00:00.000Z'
  });
});

test('formatCompanyInvitationValidation maps available and unavailable invitations', () => {
  const now = new Date('2026-06-07T20:00:00Z');

  assert.deepEqual(formatCompanyInvitationValidation(sampleInvitation, now), {
    valid: true,
    invitationId: '300',
    companyId: '10',
    companyName: 'Cafe Central',
    email: 'owner@cafecentral.test',
    role: 'owner',
    expiresAt: '2026-06-14T19:00:00.000Z'
  });
  assert.deepEqual(formatCompanyInvitationValidation(null, now), { valid: false, reason: 'invalid' });
  assert.deepEqual(formatCompanyInvitationValidation({ ...sampleInvitation, status: 'accepted' }, now), { valid: false, reason: 'accepted' });
  assert.deepEqual(formatCompanyInvitationValidation({ ...sampleInvitation, status: 'revoked' }, now), { valid: false, reason: 'revoked' });
  assert.deepEqual(
    formatCompanyInvitationValidation({ ...sampleInvitation, expiresAt: '2026-06-07T19:59:59.000Z' }, now),
    { valid: false, reason: 'expired' }
  );
});

test('formatCompanyInvitationResentResponse returns compact resend contract', () => {
  assert.deepEqual(
    formatCompanyInvitationResentResponse(sampleInvitation, new Date('2026-06-07T20:00:00Z')),
    {
      id: '300',
      status: 'pending',
      email: 'owner@cafecentral.test',
      expiresAt: '2026-06-14T19:00:00.000Z',
      resentAt: '2026-06-07T20:00:00.000Z'
    }
  );
});

test('formatCompanyInvitationCreatedAuditEvent builds created audit payload', () => {
  assert.deepEqual(
    formatCompanyInvitationCreatedAuditEvent(sampleInvitation, { invocationId: 'invocation-1' }),
    {
      companyId: '10',
      eventType: 'company.invitation.created',
      entityType: 'company_invitation',
      entityId: '300',
      actorLabel: 'internal',
      metadata: {
        role: 'owner',
        requestId: 'invocation-1'
      }
    }
  );
});

test('invitation email includes invite link only in invitee email', () => {
  const config = getEmailConfig({
    ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
    ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
    INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test',
    APP_PUBLIC_BASE_URL: 'https://puntoclub.example.test'
  });
  const inviteEmail = createCompanyInvitationEmail(sampleInvitation, 'raw-token-value', config);
  const internalEmail = createInternalInvitationSentEmail(sampleInvitation, config);

  assert.match(inviteEmail.plainText, /raw-token-value/);
  assert.match(inviteEmail.html, /Crear acceso/);
  assert.doesNotMatch(internalEmail.plainText, /raw-token-value/);
  assert.equal(inviteEmail.to[0].address, 'owner@cafecentral.test');
  assert.equal(internalEmail.to[0].address, 'ops@example.test');
});

test('notifyCompanyInvitationCreated sends invitee and internal notifications through injected adapter', async () => {
  const sentMessages = [];
  const result = await notifyCompanyInvitationCreated(sampleInvitation, 'raw-token-value', null, {
    config: getEmailConfig({
      ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
      ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
      INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test',
      APP_PUBLIC_BASE_URL: 'https://puntoclub.example.test'
    }),
    sendEmail: async (message) => {
      sentMessages.push(message);
      return { provider: 'mock', status: 'sent' };
    }
  });

  assert.equal(result.status, 'sent');
  assert.equal(sentMessages.length, 2);
  assert.deepEqual(result.results.map((item) => item.type), ['invitee', 'internal_invitation_sent']);
});
