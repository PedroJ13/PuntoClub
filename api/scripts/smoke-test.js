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

async function main() {
  const suffix = Date.now();
  const customer = await request('POST', `/companies/${companyId}/customers`, {
    name: `QA Smoke ${suffix}`,
    phone: `+506${String(suffix).slice(-8)}`,
    email: `qa-${suffix}@puntoclub.test`
  }, 201);

  await request('GET', `/companies/${companyId}/customers?search=${encodeURIComponent(customer.phone)}`, null, 200);

  await request('POST', `/companies/${companyId}/purchases`, {
    customerId: customer.id,
    invoiceNumber: `SMOKE-${suffix}`,
    purchaseDate: '2026-06-02',
    amount: 1000
  }, 201);

  const balanceBefore = await request('GET', `/companies/${companyId}/customers/${customer.id}/balance`, null, 200);

  await request('POST', `/companies/${companyId}/redemptions`, {
    customerId: customer.id,
    redemptionDate: '2026-06-02',
    pointsRedeemed: 1,
    note: 'Smoke test redemption'
  }, 201);

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
