const test = require('node:test');
const assert = require('node:assert/strict');

function makeRequest({ companyId = '1', cookie = '' } = {}) {
  return {
    params: { companyId },
    headers: {
      get(name) {
        return name.toLowerCase() === 'cookie' ? cookie : null;
      }
    }
  };
}

function loadHttpWithRepository(repositoryExports) {
  const httpPath = require.resolve('../src/lib/http');
  const repositoryPath = require.resolve('../src/lib/repository');
  const originalRepository = require.cache[repositoryPath];
  delete require.cache[httpPath];

  require.cache[repositoryPath] = {
    id: repositoryPath,
    filename: repositoryPath,
    loaded: true,
    exports: repositoryExports
  };

  return {
    http: require('../src/lib/http'),
    restore() {
      if (originalRepository) {
        require.cache[repositoryPath] = originalRepository;
      } else {
        delete require.cache[repositoryPath];
      }
      delete require.cache[httpPath];
    }
  };
}

test('getCompanyId uses valid session company over route companyId', async () => {
  let called = false;
  const { http, restore } = loadHttpWithRepository({
    async getAuthIdentityBySessionTokenHash(tokenHash) {
      called = true;
      assert.equal(Buffer.isBuffer(tokenHash), true);
      return { company: { id: '42' } };
    }
  });

  try {
    process.env.PILOT_COMPANY_ID = '1';
    const companyId = await http.getCompanyId(makeRequest({
      companyId: '1',
      cookie: 'puntoclub_company_session=session-token'
    }));
    assert.equal(companyId, 42);
    assert.equal(called, true);
  } finally {
    restore();
    delete process.env.PILOT_COMPANY_ID;
  }
});

test('getCompanyId keeps pilot fallback when no session exists', async () => {
  const { http, restore } = loadHttpWithRepository({
    async getAuthIdentityBySessionTokenHash() {
      throw new Error('should not read session');
    }
  });

  try {
    process.env.PILOT_COMPANY_ID = '7';
    assert.equal(await http.getCompanyId(makeRequest({ companyId: '7' })), 7);
    await assert.rejects(
      () => http.getCompanyId(makeRequest({ companyId: '8' })),
      (error) => error.code === 'COMPANY_NOT_FOUND' && error.status === 404
    );
  } finally {
    restore();
    delete process.env.PILOT_COMPANY_ID;
  }
});

test('getCompanyId does not fallback to pilot when a session cookie is invalid', async () => {
  const { ApiError } = require('../src/lib/errors');
  const { http, restore } = loadHttpWithRepository({
    async getAuthIdentityBySessionTokenHash() {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication is required.');
    }
  });

  try {
    process.env.PILOT_COMPANY_ID = '1';
    await assert.rejects(
      () => http.getCompanyId(makeRequest({
        companyId: '1',
        cookie: 'puntoclub_company_session=expired-token'
      })),
      (error) => error.code === 'UNAUTHORIZED' && error.status === 401
    );
  } finally {
    restore();
    delete process.env.PILOT_COMPANY_ID;
  }
});
