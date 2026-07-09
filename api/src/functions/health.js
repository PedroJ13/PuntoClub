const { app } = require("@azure/functions");
const { ok } = require("../lib/http");

function readHealth(env = process.env) {
  return {
    ok: true,
    service: "punto-club-api",
    environment: env.ENVIRONMENT_NAME || env.NODE_ENV || "unknown",
    timestamp: new Date().toISOString(),
  };
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async () => ok(readHealth()),
});

module.exports = {
  readHealth,
};
