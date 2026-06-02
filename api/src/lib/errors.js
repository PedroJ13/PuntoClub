class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function validationError(details) {
  return new ApiError(400, 'VALIDATION_ERROR', 'One or more fields are invalid.', details);
}

function mapSqlError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  const message = String(error && error.message ? error.message : '');
  const number = Number(error && error.number);

  if ((number === 2601 || number === 2627) && message.includes('UX_Purchases_company_invoice')) {
    return new ApiError(409, 'DUPLICATE_INVOICE', 'Invoice number already exists for this company.');
  }

  if ((number === 2601 || number === 2627) && (
    message.includes('UX_Customers_company_phone') ||
    message.includes('UX_Customers_company_email')
  )) {
    return new ApiError(409, 'DUPLICATE_CUSTOMER', 'Customer phone or email already exists for this company.');
  }

  if (number === 50001) {
    return validationError([{ field: 'pointsRedeemed', message: 'Points redeemed must be greater than 0.' }]);
  }

  if (number === 50002) {
    return new ApiError(404, 'CUSTOMER_NOT_FOUND', 'Customer does not exist for this company.');
  }

  if (number === 50003) {
    return new ApiError(409, 'INSUFFICIENT_POINTS', 'Redemption exceeds available point balance.');
  }

  return new ApiError(500, 'INTERNAL_ERROR', 'Unexpected API error.');
}

module.exports = {
  ApiError,
  mapSqlError,
  validationError
};
