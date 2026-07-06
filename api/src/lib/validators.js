const { validationError } = require("./errors");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const maxReportRangeDays = 31;
const allowedCompanyRoles = new Set(["owner", "admin", "staff"]);
const allowedCompanyStatuses = new Set([
  "pending_activation",
  "active",
  "inactive",
]);
const allowedRegistrationRequestStatuses = new Set([
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);
const allowedInvitationStatuses = new Set([
  "pending",
  "accepted",
  "revoked",
  "expired",
]);
const allowedCompanyUserStatuses = new Set(["invited", "active", "disabled"]);
const allowedLogoContentTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const allowedMembershipListStatuses = new Set(["active", "inactive", "all"]);
const allowedMembershipStatuses = new Set(["active", "inactive"]);
const allowedCustomerMembershipListStatuses = new Set([
  "active",
  "expired",
  "cancelled",
  "all",
]);
const allowedMembershipBenefitTypes = new Set([
  "informational",
  "discount",
  "allowance",
  "free_item",
]);
const allowedMembershipAppliesToTypes = new Set([
  "product",
  "service",
  "category",
  "text",
]);
const allowedMembershipUsagePeriods = new Set([
  "none",
  "day",
  "week",
  "month",
  "membership_term",
]);
const allowedMembershipPaymentMethods = new Set([
  "cash",
  "card",
  "credit",
  "transfer",
  "other",
]);
const allowedPromotionalCampaignStatuses = new Set([
  "draft",
  "ready",
  "sending",
  "sent",
  "cancelled",
  "failed",
  "all",
]);
const allowedPromotionalPreferenceStatuses = new Set([
  "subscribed",
  "unsubscribed",
  "suppressed",
  "all",
]);
const allowedOperationalEmailEventTypes = new Set([
  "welcome",
  "purchase",
  "redemption",
  "all",
]);
const allowedOperationalEmailStatuses = new Set([
  "pending",
  "skipped",
  "sent",
  "failed",
  "all",
]);

function parsePositiveInteger(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw validationError([
      { field, message: `${field} must be a positive integer.` },
    ]);
  }
  return number;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : value;
}

function normalizeEmail(value) {
  const email = normalizeText(value);
  return email ? email.toLowerCase() : email;
}

function validateOptionalText(value, field, maxLength, details) {
  const text = normalizeText(value);
  if (text && text.length > maxLength) {
    details.push({
      field,
      message: `${field} must be ${maxLength} characters or fewer.`,
    });
  }
  return text || null;
}

function validateRequiredText(value, field, maxLength, details) {
  const text = normalizeText(value);
  if (!text || text.length > maxLength) {
    details.push({
      field,
      message: `${field} is required and must be ${maxLength} characters or fewer.`,
    });
  }
  return text;
}

function validateEmailField(value, field, details, { required = true } = {}) {
  const email = normalizeEmail(value);
  if (
    (!email && required) ||
    (email && (email.length > 254 || !emailPattern.test(email)))
  ) {
    details.push({
      field,
      message: `${field} must be a valid email and 254 characters or fewer.`,
    });
  }
  return email || null;
}

function validateDate(value, field, details) {
  if (typeof value !== "string" || !isoDatePattern.test(value)) {
    details.push({ field, message: `${field} must use YYYY-MM-DD format.` });
  }
}

function parseIsoDate(value) {
  if (typeof value !== "string" || !isoDatePattern.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

function validateCustomerPayload(payload) {
  const details = [];
  const name = normalizeText(payload && payload.name);
  const phone = normalizeText(payload && payload.phone);
  const email = normalizeText(payload && payload.email);
  const birthDateValue = payload && payload.birthDate;
  const birthDate =
    birthDateValue === undefined ||
    birthDateValue === null ||
    birthDateValue === ""
      ? null
      : parseIsoDate(birthDateValue);

  if (!name || name.length > 160) {
    details.push({
      field: "name",
      message: "Name is required and must be 160 characters or fewer.",
    });
  }

  if (!phone || phone.length > 32) {
    details.push({
      field: "phone",
      message: "Phone is required and must be 32 characters or fewer.",
    });
  }

  if (email && (email.length > 254 || !emailPattern.test(email))) {
    details.push({
      field: "email",
      message: "Email must be valid and 254 characters or fewer.",
    });
  }

  if (
    birthDateValue !== undefined &&
    birthDateValue !== null &&
    birthDateValue !== "" &&
    !birthDate
  ) {
    details.push({
      field: "birthDate",
      message: "Birth date must use YYYY-MM-DD format.",
    });
  }

  if (birthDate && birthDate > new Date()) {
    details.push({
      field: "birthDate",
      message: "Birth date cannot be in the future.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    name,
    phone,
    email: email || null,
    birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : null,
  };
}

function validateCustomerPatchPayload(payload) {
  const details = [];
  const body = payload || {};
  const allowedFields = ["name", "phone", "email", "birthDate"];
  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );
  const patch = {};

  if (!providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable customer field must be provided.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(body, "name")) {
    const name = normalizeText(body.name);
    if (!name || name.length > 160) {
      details.push({
        field: "name",
        message: "Name must be provided and be 160 characters or fewer.",
      });
    } else {
      patch.name = name;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "phone")) {
    const phone = normalizeText(body.phone);
    if (!phone || phone.length > 32) {
      details.push({
        field: "phone",
        message: "Phone must be provided and be 32 characters or fewer.",
      });
    } else {
      patch.phone = phone;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "email")) {
    const email = normalizeText(body.email);
    if (email && (email.length > 254 || !emailPattern.test(email))) {
      details.push({
        field: "email",
        message: "Email must be valid and 254 characters or fewer.",
      });
    } else {
      patch.email = email || null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "birthDate")) {
    const value = body.birthDate;
    const birthDate =
      value === null || value === "" || value === undefined
        ? null
        : parseIsoDate(value);

    if (value !== null && value !== "" && value !== undefined && !birthDate) {
      details.push({
        field: "birthDate",
        message: "Birth date must use YYYY-MM-DD format.",
      });
    } else if (birthDate && birthDate > new Date()) {
      details.push({
        field: "birthDate",
        message: "Birth date cannot be in the future.",
      });
    } else {
      patch.birthDate = birthDate ? birthDate.toISOString().slice(0, 10) : null;
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { patch, providedFields };
}

function validateCompanySettingsPatchPayload(payload) {
  const details = [];
  const body = payload || {};
  const allowedFields = [
    "name",
    "email",
    "phone",
    "logoUrl",
    "pointsPercentage",
  ];
  const patch = {};
  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (!providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable company setting must be provided.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(body, "name")) {
    const name = normalizeText(body.name);
    if (!name || name.length > 160) {
      details.push({
        field: "name",
        message: "Name must be provided and be 160 characters or fewer.",
      });
    } else {
      patch.name = name;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "email")) {
    const email = normalizeText(body.email);
    if (email && (email.length > 254 || !emailPattern.test(email))) {
      details.push({
        field: "email",
        message: "Email must be valid and 254 characters or fewer.",
      });
    } else {
      patch.email = email || null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "phone")) {
    const phone = normalizeText(body.phone);
    if (phone && (phone.length < 7 || phone.length > 32)) {
      details.push({
        field: "phone",
        message: "Phone must be between 7 and 32 characters when provided.",
      });
    } else {
      patch.phone = phone || null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "logoUrl")) {
    const logoUrl = normalizeText(body.logoUrl);
    if (logoUrl) {
      try {
        const url = new URL(logoUrl);
        if (
          !["http:", "https:"].includes(url.protocol) ||
          logoUrl.length > 2048
        ) {
          details.push({
            field: "logoUrl",
            message:
              "Logo URL must be a valid http(s) URL and 2048 characters or fewer.",
          });
        } else {
          patch.logoUrl = logoUrl;
        }
      } catch {
        details.push({
          field: "logoUrl",
          message:
            "Logo URL must be a valid http(s) URL and 2048 characters or fewer.",
        });
      }
    } else {
      patch.logoUrl = null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "pointsPercentage")) {
    const pointsPercentage = Number(body.pointsPercentage);
    if (
      !Number.isFinite(pointsPercentage) ||
      pointsPercentage <= 0 ||
      pointsPercentage > 100
    ) {
      details.push({
        field: "pointsPercentage",
        message:
          "Points percentage must be greater than 0 and less than or equal to 100.",
      });
    } else {
      patch.pointsPercentage = pointsPercentage;
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    patch,
    providedFields,
  };
}

function parseOptionalBoolean(value, field, details) {
  if (typeof value !== "boolean") {
    details.push({ field, message: `${field} must be true or false.` });
    return false;
  }

  return value;
}

function validateOperationalEmailSettingsPayload(payload) {
  const details = [];
  const body = payload || {};
  const welcomeEnabled = parseOptionalBoolean(
    body.welcomeEnabled,
    "welcomeEnabled",
    details,
  );
  const purchaseEnabled = parseOptionalBoolean(
    body.purchaseEnabled,
    "purchaseEnabled",
    details,
  );
  const redemptionEnabled = parseOptionalBoolean(
    body.redemptionEnabled,
    "redemptionEnabled",
    details,
  );
  const replyToEmail = validateEmailField(
    body.replyToEmail,
    "replyToEmail",
    details,
    { required: false },
  );

  if (details.length) {
    throw validationError(details);
  }

  return {
    welcomeEnabled,
    purchaseEnabled,
    redemptionEnabled,
    replyToEmail,
  };
}

function validateOperationalEmailHistoryQuery(query) {
  const details = [];
  const from = query.get("from");
  const to = query.get("to");
  const type = normalizeText(query.get("type") || "all") || "all";
  const status = normalizeText(query.get("status") || "all") || "all";
  const search = normalizeText(query.get("search") || "") || "";
  const limitValue = query.get("limit") || "25";
  const allowedLimits = new Set(["10", "25", "50"]);
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({
      field: "from",
      message: "from is required and must use YYYY-MM-DD format.",
    });
  }

  if (!toDate) {
    details.push({
      field: "to",
      message: "to is required and must use YYYY-MM-DD format.",
    });
  }

  if (!allowedOperationalEmailEventTypes.has(type)) {
    details.push({
      field: "type",
      message: "type must be one of welcome, purchase, redemption, all.",
    });
  }

  if (!allowedOperationalEmailStatuses.has(status)) {
    details.push({
      field: "status",
      message: "status must be one of pending, skipped, sent, failed, all.",
    });
  }

  if (!allowedLimits.has(limitValue)) {
    details.push({
      field: "limit",
      message: "limit must be one of 10, 25, 50.",
    });
  }

  if (search.length > 254) {
    details.push({
      field: "search",
      message: "search must be 254 characters or fewer.",
    });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({
        field: "from",
        message: "from must be before or equal to to.",
      });
    } else {
      const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86400000 + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({
          field: "to",
          message: `Date range must be ${maxReportRangeDays} days or fewer.`,
        });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    from,
    to,
    type,
    status,
    search,
    limit: Number(limitValue),
  };
}

function validatePromotionalCampaignPayload(payload, options = {}) {
  const details = [];
  const body = payload || {};
  const partial = Boolean(options.partial);
  const allowedFields = [
    "name",
    "subject",
    "bodyText",
    "includePoints",
    "campaignType",
  ];
  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );
  const campaign = {};

  if (!partial || Object.prototype.hasOwnProperty.call(body, "name")) {
    campaign.name = validateRequiredText(body.name, "name", 160, details);
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "subject")) {
    campaign.subject = validateRequiredText(
      body.subject,
      "subject",
      200,
      details,
    );
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "bodyText")) {
    campaign.bodyText = validateRequiredText(
      body.bodyText,
      "bodyText",
      2000,
      details,
    );
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "includePoints")) {
    campaign.includePoints = parseOptionalBoolean(
      body.includePoints,
      "includePoints",
      details,
    );
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "campaignType")) {
    const campaignType = normalizeText(body.campaignType || "comun") || "comun";
    if (!["comun", "cumpleanos"].includes(campaignType)) {
      details.push({
        field: "campaignType",
        message: "campaignType must be comun or cumpleanos.",
      });
    } else {
      campaign.campaignType = campaignType;
    }
  }

  if (partial && !providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable campaign field must be provided.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return partial ? { patch: campaign, providedFields } : campaign;
}

function validatePromotionalCampaignListQuery(query) {
  const status = normalizeText(query.get("status") || "all") || "all";
  const limit = Number(query.get("limit") || 25);

  if (!allowedPromotionalCampaignStatuses.has(status)) {
    throw validationError([
      {
        field: "status",
        message:
          "status must be one of draft, ready, sending, sent, cancelled, failed, all.",
      },
    ]);
  }

  if (!Number.isInteger(limit) || ![10, 25, 50].includes(limit)) {
    throw validationError([
      { field: "limit", message: "limit must be one of 10, 25, 50." },
    ]);
  }

  return { status, limit };
}

function validatePromotionalRecipientQuery(query) {
  const status =
    normalizeText(query.get("status") || "subscribed") || "subscribed";
  const limit = Number(query.get("limit") || 25);
  const search = normalizeText(query.get("search") || "") || "";
  const birthdayOnly =
    String(query.get("birthdayOnly") || "").toLowerCase() === "true";
  const campaignIdValue = query.get("campaignId");
  const campaignId =
    campaignIdValue == null || campaignIdValue === ""
      ? null
      : Number(campaignIdValue);
  const details = [];

  if (!allowedPromotionalPreferenceStatuses.has(status)) {
    details.push({
      field: "status",
      message:
        "status must be one of subscribed, unsubscribed, suppressed, all.",
    });
  }

  if (!Number.isInteger(limit) || ![10, 25, 50].includes(limit)) {
    details.push({
      field: "limit",
      message: "limit must be one of 10, 25, 50.",
    });
  }

  if (
    campaignIdValue != null &&
    campaignIdValue !== "" &&
    (!Number.isInteger(campaignId) || campaignId <= 0)
  ) {
    details.push({
      field: "campaignId",
      message: "campaignId must be a positive integer when provided.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { status, limit, search, birthdayOnly, campaignId };
}

function validatePromotionalRecipientSelectionPayload(payload) {
  const details = [];
  const customerIds = Array.isArray(payload && payload.customerIds)
    ? payload.customerIds
    : null;

  if (!customerIds || customerIds.length === 0) {
    details.push({
      field: "customerIds",
      message: "Select at least one recipient.",
    });
  } else if (customerIds.length > 5) {
    details.push({
      field: "customerIds",
      message: "Promotional MVP allows up to 5 recipients per campaign.",
    });
  }

  const normalizedIds = (customerIds || []).map((value, index) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      details.push({
        field: `customerIds[${index}]`,
        message: "customerId must be a positive integer.",
      });
      return null;
    }
    return id;
  });

  if (
    new Set(normalizedIds.filter(Boolean)).size !==
    normalizedIds.filter(Boolean).length
  ) {
    details.push({
      field: "customerIds",
      message: "Recipient selection must not contain duplicates.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { customerIds: normalizedIds };
}

function validatePromotionalSendPayload(payload) {
  const body = payload || {};
  const recipientSelection = validatePromotionalRecipientSelectionPayload(body);

  if (body.confirmSend !== true) {
    throw validationError([
      {
        field: "confirmSend",
        message: "confirmSend must be true to send a promotional campaign.",
      },
    ]);
  }

  return { confirmSend: true, customerIds: recipientSelection.customerIds };
}

function validatePromotionalUnsubscribePayload(payload) {
  const details = [];
  const body = payload || {};
  const customerId = Number(body.customerId);
  const campaignId = body.campaignId == null ? null : Number(body.campaignId);
  const recipientId =
    body.recipientId == null ? null : Number(body.recipientId);
  const reason = validateOptionalText(body.reason, "reason", 300, details);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    details.push({
      field: "customerId",
      message: "customerId must be a positive integer.",
    });
  }

  if (
    campaignId != null &&
    (!Number.isInteger(campaignId) || campaignId <= 0)
  ) {
    details.push({
      field: "campaignId",
      message: "campaignId must be a positive integer when provided.",
    });
  }

  if (
    recipientId != null &&
    (!Number.isInteger(recipientId) || recipientId <= 0)
  ) {
    details.push({
      field: "recipientId",
      message: "recipientId must be a positive integer when provided.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { customerId, campaignId, recipientId, reason };
}

function validateCompanyRegistrationRequestPayload(payload) {
  const details = [];
  const body = payload || {};
  const companyName = validateRequiredText(
    body.companyName,
    "companyName",
    160,
    details,
  );
  const companyEmail = validateEmailField(
    body.companyEmail,
    "companyEmail",
    details,
  );
  const companyAddress = validateRequiredText(
    body.companyAddress,
    "companyAddress",
    300,
    details,
  );
  const companyPhone = validateOptionalText(
    body.companyPhone,
    "companyPhone",
    32,
    details,
  );
  const contactName = validateOptionalText(
    body.contactName,
    "contactName",
    160,
    details,
  );
  const contactEmail = validateEmailField(
    body.contactEmail,
    "contactEmail",
    details,
  );
  const contactPhone = validateOptionalText(
    body.contactPhone,
    "contactPhone",
    32,
    details,
  );

  for (const forbiddenField of ["requestedLogoUrl", "companyId", "password"]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} is not accepted for company registration.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    companyName,
    companyEmail,
    companyPhone,
    companyAddress,
    contactName,
    contactEmail,
    contactPhone,
  };
}

function validateCompanyRegistrationReviewPayload(payload, action) {
  const details = [];
  const body = payload || {};
  const reviewNote = validateOptionalText(
    body.reviewNote,
    "reviewNote",
    500,
    details,
  );
  const pointsPercentageProvided = Object.prototype.hasOwnProperty.call(
    body,
    "pointsPercentage",
  );
  const pointsPercentage = pointsPercentageProvided
    ? Number(body.pointsPercentage)
    : undefined;

  if (action === "reject" && !reviewNote) {
    details.push({
      field: "reviewNote",
      message:
        "reviewNote is required when rejecting a company registration request.",
    });
  }

  if (
    pointsPercentageProvided &&
    (!Number.isFinite(pointsPercentage) ||
      pointsPercentage <= 0 ||
      pointsPercentage > 100)
  ) {
    details.push({
      field: "pointsPercentage",
      message:
        "pointsPercentage must be greater than 0 and less than or equal to 100.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    reviewNote,
    pointsPercentage: pointsPercentageProvided ? pointsPercentage : undefined,
  };
}

function validateCompanyRegistrationRequestListQuery(query) {
  const details = [];
  const status = normalizeText(query.get("status") || "pending") || "pending";
  const limitValue = query.get("limit") || "25";
  const allowedStatuses = new Set([
    "all",
    ...allowedRegistrationRequestStatuses,
  ]);
  const allowedLimits = new Set(["10", "25", "50"]);

  if (!allowedStatuses.has(status)) {
    details.push({
      field: "status",
      message:
        "status must be one of all, pending, approved, rejected, cancelled.",
    });
  }

  if (!allowedLimits.has(limitValue)) {
    details.push({
      field: "limit",
      message: "limit must be one of 10, 25, 50.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    status,
    limit: Number(limitValue),
  };
}

function validateCompanyRole(value, field = "role") {
  const role = normalizeText(value || "owner");
  if (!allowedCompanyRoles.has(role)) {
    throw validationError([
      { field, message: `${field} must be one of owner, admin, staff.` },
    ]);
  }
  return role;
}

function validateCompanyInvitationPayload(payload) {
  const details = [];
  const body = payload || {};
  const companyId = Number(body.companyId);
  const registrationRequestId = Object.prototype.hasOwnProperty.call(
    body,
    "registrationRequestId",
  )
    ? Number(body.registrationRequestId)
    : null;
  const email = validateEmailField(body.email, "email", details);
  const role = normalizeText(body.role || "owner");

  if (!Number.isInteger(companyId) || companyId <= 0) {
    details.push({
      field: "companyId",
      message: "companyId must be a positive integer.",
    });
  }

  if (
    registrationRequestId != null &&
    (!Number.isInteger(registrationRequestId) || registrationRequestId <= 0)
  ) {
    details.push({
      field: "registrationRequestId",
      message: "registrationRequestId must be a positive integer.",
    });
  }

  if (!allowedCompanyRoles.has(role)) {
    details.push({
      field: "role",
      message: "role must be one of owner, admin, staff.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    companyId,
    registrationRequestId,
    email,
    role,
  };
}

function validateInvitationAcceptPayload(payload) {
  const details = [];
  const body = payload || {};
  const token = validateRequiredText(body.token, "token", 2048, details);
  const displayName = validateOptionalText(
    body.displayName,
    "displayName",
    160,
    details,
  );
  const password = validatePassword(body.password, "password", details);

  for (const forbiddenField of ["externalSubject", "companyId", "email"]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} must not be sent by the frontend.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    token,
    displayName,
    password,
  };
}

function validatePassword(value, field, details) {
  const password = typeof value === "string" ? value : "";
  if (
    password.length < 10 ||
    password.length > 128 ||
    !/[A-Za-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    details.push({
      field,
      message: `${field} must be 10 to 128 characters and include letters and numbers.`,
    });
  }
  return password;
}

function validateCompanyAuthLoginPayload(payload) {
  const details = [];
  const body = payload || {};
  const email = validateEmailField(body.email, "email", details);
  const password = typeof body.password === "string" ? body.password : "";

  if (!password || password.length > 128) {
    details.push({
      field: "password",
      message: "password is required and must be 128 characters or fewer.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    email,
    password,
  };
}

function validateCompanyPasswordChangePayload(payload) {
  const details = [];
  const body = payload || {};
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = validatePassword(
    body.newPassword,
    "newPassword",
    details,
  );
  const passwordConfirmation =
    typeof body.passwordConfirmation === "string"
      ? body.passwordConfirmation
      : "";

  if (!currentPassword || currentPassword.length > 128) {
    details.push({
      field: "currentPassword",
      message:
        "currentPassword is required and must be 128 characters or fewer.",
    });
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    details.push({
      field: "newPassword",
      message: "newPassword must be different from currentPassword.",
    });
  }

  if (!passwordConfirmation || passwordConfirmation !== newPassword) {
    details.push({
      field: "passwordConfirmation",
      message: "passwordConfirmation must match newPassword.",
    });
  }

  for (const forbiddenField of ["email", "companyId", "userId"]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} must not be sent by the frontend.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    currentPassword,
    newPassword,
  };
}

function validateMyCompanyPatchPayload(payload) {
  const details = [];
  const body = payload || {};
  const allowedFields = ["name", "phone", "address", "pointsPercentage"];
  const patch = {};
  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (!providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable company field must be provided.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(body, "name")) {
    patch.name = validateRequiredText(body.name, "name", 160, details);
  }

  if (Object.prototype.hasOwnProperty.call(body, "phone")) {
    patch.phone = validateOptionalText(body.phone, "phone", 32, details);
  }

  if (Object.prototype.hasOwnProperty.call(body, "address")) {
    patch.address = validateRequiredText(body.address, "address", 300, details);
  }

  if (Object.prototype.hasOwnProperty.call(body, "pointsPercentage")) {
    const pointsPercentage = Number(body.pointsPercentage);
    if (
      !Number.isFinite(pointsPercentage) ||
      pointsPercentage <= 0 ||
      pointsPercentage > 100
    ) {
      details.push({
        field: "pointsPercentage",
        message:
          "pointsPercentage must be greater than 0 and less than or equal to 100.",
      });
    } else {
      patch.pointsPercentage = pointsPercentage;
    }
  }

  for (const forbiddenField of [
    "email",
    "status",
    "logoUrl",
    "logoBlobPath",
    "companyId",
  ]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} is not editable through my-company.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    patch,
    providedFields,
  };
}

function validateLogoFileMetadata(file, options = {}) {
  const details = [];
  const maxBytes = Number(
    options.maxBytes || process.env.LOGO_MAX_BYTES || 1048576,
  );
  const contentType = normalizeText(file && file.contentType);
  const size = Number(file && file.size);
  const filename = normalizeText(file && file.filename);

  if (!contentType || !allowedLogoContentTypes.has(contentType)) {
    details.push({
      field: "file",
      message: "Logo must be a PNG, JPEG, or WebP image.",
    });
  }

  if (!Number.isInteger(size) || size <= 0) {
    details.push({
      field: "file",
      message: "Logo file size must be provided.",
    });
  } else if (Number.isFinite(maxBytes) && size > maxBytes) {
    details.push({
      field: "file",
      message: "Logo file exceeds the allowed size.",
    });
  }

  if (filename && filename.toLowerCase().endsWith(".svg")) {
    details.push({ field: "file", message: "SVG logos are not allowed." });
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    contentType,
    size,
    filename: filename || null,
  };
}

function isAllowedCompanyStatus(status) {
  return allowedCompanyStatuses.has(status);
}

function isAllowedRegistrationRequestStatus(status) {
  return allowedRegistrationRequestStatuses.has(status);
}

function isAllowedInvitationStatus(status) {
  return allowedInvitationStatuses.has(status);
}

function isAllowedCompanyUserStatus(status) {
  return allowedCompanyUserStatuses.has(status);
}

function validatePurchasePayload(payload) {
  const details = [];
  const invoiceNumber = normalizeText(payload && payload.invoiceNumber);
  const customerId = Number(payload && payload.customerId);
  const amount = Number(payload && payload.amount);
  const purchaseDate = payload && payload.purchaseDate;

  if (!Number.isInteger(customerId) || customerId <= 0) {
    details.push({
      field: "customerId",
      message: "Customer id must be a positive integer.",
    });
  }

  if (!invoiceNumber || invoiceNumber.length > 80) {
    details.push({
      field: "invoiceNumber",
      message: "Invoice number is required and must be 80 characters or fewer.",
    });
  }

  validateDate(purchaseDate, "purchaseDate", details);

  if (!Number.isFinite(amount) || amount <= 0) {
    details.push({
      field: "amount",
      message: "Amount must be greater than 0.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(payload || {}, "pointsEarned")) {
    details.push({
      field: "pointsEarned",
      message: "pointsEarned is calculated by the API and must not be sent.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { customerId, invoiceNumber, purchaseDate, amount };
}

function validateRedemptionPayload(payload) {
  const details = [];
  const customerId = Number(payload && payload.customerId);
  const pointsRedeemed = Number(payload && payload.pointsRedeemed);
  const redemptionDate = payload && payload.redemptionDate;
  const note = normalizeText(payload && payload.note);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    details.push({
      field: "customerId",
      message: "Customer id must be a positive integer.",
    });
  }

  validateDate(redemptionDate, "redemptionDate", details);

  if (!Number.isInteger(pointsRedeemed) || pointsRedeemed <= 0) {
    details.push({
      field: "pointsRedeemed",
      message: "Points redeemed must be a positive integer.",
    });
  }

  if (note && note.length > 500) {
    details.push({
      field: "note",
      message: "Note must be 500 characters or fewer.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { customerId, redemptionDate, pointsRedeemed, note: note || null };
}

function validateMembershipStatusQuery(query) {
  const status = normalizeText(query.get("status") || "active") || "active";

  if (!allowedMembershipListStatuses.has(status)) {
    throw validationError([
      {
        field: "status",
        message: "status must be one of active, inactive, all.",
      },
    ]);
  }

  return { status };
}

function validateCustomerMembershipStatusQuery(query) {
  const status = normalizeText(query.get("status") || "active") || "active";

  if (!allowedCustomerMembershipListStatuses.has(status)) {
    throw validationError([
      {
        field: "status",
        message: "status must be one of active, expired, cancelled, all.",
      },
    ]);
  }

  return { status };
}

function validateExpirationAlertsQuery(query) {
  const details = [];
  const status = normalizeText(query.get("status") || "active") || "active";
  const withinDaysValue = query.get("withinDays") || "5";
  const withinDays = Number(withinDaysValue);

  if (!allowedCustomerMembershipListStatuses.has(status) || status === "all") {
    details.push({
      field: "status",
      message: "status must be one of active, expired, cancelled.",
    });
  }

  if (!Number.isInteger(withinDays) || withinDays < 0 || withinDays > 365) {
    details.push({
      field: "withinDays",
      message: "withinDays must be an integer from 0 to 365.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { status, withinDays };
}

function validateMembershipActivationPayload(payload) {
  const details = [];
  const body = payload && typeof payload === "object" ? payload : {};
  const rawPlanId = Object.prototype.hasOwnProperty.call(body, "planId")
    ? body.planId
    : body.membershipPlanId;
  const planId = Number(rawPlanId);
  const startDate = body.startDate;
  const amountProvided =
    Object.prototype.hasOwnProperty.call(body, "amount") ||
    Object.prototype.hasOwnProperty.call(body, "pricePaid");
  const rawAmount = Object.prototype.hasOwnProperty.call(body, "amount")
    ? body.amount
    : body.pricePaid;
  const amount =
    amountProvided && rawAmount !== "" && rawAmount != null
      ? Number(rawAmount)
      : null;
  const paymentMethod = normalizeText(body.paymentMethod || "");
  const note = normalizeText(body.note);

  if (!Number.isInteger(planId) || planId <= 0) {
    details.push({
      field: "planId",
      message: "planId must be a positive integer.",
    });
  }

  validateDate(startDate, "startDate", details);
  if (startDate && !parseIsoDate(startDate)) {
    details.push({
      field: "startDate",
      message: "startDate must be a valid calendar date.",
    });
  }

  if (!allowedMembershipPaymentMethods.has(paymentMethod)) {
    details.push({
      field: "paymentMethod",
      message: "paymentMethod must be cash, card, credit, transfer, or other.",
    });
  }

  if (!amountProvided || !Number.isFinite(amount) || amount < 0) {
    details.push({
      field: "amount",
      message: "amount must be zero or greater.",
    });
  }

  if (note && note.length > 500) {
    details.push({
      field: "note",
      message: "note must be 500 characters or fewer.",
    });
  }

  for (const forbiddenField of [
    "companyId",
    "customerId",
    "endDate",
    "status",
    "transactionType",
    "createdByLabel",
  ]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} is calculated by the API and must not be sent.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    planId,
    startDate,
    pricePaid: amount,
    paymentMethod,
    note: note || null,
  };
}

function validateMembershipRenewalPayload(payload) {
  const details = [];
  const body = payload && typeof payload === "object" ? payload : {};
  const rawAmount = Object.prototype.hasOwnProperty.call(body, "amount")
    ? body.amount
    : body.pricePaid;
  const amount =
    rawAmount !== "" && rawAmount != null ? Number(rawAmount) : null;
  const paymentMethod = normalizeText(body.paymentMethod || "");
  const transactionDate =
    body.transactionDate || new Date().toISOString().slice(0, 10);
  const note = normalizeText(body.note);

  if (!allowedMembershipPaymentMethods.has(paymentMethod)) {
    details.push({
      field: "paymentMethod",
      message: "paymentMethod must be cash, card, credit, transfer, or other.",
    });
  }

  if (!Number.isFinite(amount) || amount < 0) {
    details.push({
      field: "amount",
      message: "amount must be zero or greater.",
    });
  }

  validateDate(transactionDate, "transactionDate", details);
  if (transactionDate && !parseIsoDate(transactionDate)) {
    details.push({
      field: "transactionDate",
      message: "transactionDate must be a valid calendar date.",
    });
  }

  if (note && note.length > 500) {
    details.push({
      field: "note",
      message: "note must be 500 characters or fewer.",
    });
  }

  for (const forbiddenField of [
    "companyId",
    "customerId",
    "customerMembershipId",
    "membershipPlanId",
    "transactionType",
    "createdByLabel",
  ]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} is calculated by the API and must not be sent.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    amount,
    paymentMethod,
    transactionDate,
    note: note || null,
  };
}

function validateMembershipBenefitUsagePayload(payload) {
  const details = [];
  const body = payload && typeof payload === "object" ? payload : {};
  const rawBenefitId = Object.prototype.hasOwnProperty.call(body, "benefitId")
    ? body.benefitId
    : body.membershipBenefitId;
  const benefitId = Number(rawBenefitId);
  const customerMembershipIdProvided = Object.prototype.hasOwnProperty.call(
    body,
    "customerMembershipId",
  );
  const customerMembershipId = customerMembershipIdProvided
    ? Number(body.customerMembershipId)
    : null;
  const usageDate = body.usageDate;
  const quantityProvided = Object.prototype.hasOwnProperty.call(
    body,
    "quantity",
  );
  const quantity =
    quantityProvided && body.quantity !== "" && body.quantity != null
      ? Number(body.quantity)
      : 1;
  const note = normalizeText(body.note);

  if (!Number.isInteger(benefitId) || benefitId <= 0) {
    details.push({
      field: "benefitId",
      message: "benefitId must be a positive integer.",
    });
  }

  if (
    customerMembershipIdProvided &&
    (!Number.isInteger(customerMembershipId) || customerMembershipId <= 0)
  ) {
    details.push({
      field: "customerMembershipId",
      message: "customerMembershipId must be a positive integer.",
    });
  }

  validateDate(usageDate, "usageDate", details);
  if (usageDate && !parseIsoDate(usageDate)) {
    details.push({
      field: "usageDate",
      message: "usageDate must be a valid calendar date.",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    details.push({
      field: "quantity",
      message: "quantity must be a positive integer.",
    });
  }

  if (note && note.length > 500) {
    details.push({
      field: "note",
      message: "note must be 500 characters or fewer.",
    });
  }

  for (const forbiddenField of [
    "companyId",
    "customerId",
    "usedAt",
    "createdByLabel",
    "usagePeriodStartDate",
  ]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} is calculated by the API and must not be sent.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    benefitId,
    customerMembershipId,
    usageDate,
    quantity,
    note: note || null,
  };
}

function validateMembershipBenefitUsageQuery(query) {
  const details = [];
  const from = query.get("from");
  const to = query.get("to");
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({
      field: "from",
      message: "from is required and must use YYYY-MM-DD format.",
    });
  }

  if (!toDate) {
    details.push({
      field: "to",
      message: "to is required and must use YYYY-MM-DD format.",
    });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({
        field: "from",
        message: "from must be before or equal to to.",
      });
    } else {
      const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86400000 + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({
          field: "to",
          message: `Date range must be ${maxReportRangeDays} days or fewer.`,
        });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { from, to };
}

function validateMembershipTransactionsQuery(query) {
  const details = [];
  const from = query.get("from");
  const to = query.get("to");
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({
      field: "from",
      message: "from is required and must use YYYY-MM-DD format.",
    });
  }

  if (!toDate) {
    details.push({
      field: "to",
      message: "to is required and must use YYYY-MM-DD format.",
    });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({
        field: "from",
        message: "from must be before or equal to to.",
      });
    } else {
      const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86400000 + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({
          field: "to",
          message: `Date range must be ${maxReportRangeDays} days or fewer.`,
        });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { from, to };
}

function validateMembershipFinancialReportQuery(query) {
  return validateMembershipTransactionsQuery(query);
}

function validateCompanyPasswordResetRequestPayload(payload) {
  const details = [];
  const body = payload || {};
  const email = validateEmailField(body.email, "email", details);

  if (details.length) {
    throw validationError(details);
  }

  return { email };
}

function validateCompanyPasswordResetCompletePayload(payload) {
  const details = [];
  const body = payload || {};
  const token = validateRequiredText(body.token, "token", 2048, details);
  const password = validatePassword(body.password, "password", details);

  for (const forbiddenField of ["email", "companyId", "userId"]) {
    if (Object.prototype.hasOwnProperty.call(body, forbiddenField)) {
      details.push({
        field: forbiddenField,
        message: `${forbiddenField} must not be sent by the frontend.`,
      });
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { token, password };
}

function validateReportDateRange(from, to, details) {
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({
      field: "from",
      message: "from is required and must use YYYY-MM-DD format.",
    });
  }

  if (!toDate) {
    details.push({
      field: "to",
      message: "to is required and must use YYYY-MM-DD format.",
    });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({
        field: "from",
        message: "from must be before or equal to to.",
      });
    } else {
      const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86400000 + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({
          field: "to",
          message: `Date range must be ${maxReportRangeDays} days or fewer.`,
        });
      }
    }
  }
}

function validateMembershipPlanPayload(payload, options = {}) {
  const details = [];
  const body = payload && typeof payload === "object" ? payload : {};
  const patch = {};
  const providedFields = [];
  const partial = Boolean(options.partial);
  const fields = [
    "name",
    "description",
    "durationDays",
    "price",
    "renewalNoticeDays",
    "status",
  ];

  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      continue;
    }

    providedFields.push(field);

    if (field === "name") {
      patch.name = validateRequiredText(body.name, "name", 120, details);
    } else if (field === "description") {
      patch.description = validateOptionalText(
        body.description,
        "description",
        500,
        details,
      );
    } else if (field === "durationDays") {
      const durationDays = Number(body.durationDays);
      if (
        !Number.isInteger(durationDays) ||
        durationDays <= 0 ||
        durationDays > 3660
      ) {
        details.push({
          field: "durationDays",
          message: "durationDays must be a positive integer.",
        });
      } else {
        patch.durationDays = durationDays;
      }
    } else if (field === "price") {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price < 0) {
        details.push({
          field: "price",
          message: "price must be zero or greater.",
        });
      } else {
        patch.price = price;
      }
    } else if (field === "renewalNoticeDays") {
      const renewalNoticeDays = Number(body.renewalNoticeDays);
      if (
        !Number.isInteger(renewalNoticeDays) ||
        renewalNoticeDays < 0 ||
        renewalNoticeDays > 365
      ) {
        details.push({
          field: "renewalNoticeDays",
          message: "renewalNoticeDays must be an integer from 0 to 365.",
        });
      } else {
        patch.renewalNoticeDays = renewalNoticeDays;
      }
    } else if (field === "status") {
      const status = normalizeText(body.status);
      if (!allowedMembershipStatuses.has(status)) {
        details.push({
          field: "status",
          message: "status must be active or inactive.",
        });
      } else {
        patch.status = status;
      }
    }
  }

  if (!partial) {
    if (!Object.prototype.hasOwnProperty.call(body, "name")) {
      details.push({ field: "name", message: "name is required." });
    }
    if (!Object.prototype.hasOwnProperty.call(body, "durationDays")) {
      details.push({
        field: "durationDays",
        message: "durationDays is required.",
      });
    }
    if (!Object.prototype.hasOwnProperty.call(body, "price")) {
      details.push({ field: "price", message: "price is required." });
    }
  }

  if (partial && !providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable field is required.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  if (!partial) {
    return {
      name: patch.name,
      description: patch.description || null,
      durationDays: patch.durationDays,
      price: patch.price,
      renewalNoticeDays: Object.prototype.hasOwnProperty.call(
        patch,
        "renewalNoticeDays",
      )
        ? patch.renewalNoticeDays
        : 5,
      status: patch.status || "active",
    };
  }

  return { patch, providedFields };
}

function validateMembershipBenefitPayload(payload, options = {}) {
  const details = [];
  const body = payload && typeof payload === "object" ? payload : {};
  const patch = {};
  const providedFields = [];
  const partial = Boolean(options.partial);
  const fields = [
    "name",
    "description",
    "benefitType",
    "appliesToType",
    "appliesToName",
    "discountPercent",
    "includedQuantity",
    "usageLimit",
    "usagePeriod",
    "status",
  ];

  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      continue;
    }

    providedFields.push(field);

    if (field === "name") {
      patch.name = validateRequiredText(body.name, "name", 120, details);
    } else if (field === "description") {
      patch.description = validateOptionalText(
        body.description,
        "description",
        500,
        details,
      );
    } else if (field === "benefitType") {
      const benefitType = normalizeText(body.benefitType);
      if (!allowedMembershipBenefitTypes.has(benefitType)) {
        details.push({
          field: "benefitType",
          message:
            "benefitType must be informational, discount, allowance, or free_item.",
        });
      } else {
        patch.benefitType = benefitType;
      }
    } else if (field === "appliesToType") {
      const appliesToType = normalizeText(body.appliesToType);
      if (!allowedMembershipAppliesToTypes.has(appliesToType)) {
        details.push({
          field: "appliesToType",
          message: "appliesToType must be product, service, category, or text.",
        });
      } else {
        patch.appliesToType = appliesToType;
      }
    } else if (field === "appliesToName") {
      patch.appliesToName = validateOptionalText(
        body.appliesToName,
        "appliesToName",
        160,
        details,
      );
    } else if (field === "discountPercent") {
      if (body.discountPercent == null || body.discountPercent === "") {
        patch.discountPercent = null;
      } else {
        const discountPercent = Number(body.discountPercent);
        if (
          !Number.isFinite(discountPercent) ||
          discountPercent <= 0 ||
          discountPercent > 100
        ) {
          details.push({
            field: "discountPercent",
            message: "discountPercent must be greater than 0 and at most 100.",
          });
        } else {
          patch.discountPercent = discountPercent;
        }
      }
    } else if (field === "includedQuantity") {
      if (body.includedQuantity == null || body.includedQuantity === "") {
        patch.includedQuantity = null;
      } else {
        const includedQuantity = Number(body.includedQuantity);
        if (!Number.isFinite(includedQuantity) || includedQuantity <= 0) {
          details.push({
            field: "includedQuantity",
            message: "includedQuantity must be greater than 0.",
          });
        } else {
          patch.includedQuantity = includedQuantity;
        }
      }
    } else if (field === "usageLimit") {
      if (body.usageLimit == null || body.usageLimit === "") {
        patch.usageLimit = null;
      } else {
        const usageLimit = Number(body.usageLimit);
        if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
          details.push({
            field: "usageLimit",
            message: "usageLimit must be a positive integer.",
          });
        } else {
          patch.usageLimit = usageLimit;
        }
      }
    } else if (field === "usagePeriod") {
      const usagePeriod = normalizeText(body.usagePeriod);
      if (!allowedMembershipUsagePeriods.has(usagePeriod)) {
        details.push({
          field: "usagePeriod",
          message:
            "usagePeriod must be none, day, week, month, or membership_term.",
        });
      } else {
        patch.usagePeriod = usagePeriod;
      }
    } else if (field === "status") {
      const status = normalizeText(body.status);
      if (!allowedMembershipStatuses.has(status)) {
        details.push({
          field: "status",
          message: "status must be active or inactive.",
        });
      } else {
        patch.status = status;
      }
    }
  }

  if (!partial) {
    if (!Object.prototype.hasOwnProperty.call(body, "name")) {
      details.push({ field: "name", message: "name is required." });
    }
    if (!Object.prototype.hasOwnProperty.call(body, "benefitType")) {
      details.push({
        field: "benefitType",
        message: "benefitType is required.",
      });
    }
  }

  const finalBenefitType =
    patch.benefitType || (partial ? null : "informational");
  if (!partial && finalBenefitType === "discount" && !patch.discountPercent) {
    details.push({
      field: "discountPercent",
      message: "discountPercent is required for discount benefits.",
    });
  }

  if (!partial && ["allowance", "free_item"].includes(finalBenefitType)) {
    if (!patch.includedQuantity) {
      details.push({
        field: "includedQuantity",
        message:
          "includedQuantity is required for allowance or free item benefits.",
      });
    }
    if (!patch.usageLimit) {
      details.push({
        field: "usageLimit",
        message: "usageLimit is required for allowance or free item benefits.",
      });
    }
    if (!patch.usagePeriod || patch.usagePeriod === "none") {
      details.push({
        field: "usagePeriod",
        message:
          "usagePeriod must not be none for allowance or free item benefits.",
      });
    }
  }

  if (partial && !providedFields.length) {
    details.push({
      field: "body",
      message: "At least one editable field is required.",
    });
  }

  if (details.length) {
    throw validationError(details);
  }

  if (!partial) {
    return {
      name: patch.name,
      description: patch.description || null,
      benefitType: patch.benefitType,
      appliesToType: patch.appliesToType || "text",
      appliesToName: patch.appliesToName || null,
      discountPercent: patch.discountPercent || null,
      includedQuantity: patch.includedQuantity || null,
      usageLimit: patch.usageLimit || null,
      usagePeriod: patch.usagePeriod || "none",
      status: patch.status || "active",
    };
  }

  return { patch, providedFields };
}

function validateActivityReportQuery(query) {
  const details = [];
  const from = query.get("from");
  const to = query.get("to");
  const type = query.get("type") || "all";
  const allowedTypes = new Set(["all", "purchase", "redemption", "membership"]);

  if (!allowedTypes.has(type)) {
    details.push({
      field: "type",
      message: "type must be one of all, purchase, redemption, membership.",
    });
  }

  validateReportDateRange(from, to, details);

  if (details.length) {
    throw validationError(details);
  }

  return { from, to, type };
}

function validateCustomerReportQuery(query) {
  const details = [];
  const search = normalizeText(query.get("search"));
  const from = query.get("from");
  const to = query.get("to");
  const type = query.get("type") || "all";
  const allowedTypes = new Set([
    "all",
    "purchase",
    "redemption",
    "membership",
    "benefit",
  ]);

  if (!search || search.length > 254) {
    details.push({
      field: "search",
      message: "search is required and must be 254 characters or fewer.",
    });
  }

  if (!allowedTypes.has(type)) {
    details.push({
      field: "type",
      message:
        "type must be one of all, purchase, redemption, membership, benefit.",
    });
  }

  validateReportDateRange(from, to, details);

  if (details.length) {
    throw validationError(details);
  }

  return { search, from, to, type };
}

function validateAuditEventsQuery(query) {
  const details = [];
  const from = query.get("from");
  const to = query.get("to");
  const limitValue = query.get("limit") || "25";
  const allowedLimits = new Set(["10", "25", "50"]);
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({
      field: "from",
      message: "from is required and must use YYYY-MM-DD format.",
    });
  }

  if (!toDate) {
    details.push({
      field: "to",
      message: "to is required and must use YYYY-MM-DD format.",
    });
  }

  if (!allowedLimits.has(limitValue)) {
    details.push({
      field: "limit",
      message: "limit must be one of 10, 25, 50.",
    });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({
        field: "from",
        message: "from must be before or equal to to.",
      });
    } else {
      const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86400000 + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({
          field: "to",
          message: `Date range must be ${maxReportRangeDays} days or fewer.`,
        });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { from, to, limit: Number(limitValue) };
}

function calculatePointsEarned(amount, pointsPercentage) {
  const points = Math.round((Number(amount) * Number(pointsPercentage)) / 100);
  if (!Number.isInteger(points) || points <= 0) {
    throw validationError([
      {
        field: "amount",
        message:
          "Amount is too small to earn points with the current company percentage.",
      },
    ]);
  }
  return points;
}

module.exports = {
  calculatePointsEarned,
  isAllowedCompanyStatus,
  isAllowedCompanyUserStatus,
  isAllowedInvitationStatus,
  isAllowedRegistrationRequestStatus,
  normalizeEmail,
  parsePositiveInteger,
  validateAuditEventsQuery,
  validateActivityReportQuery,
  validateCustomerReportQuery,
  validateCompanySettingsPatchPayload,
  validateCompanyAuthLoginPayload,
  validateCompanyPasswordChangePayload,
  validateCompanyPasswordResetCompletePayload,
  validateCompanyPasswordResetRequestPayload,
  validateCompanyInvitationPayload,
  validateCompanyRegistrationRequestPayload,
  validateCompanyRegistrationRequestListQuery,
  validateCompanyRegistrationReviewPayload,
  validateCompanyRole,
  validateCustomerMembershipStatusQuery,
  validateCustomerPayload,
  validateCustomerPatchPayload,
  validateExpirationAlertsQuery,
  validateInvitationAcceptPayload,
  validateLogoFileMetadata,
  validateMembershipActivationPayload,
  validateMembershipBenefitPayload,
  validateMembershipBenefitUsagePayload,
  validateMembershipBenefitUsageQuery,
  validateMembershipPlanPayload,
  validateMembershipRenewalPayload,
  validateMembershipStatusQuery,
  validateMembershipTransactionsQuery,
  validateMembershipFinancialReportQuery,
  validateMyCompanyPatchPayload,
  validateOperationalEmailHistoryQuery,
  validateOperationalEmailSettingsPayload,
  validatePromotionalCampaignListQuery,
  validatePromotionalCampaignPayload,
  validatePromotionalRecipientQuery,
  validatePromotionalRecipientSelectionPayload,
  validatePromotionalSendPayload,
  validatePromotionalUnsubscribePayload,
  validatePurchasePayload,
  validateRedemptionPayload,
};
