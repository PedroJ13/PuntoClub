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
let nextCustomerId = 12;
let nextPurchaseId = 50;
let nextRedemptionId = 70;
let nextAuditEventId = 1;

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

  return {
    sourceLabel: "API real",
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
      if (filters.from) {
        url.searchParams.set("from", filters.from);
      }
      if (filters.to) {
        url.searchParams.set("to", filters.to);
      }
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
      const pointsEarned = Math.round(amount * 0.05);
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

  if (from && !isDateOnly(from)) {
    details.push({ field: "from", message: "La fecha desde no es valida." });
  }

  if (to && !isDateOnly(to)) {
    details.push({ field: "to", message: "La fecha hasta no es valida." });
  }

  if (from && to && from > to) {
    details.push({ field: "to", message: "La fecha hasta debe ser igual o posterior a desde." });
  }

  if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
    details.push({ field: "limit", message: "El limite debe estar entre 1 y 50." });
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

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
