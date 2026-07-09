const test = require("node:test");
const assert = require("node:assert/strict");

const { readHealth } = require("../src/functions/health");

test("readHealth returns runtime status without SQL-dependent fields", () => {
  const health = readHealth({ ENVIRONMENT_NAME: "staging" });

  assert.equal(health.ok, true);
  assert.equal(health.service, "punto-club-api");
  assert.equal(health.environment, "staging");
  assert.match(health.timestamp, /^\d{4}-\d{2}-\d{2}T.*Z$/);
  assert.equal(Object.hasOwn(health, "sql"), false);
  assert.equal(Object.hasOwn(health, "secrets"), false);
});
