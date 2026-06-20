const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError } = require('../src/lib/errors');
const {
  createInternalRegistrationEmail,
  createRequesterAcknowledgementEmail,
  defaultInternalNotificationEmail,
  getEmailConfig,
  notifyCompanyRegistrationSubmitted,
  sendEmailViaAcs
} = require('../src/lib/notifier');
const {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationApprovedResponse,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationLogoResponse,
  formatCompanyRegistrationRequestListResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
} = require('../src/lib/companyRegistration');

const sampleRegistrationRequest = {
  id: '123',
  companyName: 'Cafe Central',
  companyEmail: 'hola@cafecentral.test',
  companyPhone: '+50622223333',
  companyAddress: 'San Jose',
  contactName: 'Maria Soto',
  contactEmail: 'maria@cafecentral.test',
  contactPhone: '+50688889999',
  status: 'pending',
  createdAt: '2026-06-07T18:30:00.000Z',
  requestedLogo: {
    available: true,
    contentType: 'image/png'
  }
};

test('formatCompanyRegistrationCreatedResponse returns public submission contract', () => {
  assert.deepEqual(
    formatCompanyRegistrationCreatedResponse({
      id: '123',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyAddress: 'San Jose',
      status: 'pending',
      createdAt: '2026-06-07T18:30:00.000Z',
      contactEmail: 'owner@cafecentral.test'
    }),
    {
      id: '123',
      companyName: 'Cafe Central',
      companyEmail: 'hola@cafecentral.test',
      companyAddress: 'San Jose',
      contactEmail: 'owner@cafecentral.test',
      requestedLogo: undefined,
      status: 'pending',
      createdAt: '2026-06-07T18:30:00.000Z',
      message: 'Solicitud recibida.'
    }
  );
});

test('formatCompanyRegistrationRejectedResponse returns compact review contract', () => {
  assert.deepEqual(
    formatCompanyRegistrationRejectedResponse({
      id: '123',
      status: 'rejected',
      reviewedAt: '2026-06-07T19:00:00.000Z',
      reviewNote: 'Missing business data.'
    }),
    {
      id: '123',
      status: 'rejected',
      reviewedAt: '2026-06-07T19:00:00.000Z'
    }
  );
});

test('assertCompanyRegistrationReviewEnabled blocks review endpoints by default', () => {
  assert.throws(
    () => assertCompanyRegistrationReviewEnabled({}),
    (error) => error instanceof ApiError && error.status === 403 && error.code === 'FORBIDDEN'
  );

  assert.doesNotThrow(() => assertCompanyRegistrationReviewEnabled({ COMPANY_REGISTRATION_REVIEW_ENABLED: 'true' }));
});

test('getCompanyRegistrationReviewActorLabel defaults and trims configured actor', () => {
  assert.equal(getCompanyRegistrationReviewActorLabel({}), 'internal');
  assert.equal(getCompanyRegistrationReviewActorLabel({ COMPANY_REGISTRATION_REVIEW_ACTOR_LABEL: ' Admin API ' }), 'Admin API');
});

test('formatCompanyRegistrationApprovedAuditEvent builds approved audit payload', () => {
  assert.deepEqual(
    formatCompanyRegistrationApprovedAuditEvent(
      {
        id: '123',
        reviewedByLabel: 'Admin API',
        company: {
          id: '456'
        }
      },
      { invocationId: 'invocation-1' }
    ),
    {
      companyId: '456',
      eventType: 'company.registration.approved',
      entityType: 'company_registration_request',
      entityId: '123',
      actorLabel: 'Admin API',
      metadata: {
        approvedCompanyId: '456',
        requestId: 'invocation-1'
      }
    }
  );
});

test('formatCompanyRegistrationApprovedResponse includes invitation summary without token material', () => {
  const response = formatCompanyRegistrationApprovedResponse({
    id: '123',
    companyName: 'Cafe Central',
    companyEmail: 'owner@cafecentral.test',
    companyPhone: '+50622223333',
    companyAddress: 'San Jose',
    contactName: 'Maria Soto',
    contactEmail: 'maria@cafecentral.test',
    contactPhone: '+50688889999',
    requestedLogo: {
      available: true,
      contentType: 'image/png'
    },
    status: 'approved',
    reviewedAt: '2026-06-07T19:01:00.000Z',
    reviewedByLabel: 'internal',
    reviewNote: null,
    approvedCompanyId: '10',
    createdAt: '2026-06-07T18:30:00.000Z',
    updatedAt: '2026-06-07T19:01:00.000Z',
    company: {
      id: '10',
      name: 'Cafe Central',
      email: 'owner@cafecentral.test',
      status: 'pending_activation'
    },
    invitation: {
      id: '300',
      companyId: '10',
      email: 'owner@cafecentral.test',
      role: 'owner',
      status: 'pending',
      expiresAt: '2026-06-14T19:00:00.000Z',
      createdAt: '2026-06-07T19:02:00.000Z',
      token: 'raw-token',
      tokenHash: 'hash'
    }
  });

  assert.deepEqual(response.invitation, {
    id: '300',
    companyId: '10',
    email: 'owner@cafecentral.test',
    role: 'owner',
    status: 'pending',
    expiresAt: '2026-06-14T19:00:00.000Z',
    createdAt: '2026-06-07T19:02:00.000Z'
  });
  assert.equal(JSON.stringify(response).includes('raw-token'), false);
  assert.equal(JSON.stringify(response).includes('hash'), false);
});

test('formatCompanyRegistrationRequestListResponse includes safe invitation summary only', () => {
  const response = formatCompanyRegistrationRequestListResponse({
    status: 'all',
    limit: 25,
    items: [{
      id: '123',
      companyName: 'Cafe Central',
      companyEmail: 'owner@cafecentral.test',
      companyPhone: '+50622223333',
      companyAddress: 'San Jose',
      contactName: 'Maria Soto',
      contactEmail: 'maria@cafecentral.test',
      contactPhone: '+50688889999',
      requestedLogo: {
        available: true,
        contentType: 'image/png'
      },
      status: 'approved',
      reviewedAt: '2026-06-07T19:01:00.000Z',
      reviewedByLabel: 'internal',
      reviewNote: null,
      approvedCompanyId: '10',
      createdAt: '2026-06-07T18:30:00.000Z',
      updatedAt: '2026-06-07T19:01:00.000Z',
      invitation: {
        id: '300',
        companyId: '10',
        email: 'owner@cafecentral.test',
        role: 'owner',
        status: 'pending',
        expiresAt: '2026-06-14T19:00:00.000Z',
        acceptedAt: null,
        revokedAt: null,
        createdAt: '2026-06-07T19:02:00.000Z',
        token: 'raw-token',
        tokenHash: 'hash',
        createdByLabel: 'internal'
      }
    }]
  });

  assert.equal(response.status, 'all');
  assert.equal(response.limit, 25);
  assert.deepEqual(response.items[0].invitation, {
    id: '300',
    companyId: '10',
    email: 'owner@cafecentral.test',
    role: 'owner',
    status: 'pending',
    expiresAt: '2026-06-14T19:00:00.000Z',
    acceptedAt: null,
    revokedAt: null,
    createdAt: '2026-06-07T19:02:00.000Z'
  });
  assert.equal(JSON.stringify(response).includes('raw-token'), false);
  assert.equal(JSON.stringify(response).includes('hash'), false);
});

test('formatCompanyRegistrationLogoResponse returns private binary image response', () => {
  const body = Buffer.from([1, 2, 3, 4]);
  const response = formatCompanyRegistrationLogoResponse(body, {
    contentType: 'image/png',
    blobPath: 'registration-requests/123/logo/private.png'
  });

  assert.equal(response.status, 200);
  assert.equal(response.body, body);
  assert.deepEqual(response.headers, {
    'Cache-Control': 'private, no-store',
    'Content-Length': '4',
    'Content-Type': 'image/png',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });
  assert.equal(JSON.stringify(response).includes('registration-requests/123/logo/private.png'), false);
});

test('getEmailConfig enables ACS email only when required settings exist', () => {
  assert.deepEqual(
    getEmailConfig({}),
    {
      connectionString: '',
      senderAddress: '',
      senderDisplayName: 'Punto Club',
      internalNotificationEmail: defaultInternalNotificationEmail,
      publicBaseUrl: '',
      enabled: false
    }
  );

  assert.equal(
    getEmailConfig({
      ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
      ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
      INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test'
    }).enabled,
    true
  );
});

test('email templates use approved copy and escape HTML content', () => {
  const config = getEmailConfig({
    ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
    ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
    INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test'
  });
  const request = {
    ...sampleRegistrationRequest,
    companyName: '<Cafe Central>'
  };

  const internal = createInternalRegistrationEmail(request, config);
  const acknowledgement = createRequesterAcknowledgementEmail(request, config);

  assert.equal(internal.subject, 'Punto Club - Nueva solicitud de empresa: <Cafe Central>');
  assert.match(internal.plainText, /Hay una nueva solicitud de empresa/);
  assert.match(internal.plainText, /Logo: Adjunto/);
  assert.match(internal.html, /&lt;Cafe Central&gt;/);
  assert.equal(internal.to[0].address, 'ops@example.test');

  assert.equal(acknowledgement.subject, 'Punto Club - Recibimos tu solicitud');
  assert.match(acknowledgement.plainText, /Recibimos la solicitud para/);
  assert.equal(acknowledgement.to[0].address, 'maria@cafecentral.test');
});

test('notifyCompanyRegistrationSubmitted sends internal and acknowledgement emails through injected adapter', async () => {
  const sentMessages = [];
  const result = await notifyCompanyRegistrationSubmitted(sampleRegistrationRequest, null, {
    config: getEmailConfig({
      ACS_EMAIL_CONNECTION_STRING: 'endpoint=https://example.communication.azure.com/;accesskey=secret',
      ACS_EMAIL_SENDER_ADDRESS: 'DoNotReply@example.test',
      ACS_EMAIL_SENDER_DISPLAY_NAME: 'Punto Club',
      INTERNAL_NOTIFICATION_EMAIL: 'ops@example.test'
    }),
    sendEmail: async (message) => {
      sentMessages.push(message);
      return { provider: 'mock', status: 'sent', id: `email-${sentMessages.length}` };
    }
  });

  assert.equal(result.status, 'sent');
  assert.equal(sentMessages.length, 2);
  assert.equal(sentMessages[0].to[0].address, 'ops@example.test');
  assert.equal(sentMessages[1].to[0].address, 'maria@cafecentral.test');
  assert.deepEqual(
    result.results.map((item) => ({ type: item.type, status: item.status })),
    [
      { type: 'internal', status: 'sent' },
      { type: 'requester_ack', status: 'sent' }
    ]
  );
});

test('notifyCompanyRegistrationSubmitted skips safely when ACS email is not configured', async () => {
  const result = await notifyCompanyRegistrationSubmitted(sampleRegistrationRequest, null, { env: {} });

  assert.deepEqual(result, { provider: 'acs-email', status: 'skipped', reason: 'not_configured' });
});

test('sendEmailViaAcs maps SDK poller result without exposing configuration', async () => {
  class MockEmailClient {
    constructor(connectionString) {
      this.connectionString = connectionString;
    }

    async beginSend(message) {
      assert.equal(this.connectionString, 'secret-connection-string');
      assert.equal(message.recipients.to[0].address, 'ops@example.test');
      return {
        async pollUntilDone() {
          return { id: 'operation-1' };
        }
      };
    }
  }

  const result = await sendEmailViaAcs(
    {
      senderAddress: 'DoNotReply@example.test',
      senderDisplayName: 'Punto Club',
      to: [{ address: 'ops@example.test' }],
      subject: 'Test',
      plainText: 'Hello',
      html: '<p>Hello</p>'
    },
    { connectionString: 'secret-connection-string' },
    { EmailClient: MockEmailClient }
  );

  assert.deepEqual(result, { provider: 'acs-email', status: 'sent', id: 'operation-1' });
});
