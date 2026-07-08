const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createPurchaseEmail,
  createWelcomeEmail,
  sendOperationalEmailBestEffort,
} = require("../src/lib/operationalEmails");
const { getEmailConfig } = require("../src/lib/notifier");

const emailConfig = getEmailConfig({
  ACS_EMAIL_CONNECTION_STRING:
    "endpoint=https://example.communication.azure.com/;accesskey=secret",
  ACS_EMAIL_SENDER_ADDRESS: "DoNotReply@example.test",
  ACS_EMAIL_SENDER_DISPLAY_NAME: "Punto Club",
  INTERNAL_NOTIFICATION_EMAIL: "ops@example.test",
});

const sampleSettings = {
  welcomeEnabled: true,
  purchaseEnabled: true,
  redemptionEnabled: true,
  replyToEmail: "soporte@cafecentral.test",
};

const sampleDetails = {
  company: {
    id: "10",
    name: "Cafe Central",
  },
  customer: {
    id: "20",
    name: "Maria Soto",
    email: "maria@example.test",
  },
  purchase: {
    id: "30",
    amount: 2500,
    pointsEarned: 125,
  },
  balance: {
    pointsBalance: 625,
  },
};

function createFakeRepository(options = {}) {
  const state = {
    events: [],
    messages: [],
    attempts: [],
  };

  return {
    state,
    async createOperationalEmailEventIfNeeded(event) {
      if (options.duplicate) {
        return {
          created: false,
          event: { id: "1", ...event, status: "sent" },
        };
      }

      const saved = {
        id: String(state.events.length + 1),
        ...event,
        status: "pending",
      };
      state.events.push(saved);
      return { created: true, event: saved };
    },
    async getOperationalEmailSettings() {
      return options.settings || sampleSettings;
    },
    async createOperationalEmailMessage(message) {
      const saved = {
        id: String(state.messages.length + 1),
        ...message,
      };
      state.messages.push(saved);
      return saved;
    },
    async recordOperationalEmailAttempt(
      messageId,
      eventId,
      companyId,
      attempt,
    ) {
      state.attempts.push({ messageId, eventId, companyId, attempt });
    },
  };
}

test("operational welcome email uses reply-to and customer recipient", () => {
  const operationsEmailConfig = getEmailConfig({
    ACS_EMAIL_CONNECTION_STRING:
      "endpoint=https://example.communication.azure.com/;accesskey=secret",
    ACS_EMAIL_SENDER_ADDRESS: "operaciones@mail.puntoclubcr.com",
    ACS_EMAIL_SENDER_DISPLAY_NAME: "Punto Club Operaciones",
    INTERNAL_NOTIFICATION_EMAIL: "ops@example.test",
  });
  const message = createWelcomeEmail(
    sampleDetails,
    operationsEmailConfig,
    sampleSettings,
  );

  assert.equal(message.senderAddress, "operaciones@mail.puntoclubcr.com");
  assert.equal(message.senderDisplayName, "Punto Club Operaciones");
  assert.equal(message.subject, "Bienvenido a Cafe Central");
  assert.equal(message.to[0].address, "maria@example.test");
  assert.equal(message.replyTo[0].address, "soporte@cafecentral.test");
  assert.match(message.plainText, /programa de puntos/);
});

test("operational purchase email includes earned and total points", () => {
  const message = createPurchaseEmail(
    sampleDetails,
    emailConfig,
    sampleSettings,
  );

  assert.equal(message.subject, "Puntos ganados en Cafe Central");
  assert.match(message.plainText, /Puntos ganados: 125/);
  assert.match(message.plainText, /Saldo total: 625 puntos/);
});

test("sendOperationalEmailBestEffort sends and logs one attempt", async () => {
  const repository = createFakeRepository();
  const sent = [];
  const result = await sendOperationalEmailBestEffort(
    repository,
    {
      companyId: "10",
      eventType: "purchase",
      idempotencyKey: "purchase:30",
      sourceEntityType: "purchase",
      sourceEntityId: "30",
      customerId: "20",
    },
    sampleDetails,
    null,
    {
      config: emailConfig,
      sendEmail: async (message) => {
        sent.push(message);
        return { provider: "mock", status: "sent", id: "email-1" };
      },
    },
  );

  assert.equal(result.status, "sent");
  assert.equal(sent.length, 1);
  assert.equal(repository.state.events.length, 1);
  assert.equal(repository.state.messages.length, 1);
  assert.equal(repository.state.attempts.length, 1);
});

test("sendOperationalEmailBestEffort records safe ACS failure reason", async () => {
  const repository = createFakeRepository();
  const warnings = [];
  const result = await sendOperationalEmailBestEffort(
    repository,
    {
      companyId: "10",
      eventType: "purchase",
      idempotencyKey: "purchase:31",
      sourceEntityType: "purchase",
      sourceEntityId: "31",
      customerId: "20",
    },
    sampleDetails,
    {
      warn(message) {
        warnings.push(message);
      },
    },
    {
      config: emailConfig,
      sendEmail: async () => {
        throw new Error("The specified sender domain has not been linked.");
      },
    },
  );

  assert.equal(result.status, "failed");
  assert.equal(result.reason, "acs_sender_domain_not_linked");
  assert.equal(repository.state.attempts.length, 1);
  assert.equal(
    repository.state.attempts[0].attempt.reason,
    "acs_sender_domain_not_linked",
  );
  assert.equal(
    repository.state.attempts[0].attempt.errorMessage,
    "acs_sender_domain_not_linked",
  );
  assert.match(warnings[0], /acs_sender_domain_not_linked/);
  assert.doesNotMatch(warnings[0], /specified sender domain/);
});

test("sendOperationalEmailBestEffort skips duplicate idempotency key", async () => {
  const repository = createFakeRepository({ duplicate: true });
  const result = await sendOperationalEmailBestEffort(
    repository,
    {
      companyId: "10",
      eventType: "welcome",
      idempotencyKey: "welcome:customer:20",
      sourceEntityType: "customer",
      sourceEntityId: "20",
      customerId: "20",
    },
    sampleDetails,
    null,
    { config: emailConfig },
  );

  assert.equal(result.status, "skipped");
  assert.equal(result.reason, "duplicate_event");
  assert.equal(repository.state.messages.length, 0);
});
