const { ApiError, mapSqlError, validationError } = require('./errors');
const { hashSessionToken, readSessionTokenFromRequest } = require('./companyAuth');
const { parsePositiveInteger } = require('./validators');
const repository = require('./repository');

function json(status, body) {
  return {
    status,
    jsonBody: body
  };
}

function jsonWithHeaders(status, body, headers) {
  return {
    status,
    jsonBody: body,
    headers
  };
}

function created(body) {
  return json(201, body);
}

function ok(body) {
  return json(200, body);
}

function errorResponse(error) {
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

  return json(mapped.status || 500, body);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw validationError([{ field: 'body', message: 'Request body must be valid JSON.' }]);
  }
}

async function getCompanyId(request) {
  const pathCompanyId = parsePositiveInteger(request.params.companyId, 'companyId');
  const sessionToken = readSessionTokenFromRequest(request);

  if (sessionToken) {
    const identity = await repository.getAuthIdentityBySessionTokenHash(hashSessionToken(sessionToken));
    return parsePositiveInteger(identity.company.id, 'companyId');
  }

  const pilotCompanyId = parsePositiveInteger(process.env.PILOT_COMPANY_ID, 'PILOT_COMPANY_ID');

  if (pathCompanyId !== pilotCompanyId) {
    throw new ApiError(404, 'COMPANY_NOT_FOUND', 'Company was not found.');
  }

  return pathCompanyId;
}

function handle(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (context && context.error && !(error instanceof ApiError)) {
        context.error(error);
      }
      return errorResponse(error);
    }
  };
}

module.exports = {
  created,
  getCompanyId,
  handle,
  jsonWithHeaders,
  ok,
  readJson
};
