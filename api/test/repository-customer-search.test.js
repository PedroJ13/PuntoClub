const test = require("node:test");
const assert = require("node:assert/strict");

function withMockedRepositoryDb(mockDb, run) {
  const repositoryPath = require.resolve("../src/lib/repository");
  const dbPath = require.resolve("../src/lib/db");
  const originalRepository = require.cache[repositoryPath];
  const originalDb = require.cache[dbPath];

  delete require.cache[repositoryPath];
  require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: mockDb,
  };

  return Promise.resolve()
    .then(() => run(require("../src/lib/repository")))
    .finally(() => {
      if (originalRepository) {
        require.cache[repositoryPath] = originalRepository;
      } else {
        delete require.cache[repositoryPath];
      }

      if (originalDb) {
        require.cache[dbPath] = originalDb;
      } else {
        delete require.cache[dbPath];
      }
    });
}

test("listCustomers searches name and email with CI_AI collation and keeps phone exact", async () => {
  const captured = {
    inputs: [],
    query: "",
  };

  await withMockedRepositoryDb(
    {
      getSql() {
        return {
          BigInt: "BigInt",
          NVarChar: (length) => `NVarChar(${length})`,
        };
      },
      async getPool() {
        return {
          request() {
            return {
              input(name, type, value) {
                captured.inputs.push({ name, type, value });
                return this;
              },
              async query(queryText) {
                captured.query = queryText;
                return {
                  recordset: [
                    {
                      id: 12,
                      name: "Maria Soto",
                      phone: "+50688887777",
                      email: "maria@example.test",
                      created_at: new Date("2026-06-20T10:00:00Z"),
                      updated_at: new Date("2026-06-20T10:00:00Z"),
                    },
                  ],
                };
              },
            };
          },
        };
      },
    },
    async (repository) => {
      const result = await repository.listCustomers(6, " maria ");

      assert.deepEqual(
        captured.inputs.map((input) => [input.name, input.type, input.value]),
        [
          ["company_id", "BigInt", 6],
          ["search", "NVarChar(254)", "maria"],
          ["search_like", "NVarChar(260)", "%maria%"],
        ],
      );
      assert.match(captured.query, /phone = @search/);
      assert.match(
        captured.query,
        /email COLLATE Latin1_General_100_CI_AI = @search COLLATE Latin1_General_100_CI_AI/,
      );
      assert.match(
        captured.query,
        /name COLLATE Latin1_General_100_CI_AI LIKE @search_like COLLATE Latin1_General_100_CI_AI/,
      );
      assert.doesNotMatch(captured.query, /phone COLLATE/i);
      assert.equal(result[0].id, "12");
    },
  );
});

test("createCustomer uses OUTPUT INTO so Customers triggers do not break inserts", async () => {
  const captured = {
    inputs: [],
    query: "",
  };

  await withMockedRepositoryDb(
    {
      getSql() {
        return {
          BigInt: "BigInt",
          Date: "Date",
          NVarChar: (length) => `NVarChar(${length})`,
        };
      },
      async getPool() {
        return {
          request() {
            return {
              input(name, type, value) {
                captured.inputs.push({ name, type, value });
                return this;
              },
              async query(queryText) {
                captured.query = queryText;
                return {
                  recordset: [
                    {
                      id: 21,
                      name: "Cliente Cumple",
                      phone: "+50660000000",
                      email: null,
                      birth_date: null,
                      created_at: new Date("2026-07-06T10:00:00Z"),
                      updated_at: new Date("2026-07-06T10:00:00Z"),
                    },
                  ],
                };
              },
            };
          },
        };
      },
    },
    async (repository) => {
      const result = await repository.createCustomer(8, {
        name: "Cliente Cumple",
        phone: "+50660000000",
        email: null,
        birthDate: null,
      });

      assert.deepEqual(
        captured.inputs.map((input) => [input.name, input.type, input.value]),
        [
          ["company_id", "BigInt", 8],
          ["name", "NVarChar(160)", "Cliente Cumple"],
          ["phone", "NVarChar(32)", "+50660000000"],
          ["email", "NVarChar(254)", null],
          ["birth_date", "Date", null],
        ],
      );
      assert.match(captured.query, /DECLARE @inserted TABLE/i);
      assert.match(captured.query, /OUTPUT INSERTED\.id[\s\S]+INTO @inserted/i);
      assert.match(
        captured.query,
        /SELECT id, name, phone, email, birth_date, created_at, updated_at\s+FROM @inserted/i,
      );
      assert.equal(result.id, "21");
      assert.equal(result.birthDate, null);
    },
  );
});
