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
let mockCompanyRegistrationRequests = [
  {
    id: "200",
    companyName: "Cafe Central",
    companyEmail: "hola@cafecentral.test",
    companyPhone: "+50622223333",
    companyAddress: "San Jose, Costa Rica",
    contactName: "Maria Soto",
    contactEmail: "maria@cafecentral.test",
    contactPhone: "+50688887777",
    status: "pending",
    reviewedAt: null,
    reviewedByLabel: null,
    reviewNote: null,
    approvedCompanyId: null,
    createdAt: "2026-06-07T18:30:00Z",
    updatedAt: "2026-06-07T18:30:00Z",
    invitation: null,
    requestedLogo: { available: true, contentType: "image/png" },
  },
  {
    id: "199",
    companyName: "Panaderia Norte",
    companyEmail: "admin@panaderianorte.test",
    companyPhone: "+50624445555",
    companyAddress: "Alajuela, Costa Rica",
    contactName: "Luis Mora",
    contactEmail: "luis@panaderianorte.test",
    contactPhone: "+50687776666",
    status: "approved",
    reviewedAt: "2026-06-07T19:00:00Z",
    reviewedByLabel: "Panel interno",
    reviewNote: "Aprobada para piloto controlado.",
    approvedCompanyId: "10",
    createdAt: "2026-06-07T17:20:00Z",
    updatedAt: "2026-06-07T19:00:00Z",
    requestedLogo: { available: false, contentType: null },
    invitation: {
      id: "300",
      companyId: "10",
      email: "admin@panaderianorte.test",
      role: "owner",
      status: "pending",
      expiresAt: "2026-06-14T19:00:00Z",
      acceptedAt: null,
      revokedAt: null,
      createdAt: "2026-06-07T19:00:00Z",
    },
  },
  {
    id: "198",
    companyName: "Tienda Sur",
    companyEmail: "hola@tiendasur.test",
    companyPhone: "+50625556666",
    companyAddress: "Cartago, Costa Rica",
    contactName: "Ana Ruiz",
    contactEmail: "ana@tiendasur.test",
    contactPhone: "+50689998888",
    status: "rejected",
    reviewedAt: "2026-06-07T18:40:00Z",
    reviewedByLabel: "Panel interno",
    reviewNote: "Datos incompletos.",
    approvedCompanyId: null,
    createdAt: "2026-06-07T16:10:00Z",
    updatedAt: "2026-06-07T18:40:00Z",
    invitation: null,
    requestedLogo: { available: false, contentType: null },
  },
];
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
let nextCompanyRegistrationRequestId = 201;
let nextCompanyInvitationId = 301;
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
  let activeCompanyId = normalizeCompanyId(config.companyId);
  const companyRegistrationRequestsUrl = buildApiUrl(config, "/api/company-registration-requests");
  const companyInvitationsValidateUrl = buildApiUrl(config, "/api/company-invitations/validate");
  const companyInvitationsAcceptUrl = buildApiUrl(config, "/api/company-invitations/accept");
  const companyAuthLoginUrl = buildApiUrl(config, "/api/company-auth/login");
  const companyAuthLogoutUrl = buildApiUrl(config, "/api/company-auth/logout");
  const companyLogoUrl = buildApiUrl(config, "/api/my-company/logo");
  const meUrl = buildApiUrl(config, "/api/me");
  const getActiveCompanyId = () => activeCompanyId || normalizeCompanyId(config.companyId);
  const buildCompanyUrl = (path) =>
    buildApiUrl(config, `/api/companies/${encodeURIComponent(getActiveCompanyId())}${path}`);

  return {
    sourceLabel: "API real",
    setActiveCompanyId(companyId) {
      activeCompanyId = normalizeCompanyId(companyId) || normalizeCompanyId(config.companyId);
    },
    getActiveCompanyId() {
      return getActiveCompanyId();
    },
    getCompanyLogoUrl(logoUrl = "/api/my-company/logo") {
      return buildApiUrl(config, logoUrl || "/api/my-company/logo");
    },
    async acceptCompanyInvitation(payload) {
      const response = await fetch(companyInvitationsAcceptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(buildCompanyUrl("/settings"), {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async updateCompanySettings(payload) {
      const response = await fetch(buildCompanyUrl("/settings"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async uploadCompanyLogo(file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(companyLogoUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      return parseResponse(response);
    },
    async createCompanyRegistrationRequest(payload) {
      const logoFile = payload?.logoFile || null;
      const submissionPayload = stripLogoFile(payload);
      const requestOptions = {
        method: "POST",
      };

      if (logoFile) {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(submissionPayload));
        formData.append("file", logoFile);
        requestOptions.body = formData;
      } else {
        requestOptions.headers = { "Content-Type": "application/json" };
        requestOptions.body = JSON.stringify(submissionPayload);
      }

      const response = await fetch(companyRegistrationRequestsUrl, {
        ...requestOptions,
      });

      return parseResponse(response);
    },
    async listCompanyRegistrationRequests(filters, adminToken) {
      const url = new URL(companyRegistrationRequestsUrl, window.location.origin);
      url.searchParams.set("status", filters.status || "pending");
      url.searchParams.set("limit", filters.limit || "25");
      const response = await fetch(url, {
        headers: buildAdminHeaders(adminToken),
      });

      return parseResponse(response);
    },
    async approveCompanyRegistrationRequest(requestId, payload, adminToken) {
      const response = await fetch(`${companyRegistrationRequestsUrl}/${encodeURIComponent(requestId)}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(adminToken),
        },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async rejectCompanyRegistrationRequest(requestId, payload, adminToken) {
      const response = await fetch(`${companyRegistrationRequestsUrl}/${encodeURIComponent(requestId)}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAdminHeaders(adminToken),
        },
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async resendCompanyInvitation(invitationId, adminToken) {
      const url = buildApiUrl(config, `/api/company-invitations/${encodeURIComponent(invitationId)}/resend`);
      const response = await fetch(url, {
        method: "POST",
        headers: buildAdminHeaders(adminToken),
      });

      return parseResponse(response);
    },
    async searchCustomers(search) {
      const url = new URL(buildCompanyUrl("/customers"), window.location.origin);
      if (search) {
        url.searchParams.set("search", search);
      }

      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async createCustomer(payload) {
      const response = await fetch(buildCompanyUrl("/customers"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async getCustomerBalance(customerId) {
      const url = buildCompanyUrl(`/customers/${customerId}/balance`);
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async getCustomerActivity(customerId) {
      const url = buildCompanyUrl(`/customers/${customerId}/activity`);
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async getActivityReport(filters) {
      const url = new URL(buildCompanyUrl("/reports/activity"), window.location.origin);
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      url.searchParams.set("type", filters.type || "all");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async getAuditEvents(filters) {
      const url = new URL(buildCompanyUrl("/audit/events"), window.location.origin);
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      url.searchParams.set("limit", filters.limit || "25");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async createPurchase(payload) {
      const response = await fetch(buildCompanyUrl("/purchases"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      return parseResponse(response);
    },
    async createRedemption(payload) {
      const response = await fetch(buildCompanyUrl("/redemptions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

function buildAdminHeaders(adminToken) {
  const token = String(adminToken ?? "").trim();
  return token ? { "x-puntoclub-admin-token": token } : {};
}

function createMockCustomerApi() {
  let activeCompanyId = "9";

  return {
    sourceLabel: "Mock local",
    setActiveCompanyId(companyId) {
      activeCompanyId = normalizeCompanyId(companyId) || "9";
    },
    getActiveCompanyId() {
      return activeCompanyId;
    },
    getCompanyLogoUrl(logoUrl = "") {
      return logoUrl;
    },
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
    async uploadCompanyLogo(file) {
      await wait(450);
      validateMockCompanyLogo(file);
      const now = new Date().toISOString();
      mockCompanySettings = {
        ...mockCompanySettings,
        logoUrl: "/api/my-company/logo",
        logoContentType: file.type,
        logoUpdatedAt: now,
        updatedAt: now,
      };
      recordMockAuditEvent({
        eventType: "company.logo.updated",
        entityType: "company",
        entityId: mockCompanySettings.id,
        summary: "Logo actualizado.",
      });
      return {
        logoUrl: mockCompanySettings.logoUrl,
        contentType: file.type,
        updatedAt: now,
      };
    },
    async createCompanyRegistrationRequest(payload) {
      await wait(500);
      if (payload.logoFile) {
        validateMockCompanyLogo(payload.logoFile);
      }
      validateCompanyRegistrationRequest(payload);
      const request = normalizeCompanyRegistrationPayload(payload);
      const requestedLogo = payload.logoFile
        ? { available: true, contentType: payload.logoFile.type || null }
        : { available: false, contentType: null };

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
        companyPhone: request.companyPhone,
        companyAddress: request.companyAddress,
        contactName: request.contactName,
        contactEmail: request.contactEmail,
        contactPhone: request.contactPhone,
        status: "pending",
        reviewedAt: null,
        reviewedByLabel: null,
        reviewNote: null,
        approvedCompanyId: null,
        createdAt: now,
        updatedAt: now,
        invitation: null,
        requestedLogo,
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
      return cloneMockRegistrationRequest(result);
    },
    async listCompanyRegistrationRequests(filters, adminToken) {
      await wait(350);
      validateMockAdminToken(adminToken);
      const status = filters.status || "pending";
      const limit = Number(filters.limit || 25);
      const allowedStatuses = new Set(["pending", "approved", "rejected", "cancelled", "all"]);

      if (!allowedStatuses.has(status) || ![10, 25, 50].includes(limit)) {
        throw new ApiError("VALIDATION_ERROR", "Revise los filtros.", []);
      }

      const items = mockCompanyRegistrationRequests
        .filter((request) => status === "all" || request.status === status)
        .slice(0, limit)
        .map(cloneMockRegistrationRequest);

      return { status, limit, items };
    },
    async approveCompanyRegistrationRequest(requestId, payload, adminToken) {
      await wait(450);
      validateMockAdminToken(adminToken);
      const request = findPendingMockRegistrationRequest(requestId);
      const reviewNote = String(payload?.reviewNote ?? "").trim();
      const now = new Date().toISOString();
      const companyId = String(20 + Number(request.id));
      const invitation = {
        id: String(nextCompanyInvitationId),
        companyId,
        email: request.companyEmail,
        role: "owner",
        status: "pending",
        expiresAt: addDaysIso(now, 7),
        acceptedAt: null,
        revokedAt: null,
        createdAt: now,
      };

      nextCompanyInvitationId += 1;
      Object.assign(request, {
        status: "approved",
        reviewedAt: now,
        reviewedByLabel: "Panel interno",
        reviewNote: reviewNote || null,
        approvedCompanyId: companyId,
        updatedAt: now,
        invitation,
      });

      return {
        id: request.id,
        status: request.status,
        reviewedAt: request.reviewedAt,
        approvedCompanyId: companyId,
        invitation: { ...invitation },
      };
    },
    async rejectCompanyRegistrationRequest(requestId, payload, adminToken) {
      await wait(450);
      validateMockAdminToken(adminToken);
      const request = findPendingMockRegistrationRequest(requestId);
      const reviewNote = String(payload?.reviewNote ?? "").trim();

      if (!reviewNote || reviewNote.length > 500) {
        throw new ApiError("VALIDATION_ERROR", "Ingrese un motivo valido.", [
          { field: "reviewNote", message: "El motivo es requerido." },
        ]);
      }

      const now = new Date().toISOString();
      Object.assign(request, {
        status: "rejected",
        reviewedAt: now,
        reviewedByLabel: "Panel interno",
        reviewNote,
        updatedAt: now,
      });

      return {
        id: request.id,
        status: request.status,
        reviewedAt: request.reviewedAt,
      };
    },
    async resendCompanyInvitation(invitationId, adminToken) {
      await wait(400);
      validateMockAdminToken(adminToken);
      const request = mockCompanyRegistrationRequests.find(
        (item) => String(item.invitation?.id) === String(invitationId),
      );
      const invitation = request?.invitation;

      if (!invitation) {
        throw new ApiError("INVITATION_NOT_FOUND", "La invitacion no esta disponible.");
      }

      if (invitation.status === "accepted") {
        throw new ApiError("INVITATION_ALREADY_ACCEPTED", "La invitacion ya fue aceptada.");
      }

      if (invitation.status !== "pending") {
        throw new ApiError("INVITATION_EXPIRED", "La invitacion expiro.");
      }

      const now = new Date().toISOString();
      invitation.expiresAt = addDaysIso(now, 7);
      invitation.resentAt = now;

      return {
        id: invitation.id,
        status: "pending",
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        resentAt: now,
      };
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
  const editableFields = ["name", "email", "phone", "pointsPercentage"];
  const hasEditableField = editableFields.some((field) => hasOwn(payload, field));
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
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
    pointsPercentage: Number(payload.pointsPercentage),
  };
}

function validateMockCompanyLogo(file) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

  if (!file) {
    throw new ApiError("VALIDATION_ERROR", "Seleccione un archivo de logo.");
  }

  if (!allowedTypes.has(file.type)) {
    throw new ApiError("UNSUPPORTED_MEDIA_TYPE", "El tipo de archivo no esta permitido.");
  }

  if (file.size > 1048576) {
    throw new ApiError("UPLOAD_TOO_LARGE", "El archivo supera el tamano maximo.");
  }
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

function stripLogoFile(payload) {
  const { logoFile, ...rest } = payload || {};
  return rest;
}

function validateMockAdminToken(adminToken) {
  const token = String(adminToken ?? "").trim();

  if (!token || token === "invalid" || token === "token-invalido") {
    throw new ApiError("FORBIDDEN", "Token interno invalido.");
  }
}

function findPendingMockRegistrationRequest(requestId) {
  const request = mockCompanyRegistrationRequests.find((item) => String(item.id) === String(requestId));

  if (!request || request.status !== "pending") {
    throw new ApiError("COMPANY_REGISTRATION_REQUEST_NOT_FOUND", "Solicitud no encontrada.");
  }

  return request;
}

function cloneMockRegistrationRequest(request) {
  return {
    ...request,
    invitation: request.invitation ? { ...request.invitation } : null,
  };
}

function addDaysIso(value, days) {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
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

function normalizeCompanyId(value) {
  return String(value ?? "").trim();
}

function hasOwn(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
