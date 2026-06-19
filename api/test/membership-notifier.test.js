const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createMembershipBenefitUsageCompanyEmail,
  createMembershipBenefitUsageCustomerEmail,
  getEmailConfig,
  notifyMembershipBenefitUsed
} = require('../src/lib/notifier');

const emailConfig = getEmailConfig({
  ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
  ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
  ACS_EMAIL_SENDER_DISPLAY_NAME: 'Punto Club',
  INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test'
});

const sampleDetails = {
  company: {
    id: '10',
    name: 'Cafe Central',
    email: 'owner@cafecentral.test'
  },
  customer: {
    id: '20',
    name: 'Maria Soto',
    email: 'maria@example.test'
  },
  benefit: {
    id: '700',
    name: '<Cafe mensual>',
    usageLimit: 1,
    usagePeriod: 'month'
  },
  membership: {
    id: '900',
    planName: 'Club Oro'
  },
  usage: {
    id: '1000',
    benefitName: '<Cafe mensual>',
    planName: 'Club Oro',
    usageDate: '2026-06-19',
    quantity: 1
  }
};

test('membership benefit usage emails use approved subject and escape content', () => {
  const companyEmail = createMembershipBenefitUsageCompanyEmail(sampleDetails, emailConfig);
  const customerEmail = createMembershipBenefitUsageCustomerEmail(sampleDetails, emailConfig);

  assert.equal(companyEmail.subject, 'Punto Club - Beneficio utilizado');
  assert.equal(customerEmail.subject, 'Punto Club - Beneficio utilizado');
  assert.equal(companyEmail.to[0].address, 'owner@cafecentral.test');
  assert.equal(customerEmail.to[0].address, 'maria@example.test');
  assert.match(companyEmail.plainText, /Se registro el uso efectivo de un beneficio limitado/);
  assert.match(customerEmail.plainText, /Se registro el uso efectivo del beneficio/);
  assert.match(companyEmail.html, /&lt;Cafe mensual&gt;/);
  assert.match(customerEmail.html, /&lt;Cafe mensual&gt;/);
});

test('notifyMembershipBenefitUsed sends company and customer emails through injected adapter', async () => {
  const sentMessages = [];
  const result = await notifyMembershipBenefitUsed(sampleDetails, null, {
    config: emailConfig,
    sendEmail: async (message) => {
      sentMessages.push(message);
      return { provider: 'mock', status: 'sent', id: `email-${sentMessages.length}` };
    }
  });

  assert.equal(result.status, 'sent');
  assert.equal(sentMessages.length, 2);
  assert.deepEqual(
    sentMessages.map((message) => message.to[0].address),
    ['owner@cafecentral.test', 'maria@example.test']
  );
  assert.deepEqual(
    result.results.map((item) => ({ type: item.type, status: item.status })),
    [
      { type: 'company', status: 'sent' },
      { type: 'customer', status: 'sent' }
    ]
  );
});

test('notifyMembershipBenefitUsed skips customer email when customer has no email', async () => {
  const sentMessages = [];
  const result = await notifyMembershipBenefitUsed({
    ...sampleDetails,
    customer: { ...sampleDetails.customer, email: null }
  }, null, {
    config: emailConfig,
    sendEmail: async (message) => {
      sentMessages.push(message);
      return { provider: 'mock', status: 'sent' };
    }
  });

  assert.equal(result.status, 'sent');
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].to[0].address, 'owner@cafecentral.test');
  assert.deepEqual(result.results.map((item) => item.type), ['company']);
});

test('notifyMembershipBenefitUsed records failures without throwing', async () => {
  const warnings = [];
  const result = await notifyMembershipBenefitUsed(sampleDetails, {
    warn: (message) => warnings.push(message)
  }, {
    config: emailConfig,
    sendEmail: async () => {
      throw new Error('provider unavailable');
    }
  });

  assert.equal(result.status, 'skipped');
  assert.equal(result.results.length, 2);
  assert.deepEqual(result.results.map((item) => item.status), ['failed', 'failed']);
  assert.equal(warnings.length, 2);
});
