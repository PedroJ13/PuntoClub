const initialCustomers = [
  {
    id: 10,
    name: "Mar\u00eda Soto",
    phone: "+50688887777",
    email: "maria@example.com",
    createdAt: "2026-06-02T15:20:00Z",
    updatedAt: "2026-06-02T15:20:00Z",
  },
  {
    id: 11,
    name: "Jos\u00e9 Vega",
    phone: "+50622223333",
    email: "jose@example.com",
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
  loyaltyPointsEnabled: true,
  loyaltyMembershipsEnabled: true,
  status: "active",
  updatedAt: "2026-06-02T15:20:00Z",
};
let mockMembershipPlans = [
  {
    id: "501",
    companyId: "1",
    name: "Club Cafe",
    description: "Beneficios mensuales para clientes frecuentes.",
    durationDays: 30,
    price: 12000,
    renewalNoticeDays: 5,
    status: "active",
    benefitCount: 2,
    createdAt: "2026-06-13T10:00:00Z",
    updatedAt: "2026-06-13T10:00:00Z",
  },
];
let mockMembershipBenefits = [
  {
    id: "801",
    planId: "501",
    name: "10% en bebidas",
    description: "Aplica en bebidas frias y calientes.",
    benefitType: "discount",
    appliesToType: "category",
    appliesToName: "Bebidas",
    discountPercent: 10,
    includedQuantity: null,
    usageLimit: null,
    usagePeriod: "none",
    status: "active",
    createdAt: "2026-06-13T10:05:00Z",
    updatedAt: "2026-06-13T10:05:00Z",
  },
  {
    id: "802",
    planId: "501",
    name: "Cafe de cortesia",
    description: "Un cafe incluido por mes.",
    benefitType: "free_item",
    appliesToType: "product",
    appliesToName: "Cafe americano",
    discountPercent: null,
    includedQuantity: 1,
    usageLimit: 1,
    usagePeriod: "month",
    status: "active",
    createdAt: "2026-06-13T10:10:00Z",
    updatedAt: "2026-06-13T10:10:00Z",
  },
];
let mockCustomerMemberships = [];
let mockMembershipBenefitUsages = [];
let mockMembershipTransactions = [];
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
let nextMembershipPlanId = 502;
let nextMembershipBenefitId = 803;
let nextCustomerMembershipId = 901;
let nextMembershipBenefitUsageId = 1001;
let nextMembershipTransactionId = 1101;
const mockCompanyRegistrationLogoPng = [
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
  0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196,
  137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 96, 248, 207,
  192, 0, 0, 3, 1, 1, 0, 24, 221, 141, 181, 0, 0, 0, 0,
  73, 69, 78, 68, 174, 66, 96, 130,
];

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
    sourceLabel: "Datos reales",
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
    async getCompanyRegistrationRequestLogo(requestId, adminToken) {
      const response = await fetch(`${companyRegistrationRequestsUrl}/${encodeURIComponent(requestId)}/logo`, {
        headers: buildAdminHeaders(adminToken),
      });

      return parseBlobResponse(response);
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
    async getMembershipFinancialReport(filters) {
      const url = new URL(buildApiUrl(config, "/api/reports/memberships-financial"), window.location.origin);
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async getCustomerReport(filters) {
      const url = new URL(buildCompanyUrl("/reports/customer"), window.location.origin);
      url.searchParams.set("search", filters.search);
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
    async listMembershipPlans(filters = {}) {
      const url = new URL(buildApiUrl(config, "/api/membership-plans"), window.location.origin);
      url.searchParams.set("status", filters.status || "all");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async createMembershipPlan(payload) {
      const response = await fetch(buildApiUrl(config, "/api/membership-plans"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async updateMembershipPlan(planId, payload) {
      const response = await fetch(buildApiUrl(config, `/api/membership-plans/${encodeURIComponent(planId)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async activateMembershipPlan(planId) {
      const response = await fetch(buildApiUrl(config, `/api/membership-plans/${encodeURIComponent(planId)}/activate`), {
        method: "POST",
        credentials: "include",
      });
      return parseResponse(response);
    },
    async deactivateMembershipPlan(planId) {
      const response = await fetch(buildApiUrl(config, `/api/membership-plans/${encodeURIComponent(planId)}/deactivate`), {
        method: "POST",
        credentials: "include",
      });
      return parseResponse(response);
    },
    async listMembershipBenefits(planId, filters = {}) {
      const url = new URL(
        buildApiUrl(config, `/api/membership-plans/${encodeURIComponent(planId)}/benefits`),
        window.location.origin,
      );
      url.searchParams.set("status", filters.status || "all");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async createMembershipBenefit(planId, payload) {
      const response = await fetch(buildApiUrl(config, `/api/membership-plans/${encodeURIComponent(planId)}/benefits`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async updateMembershipBenefit(benefitId, payload) {
      const response = await fetch(buildApiUrl(config, `/api/membership-benefits/${encodeURIComponent(benefitId)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async createCustomerMembership(customerId, payload) {
      const response = await fetch(buildApiUrl(config, `/api/customers/${encodeURIComponent(customerId)}/memberships`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async renewCustomerMembership(customerId, customerMembershipId, payload) {
      const response = await fetch(
        buildApiUrl(
          config,
          `/api/customers/${encodeURIComponent(customerId)}/memberships/${encodeURIComponent(customerMembershipId)}/renew`,
        ),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      return parseResponse(response);
    },
    async listCustomerMemberships(customerId, filters = {}) {
      const url = new URL(
        buildApiUrl(config, `/api/customers/${encodeURIComponent(customerId)}/memberships`),
        window.location.origin,
      );
      url.searchParams.set("status", filters.status || "all");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async listMembershipTransactions(customerId, filters = {}) {
      const url = new URL(
        buildApiUrl(config, `/api/customers/${encodeURIComponent(customerId)}/membership-transactions`),
        window.location.origin,
      );
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async listMembershipExpirationAlerts(filters = {}) {
      const url = new URL(buildApiUrl(config, "/api/memberships/expiration-alerts"), window.location.origin);
      url.searchParams.set("status", filters.status || "active");
      url.searchParams.set("withinDays", filters.withinDays || "5");
      const response = await fetch(url, {
        credentials: "include",
      });
      return parseResponse(response);
    },
    async createMembershipBenefitUsage(customerId, payload) {
      const response = await fetch(buildApiUrl(config, `/api/customers/${encodeURIComponent(customerId)}/membership-benefit-usages`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      return parseResponse(response);
    },
    async listMembershipBenefitUsages(customerId, filters = {}) {
      const url = new URL(
        buildApiUrl(config, `/api/customers/${encodeURIComponent(customerId)}/membership-benefit-usages`),
        window.location.origin,
      );
      url.searchParams.set("from", filters.from);
      url.searchParams.set("to", filters.to);
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
    sourceLabel: "Modo de prueba",
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
        throw new ApiError("VALIDATION_ERROR", "Revisa los filtros antes de continuar.", []);
      }

      const items = mockCompanyRegistrationRequests
        .filter((request) => status === "all" || request.status === status)
        .slice(0, limit)
        .map(cloneMockRegistrationRequest);

      return { status, limit, items };
    },
    async getCompanyRegistrationRequestLogo(requestId, adminToken) {
      await wait(250);
      validateMockAdminToken(adminToken);
      const request = mockCompanyRegistrationRequests.find((item) => String(item.id) === String(requestId));

      if (!request) {
        throw new ApiError("COMPANY_REGISTRATION_REQUEST_NOT_FOUND", "Solicitud no encontrada.");
      }

      if (!request.requestedLogo?.available) {
        throw new ApiError("COMPANY_REGISTRATION_LOGO_NOT_FOUND", "Logo no disponible.");
      }

      return createMockCompanyRegistrationLogoBlob();
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
        throw new ApiError("VALIDATION_ERROR", "Ingresa un motivo valido.", [
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
        throw new ApiError("INTERNAL_ERROR", "No pudimos consultar clientes. Intenta de nuevo.");
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
          "Ya existe un cliente con ese telefono o correo.",
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
        summary: `Puntos redimidos: ${redemption.pointsRedeemed} pts.`,
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
    async getMembershipFinancialReport(filters) {
      await wait(300);
      validateMembershipFinancialReportFilters(filters);
      const items = mockMembershipTransactions
        .filter((transaction) => transaction.transactionDate >= filters.from && transaction.transactionDate <= filters.to)
        .filter((transaction) => ["new_membership", "renewal"].includes(transaction.transactionType))
        .map((transaction) => ({
          ...cloneMembershipTransaction(transaction),
          customerName: findMockCustomer(transaction.customerId).name,
          customerPhone: findMockCustomer(transaction.customerId).phone,
          customerEmail: findMockCustomer(transaction.customerId).email,
        }));

      return {
        from: filters.from,
        to: filters.to,
        summary: buildMembershipFinancialReportSummary(items),
        items,
      };
    },
    async getCustomerReport(filters) {
      await wait(300);
      validateReportFilters(filters);
      const candidates = findCustomerReportCandidates(filters.search);
      const baseReport = {
        search: String(filters.search ?? "").trim(),
        from: filters.from,
        to: filters.to,
        type: filters.type || "all",
        summary: buildReportSummary([]),
        items: [],
      };

      if (candidates.length === 0) {
        return {
          ...baseReport,
          status: "not_found",
          customer: null,
          candidates: [],
        };
      }

      if (candidates.length > 1) {
        return {
          ...baseReport,
          status: "ambiguous",
          customer: null,
          candidates: candidates.map((candidate) => ({ ...candidate })),
        };
      }

      const customer = candidates[0];
      const items = getMockCustomerReportMovements(customer, filters);
      return {
        ...baseReport,
        status: "resolved",
        customer: { ...customer },
        candidates: [],
        summary: buildReportSummary(items),
        items,
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
    async listMembershipPlans(filters = {}) {
      await wait(250);
      const status = filters.status || "all";
      return {
        status,
        items: mockMembershipPlans
          .filter((plan) => status === "all" || plan.status === status)
          .map(cloneMembershipPlan),
      };
    },
    async createMembershipPlan(payload) {
      await wait(350);
      validateMembershipPlan(payload);
      const now = new Date().toISOString();
      const plan = {
        id: String(nextMembershipPlanId),
        companyId: mockCompanySettings.id,
        ...normalizeMembershipPlanPayload(payload),
        benefitCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      nextMembershipPlanId += 1;
      mockMembershipPlans = [plan, ...mockMembershipPlans];
      recordMockAuditEvent({
        eventType: "membership.plan.created",
        entityType: "membership_plan",
        entityId: plan.id,
        summary: `Plan creado: ${plan.name}.`,
      });
      return cloneMembershipPlan(plan);
    },
    async updateMembershipPlan(planId, payload) {
      await wait(350);
      validateMembershipPlan(payload);
      const plan = findMockMembershipPlan(planId);
      Object.assign(plan, normalizeMembershipPlanPayload(payload), {
        updatedAt: new Date().toISOString(),
      });
      recordMockAuditEvent({
        eventType: "membership.plan.updated",
        entityType: "membership_plan",
        entityId: plan.id,
        summary: `Plan actualizado: ${plan.name}.`,
      });
      return cloneMembershipPlan(plan);
    },
    async activateMembershipPlan(planId) {
      await wait(250);
      const plan = findMockMembershipPlan(planId);
      plan.status = "active";
      plan.updatedAt = new Date().toISOString();
      return cloneMembershipPlan(plan);
    },
    async deactivateMembershipPlan(planId) {
      await wait(250);
      const plan = findMockMembershipPlan(planId);
      plan.status = "inactive";
      plan.updatedAt = new Date().toISOString();
      return cloneMembershipPlan(plan);
    },
    async listMembershipBenefits(planId, filters = {}) {
      await wait(250);
      findMockMembershipPlan(planId);
      const status = filters.status || "all";
      return {
        status,
        items: mockMembershipBenefits
          .filter((benefit) => String(benefit.planId) === String(planId))
          .filter((benefit) => status === "all" || benefit.status === status)
          .map(cloneMembershipBenefit),
      };
    },
    async createMembershipBenefit(planId, payload) {
      await wait(350);
      findMockMembershipPlan(planId);
      validateMembershipBenefit(payload);
      const now = new Date().toISOString();
      const benefit = {
        id: String(nextMembershipBenefitId),
        planId: String(planId),
        ...normalizeMembershipBenefitPayload(payload),
        createdAt: now,
        updatedAt: now,
      };
      nextMembershipBenefitId += 1;
      mockMembershipBenefits = [benefit, ...mockMembershipBenefits];
      refreshMockBenefitCounts();
      recordMockAuditEvent({
        eventType: "membership.benefit.created",
        entityType: "membership_benefit",
        entityId: benefit.id,
        summary: `Beneficio creado: ${benefit.name}.`,
      });
      return cloneMembershipBenefit(benefit);
    },
    async updateMembershipBenefit(benefitId, payload) {
      await wait(350);
      validateMembershipBenefit(payload);
      const benefit = findMockMembershipBenefit(benefitId);
      Object.assign(benefit, normalizeMembershipBenefitPayload(payload), {
        updatedAt: new Date().toISOString(),
      });
      recordMockAuditEvent({
        eventType: "membership.benefit.updated",
        entityType: "membership_benefit",
        entityId: benefit.id,
        summary: `Beneficio actualizado: ${benefit.name}.`,
      });
      return cloneMembershipBenefit(benefit);
    },
    async createCustomerMembership(customerId, payload) {
      await wait(350);
      const customer = findMockCustomer(customerId);
      const plan = findMockMembershipPlan(payload?.planId);
      validateMembershipActivation(payload);

      if (plan.status !== "active") {
        throw new ApiError("MEMBERSHIP_PLAN_INACTIVE", "Este plan esta inactivo.");
      }

      if (mockCustomerMemberships.some((membership) => String(membership.customerId) === String(customer.id) && membership.status === "active")) {
        throw new ApiError("CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP", "El cliente ya tiene una membresia activa.");
      }

      const startDate = payload.startDate;
      const endDate = calculateMembershipEndDate(startDate, plan.durationDays);
      const now = new Date().toISOString();
      const pricePaid = payload.amount === "" || payload.amount == null
        ? Number(payload.pricePaid)
        : Number(payload.amount);
      const membership = {
        id: String(nextCustomerMembershipId),
        companyId: mockCompanySettings.id,
        customerId: String(customer.id),
        planId: String(plan.id),
        membershipPlanId: String(plan.id),
        planName: plan.name,
        plan: { id: String(plan.id), name: plan.name },
        startDate,
        endDate,
        status: "active",
        pricePaid,
        expirationAlert: calculateExpirationAlert(endDate, plan.renewalNoticeDays),
        createdAt: now,
        cancelledAt: null,
        cancelledByLabel: null,
        cancelNote: null,
      };
      nextCustomerMembershipId += 1;
      const transaction = createMockMembershipTransaction({
        customer,
        membership,
        plan,
        transactionType: "new_membership",
        paymentMethod: payload.paymentMethod,
        amount: pricePaid,
        transactionDate: startDate,
        note: payload.note || "Activacion desde Web",
      });
      mockCustomerMemberships = [membership, ...mockCustomerMemberships];
      mockActivity.set(String(customer.id), [
        {
          type: "membership",
          id: membership.id,
          date: membership.startDate,
          note: `Membresia activada: ${plan.name}`,
          amount: membership.pricePaid,
          points: 0,
        },
        ...(mockActivity.get(String(customer.id)) ?? []),
      ]);
      recordMockAuditEvent({
        eventType: "customer.membership.activated",
        entityType: "customer_membership",
        entityId: membership.id,
        customerId: membership.customerId,
        summary: `Membresia activada: ${plan.name}.`,
      });
      return {
        ...cloneCustomerMembership(membership),
        transaction: cloneMembershipTransaction(transaction),
      };
    },
    async renewCustomerMembership(customerId, customerMembershipId, payload) {
      await wait(350);
      const customer = findMockCustomer(customerId);
      validateMembershipRenewal(payload);
      const membership = mockCustomerMemberships.find(
        (item) => String(item.id) === String(customerMembershipId) && String(item.customerId) === String(customer.id),
      );

      if (!membership) {
        throw new ApiError("CUSTOMER_MEMBERSHIP_NOT_FOUND", "Membresia no encontrada.");
      }
      if (membership.status === "cancelled") {
        throw new ApiError("CUSTOMER_MEMBERSHIP_CANCELLED", "La membresia esta cancelada.");
      }

      const plan = findMockMembershipPlan(membership.planId || membership.membershipPlanId);
      const transactionDate = getToday();
      const nextStartDate = membership.status === "active" && membership.endDate >= transactionDate
        ? addDaysIso(membership.endDate, 1)
        : transactionDate;
      const nextEndDate = calculateMembershipEndDate(nextStartDate, plan.durationDays);
      const amount = Number(payload.amount);

      Object.assign(membership, {
        endDate: nextEndDate,
        status: "active",
        pricePaid: amount,
        expirationAlert: calculateExpirationAlert(nextEndDate, plan.renewalNoticeDays),
      });

      const transaction = createMockMembershipTransaction({
        customer,
        membership,
        plan,
        transactionType: "renewal",
        paymentMethod: payload.paymentMethod,
        amount,
        transactionDate,
        note: payload.note || "Renovacion desde Web",
      });

      mockActivity.set(String(customer.id), [
        {
          type: "membership",
          id: transaction.id,
          date: transaction.transactionDate,
          note: `Membresia renovada: ${plan.name}`,
          amount: transaction.amount,
          points: 0,
        },
        ...(mockActivity.get(String(customer.id)) ?? []),
      ]);
      recordMockAuditEvent({
        eventType: "customer.membership.renewed",
        entityType: "customer_membership",
        entityId: membership.id,
        customerId: membership.customerId,
        summary: `Membresia renovada: ${plan.name}.`,
      });

      return {
        membership: cloneCustomerMembership(membership),
        transaction: cloneMembershipTransaction(transaction),
      };
    },
    async listCustomerMemberships(customerId, filters = {}) {
      await wait(250);
      findMockCustomer(customerId);
      const status = filters.status || "all";
      return {
        customerId: String(customerId),
        status,
        items: mockCustomerMemberships
          .filter((membership) => String(membership.customerId) === String(customerId))
          .filter((membership) => status === "all" || membership.status === status)
          .map(cloneCustomerMembership),
      };
    },
    async listMembershipTransactions(customerId, filters = {}) {
      await wait(250);
      findMockCustomer(customerId);
      validateMembershipTransactionsFilters(filters);
      return {
        customerId: String(customerId),
        from: filters.from,
        to: filters.to,
        items: mockMembershipTransactions
          .filter((transaction) => String(transaction.customerId) === String(customerId))
          .filter((transaction) => transaction.transactionDate >= filters.from && transaction.transactionDate <= filters.to)
          .map(cloneMembershipTransaction),
      };
    },
    async listMembershipExpirationAlerts(filters = {}) {
      await wait(250);
      const withinDays = Number(filters.withinDays || 5);
      const status = filters.status || "active";
      const today = getToday();
      return {
        withinDays,
        status,
        items: mockCustomerMemberships
          .filter((membership) => {
            if (status === "active") {
              return membership.status === "active" && membership.endDate >= today;
            }
            if (status === "expired") {
              return membership.status === "expired" || (membership.status === "active" && membership.endDate < today);
            }
            return membership.status === status;
          })
          .map((membership) => ({
            id: membership.id,
            companyId: membership.companyId,
            customerId: membership.customerId,
            customerName: findMockCustomer(membership.customerId).name,
            customerPhone: findMockCustomer(membership.customerId).phone,
            customerEmail: findMockCustomer(membership.customerId).email,
            customerMembershipId: membership.id,
            planId: membership.planId,
            membershipPlanId: membership.membershipPlanId,
            planName: membership.planName,
            startDate: membership.startDate,
            endDate: membership.endDate,
            status: membership.status,
            ...calculateExpirationAlert(membership.endDate, withinDays),
          }))
          .filter((item) => status !== "active" || item.daysUntilExpiration <= withinDays),
      };
    },
    async createMembershipBenefitUsage(customerId, payload) {
      await wait(350);
      const customer = findMockCustomer(customerId);
      const activeMembership = mockCustomerMemberships.find(
        (membership) => String(membership.customerId) === String(customer.id) && membership.status === "active",
      );

      if (!activeMembership) {
        throw new ApiError("CUSTOMER_MEMBERSHIP_NOT_ACTIVE", "El cliente no tiene membresia activa.");
      }

      validateMembershipBenefitUsage(payload);
      if (payload.customerMembershipId && String(payload.customerMembershipId) !== String(activeMembership.id)) {
        throw new ApiError("CUSTOMER_MEMBERSHIP_NOT_ACTIVE", "La membresia no esta activa. Renuevala antes de aplicar beneficios.");
      }

      const benefit = findMockMembershipBenefit(payload.benefitId || payload.membershipBenefitId);
      if (String(benefit.planId) !== String(activeMembership.planId)) {
        throw new ApiError("MEMBERSHIP_BENEFIT_NOT_IN_ACTIVE_PLAN", "El beneficio no pertenece al plan activo.");
      }
      if (benefit.status !== "active") {
        throw new ApiError("MEMBERSHIP_BENEFIT_INACTIVE", "El beneficio esta inactivo.");
      }

      const quantity = Number(payload.quantity || 1);
      const usagePeriodStartDate = calculateUsagePeriodStartDate(
        payload.usageDate,
        benefit.usagePeriod,
        activeMembership.startDate,
      );

      if (benefit.usageLimit) {
        const usedQuantity = mockMembershipBenefitUsages
          .filter((usage) => String(usage.customerMembershipId) === String(activeMembership.id))
          .filter((usage) => String(usage.benefitId) === String(benefit.id))
          .filter((usage) => usage.usagePeriodStartDate === usagePeriodStartDate)
          .reduce((sum, usage) => sum + Number(usage.quantity), 0);

        if (usedQuantity + quantity > Number(benefit.usageLimit)) {
          throw new ApiError("MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED", "Limite de uso alcanzado.");
        }
      }

      const usage = {
        id: String(nextMembershipBenefitUsageId),
        companyId: mockCompanySettings.id,
        customerId: String(customer.id),
        customerMembershipId: String(activeMembership.id),
        benefitId: String(benefit.id),
        membershipBenefitId: String(benefit.id),
        benefitName: benefit.name,
        benefitType: benefit.benefitType,
        planId: activeMembership.planId,
        membershipPlanId: activeMembership.planId,
        planName: activeMembership.planName,
        usageDate: payload.usageDate,
        usagePeriodStartDate,
        quantity,
        note: String(payload.note || "").trim() || null,
        usedAt: new Date().toISOString(),
        createdByLabel: "mock@puntoclub.test",
      };
      nextMembershipBenefitUsageId += 1;
      mockMembershipBenefitUsages = [usage, ...mockMembershipBenefitUsages];
      mockActivity.set(String(customer.id), [
        {
          type: "membership",
          id: usage.id,
          date: usage.usageDate,
          note: `Beneficio usado: ${benefit.name} x${usage.quantity}`,
          amount: null,
          points: 0,
        },
        ...(mockActivity.get(String(customer.id)) ?? []),
      ]);
      recordMockAuditEvent({
        eventType: "membership.benefit.used",
        entityType: "membership_benefit_usage",
        entityId: usage.id,
        customerId: usage.customerId,
        summary: `Uso de beneficio registrado: ${benefit.name}.`,
      });
      return cloneMembershipBenefitUsage(usage);
    },
    async listMembershipBenefitUsages(customerId, filters = {}) {
      await wait(250);
      findMockCustomer(customerId);
      validateMembershipBenefitUsageFilters(filters);
      return {
        customerId: String(customerId),
        from: filters.from,
        to: filters.to,
        items: mockMembershipBenefitUsages
          .filter((usage) => String(usage.customerId) === String(customerId))
          .filter((usage) => usage.usageDate >= filters.from && usage.usageDate <= filters.to)
          .map(cloneMembershipBenefitUsage),
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

async function parseBlobResponse(response) {
  if (!response.ok) {
    return parseResponse(response);
  }

  return response.blob();
}

function validateMembershipPlan(payload) {
  const details = [];
  const name = String(payload?.name ?? "").trim();
  const durationDays = Number(payload?.durationDays);
  const price = Number(payload?.price);
  const renewalNoticeDays = Number(payload?.renewalNoticeDays ?? 5);
  const status = String(payload?.status || "active");

  if (!name || name.length > 120) {
    details.push({ field: "name", message: "El nombre es requerido." });
  }

  if (!Number.isInteger(durationDays) || durationDays <= 0) {
    details.push({ field: "durationDays", message: "La duracion debe ser mayor que 0." });
  }

  if (!Number.isFinite(price) || price < 0) {
    details.push({ field: "price", message: "El precio debe ser 0 o mayor." });
  }

  if (!Number.isInteger(renewalNoticeDays) || renewalNoticeDays < 0) {
    details.push({ field: "renewalNoticeDays", message: "El aviso debe ser 0 o mayor." });
  }

  if (!["active", "inactive"].includes(status)) {
    details.push({ field: "status", message: "El estado no es valido." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos del plan antes de continuar.", details);
  }
}

function normalizeMembershipPlanPayload(payload) {
  return {
    name: String(payload.name ?? "").trim(),
    description: normalizeNullableText(payload.description),
    durationDays: Number(payload.durationDays),
    price: Number(payload.price),
    renewalNoticeDays: Number(payload.renewalNoticeDays ?? 5),
    status: payload.status || "active",
  };
}

function validateMembershipBenefit(payload) {
  const details = [];
  const type = String(payload?.benefitType || "");
  const discountPercent = Number(payload?.discountPercent);
  const includedQuantity = Number(payload?.includedQuantity);
  const usageLimit = Number(payload?.usageLimit);
  const usagePeriod = String(payload?.usagePeriod || "none");

  if (!String(payload?.name ?? "").trim()) {
    details.push({ field: "name", message: "El nombre es requerido." });
  }

  if (!["informational", "discount", "allowance", "free_item"].includes(type)) {
    details.push({ field: "benefitType", message: "El tipo no es valido." });
  }

  if (type === "discount" && (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100)) {
    details.push({ field: "discountPercent", message: "Ingresa un descuento mayor que 0 y maximo 100." });
  }

  if (["allowance", "free_item"].includes(type)) {
    if (!Number.isFinite(includedQuantity) || includedQuantity <= 0) {
      details.push({ field: "includedQuantity", message: "Ingresa una cantidad incluida mayor que 0." });
    }
    if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
      details.push({ field: "usageLimit", message: "Ingresa un limite de uso mayor que 0." });
    }
    if (usagePeriod === "none") {
      details.push({ field: "usagePeriod", message: "Selecciona un periodo para controlar este beneficio." });
    }
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos del beneficio antes de continuar.", details);
  }
}

function validateMembershipActivation(payload) {
  const details = [];
  const planId = Number(payload?.planId);
  const rawAmount = payload?.amount === "" || payload?.amount == null ? payload?.pricePaid : payload.amount;
  const amount = rawAmount === "" || rawAmount == null ? null : Number(rawAmount);
  const paymentMethod = String(payload?.paymentMethod || "").trim();

  if (!Number.isInteger(planId) || planId <= 0) {
    details.push({ field: "planId", message: "Selecciona un plan activo." });
  }

  if (!isIsoDate(payload?.startDate)) {
    details.push({ field: "startDate", message: "Selecciona una fecha valida." });
  }

  if (!["cash", "card", "credit", "transfer", "other"].includes(paymentMethod)) {
    details.push({ field: "paymentMethod", message: "Selecciona metodo de pago." });
  }

  if (amount == null || !Number.isFinite(amount) || amount < 0) {
    details.push({ field: "amount", message: "El monto debe ser 0 o mayor." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa el pago de membresia antes de continuar.", details);
  }
}

function validateMembershipRenewal(payload) {
  const details = [];
  const amount = payload?.amount === "" || payload?.amount == null ? null : Number(payload.amount);
  const paymentMethod = String(payload?.paymentMethod || "").trim();

  if (!["cash", "card", "credit", "transfer", "other"].includes(paymentMethod)) {
    details.push({ field: "paymentMethod", message: "Selecciona metodo de pago." });
  }

  if (amount == null || !Number.isFinite(amount) || amount < 0) {
    details.push({ field: "amount", message: "El monto debe ser 0 o mayor." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa la renovacion de membresia antes de continuar.", details);
  }
}

function validateMembershipBenefitUsage(payload) {
  const details = [];
  const benefitId = Number(payload?.benefitId || payload?.membershipBenefitId);
  const customerMembershipId = payload?.customerMembershipId == null ? null : Number(payload.customerMembershipId);
  const quantity = payload?.quantity == null || payload.quantity === "" ? 1 : Number(payload.quantity);
  const note = String(payload?.note || "").trim();

  if (!Number.isInteger(benefitId) || benefitId <= 0) {
    details.push({ field: "benefitId", message: "Selecciona un beneficio." });
  }

  if (customerMembershipId != null && (!Number.isInteger(customerMembershipId) || customerMembershipId <= 0)) {
    details.push({ field: "customerMembershipId", message: "La membresia no es valida." });
  }

  if (!isIsoDate(payload?.usageDate)) {
    details.push({ field: "usageDate", message: "Selecciona una fecha valida." });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    details.push({ field: "quantity", message: "La cantidad debe ser mayor que 0." });
  }

  if (note.length > 500) {
    details.push({ field: "note", message: "La nota debe tener 500 caracteres o menos." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa el uso del beneficio antes de continuar.", details);
  }
}

function validateMembershipBenefitUsageFilters(filters) {
  const details = [];

  if (!isIsoDate(filters?.from)) {
    details.push({ field: "from", message: "Selecciona fecha desde." });
  }

  if (!isIsoDate(filters?.to)) {
    details.push({ field: "to", message: "Selecciona fecha hasta." });
  }

  if (isIsoDate(filters?.from) && isIsoDate(filters?.to)) {
    if (filters.from > filters.to) {
      details.push({ field: "from", message: "La fecha desde debe ser anterior o igual a hasta." });
    } else if (getDateRangeDays(filters.from, filters.to) > 31) {
      details.push({ field: "to", message: "Consulte 31 dias o menos." });
    }
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa el rango de usos antes de continuar.", details);
  }
}

function validateMembershipTransactionsFilters(filters) {
  const details = [];

  if (!isIsoDate(filters?.from)) {
    details.push({ field: "from", message: "Selecciona fecha desde." });
  }

  if (!isIsoDate(filters?.to)) {
    details.push({ field: "to", message: "Selecciona fecha hasta." });
  }

  if (isIsoDate(filters?.from) && isIsoDate(filters?.to)) {
    if (filters.from > filters.to) {
      details.push({ field: "from", message: "La fecha desde debe ser anterior o igual a hasta." });
    } else if (getDateRangeDays(filters.from, filters.to) > 31) {
      details.push({ field: "to", message: "Consulte 31 dias o menos." });
    }
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa el rango de transacciones antes de continuar.", details);
  }
}

function normalizeMembershipBenefitPayload(payload) {
  return {
    name: String(payload.name ?? "").trim(),
    description: normalizeNullableText(payload.description),
    benefitType: payload.benefitType || "informational",
    appliesToType: payload.appliesToType || "text",
    appliesToName: normalizeNullableText(payload.appliesToName),
    discountPercent: payload.discountPercent === "" || payload.discountPercent == null ? null : Number(payload.discountPercent),
    includedQuantity: payload.includedQuantity === "" || payload.includedQuantity == null ? null : Number(payload.includedQuantity),
    usageLimit: payload.usageLimit === "" || payload.usageLimit == null ? null : Number(payload.usageLimit),
    usagePeriod: payload.usagePeriod || "none",
    status: payload.status || "active",
  };
}

function findMockMembershipPlan(planId) {
  const plan = mockMembershipPlans.find((item) => String(item.id) === String(planId));

  if (!plan) {
    throw new ApiError("MEMBERSHIP_PLAN_NOT_FOUND", "Plan no encontrado.");
  }

  return plan;
}

function findMockMembershipBenefit(benefitId) {
  const benefit = mockMembershipBenefits.find((item) => String(item.id) === String(benefitId));

  if (!benefit) {
    throw new ApiError("MEMBERSHIP_BENEFIT_NOT_FOUND", "Beneficio no encontrado.");
  }

  return benefit;
}

function findMockCustomer(customerId) {
  const customer = mockCustomers.find((item) => String(item.id) === String(customerId));

  if (!customer) {
    throw new ApiError("CUSTOMER_NOT_FOUND", "Cliente no encontrado.");
  }

  return customer;
}

function refreshMockBenefitCounts() {
  mockMembershipPlans = mockMembershipPlans.map((plan) => ({
    ...plan,
    benefitCount: mockMembershipBenefits.filter((benefit) => String(benefit.planId) === String(plan.id)).length,
  }));
}

function cloneMembershipPlan(plan) {
  return { ...plan };
}

function cloneMembershipBenefit(benefit) {
  return { ...benefit };
}

function cloneCustomerMembership(membership) {
  return {
    ...membership,
    plan: membership.plan ? { ...membership.plan } : null,
    expirationAlert: membership.expirationAlert ? { ...membership.expirationAlert } : null,
  };
}

function cloneMembershipBenefitUsage(usage) {
  return { ...usage };
}

function cloneMembershipTransaction(transaction) {
  return { ...transaction };
}

function createMockMembershipTransaction(options) {
  const transaction = {
    id: String(nextMembershipTransactionId),
    companyId: mockCompanySettings.id,
    customerId: String(options.customer.id),
    customerMembershipId: String(options.membership.id),
    planId: String(options.plan.id),
    membershipPlanId: String(options.plan.id),
    planName: options.plan.name,
    transactionType: options.transactionType,
    paymentMethod: options.paymentMethod,
    amount: Number(options.amount),
    transactionDate: options.transactionDate,
    note: String(options.note || "").trim() || null,
    createdAt: new Date().toISOString(),
    createdByLabel: "mock@puntoclub.test",
  };
  nextMembershipTransactionId += 1;
  mockMembershipTransactions = [transaction, ...mockMembershipTransactions];
  recordMockAuditEvent({
    eventType: "membership.transaction.created",
    entityType: "membership_transaction",
    entityId: transaction.id,
    customerId: transaction.customerId,
    summary: `Transaccion de membresia registrada: ${options.plan.name}.`,
  });
  return transaction;
}

function calculateMembershipEndDate(startDate, durationDays) {
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(durationDays) - 1);
  return date.toISOString().slice(0, 10);
}

function calculateUsagePeriodStartDate(usageDate, usagePeriod, membershipStartDate) {
  if (usagePeriod === "membership_term") {
    return membershipStartDate;
  }

  const date = new Date(`${usageDate}T00:00:00Z`);
  if (usagePeriod === "week") {
    const day = date.getUTCDay();
    const offset = day === 0 ? -6 : 1 - day;
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  if (usagePeriod === "month") {
    return `${usageDate.slice(0, 8)}01`;
  }

  return usageDate;
}

function calculateExpirationAlert(endDate, warningDays = 5) {
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const endUtc = new Date(`${endDate}T00:00:00Z`).getTime();
  const daysUntilExpiration = Math.round((endUtc - todayUtc) / 86400000);
  let state = "none";
  let message = null;

  if (daysUntilExpiration < 0) {
    state = "expired";
    message = "La membresia esta vencida.";
  } else if (daysUntilExpiration === 0) {
    state = "expires_today";
    message = "La membresia vence hoy.";
  } else if (daysUntilExpiration <= Number(warningDays)) {
    state = "expiring_soon";
    message = `La membresia vence en ${daysUntilExpiration} dias.`;
  }

  return { state, daysUntilExpiration, message };
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
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
    details.push({ field: "email", message: "El correo no tiene un formato valido." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
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
      details.push({ field: "email", message: "El correo no tiene un formato valido." });
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
    throw new ApiError("VALIDATION_ERROR", "Revisa la configuracion de empresa antes de continuar.", details);
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
    throw new ApiError("VALIDATION_ERROR", "Selecciona un archivo de logo.");
  }

  if (!allowedTypes.has(file.type)) {
    throw new ApiError("UNSUPPORTED_MEDIA_TYPE", "El tipo de archivo no esta permitido. Usa PNG, JPG o WebP.");
  }

  if (file.size > 1048576) {
    throw new ApiError("UPLOAD_TOO_LARGE", "El archivo supera el tamano maximo permitido.");
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
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
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
    throw new ApiError("FORBIDDEN", "El token interno no es valido o vencio.");
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

function createMockCompanyRegistrationLogoBlob() {
  return new Blob([new Uint8Array(mockCompanyRegistrationLogoPng)], { type: "image/png" });
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
    throw new ApiError("UNAUTHORIZED", "Correo o contraseña incorrectos.");
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
      message: "La contraseña debe tener 10 a 128 caracteres e incluir letras y numeros.",
    });
  }

  ["companyId", "email", "externalSubject"].forEach((field) => {
    if (hasOwn(body, field)) {
      details.push({ field, message: "El campo no debe enviarse desde el frontend." });
    }
  });

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
  }
}

function validateCompanyAuthLoginPayload(payload) {
  const details = [];
  const email = String(payload?.email || "").trim();
  const password = String(payload?.password || "");

  if (!email || !isEmail(email)) {
    details.push({ field: "email", message: "Ingresa un correo valido." });
  }

  if (!password || password.length > 128) {
    details.push({ field: "password", message: "Ingresa la contraseña." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
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
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
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
    throw new ApiError("VALIDATION_ERROR", "Revisa los campos marcados antes de continuar.", details);
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

  if (isDateOnly(from) && isDateOnly(to) && getDateRangeDays(from, to) > 31) {
    details.push({ field: "to", message: "El rango maximo es de 31 dias." });
  }

  if (!["all", "purchase", "redemption", "membership", "benefit"].includes(type)) {
    details.push({ field: "type", message: "El tipo de reporte no es valido." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los filtros del reporte antes de continuar.", details);
  }
}

function validateMembershipFinancialReportFilters(filters) {
  const details = [];
  const from = String(filters.from ?? "").trim();
  const to = String(filters.to ?? "").trim();

  if (!isDateOnly(from)) {
    details.push({ field: "from", message: "La fecha desde es requerida." });
  }

  if (!isDateOnly(to)) {
    details.push({ field: "to", message: "La fecha hasta es requerida." });
  }

  if (from && to && from > to) {
    details.push({ field: "to", message: "La fecha hasta debe ser igual o posterior a desde." });
  }

  if (isDateOnly(from) && isDateOnly(to) && getDateRangeDays(from, to) > 31) {
    details.push({ field: "to", message: "El rango maximo es de 31 dias." });
  }

  if (details.length > 0) {
    throw new ApiError("VALIDATION_ERROR", "Revisa los filtros del reporte de membresias antes de continuar.", details);
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
    throw new ApiError("VALIDATION_ERROR", "Revisa los filtros de auditoria antes de continuar.", details);
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

function normalizeCustomerReportSearch(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function findCustomerReportCandidates(search) {
  const rawSearch = String(search ?? "").trim();
  const normalizedSearch = normalizeCustomerReportSearch(rawSearch);
  return mockCustomers
    .filter((customer) => {
      const phone = String(customer.phone ?? "").trim();
      const email = normalizeCustomerReportSearch(customer.email);
      const name = normalizeCustomerReportSearch(customer.name);
      return phone === rawSearch || email === normalizedSearch || name.includes(normalizedSearch);
    })
    .slice(0, 6);
}

function getMockCustomerReportMovements(customer, filters) {
  const type = filters.type || "all";
  const customerId = String(customer.id);
  const activityItems = (mockActivity.get(customerId) ?? [])
    .map((item) => normalizeReportItem(customer, item));
  const membershipItems = mockMembershipTransactions
    .filter((transaction) => String(transaction.customerId) === customerId)
    .map((transaction) => normalizeReportItem(customer, {
      type: "membership",
      id: transaction.id,
      date: transaction.transactionDate,
      createdAt: transaction.createdAt,
      amount: transaction.amount,
      points: 0,
      planName: transaction.planName,
      note: transaction.note,
    }));
  const benefitItems = mockMembershipBenefitUsages
    .filter((usage) => String(usage.customerId) === customerId)
    .map((usage) => normalizeReportItem(customer, {
      type: "benefit",
      id: usage.id,
      date: usage.usageDate,
      createdAt: usage.usedAt,
      points: 0,
      quantity: usage.quantity,
      planName: usage.planName,
      benefitName: usage.benefitName,
      note: usage.note,
    }));

  return [...activityItems, ...membershipItems, ...benefitItems]
    .filter((item) => item.date >= filters.from && item.date <= filters.to)
    .filter((item) => type === "all" || item.type === type)
    .sort((left, right) => {
      if (left.date === right.date) {
        return Number(right.id) - Number(left.id);
      }

      return right.date.localeCompare(left.date);
    });
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

      if (item.type === "membership") {
        summary.membershipCount += 1;
        summary.membershipAmountTotal += Number(item.amount ?? 0);
      }

      if (item.type === "benefit") {
        summary.benefitUsageCount += 1;
        summary.benefitQuantityTotal += Number(item.quantity ?? 0);
      }

      summary.movementCount += 1;
      summary.activeCustomerCount = activeCustomers.size;
      return summary;
    },
    {
      movementCount: 0,
      purchaseCount: 0,
      purchaseAmountTotal: 0,
      pointsEarnedTotal: 0,
      redemptionCount: 0,
      pointsRedeemedTotal: 0,
      membershipCount: 0,
      membershipAmountTotal: 0,
      benefitUsageCount: 0,
      benefitQuantityTotal: 0,
      activeCustomerCount: 0,
    },
  );
}

function buildMembershipFinancialReportSummary(items) {
  const newMemberships = items.filter((item) => item.transactionType === "new_membership");
  const renewals = items.filter((item) => item.transactionType === "renewal");
  const paymentMethods = items.reduce((summary, item) => {
    const current = summary[item.paymentMethod] || {
      paymentMethod: item.paymentMethod,
      count: 0,
      amount: 0,
    };
    current.count += 1;
    current.amount += Number(item.amount ?? 0);
    summary[item.paymentMethod] = current;
    return summary;
  }, {});

  return {
    newMembershipCount: newMemberships.length,
    newMembershipAmount: newMemberships.reduce((total, item) => total + Number(item.amount ?? 0), 0),
    renewalCount: renewals.length,
    renewalAmount: renewals.reduce((total, item) => total + Number(item.amount ?? 0), 0),
    paymentMethods,
  };
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
