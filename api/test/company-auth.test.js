const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildClearSessionCookie,
  buildSessionCookie,
  formatAuthIdentity,
  formatInvitationAcceptedResponse,
  generateSessionToken,
  getSessionExpiresAt,
  hashPassword,
  hashSessionToken,
  readSessionTokenFromRequest,
  verifyPassword
} = require('../src/lib/companyAuth');

test('hashPassword stores salted PBKDF2 metadata and verifies with timing-safe comparison', () => {
  const credentials = hashPassword('Password123', { salt: 'fixed-salt', iterations: 1000, keylen: 32, digest: 'sha256' });

  assert.equal(credentials.passwordAlgorithm, 'pbkdf2_sha256');
  assert.notEqual(credentials.passwordHash, 'Password123');
  assert.match(credentials.passwordParams, /fixed-salt/);
  assert.equal(verifyPassword('Password123', {
    passwordAlgorithm: credentials.passwordAlgorithm,
    passwordHash: credentials.passwordHash,
    passwordParams: credentials.passwordParams
  }), true);
  assert.equal(verifyPassword('WrongPassword123', {
    passwordAlgorithm: credentials.passwordAlgorithm,
    passwordHash: credentials.passwordHash,
    passwordParams: credentials.passwordParams
  }), false);
});

test('session token hashing stores SHA-256 bytes only', () => {
  const token = generateSessionToken();
  const hash = hashSessionToken(token);

  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.equal(hash.length, 32);
  assert.notEqual(hash.toString('hex'), token);
});

test('session cookie is HttpOnly SameSite=Lax and secure in production', () => {
  const expiresAt = new Date('2026-06-08T12:00:00Z');
  const cookie = buildSessionCookie('raw-token', expiresAt, {
    COMPANY_SESSION_COOKIE_NAME: 'pc_session',
    WEBSITE_SITE_NAME: 'func-puntoclub-prod-br-001'
  });

  assert.match(cookie, /^pc_session=raw-token/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Expires=Mon, 08 Jun 2026 12:00:00 GMT/);

  const clearCookie = buildClearSessionCookie({ COMPANY_SESSION_COOKIE_NAME: 'pc_session', COMPANY_SESSION_COOKIE_SECURE: 'false' });
  assert.match(clearCookie, /^pc_session=/);
  assert.match(clearCookie, /Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
  assert.doesNotMatch(clearCookie, /Secure/);
});

test('readSessionTokenFromRequest reads configured cookie name', () => {
  const request = {
    headers: {
      get(name) {
        return name === 'cookie' ? 'other=1; pc_session=abc%20123' : null;
      }
    }
  };

  assert.equal(readSessionTokenFromRequest(request, { COMPANY_SESSION_COOKIE_NAME: 'pc_session' }), 'abc 123');
});

test('getSessionExpiresAt caps invalid TTL values', () => {
  const now = new Date('2026-06-08T12:00:00Z');
  assert.equal(getSessionExpiresAt(now, { COMPANY_SESSION_TTL_HOURS: '2' }).toISOString(), '2026-06-08T14:00:00.000Z');
  assert.equal(getSessionExpiresAt(now, { COMPANY_SESSION_TTL_HOURS: '9999' }).toISOString(), '2026-06-09T00:00:00.000Z');
});

test('auth response formatters hide session and password data', () => {
  const identity = {
    user: {
      id: '400',
      email: 'owner@cafecentral.test',
      displayName: 'Maria Soto',
      role: 'owner',
      status: 'active',
      passwordHash: 'hidden'
    },
    company: {
      id: '10',
      name: 'Cafe Central',
      status: 'active'
    }
  };

  assert.deepEqual(formatAuthIdentity(identity), {
    user: {
      id: '400',
      email: 'owner@cafecentral.test',
      displayName: 'Maria Soto',
      role: 'owner',
      status: 'active'
    },
    company: {
      id: '10',
      name: 'Cafe Central',
      status: 'active'
    }
  });

  assert.deepEqual(formatInvitationAcceptedResponse({
    ...identity,
    user: { ...identity.user, createdAt: '2026-06-08T12:00:00.000Z' }
  }), {
    companyId: '10',
    userId: '400',
    email: 'owner@cafecentral.test',
    role: 'owner',
    companyStatus: 'active',
    createdAt: '2026-06-08T12:00:00.000Z'
  });
});
