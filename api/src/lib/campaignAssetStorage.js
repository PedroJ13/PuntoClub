const crypto = require("node:crypto");
const { ApiError } = require("./errors");
const {
  getLogoExtension,
  parseMultipartFile,
  uploadLogoBlob,
  downloadLogoBlob,
} = require("./logoStorage");

const defaultMaxBytes = 1048576;
const defaultAllowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

function getCampaignAssetConfig(env = process.env) {
  const account = env.CAMPAIGN_ASSET_STORAGE_ACCOUNT || env.LOGO_STORAGE_ACCOUNT;
  const container = env.CAMPAIGN_ASSET_CONTAINER || "campaign-assets";
  const maxBytes = Number(env.CAMPAIGN_ASSET_MAX_BYTES || defaultMaxBytes);
  const allowedMimeTypes = String(
    env.CAMPAIGN_ASSET_ALLOWED_MIME_TYPES ||
      defaultAllowedMimeTypes.join(","),
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    account: account && account.trim(),
    container,
    maxBytes:
      Number.isInteger(maxBytes) && maxBytes > 0
        ? maxBytes
        : defaultMaxBytes,
    allowedMimeTypes: allowedMimeTypes.length
      ? allowedMimeTypes
      : defaultAllowedMimeTypes,
  };
}

function getFilenameExtension(filename) {
  const match = String(filename || "").toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : null;
}

function isMatchingExtension(contentType, extension) {
  if (!extension) {
    return true;
  }

  if (contentType === "image/png") {
    return extension === "png";
  }

  if (contentType === "image/jpeg") {
    return ["jpg", "jpeg"].includes(extension);
  }

  if (contentType === "image/webp") {
    return extension === "webp";
  }

  return false;
}

function hasValidMagicBytes(contentType, buffer) {
  if (contentType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  if (contentType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (contentType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

function validateCampaignImageFile(file, options = {}) {
  const allowedMimeTypes = options.allowedMimeTypes || defaultAllowedMimeTypes;
  const contentType = file && file.contentType;
  const size = Number(file && file.size);
  const extension = getFilenameExtension(file && file.filename);

  if (!file || !file.buffer || !Number.isInteger(size) || size <= 0) {
    throw new ApiError(
      400,
      "PROMOTIONAL_CAMPAIGN_IMAGE_REQUIRED",
      "Campaign image file is required.",
      [{ field: "campaignImage", message: "Campaign image file is required." }],
    );
  }

  if (!allowedMimeTypes.includes(contentType)) {
    throw new ApiError(
      415,
      "PROMOTIONAL_CAMPAIGN_IMAGE_UNSUPPORTED_TYPE",
      "Campaign image must be a PNG, JPEG, or WebP image.",
      [
        {
          field: "campaignImage",
          message: "Campaign image must be a PNG, JPEG, or WebP image.",
        },
      ],
    );
  }

  if (size > Number(options.maxBytes || defaultMaxBytes)) {
    throw new ApiError(
      413,
      "PROMOTIONAL_CAMPAIGN_IMAGE_TOO_LARGE",
      "Campaign image exceeds the allowed size.",
      [
        {
          field: "campaignImage",
          message: "Campaign image exceeds the allowed size.",
        },
      ],
    );
  }

  if (extension === "svg" || !isMatchingExtension(contentType, extension)) {
    throw new ApiError(
      415,
      "PROMOTIONAL_CAMPAIGN_IMAGE_UNSUPPORTED_TYPE",
      "Campaign image extension does not match its content type.",
      [
        {
          field: "campaignImage",
          message: "Campaign image must be a PNG, JPEG, or WebP image.",
        },
      ],
    );
  }

  if (!hasValidMagicBytes(contentType, file.buffer)) {
    throw new ApiError(
      400,
      "PROMOTIONAL_CAMPAIGN_IMAGE_INVALID",
      "Campaign image content does not match its content type.",
      [
        {
          field: "campaignImage",
          message: "Campaign image content does not match its content type.",
        },
      ],
    );
  }

  return {
    contentType,
    originalFileName: String(file.filename || "campaign-image").slice(0, 255),
    size,
    checksumSha256: crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex"),
  };
}

function buildCampaignImageBlobPath(
  companyId,
  campaignId,
  contentType,
  id = crypto.randomUUID(),
) {
  return `companies/${encodeURIComponent(
    String(companyId),
  )}/campaigns/${encodeURIComponent(
    String(campaignId),
  )}/images/${id}.${getLogoExtension(contentType)}`;
}

function parseCampaignImageMultipart(buffer, contentType) {
  return parseMultipartFile(buffer, contentType, "file", "campaignImage");
}

async function uploadCampaignImageBlob(blobPath, buffer, contentType, options = {}) {
  return uploadLogoBlob(blobPath, buffer, contentType, {
    ...options,
    config: options.config || getCampaignAssetConfig(),
  });
}

async function downloadCampaignImageBlob(blobPath, options = {}) {
  try {
    return await downloadLogoBlob(blobPath, {
      ...options,
      config: options.config || getCampaignAssetConfig(),
    });
  } catch (error) {
    if (error instanceof ApiError && error.code === "COMPANY_LOGO_NOT_FOUND") {
      throw new ApiError(
        404,
        "PROMOTIONAL_CAMPAIGN_IMAGE_NOT_FOUND",
        "Campaign image was not found.",
      );
    }
    throw error;
  }
}

module.exports = {
  buildCampaignImageBlobPath,
  downloadCampaignImageBlob,
  getCampaignAssetConfig,
  parseCampaignImageMultipart,
  uploadCampaignImageBlob,
  validateCampaignImageFile,
};
