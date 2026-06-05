import { config } from "./config.js";
import { ApiError, createCustomerApi } from "./customerApi.js";

const api = createCustomerApi(config);

const elements = {
  dataSourceStatus: document.querySelector("#data-source-status"),
  searchForm: document.querySelector("#customer-search-form"),
  searchInput: document.querySelector("#customer-search"),
  clearSearchButton: document.querySelector("#clear-search-button"),
  customersFeedback: document.querySelector("#customers-feedback"),
  customersList: document.querySelector("#customers-list"),
  form: document.querySelector("#new-customer-form"),
  nameInput: document.querySelector("#customer-name"),
  phoneInput: document.querySelector("#customer-phone"),
  emailInput: document.querySelector("#customer-email"),
  nameError: document.querySelector("#customer-name-error"),
  phoneError: document.querySelector("#customer-phone-error"),
  emailError: document.querySelector("#customer-email-error"),
  formError: document.querySelector("#form-error"),
  saveButton: document.querySelector("#save-customer-button"),
  resetFormButton: document.querySelector("#reset-form-button"),
  successMessage: document.querySelector("#success-message"),
  selectedCustomerCard: document.querySelector("#selected-customer-card"),
  purchaseForm: document.querySelector("#purchase-form"),
  purchaseInvoiceInput: document.querySelector("#purchase-invoice-number"),
  purchaseDateInput: document.querySelector("#purchase-date"),
  purchaseAmountInput: document.querySelector("#purchase-amount"),
  purchaseInvoiceError: document.querySelector("#purchase-invoice-number-error"),
  purchaseDateError: document.querySelector("#purchase-date-error"),
  purchaseAmountError: document.querySelector("#purchase-amount-error"),
  purchaseError: document.querySelector("#purchase-error"),
  savePurchaseButton: document.querySelector("#save-purchase-button"),
  resetPurchaseButton: document.querySelector("#reset-purchase-button"),
  purchaseSuccessMessage: document.querySelector("#purchase-success-message"),
  redemptionCustomerCard: document.querySelector("#redemption-customer-card"),
  redemptionForm: document.querySelector("#redemption-form"),
  redemptionDateInput: document.querySelector("#redemption-date"),
  redemptionPointsInput: document.querySelector("#redemption-points"),
  redemptionNoteInput: document.querySelector("#redemption-note"),
  redemptionDateError: document.querySelector("#redemption-date-error"),
  redemptionPointsError: document.querySelector("#redemption-points-error"),
  redemptionNoteError: document.querySelector("#redemption-note-error"),
  redemptionError: document.querySelector("#redemption-error"),
  saveRedemptionButton: document.querySelector("#save-redemption-button"),
  resetRedemptionButton: document.querySelector("#reset-redemption-button"),
  redemptionSuccessMessage: document.querySelector("#redemption-success-message"),
};

let currentCustomers = [];
let selectedCustomer = null;
const customerBalances = new Map();

elements.dataSourceStatus.textContent = api.sourceLabel;
elements.purchaseDateInput.value = getToday();
elements.redemptionDateInput.value = getToday();

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadCustomers(elements.searchInput.value);
});

elements.clearSearchButton.addEventListener("click", () => {
  elements.searchInput.value = "";
  currentCustomers = [];
  renderSearchPrompt();
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCustomer();
});

elements.resetFormButton.addEventListener("click", () => {
  clearForm();
});

elements.purchaseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitPurchase();
});

elements.resetPurchaseButton.addEventListener("click", () => {
  clearPurchaseForm({ keepSuccess: false });
});

elements.redemptionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitRedemption();
});

elements.resetRedemptionButton.addEventListener("click", () => {
  clearRedemptionForm({ keepSuccess: false });
});

renderSearchPrompt();
renderSelectedCustomer();

async function loadCustomers(search) {
  const trimmedSearch = search.trim();

  if (!trimmedSearch) {
    currentCustomers = [];
    renderSearchPrompt();
    return;
  }

  setCustomersFeedback("");
  renderLoading();

  try {
    const result = await api.searchCustomers(trimmedSearch);
    currentCustomers = await withBalances(result.items);
    renderCustomers(currentCustomers, trimmedSearch);
  } catch (error) {
    currentCustomers = [];
    renderCustomersError(error);
  }
}

async function submitCustomer() {
  clearFormMessages();
  setSubmitting(true);

  const payload = {
    name: elements.nameInput.value,
    phone: elements.phoneInput.value,
    email: elements.emailInput.value,
  };

  try {
    const customer = await api.createCustomer(payload);
    const [customerWithBalance] = await withBalances([customer]);
    currentCustomers = [customerWithBalance];
    elements.searchInput.value = customer.phone;
    renderCustomers(currentCustomers, customer.phone);
    selectCustomer(customerWithBalance, { focusPurchase: true });
    showSuccess(`Cliente registrado: ${customer.name}. Ahora puede registrar la compra.`);
    clearForm({ keepSuccess: true, focus: false });
  } catch (error) {
    if (error instanceof ApiError && error.code === "DUPLICATE_CUSTOMER") {
      await handleDuplicateCustomer(payload);
      return;
    }

    renderFormError(error);
  } finally {
    setSubmitting(false);
  }
}

async function handleDuplicateCustomer(payload) {
  showFormError("Ya existe un cliente con ese telefono o email. Abrimos su registro de compra.");

  const match = await findExistingCustomer(payload);

  if (!match) {
    showFormError(
      "Ya existe un cliente con ese telefono o email, pero no pudimos encontrarlo para registrar compra.",
    );
    return;
  }

  const [customerWithBalance] = await withBalances([match]);
  currentCustomers = [customerWithBalance];
  elements.searchInput.value = customerWithBalance.phone || customerWithBalance.email || "";
  renderCustomers(currentCustomers, elements.searchInput.value);
  selectCustomer(customerWithBalance, { focusPurchase: true });
}

async function findExistingCustomer(payload) {
  const searches = [payload.phone, payload.email].map((value) => value.trim()).filter(Boolean);

  for (const search of searches) {
    const result = await api.searchCustomers(search);
    const match = result.items.find((customer) => {
      const samePhone = payload.phone.trim() && normalize(customer.phone) === normalize(payload.phone);
      const sameEmail = payload.email.trim() && normalize(customer.email) === normalize(payload.email);
      return samePhone || sameEmail;
    });

    if (match) {
      return match;
    }
  }

  return null;
}

async function submitPurchase() {
  clearPurchaseMessages();

  if (!selectedCustomer) {
    showPurchaseError("Seleccione un cliente antes de registrar compra.");
    return;
  }

  setPurchaseSubmitting(true);

  const payload = {
    customerId: selectedCustomer.id,
    invoiceNumber: elements.purchaseInvoiceInput.value,
    purchaseDate: elements.purchaseDateInput.value,
    amount: elements.purchaseAmountInput.value,
  };

  try {
    const purchase = await api.createPurchase(payload);
    showPurchaseSuccess(
      `Compra registrada. Puntos ganados: ${formatPoints(purchase.pointsEarned)}.`,
    );
    clearPurchaseForm({ keepSuccess: true });
    await refreshCustomerBalance(selectedCustomer.id);
  } catch (error) {
    renderPurchaseError(error);
  } finally {
    setPurchaseSubmitting(false);
  }
}

async function submitRedemption() {
  clearRedemptionMessages();

  if (!selectedCustomer) {
    showRedemptionError("Seleccione un cliente antes de redimir puntos.");
    return;
  }

  setRedemptionSubmitting(true);

  const payload = {
    customerId: selectedCustomer.id,
    redemptionDate: elements.redemptionDateInput.value,
    pointsRedeemed: elements.redemptionPointsInput.value,
    note: elements.redemptionNoteInput.value,
  };

  try {
    const redemption = await api.createRedemption(payload);
    showRedemptionSuccess(
      `Canje registrado. Puntos redimidos: ${formatPoints(redemption.pointsRedeemed)}.`,
    );
    clearRedemptionForm({ keepSuccess: true });
    await refreshCustomerBalance(selectedCustomer.id);
  } catch (error) {
    renderRedemptionError(error);
  } finally {
    setRedemptionSubmitting(false);
  }
}

async function refreshCustomerBalance(customerId) {
  const balance = await safeGetBalance(customerId);
  customerBalances.set(String(customerId), balance);

  currentCustomers = currentCustomers.map((customer) =>
    String(customer.id) === String(customerId) ? { ...customer, balance } : customer,
  );

  if (selectedCustomer && String(selectedCustomer.id) === String(customerId)) {
    selectedCustomer = { ...selectedCustomer, balance };
    renderSelectedCustomer();
  }

  if (currentCustomers.length) {
    renderCustomers(currentCustomers, elements.searchInput.value.trim());
  }
}

async function withBalances(customers) {
  return Promise.all(
    customers.map(async (customer) => {
      const balance = await safeGetBalance(customer.id);
      customerBalances.set(String(customer.id), balance);
      return { ...customer, balance };
    }),
  );
}

async function safeGetBalance(customerId) {
  try {
    return await api.getCustomerBalance(customerId);
  } catch (error) {
    return {
      customerId: String(customerId),
      pointsEarned: null,
      pointsRedeemed: null,
      pointsBalance: null,
    };
  }
}

function renderSearchPrompt() {
  setCustomersFeedback("");
  elements.customersList.innerHTML =
    '<div class="empty-state">Busque por telefono, nombre o email para atender al cliente.</div>';
}

function renderLoading() {
  elements.customersList.innerHTML = '<div class="loading-state">Buscando clientes...</div>';
}

function renderCustomers(customers, search) {
  if (customers.length === 0) {
    const text = search
      ? "No encontramos clientes con esa busqueda. Puede registrarlo en el formulario."
      : "Busque por telefono, nombre o email para atender al cliente.";
    elements.customersList.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
    return;
  }

  elements.customersList.innerHTML = customers
    .map(
      (customer) => `
        <article class="customer-row">
          <div>
            <h3>${escapeHtml(customer.name)}</h3>
            <p class="customer-meta">
              <span>${escapeHtml(customer.phone)}</span>
              <span>${escapeHtml(customer.email || "Sin email")}</span>
            </p>
          </div>
          <div class="points-badge">
            <span>Puntos</span>
            <strong>${formatBalance(customer.balance)}</strong>
          </div>
          <div class="row-actions">
            <button type="button" data-action="purchase" data-customer-id="${escapeHtml(customer.id)}">
              Registrar compra
            </button>
            <button class="secondary-button" type="button" data-action="redemption" data-customer-id="${escapeHtml(customer.id)}">
              Redimir puntos
            </button>
          </div>
        </article>
      `,
    )
    .join("");

  elements.customersList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const customer = currentCustomers.find(
        (item) => String(item.id) === String(button.dataset.customerId),
      );

      if (customer) {
        const action = button.dataset.action;
        selectCustomer(customer, {
          focusPurchase: action === "purchase",
          focusRedemption: action === "redemption",
        });
      }
    });
  });
}

function selectCustomer(customer, options = {}) {
  selectedCustomer = {
    ...customer,
    balance: customer.balance ?? customerBalances.get(String(customer.id)),
  };
  renderSelectedCustomer();
  clearPurchaseForm({ keepSuccess: false });
  clearRedemptionForm({ keepSuccess: false });
  elements.purchaseForm.hidden = false;
  elements.redemptionForm.hidden = false;
  elements.purchaseDateInput.value = getToday();
  elements.redemptionDateInput.value = getToday();

  if (options.focusPurchase) {
    elements.purchaseInvoiceInput.focus();
    elements.purchaseForm.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  if (options.focusRedemption) {
    elements.redemptionPointsInput.focus();
    elements.redemptionForm.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function renderSelectedCustomer() {
  if (!selectedCustomer) {
    elements.purchaseForm.hidden = true;
    elements.redemptionForm.hidden = true;
    elements.selectedCustomerCard.textContent = "Seleccione un cliente para registrar compra.";
    elements.redemptionCustomerCard.textContent = "Seleccione un cliente para redimir puntos.";
    return;
  }

  const customerCard = `
    <div>
      <h3>${escapeHtml(selectedCustomer.name)}</h3>
      <p>${escapeHtml(selectedCustomer.phone)} - ${escapeHtml(selectedCustomer.email || "Sin email")}</p>
    </div>
    <div class="points-badge strong">
      <span>Puntos actuales</span>
      <strong>${formatBalance(selectedCustomer.balance)}</strong>
    </div>
  `;

  elements.selectedCustomerCard.innerHTML = customerCard;
  elements.redemptionCustomerCard.innerHTML = customerCard;
}

function renderCustomersError(error) {
  const message =
    error instanceof ApiError && error.code === "INTERNAL_ERROR"
      ? "No se pudo consultar clientes. Intente de nuevo."
      : error instanceof ApiError
        ? error.message
        : "No se pudo buscar clientes.";
  elements.customersList.innerHTML = "";
  setCustomersFeedback(message);
}

function renderFormError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        name: elements.nameError,
        phone: elements.phoneError,
        email: elements.emailError,
      }[detail.field];

      if (target) {
        target.textContent = getCustomerValidationMessage(detail);
      }
    });
    showFormError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && error.code === "INTERNAL_ERROR") {
    showFormError("No se pudo registrar el cliente. Intente de nuevo.");
    return;
  }

  showFormError("No se pudo registrar el cliente. Intente de nuevo.");
}

function renderPurchaseError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        invoiceNumber: elements.purchaseInvoiceError,
        purchaseDate: elements.purchaseDateError,
        amount: elements.purchaseAmountError,
      }[detail.field];

      if (target) {
        target.textContent = getPurchaseValidationMessage(detail);
      }
    });
    showPurchaseError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && error.code === "DUPLICATE_INVOICE") {
    showPurchaseError("Ya existe una compra con esa factura o comprobante.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND") {
    showPurchaseError("El cliente seleccionado ya no esta disponible.");
    return;
  }

  showPurchaseError("No se pudo registrar la compra. Intente de nuevo.");
}

function renderRedemptionError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        redemptionDate: elements.redemptionDateError,
        pointsRedeemed: elements.redemptionPointsError,
        note: elements.redemptionNoteError,
      }[detail.field];

      if (target) {
        target.textContent = getRedemptionValidationMessage(detail);
      }
    });
    showRedemptionError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && error.code === "INSUFFICIENT_POINTS") {
    showRedemptionError("El cliente no tiene puntos suficientes para este canje.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND") {
    showRedemptionError("El cliente seleccionado ya no esta disponible.");
    return;
  }

  showRedemptionError("No se pudo redimir puntos. Intente de nuevo.");
}

function getCustomerValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    phone: "El telefono es requerido y debe tener 32 caracteres o menos.",
    email: "El email debe tener un formato valido y 254 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getPurchaseValidationMessage(detail) {
  const messagesByField = {
    invoiceNumber: "La factura o comprobante es requerido y debe tener 80 caracteres o menos.",
    purchaseDate: "La fecha de compra es requerida.",
    amount: "El monto debe ser mayor que 0.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getRedemptionValidationMessage(detail) {
  const messagesByField = {
    redemptionDate: "La fecha de canje es requerida.",
    pointsRedeemed: "Los puntos a redimir deben ser un entero mayor que 0.",
    note: "La nota debe tener 500 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function setCustomersFeedback(message) {
  elements.customersFeedback.hidden = !message;
  elements.customersFeedback.textContent = message;
}

function showFormError(message) {
  elements.formError.hidden = false;
  elements.formError.textContent = message;
}

function showSuccess(message) {
  elements.successMessage.hidden = false;
  elements.successMessage.textContent = message;
}

function showPurchaseError(message) {
  elements.purchaseError.hidden = false;
  elements.purchaseError.textContent = message;
}

function showPurchaseSuccess(message) {
  elements.purchaseSuccessMessage.hidden = false;
  elements.purchaseSuccessMessage.textContent = message;
}

function showRedemptionError(message) {
  elements.redemptionError.hidden = false;
  elements.redemptionError.textContent = message;
}

function showRedemptionSuccess(message) {
  elements.redemptionSuccessMessage.hidden = false;
  elements.redemptionSuccessMessage.textContent = message;
}

function clearForm(options = {}) {
  elements.form.reset();
  clearFormMessages(options);

  if (options.focus !== false) {
    elements.nameInput.focus();
  }
}

function clearFormMessages(options = {}) {
  elements.nameError.textContent = "";
  elements.phoneError.textContent = "";
  elements.emailError.textContent = "";
  elements.formError.hidden = true;
  elements.formError.textContent = "";

  if (!options.keepSuccess) {
    elements.successMessage.hidden = true;
    elements.successMessage.textContent = "";
  }
}

function clearPurchaseForm(options = {}) {
  elements.purchaseForm.reset();
  elements.purchaseDateInput.value = getToday();
  clearPurchaseMessages(options);
}

function clearPurchaseMessages(options = {}) {
  elements.purchaseInvoiceError.textContent = "";
  elements.purchaseDateError.textContent = "";
  elements.purchaseAmountError.textContent = "";
  elements.purchaseError.hidden = true;
  elements.purchaseError.textContent = "";

  if (!options.keepSuccess) {
    elements.purchaseSuccessMessage.hidden = true;
    elements.purchaseSuccessMessage.textContent = "";
  }
}

function clearRedemptionForm(options = {}) {
  elements.redemptionForm.reset();
  elements.redemptionDateInput.value = getToday();
  clearRedemptionMessages(options);
}

function clearRedemptionMessages(options = {}) {
  elements.redemptionDateError.textContent = "";
  elements.redemptionPointsError.textContent = "";
  elements.redemptionNoteError.textContent = "";
  elements.redemptionError.hidden = true;
  elements.redemptionError.textContent = "";

  if (!options.keepSuccess) {
    elements.redemptionSuccessMessage.hidden = true;
    elements.redemptionSuccessMessage.textContent = "";
  }
}

function setSubmitting(isSubmitting) {
  elements.saveButton.disabled = isSubmitting;
  elements.saveButton.textContent = isSubmitting ? "Registrando..." : "Registrar cliente";
}

function setPurchaseSubmitting(isSubmitting) {
  elements.savePurchaseButton.disabled = isSubmitting;
  elements.savePurchaseButton.textContent = isSubmitting ? "Registrando..." : "Registrar compra";
}

function setRedemptionSubmitting(isSubmitting) {
  elements.saveRedemptionButton.disabled = isSubmitting;
  elements.saveRedemptionButton.textContent = isSubmitting ? "Redimiendo..." : "Redimir puntos";
}

function formatBalance(balance) {
  if (!balance || balance.pointsBalance == null) {
    return "No disponible";
  }

  return formatPoints(balance.pointsBalance);
}

function formatPoints(value) {
  return new Intl.NumberFormat("es-CR", { maximumFractionDigits: 0 }).format(Number(value));
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
