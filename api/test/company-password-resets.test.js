const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError } = require('../src/lib/errors');
const {
  assertCompanyPasswordResetEnabled,
  formatPasswordResetCompletedResponse,
  formatPasswordResetRequestedResponse,
  formatPasswordResetValidation,
  generatePasswordResetToken,
  getPasswordResetExpiresAt,
  hashPasswordResetToken,
  validatePasswordResetToken
} = require('../src/lib/companyPasswordResets');
const {
  createCompanyPasswordResetEmail,
  createInternalPasswordResetSentEmail,
  getEmailConfig,
  notifyCompanyPasswordResetCreated
} = require('../src/lib/notifier');

const sampleReset = {
  id: '700',
  companyId: '10',
  companyUserId: '400',
  companyName: 'Cafe Central',
  email: 'owner@cafecentral.test',
  status: 'pending',
  expiresAt: '2026-06-21T20:30:00.000Z',
  sentAt: '2026-06-21T19:30:00.000Z',
  usedAt: null,
  createdByLabel: 'internal'
};

test('password reset tokens are URL-safe and stored as SHA-256 bytes', () => {
  const token = generatePasswordResetToken();
  const hash = hashPasswordResetToken(token);

  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.equal(hash.length, 32);
  assert.notEqual(hash.toString('hex'), token);
});

test('validatePasswordResetToken rejects missing or impossible token formats', () => {
  assert.equal(validatePasswordResetToken('  abcdefghijklmnopqrstuvwxyzABCDEF0123456789_-  '), 'abcdefghijklmnopqrstuvwxyzABCDEF0123456789_-');
  assert.throws(
    () => validatePasswordResetToken('bad token with spaces'),
    (error) => error instanceof ApiError && error.status === 400 && error.code === 'VALIDATION_ERROR'
  );
});

test('password reset feature flag defaults to blocked', () => {
  assert.throws(
    () => assertCompanyPasswordResetEnabled({}),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );

  assert.doesNotThrow(() => assertCompanyPasswordResetEnabled({ COMPANY_PASSWORD_RESET_ENABLED: 'true' }));
});

test('getPasswordResetExpiresAt defaults to sixty minutes and caps invalid config', () => {
  const now = new Date('2026-06-21T19:30:00Z');

  assert.equal(getPasswordResetExpiresAt(now, {}).toISOString(), '2026-06-21T20:30:00.000Z');
  assert.equal(getPasswordResetExpiresAt(now, { COMPANY_PASSWORD_RESET_EXPIRES_MINUTES: '15' }).toISOString(), '2026-06-21T19:45:00.000Z');
  assert.equal(getPasswordResetExpiresAt(now, { COMPANY_PASSWORD_RESET_EXPIRES_MINUTES: '99999' }).toISOString(), '2026-06-21T20:30:00.000Z');
});

test('password reset formatters exclude token and hash data', () => {
  assert.deepEqual(formatPasswordResetRequestedResponse(sampleReset), {
    id: '700',
    email: 'owner@cafecentral.test',
    status: 'pending',
    expiresAt: '2026-06-21T20:30:00.000Z',
    sentAt: '2026-06-21T19:30:00.000Z'
  });

  assert.deepEqual(formatPasswordResetCompletedResponse({
    email: sampleReset.email,
    companyName: sampleReset.companyName,
    completedAt: '2026-06-21T19:45:00.000Z'
  }), {
    ok: true,
    email: sampleReset.email,
    companyName: sampleReset.companyName,
    completedAt: '2026-06-21T19:45:00.000Z'
  });
});

test('formatPasswordResetValidation maps available and unavailable resets', () => {
  const now = new Date('2026-06-21T19:45:00Z');

  assert.deepEqual(formatPasswordResetValidation(sampleReset, now), {
    valid: true,
    resetId: '700',
    companyName: 'Cafe Central',
    email: 'owner@cafecentral.test',
    expiresAt: '2026-06-21T20:30:00.000Z'
  });
  assert.deepEqual(formatPasswordResetValidation(null, now), { valid: false, reason: 'invalid' });
  assert.deepEqual(formatPasswordResetValidation({ ...sampleReset, status: 'used' }, now), { valid: false, reason: 'used' });
  assert.deepEqual(formatPasswordResetValidation({ ...sampleReset, expiresAt: '2026-06-21T19:44:59.000Z' }, now), { valid: false, reason: 'expired' });
});

test('password reset email includes raw token only in recipient email', () => {
  const config = getEmailConfig({
    ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
    ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
    INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test',
    APP_PUBLIC_BASE_URL: 'https://puntoclub.example.test'
  });
  const resetEmail = createCompanyPasswordResetEmail(sampleReset, 'raw-token-value', config);
  const internalEmail = createInternalPasswordResetSentEmail(sampleReset, config);

  assert.match(resetEmail.plainText, /raw-token-value/);
  assert.match(resetEmail.html, /Crear nueva contrasena/);
  assert.doesNotMatch(internalEmail.plainText, /raw-token-value/);
  assert.equal(resetEmail.to[0].address, 'owner@cafecentral.test');
  assert.equal(internalEmail.to[0].address, 'ops@example.test');
});

test('notifyCompanyPasswordResetCreated sends recipient and internal notifications through injected adapter', async () => {
  const sentMessages = [];
  const result = await notifyCompanyPasswordResetCreated(sampleReset, 'raw-token-value', null, {
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
  assert.deepEqual(result.results.map((item) => item.type), ['password_reset', 'internal_password_reset_sent']);
});
