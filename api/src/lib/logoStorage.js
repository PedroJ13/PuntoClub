const crypto = require('node:crypto');
const { ApiError, validationError } = require('./errors');
const { validateLogoFileMetadata } = require('./validators');

const defaultMaxBytes = 1048576;
const defaultAllowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
const storageApiVersion = '2023-11-03';

function getLogoConfig(env = process.env) {
  const account = env.LOGO_STORAGE_ACCOUNT;
  const container = env.LOGO_CONTAINER || 'company-logos';
  const maxBytes = Number(env.LOGO_MAX_BYTES || defaultMaxBytes);
  const allowedMimeTypes = String(env.LOGO_ALLOWED_MIME_TYPES || defaultAllowedMimeTypes.join(','))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    account: account && account.trim(),
    container,
    maxBytes: Number.isInteger(maxBytes) && maxBytes > 0 ? maxBytes : defaultMaxBytes,
    allowedMimeTypes: allowedMimeTypes.length ? allowedMimeTypes : defaultAllowedMimeTypes
  };
}

function getBoundary(contentType) {
  const match = String(contentType || '').match(/multipart\/form-data;\s*boundary=(?:"([^"]+)"|([^;]+))/i);
  return match ? (match[1] || match[2]).trim() : null;
}

function parsePartHeaders(buffer) {
  const text = buffer.toString('latin1');
  const headers = {};
  for (const line of text.split('\r\n')) {
    const separator = line.indexOf(':');
    if (separator > 0) {
      headers[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
    }
  }
  return headers;
}

function parseContentDisposition(value) {
  const result = {};
  for (const part of String(value || '').split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawValue.length) {
      continue;
    }
    result[rawKey.toLowerCase()] = rawValue.join('=').replace(/^"|"$/g, '');
  }
  return result;
}

function trimTrailingCrlf(buffer) {
  if (buffer.length >= 2 && buffer[buffer.length - 2] === 13 && buffer[buffer.length - 1] === 10) {
    return buffer.subarray(0, buffer.length - 2);
  }
  return buffer;
}

function parseMultipartFile(buffer, contentType, fieldName = 'file') {
  const boundary = getBoundary(contentType);
  if (!boundary) {
    throw validationError([{ field: 'logoFile', message: 'Logo upload must be multipart/form-data.' }]);
  }

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

    const headers = parsePartHeaders(buffer.subarray(headersStart, headersEnd));
    const disposition = parseContentDisposition(headers['content-disposition']);
    if (disposition.name === fieldName) {
      const content = trimTrailingCrlf(buffer.subarray(headersEnd + bodyStartMarker.length, nextDelimiter));
      return {
        buffer: content,
        size: content.length,
        filename: disposition.filename || null,
        contentType: headers['content-type'] || null
      };
    }

    position = nextDelimiter;
  }

  throw validationError([{ field: 'logoFile', message: 'Logo file is required.' }]);
}

function getLogoExtension(contentType) {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/jpeg') return 'jpg';
  if (contentType === 'image/webp') return 'webp';
  return 'bin';
}

function getFilenameExtension(filename) {
  const match = String(filename || '').toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : null;
}

function isMatchingExtension(contentType, extension) {
  if (!extension) {
    return true;
  }

  if (contentType === 'image/png') {
    return extension === 'png';
  }

  if (contentType === 'image/jpeg') {
    return ['jpg', 'jpeg'].includes(extension);
  }

  if (contentType === 'image/webp') {
    return extension === 'webp';
  }

  return false;
}

function hasValidMagicBytes(contentType, buffer) {
  if (contentType === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (contentType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (contentType === 'image/webp') {
    return buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return false;
}

function validateLogoFile(file, options = {}) {
  const allowedMimeTypes = options.allowedMimeTypes || defaultAllowedMimeTypes;
  const contentType = file && file.contentType;
  const size = Number(file && file.size);
  const extension = getFilenameExtension(file && file.filename);

  if (!allowedMimeTypes.includes(contentType)) {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Logo must be a PNG, JPEG, or WebP image.', [
      { field: 'logoFile', message: 'Logo must be a PNG, JPEG, or WebP image.' }
    ]);
  }

  if (Number.isInteger(size) && size > Number(options.maxBytes || defaultMaxBytes)) {
    throw new ApiError(413, 'UPLOAD_TOO_LARGE', 'Logo file exceeds the allowed size.', [
      { field: 'logoFile', message: 'Logo file exceeds the allowed size.' }
    ]);
  }

  if (extension === 'svg') {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'SVG logos are not allowed.', [
      { field: 'logoFile', message: 'Logo must be a PNG, JPEG, or WebP image.' }
    ]);
  }

  if (!isMatchingExtension(contentType, extension)) {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Logo file extension does not match its content type.', [
      { field: 'logoFile', message: 'Logo must be a PNG, JPEG, or WebP image.' }
    ]);
  }

  const metadata = validateLogoFileMetadata(file, options);

  if (!hasValidMagicBytes(metadata.contentType, file.buffer || Buffer.alloc(0))) {
    throw new ApiError(400, 'LOGO_FILE_UNREADABLE', 'Logo file could not be read as an image.', [
      { field: 'logoFile', message: 'Logo file content does not match its content type.' }
    ]);
  }

  return metadata;
}

function buildLogoBlobPath(companyId, contentType, id = crypto.randomUUID()) {
  return `companies/${encodeURIComponent(String(companyId))}/logo/${id}.${getLogoExtension(contentType)}`;
}

function buildRegistrationRequestLogoBlobPath(requestKey, contentType, id = crypto.randomUUID()) {
  return `registration-requests/${encodeURIComponent(String(requestKey))}/logo/${id}.${getLogoExtension(contentType)}`;
}

async function getManagedIdentityToken(env = process.env) {
  if (!env.IDENTITY_ENDPOINT || !env.IDENTITY_HEADER) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not configured.');
  }

  const url = new URL(env.IDENTITY_ENDPOINT);
  url.searchParams.set('api-version', '2019-08-01');
  url.searchParams.set('resource', 'https://storage.azure.com/');

  const response = await fetch(url, {
    headers: {
      'X-IDENTITY-HEADER': env.IDENTITY_HEADER
    }
  });

  if (!response.ok) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not available.');
  }

  const body = await response.json();
  return body.access_token;
}

function buildBlobUrl(config, blobPath) {
  return `https://${config.account}.blob.core.windows.net/${encodeURIComponent(config.container)}/${blobPath.split('/').map(encodeURIComponent).join('/')}`;
}

async function uploadLogoBlob(blobPath, buffer, contentType, options = {}) {
  const config = options.config || getLogoConfig();
  if (!config.account) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not configured.');
  }

  const token = options.token || await getManagedIdentityToken();
  const response = await fetch(buildBlobUrl(config, blobPath), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-ms-version': storageApiVersion,
      'x-ms-date': new Date().toUTCString(),
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': contentType
    },
    body: buffer
  });

  if (!response.ok) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not available.');
  }
}

async function downloadLogoBlob(blobPath, options = {}) {
  const config = options.config || getLogoConfig();
  if (!config.account) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not configured.');
  }

  const token = options.token || await getManagedIdentityToken();
  const response = await fetch(buildBlobUrl(config, blobPath), {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-ms-version': storageApiVersion,
      'x-ms-date': new Date().toUTCString()
    }
  });

  if (response.status === 404) {
    throw new ApiError(404, 'COMPANY_LOGO_NOT_FOUND', 'Company logo was not found.');
  }

  if (!response.ok) {
    throw new ApiError(503, 'LOGO_STORAGE_UNAVAILABLE', 'Logo storage is not available.');
  }

  return Buffer.from(await response.arrayBuffer());
}

module.exports = {
  buildLogoBlobPath,
  buildRegistrationRequestLogoBlobPath,
  downloadLogoBlob,
  getLogoConfig,
  getLogoExtension,
  parseMultipartFile,
  uploadLogoBlob,
  validateLogoFile
};
