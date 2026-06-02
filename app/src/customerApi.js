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
let nextCustomerId = 12;

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
      return customer;
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
