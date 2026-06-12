import { config } from "./config.js";
import { ApiError, createCustomerApi } from "./customerApi.js";

const api = createCustomerApi(config);

const elements = {
  dataSourceStatus: document.querySelector("#data-source-status"),
  authStatus: document.querySelector("#auth-status"),
  loginButton: document.querySelector("#login-button"),
  logoutButton: document.querySelector("#logout-button"),
  activeCompanyIdentity: document.querySelector("#active-company-identity"),
  activeCompanyLogoFallback: document.querySelector("#active-company-logo-fallback"),
  activeCompanyLogoImage: document.querySelector("#active-company-logo-image"),
  activeCompanyName: document.querySelector("#active-company-name"),
  appBody: document.querySelector(".app-body"),
  authPage: document.querySelector("#auth-page"),
  loginForm: document.querySelector("#login-form"),
  loginEmailInput: document.querySelector("#login-email"),
  loginPasswordInput: document.querySelector("#login-password"),
  loginEmailError: document.querySelector("#login-email-error"),
  loginPasswordError: document.querySelector("#login-password-error"),
  loginError: document.querySelector("#login-error"),
  loginStatus: document.querySelector("#login-status"),
  submitLoginButton: document.querySelector("#submit-login-button"),
  invitationPage: document.querySelector("#invitation-page"),
  invitationLoading: document.querySelector("#invitation-loading"),
  invitationError: document.querySelector("#invitation-error"),
  invitationValid: document.querySelector("#invitation-valid"),
  invitationUnavailable: document.querySelector("#invitation-unavailable"),
  invitationCompanyName: document.querySelector("#invitation-company-name"),
  invitationEmail: document.querySelector("#invitation-email"),
  invitationRole: document.querySelector("#invitation-role"),
  invitationExpiresAt: document.querySelector("#invitation-expires-at"),
  createAccessForm: document.querySelector("#create-access-form"),
  accessDisplayNameInput: document.querySelector("#access-display-name"),
  accessPasswordInput: document.querySelector("#access-password"),
  accessPasswordConfirmationInput: document.querySelector("#access-password-confirmation"),
  accessDisplayNameError: document.querySelector("#access-display-name-error"),
  accessPasswordError: document.querySelector("#access-password-error"),
  accessPasswordConfirmationError: document.querySelector("#access-password-confirmation-error"),
  accessError: document.querySelector("#access-error"),
  accessStatus: document.querySelector("#access-status"),
  createAccessButton: document.querySelector("#create-access-button"),
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
  companyPointsPercentageInput: document.querySelector("#company-points-percentage"),
  companyNameError: document.querySelector("#company-name-error"),
  companyEmailError: document.querySelector("#company-email-error"),
  companyPhoneError: document.querySelector("#company-phone-error"),
  companyPointsPercentageError: document.querySelector("#company-points-percentage-error"),
  companyLogoFileInput: document.querySelector("#company-logo-file"),
  companyLogoFileError: document.querySelector("#company-logo-file-error"),
  companyLogoPreviewText: document.querySelector("#company-logo-preview-text"),
  companyLogoPreviewImage: document.querySelector("#company-logo-preview-image"),
  companyLogoStatus: document.querySelector("#company-logo-status"),
  companyLogoError: document.querySelector("#company-logo-error"),
  uploadCompanyLogoButton: document.querySelector("#upload-company-logo-button"),
  clearCompanyLogoButton: document.querySelector("#clear-company-logo-button"),
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
  registrationLogoFileInput: document.querySelector("#registration-logo-file"),
  registrationLogoFileError: document.querySelector("#registration-logo-file-error"),
  registrationLogoPreviewText: document.querySelector("#registration-logo-preview-text"),
  registrationLogoPreviewImage: document.querySelector("#registration-logo-preview-image"),
  clearRegistrationLogoButton: document.querySelector("#clear-registration-logo-button"),
  registrationStatus: document.querySelector("#registration-status"),
  registrationError: document.querySelector("#registration-error"),
  registrationResult: document.querySelector("#registration-result"),
  resetRegistrationButton: document.querySelector("#reset-registration-button"),
  submitRegistrationButton: document.querySelector("#submit-registration-button"),
  adminCompaniesSection: document.querySelector(".admin-companies-section"),
  adminAccessPanel: document.querySelector(".admin-access-panel"),
  adminDetailPanel: document.querySelector(".admin-detail-panel"),
  adminTokenForm: document.querySelector("#admin-token-form"),
  adminTokenInput: document.querySelector("#admin-token"),
  adminTokenError: document.querySelector("#admin-token-error"),
  adminTokenStatus: document.querySelector("#admin-token-status"),
  adminGlobalError: document.querySelector("#admin-global-error"),
  saveAdminTokenButton: document.querySelector("#save-admin-token-button"),
  clearAdminTokenButton: document.querySelector("#clear-admin-token-button"),
  adminRequestsForm: document.querySelector("#admin-requests-form"),
  adminRequestStatusInput: document.querySelector("#admin-request-status"),
  adminRequestSearchInput: document.querySelector("#admin-request-search"),
  loadAdminRequestsButton: document.querySelector("#load-admin-requests-button"),
  adminListStatus: document.querySelector("#admin-list-status"),
  adminListError: document.querySelector("#admin-list-error"),
  adminSummary: document.querySelector("#admin-summary"),
  adminRequestsList: document.querySelector("#admin-requests-list"),
  adminDetailStatus: document.querySelector("#admin-detail-status"),
  adminDetailError: document.querySelector("#admin-detail-error"),
  adminDetailEmpty: document.querySelector("#admin-detail-empty"),
  adminRequestDetail: document.querySelector("#admin-request-detail"),
  backAdminListButton: document.querySelector("#back-admin-list-button"),
  adminConfirmationModal: document.querySelector("#admin-confirmation-modal"),
  adminConfirmationTitle: document.querySelector("#admin-confirmation-title"),
  adminConfirmationMessage: document.querySelector("#admin-confirmation-message"),
  adminConfirmationCancel: document.querySelector("#admin-confirmation-cancel"),
  adminConfirmationConfirm: document.querySelector("#admin-confirmation-confirm"),
};

let currentCustomers = [];
let selectedCustomer = null;
let currentReport = null;
let currentCompanySettings = null;
let currentAuthIdentity = null;
let currentInvitation = null;
let adminToken = "";
let adminRequests = [];
let selectedAdminRequest = null;
let activeSection = "operations";
let companyLogoPreviewUrl = "";
let registrationLogoPreviewUrl = "";
let pendingAdminConfirmation = null;
const customerBalances = new Map();
const invitationToken = getInvitationTokenFromUrl();
const isInvitationPage = isCompanyInvitationRoute();
const isLoginPage = isCompanyLoginRoute();
const isRegistrationPage = isCompanyRegistrationRoute();
const isAdminCompaniesPage = isAdminCompaniesRoute();

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

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanyLogin();
});

elements.loginButton.addEventListener("click", () => {
  window.location.href = "/login";
});

elements.logoutButton.addEventListener("click", async () => {
  await logoutCompany();
});

elements.createAccessForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCreateAccess();
});

elements.companyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanySettings();
});

elements.companyLogoFileInput.addEventListener("change", () => {
  previewSelectedCompanyLogo();
});

elements.uploadCompanyLogoButton.addEventListener("click", async () => {
  await submitCompanyLogo();
});

elements.clearCompanyLogoButton.addEventListener("click", () => {
  clearSelectedCompanyLogo();
});

elements.companyRegistrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanyRegistrationRequest();
});

elements.registrationLogoFileInput.addEventListener("change", () => {
  previewSelectedRegistrationLogo();
});

elements.clearRegistrationLogoButton.addEventListener("click", () => {
  clearSelectedRegistrationLogo();
});

elements.registrationResult.addEventListener("click", (event) => {
  const button = event.target.closest("#new-registration-button");
  if (!button) {
    return;
  }

  clearCompanyRegistrationForm();
});

elements.resetRegistrationButton.addEventListener("click", () => {
  clearCompanyRegistrationForm();
});

elements.reloadCompanyButton.addEventListener("click", async () => {
  await loadCompanySettings();
});

elements.adminTokenForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitAdminToken();
});

elements.clearAdminTokenButton.addEventListener("click", () => {
  clearAdminToken();
});

elements.adminRequestsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadAdminRequests();
});

elements.adminRequestSearchInput.addEventListener("input", () => {
  renderAdminRequestsList();
});

elements.adminRequestsList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-request-id], [data-admin-card-action]");
  if (!button) {
    return;
  }

  const request = adminRequests.find((item) => String(item.id) === String(button.dataset.adminRequestId));
  if (request) {
    selectAdminRequest(request);
    if (button.dataset.adminCardAction === "approve") {
      await approveSelectedAdminRequest();
    }
  }
});

elements.adminRequestDetail.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-action]");
  if (!button || !selectedAdminRequest) {
    return;
  }

  const action = button.dataset.adminAction;
  if (action === "approve") {
    await approveSelectedAdminRequest();
  } else if (action === "reject") {
    await rejectSelectedAdminRequest();
  } else if (action === "resend") {
    await resendSelectedAdminInvitation();
  }
});

elements.backAdminListButton.addEventListener("click", () => {
  selectedAdminRequest = null;
  renderAdminDetailPrompt();
  elements.adminRequestsList.focus?.();
});

elements.adminConfirmationCancel.addEventListener("click", () => {
  resolveAdminConfirmation(false);
});

elements.adminConfirmationConfirm.addEventListener("click", () => {
  resolveAdminConfirmation(true);
});

elements.adminConfirmationModal.addEventListener("click", (event) => {
  if (event.target === elements.adminConfirmationModal) {
    resolveAdminConfirmation(false);
  }
});

elements.navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.sectionTarget === "adminCompanies" && !isAdminCompaniesRoute()) {
      window.location.assign("/admin-companies");
      return;
    }

    setActiveSection(button.dataset.sectionTarget);
  });
});

setActiveSection(activeSection, { focus: false });
renderSearchPrompt();
resetOperation();
renderReportPrompt();
renderAuditPrompt();
renderAdminPrompt();

if (isInvitationPage) {
  showInvitationPage();
  validateCompanyInvitation(invitationToken);
} else if (isLoginPage) {
  showLoginPage();
  refreshAuthIdentity({ silent: true });
} else if (isRegistrationPage) {
  showPublicCompanyRegistrationPage();
} else if (isAdminCompaniesPage) {
  showAdminCompaniesPage();
} else {
  refreshAuthIdentity({ silent: true }).finally(() => {
    loadCompanySettings();
  });
  elements.searchInput.focus();
}

function setActiveSection(section, options = {}) {
  const nextSection = ["operations", "company", "reports", "adminCompanies"].includes(section)
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
    adminCompanies: elements.adminTokenInput,
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
    renderActiveCompanyIdentity(settings);
  } catch (error) {
    currentCompanySettings = null;
    renderActiveCompanyIdentity(currentAuthIdentity?.company || null);
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
    pointsPercentage: elements.companyPointsPercentageInput.value,
  };

  try {
    const settings = await api.updateCompanySettings(payload);
    currentCompanySettings = settings;
    renderCompanySettings(settings);
    renderActiveCompanyIdentity(settings);
    showCompanyStatus("Configuracion guardada.");
  } catch (error) {
    renderCompanySettingsError(error);
  } finally {
    setCompanySubmitting(false);
  }
}

async function submitCompanyLogo() {
  clearCompanyLogoMessages();

  const [file] = elements.companyLogoFileInput.files;
  const validationMessage = getCompanyLogoValidationMessage(file);

  if (validationMessage) {
    elements.companyLogoFileError.textContent = validationMessage;
    showCompanyLogoError(validationMessage);
    return;
  }

  setCompanyLogoSubmitting(true);

  try {
    const result = await api.uploadCompanyLogo(file);
    currentCompanySettings = {
      ...(currentCompanySettings || {}),
      logoUrl: result.logoUrl || "/api/my-company/logo",
      logoContentType: result.contentType || file.type,
      logoUpdatedAt: result.updatedAt || new Date().toISOString(),
      updatedAt: result.updatedAt || currentCompanySettings?.updatedAt,
    };
    clearSelectedCompanyLogo({ keepMessages: true, renderCurrent: false });
    renderCompanyLogo(currentCompanySettings);
    renderActiveCompanyIdentity(currentCompanySettings);
    showCompanyLogoStatus("Logo actualizado.");
  } catch (error) {
    renderCompanyLogoError(error);
  } finally {
    setCompanyLogoSubmitting(false);
  }
}

async function submitCompanyRegistrationRequest() {
  clearCompanyRegistrationMessages();
  const [logoFile] = elements.registrationLogoFileInput.files;
  const logoValidationMessage = logoFile ? getCompanyLogoValidationMessage(logoFile) : "";

  if (logoValidationMessage) {
    elements.registrationLogoFileError.textContent = logoValidationMessage;
    showCompanyRegistrationError(logoValidationMessage);
    return;
  }

  setCompanyRegistrationSubmitting(true);

  const payload = {
    companyName: elements.registrationCompanyNameInput.value,
    companyEmail: elements.registrationCompanyEmailInput.value,
    companyAddress: elements.registrationCompanyAddressInput.value,
    companyPhone: elements.registrationCompanyPhoneInput.value.trim() || null,
    contactName: elements.registrationContactNameInput.value.trim() || null,
    contactEmail: elements.registrationContactEmailInput.value,
    contactPhone: elements.registrationContactPhoneInput.value.trim() || null,
    logoFile: logoFile || null,
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

async function submitAdminToken() {
  clearAdminMessages();
  const nextToken = elements.adminTokenInput.value.trim();

  if (!nextToken) {
    elements.adminTokenError.textContent = "Ingrese el token interno para cargar solicitudes.";
    showAdminGlobalError("Token interno requerido.");
    return;
  }

  adminToken = nextToken;
  elements.adminTokenInput.value = "";
  showAdminTokenStatus("Acceso interno activo en esta pestana.");
  updateAdminAccessState();
  await loadAdminRequests();
}

function clearAdminToken() {
  adminToken = "";
  adminRequests = [];
  selectedAdminRequest = null;
  elements.adminTokenInput.value = "";
  clearAdminMessages();
  updateAdminAccessState();
  renderAdminPrompt();
  elements.adminTokenInput.focus();
}

async function loadAdminRequests() {
  clearAdminMessages({ keepTokenStatus: true });

  if (!adminToken) {
    renderAdminPrompt();
    elements.adminTokenError.textContent = "Ingrese el token interno para cargar solicitudes.";
    showAdminGlobalError("Ingrese el token interno para cargar solicitudes.");
    return;
  }

  setAdminLoading(true);
  renderAdminListLoading();

  try {
    const result = await api.listCompanyRegistrationRequests(
      {
        status: elements.adminRequestStatusInput.value || "pending",
        limit: "25",
      },
      adminToken,
    );
    adminRequests = Array.isArray(result.items) ? result.items : [];
    selectedAdminRequest = reconcileSelectedAdminRequest(selectedAdminRequest, adminRequests);
    renderAdminRequestsList();
    renderAdminDetail();
    showAdminListStatus(`Solicitudes cargadas: ${formatReportNumber(adminRequests.length)}.`);
  } catch (error) {
    if (isAdminPermissionError(error)) {
      adminToken = "";
      elements.adminTokenStatus.hidden = true;
      elements.adminTokenStatus.textContent = "";
      updateAdminAccessState();
    }
    adminRequests = [];
    selectedAdminRequest = null;
    renderAdminListError(error);
    renderAdminDetailPrompt();
  } finally {
    setAdminLoading(false);
  }
}

async function approveSelectedAdminRequest() {
  if (!selectedAdminRequest || !adminToken) {
    showAdminDetailError("Seleccione una solicitud y confirme el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta solicitud ya fue procesada. Actualice la lista.");
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Aprobar solicitud",
    message: `Va a aprobar la solicitud de ${selectedAdminRequest.companyName || "esta empresa"} y enviar una invitacion al correo ${selectedAdminRequest.companyEmail || "registrado"}.`,
    confirmLabel: "Aprobar y enviar",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "approve");

  try {
    const result = await api.approveCompanyRegistrationRequest(
      selectedAdminRequest.id,
      { reviewNote: "Aprobada desde panel interno." },
      adminToken,
    );
    selectedAdminRequest = {
      ...selectedAdminRequest,
      ...result,
      status: result.status || "approved",
      invitation: result.invitation || selectedAdminRequest.invitation || null,
      companyEmail: selectedAdminRequest.companyEmail,
      companyName: selectedAdminRequest.companyName,
    };
    await loadAdminRequests();
    showAdminDetailStatus(`Solicitud aprobada. La invitacion fue enviada a ${selectedAdminRequest.companyEmail}.`);
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    setAdminActionLoading(false);
  }
}

async function rejectSelectedAdminRequest() {
  if (!selectedAdminRequest || !adminToken) {
    showAdminDetailError("Seleccione una solicitud y confirme el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta solicitud ya fue procesada. Actualice la lista.");
    return;
  }

  const noteInput = elements.adminRequestDetail.querySelector("#admin-reject-note");
  const reviewNote = noteInput?.value.trim() || "";

  if (!reviewNote) {
    showAdminDetailError("Ingrese un motivo para rechazar la solicitud.");
    noteInput?.focus();
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Rechazar solicitud",
    message: "Va a rechazar esta solicitud. El motivo quedara como referencia interna.",
    confirmLabel: "Rechazar",
    danger: true,
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "reject");

  try {
    const result = await api.rejectCompanyRegistrationRequest(
      selectedAdminRequest.id,
      { reviewNote },
      adminToken,
    );
    selectedAdminRequest = {
      ...selectedAdminRequest,
      ...result,
      status: result.status || "rejected",
      reviewNote,
    };
    await loadAdminRequests();
    showAdminDetailStatus("Solicitud rechazada.");
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    setAdminActionLoading(false);
  }
}

async function resendSelectedAdminInvitation() {
  const invitation = selectedAdminRequest?.invitation;

  if (!invitation || !adminToken) {
    showAdminDetailError("No hay una invitacion pendiente para reenviar.");
    return;
  }

  if (invitation.status === "accepted") {
    showAdminDetailError("La invitacion ya fue aceptada. No es necesario reenviarla.");
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Reenviar invitacion",
    message: `Se reenviara la invitacion al correo ${invitation.email || selectedAdminRequest.companyEmail}. No se mostrara el link en pantalla.`,
    confirmLabel: "Reenviar",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "resend");

  try {
    const result = await api.resendCompanyInvitation(invitation.id, adminToken);
    selectedAdminRequest = {
      ...selectedAdminRequest,
      invitation: {
        ...invitation,
        ...result,
        status: result.status || "pending",
      },
    };
    await loadAdminRequests();
    showAdminDetailStatus(`Invitacion reenviada a ${result.email || invitation.email}.`);
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    setAdminActionLoading(false);
  }
}

async function validateCompanyInvitation(token) {
  renderInvitationLoading();

  if (!token) {
    renderInvitationUnavailable("invalid");
    return;
  }

  try {
    const result = await api.validateCompanyInvitation(token);

    if (result.valid) {
      currentInvitation = result;
      renderInvitationValid(result);
      return;
    }

    renderInvitationUnavailable(result.reason || "invalid");
  } catch (error) {
    renderInvitationServiceError(error);
  }
}

async function submitCreateAccess() {
  clearCreateAccessMessages();

  if (!currentInvitation || !invitationToken) {
    renderInvitationUnavailable("invalid");
    return;
  }

  if (!validateCreateAccessForm()) {
    return;
  }

  setCreateAccessSubmitting(true);

  try {
    const result = await api.acceptCompanyInvitation({
      token: invitationToken,
      displayName: elements.accessDisplayNameInput.value.trim() || null,
      password: elements.accessPasswordInput.value,
    });
    renderAccessCreated(result);
  } catch (error) {
    renderCreateAccessError(error);
  } finally {
    setCreateAccessSubmitting(false);
  }
}

async function submitCompanyLogin() {
  clearLoginMessages();
  setLoginSubmitting(true);

  try {
    const identity = await api.loginCompany({
      email: elements.loginEmailInput.value,
      password: elements.loginPasswordInput.value,
    });
    currentAuthIdentity = identity;
    renderAuthIdentity(identity);
    elements.loginPasswordInput.value = "";
    await showMainApp({ replaceLoginRoute: true, focus: true, refreshCompany: true });
  } catch (error) {
    renderLoginError(error);
  } finally {
    setLoginSubmitting(false);
  }
}

async function refreshAuthIdentity(options = {}) {
  try {
    const identity = await api.getCurrentCompanyUser();
    currentAuthIdentity = identity;
    renderAuthIdentity(identity);

    if (isLoginPage) {
      await showMainApp({ replaceLoginRoute: true, refreshCompany: true });
    }
  } catch (error) {
    currentAuthIdentity = null;
    renderSignedOut();

    if (!options.silent && error instanceof ApiError && error.code === "UNAUTHORIZED") {
      showLoginError("La sesion expiro. Inicie sesion de nuevo.");
    }
  }
}

async function logoutCompany() {
  try {
    await api.logoutCompany();
  } catch (error) {
    // Even if the server cannot revoke, clear only the visible client state.
  }

  currentAuthIdentity = null;
  renderSignedOut();
  showLoginPage({ replaceRoute: true });
  clearLoginMessages();
  showLoginStatus("Sesion cerrada.");
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
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND"
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

  if (isAuthRequiredError(error)) {
    showReportError(getAuthRequiredMessage());
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

  if (isAuthRequiredError(error)) {
    showAuditError(getAuthRequiredMessage());
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
  elements.companyPointsPercentageInput.value = settings.pointsPercentage ?? "";
  elements.companyCurrentStatus.textContent = getCompanyStatusLabel(settings.status);
  elements.companyCurrentUpdated.textContent = settings.updatedAt
    ? formatDateTime(settings.updatedAt)
    : "No disponible";
  renderCompanyLogo(settings);
}

function renderCompanySettingsError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        name: elements.companyNameError,
        email: elements.companyEmailError,
        phone: elements.companyPhoneError,
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

  if (isAuthRequiredError(error)) {
    showCompanyError(getAuthRequiredMessage());
    return;
  }

  showCompanyError("No se pudo cargar o guardar la configuracion. Intente de nuevo.");
}

function renderCompanyLogo(settings) {
  revokeCompanyLogoPreviewUrl();
  const logoUrl = settings?.logoUrl ? api.getCompanyLogoUrl?.(settings.logoUrl) : "";
  const updatedAt = settings?.logoUpdatedAt || settings?.updatedAt;

  if (!logoUrl) {
    elements.companyCurrentLogo.textContent = "Sin logo";
    elements.companyLogoPreviewText.hidden = false;
    elements.companyLogoPreviewText.textContent = "Sin logo";
    elements.companyLogoPreviewImage.hidden = true;
    elements.companyLogoPreviewImage.removeAttribute("src");
    return;
  }

  const cacheKey = updatedAt ? `?v=${encodeURIComponent(updatedAt)}` : "";
  elements.companyCurrentLogo.textContent = updatedAt
    ? `Actualizado ${formatDateTime(updatedAt)}`
    : "Logo cargado";
  elements.companyLogoPreviewText.hidden = true;
  elements.companyLogoPreviewImage.hidden = false;
  elements.companyLogoPreviewImage.src = `${logoUrl}${cacheKey}`;
}

function previewSelectedCompanyLogo() {
  clearCompanyLogoMessages();
  const [file] = elements.companyLogoFileInput.files;
  const validationMessage = getCompanyLogoValidationMessage(file);

  if (validationMessage) {
    elements.companyLogoFileError.textContent = validationMessage;
    showCompanyLogoError(validationMessage);
    renderCompanyLogo(currentCompanySettings);
    return;
  }

  revokeCompanyLogoPreviewUrl();
  companyLogoPreviewUrl = URL.createObjectURL(file);
  elements.companyLogoPreviewText.hidden = true;
  elements.companyLogoPreviewImage.hidden = false;
  elements.companyLogoPreviewImage.src = companyLogoPreviewUrl;
  showCompanyLogoStatus("Logo listo para subir.");
}

function clearSelectedCompanyLogo(options = {}) {
  elements.companyLogoFileInput.value = "";
  revokeCompanyLogoPreviewUrl();

  if (!options.keepMessages) {
    clearCompanyLogoMessages();
  }

  if (options.renderCurrent !== false) {
    renderCompanyLogo(currentCompanySettings);
  }
}

function revokeCompanyLogoPreviewUrl() {
  if (companyLogoPreviewUrl) {
    URL.revokeObjectURL(companyLogoPreviewUrl);
    companyLogoPreviewUrl = "";
  }
}

function previewSelectedRegistrationLogo() {
  const [file] = elements.registrationLogoFileInput.files;
  const validationMessage = file ? getCompanyLogoValidationMessage(file) : "";
  elements.registrationLogoFileError.textContent = "";

  if (!file) {
    clearSelectedRegistrationLogo();
    return;
  }

  if (validationMessage) {
    elements.registrationLogoFileError.textContent = validationMessage;
    revokeRegistrationLogoPreviewUrl();
    elements.registrationLogoPreviewText.hidden = false;
    elements.registrationLogoPreviewText.textContent = "Sin logo";
    elements.registrationLogoPreviewImage.hidden = true;
    elements.registrationLogoPreviewImage.removeAttribute("src");
    return;
  }

  revokeRegistrationLogoPreviewUrl();
  registrationLogoPreviewUrl = URL.createObjectURL(file);
  elements.registrationLogoPreviewText.hidden = true;
  elements.registrationLogoPreviewImage.hidden = false;
  elements.registrationLogoPreviewImage.src = registrationLogoPreviewUrl;
}

function clearSelectedRegistrationLogo(options = {}) {
  elements.registrationLogoFileInput.value = "";
  revokeRegistrationLogoPreviewUrl();
  elements.registrationLogoPreviewText.hidden = false;
  elements.registrationLogoPreviewText.textContent = "Sin logo";
  elements.registrationLogoPreviewImage.hidden = true;
  elements.registrationLogoPreviewImage.removeAttribute("src");

  if (!options.keepMessages) {
    elements.registrationLogoFileError.textContent = "";
  }
}

function revokeRegistrationLogoPreviewUrl() {
  if (registrationLogoPreviewUrl) {
    URL.revokeObjectURL(registrationLogoPreviewUrl);
    registrationLogoPreviewUrl = "";
  }
}

function renderCompanyLogoError(error) {
  if (error instanceof ApiError && error.code === "UPLOAD_TOO_LARGE") {
    showCompanyLogoError("El logo debe pesar 1 MB o menos.");
    return;
  }

  if (error instanceof ApiError && error.code === "UNSUPPORTED_MEDIA_TYPE") {
    showCompanyLogoError("Use una imagen PNG, JPG o WebP.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showCompanyLogoError(getAuthRequiredMessage());
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showCompanyLogoError(error.message || "Revise el archivo seleccionado.");
    return;
  }

  showCompanyLogoError("No se pudo subir el logo. Intente de nuevo.");
}

function renderCompanyRegistrationSuccess(result) {
  const companyName = result.companyName || elements.registrationCompanyNameInput.value.trim();
  const companyEmail = result.companyEmail || elements.registrationCompanyEmailInput.value.trim();
  const contactEmail = result.contactEmail || elements.registrationContactEmailInput.value.trim();
  const hasLogo = Boolean(result.requestedLogo?.available || elements.registrationLogoFileInput.files.length);

  elements.registrationStatus.hidden = false;
  elements.registrationStatus.textContent = "Solicitud recibida";
  elements.registrationResult.hidden = false;
  elements.registrationResult.innerHTML = `
    <h3>Solicitud recibida</h3>
    <p>
      Recibimos la solicitud de ${escapeHtml(companyName)}. Revisaremos los datos y enviaremos la invitacion al
      correo de empresa cuando quede aprobada.
    </p>
    <div class="registration-summary">
      ${renderAdminDetailItem("Empresa", companyName)}
      ${renderAdminDetailItem("Correo de empresa", companyEmail)}
      ${renderAdminDetailItem("Correo de contacto", contactEmail)}
      ${renderAdminDetailItem("Estado", getRegistrationStatusLabel(result.status || "pending"))}
      ${renderAdminDetailItem("Logo", hasLogo ? "Incluido" : "No incluido")}
    </div>
    <p>Tambien notificamos internamente al equipo de Punto Club para dar seguimiento.</p>
    <div class="form-actions">
      <button class="secondary-button" id="new-registration-button" type="button">Enviar otra solicitud</button>
    </div>
  `;
  elements.companyRegistrationForm.hidden = true;
  elements.companyRegistrationForm.reset();
  clearSelectedRegistrationLogo({ keepMessages: true });
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
        logoFile: elements.registrationLogoFileError,
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

function renderAdminPrompt() {
  updateAdminAccessState();
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML =
    '<div class="empty-state">Ingrese el token interno para cargar solicitudes.</div>';
  renderAdminDetailPrompt();
}

function renderAdminListLoading() {
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML = '<div class="loading-state">Cargando solicitudes...</div>';
}

function renderAdminRequestsList() {
  const search = normalize(elements.adminRequestSearchInput.value);
  const filteredRequests = adminRequests.filter((request) =>
    [request.companyName, request.companyEmail, request.contactName, request.contactEmail]
      .some((value) => normalize(value).includes(search)),
  );

  elements.adminSummary.hidden = false;
  elements.adminSummary.innerHTML = `
    <div>
      <span>Total cargadas</span>
      <strong>${formatReportNumber(adminRequests.length)}</strong>
    </div>
    <div>
      <span>Pendientes</span>
      <strong>${formatReportNumber(adminRequests.filter((item) => item.status === "pending").length)}</strong>
    </div>
    <div>
      <span>Filtro visible</span>
      <strong>${formatReportNumber(filteredRequests.length)}</strong>
    </div>
  `;

  if (filteredRequests.length === 0) {
    const message = search
      ? "No encontramos solicitudes con esos datos."
      : elements.adminRequestStatusInput.value === "pending"
        ? "No hay solicitudes pendientes."
        : "No hay solicitudes para revisar.";
    elements.adminRequestsList.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
    return;
  }

  elements.adminRequestsList.innerHTML = filteredRequests.map((request) => renderAdminRequestCard(request)).join("");
}

function renderAdminRequestCard(request) {
  const isSelected = selectedAdminRequest && String(selectedAdminRequest.id) === String(request.id);
  const invitationLabel = getAdminInvitationLabel(request.invitation);
  const canApprove = request.status === "pending";

  return `
    <article class="admin-request-card ${isSelected ? "is-selected" : ""}">
      <div class="admin-request-main">
        <h3>${escapeHtml(request.companyName || "Empresa sin nombre")}</h3>
        <p>${escapeHtml(request.companyEmail || "Correo no disponible")}</p>
        <p>Contacto: ${escapeHtml(request.contactName || "No indicado")} - ${escapeHtml(request.contactEmail || "Sin correo")}</p>
      </div>
      <div class="admin-request-meta">
        <span>${escapeHtml(getRegistrationStatusLabel(request.status))}</span>
        <span>${escapeHtml(formatDateTime(request.createdAt))}</span>
        <span>${escapeHtml(invitationLabel)}</span>
      </div>
      <div class="row-actions">
        ${
          canApprove
            ? `
              <button
                type="button"
                data-admin-request-id="${escapeHtml(request.id)}"
                data-admin-card-action="approve"
              >
                Aprobar
              </button>
            `
            : ""
        }
        <button
          class="secondary-button"
          type="button"
          data-admin-request-id="${escapeHtml(request.id)}"
        >
          Ver detalle
        </button>
      </div>
    </article>
  `;
}

function selectAdminRequest(request) {
  selectedAdminRequest = request;
  renderAdminRequestsList();
  renderAdminDetail();
  elements.adminCompaniesSection.classList.add("is-admin-drawer-open");
}

function renderAdminDetailPrompt() {
  elements.adminCompaniesSection.classList.remove("is-admin-drawer-open");
  elements.backAdminListButton.hidden = true;
  elements.adminDetailEmpty.hidden = false;
  elements.adminDetailEmpty.textContent = "Seleccione una solicitud para revisar sus datos.";
  elements.adminRequestDetail.hidden = true;
  elements.adminRequestDetail.innerHTML = "";
}

function renderAdminDetail() {
  if (!selectedAdminRequest) {
    renderAdminDetailPrompt();
    return;
  }

  const request = selectedAdminRequest;
  const isPending = request.status === "pending";
  elements.backAdminListButton.hidden = false;
  elements.adminDetailEmpty.hidden = true;
  elements.adminRequestDetail.hidden = false;
  elements.adminRequestDetail.innerHTML = `
    <div class="admin-detail-grid">
      ${renderAdminDetailItem("Empresa", request.companyName)}
      ${renderAdminDetailItem("Correo de empresa", request.companyEmail)}
      ${renderAdminDetailItem("Telefono", request.companyPhone)}
      ${renderAdminDetailItem("Direccion", request.companyAddress)}
      ${renderAdminDetailItem("Contacto", request.contactName)}
      ${renderAdminDetailItem("Correo de contacto", request.contactEmail)}
      ${renderAdminDetailItem("Telefono de contacto", request.contactPhone)}
      ${renderAdminDetailItem("Estado", getRegistrationStatusLabel(request.status))}
      ${renderAdminDetailItem("Logo", request.requestedLogo?.available ? "Incluido" : "No incluido")}
      ${renderAdminDetailItem("Solicitud", formatDateTime(request.createdAt))}
      ${renderAdminDetailItem("Actualizacion", formatDateTime(request.updatedAt))}
    </div>

    <div class="admin-state-note">
      ${escapeHtml(getAdminRequestStateMessage(request.status))}
    </div>

    ${renderAdminInvitationPanel(request.invitation)}

    ${
      isPending
        ? `
          <div class="admin-action-panel">
            <div class="form-actions">
              <button id="approve-admin-request-button" type="button" data-admin-action="approve">
                Aprobar y enviar invitacion
              </button>
            </div>

            <div class="field">
              <label for="admin-reject-note">Motivo del rechazo</label>
              <textarea
                id="admin-reject-note"
                maxlength="500"
                rows="3"
                placeholder="Ej. Datos incompletos, correo no corresponde o empresa fuera del piloto."
              ></textarea>
              <p class="field-help">Este motivo queda como referencia interna.</p>
            </div>

            <div class="form-actions">
              <button
                class="secondary-button danger-button"
                id="reject-admin-request-button"
                type="button"
                data-admin-action="reject"
              >
                Rechazar solicitud
              </button>
            </div>
          </div>
        `
        : ""
    }
  `;
}

function renderAdminDetailItem(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "No disponible")}</strong>
    </div>
  `;
}

function renderAdminInvitationPanel(invitation) {
  if (!invitation) {
    return `
      <section class="admin-invitation-panel" aria-label="Invitacion">
        <h3>Invitacion</h3>
        <p>Esta solicitud aun no tiene invitacion asociada.</p>
      </section>
    `;
  }

  const canResend = ["pending", "expired"].includes(invitation.status);

  return `
    <section class="admin-invitation-panel" aria-label="Invitacion">
      <div class="section-header compact-header">
        <div>
          <h3>Invitacion</h3>
          <p class="section-support">Link generado y enviado por correo. No se muestra el link en pantalla.</p>
        </div>
      </div>

      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Estado", getInvitationStatusLabel(invitation.status))}
        ${renderAdminDetailItem("Correo invitado", invitation.email)}
        ${renderAdminDetailItem("Rol", getInvitationRoleLabel(invitation.role))}
        ${renderAdminDetailItem("Envio", formatDateTime(invitation.createdAt))}
        ${renderAdminDetailItem("Expira", formatDateTime(invitation.expiresAt))}
        ${renderAdminDetailItem("Aceptada", invitation.acceptedAt ? formatDateTime(invitation.acceptedAt) : "No")}
      </div>

      ${
        canResend
          ? `
            <div class="form-actions">
              <button
                class="secondary-button"
                id="resend-admin-invitation-button"
                type="button"
                data-admin-action="resend"
              >
                Reenviar invitacion
              </button>
            </div>
          `
          : ""
      }
    </section>
  `;
}

function reconcileSelectedAdminRequest(selected, requests) {
  if (!selected) {
    return null;
  }

  return requests.find((request) => String(request.id) === String(selected.id)) || selected;
}

function renderAdminListError(error) {
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML = '<div class="empty-state">No hay solicitudes cargadas.</div>';

  if (isAdminPermissionError(error)) {
    showAdminListError("Token interno invalido o vencido. Ingreselo de nuevo.");
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAdminListError("Revise el filtro de estado e intente de nuevo.");
    return;
  }

  showAdminListError("No se pudieron cargar las solicitudes. Revise el token interno e intente de nuevo.");
}

function updateAdminAccessState() {
  elements.adminCompaniesSection.classList.toggle("has-admin-token", Boolean(adminToken));
}

function requestAdminConfirmation(options) {
  if (pendingAdminConfirmation) {
    pendingAdminConfirmation(false);
  }

  elements.adminConfirmationTitle.textContent = options.title || "Confirmar accion";
  elements.adminConfirmationMessage.textContent = options.message || "";
  elements.adminConfirmationConfirm.textContent = options.confirmLabel || "Confirmar";
  elements.adminConfirmationConfirm.classList.toggle("danger-button", Boolean(options.danger));
  elements.adminConfirmationModal.hidden = false;
  elements.adminConfirmationConfirm.focus();

  return new Promise((resolve) => {
    pendingAdminConfirmation = resolve;
  });
}

function resolveAdminConfirmation(value) {
  if (!pendingAdminConfirmation) {
    return;
  }

  const resolve = pendingAdminConfirmation;
  pendingAdminConfirmation = null;
  elements.adminConfirmationModal.hidden = true;
  elements.adminConfirmationConfirm.classList.remove("danger-button");
  resolve(value);
}

function renderAdminActionError(error) {
  if (isAdminPermissionError(error)) {
    showAdminDetailError("No tiene acceso para realizar esta accion con el token actual.");
    return;
  }

  if (
    error instanceof ApiError &&
    ["COMPANY_REGISTRATION_REQUEST_NOT_FOUND", "COMPANY_NOT_FOUND"].includes(error.code)
  ) {
    showAdminDetailError("La solicitud ya fue procesada por otro flujo. Actualice la lista.");
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAdminDetailError("Revise los datos de la accion e intente de nuevo.");
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_ALREADY_EXISTS") {
    showAdminDetailError("Ya existe una empresa registrada con ese correo.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_ALREADY_ACCEPTED") {
    showAdminDetailError("La invitacion ya fue aceptada. No es necesario reenviarla.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_EXPIRED") {
    showAdminDetailError("La invitacion expiro. Actualice la lista antes de reenviar.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_NOT_FOUND") {
    showAdminDetailError("No hay una invitacion pendiente para reenviar.");
    return;
  }

  showAdminDetailError("No se pudo completar la accion. Intente de nuevo.");
}

function renderInvitationLoading() {
  currentInvitation = null;
  elements.invitationLoading.hidden = false;
  elements.invitationLoading.textContent = "Validando invitacion...";
  elements.invitationError.hidden = true;
  elements.invitationError.textContent = "";
  elements.invitationValid.hidden = true;
  elements.invitationUnavailable.hidden = true;
  elements.invitationUnavailable.innerHTML = "";
}

function renderInvitationValid(invitation) {
  elements.invitationLoading.hidden = true;
  elements.invitationError.hidden = true;
  elements.invitationValid.hidden = false;
  elements.invitationUnavailable.hidden = true;
  elements.invitationCompanyName.textContent = invitation.companyName || "No disponible";
  elements.invitationEmail.textContent = invitation.email || "No disponible";
  elements.invitationRole.textContent = getInvitationRoleLabel(invitation.role);
  elements.invitationExpiresAt.textContent = formatDateTime(invitation.expiresAt);
  elements.accessDisplayNameInput.value = "";
  elements.accessPasswordInput.value = "";
  elements.accessPasswordConfirmationInput.value = "";
  clearCreateAccessMessages();
}

function renderInvitationUnavailable(reason) {
  const state = getInvitationUnavailableState(reason);
  elements.invitationLoading.hidden = true;
  elements.invitationError.hidden = true;
  elements.invitationValid.hidden = true;
  elements.invitationUnavailable.hidden = false;
  elements.invitationUnavailable.innerHTML = `
    <h3>${escapeHtml(state.title)}</h3>
    <p>${escapeHtml(state.message)}</p>
  `;
}

function renderInvitationServiceError(error) {
  elements.invitationLoading.hidden = true;
  elements.invitationValid.hidden = true;
  elements.invitationUnavailable.hidden = true;

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    renderInvitationUnavailable("invalid");
    return;
  }

  elements.invitationError.hidden = false;
  elements.invitationError.textContent = "El servicio no esta disponible en este momento. Intente mas tarde.";
}

function renderAccessCreated(result) {
  elements.createAccessForm.hidden = true;
  elements.accessStatus.hidden = false;
  elements.accessStatus.textContent =
    "Acceso creado. Ya puede iniciar sesion con el correo de la invitacion.";
  elements.loginEmailInput.value = result.email || currentInvitation?.email || "";
}

function renderCreateAccessError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        displayName: elements.accessDisplayNameError,
        password: elements.accessPasswordError,
      }[detail.field];

      if (target) {
        target.textContent = getCreateAccessValidationMessage(detail);
      }
    });
    showAccessError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_EXPIRED") {
    renderInvitationUnavailable("expired");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_ALREADY_ACCEPTED") {
    renderInvitationUnavailable("accepted");
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_USER_ALREADY_EXISTS") {
    showAccessError("Ya existe un acceso para ese correo. Inicie sesion.");
    return;
  }

  showAccessError("No se pudo crear el acceso. Intente de nuevo.");
}

function renderLoginError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        email: elements.loginEmailError,
        password: elements.loginPasswordError,
      }[detail.field];

      if (target) {
        target.textContent = getLoginValidationMessage(detail);
      }
    });
    showLoginError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code)) {
    showLoginError("Correo o password incorrecto.");
    return;
  }

  if (error instanceof ApiError && error.code === "RATE_LIMITED") {
    showLoginError("Hay demasiados intentos recientes. Espere unos minutos e intente de nuevo.");
    return;
  }

  showLoginError("No se pudo iniciar sesion. Intente de nuevo.");
}

function renderAuthIdentity(identity) {
  const companyName = identity?.company?.name || "Empresa";
  const email = identity?.user?.email || "Sesion iniciada";
  api.setActiveCompanyId?.(identity?.company?.id);
  elements.authStatus.textContent = `Empresa activa: ${companyName} - ${email}`;
  elements.loginButton.hidden = true;
  elements.logoutButton.hidden = false;
  renderActiveCompanyIdentity(identity?.company || null);
}

function renderSignedOut() {
  api.setActiveCompanyId?.(config.companyId);
  elements.authStatus.textContent = "Sesion no iniciada";
  elements.loginButton.hidden = false;
  elements.logoutButton.hidden = true;
  currentCompanySettings = null;
  renderActiveCompanyIdentity(null);
}

function renderActiveCompanyIdentity(company) {
  const companyName = company?.name || currentAuthIdentity?.company?.name || "";

  if (!companyName) {
    elements.activeCompanyIdentity.hidden = true;
    elements.activeCompanyLogoImage.hidden = true;
    elements.activeCompanyLogoImage.removeAttribute("src");
    elements.activeCompanyName.textContent = "";
    return;
  }

  elements.activeCompanyIdentity.hidden = false;
  elements.activeCompanyName.textContent = companyName;
  elements.activeCompanyLogoFallback.textContent = getCompanyInitials(companyName);

  const logoUrl = company?.logoUrl ? api.getCompanyLogoUrl?.(company.logoUrl) : "";
  const updatedAt = company?.logoUpdatedAt || company?.updatedAt;

  if (!logoUrl) {
    elements.activeCompanyLogoFallback.hidden = false;
    elements.activeCompanyLogoImage.hidden = true;
    elements.activeCompanyLogoImage.removeAttribute("src");
    return;
  }

  const cacheKey = updatedAt ? `?v=${encodeURIComponent(updatedAt)}` : "";
  elements.activeCompanyLogoFallback.hidden = true;
  elements.activeCompanyLogoImage.hidden = false;
  elements.activeCompanyLogoImage.src = `${logoUrl}${cacheKey}`;
}

function getCompanyInitials(name) {
  return String(name || "PC")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "PC";
}

function renderCustomersError(error) {
  const message =
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : error instanceof ApiError && error.code === "INTERNAL_ERROR"
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

  if (isAuthRequiredError(error)) {
    showFormError(getAuthRequiredMessage());
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

  if (isAuthRequiredError(error)) {
    showPurchaseError(getAuthRequiredMessage());
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

  if (isAuthRequiredError(error)) {
    showRedemptionError(getAuthRequiredMessage());
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
    pointsPercentage: "El porcentaje debe ser mayor que 0 y menor o igual que 100.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyLogoValidationMessage(file) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

  if (!file) {
    return "Seleccione una imagen de logo.";
  }

  if (!allowedTypes.has(file.type)) {
    return "Use una imagen PNG, JPG o WebP.";
  }

  if (file.size > 1048576) {
    return "El logo debe pesar 1 MB o menos.";
  }

  return "";
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

function getCreateAccessValidationMessage(detail) {
  const messagesByField = {
    displayName: "El nombre debe tener 160 caracteres o menos.",
    password: "Use 10 a 128 caracteres, con letras y numeros.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getLoginValidationMessage(detail) {
  const messagesByField = {
    email: "Ingrese un correo valido.",
    password: "Ingrese el password.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function isAuthRequiredError(error) {
  return error instanceof ApiError && ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code);
}

function isAdminPermissionError(error) {
  return error instanceof ApiError && ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code);
}

function getAuthRequiredMessage() {
  return "Inicie sesion para operar con la empresa activa.";
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

function showCompanyLogoStatus(message) {
  elements.companyLogoStatus.hidden = false;
  elements.companyLogoStatus.textContent = message;
}

function showCompanyLogoError(message) {
  elements.companyLogoError.hidden = false;
  elements.companyLogoError.textContent = message;
}

function showCompanyRegistrationError(message) {
  elements.registrationError.hidden = false;
  elements.registrationError.textContent = message;
}

function showAdminTokenStatus(message) {
  elements.adminTokenStatus.hidden = false;
  elements.adminTokenStatus.textContent = message;
}

function showAdminGlobalError(message) {
  elements.adminGlobalError.hidden = false;
  elements.adminGlobalError.textContent = message;
}

function showAdminListStatus(message) {
  elements.adminListStatus.hidden = false;
  elements.adminListStatus.textContent = message;
}

function showAdminListError(message) {
  elements.adminListError.hidden = false;
  elements.adminListError.textContent = message;
}

function showAdminDetailStatus(message) {
  elements.adminDetailStatus.hidden = false;
  elements.adminDetailStatus.textContent = message;
}

function showAdminDetailError(message) {
  elements.adminDetailError.hidden = false;
  elements.adminDetailError.textContent = message;
}

function showAccessError(message) {
  elements.accessError.hidden = false;
  elements.accessError.textContent = message;
}

function showLoginError(message) {
  elements.loginError.hidden = false;
  elements.loginError.textContent = message;
}

function showLoginStatus(message) {
  elements.loginStatus.hidden = false;
  elements.loginStatus.textContent = message;
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
  elements.companyPointsPercentageError.textContent = "";
  elements.companyError.hidden = true;
  elements.companyError.textContent = "";
  elements.companyStatus.hidden = true;
  elements.companyStatus.textContent = "";
}

function clearCompanyLogoMessages() {
  elements.companyLogoFileError.textContent = "";
  elements.companyLogoError.hidden = true;
  elements.companyLogoError.textContent = "";
  elements.companyLogoStatus.hidden = true;
  elements.companyLogoStatus.textContent = "";
}

function clearCompanyRegistrationForm(options = {}) {
  elements.companyRegistrationForm.reset();
  elements.companyRegistrationForm.hidden = false;
  clearSelectedRegistrationLogo({ keepMessages: true });
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
  elements.registrationLogoFileError.textContent = "";
  elements.registrationError.hidden = true;
  elements.registrationError.textContent = "";
  elements.registrationStatus.hidden = true;
  elements.registrationStatus.textContent = "";
  elements.registrationResult.hidden = true;
  elements.registrationResult.innerHTML = "";
}

function clearAdminMessages(options = {}) {
  elements.adminTokenError.textContent = "";
  elements.adminGlobalError.hidden = true;
  elements.adminGlobalError.textContent = "";
  elements.adminListError.hidden = true;
  elements.adminListError.textContent = "";
  elements.adminListStatus.hidden = true;
  elements.adminListStatus.textContent = "";
  elements.adminDetailError.hidden = true;
  elements.adminDetailError.textContent = "";
  elements.adminDetailStatus.hidden = true;
  elements.adminDetailStatus.textContent = "";

  if (!options.keepTokenStatus) {
    elements.adminTokenStatus.hidden = !adminToken;
    elements.adminTokenStatus.textContent = adminToken
      ? "Acceso interno activo en esta pestana."
      : "";
  }
}

function clearCreateAccessMessages() {
  elements.accessDisplayNameError.textContent = "";
  elements.accessPasswordError.textContent = "";
  elements.accessPasswordConfirmationError.textContent = "";
  elements.accessError.hidden = true;
  elements.accessError.textContent = "";
  elements.accessStatus.hidden = true;
  elements.accessStatus.textContent = "";
}

function clearLoginMessages() {
  elements.loginEmailError.textContent = "";
  elements.loginPasswordError.textContent = "";
  elements.loginError.hidden = true;
  elements.loginError.textContent = "";
  elements.loginStatus.hidden = true;
  elements.loginStatus.textContent = "";
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

function setCompanyLogoSubmitting(isSubmitting) {
  elements.uploadCompanyLogoButton.disabled = isSubmitting;
  elements.clearCompanyLogoButton.disabled = isSubmitting;
  elements.companyLogoFileInput.disabled = isSubmitting;
  elements.uploadCompanyLogoButton.textContent = isSubmitting ? "Subiendo..." : "Subir logo";
}

function setCompanyRegistrationSubmitting(isSubmitting) {
  elements.submitRegistrationButton.disabled = isSubmitting;
  elements.resetRegistrationButton.disabled = isSubmitting;
  elements.submitRegistrationButton.textContent = isSubmitting ? "Enviando..." : "Enviar solicitud";
}

function setAdminLoading(isLoading) {
  elements.loadAdminRequestsButton.disabled = isLoading;
  elements.loadAdminRequestsButton.textContent = isLoading ? "Cargando..." : "Actualizar";
  elements.saveAdminTokenButton.disabled = isLoading;
}

function setAdminActionLoading(isLoading, action = "") {
  const approveButton = elements.adminRequestDetail.querySelector("#approve-admin-request-button");
  const rejectButton = elements.adminRequestDetail.querySelector("#reject-admin-request-button");
  const resendButton = elements.adminRequestDetail.querySelector("#resend-admin-invitation-button");

  [approveButton, rejectButton, resendButton].forEach((button) => {
    if (button) {
      button.disabled = isLoading;
    }
  });

  if (approveButton) {
    approveButton.textContent = isLoading && action === "approve"
      ? "Aprobando solicitud..."
      : "Aprobar y enviar invitacion";
  }

  if (rejectButton) {
    rejectButton.textContent = isLoading && action === "reject"
      ? "Rechazando solicitud..."
      : "Rechazar solicitud";
  }

  if (resendButton) {
    resendButton.textContent = isLoading && action === "resend"
      ? "Reenviando invitacion..."
      : "Reenviar invitacion";
  }
}

function setCreateAccessSubmitting(isSubmitting) {
  elements.createAccessButton.disabled = isSubmitting;
  elements.createAccessButton.textContent = isSubmitting ? "Creando..." : "Crear acceso";
}

function setLoginSubmitting(isSubmitting) {
  elements.submitLoginButton.disabled = isSubmitting;
  elements.submitLoginButton.textContent = isSubmitting ? "Entrando..." : "Entrar";
}

function showInvitationPage() {
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.invitationPage.hidden = false;
  renderActiveCompanyIdentity(null);
}

function showLoginPage(options = {}) {
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.appBody.hidden = true;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = false;
  if (options.replaceRoute && !isCompanyLoginRoute()) {
    window.history.replaceState({}, "", "/login");
  }
  window.requestAnimationFrame(() => {
    elements.loginEmailInput.focus();
  });
}

async function showMainApp(options = {}) {
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.appBody.hidden = false;
  setActiveSection("operations", { focus: options.focus !== false });

  if (options.replaceLoginRoute && isCompanyLoginRoute()) {
    window.history.replaceState({}, "", "/");
  }

  if (options.refreshCompany) {
    await loadCompanySettings();
  }
}

function showPublicCompanyRegistrationPage() {
  document.body.classList.add("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.appBody.hidden = false;
  elements.loginButton.hidden = true;
  elements.logoutButton.hidden = true;
  elements.authStatus.textContent = "Registro publico";
  renderActiveCompanyIdentity(null);
  setActiveSection("company", { focus: false });
  isolatePublicCompanyRegistrationView();
  clearCompanyRegistrationForm({ focus: false });

  window.requestAnimationFrame(() => {
    elements.registrationCompanyNameInput.focus();
  });
}

function isolatePublicCompanyRegistrationView() {
  elements.sectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== "company";
  });
}

function showAdminCompaniesPage() {
  document.body.classList.remove("public-registration-mode");
  document.body.classList.add("admin-companies-page-mode");
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.appBody.hidden = false;
  elements.loginButton.hidden = true;
  elements.logoutButton.hidden = true;
  elements.authStatus.textContent = "Admin interno";
  renderActiveCompanyIdentity(null);
  setActiveSection("adminCompanies", { focus: false });
  isolateAdminCompaniesView();

  window.requestAnimationFrame(() => {
    if (adminToken) {
      elements.adminRequestSearchInput.focus();
      return;
    }

    elements.adminTokenInput.focus();
  });
}

function isolateAdminCompaniesView() {
  elements.sectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== "adminCompanies";
  });
}

function validateCreateAccessForm() {
  const password = elements.accessPasswordInput.value;
  const confirmation = elements.accessPasswordConfirmationInput.value;
  let isValid = true;

  if (!isStrongPassword(password)) {
    elements.accessPasswordError.textContent = "Use 10 a 128 caracteres, con letras y numeros.";
    isValid = false;
  }

  if (password !== confirmation) {
    elements.accessPasswordConfirmationError.textContent = "Los passwords no coinciden.";
    isValid = false;
  }

  if (!isValid) {
    showAccessError("Revise los campos marcados.");
  }

  return isValid;
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
    pending_activation: "Pendiente de activacion",
  };

  return labels[status] ?? (status || "No disponible");
}

function getRegistrationStatusLabel(status) {
  const labels = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
  };

  return labels[status] ?? (status || "No disponible");
}

function getInvitationStatusLabel(status) {
  const labels = {
    pending: "Invitacion pendiente",
    accepted: "Invitacion aceptada",
    expired: "Invitacion expirada",
    revoked: "Invitacion no disponible",
  };

  return labels[status] ?? (status || "Invitacion no disponible");
}

function getAdminInvitationLabel(invitation) {
  if (!invitation) {
    return "Sin invitacion";
  }

  return getInvitationStatusLabel(invitation.status);
}

function getAdminRequestStateMessage(status) {
  const messages = {
    pending: "Esta solicitud esta pendiente de revision.",
    approved: "Esta solicitud ya fue aprobada.",
    rejected: "Esta solicitud fue rechazada.",
    cancelled: "Esta solicitud ya no esta disponible.",
  };

  return messages[status] ?? "Esta solicitud ya fue procesada. Actualice la lista para ver el estado mas reciente.";
}

function getInvitationRoleLabel(role) {
  const labels = {
    owner: "Owner",
    admin: "Admin",
    staff: "Staff",
  };

  return labels[role] ?? (role || "No disponible");
}

function getInvitationUnavailableState(reason) {
  const states = {
    invalid: {
      title: "Invitacion no disponible",
      message:
        "Esta invitacion expiro, ya fue usada o no es valida. Solicite una nueva invitacion para crear el acceso.",
    },
    expired: {
      title: "Invitacion expirada",
      message: "Esta invitacion expiro. Contacte al equipo de Punto Club para recibir una nueva invitacion.",
    },
    accepted: {
      title: "Acceso creado",
      message: "Esta invitacion ya fue usada. Si no puede entrar, contacte al equipo de Punto Club.",
    },
    revoked: {
      title: "Invitacion no disponible",
      message:
        "Esta invitacion ya no esta disponible. Contacte al equipo de Punto Club para revisar el acceso de la empresa.",
    },
  };

  return states[reason] ?? states.invalid;
}

function isCompanyInvitationRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/company-invitations/accept";
}

function isCompanyLoginRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/login";
}

function isCompanyRegistrationRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/company-registration";
}

function isAdminCompaniesRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/admin-companies";
}

function getInvitationTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("token") || "";
}

function isStrongPassword(password) {
  return (
    password.length >= 10 &&
    password.length <= 128 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password)
  );
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
