const { validationError } = require('./errors');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const maxReportRangeDays = 31;

function parsePositiveInteger(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw validationError([{ field, message: `${field} must be a positive integer.` }]);
  }
  return number;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function validateDate(value, field, details) {
  if (typeof value !== 'string' || !isoDatePattern.test(value)) {
    details.push({ field, message: `${field} must use YYYY-MM-DD format.` });
  }
}

function parseIsoDate(value) {
  if (typeof value !== 'string' || !isoDatePattern.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return date;
}

function validateCustomerPayload(payload) {
  const details = [];
  const name = normalizeText(payload && payload.name);
  const phone = normalizeText(payload && payload.phone);
  const email = normalizeText(payload && payload.email);

  if (!name || name.length > 160) {
    details.push({ field: 'name', message: 'Name is required and must be 160 characters or fewer.' });
  }

  if (!phone || phone.length > 32) {
    details.push({ field: 'phone', message: 'Phone is required and must be 32 characters or fewer.' });
  }

  if (email && (email.length > 254 || !emailPattern.test(email))) {
    details.push({ field: 'email', message: 'Email must be valid and 254 characters or fewer.' });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { name, phone, email: email || null };
}

function validateCompanySettingsPatchPayload(payload) {
  const details = [];
  const body = payload || {};
  const allowedFields = ['name', 'email', 'phone', 'logoUrl', 'pointsPercentage'];
  const patch = {};
  const providedFields = allowedFields.filter((field) => Object.prototype.hasOwnProperty.call(body, field));

  if (!providedFields.length) {
    details.push({ field: 'body', message: 'At least one editable company setting must be provided.' });
  }

  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    const name = normalizeText(body.name);
    if (!name || name.length > 160) {
      details.push({ field: 'name', message: 'Name must be provided and be 160 characters or fewer.' });
    } else {
      patch.name = name;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'email')) {
    const email = normalizeText(body.email);
    if (email && (email.length > 254 || !emailPattern.test(email))) {
      details.push({ field: 'email', message: 'Email must be valid and 254 characters or fewer.' });
    } else {
      patch.email = email || null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'phone')) {
    const phone = normalizeText(body.phone);
    if (phone && (phone.length < 7 || phone.length > 32)) {
      details.push({ field: 'phone', message: 'Phone must be between 7 and 32 characters when provided.' });
    } else {
      patch.phone = phone || null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'logoUrl')) {
    const logoUrl = normalizeText(body.logoUrl);
    if (logoUrl) {
      try {
        const url = new URL(logoUrl);
        if (!['http:', 'https:'].includes(url.protocol) || logoUrl.length > 2048) {
          details.push({ field: 'logoUrl', message: 'Logo URL must be a valid http(s) URL and 2048 characters or fewer.' });
        } else {
          patch.logoUrl = logoUrl;
        }
      } catch {
        details.push({ field: 'logoUrl', message: 'Logo URL must be a valid http(s) URL and 2048 characters or fewer.' });
      }
    } else {
      patch.logoUrl = null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'pointsPercentage')) {
    const pointsPercentage = Number(body.pointsPercentage);
    if (!Number.isFinite(pointsPercentage) || pointsPercentage <= 0 || pointsPercentage > 100) {
      details.push({ field: 'pointsPercentage', message: 'Points percentage must be greater than 0 and less than or equal to 100.' });
    } else {
      patch.pointsPercentage = pointsPercentage;
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return {
    patch,
    providedFields
  };
}

function validatePurchasePayload(payload) {
  const details = [];
  const invoiceNumber = normalizeText(payload && payload.invoiceNumber);
  const customerId = Number(payload && payload.customerId);
  const amount = Number(payload && payload.amount);
  const purchaseDate = payload && payload.purchaseDate;

  if (!Number.isInteger(customerId) || customerId <= 0) {
    details.push({ field: 'customerId', message: 'Customer id must be a positive integer.' });
  }

  if (!invoiceNumber || invoiceNumber.length > 80) {
    details.push({ field: 'invoiceNumber', message: 'Invoice number is required and must be 80 characters or fewer.' });
  }

  validateDate(purchaseDate, 'purchaseDate', details);

  if (!Number.isFinite(amount) || amount <= 0) {
    details.push({ field: 'amount', message: 'Amount must be greater than 0.' });
  }

  if (Object.prototype.hasOwnProperty.call(payload || {}, 'pointsEarned')) {
    details.push({ field: 'pointsEarned', message: 'pointsEarned is calculated by the API and must not be sent.' });
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
    details.push({ field: 'customerId', message: 'Customer id must be a positive integer.' });
  }

  validateDate(redemptionDate, 'redemptionDate', details);

  if (!Number.isInteger(pointsRedeemed) || pointsRedeemed <= 0) {
    details.push({ field: 'pointsRedeemed', message: 'Points redeemed must be a positive integer.' });
  }

  if (note && note.length > 500) {
    details.push({ field: 'note', message: 'Note must be 500 characters or fewer.' });
  }

  if (details.length) {
    throw validationError(details);
  }

  return { customerId, redemptionDate, pointsRedeemed, note: note || null };
}

function validateActivityReportQuery(query) {
  const details = [];
  const from = query.get('from');
  const to = query.get('to');
  const type = query.get('type') || 'all';
  const allowedTypes = new Set(['all', 'purchase', 'redemption']);
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({ field: 'from', message: 'from is required and must use YYYY-MM-DD format.' });
  }

  if (!toDate) {
    details.push({ field: 'to', message: 'to is required and must use YYYY-MM-DD format.' });
  }

  if (!allowedTypes.has(type)) {
    details.push({ field: 'type', message: 'type must be one of all, purchase, redemption.' });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({ field: 'from', message: 'from must be before or equal to to.' });
    } else {
      const rangeDays = ((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({ field: 'to', message: `Date range must be ${maxReportRangeDays} days or fewer.` });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { from, to, type };
}

function validateAuditEventsQuery(query) {
  const details = [];
  const from = query.get('from');
  const to = query.get('to');
  const limitValue = query.get('limit') || '25';
  const allowedLimits = new Set(['10', '25', '50']);
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);

  if (!fromDate) {
    details.push({ field: 'from', message: 'from is required and must use YYYY-MM-DD format.' });
  }

  if (!toDate) {
    details.push({ field: 'to', message: 'to is required and must use YYYY-MM-DD format.' });
  }

  if (!allowedLimits.has(limitValue)) {
    details.push({ field: 'limit', message: 'limit must be one of 10, 25, 50.' });
  }

  if (fromDate && toDate) {
    if (fromDate > toDate) {
      details.push({ field: 'from', message: 'from must be before or equal to to.' });
    } else {
      const rangeDays = ((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
      if (rangeDays > maxReportRangeDays) {
        details.push({ field: 'to', message: `Date range must be ${maxReportRangeDays} days or fewer.` });
      }
    }
  }

  if (details.length) {
    throw validationError(details);
  }

  return { from, to, limit: Number(limitValue) };
}

function calculatePointsEarned(amount, pointsPercentage) {
  const points = Math.round(Number(amount) * Number(pointsPercentage) / 100);
  if (!Number.isInteger(points) || points <= 0) {
    throw validationError([{ field: 'amount', message: 'Amount is too small to earn points with the current company percentage.' }]);
  }
  return points;
}

module.exports = {
  calculatePointsEarned,
  parsePositiveInteger,
  validateAuditEventsQuery,
  validateActivityReportQuery,
  validateCompanySettingsPatchPayload,
  validateCustomerPayload,
  validatePurchasePayload,
  validateRedemptionPayload
};
