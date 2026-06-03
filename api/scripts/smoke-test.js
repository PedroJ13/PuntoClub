const { loadLocalSettings } = require('./load-local-settings');

loadLocalSettings();

const baseUrl = (process.env.API_BASE_URL || 'http://localhost:7071/api').replace(/\/$/, '');
const companyId = process.env.PILOT_COMPANY_ID || '1';

async function request(method, path, body, expectedStatus) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status !== expectedStatus) {
    throw new Error(`${method} ${path} expected ${expectedStatus}, got ${response.status}: ${text}`);
  }

  return data;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const suffix = Date.now();
  const settings = await request('GET', `/companies/${companyId}/settings`, null, 200);
  assert(settings.id === String(companyId), 'Company settings id must match PILOT_COMPANY_ID as string.');
  assert(settings.status === 'active', 'Company settings must return active company.');
  assert(typeof settings.updatedAt === 'string' && /^\d{4}-\d{2}-\d{2}T.*Z$/.test(settings.updatedAt), 'Company settings updatedAt must be a UTC timestamp.');

  const customer = await request('POST', `/companies/${companyId}/customers`, {
    name: `QA Smoke ${suffix}`,
    phone: `+506${String(suffix).slice(-8)}`,
    email: `qa-${suffix}@puntoclub.test`
  }, 201);
  assert(typeof customer.id === 'string', 'Customer id must be serialized as string.');

  await request('GET', `/companies/${companyId}/customers?search=${encodeURIComponent(customer.phone)}`, null, 200);

  const purchase = await request('POST', `/companies/${companyId}/purchases`, {
    customerId: customer.id,
    invoiceNumber: `SMOKE-${suffix}`,
    purchaseDate: '2026-06-02',
    amount: 1000
  }, 201);
  assert(typeof purchase.id === 'string', 'Purchase id must be serialized as string.');
  assert(typeof purchase.customerId === 'string', 'Purchase customerId must be serialized as string.');

  const balanceBefore = await request('GET', `/companies/${companyId}/customers/${customer.id}/balance`, null, 200);
  assert(typeof balanceBefore.customerId === 'string', 'Balance customerId must be serialized as string.');

  const redemption = await request('POST', `/companies/${companyId}/redemptions`, {
    customerId: customer.id,
    redemptionDate: '2026-06-02',
    pointsRedeemed: 1,
    note: 'Smoke test redemption'
  }, 201);
  assert(typeof redemption.id === 'string', 'Redemption id must be serialized as string.');
  assert(typeof redemption.customerId === 'string', 'Redemption customerId must be serialized as string.');
  assert(/^\d{4}-\d{2}-\d{2}T.*Z$/.test(redemption.createdAt), 'Redemption createdAt must be a complete UTC timestamp.');

  const activity = await request('GET', `/companies/${companyId}/customers/${customer.id}/activity`, null, 200);
  const balanceAfter = await request('GET', `/companies/${companyId}/customers/${customer.id}/balance`, null, 200);

  console.log(JSON.stringify({
    ok: true,
    customerId: customer.id,
    balanceBefore,
    balanceAfter,
    activityItems: activity.items.length
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
