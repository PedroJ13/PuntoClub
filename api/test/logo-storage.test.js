const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildLogoBlobPath,
  buildRegistrationRequestLogoBlobPath,
  getLogoConfig,
  getLogoExtension,
  parseMultipartFile,
  uploadLogoBlob,
  validateLogoFile
} = require('../src/lib/logoStorage');

const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function multipartBody(boundary, filename, contentType, content) {
  return Buffer.concat([
    Buffer.from(`--${boundary}\r\n`),
    Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
    Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
    content,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);
}

test('parseMultipartFile extracts logo file content and metadata', () => {
  const boundary = 'punto-club-boundary';
  const file = parseMultipartFile(
    multipartBody(boundary, 'logo.png', 'image/png', pngBytes),
    `multipart/form-data; boundary=${boundary}`
  );

  assert.deepEqual(file.buffer, pngBytes);
  assert.equal(file.size, pngBytes.length);
  assert.equal(file.filename, 'logo.png');
  assert.equal(file.contentType, 'image/png');
});

test('validateLogoFile accepts PNG metadata and magic bytes', () => {
  const metadata = validateLogoFile({
    buffer: pngBytes,
    size: pngBytes.length,
    filename: 'logo.png',
    contentType: 'image/png'
  });

  assert.deepEqual(metadata, {
    contentType: 'image/png',
    size: pngBytes.length,
    filename: 'logo.png'
  });
});

test('validateLogoFile rejects SVG logos with unsupported media type', () => {
  assert.throws(
    () => validateLogoFile({
      buffer: Buffer.from('<svg></svg>'),
      size: 11,
      filename: 'logo.svg',
      contentType: 'image/svg+xml'
    }),
    (error) => error.status === 415 &&
      error.code === 'UNSUPPORTED_MEDIA_TYPE' &&
      error.details[0].field === 'logoFile'
  );
});

test('validateLogoFile rejects oversize logos', () => {
  assert.throws(
    () => validateLogoFile({
      buffer: pngBytes,
      size: pngBytes.length,
      filename: 'logo.png',
      contentType: 'image/png'
    }, { maxBytes: pngBytes.length - 1 }),
    (error) => error.status === 413 &&
      error.code === 'UPLOAD_TOO_LARGE' &&
      error.details[0].field === 'logoFile'
  );
});

test('validateLogoFile rejects content type and extension mismatch', () => {
  assert.throws(
    () => validateLogoFile({
      buffer: pngBytes,
      size: pngBytes.length,
      filename: 'logo.jpg',
      contentType: 'image/png'
    }),
    (error) => error.status === 415 &&
      error.code === 'UNSUPPORTED_MEDIA_TYPE' &&
      error.details[0].field === 'logoFile'
  );
});

test('validateLogoFile rejects magic byte mismatch', () => {
  assert.throws(
    () => validateLogoFile({
      buffer: Buffer.from('not a png'),
      size: 9,
      filename: 'logo.png',
      contentType: 'image/png'
    }),
    (error) => error.status === 400 &&
      error.code === 'LOGO_FILE_UNREADABLE' &&
      error.details[0].field === 'logoFile'
  );
});

test('uploadLogoBlob maps storage failure to safe logo storage error', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false });

  try {
    await assert.rejects(
      () => uploadLogoBlob('registration-requests/1/logo/private.png', pngBytes, 'image/png', {
        config: { account: 'stlogos', container: 'company-logos' },
        token: 'synthetic-token'
      }),
      (error) => error.status === 503 &&
        error.code === 'LOGO_STORAGE_UNAVAILABLE' &&
        !JSON.stringify(error).includes('registration-requests/1/logo/private.png') &&
        !JSON.stringify(error).includes('synthetic-token')
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('buildLogoBlobPath scopes generated paths by company id', () => {
  assert.match(
    buildLogoBlobPath('10', 'image/webp', 'logo-id'),
    /^companies\/10\/logo\/logo-id\.webp$/
  );
  assert.equal(getLogoExtension('image/jpeg'), 'jpg');
});

test('buildRegistrationRequestLogoBlobPath scopes generated paths by request key', () => {
  assert.match(
    buildRegistrationRequestLogoBlobPath('request-10', 'image/png', 'logo-id'),
    /^registration-requests\/request-10\/logo\/logo-id\.png$/
  );
});

test('getLogoConfig reads storage config with safe defaults', () => {
  assert.deepEqual(getLogoConfig({
    LOGO_STORAGE_ACCOUNT: 'stlogos',
    LOGO_CONTAINER: 'company-logos',
    LOGO_MAX_BYTES: '2048',
    LOGO_ALLOWED_MIME_TYPES: 'image/png,image/webp'
  }), {
    account: 'stlogos',
    container: 'company-logos',
    maxBytes: 2048,
    allowedMimeTypes: ['image/png', 'image/webp']
  });
});
