const initialCustomers = [
  {
    id: 10,
    name: "Maria Soto",
    phone: "+50688887777",
    email: "maria@example.com",
    createdAt: "2026-06-02T15:20:00Z",
    updatedAt: "2026-06-02T15:20:00Z",
  },
  {
    id: 11,
    name: "Carlos Vega",
    phone: "+50622223333",
    email: "carlos@example.com",
    createdAt: "2026-06-02T15:28:00Z",
    updatedAt: "2026-06-02T15:28:00Z",
  },
];

let mockCustomers = [...initialCustomers];
let mockBalances = new Map(
  initialCustomers.map((customer) => [
    String(customer.id),
    {
      customerId: String(customer.id),
      pointsEarned: 0,
      pointsRedeemed: 0,
      pointsBalance: 0,
    },
  ]),
);
let mockActivity = new Map(initialCustomers.map((customer) => [String(customer.id), []]));
let mockAuditEvents = [];
let mockInvoices = new Set();
let mockCompanySettings = {
  id: "1",
  name: "Cafe Central",
  email: "hola@cafecentral.test",
  phone: "+50622223333",
  logoUrl: "",
  pointsPercentage: 5,
  status: "active",
  updatedAt: "2026-06-02T15:20:00Z",
};
let mockCompanyRegistrationRequests = [];
let mockAcceptedInvitationTokens = new Set();
let mockLocalCompanyUsers = [
  {
    id: "399",
    email: "owner@mock.test",
    displayName: "Owner Mock",
    role: "owner",
    status: "active",
    password: "Password123",
    company: {
      id: "9",
      name: "Empresa Mock",
      status: "active",
    },
  },
];
let mockAuthIdentity = null;
let nextCustomerId = 12;
let nextPurchaseId = 50;
let nextRedemptionId = 70;
let nextAuditEventId = 1;
let nextCompanyRegistrationRequestId = 200;
let nextCompanyUserId = 400;

export class ApiError extends Error {
  constructor(code, message, details = []) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

export function createCustomerApi(config) {
  if (config.useMockApi) {
    return createMockCustomerApi();
  }

  return createHttpCustomerApi(config);
}

function createHttpCustomerApi(config) {
  const customersUrl = buildApiUrl(config, `/api/companies/${config.companyId}/customers`);
  const purchasesUrl = buildApiUrl(config, `/api/companies/${config.companyId}/purchases`);
  const redemptionsUrl = buildApiUrl(config, `/api/companies/${config.companyId}/redemptions`);
  const reportsActivityUrl = buildApiUrl(
    config,
    `/api/companies/${config.companyId}/reports/activity`,
  );
  const auditEventsUrl = buildApiUrl(config, `/api/companies/${config.companyId}/audit/events`);
  const settingsUrl = buildApiUrl(config, `/api/companies/${config.companyId}/settings`);
  const companyRegistrationRequestsUrl = buildApiUrl(config, "/api/company-registration-requests");
  const companyInvitationsValidateUrl = buildApiUrl(config, "/api/company-invitations/validate");
  const companyInvitationsAcceptUrl = buildApiUrl(config, "/api/company-invitations/accept");
  const companyAuthLoginUrl = buildApiUrl(config, "/api/company-auth/login");
  const companyAuthLogoutUrl = buildApiUrl(config, "/api/company-auth/logout");
  const meUrl = buildApiUrl(config, "/api/me");

  return {
    sourceLabel: "API real",
    async acceptCompanyInvitation(payload) {
      const response = await fetch(companyInvitationsAcceptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async loginCompany(payload) {
      const response = await fetch(companyAuthLoginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async logoutCompany() {
      const response = await fetch(companyAuthLogoutUrl, {
        method: "POST",
        credentials: "include",
      });

      return parseResponse(response);
    },
    async getCurrentCompanyUser() {
      const response = await fetch(meUrl, {
        credentials: "include",
      });

      return parseResponse(response);
    },
    async validateCompanyInvitation(token) {
      const url = new URL(companyInvitationsValidateUrl, window.location.origin);
      url.searchParams.set("token", token);
      const response = await fetch(url);
      return parseResponse(response);
    },
    async getCompanySettings() {
      const response = await fetch(settingsUrl);
      return parseResponse(response);
    },
    async updateCompanySettings(payload) {
      const response = await fetch(settingsUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async createCompanyRegistrationRequest(payload) {
      const response = await fetch(companyRegistrationRequestsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async searchCustomers(search) {
      const url = new URL(customersUrl, window.location.origin);
      if (search) {
        url.searchParams.set("search", search);
      }

      const response = await fetch(url);
      return parseResponse(response);
    },
    async createCustomer(payload) {
      const response = await fetch(customersUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async getCustomerBalance(customerId) {
      const url = buildApiUrl(
        config,
        `/api/companies/${config.companyId}/customers/${customerId}/balance`,
      );
      const response = await fetch(url);
      return parseResponse(response);
    },
    async getCustomerActivity(customerId) {
      const url = buildApiUrl(
        config,
        `/api/companies/${config.companyId}/customers/${customerId}/activity`,
      );
      const response = await fetch(url);
      return parseResponse(response);
    },
    async getActivityReport(filters) {
      const url = new URL(reportsActivityUrl, window.location.origin);
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      url.searchParams.set("type", filters.type || "all");
      const response = await fetch(url);
      return parseResponse(response);
    },
    async getAuditEvents(filters) {
      const url = new URL(auditEventsUrl, window.location.origin);
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      url.searchParams.set("limit", filters.limit || "25");
      const response = await fetch(url);
      return parseResponse(response);
    },
    async createPurchase(payload) {
      const response = await fetch(purchasesUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async createRedemption(payload) {
      const response = await fetch(redemptionsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
  };
}

function buildApiUrl(config, path) {
  const normalizedBase = String(config.apiBaseUrl || "").replace(/\/$/, "");
  return `${normalizedBase}${path}`;
}

function createMockCustomerApi() {
  return {
    sourceLabel: "Mock local",
    async acceptCompanyInvitation(payload) {
      await wait(450);
      return acceptMockCompanyInvitation(payload);
    },
    async loginCompany(payload) {
      await wait(350);
      return loginMockCompany(payload);
    },
    async logoutCompany() {
      await wait(200);
      mockAuthIdentity = null;
      return { ok: true };
    },
    async getCurrentCompanyUser() {
      await wait(200);
      if (!mockAuthIdentity) {
        throw new ApiError("UNAUTHORIZED", "Authentication is required.");
      }

      return mockAuthIdentity;
    },
    async validateCompanyInvitation(token) {
      await wait(350);
      return validateMockCompanyInvitation(token);
    },
    async getCompanySettings() {
      await wait(250);
      return { ...mockCompanySettings };
    },
    async updateCompanySettings(payload) {
      await wait(450);
      validateCompanySettings(payload);

      const nextSettings = normalizeCompanySettingsPayload(payload);
      const changedFields = Object.entries(nextSettings)
        .filter(([field, value]) => String(mockCompanySettings[field] ?? "") !== String(value ?? ""))
        .map(([field]) => field);

      if (changedFields.length > 0) {
        mockCompanySettings = {
          ...mockCompanySettings,
          ...nextSettings,
          updatedAt: new Date().toISOString(),
        };
        recordMockAuditEvent({
          eventType: "company.settings.updated",
          entityType: "company",
          entityId: mockCompanySettings.id,
          summary: `Configuracion actualizada: ${changedFields.join(", ")}.`,
        });
      }

      return { ...mockCompanySettings };
    },
    async createCompanyRegistrationRequest(payload) {
      await wait(500);
      validateCompanyRegistrationRequest(payload);
      const request = normalizeCompanyRegistrationPayload(payload);

      if (normalize(request.companyEmail) === normalize(mockCompanySettings.email)) {
        throw new ApiError(
          "COMPANY_ALREADY_EXISTS",
          "Ya existe una empresa registrada con ese correo.",
        );
      }

      const hasPendingRequest = mockCompanyRegistrationRequests.some(
        (item) =>
          item.status === "pending" &&
          normalize(item.companyEmail) === normalize(request.companyEmail),
      );

      if (hasPendingRequest) {
        throw new ApiError(
          "REGISTRATION_ALREADY_PENDING",
          "Ya hay una solicitud pendiente para ese correo.",
        );
      }

      const now = new Date().toISOString();
      const result = {
        id: String(nextCompanyRegistrationRequestId),
        companyName: request.companyName,
        companyEmail: request.companyEmail,
        companyAddress: request.companyAddress,
        status: "pending",
        createdAt: now,
        message: "Solicitud recibida.",
      };

      nextCompanyRegistrationRequestId += 1;
      mockCompanyRegistrationRequests = [result, ...mockCompanyRegistrationRequests];
      recordMockAuditEvent({
        eventType: "company.registration.submitted",
        entityType: "company_registration_request",
        entityId: result.id,
        summary: `Solicitud de empresa recibida: ${result.companyName}.`,
      });
      return result;
    },
    async searchCustomers(search) {
      await wait(450);

      if (search.trim().toLowerCase() === "error") {
        throw new ApiError("INTERNAL_ERROR", "No se pudo consultar clientes. Intente de nuevo.");
      }

      const normalizedSearch = normalize(search);
      const items = normalizedSearch
        ? mockCustomers.filter((customer) =>
            [customer.name, customer.phone, customer.email].some((value) =>
              normalize(value).includes(normalizedSearch),
            ),
          )
        : mockCustomers;

      return { items };
    },
    async createCustomer(payload) {
      await wait(500);
      validateCustomer(payload);

      const phoneExists = mockCustomers.some(
        (customer) => normalize(customer.phone) === normalize(payload.phone),
      );
      const emailExists =
        payload.email &&
        mockCustomers.some((customer) => normalize(customer.email) === normalize(payload.email));

      if (phoneExists || emailExists) {
        const existingCustomer = mockCustomers.find(
          (customer) =>
            normalize(customer.phone) === normalize(payload.phone) ||
            (payload.email && normalize(customer.email) === normalize(payload.email)),
        );
        recordMockAuditEvent({
          eventType: "customer.rejected_duplicate",
          entityType: "customer",
          customer: existingCustomer,
          summary: "Cliente rechazado por telefono o email duplicado.",
        });
        throw new ApiError(
          "DUPLICATE_CUSTOMER",
          "Ya existe un cliente con ese telefono o email.",
        );
      }

      const now = new Date().toISOString();
      const customer = {
        id: nextCustomerId,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        createdAt: now,
        updatedAt: now,
      };

      nextCustomerId += 1;
      mockCustomers = [customer, ...mockCustomers];
      mockBalances.set(String(customer.id), {
        customerId: String(customer.id),
        pointsEarned: 0,
        pointsRedeemed: 0,
        pointsBalance: 0,
      });
      mockActivity.set(String(customer.id), []);
      recordMockAuditEvent({
        eventType: "customer.created",
        entityType: "customer",
        entityId: customer.id,
        customer,
        summary: "Cliente registrado.",
      });
      return customer;
    },
    async getCustomerBalance(customerId) {
      await wait(200);
      const balance = mockBalances.get(String(customerId));

      if (!balance) {
        throw new ApiError("CUSTOMER_NOT_FOUND", "Cliente no encontrado.");
      }

      return balance;
    },
    async createPurchase(payload) {
      await wait(450);
      validatePurchase(payload);

      const customer = mockCustomers.find((item) => String(item.id) === String(payload.customerId));

      if (!customer) {
        throw new ApiError("CUSTOMER_NOT_FOUND", "Cliente no encontrado.");
      }

      if (mockInvoices.has(normalize(payload.invoiceNumber))) {
        recordMockAuditEvent({
          eventType: "purchase.rejected_duplicate_invoice",
          entityType: "purchase",
          customer,
          summary: `Compra rechazada por factura duplicada ${payload.invoiceNumber.trim()}.`,
        });
        throw new ApiError("DUPLICATE_INVOICE", "La factura ya existe para esta empresa.");
      }

      mockInvoices.add(normalize(payload.invoiceNumber));
      const amount = Number(payload.amount);
      const pointsEarned = Math.round(amount * (Number(mockCompanySettings.pointsPercentage) / 100));
      const currentBalance = mockBalances.get(String(customer.id));
      const balance = {
        customerId: String(customer.id),
        pointsEarned: currentBalance.pointsEarned + pointsEarned,
        pointsRedeemed: currentBalance.pointsRedeemed,
        pointsBalance: currentBalance.pointsBalance + pointsEarned,
      };
      mockBalances.set(String(customer.id), balance);

      const purchase = {
        id: String(nextPurchaseId),
        customerId: String(customer.id),
        invoiceNumber: payload.invoiceNumber.trim(),
        purchaseDate: payload.purchaseDate,
        amount,
        pointsEarned,
        createdAt: new Date().toISOString(),
      };
      mockActivity.set(String(customer.id), [
        {
          type: "purchase",
          id: purchase.id,
          date: purchase.purchaseDate,
          invoiceNumber: purchase.invoiceNumber,
          amount: purchase.amount,
          points: purchase.pointsEarned,
        },
        ...(mockActivity.get(String(customer.id)) ?? []),
      ]);
      recordMockAuditEvent({
        eventType: "purchase.registered",
        entityType: "purchase",
        entityId: purchase.id,
        customer,
        summary: `Compra registrada por ${formatMockAmount(amount)}. Factura ${purchase.invoiceNumber}.`,
      });
      nextPurchaseId += 1;
      return purchase;
    },
    async createRedemption(payload) {
      await wait(450);
      validateRedemption(payload);

      const customer = mockCustomers.find((item) => String(item.id) === String(payload.customerId));

      if (!customer) {
        throw new ApiError("CUSTOMER_NOT_FOUND", "Cliente no encontrado.");
      }

      const currentBalance = mockBalances.get(String(customer.id));
      const pointsRedeemed = Number(payload.pointsRedeemed);

      if (pointsRedeemed > currentBalance.pointsBalance) {
        recordMockAuditEvent({
          eventType: "redemption.rejected_insufficient_points",
          entityType: "redemption",
          customer,
          summary: `Canje rechazado por saldo insuficiente. Solicitud ${pointsRedeemed} pts.`,
        });
        throw new ApiError("INSUFFICIENT_POINTS", "El cliente no tiene puntos suficientes.");
      }

      const balance = {
        customerId: String(customer.id),
        pointsEarned: currentBalance.pointsEarned,
        pointsRedeemed: currentBalance.pointsRedeemed + pointsRedeemed,
        pointsBalance: currentBalance.pointsBalance - pointsRedeemed,
      };
      mockBalances.set(String(customer.id), balance);

      const redemption = {
        id: String(nextRedemptionId),
        customerId: String(customer.id),
        redemptionDate: payload.redemptionDate,
        pointsRedeemed,
        note: payload.note.trim() || null,
        createdAt: new Date().toISOString(),
        balanceAfter: balance.pointsBalance,
      };
      mockActivity.set(String(customer.id), [
        {
          type: "redemption",
          id: redemption.id,
          date: redemption.redemptionDate,
          note: redemption.note,
          points: -redemption.pointsRedeemed,
        },
        ...(mockActivity.get(String(customer.id)) ?? []),
      ]);
      recordMockAuditEvent({
        eventType: "redemption.registered",
        entityType: "redemption",
        entityId: redemption.id,
        customer,
        summary: `Canje registrado por ${redemption.pointsRedeemed} pts.`,
      });
      nextRedemptionId += 1;
      return redemption;
    },
    async getCustomerActivity(customerId) {
      await wait(300);
      const balance = mockBalances.get(String(customerId));

      if (!balance) {
        throw new ApiError("CUSTOMER_NOT_FOUND", "Cliente no encontrado.");
      }

      return {
        customerId: String(customerId),
        balance,
        items: mockActivity.get(String(customerId)) ?? [],
      };
    },
    async getActivityReport(filters) {
      await wait(350);
      validateReportFilters(filters);

      const type = filters.type || "all";
      const items = mockCustomers.flatMap((customer) =>
        (mockActivity.get(String(customer.id)) ?? []).map((item) =>
          normalizeReportItem(customer, item),
        ),
      );
      const filteredItems = items
        .filter((item) => item.date >= filters.from && item.date <= filters.to)
        .filter((item) => type === "all" || item.type === type)
        .sort((left, right) => {
          if (left.date === right.date) {
            return Number(right.id) - Number(left.id);
          }

          return right.date.localeCompare(left.date);
        });

      return {
        from: filters.from,
        to: filters.to,
        type,
        summary: buildReportSummary(filteredItems),
        items: filteredItems,
      };
    },
    async getAuditEvents(filters) {
      await wait(300);
      validateAuditFilters(filters);

      const limit = Number(filters.limit || 25);
      const items = mockAuditEvents
        .filter((event) => !filters.from || event.occurredAt.slice(0, 10) >= filters.from)
        .filter((event) => !filters.to || event.occurredAt.slice(0, 10) <= filters.to)
        .slice(0, limit);

      return {
        from: filters.from || null,
        to: filters.to || null,
        limit,
        items,
      };
    },
  };
}

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = body.error ?? {};
    throw new ApiError(
      error.code ?? "INTERNAL_ERROR",
      error.message ?? "No se pudo completar la operacion.",
      error.details ?? [],
    );
  }

  return body;
}

function validateCustomer(payload) {
  const details = [];

  if (!payload.name.trim()) {
    details.push({ field: "name", message: "El nombre es requerido." });
  }

  if (!payload.phone.trim()) {
    details.push({ field: "phone", message: "El telefono es requerido." });
  }

  if (payload.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    details.push({ field: "email", message: "El email no tiene un formato valido." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function validateCompanySettings(payload) {
  const details = [];
  const editableFields = ["name", "email", "phone", "logoUrl", "pointsPercentage"];
  const hasEditableField = editableFields.some((field) => hasOwn(payload, field));
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const logoUrl = String(payload.logoUrl ?? "").trim();
  const pointsPercentage = Number(payload.pointsPercentage);

  if (!hasEditableField) {
    details.push({ field: "body", message: "Envie al menos un campo editable." });
  }

  if (hasOwn(payload, "name") && (!name || name.length > 160)) {
    details.push({ field: "name", message: "El nombre es requerido y debe tener 160 caracteres o menos." });
  }

  if (hasOwn(payload, "email") && email && (!isEmail(email) || email.length > 254)) {
    details.push({ field: "email", message: "El email no tiene un formato valido." });
  }

  if (hasOwn(payload, "phone") && phone && (phone.length < 7 || phone.length > 32)) {
    details.push({ field: "phone", message: "El telefono debe tener entre 7 y 32 caracteres." });
  }

  if (hasOwn(payload, "logoUrl") && logoUrl && !isHttpUrl(logoUrl)) {
    details.push({ field: "logoUrl", message: "El logo URL debe ser http(s)." });
  }

  if (
    hasOwn(payload, "pointsPercentage") &&
    (!Number.isFinite(pointsPercentage) || pointsPercentage <= 0 || pointsPercentage > 100)
  ) {
    details.push({ field: "pointsPercentage", message: "El porcentaje debe ser mayor que 0 y menor o igual que 100." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise la configuracion de empresa.", details);
  }
}

function normalizeCompanySettingsPayload(payload) {
  return {
    name: String(payload.name ?? "").trim(),
    email: normalizeNullableText(payload.email),
    phone: normalizeNullableText(payload.phone),
    logoUrl: normalizeNullableText(payload.logoUrl),
    pointsPercentage: Number(payload.pointsPercentage),
  };
}

function validateCompanyRegistrationRequest(payload) {
  const details = [];
  const forbiddenFields = ["requestedLogoUrl", "companyId", "password"];
  const companyName = String(payload.companyName ?? "").trim();
  const companyEmail = String(payload.companyEmail ?? "").trim();
  const companyPhone = String(payload.companyPhone ?? "").trim();
  const companyAddress = String(payload.companyAddress ?? "").trim();
  const contactName = String(payload.contactName ?? "").trim();
  const contactEmail = String(payload.contactEmail ?? "").trim();
  const contactPhone = String(payload.contactPhone ?? "").trim();

  forbiddenFields.forEach((field) => {
    if (hasOwn(payload, field)) {
      details.push({ field, message: "El campo no esta permitido." });
    }
  });

  if (!companyName || companyName.length > 160) {
    details.push({ field: "companyName", message: "El nombre de empresa es requerido." });
  }

  if (!companyEmail || !isEmail(companyEmail) || companyEmail.length > 254) {
    details.push({ field: "companyEmail", message: "El correo de empresa no es valido." });
  }

  if (!companyAddress || companyAddress.length > 300) {
    details.push({ field: "companyAddress", message: "La direccion es requerida." });
  }

  if (companyPhone.length > 32) {
    details.push({ field: "companyPhone", message: "El telefono de empresa debe tener 32 caracteres o menos." });
  }

  if (contactName.length > 160) {
    details.push({ field: "contactName", message: "El contacto debe tener 160 caracteres o menos." });
  }

  if (!contactEmail || !isEmail(contactEmail) || contactEmail.length > 254) {
    details.push({ field: "contactEmail", message: "El correo de contacto no es valido." });
  }

  if (contactPhone.length > 32) {
    details.push({ field: "contactPhone", message: "El telefono de contacto debe tener 32 caracteres o menos." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function normalizeCompanyRegistrationPayload(payload) {
  return {
    companyName: String(payload.companyName ?? "").trim(),
    companyEmail: String(payload.companyEmail ?? "").trim().toLowerCase(),
    companyPhone: normalizeNullableText(payload.companyPhone),
    companyAddress: String(payload.companyAddress ?? "").trim(),
    contactName: normalizeNullableText(payload.contactName),
    contactEmail: String(payload.contactEmail ?? "").trim().toLowerCase(),
    contactPhone: normalizeNullableText(payload.contactPhone),
  };
}

function validateMockCompanyInvitation(token) {
  const normalizedToken = normalize(token);
  const validTokens = new Set(["valid", "valid-token", "mock-valid-token"]);

  if (normalizedToken === "service-error") {
    throw new ApiError("INTERNAL_ERROR", "No se pudo validar la invitacion.");
  }

  if (!normalizedToken || normalizedToken === "invalid" || normalizedToken === "invalid-token") {
    return { valid: false, reason: "invalid" };
  }

  if (["expired", "expired-token"].includes(normalizedToken)) {
    return { valid: false, reason: "expired" };
  }

  if (["accepted", "accepted-token"].includes(normalizedToken)) {
    return { valid: false, reason: "accepted" };
  }

  if (["revoked", "revoked-token"].includes(normalizedToken)) {
    return { valid: false, reason: "revoked" };
  }

  if (mockAcceptedInvitationTokens.has(normalizedToken)) {
    return { valid: false, reason: "accepted" };
  }

  if (!validTokens.has(normalizedToken)) {
    return { valid: false, reason: "invalid" };
  }

  return {
    valid: true,
    invitationId: "300",
    companyId: "10",
    companyName: "Cafe Central",
    email: "hola@cafecentral.test",
    role: "owner",
    expiresAt: "2026-06-14T19:00:00Z",
  };
}

function acceptMockCompanyInvitation(payload) {
  validateInvitationAcceptPayload(payload);
  const normalizedToken = normalize(payload.token);
  const invitation = validateMockCompanyInvitation(normalizedToken);

  if (!invitation.valid) {
    throwInvitationStateError(invitation.reason);
  }

  const email = normalize(invitation.email);
  const existingUser = mockLocalCompanyUsers.find((user) => normalize(user.email) === email);
  if (existingUser) {
    throw new ApiError("COMPANY_USER_ALREADY_EXISTS", "Ya existe un usuario para esa invitacion.");
  }

  const now = new Date().toISOString();
  const user = {
    id: String(nextCompanyUserId),
    email: invitation.email,
    displayName: String(payload.displayName || "").trim() || invitation.companyName,
    role: invitation.role,
    status: "active",
    password: payload.password,
  };
  const company = {
    id: String(invitation.companyId),
    name: invitation.companyName,
    status: "active",
  };

  nextCompanyUserId += 1;
  mockLocalCompanyUsers = [{ ...user, company }, ...mockLocalCompanyUsers];
  mockAcceptedInvitationTokens.add(normalizedToken);

  return {
    companyId: company.id,
    userId: user.id,
    email: user.email,
    role: user.role,
    companyStatus: company.status,
    createdAt: now,
  };
}

function loginMockCompany(payload) {
  validateCompanyAuthLoginPayload(payload);
  const email = normalize(payload.email);
  const user = mockLocalCompanyUsers.find((item) => normalize(item.email) === email);

  if (!user || user.password !== payload.password) {
    throw new ApiError("UNAUTHORIZED", "Invalid email or password.");
  }

  mockAuthIdentity = {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
    },
    company: {
      id: user.company.id,
      name: user.company.name,
      status: user.company.status,
    },
  };

  return mockAuthIdentity;
}

function validateInvitationAcceptPayload(payload) {
  const details = [];
  const body = payload || {};
  const password = String(body.password || "");

  if (!String(body.token || "").trim()) {
    details.push({ field: "token", message: "La invitacion no esta disponible." });
  }

  if (String(body.displayName || "").trim().length > 160) {
    details.push({ field: "displayName", message: "El nombre debe tener 160 caracteres o menos." });
  }

  if (!isStrongPassword(password)) {
    details.push({
      field: "password",
      message: "El password debe tener 10 a 128 caracteres e incluir letras y numeros.",
    });
  }

  ["companyId", "email", "externalSubject"].forEach((field) => {
    if (hasOwn(body, field)) {
      details.push({ field, message: "El campo no debe enviarse desde el frontend." });
    }
  });

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function validateCompanyAuthLoginPayload(payload) {
  const details = [];
  const email = String(payload?.email || "").trim();
  const password = String(payload?.password || "");

  if (!email || !isEmail(email)) {
    details.push({ field: "email", message: "Ingrese un correo valido." });
  }

  if (!password || password.length > 128) {
    details.push({ field: "password", message: "Ingrese el password." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function throwInvitationStateError(reason) {
  if (reason === "expired") {
    throw new ApiError("INVITATION_EXPIRED", "La invitacion expiro.");
  }

  if (reason === "accepted") {
    throw new ApiError("INVITATION_ALREADY_ACCEPTED", "La invitacion ya fue aceptada.");
  }

  throw new ApiError("INVITATION_NOT_FOUND", "La invitacion no esta disponible.");
}

function isStrongPassword(password) {
  return (
    password.length >= 10 &&
    password.length <= 128 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

function normalizeNullableText(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function validatePurchase(payload) {
  const details = [];

  if (!String(payload.customerId ?? "").trim()) {
    details.push({ field: "customerId", message: "El cliente es requerido." });
  }

  if (!String(payload.invoiceNumber ?? "").trim()) {
    details.push({ field: "invoiceNumber", message: "El comprobante es requerido." });
  }

  if (!String(payload.purchaseDate ?? "").trim()) {
    details.push({ field: "purchaseDate", message: "La fecha es requerida." });
  }

  if (!Number.isFinite(Number(payload.amount)) || Number(payload.amount) <= 0) {
    details.push({ field: "amount", message: "El monto debe ser mayor que 0." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function validateRedemption(payload) {
  const details = [];
  const pointsRedeemed = Number(payload.pointsRedeemed);
  const note = String(payload.note ?? "").trim();

  if (!String(payload.customerId ?? "").trim()) {
    details.push({ field: "customerId", message: "El cliente es requerido." });
  }

  if (!String(payload.redemptionDate ?? "").trim()) {
    details.push({ field: "redemptionDate", message: "La fecha es requerida." });
  }

  if (!Number.isInteger(pointsRedeemed) || pointsRedeemed <= 0) {
    details.push({ field: "pointsRedeemed", message: "Los puntos deben ser un entero mayor que 0." });
  }

  if (note.length > 500) {
    details.push({ field: "note", message: "La nota debe tener 500 caracteres o menos." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los campos marcados.", details);
  }
}

function validateReportFilters(filters) {
  const details = [];
  const from = String(filters.from ?? "").trim();
  const to = String(filters.to ?? "").trim();
  const type = String(filters.type ?? "all").trim();

  if (!isDateOnly(from)) {
    details.push({ field: "from", message: "La fecha desde es requerida." });
  }

  if (!isDateOnly(to)) {
    details.push({ field: "to", message: "La fecha hasta es requerida." });
  }

  if (from && to && from > to) {
    details.push({ field: "to", message: "La fecha hasta debe ser igual o posterior a desde." });
  }

  if (!["all", "purchase", "redemption"].includes(type)) {
    details.push({ field: "type", message: "El tipo de reporte no es valido." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los filtros del reporte.", details);
  }
}

function validateAuditFilters(filters) {
  const details = [];
  const from = String(filters.from ?? "").trim();
  const to = String(filters.to ?? "").trim();
  const limit = Number(filters.limit || 25);

  if (!from) {
    details.push({ field: "from", message: "La fecha desde es requerida." });
  } else if (!isDateOnly(from)) {
    details.push({ field: "from", message: "La fecha desde no es valida." });
  }

  if (!to) {
    details.push({ field: "to", message: "La fecha hasta es requerida." });
  } else if (!isDateOnly(to)) {
    details.push({ field: "to", message: "La fecha hasta no es valida." });
  }

  if (isDateOnly(from) && isDateOnly(to) && from > to) {
    details.push({ field: "to", message: "La fecha hasta debe ser igual o posterior a desde." });
  }

  if (isDateOnly(from) && isDateOnly(to) && getDateRangeDays(from, to) > 31) {
    details.push({ field: "to", message: "El rango maximo es de 31 dias." });
  }

  if (!Number.isInteger(limit) || ![10, 25, 50].includes(limit)) {
    details.push({ field: "limit", message: "El limite debe ser 10, 25 o 50." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revise los filtros de auditoria.", details);
  }
}

function recordMockAuditEvent({ eventType, entityType, entityId = null, customer = null, summary }) {
  const event = {
    id: String(nextAuditEventId),
    occurredAt: new Date().toISOString(),
    eventType,
    entityType,
    entityId: entityId == null ? null : String(entityId),
    customerId: customer ? String(customer.id) : null,
    customerName: customer?.name ?? null,
    actorLabel: null,
    source: "api",
    summary,
  };

  nextAuditEventId += 1;
  mockAuditEvents = [event, ...mockAuditEvents];
}

function formatMockAmount(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function normalizeReportItem(customer, item) {
  return {
    ...item,
    customerId: String(customer.id),
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
  };
}

function buildReportSummary(items) {
  const activeCustomers = new Set(items.map((item) => String(item.customerId)));

  return items.reduce(
    (summary, item) => {
      if (item.type === "purchase") {
        summary.purchaseCount += 1;
        summary.purchaseAmountTotal += Number(item.amount ?? 0);
        summary.pointsEarnedTotal += Number(item.points ?? 0);
      }

      if (item.type === "redemption") {
        summary.redemptionCount += 1;
        summary.pointsRedeemedTotal += Math.abs(Number(item.points ?? 0));
      }

      summary.activeCustomerCount = activeCustomers.size;
      return summary;
    },
    {
      purchaseCount: 0,
      purchaseAmountTotal: 0,
      pointsEarnedTotal: 0,
      redemptionCount: 0,
      pointsRedeemedTotal: 0,
      activeCustomerCount: 0,
    },
  );
}

function isDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function getDateRangeDays(from, to) {
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  return Math.floor((toDate - fromDate) / 86400000) + 1;
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function hasOwn(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
