import { config } from "./config.js";
import { ApiError, createCustomerApi } from "./customerApi.js";

const api = createCustomerApi(config);

const elements = {
  dataSourceStatus: document.querySelector("#data-source-status"),
  navButtons: [...document.querySelectorAll("[data-section-target]")],
  sectionPanels: [...document.querySelectorAll("[data-section]")],
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
  operationTitle: document.querySelector("#operation-title"),
  operationStatus: document.querySelector("#operation-status"),
  operationEmpty: document.querySelector("#operation-empty"),
  selectedCustomerCard: document.querySelector("#selected-customer-card"),
  historyPanel: document.querySelector("#history-panel"),
  historySummary: document.querySelector("#history-summary"),
  historyList: document.querySelector("#history-list"),
  historyError: document.querySelector("#history-error"),
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
  reportForm: document.querySelector("#report-form"),
  reportFromInput: document.querySelector("#report-from"),
  reportToInput: document.querySelector("#report-to"),
  reportTypeInput: document.querySelector("#report-type"),
  reportError: document.querySelector("#report-error"),
  reportStatus: document.querySelector("#report-status"),
  reportSummary: document.querySelector("#report-summary"),
  reportEmpty: document.querySelector("#report-empty"),
  reportTableWrap: document.querySelector("#report-table-wrap"),
  reportTableBody: document.querySelector("#report-table-body"),
  loadReportButton: document.querySelector("#load-report-button"),
  exportReportButton: document.querySelector("#export-report-button"),
  auditForm: document.querySelector("#audit-form"),
  auditFromInput: document.querySelector("#audit-from"),
  auditToInput: document.querySelector("#audit-to"),
  auditLimitInput: document.querySelector("#audit-limit"),
  auditError: document.querySelector("#audit-error"),
  auditStatus: document.querySelector("#audit-status"),
  auditEmpty: document.querySelector("#audit-empty"),
  auditTableWrap: document.querySelector("#audit-table-wrap"),
  auditTableBody: document.querySelector("#audit-table-body"),
  loadAuditButton: document.querySelector("#load-audit-button"),
  companyForm: document.querySelector("#company-form"),
  companyNameInput: document.querySelector("#company-name"),
  companyEmailInput: document.querySelector("#company-email"),
  companyPhoneInput: document.querySelector("#company-phone"),
  companyLogoUrlInput: document.querySelector("#company-logo-url"),
  companyPointsPercentageInput: document.querySelector("#company-points-percentage"),
  companyNameError: document.querySelector("#company-name-error"),
  companyEmailError: document.querySelector("#company-email-error"),
  companyPhoneError: document.querySelector("#company-phone-error"),
  companyLogoUrlError: document.querySelector("#company-logo-url-error"),
  companyPointsPercentageError: document.querySelector("#company-points-percentage-error"),
  companyStatus: document.querySelector("#company-status"),
  companyError: document.querySelector("#company-error"),
  companyEmpty: document.querySelector("#company-empty"),
  companyCurrentStatus: document.querySelector("#company-current-status"),
  companyCurrentUpdated: document.querySelector("#company-current-updated"),
  companyCurrentLogo: document.querySelector("#company-current-logo"),
  reloadCompanyButton: document.querySelector("#reload-company-button"),
  saveCompanyButton: document.querySelector("#save-company-button"),
  companyRegistrationForm: document.querySelector("#company-registration-form"),
  registrationCompanyNameInput: document.querySelector("#registration-company-name"),
  registrationCompanyEmailInput: document.querySelector("#registration-company-email"),
  registrationCompanyAddressInput: document.querySelector("#registration-company-address"),
  registrationCompanyPhoneInput: document.querySelector("#registration-company-phone"),
  registrationContactNameInput: document.querySelector("#registration-contact-name"),
  registrationContactEmailInput: document.querySelector("#registration-contact-email"),
  registrationContactPhoneInput: document.querySelector("#registration-contact-phone"),
  registrationCompanyNameError: document.querySelector("#registration-company-name-error"),
  registrationCompanyEmailError: document.querySelector("#registration-company-email-error"),
  registrationCompanyAddressError: document.querySelector("#registration-company-address-error"),
  registrationCompanyPhoneError: document.querySelector("#registration-company-phone-error"),
  registrationContactNameError: document.querySelector("#registration-contact-name-error"),
  registrationContactEmailError: document.querySelector("#registration-contact-email-error"),
  registrationContactPhoneError: document.querySelector("#registration-contact-phone-error"),
  registrationStatus: document.querySelector("#registration-status"),
  registrationError: document.querySelector("#registration-error"),
  registrationResult: document.querySelector("#registration-result"),
  resetRegistrationButton: document.querySelector("#reset-registration-button"),
  submitRegistrationButton: document.querySelector("#submit-registration-button"),
};

let currentCustomers = [];
let selectedCustomer = null;
let currentReport = null;
let currentCompanySettings = null;
let activeSection = "operations";
const customerBalances = new Map();

elements.dataSourceStatus.textContent = api.sourceLabel;
elements.purchaseDateInput.value = getToday();
elements.redemptionDateInput.value = getToday();
elements.reportFromInput.value = getToday();
elements.reportToInput.value = getToday();
elements.auditFromInput.value = getToday();
elements.auditToInput.value = getToday();

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadCustomers(elements.searchInput.value);
});

elements.clearSearchButton.addEventListener("click", () => {
  elements.searchInput.value = "";
  currentCustomers = [];
  clearFormMessages();
  renderSearchPrompt();
  resetOperation();
  elements.searchInput.focus();
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
  clearPurchaseForm({ keepStatus: true });
});

elements.redemptionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitRedemption();
});

elements.resetRedemptionButton.addEventListener("click", () => {
  clearRedemptionForm({ keepStatus: true });
});

elements.reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadActivityReport();
});

elements.exportReportButton.addEventListener("click", () => {
  exportReportCsv();
});

elements.auditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadAuditEvents();
});

elements.companyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanySettings();
});

elements.companyRegistrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanyRegistrationRequest();
});

elements.resetRegistrationButton.addEventListener("click", () => {
  clearCompanyRegistrationForm();
});

elements.reloadCompanyButton.addEventListener("click", async () => {
  await loadCompanySettings();
});

elements.navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.sectionTarget);
  });
});

setActiveSection(activeSection, { focus: false });
renderSearchPrompt();
resetOperation();
renderReportPrompt();
renderAuditPrompt();
loadCompanySettings();
elements.searchInput.focus();

function setActiveSection(section, options = {}) {
  const nextSection = ["operations", "company", "reports"].includes(section)
    ? section
    : "operations";
  activeSection = nextSection;

  elements.sectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== nextSection;
  });

  elements.navButtons.forEach((button) => {
    const isActive = button.dataset.sectionTarget === nextSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (options.focus === false) {
    return;
  }

  const focusTarget = {
    operations: elements.searchInput,
    company: elements.registrationCompanyNameInput,
    reports: elements.reportFromInput,
  }[nextSection];

  window.requestAnimationFrame(() => {
    focusTarget?.focus();
  });
}

async function loadCustomers(search) {
  const trimmedSearch = search.trim();

  clearCustomerMessages();
  clearFormMessages();

  if (!trimmedSearch) {
    currentCustomers = [];
    renderSearchPrompt();
    elements.searchInput.focus();
    return;
  }

  renderLoading();

  try {
    const result = await api.searchCustomers(trimmedSearch);
    currentCustomers = await withBalances(result.items);
    renderCustomers(currentCustomers, trimmedSearch);

    if (currentCustomers.length === 0) {
      setCustomersFeedback("No encontramos ese cliente. Complete el registro para crearlo.");
      elements.nameInput.focus();
    }
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
    setCustomersFeedback("");
    renderCustomers(currentCustomers, customer.phone);
    selectCustomer(customerWithBalance);
    showSuccess(`Cliente registrado: ${customer.name}.`);
    clearForm({ keepSuccess: true, focus: false });
    elements.searchInput.focus();
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
  showFormError("Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.");

  const match = await findExistingCustomer(payload);

  if (!match) {
    showFormError(
      "Ya existe un cliente con ese telefono o email, pero no pudimos encontrarlo automaticamente.",
    );
    return;
  }

  const [customerWithBalance] = await withBalances([match]);
  currentCustomers = [customerWithBalance];
  elements.searchInput.value = customerWithBalance.phone || customerWithBalance.email || "";
  setCustomersFeedback("");
  renderCustomers(currentCustomers, elements.searchInput.value);
  selectCustomer(customerWithBalance);
  elements.searchInput.focus();
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
    await refreshCustomerBalance(selectedCustomer.id);
    clearPurchaseForm({ keepStatus: true });
    await openOperation(
      "history",
      `Compra registrada. Pts. ganados: ${formatPoints(purchase.pointsEarned)}.`,
    );
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
    await refreshCustomerBalance(selectedCustomer.id);
    clearRedemptionForm({ keepStatus: true });
    await openOperation(
      "history",
      `Canje registrado. Pts. redimidos: ${formatPoints(redemption.pointsRedeemed)}.`,
    );
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
    '<div class="empty-state">Busque un cliente para operar o registre uno nuevo.</div>';
}

function renderLoading() {
  elements.customersList.innerHTML = '<div class="loading-state">Buscando clientes...</div>';
}

function renderCustomers(customers, search) {
  if (customers.length === 0) {
    const text = search
      ? "Sin resultados. Complete el registro para crear este cliente."
      : "Busque un cliente para operar o registre uno nuevo.";
    elements.customersList.innerHTML = `<div class="empty-state">${escapeHtml(text)}</div>`;
    return;
  }

  elements.customersList.innerHTML = customers
    .map((customer) => renderCustomer(customer))
    .join("");

  elements.customersList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const customer = currentCustomers.find(
        (item) => String(item.id) === String(button.dataset.customerId),
      );

      if (customer) {
        selectCustomer(customer);
        openOperation(button.dataset.action);
      }
    });
  });
}

function renderCustomer(customer) {
  const points = getBalanceValue(customer.balance);
  const canRedeem = points > 0;

  return `
    <article class="customer-row ${selectedCustomer && String(selectedCustomer.id) === String(customer.id) ? "is-selected" : ""}">
      <div class="customer-main">
        <h3>${escapeHtml(customer.name)}</h3>
        <p class="customer-meta">
          <span>${escapeHtml(customer.phone)}</span>
          <span>${escapeHtml(customer.email || "Sin email")}</span>
        </p>
      </div>
      <div class="points-badge">
        <span>Pts.</span>
        <strong>${formatBalance(customer.balance)}</strong>
      </div>
      <div class="row-actions">
        <button type="button" data-action="purchase" data-customer-id="${escapeHtml(customer.id)}">
          Compra
        </button>
        <button class="secondary-button" type="button" data-action="history" data-customer-id="${escapeHtml(customer.id)}">
          Historial
        </button>
        ${
          canRedeem
            ? `<button class="secondary-button" type="button" data-action="redemption" data-customer-id="${escapeHtml(customer.id)}">Redimir</button>`
            : ""
        }
      </div>
    </article>
  `;
}

function selectCustomer(customer) {
  selectedCustomer = {
    ...customer,
    balance: customer.balance ?? customerBalances.get(String(customer.id)),
  };
  renderSelectedCustomer();

  if (currentCustomers.length) {
    renderCustomers(currentCustomers, elements.searchInput.value.trim());
  }
}

async function openOperation(type, statusMessage = "") {
  if (!selectedCustomer) {
    return;
  }

  clearFormMessages();
  clearOperationMessages();
  elements.operationEmpty.hidden = true;
  elements.selectedCustomerCard.hidden = false;
  elements.operationTitle.textContent = getOperationTitle(type);
  elements.purchaseForm.hidden = type !== "purchase";
  elements.redemptionForm.hidden = type !== "redemption";
  elements.historyPanel.hidden = type !== "history";
  elements.purchaseDateInput.value = getToday();
  elements.redemptionDateInput.value = getToday();

  if (statusMessage) {
    showOperationStatus(statusMessage);
  }

  if (type === "purchase") {
    clearPurchaseForm({ keepStatus: true });
    elements.purchaseInvoiceInput.focus();
    return;
  }

  if (type === "history") {
    await loadCustomerActivity();
    return;
  }

  clearRedemptionForm({ keepStatus: true });
  elements.redemptionPointsInput.focus();
}

function resetOperation(message = "") {
  clearOperationMessages();
  elements.operationTitle.textContent = "Operacion";
  elements.operationEmpty.hidden = false;
  elements.operationEmpty.textContent = message || "Seleccione una accion de un cliente para registrar compra o redimir puntos.";
  elements.selectedCustomerCard.hidden = true;
  elements.purchaseForm.hidden = true;
  elements.redemptionForm.hidden = true;
  elements.historyPanel.hidden = true;

  if (message) {
    showOperationStatus(message);
  }
}

async function loadCustomerActivity() {
  if (!selectedCustomer) {
    return;
  }

  const customerId = selectedCustomer.id;
  clearHistoryMessages();
  renderHistoryLoading();

  try {
    const activity = await api.getCustomerActivity(customerId);

    if (!selectedCustomer || String(selectedCustomer.id) !== String(customerId)) {
      return;
    }

    updateCustomerBalance(customerId, activity.balance);
    renderHistory(activity);
  } catch (error) {
    renderHistoryError(error);
  }
}

async function loadActivityReport() {
  const filters = {
    from: elements.reportFromInput.value,
    to: elements.reportToInput.value,
    type: elements.reportTypeInput.value,
  };

  clearReportMessages();

  if (!filters.from || !filters.to) {
    showReportError("Seleccione fecha desde y fecha hasta.");
    return;
  }

  if (filters.from > filters.to) {
    showReportError("La fecha hasta debe ser igual o posterior a fecha desde.");
    return;
  }

  setReportSubmitting(true);
  renderReportLoading();

  try {
    const report = await api.getActivityReport(filters);
    currentReport = report;
    renderReport(report);
  } catch (error) {
    currentReport = null;
    renderReportError(error);
  } finally {
    setReportSubmitting(false);
  }
}

async function loadAuditEvents() {
  const filters = {
    from: elements.auditFromInput.value,
    to: elements.auditToInput.value,
    limit: elements.auditLimitInput.value,
  };

  clearAuditMessages();

  if (!filters.from || !filters.to) {
    showAuditError("Seleccione fecha desde y fecha hasta.");
    return;
  }

  if (filters.from && filters.to && filters.from > filters.to) {
    showAuditError("La fecha hasta debe ser igual o posterior a fecha desde.");
    return;
  }

  setAuditSubmitting(true);
  renderAuditLoading();

  try {
    const result = await api.getAuditEvents(filters);
    renderAuditEvents(result);
  } catch (error) {
    renderAuditError(error);
  } finally {
    setAuditSubmitting(false);
  }
}

async function loadCompanySettings() {
  clearCompanyMessages();
  renderCompanyLoading();
  setCompanyLoading(true);

  try {
    const settings = await api.getCompanySettings();
    currentCompanySettings = settings;
    renderCompanySettings(settings);
  } catch (error) {
    currentCompanySettings = null;
    renderCompanySettingsError(error);
  } finally {
    setCompanyLoading(false);
  }
}

async function submitCompanySettings() {
  clearCompanyMessages();
  setCompanySubmitting(true);

  const payload = {
    name: elements.companyNameInput.value,
    email: elements.companyEmailInput.value.trim() || null,
    phone: elements.companyPhoneInput.value.trim() || null,
    logoUrl: elements.companyLogoUrlInput.value.trim() || null,
    pointsPercentage: elements.companyPointsPercentageInput.value,
  };

  try {
    const settings = await api.updateCompanySettings(payload);
    currentCompanySettings = settings;
    renderCompanySettings(settings);
    showCompanyStatus("Configuracion guardada.");
  } catch (error) {
    renderCompanySettingsError(error);
  } finally {
    setCompanySubmitting(false);
  }
}

async function submitCompanyRegistrationRequest() {
  clearCompanyRegistrationMessages();
  setCompanyRegistrationSubmitting(true);

  const payload = {
    companyName: elements.registrationCompanyNameInput.value,
    companyEmail: elements.registrationCompanyEmailInput.value,
    companyAddress: elements.registrationCompanyAddressInput.value,
    companyPhone: elements.registrationCompanyPhoneInput.value.trim() || null,
    contactName: elements.registrationContactNameInput.value.trim() || null,
    contactEmail: elements.registrationContactEmailInput.value,
    contactPhone: elements.registrationContactPhoneInput.value.trim() || null,
  };

  try {
    const result = await api.createCompanyRegistrationRequest(payload);
    renderCompanyRegistrationSuccess(result);
  } catch (error) {
    renderCompanyRegistrationError(error);
  } finally {
    setCompanyRegistrationSubmitting(false);
  }
}

function renderSelectedCustomer() {
  if (!selectedCustomer) {
    elements.selectedCustomerCard.hidden = true;
    return;
  }

  elements.selectedCustomerCard.innerHTML = `
    <div>
      <h3>${escapeHtml(selectedCustomer.name)}</h3>
      <p>${escapeHtml(selectedCustomer.phone)} - ${escapeHtml(selectedCustomer.email || "Sin email")}</p>
    </div>
    <div class="points-badge strong">
      <span>Pts. actuales</span>
      <strong>${formatBalance(selectedCustomer.balance)}</strong>
    </div>
  `;
}

function renderHistoryLoading() {
  elements.historySummary.innerHTML = "";
  elements.historyList.innerHTML = '<div class="loading-state">Cargando historial...</div>';
}

function renderHistory(activity) {
  const items = Array.isArray(activity.items) ? activity.items : [];
  const balance = activity.balance ?? selectedCustomer?.balance;

  elements.historySummary.innerHTML = `
    <div>
      <span>Ganados</span>
      <strong>${formatBalancePart(balance, "pointsEarned")}</strong>
    </div>
    <div>
      <span>Redimidos</span>
      <strong>${formatBalancePart(balance, "pointsRedeemed")}</strong>
    </div>
    <div>
      <span>Actuales</span>
      <strong>${formatBalance(balance)}</strong>
    </div>
  `;

  if (items.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-state">Sin movimientos para este cliente.</div>';
    return;
  }

  elements.historyList.innerHTML = items.map((item) => renderHistoryItem(item)).join("");
}

function renderHistoryItem(item) {
  const type = String(item.type ?? "").toLowerCase();
  const isPurchase = type === "purchase";
  const points = Number(item.points ?? 0);
  const pointsClass = points >= 0 ? "is-positive" : "is-negative";
  const title = isPurchase ? "Compra" : "Canje";
  const detail = isPurchase
    ? `Factura ${item.invoiceNumber ? escapeHtml(item.invoiceNumber) : "sin comprobante"} - ${formatMoney(item.amount)}`
    : escapeHtml(item.note || "Sin nota");

  return `
    <article class="history-row">
      <div>
        <h3>${title}</h3>
        <p>${formatDate(item.date)} - ${detail}</p>
      </div>
      <strong class="history-points ${pointsClass}">${formatSignedPoints(points)}</strong>
    </article>
  `;
}

function renderHistoryError(error) {
  const message =
    error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND"
      ? "El cliente seleccionado ya no esta disponible."
      : "No se pudo cargar el historial. Intente de nuevo.";
  elements.historySummary.innerHTML = "";
  elements.historyList.innerHTML = "";
  elements.historyError.hidden = false;
  elements.historyError.textContent = message;
}

function renderReportPrompt() {
  currentReport = null;
  elements.reportSummary.hidden = true;
  elements.reportSummary.innerHTML = "";
  elements.reportTableWrap.hidden = true;
  elements.reportTableBody.innerHTML = "";
  elements.reportEmpty.hidden = false;
  elements.reportEmpty.textContent = "Consulte un rango de fechas para ver la actividad.";
  elements.exportReportButton.disabled = true;
}

function renderReportLoading() {
  elements.reportSummary.hidden = true;
  elements.reportTableWrap.hidden = true;
  elements.reportEmpty.hidden = false;
  elements.reportEmpty.textContent = "Cargando reporte...";
  elements.exportReportButton.disabled = true;
}

function renderReport(report) {
  const items = Array.isArray(report.items) ? report.items : [];
  const summary = report.summary ?? {};

  elements.reportSummary.hidden = false;
  elements.reportSummary.innerHTML = `
    <div>
      <span>Compras</span>
      <strong>${formatReportNumber(summary.purchaseCount)}</strong>
    </div>
    <div>
      <span>Monto total</span>
      <strong>${formatMoney(summary.purchaseAmountTotal)}</strong>
    </div>
    <div>
      <span>Pts. ganados</span>
      <strong>${formatReportNumber(summary.pointsEarnedTotal)}</strong>
    </div>
    <div>
      <span>Redenciones</span>
      <strong>${formatReportNumber(summary.redemptionCount)}</strong>
    </div>
    <div>
      <span>Pts. redimidos</span>
      <strong>${formatReportNumber(summary.pointsRedeemedTotal)}</strong>
    </div>
    <div>
      <span>Clientes activos</span>
      <strong>${formatReportNumber(summary.activeCustomerCount)}</strong>
    </div>
  `;

  if (items.length === 0) {
    elements.reportEmpty.hidden = false;
    elements.reportEmpty.textContent = "Sin movimientos para el rango seleccionado.";
    elements.reportTableWrap.hidden = true;
    elements.reportTableBody.innerHTML = "";
    elements.exportReportButton.disabled = true;
    return;
  }

  elements.reportEmpty.hidden = true;
  elements.reportTableWrap.hidden = false;
  elements.reportTableBody.innerHTML = items.map((item) => renderReportRow(item)).join("");
  elements.exportReportButton.disabled = false;
  showReportStatus(`Reporte cargado: ${formatReportNumber(items.length)} movimientos.`);
}

function renderReportRow(item) {
  return `
    <tr>
      <td>${formatDate(item.date)}</td>
      <td>${getReportTypeLabel(item.type)}</td>
      <td>
        <strong>${escapeHtml(item.customerName || "Cliente sin nombre")}</strong>
        <span>${escapeHtml(item.customerPhone || item.customerEmail || "Sin contacto")}</span>
      </td>
      <td>${renderReportDetail(item)}</td>
      <td class="${Number(item.points ?? 0) >= 0 ? "points-positive" : "points-negative"}">
        ${formatSignedPoints(item.points ?? 0)}
      </td>
    </tr>
  `;
}

function renderReportDetail(item) {
  if (item.type === "purchase") {
    const invoice = item.invoiceNumber ? `Factura ${item.invoiceNumber}` : "Compra sin comprobante";
    return `${escapeHtml(invoice)}<span>${formatMoney(item.amount)}</span>`;
  }

  return escapeHtml(item.note || "Sin nota");
}

function renderReportError(error) {
  elements.reportSummary.hidden = true;
  elements.reportTableWrap.hidden = true;
  elements.reportTableBody.innerHTML = "";
  elements.reportEmpty.hidden = false;
  elements.reportEmpty.textContent = "No hay reporte cargado.";
  elements.exportReportButton.disabled = true;

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showReportError("Revise el rango de fechas y el tipo de reporte.");
    return;
  }

  showReportError("No se pudo cargar el reporte. Intente de nuevo.");
}

function renderAuditPrompt() {
  elements.auditTableWrap.hidden = true;
  elements.auditTableBody.innerHTML = "";
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent = "Consulte un rango de fechas para ver eventos recientes.";
}

function renderAuditLoading() {
  elements.auditTableWrap.hidden = true;
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent = "Cargando auditoria...";
}

function renderAuditEvents(result) {
  const items = Array.isArray(result.items) ? result.items : [];

  if (items.length === 0) {
    elements.auditTableWrap.hidden = true;
    elements.auditTableBody.innerHTML = "";
    elements.auditEmpty.hidden = false;
    elements.auditEmpty.textContent = "Sin eventos para el rango seleccionado.";
    return;
  }

  elements.auditEmpty.hidden = true;
  elements.auditTableWrap.hidden = false;
  elements.auditTableBody.innerHTML = items.map((item) => renderAuditRow(item)).join("");
  showAuditStatus(`Auditoria cargada: ${formatReportNumber(items.length)} eventos.`);
}

function renderAuditRow(item) {
  const eventType = item.eventType || item.event_type || "";
  const entityType = item.entityType || item.entity_type || "";
  const entityId = item.entityId || item.entity_id || "";
  const customerName = item.customerName || item.customer_name || "";
  const customerId = item.customerId || item.customer_id || "";

  return `
    <tr>
      <td>${formatDateTime(item.occurredAt || item.occurred_at)}</td>
      <td>${escapeHtml(getAuditEventLabel(eventType))}</td>
      <td>${escapeHtml(customerName || (customerId ? `Cliente ${customerId}` : "No aplica"))}</td>
      <td>
        <strong>${escapeHtml(getAuditEntityLabel(entityType))}</strong>
        <span>${escapeHtml(entityId ? `ID ${entityId}` : "Sin ID")}</span>
      </td>
      <td>${escapeHtml(getAuditSummary(item, eventType))}</td>
    </tr>
  `;
}

function renderAuditError(error) {
  elements.auditTableWrap.hidden = true;
  elements.auditTableBody.innerHTML = "";
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent = "No hay auditoria cargada.";

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAuditError("Revise el rango de fechas y el limite de eventos.");
    return;
  }

  showAuditError(
    "No se pudo consultar auditoria. Si el endpoint aun no esta disponible, intente despues del deploy.",
  );
}

function renderCompanyLoading() {
  elements.companyForm.hidden = true;
  elements.companyEmpty.hidden = false;
  elements.companyEmpty.textContent = "Cargando configuracion...";
}

function renderCompanySettings(settings) {
  elements.companyEmpty.hidden = true;
  elements.companyForm.hidden = false;
  elements.companyNameInput.value = settings.name ?? "";
  elements.companyEmailInput.value = settings.email ?? "";
  elements.companyPhoneInput.value = settings.phone ?? "";
  elements.companyLogoUrlInput.value = settings.logoUrl ?? "";
  elements.companyPointsPercentageInput.value = settings.pointsPercentage ?? "";
  elements.companyCurrentStatus.textContent = getCompanyStatusLabel(settings.status);
  elements.companyCurrentUpdated.textContent = settings.updatedAt
    ? formatDateTime(settings.updatedAt)
    : "No disponible";
  const logoUrl = getSafeHttpUrl(settings.logoUrl);
  elements.companyCurrentLogo.innerHTML = logoUrl
    ? `<a href="${escapeHtml(logoUrl)}" target="_blank" rel="noreferrer">Ver logo</a>`
    : "Sin logo";
}

function renderCompanySettingsError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        name: elements.companyNameError,
        email: elements.companyEmailError,
        phone: elements.companyPhoneError,
        logoUrl: elements.companyLogoUrlError,
        pointsPercentage: elements.companyPointsPercentageError,
      }[detail.field];

      if (target) {
        target.textContent = getCompanyValidationMessage(detail);
      }
    });
    showCompanyError("Revise los campos marcados.");
    return;
  }

  if (currentCompanySettings) {
    renderCompanySettings(currentCompanySettings);
  } else {
    elements.companyForm.hidden = true;
    elements.companyEmpty.hidden = false;
    elements.companyEmpty.textContent = "No hay configuracion cargada.";
  }

  if (error instanceof ApiError && error.code === "COMPANY_NOT_FOUND") {
    showCompanyError("La empresa piloto no esta disponible.");
    return;
  }

  showCompanyError("No se pudo cargar o guardar la configuracion. Intente de nuevo.");
}

function renderCompanyRegistrationSuccess(result) {
  const companyName = result.companyName || elements.registrationCompanyNameInput.value.trim();
  const companyEmail = result.companyEmail || elements.registrationCompanyEmailInput.value.trim();

  elements.registrationStatus.hidden = false;
  elements.registrationStatus.textContent = "Solicitud recibida";
  elements.registrationResult.hidden = false;
  elements.registrationResult.innerHTML = `
    <h3>Solicitud recibida</h3>
    <p>
      Recibimos la solicitud de ${escapeHtml(companyName)}. Revisaremos los datos y enviaremos la invitacion al
      correo ${escapeHtml(companyEmail)} cuando quede aprobada.
    </p>
    <p>Tambien notificamos internamente al equipo de Punto Club para dar seguimiento.</p>
  `;
  elements.companyRegistrationForm.reset();
}

function renderCompanyRegistrationError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        companyName: elements.registrationCompanyNameError,
        companyEmail: elements.registrationCompanyEmailError,
        companyAddress: elements.registrationCompanyAddressError,
        companyPhone: elements.registrationCompanyPhoneError,
        contactName: elements.registrationContactNameError,
        contactEmail: elements.registrationContactEmailError,
        contactPhone: elements.registrationContactPhoneError,
      }[detail.field];

      if (target) {
        target.textContent = getCompanyRegistrationValidationMessage(detail);
      }
    });
    showCompanyRegistrationError("Revise los campos marcados antes de enviar la solicitud.");
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_ALREADY_EXISTS") {
    showCompanyRegistrationError(
      "Ya existe una empresa registrada con ese correo. Inicie sesion o contacte al equipo de Punto Club si necesita recuperar el acceso.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "REGISTRATION_ALREADY_PENDING") {
    showCompanyRegistrationError(
      "Ya hay una solicitud pendiente para ese correo. Revisaremos la solicitud y enviaremos la invitacion cuando quede aprobada.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_ALREADY_PENDING") {
    showCompanyRegistrationError(
      "Ya hay una invitacion pendiente para ese correo. Revise la bandeja de entrada o solicite un reenvio si Product lo habilita.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "RATE_LIMITED") {
    showCompanyRegistrationError("Hay demasiados intentos recientes. Espere unos minutos e intente de nuevo.");
    return;
  }

  if (error instanceof ApiError && error.code === "SERVICE_UNAVAILABLE") {
    showCompanyRegistrationError("El servicio no esta disponible en este momento. Intente mas tarde.");
    return;
  }

  showCompanyRegistrationError("No se pudo enviar la solicitud. Intente de nuevo.");
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

function getCompanyValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    email: "El email debe tener un formato valido y 254 caracteres o menos.",
    phone: "El telefono debe tener entre 7 y 32 caracteres.",
    logoUrl: "El logo URL debe ser una URL http(s) valida.",
    pointsPercentage: "El porcentaje debe ser mayor que 0 y menor o igual que 100.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyRegistrationValidationMessage(detail) {
  const messagesByField = {
    companyName: "Ingrese el nombre de la empresa.",
    companyEmail: "Ingrese un correo de empresa valido.",
    companyAddress: "Ingrese la direccion de la empresa.",
    companyPhone: "El telefono de empresa debe tener 32 caracteres o menos.",
    contactName: "El nombre de contacto debe tener 160 caracteres o menos.",
    contactEmail: "Ingrese un correo de contacto valido.",
    contactPhone: "El telefono de contacto debe tener 32 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function clearCustomerMessages() {
  setCustomersFeedback("");
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

function showRedemptionError(message) {
  elements.redemptionError.hidden = false;
  elements.redemptionError.textContent = message;
}

function showOperationStatus(message) {
  elements.operationStatus.hidden = false;
  elements.operationStatus.textContent = message;
}

function showReportStatus(message) {
  elements.reportStatus.hidden = false;
  elements.reportStatus.textContent = message;
}

function showReportError(message) {
  elements.reportError.hidden = false;
  elements.reportError.textContent = message;
}

function showAuditStatus(message) {
  elements.auditStatus.hidden = false;
  elements.auditStatus.textContent = message;
}

function showAuditError(message) {
  elements.auditError.hidden = false;
  elements.auditError.textContent = message;
}

function showCompanyStatus(message) {
  elements.companyStatus.hidden = false;
  elements.companyStatus.textContent = message;
}

function showCompanyError(message) {
  elements.companyError.hidden = false;
  elements.companyError.textContent = message;
}

function showCompanyRegistrationError(message) {
  elements.registrationError.hidden = false;
  elements.registrationError.textContent = message;
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

function clearPurchaseMessages() {
  elements.purchaseInvoiceError.textContent = "";
  elements.purchaseDateError.textContent = "";
  elements.purchaseAmountError.textContent = "";
  elements.purchaseError.hidden = true;
  elements.purchaseError.textContent = "";
}

function clearRedemptionForm(options = {}) {
  elements.redemptionForm.reset();
  elements.redemptionDateInput.value = getToday();
  clearRedemptionMessages(options);
}

function clearRedemptionMessages() {
  elements.redemptionDateError.textContent = "";
  elements.redemptionPointsError.textContent = "";
  elements.redemptionNoteError.textContent = "";
  elements.redemptionError.hidden = true;
  elements.redemptionError.textContent = "";
}

function clearOperationMessages() {
  elements.operationStatus.hidden = true;
  elements.operationStatus.textContent = "";
  clearPurchaseMessages();
  clearRedemptionMessages();
  clearHistoryMessages();
}

function clearReportMessages() {
  elements.reportError.hidden = true;
  elements.reportError.textContent = "";
  elements.reportStatus.hidden = true;
  elements.reportStatus.textContent = "";
}

function clearAuditMessages() {
  elements.auditError.hidden = true;
  elements.auditError.textContent = "";
  elements.auditStatus.hidden = true;
  elements.auditStatus.textContent = "";
}

function clearCompanyMessages() {
  elements.companyNameError.textContent = "";
  elements.companyEmailError.textContent = "";
  elements.companyPhoneError.textContent = "";
  elements.companyLogoUrlError.textContent = "";
  elements.companyPointsPercentageError.textContent = "";
  elements.companyError.hidden = true;
  elements.companyError.textContent = "";
  elements.companyStatus.hidden = true;
  elements.companyStatus.textContent = "";
}

function clearCompanyRegistrationForm(options = {}) {
  elements.companyRegistrationForm.reset();
  clearCompanyRegistrationMessages();

  if (options.focus !== false) {
    elements.registrationCompanyNameInput.focus();
  }
}

function clearCompanyRegistrationMessages() {
  elements.registrationCompanyNameError.textContent = "";
  elements.registrationCompanyEmailError.textContent = "";
  elements.registrationCompanyAddressError.textContent = "";
  elements.registrationCompanyPhoneError.textContent = "";
  elements.registrationContactNameError.textContent = "";
  elements.registrationContactEmailError.textContent = "";
  elements.registrationContactPhoneError.textContent = "";
  elements.registrationError.hidden = true;
  elements.registrationError.textContent = "";
  elements.registrationStatus.hidden = true;
  elements.registrationStatus.textContent = "";
  elements.registrationResult.hidden = true;
  elements.registrationResult.innerHTML = "";
}

function setSubmitting(isSubmitting) {
  elements.saveButton.disabled = isSubmitting;
  elements.saveButton.textContent = isSubmitting ? "Registrando..." : "Registrar cliente";
}

function setPurchaseSubmitting(isSubmitting) {
  elements.savePurchaseButton.disabled = isSubmitting;
  elements.savePurchaseButton.textContent = isSubmitting ? "Registrando..." : "Confirmar compra";
}

function setRedemptionSubmitting(isSubmitting) {
  elements.saveRedemptionButton.disabled = isSubmitting;
  elements.saveRedemptionButton.textContent = isSubmitting ? "Redimiendo..." : "Confirmar canje";
}

function setReportSubmitting(isSubmitting) {
  elements.loadReportButton.disabled = isSubmitting;
  elements.loadReportButton.textContent = isSubmitting ? "Consultando..." : "Consultar";
}

function setAuditSubmitting(isSubmitting) {
  elements.loadAuditButton.disabled = isSubmitting;
  elements.loadAuditButton.textContent = isSubmitting ? "Consultando..." : "Consultar auditoria";
}

function setCompanyLoading(isLoading) {
  elements.reloadCompanyButton.disabled = isLoading;
  elements.reloadCompanyButton.textContent = isLoading ? "Cargando..." : "Recargar";
}

function setCompanySubmitting(isSubmitting) {
  elements.saveCompanyButton.disabled = isSubmitting;
  elements.saveCompanyButton.textContent = isSubmitting
    ? "Guardando..."
    : "Guardar configuracion";
}

function setCompanyRegistrationSubmitting(isSubmitting) {
  elements.submitRegistrationButton.disabled = isSubmitting;
  elements.resetRegistrationButton.disabled = isSubmitting;
  elements.submitRegistrationButton.textContent = isSubmitting ? "Enviando..." : "Enviar solicitud";
}

function getBalanceValue(balance) {
  return balance && balance.pointsBalance != null ? Number(balance.pointsBalance) : 0;
}

function updateCustomerBalance(customerId, balance) {
  if (!balance) {
    return;
  }

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

function formatBalance(balance) {
  if (!balance || balance.pointsBalance == null) {
    return "No disponible";
  }

  return formatPoints(balance.pointsBalance);
}

function formatBalancePart(balance, key) {
  if (!balance || balance[key] == null) {
    return "No disponible";
  }

  return formatPoints(balance[key]);
}

function formatReportNumber(value) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "0";
  }

  return formatPoints(value);
}

function formatPoints(value) {
  return new Intl.NumberFormat("es-CR", { maximumFractionDigits: 0 }).format(Number(value));
}

function formatSignedPoints(value) {
  const numberValue = Number(value);
  const prefix = numberValue >= 0 ? "+" : "-";
  return `${prefix}${formatPoints(Math.abs(numberValue))} pts`;
}

function formatMoney(value) {
  if (!Number.isFinite(Number(value))) {
    return "Monto no disponible";
  }

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return "Fecha no disponible";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getOperationTitle(type) {
  const titles = {
    purchase: "Registrar compra",
    redemption: "Redimir puntos",
    history: "Historial",
  };

  return titles[type] ?? "Operacion";
}

function getReportTypeLabel(type) {
  return type === "purchase" ? "Compra" : "Redencion";
}

function getAuditEventLabel(eventType) {
  const labels = {
    "customer.created": "Cliente creado",
    "purchase.registered": "Compra registrada",
    "redemption.registered": "Canje registrado",
    "customer.rejected_duplicate": "Cliente duplicado",
    "purchase.rejected_duplicate_invoice": "Factura duplicada",
    "redemption.rejected_insufficient_points": "Saldo insuficiente",
    "company.settings.updated": "Configuracion actualizada",
  };

  return labels[eventType] ?? (eventType || "Evento");
}

function getAuditEntityLabel(entityType) {
  const labels = {
    customer: "Cliente",
    purchase: "Compra",
    redemption: "Canje",
    company: "Empresa",
  };

  return labels[entityType] ?? (entityType || "Entidad");
}

function getCompanyStatusLabel(status) {
  const labels = {
    active: "Activa",
    inactive: "Inactiva",
  };

  return labels[status] ?? (status || "No disponible");
}

function getSafeHttpUrl(value) {
  try {
    const url = new URL(String(value ?? ""));
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function getAuditSummary(item, eventType) {
  if (item.summary) {
    return item.summary;
  }

  const metadata = parseAuditMetadata(item.metadata);
  if (metadata.summary) {
    return metadata.summary;
  }

  if (eventType === "purchase.registered") {
    const invoice = metadata.invoiceNumber ? ` Factura ${metadata.invoiceNumber}.` : "";
    return `Compra registrada.${invoice}`;
  }

  if (eventType === "redemption.registered") {
    const points = metadata.pointsRedeemed ? ` ${metadata.pointsRedeemed} pts.` : "";
    return `Canje registrado.${points}`;
  }

  if (eventType === "company.settings.updated") {
    const fields = Array.isArray(metadata.changedFields) ? metadata.changedFields.join(", ") : "";
    return fields ? `Configuracion actualizada: ${fields}.` : "Configuracion actualizada.";
  }

  return getAuditEventLabel(eventType);
}

function parseAuditMetadata(metadata) {
  if (!metadata) {
    return {};
  }

  if (typeof metadata === "object") {
    return metadata;
  }

  try {
    return JSON.parse(metadata);
  } catch (error) {
    return {};
  }
}

function exportReportCsv() {
  if (!currentReport || !Array.isArray(currentReport.items) || currentReport.items.length === 0) {
    showReportError("Consulte un reporte con movimientos antes de exportar.");
    return;
  }

  const csv = buildReportCsv(currentReport);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `punto-club-reporte-${currentReport.from}-${currentReport.to}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showReportStatus("CSV exportado desde los datos cargados.");
}

function buildReportCsv(report) {
  const rows = [
    ["fecha", "tipo", "cliente", "telefono", "email", "detalle", "monto", "puntos"],
    ...report.items.map((item) => [
      item.date || "",
      getReportTypeLabel(item.type),
      item.customerName || "",
      item.customerPhone || "",
      item.customerEmail || "",
      getReportCsvDetail(item),
      item.type === "purchase" ? Number(item.amount ?? 0) : "",
      Number(item.points ?? 0),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

function getReportCsvDetail(item) {
  if (item.type === "purchase") {
    return item.invoiceNumber ? `Factura ${item.invoiceNumber}` : "Compra sin comprobante";
  }

  return item.note || "Sin nota";
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function clearHistoryMessages() {
  elements.historyError.hidden = true;
  elements.historyError.textContent = "";
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
