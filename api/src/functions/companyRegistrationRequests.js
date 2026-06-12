const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const {
  assertCompanyRegistrationReviewEnabled,
  formatCompanyRegistrationApprovedAuditEvent,
  formatCompanyRegistrationApprovedResponse,
  formatCompanyRegistrationCreatedResponse,
  formatCompanyRegistrationRequestListResponse,
  formatCompanyRegistrationRejectedResponse,
  getCompanyRegistrationReviewActorLabel
} = require('../lib/companyRegistration');
const {
  formatCompanyInvitationCreatedAuditEvent,
  generateInvitationToken,
  getInvitationExpiresAt,
  hashInvitationToken
} = require('../lib/companyInvitations');
const { created, handle, ok, readJson } = require('../lib/http');
const { assertInternalAdminAuthorized } = require('../lib/internalAdmin');
const {
  buildRegistrationRequestLogoBlobPath,
  getLogoConfig,
  parseMultipartFile,
  uploadLogoBlob,
  validateLogoFile
} = require('../lib/logoStorage');
const {
  parsePositiveInteger,
  validateCompanyRegistrationRequestListQuery,
  validateCompanyRegistrationRequestPayload,
  validateCompanyRegistrationReviewPayload
} = require('../lib/validators');
const notifier = require('../lib/notifier');
const repository = require('../lib/repository');

function getContentType(request) {
  return request.headers && typeof request.headers.get === 'function'
    ? request.headers.get('content-type')
    : '';
}

function readMultipartTextField(buffer, contentType, fieldName) {
  const boundaryMatch = String(contentType || '').match(/multipart\/form-data;\s*boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    return null;
  }

  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const delimiter = Buffer.from(`--${boundary}`);
  let position = buffer.indexOf(delimiter);

  while (position >= 0) {
    const partStart = position + delimiter.length;
    if (buffer[partStart] === 45 && buffer[partStart + 1] === 45) {
      break;
    }

    const bodyStartMarker = Buffer.from('\r\n\r\n');
    const headersStart = partStart + 2;
    const headersEnd = buffer.indexOf(bodyStartMarker, headersStart);
    if (headersEnd < 0) {
      break;
    }

    const nextDelimiter = buffer.indexOf(delimiter, headersEnd + bodyStartMarker.length);
    if (nextDelimiter < 0) {
      break;
    }

    const headers = buffer.subarray(headersStart, headersEnd).toString('latin1');
    const nameMatch = headers.match(/content-disposition:[^\r\n]*name="([^"]+)"/i);
    if (nameMatch && nameMatch[1] === fieldName) {
      let content = buffer.subarray(headersEnd + bodyStartMarker.length, nextDelimiter);
      if (content.length >= 2 && content[content.length - 2] === 13 && content[content.length - 1] === 10) {
        content = content.subarray(0, content.length - 2);
      }
      return content.toString('utf8');
    }

    position = nextDelimiter;
  }

  return null;
}

function multipartFieldExists(buffer, contentType, fieldName) {
  return readMultipartTextField(buffer, contentType, fieldName) !== null ||
    new RegExp(`name="${fieldName}"`, 'i').test(buffer.toString('latin1'));
}

async function readCompanyRegistrationSubmission(request) {
  const contentType = getContentType(request);
  if (!/^multipart\/form-data/i.test(String(contentType || ''))) {
    return {
      payload: validateCompanyRegistrationRequestPayload(await readJson(request)),
      logo: null
    };
  }

  const body = Buffer.from(await request.arrayBuffer());
  const payloadText = readMultipartTextField(body, contentType, 'payload');
  if (!payloadText) {
    return {
      payload: validateCompanyRegistrationRequestPayload({}),
      logo: null
    };
  }

  let parsedPayload;
  try {
    parsedPayload = JSON.parse(payloadText);
  } catch {
    parsedPayload = {};
  }

  let logo = null;
  if (multipartFieldExists(body, contentType, 'file')) {
    const config = getLogoConfig();
    const file = parseMultipartFile(body, contentType);
    const metadata = validateLogoFile(file, {
      maxBytes: config.maxBytes,
      allowedMimeTypes: config.allowedMimeTypes
    });
    logo = {
      config,
      file,
      metadata
    };
  }

  return {
    payload: validateCompanyRegistrationRequestPayload(parsedPayload),
    logo
  };
}

app.http('createCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests',
  handler: handle(async (request, context) => {
    const { payload, logo } = await readCompanyRegistrationSubmission(request);
    const registrationRequest = await repository.createCompanyRegistrationRequest(payload);

    if (logo) {
      const blobPath = buildRegistrationRequestLogoBlobPath(registrationRequest.id, logo.metadata.contentType);
      await uploadLogoBlob(blobPath, logo.file.buffer, logo.metadata.contentType, { config: logo.config });
      Object.assign(
        registrationRequest,
        await repository.updateCompanyRegistrationRequestLogo(registrationRequest.id, {
          blobPath,
          contentType: logo.metadata.contentType
        })
      );
    }

    await notifier.notifyCompanyRegistrationSubmitted(registrationRequest, context);

    return created(formatCompanyRegistrationCreatedResponse(registrationRequest));
  })
});

app.http('listCompanyRegistrationRequests', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'company-registration-requests',
  handler: handle(async (request) => {
    assertCompanyRegistrationReviewEnabled();
    assertInternalAdminAuthorized(request);
    const filters = validateCompanyRegistrationRequestListQuery(request.query);
    const result = await repository.listCompanyRegistrationRequests(filters);

    return ok(formatCompanyRegistrationRequestListResponse(result));
  })
});

app.http('approveCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/approve',
  handler: handle(async (request, context) => {
    assertCompanyRegistrationReviewEnabled();
    assertInternalAdminAuthorized(request);
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'approve');
    const invitationToken = generateInvitationToken();
    const result = await repository.approveCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel(),
      invitation: {
        tokenHash: hashInvitationToken(invitationToken),
        expiresAt: getInvitationExpiresAt()
      }
    });

    if (result.invitation) {
      await notifier.notifyCompanyInvitationCreated(result.invitation, invitationToken, context);
      await auditBestEffort(context, formatCompanyInvitationCreatedAuditEvent(result.invitation, context));
    }
    await auditBestEffort(context, formatCompanyRegistrationApprovedAuditEvent(result, context));

    return ok(formatCompanyRegistrationApprovedResponse(result));
  })
});

app.http('rejectCompanyRegistrationRequest', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'company-registration-requests/{requestId}/reject',
  handler: handle(async (request) => {
    assertCompanyRegistrationReviewEnabled();
    assertInternalAdminAuthorized(request);
    const requestId = parsePositiveInteger(request.params.requestId, 'requestId');
    const payload = validateCompanyRegistrationReviewPayload(await readJson(request), 'reject');
    const result = await repository.rejectCompanyRegistrationRequest(requestId, payload, {
      actorLabel: getCompanyRegistrationReviewActorLabel()
    });

    return ok(formatCompanyRegistrationRejectedResponse(result));
  })
});
