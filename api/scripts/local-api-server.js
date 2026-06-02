const http = require('node:http');
const { URL } = require('node:url');

const { loadLocalSettings } = require('./load-local-settings');
const { ApiError, mapSqlError } = require('../src/lib/errors');
const repository = require('../src/lib/repository');
const {
  calculatePointsEarned,
  validateCustomerPayload,
  validatePurchasePayload,
  validateRedemptionPayload
} = require('../src/lib/validators');

loadLocalSettings();

function send(response, status, body) {
  response.writeHead(status, {
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-origin': '*',
    'content-type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(body));
}

function sendError(response, error) {
  const mapped = mapSqlError(error);
  const body = {
    error: {
      code: mapped.code,
      message: mapped.message
    }
  };
  if (mapped.details) {
    body.error.details = mapped.details;
  }
  send(response, mapped.status || 500, body);
}

function requirePilotCompany(pathCompanyId) {
  const companyId = Number(pathCompanyId);
  const pilotCompanyId = Number(process.env.PILOT_COMPANY_ID);
  if (!Number.isInteger(companyId) || companyId <= 0 || companyId !== pilotCompanyId) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }
  return companyId;
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function route(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const segments = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);

  if (segments[0] !== 'companies') {
    throw new ApiError(404, 'NOT_FOUND', 'Route was not found.');
  }

  const companyId = requirePilotCompany(segments[1]);
  await repository.ensureActiveCompany(companyId);

  if (request.method === 'GET' && segments.length === 3 && segments[2] === 'customers') {
    const items = await repository.listCustomers(companyId, url.searchParams.get('search'));
    return send(response, 200, { items });
  }

  if (request.method === 'POST' && segments.length === 3 && segments[2] === 'customers') {
    const customer = await repository.createCustomer(companyId, validateCustomerPayload(await readJson(request)));
    return send(response, 201, customer);
  }

  if (request.method === 'POST' && segments.length === 3 && segments[2] === 'purchases') {
    const company = await repository.ensureActiveCompany(companyId);
    const payload = validatePurchasePayload(await readJson(request));
    if (!(await repository.customerExists(companyId, payload.customerId))) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }
    const pointsEarned = calculatePointsEarned(payload.amount, company.points_percentage);
    const purchase = await repository.createPurchase(companyId, payload, pointsEarned);
    return send(response, 201, purchase);
  }

  if (request.method === 'POST' && segments.length === 3 && segments[2] === 'redemptions') {
    const redemption = await repository.createRedemption(companyId, validateRedemptionPayload(await readJson(request)));
    return send(response, 201, redemption);
  }

  if (request.method === 'GET' && segments.length === 5 && segments[2] === 'customers' && segments[4] === 'balance') {
    const balance = await repository.getBalance(companyId, Number(segments[3]));
    return send(response, 200, balance);
  }

  if (request.method === 'GET' && segments.length === 5 && segments[2] === 'customers' && segments[4] === 'activity') {
    const customerId = Number(segments[3]);
    if (!Number.isInteger(customerId) || customerId <= 0 || !(await repository.customerExists(companyId, customerId))) {
      throw new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
    }
    const [balance, items] = await Promise.all([
      repository.getBalance(companyId, customerId),
      repository.getActivity(companyId, customerId)
    ]);
    return send(response, 200, { customerId, balance, items });
  }

  throw new ApiError(404, 'NOT_FOUND', 'Route was not found.');
}

const port = Number(process.env.PORT || 7071);
const server = http.createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    return send(response, 204, {});
  }

  route(request, response).catch((error) => sendError(response, error));
});

server.listen(port, () => {
  console.log(`Punto Club local API listening on http://localhost:${port}/api`);
});
