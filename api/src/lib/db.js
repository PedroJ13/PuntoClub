let sqlModule;
let poolPromise;

function getSql() {
  if (!sqlModule) {
    sqlModule = require('mssql');
  }
  return sqlModule;
}

async function getPool() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('SQL_CONNECTION_STRING is required.');
  }

  if (!poolPromise) {
    const sql = getSql();
    poolPromise = new sql.ConnectionPool(connectionString).connect();
  }

  return poolPromise;
}

module.exports = {
  getPool,
  getSql
};
