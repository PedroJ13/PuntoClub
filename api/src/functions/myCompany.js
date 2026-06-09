const { app } = require('@azure/functions');
const { auditBestEffort } = require('../lib/audit');
const { ApiError } = require('../lib/errors');
const { handle, ok } = require('../lib/http');
const {
  buildLogoBlobPath,
  downloadLogoBlob,
  getLogoConfig,
  parseMultipartFile,
  uploadLogoBlob,
  validateLogoFile
} = require('../lib/logoStorage');
const repository = require('../lib/repository');
const { requireSessionIdentity } = require('./companyAuth');

function assertCanManageCompany(identity) {
  if (!['owner', 'admin'].includes(identity.user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Company user is not allowed to manage company logo.');
  }
}

app.http('uploadMyCompanyLogo', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'my-company/logo',
  handler: handle(async (request, context) => {
    const identity = await requireSessionIdentity(request);
    assertCanManageCompany(identity);

    const config = getLogoConfig();
    const body = Buffer.from(await request.arrayBuffer());
    const file = parseMultipartFile(body, request.headers.get('content-type'));
    const metadata = validateLogoFile(file, {
      maxBytes: config.maxBytes,
      allowedMimeTypes: config.allowedMimeTypes
    });
    const blobPath = buildLogoBlobPath(identity.company.id, metadata.contentType);

    await uploadLogoBlob(blobPath, file.buffer, metadata.contentType, { config });
    const company = await repository.updateCompanyLogo(identity.company.id, {
      blobPath,
      contentType: metadata.contentType
    });

    await auditBestEffort(context, {
      companyId: identity.company.id,
      eventType: 'company.logo.updated',
      entityType: 'company',
      entityId: identity.company.id,
      actorLabel: identity.user.email,
      metadata: {
        contentType: metadata.contentType,
        size: metadata.size,
        requestId: context && context.invocationId ? context.invocationId : null
      }
    });

    return ok({
      logoUrl: company.logoUrl,
      contentType: company.logoContentType,
      updatedAt: company.logoUpdatedAt
    });
  })
});

app.http('getMyCompanyLogo', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'my-company/logo',
  handler: handle(async (request) => {
    const identity = await requireSessionIdentity(request);
    const logo = await repository.getCompanyLogoMetadata(identity.company.id);
    const buffer = await downloadLogoBlob(logo.blobPath, { config: getLogoConfig() });

    return {
      status: 200,
      body: buffer,
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Length': String(buffer.length),
        'Content-Type': logo.contentType
      }
    };
  })
});
