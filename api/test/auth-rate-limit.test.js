const test = require('node:test');
const assert = require('node:assert/strict');

const {
  assertAuthAttemptAllowed,
  clearAuthAttemptLimit,
  defaultPolicy,
  getClientIp,
  getFailedAttemptUpdate,
  hashRateLimitSubject,
  isLocked,
  recordAuthAttemptFailure,
  scopes
} = require('../src/lib/authRateLimit');

test('hashRateLimitSubject stores SHA-256 bytes instead of raw subject', () => {
  const subject = 'owner@example.test';
  const hash = hashRateLimitSubject(subject);

  assert.equal(Buffer.isBuffer(hash), true);
  assert.equal(hash.length, 32);
  assert.notEqual(hash.toString('utf8'), subject);
  assert.notEqual(hash.toString('hex'), subject);
});

test('getFailedAttemptUpdate increments within window and locks at threshold', () => {
  const now = new Date('2026-06-09T12:00:00Z');
  const current = {
    windowStartedAt: new Date('2026-06-09T11:55:00Z'),
    failedCount: defaultPolicy.maxFailures - 1
  };

  const next = getFailedAttemptUpdate(current, defaultPolicy, now);

  assert.equal(next.failedCount, defaultPolicy.maxFailures);
  assert.equal(next.windowStartedAt.toISOString(), '2026-06-09T11:55:00.000Z');
  assert.equal(next.lockedUntil.toISOString(), '2026-06-09T12:15:00.000Z');
  assert.equal(isLocked(next, now), true);
});

test('getFailedAttemptUpdate resets after window expires', () => {
  const now = new Date('2026-06-09T12:20:00Z');
  const current = {
    windowStartedAt: new Date('2026-06-09T12:00:00Z'),
    failedCount: defaultPolicy.maxFailures
  };

  const next = getFailedAttemptUpdate(current, defaultPolicy, now);

  assert.equal(next.failedCount, 1);
  assert.equal(next.windowStartedAt, now);
  assert.equal(next.lockedUntil, null);
});

test('assertAuthAttemptAllowed returns 429 while subject is locked', async () => {
  const repository = {
    async getAuthAttemptLimit() {
      return {
        lockedUntil: new Date('2026-06-09T12:15:00Z')
      };
    }
  };

  await assert.rejects(
    () => assertAuthAttemptAllowed(
      repository,
      scopes.companyLoginEmail,
      hashRateLimitSubject('owner@example.test'),
      new Date('2026-06-09T12:00:00Z')
    ),
    (error) => error.status === 429 && error.code === 'TOO_MANY_ATTEMPTS'
  );
});

test('recordAuthAttemptFailure and clearAuthAttemptLimit delegate only hashed subject', async () => {
  const subjectHash = hashRateLimitSubject('owner@example.test');
  const calls = [];
  const repository = {
    async recordAuthAttemptFailure(scope, hash, policy, now) {
      calls.push({ fn: 'record', scope, hash, policy, now });
      return { failedCount: 1 };
    },
    async clearAuthAttemptLimit(scope, hash) {
      calls.push({ fn: 'clear', scope, hash });
    }
  };

  await recordAuthAttemptFailure(repository, scopes.companyLoginEmail, subjectHash, defaultPolicy, new Date('2026-06-09T12:00:00Z'));
  await clearAuthAttemptLimit(repository, scopes.companyLoginEmail, subjectHash);

  assert.equal(calls.length, 2);
  assert.equal(calls[0].scope, scopes.companyLoginEmail);
  assert.equal(calls[0].hash, subjectHash);
  assert.equal(calls[1].hash, subjectHash);
});

test('getClientIp is disabled until architecture has a trusted proxy', () => {
  assert.equal(getClientIp({ headers: { get: () => '203.0.113.10' } }), null);
});
