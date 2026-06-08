const test = require('node:test');
const assert = require('node:assert/strict');

test('getPool clears cached promise after connection failure', async () => {
  const dbPath = require.resolve('../src/lib/db');
  const mssqlPath = require.resolve('mssql');
  delete require.cache[dbPath];

  let attempts = 0;
  const originalMssql = require.cache[mssqlPath];
  require.cache[mssqlPath] = {
    id: mssqlPath,
    filename: mssqlPath,
    loaded: true,
    exports: {
      ConnectionPool: class {
        connect() {
          attempts += 1;
          if (attempts === 1) {
            return Promise.reject(Object.assign(new Error('temporary'), { code: 'ELOGIN' }));
          }
          return Promise.resolve({ connected: true });
        }
      }
    }
  };

  const previousConnectionString = process.env.SQL_CONNECTION_STRING;
  process.env.SQL_CONNECTION_STRING = 'Server=example;';

  try {
    const { getPool } = require('../src/lib/db');
    await assert.rejects(() => getPool(), /temporary/);
    const pool = await getPool();
    assert.deepEqual(pool, { connected: true });
    assert.equal(attempts, 2);
  } finally {
    if (previousConnectionString == null) {
      delete process.env.SQL_CONNECTION_STRING;
    } else {
      process.env.SQL_CONNECTION_STRING = previousConnectionString;
    }
    if (originalMssql) {
      require.cache[mssqlPath] = originalMssql;
    } else {
      delete require.cache[mssqlPath];
    }
    delete require.cache[dbPath];
  }
});
