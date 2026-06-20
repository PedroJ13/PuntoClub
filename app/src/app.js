import { config } from "./config.js";
import { ApiError, createCustomerApi } from "./customerApi.js";

const api = createCustomerApi(config);

const elements = {
  publicHomePage: document.querySelector("#public-home-page"),
  globalLoading: document.querySelector("#global-loading"),
  globalLoadingMessage: document.querySelector("#global-loading-message"),
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
  pointsNavButton: document.querySelector('[data-section-target="operations"]'),
  membershipsNavButton: document.querySelector('[data-section-target="memberships"]'),
  membershipOperationHost: document.querySelector("#membership-operation-host"),
  membershipConfigHost: document.querySelector("#membership-config-host"),
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
  pointsMembershipContext: document.querySelector("#points-membership-context"),
  membershipOperationPanel: document.querySelector("#membership-operation-panel"),
  reloadMembershipOperationButton: document.querySelector("#reload-membership-operation-button"),
  membershipOperationStatus: document.querySelector("#membership-operation-status"),
  membershipOperationError: document.querySelector("#membership-operation-error"),
  membershipPaymentHost: document.querySelector("#membership-payment-host"),
  membershipOperationActive: document.querySelector("#membership-operation-active"),
  membershipRenewalForm: document.querySelector("#membership-renewal-form"),
  membershipRenewalPaymentMethodInput: document.querySelector("#membership-renewal-payment-method"),
  membershipRenewalAmountInput: document.querySelector("#membership-renewal-amount"),
  membershipRenewalPaymentMethodError: document.querySelector("#membership-renewal-payment-method-error"),
  membershipRenewalAmountError: document.querySelector("#membership-renewal-amount-error"),
  cancelMembershipRenewalButton: document.querySelector("#cancel-membership-renewal-button"),
  confirmMembershipRenewalButton: document.querySelector("#confirm-membership-renewal-button"),
  membershipOperationBenefits: document.querySelector("#membership-operation-benefits"),
  membershipBenefitUsageForm: document.querySelector("#membership-benefit-usage-form"),
  membershipBenefitUsageBenefitIdInput: document.querySelector("#membership-benefit-usage-benefit-id"),
  membershipBenefitUsageSummary: document.querySelector("#membership-benefit-usage-summary"),
  membershipBenefitUsageDateInput: document.querySelector("#membership-benefit-usage-date"),
  membershipBenefitUsageQuantityInput: document.querySelector("#membership-benefit-usage-quantity"),
  membershipBenefitUsageNoteInput: document.querySelector("#membership-benefit-usage-note"),
  membershipBenefitUsageDateError: document.querySelector("#membership-benefit-usage-date-error"),
  membershipBenefitUsageQuantityError: document.querySelector("#membership-benefit-usage-quantity-error"),
  membershipBenefitUsageNoteError: document.querySelector("#membership-benefit-usage-note-error"),
  cancelMembershipBenefitUsageButton: document.querySelector("#cancel-membership-benefit-usage-button"),
  confirmMembershipBenefitUsageButton: document.querySelector("#confirm-membership-benefit-usage-button"),
  membershipOperationUsages: document.querySelector("#membership-operation-usages"),
  membershipOperationTransactions: document.querySelector("#membership-operation-transactions"),
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
  membershipFinancialReportForm: document.querySelector("#membership-financial-report-form"),
  membershipFinancialReportFromInput: document.querySelector("#membership-financial-report-from"),
  membershipFinancialReportToInput: document.querySelector("#membership-financial-report-to"),
  membershipFinancialReportError: document.querySelector("#membership-financial-report-error"),
  membershipFinancialReportStatus: document.querySelector("#membership-financial-report-status"),
  membershipFinancialReportSummary: document.querySelector("#membership-financial-report-summary"),
  membershipFinancialPaymentSummary: document.querySelector("#membership-financial-payment-summary"),
  membershipFinancialReportEmpty: document.querySelector("#membership-financial-report-empty"),
  membershipFinancialReportTableWrap: document.querySelector("#membership-financial-report-table-wrap"),
  membershipFinancialReportTableBody: document.querySelector("#membership-financial-report-table-body"),
  loadMembershipFinancialReportButton: document.querySelector("#load-membership-financial-report-button"),
  exportMembershipFinancialReportButton: document.querySelector("#export-membership-financial-report-button"),
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
  membershipPlansList: document.querySelector("#membership-plans-list"),
  membershipPlansStatus: document.querySelector("#membership-plans-status"),
  membershipPlansError: document.querySelector("#membership-plans-error"),
  reloadMembershipPlansButton: document.querySelector("#reload-membership-plans-button"),
  membershipPlanForm: document.querySelector("#membership-plan-form"),
  membershipPlanIdInput: document.querySelector("#membership-plan-id"),
  membershipPlanNameInput: document.querySelector("#membership-plan-name"),
  membershipPlanDescriptionInput: document.querySelector("#membership-plan-description"),
  membershipPlanDurationDaysInput: document.querySelector("#membership-plan-duration-days"),
  membershipPlanPriceInput: document.querySelector("#membership-plan-price"),
  membershipPlanRenewalNoticeDaysInput: document.querySelector("#membership-plan-renewal-notice-days"),
  membershipPlanNameError: document.querySelector("#membership-plan-name-error"),
  membershipPlanDescriptionError: document.querySelector("#membership-plan-description-error"),
  membershipPlanDurationDaysError: document.querySelector("#membership-plan-duration-days-error"),
  membershipPlanPriceError: document.querySelector("#membership-plan-price-error"),
  membershipPlanRenewalNoticeDaysError: document.querySelector("#membership-plan-renewal-notice-days-error"),
  saveMembershipPlanButton: document.querySelector("#save-membership-plan-button"),
  resetMembershipPlanButton: document.querySelector("#reset-membership-plan-button"),
  cancelMembershipPlanButton: document.querySelector("#cancel-membership-plan-button"),
  membershipExpirationForm: document.querySelector("#membership-expiration-form"),
  membershipExpirationWithinDaysInput: document.querySelector("#membership-expiration-within-days"),
  membershipExpirationWithinDaysError: document.querySelector("#membership-expiration-within-days-error"),
  reloadMembershipExpirationButton: document.querySelector("#reload-membership-expiration-button"),
  loadMembershipExpirationButton: document.querySelector("#load-membership-expiration-button"),
  membershipExpirationStatus: document.querySelector("#membership-expiration-status"),
  membershipExpirationError: document.querySelector("#membership-expiration-error"),
  membershipExpiringList: document.querySelector("#membership-expiring-list"),
  membershipExpiredList: document.querySelector("#membership-expired-list"),
  membershipBenefitsContext: document.querySelector("#membership-benefits-context"),
  membershipBenefitsList: document.querySelector("#membership-benefits-list"),
  membershipBenefitsStatus: document.querySelector("#membership-benefits-status"),
  membershipBenefitsError: document.querySelector("#membership-benefits-error"),
  membershipBenefitForm: document.querySelector("#membership-benefit-form"),
  membershipBenefitIdInput: document.querySelector("#membership-benefit-id"),
  membershipBenefitNameInput: document.querySelector("#membership-benefit-name"),
  membershipBenefitDescriptionInput: document.querySelector("#membership-benefit-description"),
  membershipBenefitTypeInput: document.querySelector("#membership-benefit-type"),
  membershipBenefitAppliesToTypeInput: document.querySelector("#membership-benefit-applies-to-type"),
  membershipBenefitAppliesToNameInput: document.querySelector("#membership-benefit-applies-to-name"),
  membershipBenefitDiscountPercentInput: document.querySelector("#membership-benefit-discount-percent"),
  membershipBenefitIncludedQuantityInput: document.querySelector("#membership-benefit-included-quantity"),
  membershipBenefitUsageLimitInput: document.querySelector("#membership-benefit-usage-limit"),
  membershipBenefitUsagePeriodInput: document.querySelector("#membership-benefit-usage-period"),
  membershipBenefitNameError: document.querySelector("#membership-benefit-name-error"),
  membershipBenefitDescriptionError: document.querySelector("#membership-benefit-description-error"),
  membershipBenefitTypeError: document.querySelector("#membership-benefit-type-error"),
  membershipBenefitAppliesToTypeError: document.querySelector("#membership-benefit-applies-to-type-error"),
  membershipBenefitAppliesToNameError: document.querySelector("#membership-benefit-applies-to-name-error"),
  membershipBenefitDiscountPercentError: document.querySelector("#membership-benefit-discount-percent-error"),
  membershipBenefitIncludedQuantityError: document.querySelector("#membership-benefit-included-quantity-error"),
  membershipBenefitUsageLimitError: document.querySelector("#membership-benefit-usage-limit-error"),
  membershipBenefitUsagePeriodError: document.querySelector("#membership-benefit-usage-period-error"),
  saveMembershipBenefitButton: document.querySelector("#save-membership-benefit-button"),
  resetMembershipBenefitButton: document.querySelector("#reset-membership-benefit-button"),
  cancelMembershipBenefitButton: document.querySelector("#cancel-membership-benefit-button"),
  membershipCustomerSearchForm: document.querySelector("#membership-activation-search-form"),
  membershipCustomerSearchInput: document.querySelector("#membership-customer-search"),
  searchMembershipCustomerButton: document.querySelector("#search-membership-customer-button"),
  membershipCustomerSearchStatus: document.querySelector("#membership-customer-search-status"),
  membershipCustomerSearchError: document.querySelector("#membership-customer-search-error"),
  membershipCustomerResults: document.querySelector("#membership-customer-results"),
  membershipActivationForm: document.querySelector("#membership-activation-form"),
  membershipSelectedCustomer: document.querySelector("#membership-selected-customer"),
  membershipPointsContext: document.querySelector("#membership-points-context"),
  membershipActivationPlanInput: document.querySelector("#membership-activation-plan"),
  membershipActivationStartDateInput: document.querySelector("#membership-activation-start-date"),
  membershipActivationPricePaidInput: document.querySelector("#membership-activation-price-paid"),
  membershipActivationPaymentMethodInput: document.querySelector("#membership-activation-payment-method"),
  membershipActivationPlanError: document.querySelector("#membership-activation-plan-error"),
  membershipActivationStartDateError: document.querySelector("#membership-activation-start-date-error"),
  membershipActivationPricePaidError: document.querySelector("#membership-activation-price-paid-error"),
  membershipActivationPaymentMethodError: document.querySelector("#membership-activation-payment-method-error"),
  membershipActivationPreview: document.querySelector("#membership-activation-preview"),
  membershipActivationStatus: document.querySelector("#membership-activation-status"),
  membershipActivationError: document.querySelector("#membership-activation-error"),
  activateMembershipButton: document.querySelector("#activate-membership-button"),
  reloadCustomerMembershipsButton: document.querySelector("#reload-customer-memberships-button"),
  membershipCustomerMembershipsStatus: document.querySelector("#membership-customer-memberships-status"),
  membershipCustomerMembershipsError: document.querySelector("#membership-customer-memberships-error"),
  membershipCustomerMembershipsList: document.querySelector("#membership-customer-memberships-list"),
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
let currentMembershipFinancialReport = null;
let currentCompanySettings = null;
let currentAuthIdentity = null;
let currentInvitation = null;
let membershipPlans = [];
let membershipBenefits = [];
let membershipCustomerResults = [];
let selectedMembershipCustomer = null;
let selectedCustomerMemberships = [];
let selectedMembershipPlanId = null;
let selectedCustomerActiveMembership = null;
let selectedCustomerMembershipBenefits = [];
let selectedCustomerMembershipUsages = [];
let selectedCustomerMembershipTransactions = [];
let membershipExpirationAlerts = { active: [], expired: [] };
let pendingMembershipBenefitUsage = null;
let adminToken = "";
let adminRequests = [];
let selectedAdminRequest = null;
let activeSection = "operations";
let companyLogoPreviewUrl = "";
let registrationLogoPreviewUrl = "";
let adminRequestLogoPreviewUrl = "";
let adminRequestLogoPreviewRequestId = null;
let adminRequestLogoPreviewLoadId = 0;
let pendingAdminConfirmation = null;
let globalLoadingTimer = null;
const customerBalances = new Map();
const invitationToken = getInvitationTokenFromUrl();
const isInvitationPage = isCompanyInvitationRoute();
const isLoginPage = isCompanyLoginRoute();
const isRegistrationPage = isCompanyRegistrationRoute();
const isAdminCompaniesPage = isAdminCompaniesRoute();

relocateLoyaltyPanels();

elements.dataSourceStatus.textContent = api.sourceLabel;
elements.purchaseDateInput.value = getToday();
elements.redemptionDateInput.value = getToday();
elements.reportFromInput.value = getToday();
elements.reportToInput.value = getToday();
elements.membershipFinancialReportFromInput.value = getToday();
elements.membershipFinancialReportToInput.value = getToday();
elements.auditFromInput.value = getToday();
elements.auditToInput.value = getToday();
elements.membershipActivationStartDateInput.value = getToday();
elements.membershipExpirationWithinDaysInput.value = "5";

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

elements.reloadMembershipOperationButton.addEventListener("click", async () => {
  await loadOperationMembershipPanel();
});

elements.membershipOperationBenefits.addEventListener("click", (event) => {
  const button = event.target.closest("[data-membership-usage-benefit-id]");
  if (!button) {
    return;
  }

  openMembershipBenefitUsageConfirmation(button.dataset.membershipUsageBenefitId);
});

elements.membershipOperationActive.addEventListener("click", (event) => {
  const button = event.target.closest("[data-membership-renew-action]");
  if (!button) {
    return;
  }

  openMembershipRenewalForm();
});

elements.membershipRenewalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitMembershipRenewal();
});

elements.cancelMembershipRenewalButton.addEventListener("click", () => {
  clearMembershipRenewalForm();
});

elements.pointsMembershipContext.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-go-to-memberships]");
  if (!button || !selectedCustomer) {
    return;
  }

  await goToMembershipsWithCustomer(selectedCustomer);
});

elements.membershipPointsContext.addEventListener("click", (event) => {
  const button = event.target.closest("[data-go-to-points]");
  if (!button || !selectedMembershipCustomer) {
    return;
  }

  goToPointsWithCustomer(selectedMembershipCustomer);
});

elements.membershipBenefitUsageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitMembershipBenefitUsage();
});

elements.cancelMembershipBenefitUsageButton.addEventListener("click", () => {
  clearMembershipBenefitUsageForm();
});

elements.reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadActivityReport();
});

elements.exportReportButton.addEventListener("click", () => {
  exportReportCsv();
});

elements.membershipFinancialReportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadMembershipFinancialReport();
});

elements.exportMembershipFinancialReportButton.addEventListener("click", () => {
  exportMembershipFinancialReportCsv();
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

elements.reloadMembershipPlansButton.addEventListener("click", async () => {
  await loadMembershipPlans();
});

elements.membershipExpirationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadMembershipExpirationAlerts();
});

elements.reloadMembershipExpirationButton.addEventListener("click", async () => {
  await loadMembershipExpirationAlerts();
});

elements.membershipPlanForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitMembershipPlan();
});

elements.resetMembershipPlanButton.addEventListener("click", () => {
  openMembershipPlanForm();
});

elements.cancelMembershipPlanButton.addEventListener("click", () => {
  closeMembershipPlanForm();
});

elements.membershipPlansList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-membership-plan-action]");
  if (!button) {
    return;
  }

  await handleMembershipPlanAction(button);
});

elements.membershipBenefitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitMembershipBenefit();
});

elements.resetMembershipBenefitButton.addEventListener("click", () => {
  openMembershipBenefitForm();
});

elements.cancelMembershipBenefitButton.addEventListener("click", () => {
  closeMembershipBenefitForm();
});

elements.membershipBenefitsList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-membership-benefit-action]");
  if (!button) {
    return;
  }

  await handleMembershipBenefitAction(button);
});

elements.membershipCustomerSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchMembershipCustomers();
});

elements.membershipCustomerResults.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-membership-customer-id]");
  if (!button) {
    return;
  }

  await selectMembershipCustomer(button.dataset.membershipCustomerId);
});

elements.selectedCustomerCard.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-profile-action]");
  if (actionButton) {
    await openOperation(actionButton.dataset.profileAction);
    return;
  }

  const membershipButton = event.target.closest("[data-profile-membership-action]");
  if (!membershipButton) {
    return;
  }

  if (!isMembershipsEnabled()) {
    return;
  }

  await loadOperationMembershipPanel({ openPanel: true });

  if (selectedCustomerActiveMembership && isMembershipCurrentlyUsable(selectedCustomerActiveMembership)) {
    elements.membershipOperationPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (selectedCustomerActiveMembership && isMembershipRenewable(selectedCustomerActiveMembership)) {
    openMembershipRenewalForm();
    return;
  }

  elements.membershipPaymentHost.hidden = false;
  elements.membershipActivationForm.hidden = false;
  elements.membershipActivationPlanInput.focus();
});

elements.membershipActivationPlanInput.addEventListener("change", () => {
  const plan = getSelectedActivationPlan();
  elements.membershipActivationPricePaidInput.value = plan ? plan.price ?? "" : "";
  renderMembershipActivationPreview();
});

elements.membershipActivationStartDateInput.addEventListener("change", () => {
  renderMembershipActivationPreview();
});

elements.membershipActivationPricePaidInput.addEventListener("input", () => {
  renderMembershipActivationPreview();
});

elements.membershipActivationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitMembershipActivation();
});

elements.reloadCustomerMembershipsButton.addEventListener("click", async () => {
  if (selectedMembershipCustomer) {
    await loadSelectedCustomerMemberships();
  }
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
renderMembershipFinancialReportPrompt();
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
  refreshAuthIdentity({ silent: true }).then((identity) => {
    if (identity) {
      return showMainApp({ focus: false, refreshCompany: true });
    }

    showPublicHomePage();
    return null;
  });
}

function relocateLoyaltyPanels() {
  if (elements.membershipPaymentHost && elements.membershipActivationForm) {
    elements.membershipPaymentHost.append(elements.membershipActivationForm);
  }

  if (elements.membershipConfigHost) {
    [
      document.querySelector(".membership-plans-panel"),
      document.querySelector(".membership-plan-form-panel"),
      document.querySelector(".membership-benefits-panel"),
      document.querySelector(".membership-benefit-form-panel"),
    ].forEach((panel) => {
      if (panel) {
        elements.membershipConfigHost.append(panel);
      }
    });
  }
}

function setActiveSection(section, options = {}) {
  const membershipsEnabled = isMembershipsEnabled();
  const pointsEnabled = isPointsEnabled();
  let requestedSection = section;
  if (requestedSection === "memberships") {
    requestedSection = membershipsEnabled || pointsEnabled ? "operations" : "company";
  }
  if (requestedSection === "operations" && !pointsEnabled && !membershipsEnabled) {
    requestedSection = "company";
  }
  const nextSection = ["operations", "company", "memberships", "reports", "adminCompanies"].includes(requestedSection)
    ? requestedSection
    : getDefaultLoyaltySection();
  activeSection = nextSection;

  elements.sectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.section !== nextSection;
  });

  elements.navButtons.forEach((button) => {
    const isActive = button.dataset.sectionTarget === nextSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if ((nextSection === "operations" || nextSection === "memberships") && membershipPlans.length === 0 && membershipsEnabled) {
    loadMembershipPlans();
  }

  if (nextSection === "operations" && membershipsEnabled) {
    loadMembershipExpirationAlerts();
    if (selectedCustomer) {
      loadOperationMembershipPanel();
    }
  }

  if (nextSection === "operations") {
    renderPointsMembershipContext();
  }

  if (options.focus === false) {
    return;
  }

  const focusTarget = {
    operations: elements.searchInput,
    company: elements.companyNameInput,
    memberships: elements.membershipCustomerSearchInput,
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
      setCustomersFeedback("No encontramos ese cliente. Completa el registro para crearlo.");
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
    await selectCustomer(customerWithBalance);
    showSuccess(`Cliente registrado: ${customer.name}. Ya puedes continuar la atencion.`);
    clearForm({ keepSuccess: true, focus: false });
    elements.selectedCustomerCard.focus?.();
  } catch (error) {
    if (isDuplicateCustomerError(error)) {
      await handleDuplicateCustomer(payload);
      return;
    }

    renderFormError(error);
  } finally {
    setSubmitting(false);
  }
}

async function handleDuplicateCustomer(payload) {
  const match = await findExistingCustomer(payload);

  if (!match) {
    showFormError(
      "Este cliente ya existe. Buscalo para continuar la atencion.",
    );
    return;
  }

  const [customerWithBalance] = await withBalances([match]);
  currentCustomers = [customerWithBalance];
  elements.searchInput.value = customerWithBalance.phone || customerWithBalance.email || "";
  setCustomersFeedback("");
  renderCustomers(currentCustomers, elements.searchInput.value);
  await selectCustomer(
    customerWithBalance,
    "Este cliente ya existe. Lo seleccionamos para continuar la atencion.",
  );
  showSuccess("Este cliente ya existe. Lo seleccionamos para continuar la atencion.");
  clearForm({ keepSuccess: true, focus: false });
  elements.selectedCustomerCard.focus?.();
}

async function findExistingCustomer(payload) {
  const searches = [payload.phone, payload.email, payload.name]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

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

function isDuplicateCustomerError(error) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  const code = String(error.code || "").toUpperCase();
  return [
    "DUPLICATE_CUSTOMER",
    "CUSTOMER_DUPLICATE",
    "CUSTOMER_ALREADY_EXISTS",
    "CUSTOMER_EXISTS",
  ].includes(code);
}

async function submitPurchase() {
  clearPurchaseMessages();

  if (!selectedCustomer) {
    showPurchaseError("Selecciona un cliente antes de registrar compra.");
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
      `Compra registrada. Puntos ganados: ${formatPoints(purchase.pointsEarned)}.`,
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
    showRedemptionError("Selecciona un cliente antes de redimir puntos.");
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
      `Puntos redimidos: ${formatPoints(redemption.pointsRedeemed)}.`,
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
    '<div class="empty-state">Busca un cliente para atenderlo o registra uno nuevo.</div>';
}

function renderLoading() {
  elements.customersList.innerHTML = '<div class="loading-state">Buscando clientes...</div>';
}

function renderCustomers(customers, search) {
  if (customers.length === 0) {
    const text = search
      ? "No encontramos clientes con esa busqueda. Puedes registrar uno nuevo para continuar."
      : "Busca un cliente para atenderlo o registra uno nuevo.";
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
        button.disabled = true;
        button.textContent = "Cargando...";
        selectCustomer(customer)
          .catch((error) => {
            console.error("No se pudo completar la seleccion del cliente.", error);
            showOperationStatus("Cliente seleccionado. Algunas secciones pueden tardar en cargar.");
          })
          .finally(() => {
            button.disabled = false;
            button.textContent = "Atender";
          });
      }
    });
  });
}

function renderCustomer(customer) {
  return `
    <article class="customer-row ${selectedCustomer && String(selectedCustomer.id) === String(customer.id) ? "is-selected" : ""}">
      <div class="customer-main">
        <h3>${escapeHtml(customer.name)}</h3>
        <p class="customer-meta">
          <span>${escapeHtml(customer.phone)}</span>
          <span>${escapeHtml(customer.email || "Sin correo")}</span>
        </p>
      </div>
      <div class="points-badge">
        <span>Puntos</span>
        <strong>${formatBalance(customer.balance)}</strong>
      </div>
      <div class="row-actions">
        <button type="button" data-icon="→" data-action="attend" data-customer-id="${escapeHtml(customer.id)}">Atender</button>
      </div>
    </article>
  `;
}

async function selectCustomer(customer, statusMessage = "") {
  const [customerWithBalance] = customer.balance
    ? [customer]
    : await withBalances([customer]);
  selectedCustomer = {
    ...customerWithBalance,
    balance: customerWithBalance.balance ?? customerBalances.get(String(customerWithBalance.id)),
  };
  elements.operationEmpty.hidden = true;
  elements.operationTitle.textContent = "Ficha del cliente";
  elements.purchaseForm.hidden = true;
  elements.redemptionForm.hidden = true;
  elements.historyPanel.hidden = true;
  hideMembershipOperationPanel();
  selectedMembershipCustomer = { ...selectedCustomer };
  membershipCustomerResults = [selectedMembershipCustomer];
  renderSelectedCustomer();
  renderSelectedMembershipCustomer();

  if (statusMessage) {
    showOperationStatus(statusMessage);
  }

  if (isMembershipsEnabled()) {
    try {
      await loadSelectedCustomerMemberships();
      await loadOperationMembershipPanel({ openPanel: false });
    } catch (error) {
      renderOperationMembershipError(error);
    }
  } else {
    resetOperationMembershipState();
  }

  if (currentCustomers.length) {
    renderCustomers(currentCustomers, elements.searchInput.value.trim());
  }
}

async function goToMembershipsWithCustomer(customer) {
  if (!isMembershipsEnabled()) {
    return;
  }

  selectedMembershipCustomer = { ...customer };
  membershipCustomerResults = [selectedMembershipCustomer];
  elements.membershipCustomerSearchInput.value = customer.name || "";
  renderMembershipCustomerResults();
  renderSelectedMembershipCustomer();
  setActiveSection("memberships");
  await loadSelectedCustomerMemberships();
  await loadOperationMembershipPanel();
}

function goToPointsWithCustomer(customer) {
  if (!isPointsEnabled()) {
    return;
  }

  selectedCustomer = {
    ...customer,
    balance: customer.balance ?? customerBalances.get(String(customer.id)),
  };
  currentCustomers = [selectedCustomer];
  elements.searchInput.value = customer.name || "";
  setActiveSection("operations");
  resetOperation("Cliente conservado desde Membresias. Selecciona compra, historial o redimir puntos.");
  renderCustomers(currentCustomers, elements.searchInput.value.trim());
  renderSelectedCustomer();
  renderPointsMembershipContext();
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
  hideMembershipOperationPanel();
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
  elements.operationTitle.textContent = "Ficha del cliente";
  elements.operationEmpty.hidden = false;
  elements.operationEmpty.textContent = message || "Selecciona un cliente para ver su resumen y operar puntos o membresias.";
  elements.selectedCustomerCard.hidden = true;
  elements.purchaseForm.hidden = true;
  elements.redemptionForm.hidden = true;
  elements.historyPanel.hidden = true;
  resetOperationMembershipState();
  renderPointsMembershipContext();

  if (message) {
    showOperationStatus(message);
  }
}

async function loadOperationMembershipPanel(options = {}) {
  const openPanel = options.openPanel !== false;
  const operationCustomer = getMembershipOperationCustomer();
  if (!operationCustomer) {
    resetOperationMembershipState();
    return;
  }

  const customerId = operationCustomer.id;
  clearMembershipOperationMessages();
  clearMembershipBenefitUsageForm();
  clearMembershipRenewalForm();

  if (!isMembershipsEnabled()) {
    selectedCustomerActiveMembership = null;
    selectedCustomerMembershipBenefits = [];
    selectedCustomerMembershipUsages = [];
    selectedCustomerMembershipTransactions = [];
    if (openPanel) {
      elements.membershipOperationPanel.hidden = false;
      renderOperationMembershipDisabled();
    }
    return;
  }

  if (openPanel) {
    elements.membershipOperationPanel.hidden = false;
    setMembershipOperationLoading(true);
    renderOperationMembershipLoading();
  }

  try {
    const filters = getMembershipUsageDateFilters();
    const [membershipsResult, transactionsResult] = await Promise.all([
      api.listCustomerMemberships(customerId, { status: "all" }),
      api.listMembershipTransactions(customerId, filters),
    ]);

    if (String(getMembershipOperationCustomer()?.id) !== String(customerId)) {
      return;
    }

    selectedCustomerMembershipTransactions = transactionsResult.items || [];
    selectedCustomerActiveMembership = getRenewableMembership(membershipsResult.items || []);

    if (!selectedCustomerActiveMembership) {
      selectedCustomerMembershipBenefits = [];
      selectedCustomerMembershipUsages = [];
      if (openPanel) {
        renderOperationMembershipPanel();
      } else {
        hideMembershipOperationPanel();
        renderSelectedCustomer();
      }
      return;
    }

    const isUsableMembership = isMembershipCurrentlyUsable(selectedCustomerActiveMembership);
    const [benefitsResult, usagesResult] = isUsableMembership
      ? await Promise.all([
          api.listMembershipBenefits(selectedCustomerActiveMembership.planId, { status: "active" }),
          api.listMembershipBenefitUsages(customerId, filters),
        ])
      : [{ items: [] }, { items: [] }];

    if (String(getMembershipOperationCustomer()?.id) !== String(customerId)) {
      return;
    }

    selectedCustomerMembershipBenefits = benefitsResult.items || [];
    selectedCustomerMembershipUsages = usagesResult.items || [];
    if (openPanel) {
      renderOperationMembershipPanel();
    } else {
      hideMembershipOperationPanel();
      renderSelectedCustomer();
    }
  } catch (error) {
    selectedCustomerActiveMembership = null;
    selectedCustomerMembershipBenefits = [];
    selectedCustomerMembershipUsages = [];
    selectedCustomerMembershipTransactions = [];
    if (openPanel) {
      renderOperationMembershipError(error);
    } else {
      hideMembershipOperationPanel();
      renderSelectedCustomer();
    }
  } finally {
    if (openPanel) {
      setMembershipOperationLoading(false);
    }
  }
}

async function submitMembershipRenewal() {
  const operationCustomer = getMembershipOperationCustomer();
  if (!operationCustomer || !selectedCustomerActiveMembership) {
    showMembershipOperationError("Selecciona una membresia antes de renovar.");
    return;
  }

  clearMembershipOperationMessages();
  clearMembershipRenewalErrors();
  setMembershipRenewalSubmitting(true);

  const payload = {
    paymentMethod: elements.membershipRenewalPaymentMethodInput.value,
    amount: elements.membershipRenewalAmountInput.value,
    note: "Renovacion desde Web",
  };

  try {
    await api.renewCustomerMembership(operationCustomer.id, selectedCustomerActiveMembership.id, payload);
    clearMembershipRenewalForm();
    await loadOperationMembershipPanel();
    showMembershipOperationStatus("Membresia renovada.");
  } catch (error) {
    renderMembershipRenewalError(error);
  } finally {
    setMembershipRenewalSubmitting(false);
  }
}

async function submitMembershipBenefitUsage() {
  const operationCustomer = getMembershipOperationCustomer();
  if (!operationCustomer || !selectedCustomerActiveMembership || !pendingMembershipBenefitUsage) {
    showMembershipOperationError("Selecciona un beneficio antes de aplicar beneficio.");
    return;
  }

  clearMembershipOperationMessages();
  clearMembershipBenefitUsageErrors();
  setMembershipBenefitUsageSubmitting(true);

  const payload = {
    benefitId: elements.membershipBenefitUsageBenefitIdInput.value,
    customerMembershipId: selectedCustomerActiveMembership.id,
    usageDate: elements.membershipBenefitUsageDateInput.value,
    quantity: elements.membershipBenefitUsageQuantityInput.value || 1,
    note: elements.membershipBenefitUsageNoteInput.value.trim() || null,
  };

  try {
    const usage = await api.createMembershipBenefitUsage(operationCustomer.id, payload);
    clearMembershipBenefitUsageForm();
    await loadOperationMembershipPanel();
    showMembershipOperationStatus(`Beneficio aplicado: ${usage.benefitName || "beneficio"}.`);
  } catch (error) {
    renderMembershipBenefitUsageError(error);
  } finally {
    setMembershipBenefitUsageSubmitting(false);
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
    showReportError("Selecciona fecha desde y fecha hasta.");
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

async function loadMembershipFinancialReport() {
  const filters = {
    from: elements.membershipFinancialReportFromInput.value,
    to: elements.membershipFinancialReportToInput.value,
  };

  clearMembershipFinancialReportMessages();

  if (!filters.from || !filters.to) {
    showMembershipFinancialReportError("Selecciona fecha desde y fecha hasta.");
    return;
  }

  if (filters.from > filters.to) {
    showMembershipFinancialReportError("La fecha hasta debe ser igual o posterior a fecha desde.");
    return;
  }

  setMembershipFinancialReportSubmitting(true);
  renderMembershipFinancialReportLoading();

  try {
    const report = await api.getMembershipFinancialReport(filters);
    currentMembershipFinancialReport = report;
    renderMembershipFinancialReport(report);
  } catch (error) {
    currentMembershipFinancialReport = null;
    renderMembershipFinancialReportError(error);
  } finally {
    setMembershipFinancialReportSubmitting(false);
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
    showAuditError("Selecciona fecha desde y fecha hasta.");
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
  const stopLoading = startGlobalLoading("Estamos cargando la empresa...");

  try {
    const settings = await api.getCompanySettings();
    currentCompanySettings = settings;
    renderCompanySettings(settings);
    renderActiveCompanyIdentity(settings);
    updateMembershipNavigation(settings);
    if (activeSection === "memberships") {
      await loadMembershipPlans();
    }
  } catch (error) {
    currentCompanySettings = null;
    renderActiveCompanyIdentity(currentAuthIdentity?.company || null);
    updateMembershipNavigation(null);
    renderCompanySettingsError(error);
  } finally {
    stopLoading();
    setCompanyLoading(false);
  }
}

async function submitCompanySettings() {
  clearCompanyMessages();
  setCompanySubmitting(true);
  const stopLoading = startGlobalLoading("Estamos guardando los cambios...");

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
    updateMembershipNavigation(settings);
    showCompanyStatus("Datos de empresa actualizados.");
  } catch (error) {
    renderCompanySettingsError(error);
  } finally {
    stopLoading();
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
  const stopLoading = startGlobalLoading("Estamos guardando los cambios...");

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
    stopLoading();
    setCompanyLogoSubmitting(false);
  }
}

async function loadMembershipPlans() {
  if (!isMembershipsEnabled()) {
    return;
  }

  clearMembershipMessages();
  renderMembershipPlansLoading();
  setMembershipPlanSubmitting(true);

  try {
    const result = await api.listMembershipPlans({ status: "all" });
    membershipPlans = result.items || [];
    renderMembershipPlans();
    renderMembershipActivationPlanOptions();

    if (selectedMembershipPlanId && membershipPlans.some((plan) => String(plan.id) === String(selectedMembershipPlanId))) {
      await loadMembershipBenefits(selectedMembershipPlanId);
    } else {
      selectedMembershipPlanId = null;
      membershipBenefits = [];
      renderMembershipBenefitsPrompt();
    }
  } catch (error) {
    renderMembershipPlansError(error);
  } finally {
    setMembershipPlanSubmitting(false);
  }
}

async function loadMembershipExpirationAlerts() {
  if (!isMembershipsEnabled()) {
    return;
  }

  clearMembershipExpirationMessages();
  const withinDays = Number(elements.membershipExpirationWithinDaysInput.value || 5);

  if (!Number.isInteger(withinDays) || withinDays < 0 || withinDays > 365) {
    elements.membershipExpirationWithinDaysError.textContent = "Ingresa un valor de 0 a 365.";
    return;
  }

  renderMembershipExpirationLoading();
  setMembershipExpirationLoading(true);

  try {
    const [activeResult, expiredResult] = await Promise.all([
      api.listMembershipExpirationAlerts({ status: "active", withinDays }),
      api.listMembershipExpirationAlerts({ status: "expired", withinDays }),
    ]);
    membershipExpirationAlerts = {
      active: activeResult.items || [],
      expired: expiredResult.items || [],
    };
    renderMembershipExpirationAlerts();
    showMembershipExpirationStatus(
      `${formatReportNumber(membershipExpirationAlerts.active.length)} proximas, ${formatReportNumber(membershipExpirationAlerts.expired.length)} vencidas.`,
    );
  } catch (error) {
    membershipExpirationAlerts = { active: [], expired: [] };
    renderMembershipExpirationError(error);
  } finally {
    setMembershipExpirationLoading(false);
  }
}

async function selectMembershipPlan(planId, options = {}) {
  const plan = membershipPlans.find((item) => String(item.id) === String(planId));
  if (!plan) {
    return;
  }

  selectedMembershipPlanId = String(plan.id);
  renderMembershipPlans();
  closeMembershipBenefitForm();

  if (options.edit) {
    openMembershipPlanForm(plan);
  }

  await loadMembershipBenefits(plan.id);
}

async function loadMembershipBenefits(planId) {
  clearMembershipBenefitMessages();
  renderMembershipBenefitsLoading();
  setMembershipBenefitSubmitting(true);

  try {
    const result = await api.listMembershipBenefits(planId, { status: "all" });
    membershipBenefits = result.items || [];
    renderMembershipBenefits();
  } catch (error) {
    renderMembershipBenefitsError(error);
  } finally {
    setMembershipBenefitSubmitting(false);
  }
}

async function searchMembershipCustomers() {
  clearMembershipActivationMessages();
  const search = elements.membershipCustomerSearchInput.value.trim();

  if (!search) {
    showMembershipCustomerSearchError("Ingresa nombre, telefono o correo.");
    elements.membershipCustomerResults.innerHTML = '<div class="empty-state">Busca un cliente existente para pagar una membresia.</div>';
    return;
  }

  setMembershipActivationSubmitting(true, { searching: true });
  elements.membershipCustomerResults.innerHTML = '<div class="loading-state">Buscando clientes...</div>';

  try {
    const result = await api.searchCustomers(search);
    membershipCustomerResults = result.items || [];
    renderMembershipCustomerResults();
  } catch (error) {
    membershipCustomerResults = [];
    renderMembershipCustomerSearchError(error);
  } finally {
    setMembershipActivationSubmitting(false);
  }
}

async function selectMembershipCustomer(customerId) {
  const customer = membershipCustomerResults.find((item) => String(item.id) === String(customerId));
  if (!customer) {
    return;
  }

  selectedMembershipCustomer = customer;
  renderSelectedMembershipCustomer();
  await loadSelectedCustomerMemberships();
  await loadOperationMembershipPanel();
}

async function loadSelectedCustomerMemberships() {
  if (!selectedMembershipCustomer) {
    renderCustomerMembershipsPrompt();
    return;
  }

  clearMembershipCustomerMembershipMessages();
  elements.membershipCustomerMembershipsList.innerHTML = '<div class="loading-state">Cargando membresias...</div>';
  elements.reloadCustomerMembershipsButton.disabled = true;

  try {
    const result = await api.listCustomerMemberships(selectedMembershipCustomer.id, { status: "all" });
    selectedCustomerMemberships = result.items || [];
    renderCustomerMemberships();
  } catch (error) {
    selectedCustomerMemberships = [];
    renderCustomerMembershipsError(error);
  } finally {
    elements.reloadCustomerMembershipsButton.disabled = false;
  }
}

async function submitMembershipActivation() {
  clearMembershipActivationMessages();

  if (!selectedMembershipCustomer) {
    showMembershipActivationError("Selecciona un cliente antes de pagar la membresia.");
    return;
  }

  setMembershipActivationSubmitting(true);

  const payload = {
    planId: elements.membershipActivationPlanInput.value,
    startDate: elements.membershipActivationStartDateInput.value,
    pricePaid: elements.membershipActivationPricePaidInput.value,
    paymentMethod: elements.membershipActivationPaymentMethodInput.value,
  };

  try {
    await api.createCustomerMembership(selectedMembershipCustomer.id, payload);
    await loadSelectedCustomerMemberships();
    await loadOperationMembershipPanel();
    showMembershipOperationStatus("Membresia pagada.");
  } catch (error) {
    renderMembershipActivationError(error);
  } finally {
    setMembershipActivationSubmitting(false);
  }
}

async function submitMembershipPlan() {
  clearMembershipPlanMessages();
  setMembershipPlanSubmitting(true);

  const planId = elements.membershipPlanIdInput.value;
  const payload = {
    name: elements.membershipPlanNameInput.value,
    description: elements.membershipPlanDescriptionInput.value.trim() || null,
    durationDays: elements.membershipPlanDurationDaysInput.value,
    price: elements.membershipPlanPriceInput.value,
    renewalNoticeDays: elements.membershipPlanRenewalNoticeDaysInput.value || 5,
  };

  try {
    const saved = planId
      ? await api.updateMembershipPlan(planId, payload)
      : await api.createMembershipPlan(payload);
    await loadMembershipPlans();
    await selectMembershipPlan(saved.id, { edit: false });
    closeMembershipPlanForm();
    showMembershipPlansStatus(planId ? "Plan actualizado." : "Plan creado.");
  } catch (error) {
    renderMembershipPlanFormError(error);
  } finally {
    setMembershipPlanSubmitting(false);
  }
}

async function handleMembershipPlanAction(button) {
  const planId = button.dataset.membershipPlanId;
  const action = button.dataset.membershipPlanAction;

  if (action === "select") {
    await selectMembershipPlan(planId, { edit: false });
  } else if (action === "create") {
    openMembershipPlanForm();
  } else if (action === "retry") {
    await loadMembershipPlans();
  } else if (action === "edit") {
    await selectMembershipPlan(planId, { edit: true });
  } else if (action === "activate" || action === "deactivate") {
    clearMembershipMessages();
    setMembershipPlanSubmitting(true);
    try {
      if (action === "activate") {
        await api.activateMembershipPlan(planId);
      } else {
        await api.deactivateMembershipPlan(planId);
      }
      await loadMembershipPlans();
      await selectMembershipPlan(planId, { edit: false });
      showMembershipPlansStatus(action === "activate" ? "Plan activado." : "Plan inactivado.");
    } catch (error) {
      renderMembershipPlansError(error);
    } finally {
      setMembershipPlanSubmitting(false);
    }
  }
}

async function submitMembershipBenefit() {
  clearMembershipBenefitMessages();

  if (!selectedMembershipPlanId) {
    showMembershipBenefitsError("Selecciona un plan antes de crear beneficios.");
    return;
  }

  setMembershipBenefitSubmitting(true);

  const benefitId = elements.membershipBenefitIdInput.value;
  const payload = {
    name: elements.membershipBenefitNameInput.value,
    description: elements.membershipBenefitDescriptionInput.value.trim() || null,
    benefitType: elements.membershipBenefitTypeInput.value,
    appliesToType: elements.membershipBenefitAppliesToTypeInput.value,
    appliesToName: elements.membershipBenefitAppliesToNameInput.value.trim() || null,
    discountPercent: elements.membershipBenefitDiscountPercentInput.value || null,
    includedQuantity: elements.membershipBenefitIncludedQuantityInput.value || null,
    usageLimit: elements.membershipBenefitUsageLimitInput.value || null,
    usagePeriod: elements.membershipBenefitUsagePeriodInput.value,
  };

  try {
    if (benefitId) {
      await api.updateMembershipBenefit(benefitId, payload);
    } else {
      await api.createMembershipBenefit(selectedMembershipPlanId, payload);
    }
    await loadMembershipBenefits(selectedMembershipPlanId);
    closeMembershipBenefitForm();
    showMembershipBenefitsStatus(benefitId ? "Beneficio actualizado." : "Beneficio creado.");
  } catch (error) {
    renderMembershipBenefitFormError(error);
  } finally {
    setMembershipBenefitSubmitting(false);
  }
}

async function handleMembershipBenefitAction(button) {
  const benefitId = button.dataset.membershipBenefitId;
  const action = button.dataset.membershipBenefitAction;
  const benefit = membershipBenefits.find((item) => String(item.id) === String(benefitId));

  if (action === "create") {
    openMembershipBenefitForm();
    return;
  }

  if (action === "retry") {
    await loadMembershipBenefits(selectedMembershipPlanId);
    return;
  }

  if (!benefit) {
    return;
  }

  if (action === "edit") {
    openMembershipBenefitForm(benefit);
    return;
  }

  if (action === "activate" || action === "deactivate") {
    clearMembershipBenefitMessages();
    setMembershipBenefitSubmitting(true);
    try {
      await api.updateMembershipBenefit(benefitId, {
        ...benefit,
        status: action === "activate" ? "active" : "inactive",
      });
      await loadMembershipBenefits(selectedMembershipPlanId);
      showMembershipBenefitsStatus(action === "activate" ? "Beneficio activado." : "Beneficio inactivado.");
    } catch (error) {
      renderMembershipBenefitsError(error);
    } finally {
      setMembershipBenefitSubmitting(false);
    }
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
  const stopLoading = startGlobalLoading("Estamos enviando la solicitud...");

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
    stopLoading();
    setCompanyRegistrationSubmitting(false);
  }
}

async function submitAdminToken() {
  clearAdminMessages();
  const nextToken = elements.adminTokenInput.value.trim();

  if (!nextToken) {
    elements.adminTokenError.textContent = "Ingresa el token interno para cargar solicitudes.";
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
    elements.adminTokenError.textContent = "Ingresa el token interno para cargar solicitudes.";
    showAdminGlobalError("Ingresa el token interno para cargar solicitudes.");
    return;
  }

  setAdminLoading(true);
  renderAdminListLoading();
  const stopLoading = startGlobalLoading("Estamos cargando solicitudes...");

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
    stopLoading();
    setAdminLoading(false);
  }
}

async function approveSelectedAdminRequest() {
  if (!selectedAdminRequest || !adminToken) {
    showAdminDetailError("Selecciona una solicitud y confirma el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta solicitud ya fue procesada. Actualice la lista.");
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Aprobar solicitud",
    message: `Vas a aprobar la solicitud de ${selectedAdminRequest.companyName || "esta empresa"} y enviar una invitacion al correo ${selectedAdminRequest.companyEmail || "registrado"}.`,
    confirmLabel: "Aprobar y enviar",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "approve");
  const stopLoading = startGlobalLoading("Estamos aprobando la solicitud...");

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
    stopLoading();
    setAdminActionLoading(false);
  }
}

async function rejectSelectedAdminRequest() {
  if (!selectedAdminRequest || !adminToken) {
    showAdminDetailError("Selecciona una solicitud y confirma el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta solicitud ya fue procesada. Actualice la lista.");
    return;
  }

  const noteInput = elements.adminRequestDetail.querySelector("#admin-reject-note");
  const reviewNote = noteInput?.value.trim() || "";

  if (!reviewNote) {
    showAdminDetailError("Ingresa un motivo para rechazar la solicitud.");
    noteInput?.focus();
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Rechazar solicitud",
    message: "Vas a rechazar esta solicitud. El motivo quedara como referencia interna.",
    confirmLabel: "Rechazar",
    danger: true,
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "reject");
  const stopLoading = startGlobalLoading("Estamos rechazando la solicitud...");

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
    stopLoading();
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
  const stopLoading = startGlobalLoading("Estamos reenviando la invitacion...");

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
    stopLoading();
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
  const stopLoading = startGlobalLoading("Estamos creando tu acceso...");

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
    stopLoading();
    setCreateAccessSubmitting(false);
  }
}

async function submitCompanyLogin() {
  clearLoginMessages();
  setLoginSubmitting(true);
  const stopLoading = startGlobalLoading("Estamos iniciando sesion...");

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
    stopLoading();
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

    return identity;
  } catch (error) {
    currentAuthIdentity = null;
    renderSignedOut();

    if (!options.silent && error instanceof ApiError && error.code === "UNAUTHORIZED") {
      showLoginError("La sesion expiro. Inicie sesion de nuevo.");
    }

    return null;
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
    renderPointsMembershipContext();
    return;
  }

  const pointsEnabled = isPointsEnabled();
  const membershipsEnabled = isMembershipsEnabled();
  const points = getBalanceValue(selectedCustomer.balance);
  const membershipExpirationAlert = selectedCustomerActiveMembership?.expirationAlert;
  const canRedeem = pointsEnabled && points > 0;
  const membershipAction = getSelectedCustomerMembershipActionLabel();
  const alerts = [
    !selectedCustomer.email ? "Cliente sin correo." : "",
    pointsEnabled && points > 0 ? "Cliente tiene puntos disponibles." : "",
    membershipsEnabled && membershipExpirationAlert && membershipExpirationAlert.state !== "none"
      ? getExpirationAlertLabel(membershipExpirationAlert)
      : "",
  ].filter(Boolean);

  elements.selectedCustomerCard.hidden = false;
  elements.selectedCustomerCard.innerHTML = `
    <div class="customer-profile-main">
      <div>
        <span class="profile-kicker">Cliente</span>
        <h3>${escapeHtml(selectedCustomer.name)}</h3>
        <p>${escapeHtml(selectedCustomer.phone)} - ${escapeHtml(selectedCustomer.email || "Sin correo")}</p>
      </div>
      <div class="profile-summary-grid">
        ${
          pointsEnabled
            ? `<div class="points-badge strong">
                <span>Puntos actuales</span>
                <strong>${formatBalance(selectedCustomer.balance)}</strong>
              </div>`
            : ""
        }
        ${
          membershipsEnabled
            ? `<div class="points-badge strong">
                <span>Membresia</span>
                <strong>${selectedCustomerActiveMembership ? escapeHtml(getCustomerMembershipStatusLabel(selectedCustomerActiveMembership.status)) : "Sin activa"}</strong>
              </div>`
            : ""
        }
      </div>
    </div>
    ${
      alerts.length
        ? `<div class="profile-alerts">${alerts.map((alert) => `<span>${escapeHtml(alert)}</span>`).join("")}</div>`
        : ""
    }
    <div class="profile-actions">
      ${
        pointsEnabled
          ? `<button type="button" data-icon="+" data-profile-action="purchase">Registrar compra</button>
             <button class="secondary-button" type="button" data-icon="⌕" data-profile-action="history">Ver historial</button>
             ${canRedeem ? '<button class="secondary-button" type="button" data-icon="★" data-profile-action="redemption">Redimir puntos</button>' : ""}`
          : ""
      }
      ${
        membershipsEnabled
          ? `<button class="secondary-button" type="button" data-icon="★" data-profile-membership-action="payment">${membershipAction}</button>`
          : ""
      }
    </div>
  `;
  renderPointsMembershipContext();
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
  const title = isPurchase ? "Compra" : "Puntos redimidos";
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
      : "No pudimos cargar el historial. Intenta de nuevo.";
  elements.historySummary.innerHTML = "";
  elements.historyList.innerHTML = "";
  elements.historyError.hidden = false;
  elements.historyError.textContent = message;
}

function renderOperationMembershipLoading() {
  elements.membershipOperationActive.innerHTML = '<div class="loading-state">Cargando membresia...</div>';
  elements.membershipOperationBenefits.innerHTML = "";
  elements.membershipOperationUsages.innerHTML = "";
  elements.membershipOperationTransactions.innerHTML = "";
}

function renderOperationMembershipDisabled() {
  elements.membershipOperationActive.innerHTML = '<div class="empty-state">Membresias no esta habilitado para esta empresa.</div>';
  elements.membershipOperationBenefits.innerHTML = "";
  elements.membershipOperationUsages.innerHTML = "";
  elements.membershipOperationTransactions.innerHTML = "";
}

function renderOperationMembershipPanel() {
  if (!selectedCustomerActiveMembership) {
    if (!selectedCustomer) {
      resetOperationMembershipState();
      return;
    }

    elements.membershipOperationPanel.hidden = false;
    elements.membershipPaymentHost.hidden = false;
    elements.membershipActivationForm.hidden = false;
    elements.membershipOperationActive.innerHTML = "";
    elements.membershipOperationBenefits.innerHTML = "";
    elements.membershipOperationUsages.innerHTML = "";
    elements.membershipOperationTransactions.innerHTML = "";
    renderSelectedCustomer();
    return;
  }

  elements.membershipOperationPanel.hidden = false;
  elements.membershipPaymentHost.hidden = true;
  elements.membershipActivationForm.hidden = true;
  const alert = selectedCustomerActiveMembership.expirationAlert || {};
  const canRenew = isMembershipRenewable(selectedCustomerActiveMembership);
  const canUseBenefits = isMembershipCurrentlyUsable(selectedCustomerActiveMembership);
  elements.membershipOperationActive.innerHTML = `
    <article class="membership-card membership-operation-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(selectedCustomerActiveMembership.planName || selectedCustomerActiveMembership.plan?.name || "Membresia")}</h3>
          <span class="status-pill">${getCustomerMembershipStatusLabel(selectedCustomerActiveMembership.status)}</span>
        </div>
        <p>${escapeHtml(getExpirationAlertLabel(alert))}</p>
        <div class="membership-meta">
          <span>Inicio ${formatDate(selectedCustomerActiveMembership.startDate)}</span>
          <span>Vence ${formatDate(selectedCustomerActiveMembership.endDate)}</span>
        </div>
      </div>
      ${
        canRenew
          ? `<div class="membership-actions">
              <button class="secondary-button" type="button" data-icon="↻" data-membership-renew-action="open">Renovar membresia</button>
            </div>`
          : ""
      }
    </article>
  `;

  if (canUseBenefits) {
    renderOperationMembershipBenefits();
  } else {
    elements.membershipOperationBenefits.innerHTML = '<div class="empty-state">Renueva la membresia antes de aplicar beneficios.</div>';
  }
  renderOperationMembershipUsages();
  renderOperationMembershipTransactions();
  renderSelectedCustomer();
}

function renderOperationMembershipBenefits() {
  if (!selectedCustomerMembershipBenefits.length) {
    elements.membershipOperationBenefits.innerHTML = '<div class="empty-state">El plan activo no tiene beneficios disponibles.</div>';
    return;
  }

  elements.membershipOperationBenefits.innerHTML = selectedCustomerMembershipBenefits
    .map((benefit) => `
      <article class="membership-card membership-operation-benefit" data-membership-benefit-usage-card>
        <div>
          <div class="membership-card-title">
            <h3>${escapeHtml(benefit.name)}</h3>
            <span class="status-pill">${getBenefitTypeLabel(benefit.benefitType)}</span>
          </div>
          <p>${escapeHtml(benefit.description || getMembershipBenefitSummary(benefit))}</p>
          <div class="membership-meta">
            <span>${escapeHtml(benefit.appliesToName || getAppliesToTypeLabel(benefit.appliesToType))}</span>
            <span>${escapeHtml(getUsagePeriodLabel(benefit.usagePeriod))}</span>
            ${benefit.usageLimit ? `<span>Limite ${formatReportNumber(benefit.usageLimit)}</span>` : "<span>Sin limite</span>"}
          </div>
        </div>
        <div class="membership-actions">
          <button class="secondary-button" type="button" data-icon="★" data-membership-usage-benefit-id="${escapeHtml(benefit.id)}">Aplicar beneficio</button>
        </div>
      </article>
    `)
    .join("");
}

function renderOperationMembershipUsages() {
  if (!selectedCustomerMembershipUsages.length) {
    elements.membershipOperationUsages.innerHTML = '<div class="empty-state">Sin usos recientes de beneficios.</div>';
    return;
  }

  elements.membershipOperationUsages.innerHTML = selectedCustomerMembershipUsages
    .slice(0, 8)
    .map((usage) => `
      <article class="history-row membership-usage-row">
        <div>
          <h3>${escapeHtml(usage.benefitName || "Beneficio")}</h3>
          <p>${formatDate(usage.usageDate)} - ${escapeHtml(usage.note || usage.planName || "Uso registrado")}</p>
        </div>
        <strong class="history-points">x${formatReportNumber(usage.quantity)}</strong>
      </article>
    `)
    .join("");
}

function renderOperationMembershipTransactions() {
  if (!selectedCustomerMembershipTransactions.length) {
    elements.membershipOperationTransactions.innerHTML = "";
    return;
  }

  const header = '<h3 class="section-subtitle">Transacciones de membresia</h3>';
  elements.membershipOperationTransactions.innerHTML = `
    ${header}
    ${selectedCustomerMembershipTransactions
      .slice(0, 8)
      .map((transaction) => `
        <article class="history-row membership-transaction-row">
          <div>
            <h3>${escapeHtml(getMembershipTransactionTypeLabel(transaction.transactionType))}</h3>
            <p>${formatDate(transaction.transactionDate)} - ${escapeHtml(getPaymentMethodLabel(transaction.paymentMethod))}</p>
            <p>${escapeHtml(transaction.planName || transaction.note || "Membresia")}</p>
          </div>
          <strong class="history-points">${formatMoney(transaction.amount)}</strong>
        </article>
      `)
      .join("")}
  `;
}

function openMembershipRenewalForm() {
  if (!selectedCustomerActiveMembership || !isMembershipRenewable(selectedCustomerActiveMembership)) {
    return;
  }

  clearMembershipOperationMessages();
  clearMembershipRenewalErrors();
  const price = selectedCustomerActiveMembership.pricePaid ?? selectedCustomerActiveMembership.plan?.price ?? "";
  elements.membershipRenewalAmountInput.value = price === "" || price == null ? "" : Number(price);
  elements.membershipRenewalPaymentMethodInput.value = "";
  elements.membershipRenewalForm.hidden = false;
  elements.membershipRenewalPaymentMethodInput.focus();
}

function openMembershipBenefitUsageConfirmation(benefitId) {
  const benefit = selectedCustomerMembershipBenefits.find((item) => String(item.id) === String(benefitId));
  if (!benefit || !selectedCustomerActiveMembership) {
    return;
  }

  clearMembershipOperationMessages();
  clearMembershipBenefitUsageErrors();
  pendingMembershipBenefitUsage = benefit;
  elements.membershipBenefitUsageBenefitIdInput.value = benefit.id;
  elements.membershipBenefitUsageDateInput.value = getToday();
  elements.membershipBenefitUsageQuantityInput.value = "1";
  elements.membershipBenefitUsageNoteInput.value = "";
  elements.membershipBenefitUsageSummary.innerHTML = `
    <div><strong>${escapeHtml(benefit.name)}</strong></div>
    <div>${escapeHtml(getMembershipBenefitSummary(benefit))}</div>
    <div>Plan: ${escapeHtml(selectedCustomerActiveMembership.planName || "Membresia activa")}</div>
  `;
  elements.membershipBenefitUsageForm.hidden = false;
  elements.membershipBenefitUsageDateInput.focus();
}

function renderOperationMembershipError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No pudimos cargar la membresia activa del cliente.";
  elements.membershipOperationActive.innerHTML = '<div class="empty-state">Membresia no disponible.</div>';
  elements.membershipOperationBenefits.innerHTML = "";
  elements.membershipOperationUsages.innerHTML = "";
  elements.membershipOperationTransactions.innerHTML = "";
  showMembershipOperationError(message);
}

function renderReportPrompt() {
  currentReport = null;
  elements.reportSummary.hidden = true;
  elements.reportSummary.innerHTML = "";
  elements.reportTableWrap.hidden = true;
  elements.reportTableBody.innerHTML = "";
  elements.reportEmpty.hidden = false;
  elements.reportEmpty.textContent = "Selecciona un rango de fechas para ver la actividad.";
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
      <span>Puntos ganados</span>
      <strong>${formatReportNumber(summary.pointsEarnedTotal)}</strong>
    </div>
    <div>
      <span>Puntos redimidos</span>
      <strong>${formatReportNumber(summary.redemptionCount)}</strong>
    </div>
    <div>
      <span>Membresias</span>
      <strong>${formatReportNumber(summary.membershipCount)}</strong>
    </div>
    <div>
      <span>Total redimido</span>
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
      <td>${getReportTypeLabel(item.type, item)}</td>
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

  if (item.type === "membership") {
    const amount = Number.isFinite(Number(item.amount)) ? `<span>${formatMoney(item.amount)}</span>` : "";
    return `${escapeHtml(item.note || "Evento de membresia")}${amount}`;
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
    showReportError("Revisa el rango de fechas y el tipo de reporte.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showReportError(getAuthRequiredMessage());
    return;
  }

  showReportError("No pudimos cargar el reporte. Intenta de nuevo.");
}

function renderMembershipFinancialReportPrompt() {
  currentMembershipFinancialReport = null;
  elements.membershipFinancialReportSummary.hidden = true;
  elements.membershipFinancialReportSummary.innerHTML = "";
  elements.membershipFinancialPaymentSummary.hidden = true;
  elements.membershipFinancialPaymentSummary.innerHTML = "";
  elements.membershipFinancialReportTableWrap.hidden = true;
  elements.membershipFinancialReportTableBody.innerHTML = "";
  elements.membershipFinancialReportEmpty.hidden = false;
  elements.membershipFinancialReportEmpty.textContent = "Selecciona un rango de fechas para ver ventas y renovaciones.";
  elements.exportMembershipFinancialReportButton.disabled = true;
}

function renderMembershipFinancialReportLoading() {
  elements.membershipFinancialReportSummary.hidden = true;
  elements.membershipFinancialPaymentSummary.hidden = true;
  elements.membershipFinancialReportTableWrap.hidden = true;
  elements.membershipFinancialReportEmpty.hidden = false;
  elements.membershipFinancialReportEmpty.textContent = "Cargando reporte de membresias...";
  elements.exportMembershipFinancialReportButton.disabled = true;
}

function renderMembershipFinancialReport(report) {
  const items = Array.isArray(report.items) ? report.items : [];
  const summary = report.summary || {};

  elements.membershipFinancialReportSummary.hidden = false;
  elements.membershipFinancialReportSummary.innerHTML = `
    <div>
      <span>Membresias nuevas</span>
      <strong>${formatReportNumber(summary.newMembershipCount)}</strong>
    </div>
    <div>
      <span>Monto nuevas</span>
      <strong>${formatMoney(summary.newMembershipAmount)}</strong>
    </div>
    <div>
      <span>Renovaciones</span>
      <strong>${formatReportNumber(summary.renewalCount)}</strong>
    </div>
    <div>
      <span>Monto renovaciones</span>
      <strong>${formatMoney(summary.renewalAmount)}</strong>
    </div>
  `;

  const paymentMethods = Object.values(summary.paymentMethods || {});
  elements.membershipFinancialPaymentSummary.hidden = false;
  elements.membershipFinancialPaymentSummary.innerHTML = `
    <div>
      <span>Monto por metodo de pago</span>
      <strong>${paymentMethods.length ? formatReportNumber(paymentMethods.length) : "0"}</strong>
    </div>
    ${paymentMethods
      .map((item) => `
        <div>
          <span>${escapeHtml(getPaymentMethodLabel(item.paymentMethod))} (${formatReportNumber(item.count)})</span>
          <strong>${formatMoney(item.amount)}</strong>
        </div>
      `)
      .join("")}
  `;

  if (!items.length) {
    elements.membershipFinancialReportEmpty.hidden = false;
    elements.membershipFinancialReportEmpty.textContent = "Sin transacciones de membresia para el rango seleccionado.";
    elements.membershipFinancialReportTableWrap.hidden = true;
    elements.membershipFinancialReportTableBody.innerHTML = "";
    elements.exportMembershipFinancialReportButton.disabled = true;
    return;
  }

  elements.membershipFinancialReportEmpty.hidden = true;
  elements.membershipFinancialReportTableWrap.hidden = false;
  elements.membershipFinancialReportTableBody.innerHTML = items.map(renderMembershipFinancialReportRow).join("");
  elements.exportMembershipFinancialReportButton.disabled = false;
  showMembershipFinancialReportStatus(`Reporte de membresias cargado: ${formatReportNumber(items.length)} transacciones.`);
}

function renderMembershipFinancialReportRow(item) {
  return `
    <tr>
      <td>${formatDateTime(item.createdAt || item.transactionDate)}</td>
      <td>
        <strong>${escapeHtml(item.customerName || "Cliente sin nombre")}</strong>
        <span>${escapeHtml(item.customerPhone || item.customerEmail || "Sin contacto")}</span>
      </td>
      <td>${escapeHtml(item.planName || "Membresia")}</td>
      <td>${escapeHtml(getMembershipTransactionTypeLabel(item.transactionType))}</td>
      <td>${escapeHtml(getPaymentMethodLabel(item.paymentMethod))}</td>
      <td>${formatMoney(item.amount)}</td>
    </tr>
  `;
}

function renderMembershipFinancialReportError(error) {
  elements.membershipFinancialReportSummary.hidden = true;
  elements.membershipFinancialPaymentSummary.hidden = true;
  elements.membershipFinancialReportTableWrap.hidden = true;
  elements.membershipFinancialReportTableBody.innerHTML = "";
  elements.membershipFinancialReportEmpty.hidden = false;
  elements.membershipFinancialReportEmpty.textContent = "No hay reporte de membresias cargado.";
  elements.exportMembershipFinancialReportButton.disabled = true;

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showMembershipFinancialReportError("Revisa el rango de fechas.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showMembershipFinancialReportError(getAuthRequiredMessage());
    return;
  }

  showMembershipFinancialReportError("No pudimos cargar el reporte de membresias.");
}

function renderAuditPrompt() {
  elements.auditTableWrap.hidden = true;
  elements.auditTableBody.innerHTML = "";
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent = "Selecciona un rango de fechas para ver eventos recientes.";
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
    showAuditError("Revisa el rango de fechas y el limite de eventos.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showAuditError(getAuthRequiredMessage());
    return;
  }

  showAuditError(
    "No pudimos consultar auditoria. Revisa el rango e intenta de nuevo despues del deploy.",
  );
}

function updateMembershipNavigation(settings) {
  const membershipsEnabled = Boolean(settings?.loyaltyMembershipsEnabled);
  const pointsEnabled = settings ? Boolean(settings.loyaltyPointsEnabled) : true;
  elements.pointsNavButton.hidden = !pointsEnabled && !membershipsEnabled;
  elements.membershipsNavButton.hidden = true;

  if (!membershipsEnabled) {
    membershipPlans = [];
    membershipBenefits = [];
    membershipCustomerResults = [];
    selectedMembershipCustomer = null;
    selectedCustomerMemberships = [];
    selectedMembershipPlanId = null;
    renderMembershipDisabled();
    resetOperationMembershipState();
    renderMembershipPointsContext();

  }

  if (activeSection === "memberships" || (activeSection === "operations" && !pointsEnabled && !membershipsEnabled)) {
    setActiveSection(getDefaultLoyaltySection(), { focus: false });
  }
}

function isMembershipsEnabled() {
  return Boolean(currentCompanySettings?.loyaltyMembershipsEnabled);
}

function isPointsEnabled() {
  return currentCompanySettings ? Boolean(currentCompanySettings.loyaltyPointsEnabled) : true;
}

function getDefaultLoyaltySection() {
  if (isPointsEnabled() || isMembershipsEnabled()) {
    return "operations";
  }

  return "company";
}

function renderMembershipDisabled() {
  elements.membershipPlansList.innerHTML = '<div class="empty-state">Membresias no esta habilitado para esta empresa.</div>';
  elements.membershipBenefitsContext.textContent = "Habilita membresias para configurar beneficios.";
  elements.membershipBenefitsList.innerHTML = '<div class="empty-state">Selecciona un plan para gestionar sus beneficios.</div>';
  elements.membershipCustomerResults.innerHTML = '<div class="empty-state">Membresias no esta habilitado para esta empresa.</div>';
  elements.membershipCustomerMembershipsList.innerHTML = '<div class="empty-state">Selecciona un cliente para ver sus membresias.</div>';
  elements.membershipExpiringList.innerHTML = '<div class="empty-state">Membresias no esta habilitado para esta empresa.</div>';
  elements.membershipExpiredList.innerHTML = '<div class="empty-state">Membresias no esta habilitado para esta empresa.</div>';
  membershipExpirationAlerts = { active: [], expired: [] };
  renderMembershipActivationPlanOptions();
}

function renderMembershipExpirationLoading() {
  elements.membershipExpiringList.innerHTML = '<div class="loading-state">Cargando proximas a vencer...</div>';
  elements.membershipExpiredList.innerHTML = '<div class="loading-state">Cargando vencidas...</div>';
}

function renderMembershipExpirationAlerts() {
  const activeItems = membershipExpirationAlerts.active || [];
  const expiredItems = membershipExpirationAlerts.expired || [];

  elements.membershipExpiringList.innerHTML = activeItems.length
    ? activeItems.map(renderMembershipExpirationCard).join("")
    : '<div class="empty-state">No hay membresias proximas a vencer para este periodo.</div>';
  elements.membershipExpiredList.innerHTML = expiredItems.length
    ? expiredItems.map(renderMembershipExpirationCard).join("")
    : '<div class="empty-state">No hay membresias vencidas para este periodo.</div>';
}

function renderMembershipExpirationCard(item) {
  return `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(item.customerName || "Cliente sin nombre")}</h3>
          <span class="status-pill">${escapeHtml(getMembershipExpirationStateLabel(item))}</span>
        </div>
        <p>${escapeHtml(item.planName || "Membresia")}</p>
        <div class="membership-meta">
          <span>Inicio ${formatDate(item.startDate)}</span>
          <span>Vence ${formatDate(item.endDate)}</span>
          <span>${escapeHtml(item.customerPhone || item.customerEmail || "Sin contacto")}</span>
        </div>
      </div>
    </article>
  `;
}

function renderMembershipExpirationError(error) {
  elements.membershipExpiringList.innerHTML = "";
  elements.membershipExpiredList.innerHTML = "";

  if (isAuthRequiredError(error)) {
    showMembershipExpirationError(getAuthRequiredMessage());
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showMembershipExpirationError("Revisa los dias antes de vencer.");
    return;
  }

  showMembershipExpirationError("No pudimos cargar las alertas de membresias.");
}

function renderMembershipPlansLoading() {
  elements.membershipPlansList.innerHTML = '<div class="loading-state">Cargando planes de membresia...</div>';
}

function renderMembershipPlans() {
  if (!membershipPlans.length) {
    elements.membershipPlansList.innerHTML = renderMembershipEmptyState({
      title: "No existen planes de membresia",
      text: "Crea un plan para empezar a ofrecer beneficios a tus clientes.",
      action: "Crear plan",
      actionAttribute: "data-membership-plan-action=\"create\"",
    });
    renderMembershipActivationPlanOptions();
    return;
  }

  elements.membershipPlansList.innerHTML = membershipPlans.map(renderMembershipPlanCard).join("");
  renderMembershipActivationPlanOptions();
}

function renderMembershipActivationPlanOptions() {
  const activePlans = membershipPlans.filter((plan) => plan.status === "active");

  if (!activePlans.length) {
    elements.membershipActivationPlanInput.innerHTML = '<option value="">Sin planes activos</option>';
    elements.membershipActivationPricePaidInput.value = "";
    renderMembershipActivationPreview();
    return;
  }

  const currentValue = elements.membershipActivationPlanInput.value;
  elements.membershipActivationPlanInput.innerHTML = activePlans
    .map((plan) => `<option value="${escapeHtml(plan.id)}">${escapeHtml(plan.name)}</option>`)
    .join("");

  if (currentValue && activePlans.some((plan) => String(plan.id) === String(currentValue))) {
    elements.membershipActivationPlanInput.value = currentValue;
  }

  syncMembershipActivationPlanFields();
}

function syncMembershipActivationPlanFields() {
  const plan = getSelectedActivationPlan();
  if (plan && !elements.membershipActivationPricePaidInput.value) {
    elements.membershipActivationPricePaidInput.value = plan.price ?? "";
  }
  renderMembershipActivationPreview();
}

function renderMembershipCustomerResults() {
  if (!membershipCustomerResults.length) {
    elements.membershipCustomerResults.innerHTML = '<div class="empty-state">No encontramos clientes con esa busqueda. Puedes registrarlo desde Atender cliente.</div>';
    return;
  }

  elements.membershipCustomerResults.innerHTML = membershipCustomerResults.map((customer) => `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(customer.name)}</h3>
        </div>
        <div class="membership-meta">
          <span>${escapeHtml(customer.phone || "Sin telefono")}</span>
          <span>${escapeHtml(customer.email || "Sin correo")}</span>
        </div>
      </div>
      <div class="membership-actions">
        <button class="secondary-button" type="button" data-icon="→" data-membership-customer-id="${escapeHtml(customer.id)}">Seleccionar</button>
      </div>
    </article>
  `).join("");
}

function renderSelectedMembershipCustomer() {
  if (!selectedMembershipCustomer) {
    elements.membershipSelectedCustomer.hidden = true;
    elements.membershipSelectedCustomer.innerHTML = "";
    renderMembershipPointsContext();
    return;
  }

  elements.membershipSelectedCustomer.hidden = false;
  elements.membershipSelectedCustomer.innerHTML = `
    <div>
      <span>Cliente seleccionado</span>
      <strong>${escapeHtml(selectedMembershipCustomer.name)}</strong>
      <small>${escapeHtml(selectedMembershipCustomer.phone || selectedMembershipCustomer.email || "")}</small>
    </div>
  `;
  renderMembershipPointsContext();
}

function renderPointsMembershipContext() {
  if (!elements.pointsMembershipContext) {
    return;
  }

  elements.pointsMembershipContext.innerHTML = `
    <div></div>
  `;
  elements.pointsMembershipContext.hidden = true;
}

function renderMembershipPointsContext() {
  if (!elements.membershipPointsContext) {
    return;
  }

  elements.membershipPointsContext.innerHTML = `
    <div></div>
  `;
  elements.membershipPointsContext.hidden = true;
}

function renderMembershipActivationPreview() {
  const plan = getSelectedActivationPlan();
  const startDate = elements.membershipActivationStartDateInput.value;

  if (!plan) {
    elements.membershipActivationPreview.innerHTML = "Selecciona un plan activo.";
    return;
  }

  const expectedEndDate = startDate ? calculateExpectedMembershipEndDate(startDate, plan.durationDays) : null;
  elements.membershipActivationPreview.innerHTML = `
    <div><strong>${escapeHtml(plan.name)}</strong></div>
    <div>Duracion: ${formatReportNumber(plan.durationDays)} dias</div>
    <div>Precio: ${formatMoney(elements.membershipActivationPricePaidInput.value || plan.price)}</div>
    <div>Vence: ${expectedEndDate ? formatDate(expectedEndDate) : "Selecciona fecha de inicio"}</div>
  `;
}

function renderCustomerMembershipsPrompt() {
  elements.membershipCustomerMembershipsList.innerHTML = '<div class="empty-state">Selecciona un cliente para ver sus membresias.</div>';
}

function renderCustomerMemberships() {
  if (!selectedCustomerMemberships.length) {
    elements.membershipCustomerMembershipsList.innerHTML = '<div class="empty-state">Este cliente no tiene una membresia activa. Puedes pagar una membresia para activar sus beneficios.</div>';
    return;
  }

  elements.membershipCustomerMembershipsList.innerHTML = selectedCustomerMemberships.map(renderCustomerMembershipCard).join("");
}

function renderCustomerMembershipCard(membership) {
  const alert = membership.expirationAlert || {};
  const alertLabel = getExpirationAlertLabel(alert);

  return `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(membership.planName || membership.plan?.name || "Membresia")}</h3>
          <span class="status-pill">${getCustomerMembershipStatusLabel(membership.status)}</span>
        </div>
        <p>${escapeHtml(alertLabel)}</p>
        <div class="membership-meta">
          <span>Inicio ${formatDate(membership.startDate)}</span>
          <span>Vence ${formatDate(membership.endDate)}</span>
          <span>${formatMoney(membership.pricePaid)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderMembershipPlanCard(plan) {
  const isSelected = String(plan.id) === String(selectedMembershipPlanId);
  const statusAction = plan.status === "active" ? "deactivate" : "activate";
  const statusLabel = plan.status === "active" ? "Inactivar" : "Activar";

  return `
    <article class="membership-card ${isSelected ? "is-selected" : ""}">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(plan.name)}</h3>
          <span class="status-pill">${getMembershipStatusLabel(plan.status)}</span>
        </div>
        <p>${escapeHtml(plan.description || "Sin descripcion")}</p>
        <div class="membership-meta">
          <span>${formatReportNumber(plan.durationDays)} dias</span>
          <span>${formatMoney(plan.price)}</span>
          <span>${formatReportNumber(plan.benefitCount || 0)} beneficios</span>
        </div>
      </div>
      <div class="membership-actions">
        <button class="secondary-button" type="button" data-membership-plan-action="select" data-membership-plan-id="${escapeHtml(plan.id)}">Gestionar beneficios</button>
        <button class="secondary-button" type="button" data-membership-plan-action="edit" data-membership-plan-id="${escapeHtml(plan.id)}">Editar</button>
        <button class="secondary-button" type="button" data-membership-plan-action="${statusAction}" data-membership-plan-id="${escapeHtml(plan.id)}">${statusLabel}</button>
      </div>
    </article>
  `;
}

function renderMembershipBenefitsPrompt() {
  elements.membershipBenefitsContext.textContent = "Selecciona un plan para ver o crear sus beneficios.";
  elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
    title: "Selecciona un plan",
    text: "Elige un plan de membresia para ver o crear sus beneficios.",
  });
}

function renderMembershipBenefitsLoading() {
  elements.membershipBenefitsList.innerHTML = '<div class="loading-state">Cargando beneficios...</div>';
}

function renderMembershipBenefits() {
  const plan = membershipPlans.find((item) => String(item.id) === String(selectedMembershipPlanId));
  elements.membershipBenefitsContext.textContent = plan
    ? `Beneficios de ${plan.name}`
    : "Selecciona un plan para ver o crear sus beneficios.";

  if (!membershipBenefits.length) {
    elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
      title: "Este plan aun no tiene beneficios",
      text: "Agrega beneficios para explicar que incluye la membresia y controlar usos limitados.",
      action: "Crear beneficio",
      actionAttribute: "data-membership-benefit-action=\"create\"",
    });
    return;
  }

  elements.membershipBenefitsList.innerHTML = membershipBenefits.map(renderMembershipBenefitCard).join("");
}

function renderMembershipBenefitCard(benefit) {
  const statusAction = benefit.status === "active" ? "deactivate" : "activate";
  const statusLabel = benefit.status === "active" ? "Inactivar" : "Activar";

  return `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(benefit.name)}</h3>
          <span class="status-pill">${getMembershipStatusLabel(benefit.status)}</span>
        </div>
        <p>${escapeHtml(benefit.description || getMembershipBenefitSummary(benefit))}</p>
        <div class="membership-meta">
          <span>${getBenefitTypeLabel(benefit.benefitType)}</span>
          <span>${escapeHtml(benefit.appliesToName || getAppliesToTypeLabel(benefit.appliesToType))}</span>
          <span>${escapeHtml(getUsagePeriodLabel(benefit.usagePeriod))}</span>
        </div>
      </div>
      <div class="membership-actions">
        <button class="secondary-button" type="button" data-membership-benefit-action="edit" data-membership-benefit-id="${escapeHtml(benefit.id)}">Editar</button>
        <button class="secondary-button" type="button" data-membership-benefit-action="${statusAction}" data-membership-benefit-id="${escapeHtml(benefit.id)}">${statusLabel}</button>
      </div>
    </article>
  `;
}

function renderMembershipEmptyState({ title, text, action = "", actionAttribute = "" }) {
  const actionButton = action && actionAttribute
    ? `<button class="secondary-button" type="button" ${actionAttribute}>${escapeHtml(action)}</button>`
    : "";

  return `
    <div class="empty-state membership-empty-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text)}</span>
      ${actionButton}
    </div>
  `;
}

function fillMembershipPlanForm(plan) {
  elements.membershipPlanForm.hidden = false;
  elements.membershipPlanIdInput.value = plan.id;
  elements.membershipPlanNameInput.value = plan.name || "";
  elements.membershipPlanDescriptionInput.value = plan.description || "";
  elements.membershipPlanDurationDaysInput.value = plan.durationDays ?? "";
  elements.membershipPlanPriceInput.value = plan.price ?? "";
  elements.membershipPlanRenewalNoticeDaysInput.value = plan.renewalNoticeDays ?? 5;
  elements.saveMembershipPlanButton.textContent = "Guardar cambios";
}

function openMembershipPlanForm(plan = null, options = {}) {
  if (plan) {
    fillMembershipPlanForm(plan);
  } else {
    clearMembershipPlanForm({ focus: false });
    elements.membershipPlanForm.hidden = false;
    elements.saveMembershipPlanButton.textContent = "Guardar plan";
  }

  if (options.focus !== false) {
    elements.membershipPlanNameInput.focus();
  }
}

function closeMembershipPlanForm() {
  clearMembershipPlanForm({ focus: false });
  elements.membershipPlanForm.hidden = true;
}

function clearMembershipPlanForm(options = {}) {
  elements.membershipPlanForm.reset();
  elements.membershipPlanIdInput.value = "";
  elements.membershipPlanRenewalNoticeDaysInput.value = "5";
  elements.saveMembershipPlanButton.textContent = "Guardar plan";
  clearMembershipPlanMessages();

  if (options.focus !== false) {
    elements.membershipPlanNameInput.focus();
  }
}

function fillMembershipBenefitForm(benefit) {
  elements.membershipBenefitForm.hidden = false;
  elements.membershipBenefitIdInput.value = benefit.id;
  elements.membershipBenefitNameInput.value = benefit.name || "";
  elements.membershipBenefitDescriptionInput.value = benefit.description || "";
  elements.membershipBenefitTypeInput.value = benefit.benefitType || "informational";
  elements.membershipBenefitAppliesToTypeInput.value = benefit.appliesToType || "text";
  elements.membershipBenefitAppliesToNameInput.value = benefit.appliesToName || "";
  elements.membershipBenefitDiscountPercentInput.value = benefit.discountPercent ?? "";
  elements.membershipBenefitIncludedQuantityInput.value = benefit.includedQuantity ?? "";
  elements.membershipBenefitUsageLimitInput.value = benefit.usageLimit ?? "";
  elements.membershipBenefitUsagePeriodInput.value = benefit.usagePeriod || "none";
  elements.saveMembershipBenefitButton.textContent = "Guardar cambios";
}

function openMembershipBenefitForm(benefit = null, options = {}) {
  if (!selectedMembershipPlanId) {
    showMembershipBenefitsError("Selecciona un plan antes de crear beneficios.");
    return;
  }

  if (benefit) {
    fillMembershipBenefitForm(benefit);
  } else {
    clearMembershipBenefitForm({ focus: false });
    elements.membershipBenefitForm.hidden = false;
    elements.saveMembershipBenefitButton.textContent = "Guardar beneficio";
  }

  if (options.focus !== false) {
    elements.membershipBenefitNameInput.focus();
  }
}

function closeMembershipBenefitForm() {
  clearMembershipBenefitForm({ focus: false });
  elements.membershipBenefitForm.hidden = true;
}

function clearMembershipBenefitForm(options = {}) {
  elements.membershipBenefitForm.reset();
  elements.membershipBenefitIdInput.value = "";
  elements.membershipBenefitTypeInput.value = "informational";
  elements.membershipBenefitAppliesToTypeInput.value = "text";
  elements.membershipBenefitUsagePeriodInput.value = "none";
  elements.saveMembershipBenefitButton.textContent = "Guardar beneficio";
  clearMembershipBenefitMessages();

  if (options.focus !== false) {
    elements.membershipBenefitNameInput.focus();
  }
}

function renderMembershipPlansError(error) {
  const message = isAuthRequiredError(error) ? getAuthRequiredMessage() : "No se pudieron cargar los planes.";
  elements.membershipPlansList.innerHTML = renderMembershipEmptyState({
    title: "No se pudieron cargar los planes",
    text: "Intenta de nuevo para continuar configurando membresias.",
    action: "Reintentar",
    actionAttribute: "data-membership-plan-action=\"retry\"",
  });
  showMembershipPlansError(message);
}

function renderMembershipBenefitsError(error) {
  const message = isAuthRequiredError(error) ? getAuthRequiredMessage() : "No se pudieron cargar los beneficios.";
  elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
    title: "No se pudieron cargar los beneficios",
    text: "Intenta de nuevo para continuar gestionando este plan.",
    action: "Reintentar",
    actionAttribute: "data-membership-benefit-action=\"retry\"",
  });
  showMembershipBenefitsError(message);
}

function renderMembershipPlanFormError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipPlanErrors(error.details);
    showMembershipPlansError("Revisa los campos del plan antes de continuar.");
    return;
  }

  showMembershipPlansError(isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos guardar el plan. Intenta de nuevo.");
}

function renderMembershipBenefitFormError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipBenefitErrors(error.details);
    showMembershipBenefitsError("Revisa los campos del beneficio antes de continuar.");
    return;
  }

  showMembershipBenefitsError(isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos guardar el beneficio. Intenta de nuevo.");
}

function renderMembershipCustomerSearchError(error) {
  const message = isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos buscar clientes.";
  elements.membershipCustomerResults.innerHTML = '<div class="empty-state">Sin clientes cargados.</div>';
  showMembershipCustomerSearchError(message);
}

function renderCustomerMembershipsError(error) {
  const message = isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos cargar las membresias del cliente.";
  elements.membershipCustomerMembershipsList.innerHTML = '<div class="empty-state">Sin membresias cargadas.</div>';
  showMembershipCustomerMembershipsError(message);
}

function renderMembershipActivationError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipActivationErrors(error.details);
    showMembershipActivationError("Revisa los campos del pago de membresia.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP") {
    showMembershipActivationError("Este cliente ya tiene una membresia activa.");
    return;
  }

  if (error instanceof ApiError && error.code === "MEMBERSHIP_PLAN_INACTIVE") {
    showMembershipActivationError("Este plan esta inactivo. Activa el plan o selecciona otro.");
    return;
  }

  showMembershipActivationError(isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos pagar la membresia. Intenta de nuevo.");
}

function renderMembershipBenefitUsageError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipBenefitUsageErrors(error.details);
    showMembershipOperationError("Revisa los campos antes de aplicar el beneficio.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_MEMBERSHIP_NOT_ACTIVE") {
    showMembershipOperationError("Este cliente no tiene una membresia activa. Renueva o paga una membresia antes de aplicar beneficios.");
    return;
  }

  if (error instanceof ApiError && error.code === "MEMBERSHIP_BENEFIT_INACTIVE") {
    showMembershipOperationError("Este beneficio esta inactivo.");
    return;
  }

  if (error instanceof ApiError && error.code === "MEMBERSHIP_BENEFIT_NOT_IN_ACTIVE_PLAN") {
    showMembershipOperationError("Este beneficio no pertenece al plan activo del cliente.");
    return;
  }

  if (error instanceof ApiError && error.code === "MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED") {
    showMembershipOperationError("Este beneficio ya alcanzo su limite de uso para el periodo.");
    return;
  }

  showMembershipOperationError(isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos aplicar el beneficio. Intenta de nuevo.");
}

function renderMembershipRenewalError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipRenewalErrors(error.details);
    showMembershipOperationError("Revisa los campos de renovacion.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_MEMBERSHIP_CANCELLED") {
    showMembershipOperationError("No se puede renovar una membresia cancelada.");
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_MEMBERSHIP_NOT_FOUND") {
    showMembershipOperationError("La membresia seleccionada ya no esta disponible.");
    return;
  }

  showMembershipOperationError(isAuthRequiredError(error) ? getAuthRequiredMessage() : "No pudimos renovar la membresia. Intenta de nuevo.");
}

function mapMembershipPlanErrors(details = []) {
  details.forEach((detail) => {
    const target = {
      name: elements.membershipPlanNameError,
      description: elements.membershipPlanDescriptionError,
      durationDays: elements.membershipPlanDurationDaysError,
      price: elements.membershipPlanPriceError,
      renewalNoticeDays: elements.membershipPlanRenewalNoticeDaysError,
    }[detail.field];

    if (target) {
      target.textContent = detail.message || "Revisa este campo.";
    }
  });
}

function mapMembershipBenefitErrors(details = []) {
  details.forEach((detail) => {
    const target = {
      name: elements.membershipBenefitNameError,
      description: elements.membershipBenefitDescriptionError,
      benefitType: elements.membershipBenefitTypeError,
      appliesToType: elements.membershipBenefitAppliesToTypeError,
      appliesToName: elements.membershipBenefitAppliesToNameError,
      discountPercent: elements.membershipBenefitDiscountPercentError,
      includedQuantity: elements.membershipBenefitIncludedQuantityError,
      usageLimit: elements.membershipBenefitUsageLimitError,
      usagePeriod: elements.membershipBenefitUsagePeriodError,
    }[detail.field];

    if (target) {
      target.textContent = detail.message || "Revisa este campo.";
    }
  });
}

function mapMembershipActivationErrors(details = []) {
  details.forEach((detail) => {
    const target = {
      planId: elements.membershipActivationPlanError,
      membershipPlanId: elements.membershipActivationPlanError,
      startDate: elements.membershipActivationStartDateError,
      pricePaid: elements.membershipActivationPricePaidError,
      amount: elements.membershipActivationPricePaidError,
      paymentMethod: elements.membershipActivationPaymentMethodError,
    }[detail.field];

    if (target) {
      target.textContent = detail.message || "Revisa este campo.";
    }
  });
}

function mapMembershipRenewalErrors(details = []) {
  details.forEach((detail) => {
    const target = {
      amount: elements.membershipRenewalAmountError,
      paymentMethod: elements.membershipRenewalPaymentMethodError,
    }[detail.field];

    if (target) {
      target.textContent = detail.message || "Revisa este campo.";
    }
  });
}

function mapMembershipBenefitUsageErrors(details = []) {
  details.forEach((detail) => {
    const target = {
      benefitId: elements.membershipBenefitUsageQuantityError,
      membershipBenefitId: elements.membershipBenefitUsageQuantityError,
      usageDate: elements.membershipBenefitUsageDateError,
      quantity: elements.membershipBenefitUsageQuantityError,
      note: elements.membershipBenefitUsageNoteError,
    }[detail.field];

    if (target) {
      target.textContent = detail.message || "Revisa este campo.";
    }
  });
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
    showCompanyError("Revisa los campos marcados antes de continuar.");
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

  showCompanyError("No pudimos cargar la informacion de la empresa.");
}

function renderCompanyLogo(settings) {
  revokeCompanyLogoPreviewUrl();
  const logoUrl = settings?.logoUrl ? api.getCompanyLogoUrl?.(settings.logoUrl) : "";
  const updatedAt = settings?.logoUpdatedAt || settings?.updatedAt;

  if (!logoUrl) {
    elements.companyCurrentLogo.textContent = "Sin logo cargado";
    elements.companyLogoPreviewText.hidden = false;
    elements.companyLogoPreviewText.textContent = "Sin logo cargado";
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
    showCompanyLogoError(error.message || "Revisa el archivo seleccionado.");
    return;
  }

  showCompanyLogoError("No pudimos subir el logo. Intenta de nuevo.");
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
      Recibimos la solicitud de ${escapeHtml(companyName)}. Revisaremos los datos y, si es aprobada, enviaremos
      una invitacion para crear el acceso.
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
      <button class="secondary-button" id="new-registration-button" type="button" data-icon="→">Enviar otra solicitud</button>
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
    showCompanyRegistrationError("Revisa los campos marcados antes de enviar la solicitud.");
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_ALREADY_EXISTS") {
    showCompanyRegistrationError(
      "Ya existe una empresa registrada con ese correo. Inicia sesion o contacta al equipo de Punto Club si necesitas recuperar el acceso.",
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
      "Ya hay una invitacion pendiente para ese correo. Revisa la bandeja de entrada o solicita un reenvio si Product lo habilita.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "RATE_LIMITED") {
    showCompanyRegistrationError("Hay demasiados intentos recientes. Espera unos minutos e intenta de nuevo.");
    return;
  }

  if (error instanceof ApiError && error.code === "SERVICE_UNAVAILABLE") {
    showCompanyRegistrationError("El servicio no esta disponible en este momento. Intenta mas tarde.");
    return;
  }

  showCompanyRegistrationError("No pudimos enviar la solicitud. Intenta de nuevo.");
}

function renderAdminPrompt() {
  updateAdminAccessState();
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML =
    '<div class="empty-state">Ingresa el token interno para cargar solicitudes.</div>';
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
                data-icon="✓"
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
          data-icon="⌕"
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
  revokeAdminRequestLogoPreview();
  elements.adminCompaniesSection.classList.remove("is-admin-drawer-open");
  elements.backAdminListButton.hidden = true;
  elements.adminDetailEmpty.hidden = false;
  elements.adminDetailEmpty.textContent = "Selecciona una solicitud para revisar sus datos.";
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
    <div class="admin-detail-heading">
      <div>
        <p class="eyebrow">Solicitud de empresa</p>
        <h3>${escapeHtml(request.companyName || "Empresa sin nombre")}</h3>
      </div>
      <span>${escapeHtml(getRegistrationStatusLabel(request.status))}</span>
    </div>

    <div class="admin-state-note">
      ${escapeHtml(getAdminRequestStateMessage(request.status))}
    </div>

    <section class="admin-detail-section" aria-label="Empresa">
      <h3>Empresa</h3>
      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Correo de empresa", request.companyEmail)}
        ${renderAdminDetailItem("Telefono", request.companyPhone)}
        ${renderAdminDetailItem("Direccion", request.companyAddress)}
        ${renderAdminLogoDetailItem(request)}
      </div>
    </section>

    <section class="admin-detail-section" aria-label="Contacto">
      <h3>Contacto</h3>
      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Nombre", request.contactName)}
        ${renderAdminDetailItem("Correo de contacto", request.contactEmail)}
        ${renderAdminDetailItem("Telefono de contacto", request.contactPhone)}
      </div>
    </section>

    <section class="admin-detail-section" aria-label="Solicitud">
      <h3>Solicitud</h3>
      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Estado", getRegistrationStatusLabel(request.status))}
        ${renderAdminDetailItem("Solicitud", formatDateTime(request.createdAt))}
        ${renderAdminDetailItem("Actualizacion", formatDateTime(request.updatedAt))}
      </div>
    </section>

    ${renderAdminInvitationPanel(request.invitation)}

    ${
      isPending
        ? `
          <div class="admin-action-panel">
            <div class="form-actions">
              <button id="approve-admin-request-button" type="button" data-icon="✓" data-admin-action="approve">
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
                data-icon="×"
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
  loadAdminRequestLogoPreview(request);
}

function renderAdminDetailItem(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "No disponible")}</strong>
    </div>
  `;
}

function renderAdminLogoDetailItem(request) {
  if (!request.requestedLogo?.available) {
    return renderAdminDetailItem("Logo", "No incluido");
  }

  return `
    <div class="admin-logo-detail-item">
      <span>Logo</span>
      <figure class="admin-logo-preview" data-admin-logo-preview="${escapeHtml(request.id)}">
        <span>Cargando logo...</span>
      </figure>
    </div>
  `;
}

async function loadAdminRequestLogoPreview(request) {
  revokeAdminRequestLogoPreview();

  if (!request?.requestedLogo?.available || !adminToken) {
    return;
  }

  const requestId = String(request.id);
  const loadId = adminRequestLogoPreviewLoadId + 1;
  adminRequestLogoPreviewLoadId = loadId;
  adminRequestLogoPreviewRequestId = requestId;
  const target = getAdminLogoPreviewTarget(requestId);
  if (!target) {
    return;
  }

  try {
    const blob = await api.getCompanyRegistrationRequestLogo(request.id, adminToken);
    if (!isSelectedAdminRequest(requestId) || adminRequestLogoPreviewLoadId !== loadId) {
      return;
    }

    const previewUrl = URL.createObjectURL(blob);
    adminRequestLogoPreviewUrl = previewUrl;
    adminRequestLogoPreviewRequestId = requestId;
    target.innerHTML = '<img alt="Logo solicitado" loading="lazy" />';
    const image = target.querySelector("img");
    image.addEventListener("error", () => {
      if (isSelectedAdminRequest(requestId)) {
        revokeAdminRequestLogoPreview();
        target.innerHTML = "<span>Logo no disponible</span>";
      }
    }, { once: true });
    image.src = previewUrl;
  } catch (error) {
    if (isSelectedAdminRequest(requestId) && adminRequestLogoPreviewLoadId === loadId) {
      target.innerHTML = "<span>Logo no disponible</span>";
    }
  }
}

function getAdminLogoPreviewTarget(requestId) {
  return [...elements.adminRequestDetail.querySelectorAll("[data-admin-logo-preview]")]
    .find((target) => target.dataset.adminLogoPreview === requestId) || null;
}

function isSelectedAdminRequest(requestId) {
  return selectedAdminRequest && String(selectedAdminRequest.id) === String(requestId);
}

function revokeAdminRequestLogoPreview() {
  if (adminRequestLogoPreviewUrl) {
    URL.revokeObjectURL(adminRequestLogoPreviewUrl);
  }

  adminRequestLogoPreviewUrl = "";
  adminRequestLogoPreviewRequestId = null;
  adminRequestLogoPreviewLoadId += 1;
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
                data-icon="→"
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
    showAdminListError("El token interno no es valido o vencio. Ingresalo de nuevo.");
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAdminListError("Revisa el filtro de estado e intenta de nuevo.");
    return;
  }

  showAdminListError("No pudimos cargar las solicitudes. Revisa el token interno e intenta de nuevo.");
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
    showAdminDetailError("No tienes acceso para realizar esta accion con el token actual.");
    return;
  }

  if (
    error instanceof ApiError &&
    ["COMPANY_REGISTRATION_REQUEST_NOT_FOUND", "COMPANY_NOT_FOUND"].includes(error.code)
  ) {
    showAdminDetailError("La solicitud ya fue procesada por otro flujo. Actualiza la lista.");
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAdminDetailError("Revisa los datos de la accion e intenta de nuevo.");
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
    showAdminDetailError("La invitacion expiro. Actualiza la lista antes de reenviar.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_NOT_FOUND") {
    showAdminDetailError("No hay una invitacion pendiente para reenviar.");
    return;
  }

  showAdminDetailError("No pudimos completar la accion. Intenta de nuevo.");
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
  elements.invitationError.textContent = "El servicio no esta disponible en este momento. Intenta mas tarde.";
}

function renderAccessCreated(result) {
  const email = result.email || currentInvitation?.email || "";
  elements.createAccessForm.hidden = true;
  elements.accessStatus.hidden = false;
  elements.accessStatus.textContent = "Acceso creado correctamente. Ya puedes iniciar sesion.";
  if (email) {
    window.sessionStorage.setItem("puntoclubLoginEmail", email);
  }
  window.setTimeout(() => {
    window.location.assign("/login");
  }, 900);
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
    showAccessError("Revisa los campos marcados antes de continuar.");
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
    showAccessError("Ya existe un acceso para ese correo. Inicia sesion.");
    return;
  }

  showAccessError("No pudimos crear el acceso. Intenta de nuevo.");
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
    showLoginError("Revisa los campos marcados antes de continuar.");
    return;
  }

  if (error instanceof ApiError && ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code)) {
    showLoginError("Correo o contraseña incorrectos.");
    return;
  }

  if (error instanceof ApiError && error.code === "RATE_LIMITED") {
    showLoginError("Hay demasiados intentos recientes. Espera unos minutos e intenta de nuevo.");
    return;
  }

  showLoginError("No pudimos iniciar sesion. Intenta de nuevo.");
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
      ? "No pudimos consultar clientes. Intenta de nuevo."
      : error instanceof ApiError
        ? error.message
        : "No pudimos buscar clientes.";
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
    showFormError("Revisa los campos marcados antes de continuar.");
    return;
  }

  if (error instanceof ApiError && error.code === "INTERNAL_ERROR") {
    showFormError("No pudimos registrar el cliente. Intenta de nuevo.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showFormError(getAuthRequiredMessage());
    return;
  }

  showFormError("No pudimos registrar el cliente. Intenta de nuevo.");
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
    showPurchaseError("Revisa los campos marcados antes de continuar.");
    return;
  }

  if (error instanceof ApiError && error.code === "DUPLICATE_INVOICE") {
    showPurchaseError("Ya existe una compra con esa factura o comprobante. Usa otro numero o revisa el historial del cliente.");
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

  showPurchaseError("No pudimos registrar la compra. Intenta de nuevo.");
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
    showRedemptionError("Revisa los campos marcados antes de continuar.");
    return;
  }

  if (error instanceof ApiError && error.code === "INSUFFICIENT_POINTS") {
    showRedemptionError("El cliente no tiene puntos suficientes para redimir esa cantidad.");
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

  showRedemptionError("No pudimos redimir puntos. Intenta de nuevo.");
}

function getCustomerValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    phone: "El telefono es requerido y debe tener 32 caracteres o menos.",
    email: "El correo debe tener un formato valido y 254 caracteres o menos.",
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
    redemptionDate: "La fecha de redencion es requerida.",
    pointsRedeemed: "Los puntos a redimir deben ser un entero mayor que 0.",
    note: "La nota debe tener 500 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    email: "El correo debe tener un formato valido y 254 caracteres o menos.",
    phone: "El telefono debe tener entre 7 y 32 caracteres.",
    pointsPercentage: "El porcentaje debe ser mayor que 0 y menor o igual que 100.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyLogoValidationMessage(file) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

  if (!file) {
    return "Selecciona una imagen de logo.";
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
    companyName: "Ingresa el nombre de la empresa.",
    companyEmail: "Ingresa un correo de empresa valido.",
    companyAddress: "Ingresa la direccion de la empresa.",
    companyPhone: "El telefono de empresa debe tener 32 caracteres o menos.",
    contactName: "El nombre de contacto debe tener 160 caracteres o menos.",
    contactEmail: "Ingresa un correo de contacto valido.",
    contactPhone: "El telefono de contacto debe tener 32 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCreateAccessValidationMessage(detail) {
  const messagesByField = {
    displayName: "El nombre debe tener 160 caracteres o menos.",
    password: "Usa de 10 a 128 caracteres, con letras y numeros.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getLoginValidationMessage(detail) {
  const messagesByField = {
    email: "Ingresa un correo valido.",
    password: "Ingresa la contraseña.",
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
  return "Inicia sesion para operar con la empresa activa.";
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

function showMembershipFinancialReportStatus(message) {
  elements.membershipFinancialReportStatus.hidden = false;
  elements.membershipFinancialReportStatus.textContent = message;
}

function showMembershipFinancialReportError(message) {
  elements.membershipFinancialReportError.hidden = false;
  elements.membershipFinancialReportError.textContent = message;
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

function showMembershipPlansStatus(message) {
  elements.membershipPlansStatus.hidden = false;
  elements.membershipPlansStatus.textContent = message;
}

function showMembershipPlansError(message) {
  elements.membershipPlansError.hidden = false;
  elements.membershipPlansError.textContent = message;
}

function showMembershipBenefitsStatus(message) {
  elements.membershipBenefitsStatus.hidden = false;
  elements.membershipBenefitsStatus.textContent = message;
}

function showMembershipBenefitsError(message) {
  elements.membershipBenefitsError.hidden = false;
  elements.membershipBenefitsError.textContent = message;
}

function showMembershipCustomerSearchError(message) {
  elements.membershipCustomerSearchError.hidden = false;
  elements.membershipCustomerSearchError.textContent = message;
}

function showMembershipActivationStatus(message) {
  elements.membershipActivationStatus.hidden = false;
  elements.membershipActivationStatus.textContent = message;
}

function showMembershipActivationError(message) {
  elements.membershipActivationError.hidden = false;
  elements.membershipActivationError.textContent = message;
}

function showMembershipCustomerMembershipsError(message) {
  elements.membershipCustomerMembershipsError.hidden = false;
  elements.membershipCustomerMembershipsError.textContent = message;
}

function showMembershipOperationStatus(message) {
  elements.membershipOperationStatus.hidden = false;
  elements.membershipOperationStatus.textContent = message;
}

function showMembershipOperationError(message) {
  elements.membershipOperationError.hidden = false;
  elements.membershipOperationError.textContent = message;
}

function showMembershipExpirationStatus(message) {
  elements.membershipExpirationStatus.hidden = false;
  elements.membershipExpirationStatus.textContent = message;
}

function showMembershipExpirationError(message) {
  elements.membershipExpirationError.hidden = false;
  elements.membershipExpirationError.textContent = message;
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
  clearMembershipOperationMessages();
}

function clearReportMessages() {
  elements.reportError.hidden = true;
  elements.reportError.textContent = "";
  elements.reportStatus.hidden = true;
  elements.reportStatus.textContent = "";
}

function clearMembershipFinancialReportMessages() {
  elements.membershipFinancialReportError.hidden = true;
  elements.membershipFinancialReportError.textContent = "";
  elements.membershipFinancialReportStatus.hidden = true;
  elements.membershipFinancialReportStatus.textContent = "";
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

function clearMembershipMessages() {
  clearMembershipPlanMessages();
  clearMembershipBenefitMessages();
  clearMembershipActivationMessages();
  clearMembershipCustomerMembershipMessages();
  clearMembershipExpirationMessages();
}

function clearMembershipPlanMessages() {
  elements.membershipPlanNameError.textContent = "";
  elements.membershipPlanDescriptionError.textContent = "";
  elements.membershipPlanDurationDaysError.textContent = "";
  elements.membershipPlanPriceError.textContent = "";
  elements.membershipPlanRenewalNoticeDaysError.textContent = "";
  elements.membershipPlansError.hidden = true;
  elements.membershipPlansError.textContent = "";
  elements.membershipPlansStatus.hidden = true;
  elements.membershipPlansStatus.textContent = "";
}

function clearMembershipBenefitMessages() {
  elements.membershipBenefitNameError.textContent = "";
  elements.membershipBenefitDescriptionError.textContent = "";
  elements.membershipBenefitTypeError.textContent = "";
  elements.membershipBenefitAppliesToTypeError.textContent = "";
  elements.membershipBenefitAppliesToNameError.textContent = "";
  elements.membershipBenefitDiscountPercentError.textContent = "";
  elements.membershipBenefitIncludedQuantityError.textContent = "";
  elements.membershipBenefitUsageLimitError.textContent = "";
  elements.membershipBenefitUsagePeriodError.textContent = "";
  elements.membershipBenefitsError.hidden = true;
  elements.membershipBenefitsError.textContent = "";
  elements.membershipBenefitsStatus.hidden = true;
  elements.membershipBenefitsStatus.textContent = "";
}

function clearMembershipActivationMessages() {
  elements.membershipActivationPlanError.textContent = "";
  elements.membershipActivationStartDateError.textContent = "";
  elements.membershipActivationPricePaidError.textContent = "";
  elements.membershipActivationPaymentMethodError.textContent = "";
  elements.membershipCustomerSearchError.hidden = true;
  elements.membershipCustomerSearchError.textContent = "";
  elements.membershipCustomerSearchStatus.hidden = true;
  elements.membershipCustomerSearchStatus.textContent = "";
  elements.membershipActivationError.hidden = true;
  elements.membershipActivationError.textContent = "";
  elements.membershipActivationStatus.hidden = true;
  elements.membershipActivationStatus.textContent = "";
}

function clearMembershipCustomerMembershipMessages() {
  elements.membershipCustomerMembershipsError.hidden = true;
  elements.membershipCustomerMembershipsError.textContent = "";
  elements.membershipCustomerMembershipsStatus.hidden = true;
  elements.membershipCustomerMembershipsStatus.textContent = "";
}

function clearMembershipExpirationMessages() {
  elements.membershipExpirationWithinDaysError.textContent = "";
  elements.membershipExpirationError.hidden = true;
  elements.membershipExpirationError.textContent = "";
  elements.membershipExpirationStatus.hidden = true;
  elements.membershipExpirationStatus.textContent = "";
}

function clearMembershipOperationMessages() {
  elements.membershipOperationError.hidden = true;
  elements.membershipOperationError.textContent = "";
  elements.membershipOperationStatus.hidden = true;
  elements.membershipOperationStatus.textContent = "";
}

function clearMembershipBenefitUsageErrors() {
  elements.membershipBenefitUsageDateError.textContent = "";
  elements.membershipBenefitUsageQuantityError.textContent = "";
  elements.membershipBenefitUsageNoteError.textContent = "";
}

function clearMembershipRenewalErrors() {
  elements.membershipRenewalPaymentMethodError.textContent = "";
  elements.membershipRenewalAmountError.textContent = "";
}

function clearMembershipRenewalForm() {
  elements.membershipRenewalForm.reset();
  elements.membershipRenewalForm.hidden = true;
  clearMembershipRenewalErrors();
}

function clearMembershipBenefitUsageForm() {
  pendingMembershipBenefitUsage = null;
  elements.membershipBenefitUsageForm.reset();
  elements.membershipBenefitUsageBenefitIdInput.value = "";
  elements.membershipBenefitUsageDateInput.value = getToday();
  elements.membershipBenefitUsageQuantityInput.value = "1";
  elements.membershipBenefitUsageSummary.innerHTML = "";
  elements.membershipBenefitUsageForm.hidden = true;
  clearMembershipBenefitUsageErrors();
}

function resetOperationMembershipState() {
  selectedCustomerActiveMembership = null;
  selectedCustomerMembershipBenefits = [];
  selectedCustomerMembershipUsages = [];
  selectedCustomerMembershipTransactions = [];
  hideMembershipOperationPanel();
}

function hideMembershipOperationPanel() {
  clearMembershipBenefitUsageForm();
  clearMembershipRenewalForm();
  elements.membershipPaymentHost.hidden = true;
  elements.membershipActivationForm.hidden = true;
  elements.membershipOperationPanel.hidden = true;
  elements.membershipOperationActive.innerHTML = "";
  elements.membershipOperationBenefits.innerHTML = "";
  elements.membershipOperationUsages.innerHTML = "";
  elements.membershipOperationTransactions.innerHTML = "";
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
  elements.savePurchaseButton.textContent = isSubmitting ? "Registrando..." : "Registrar compra";
}

function setRedemptionSubmitting(isSubmitting) {
  elements.saveRedemptionButton.disabled = isSubmitting;
  elements.saveRedemptionButton.textContent = isSubmitting ? "Redimiendo..." : "Redimir puntos";
}

function setReportSubmitting(isSubmitting) {
  elements.loadReportButton.disabled = isSubmitting;
  elements.loadReportButton.textContent = isSubmitting ? "Consultando..." : "Consultar";
}

function setMembershipFinancialReportSubmitting(isSubmitting) {
  elements.loadMembershipFinancialReportButton.disabled = isSubmitting;
  elements.exportMembershipFinancialReportButton.disabled = isSubmitting || !currentMembershipFinancialReport?.items?.length;
  elements.loadMembershipFinancialReportButton.textContent = isSubmitting ? "Consultando..." : "Consultar";
}

function setAuditSubmitting(isSubmitting) {
  elements.loadAuditButton.disabled = isSubmitting;
  elements.loadAuditButton.textContent = isSubmitting ? "Consultando..." : "Consultar auditoria";
}

function setCompanyLoading(isLoading) {
  elements.reloadCompanyButton.disabled = isLoading;
  elements.reloadCompanyButton.textContent = isLoading ? "Cargando..." : "Actualizar";
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

function setMembershipPlanSubmitting(isSubmitting) {
  elements.reloadMembershipPlansButton.disabled = isSubmitting;
  elements.saveMembershipPlanButton.disabled = isSubmitting;
  elements.resetMembershipPlanButton.disabled = isSubmitting;
  elements.cancelMembershipPlanButton.disabled = isSubmitting;
  elements.saveMembershipPlanButton.textContent = isSubmitting
    ? "Guardando..."
    : (elements.membershipPlanIdInput.value ? "Guardar cambios" : "Guardar plan");
}

function setMembershipBenefitSubmitting(isSubmitting) {
  elements.saveMembershipBenefitButton.disabled = isSubmitting;
  elements.resetMembershipBenefitButton.disabled = isSubmitting;
  elements.cancelMembershipBenefitButton.disabled = isSubmitting;
  elements.saveMembershipBenefitButton.textContent = isSubmitting
    ? "Guardando..."
    : (elements.membershipBenefitIdInput.value ? "Guardar cambios" : "Guardar beneficio");
}

function setMembershipExpirationLoading(isLoading) {
  elements.membershipExpirationWithinDaysInput.disabled = isLoading;
  elements.loadMembershipExpirationButton.disabled = isLoading;
  elements.reloadMembershipExpirationButton.disabled = isLoading;
  elements.loadMembershipExpirationButton.textContent = isLoading ? "Consultando..." : "Consultar";
  elements.reloadMembershipExpirationButton.textContent = isLoading ? "Cargando..." : "Actualizar";
}

function setMembershipActivationSubmitting(isSubmitting, options = {}) {
  elements.searchMembershipCustomerButton.disabled = isSubmitting;
  elements.membershipCustomerSearchInput.disabled = isSubmitting;
  elements.membershipActivationPlanInput.disabled = isSubmitting;
  elements.membershipActivationStartDateInput.disabled = isSubmitting;
  elements.membershipActivationPricePaidInput.disabled = isSubmitting;
  elements.membershipActivationPaymentMethodInput.disabled = isSubmitting;
  elements.activateMembershipButton.disabled = isSubmitting;
  elements.activateMembershipButton.textContent = isSubmitting && !options.searching ? "Pagando..." : "Pagar membresia";
  elements.searchMembershipCustomerButton.textContent = isSubmitting && options.searching ? "Buscando..." : "Buscar cliente";
}

function setMembershipOperationLoading(isLoading) {
  elements.reloadMembershipOperationButton.disabled = isLoading;
  elements.reloadMembershipOperationButton.textContent = isLoading ? "Cargando..." : "Actualizar";
}

function setMembershipBenefitUsageSubmitting(isSubmitting) {
  elements.confirmMembershipBenefitUsageButton.disabled = isSubmitting;
  elements.cancelMembershipBenefitUsageButton.disabled = isSubmitting;
  elements.membershipBenefitUsageDateInput.disabled = isSubmitting;
  elements.membershipBenefitUsageQuantityInput.disabled = isSubmitting;
  elements.membershipBenefitUsageNoteInput.disabled = isSubmitting;
  elements.confirmMembershipBenefitUsageButton.textContent = isSubmitting ? "Aplicando..." : "Aplicar beneficio";
}

function setMembershipRenewalSubmitting(isSubmitting) {
  elements.confirmMembershipRenewalButton.disabled = isSubmitting;
  elements.cancelMembershipRenewalButton.disabled = isSubmitting;
  elements.membershipRenewalPaymentMethodInput.disabled = isSubmitting;
  elements.membershipRenewalAmountInput.disabled = isSubmitting;
  elements.confirmMembershipRenewalButton.textContent = isSubmitting ? "Renovando..." : "Renovar membresia";
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
  elements.submitLoginButton.textContent = isSubmitting ? "Entrando..." : "Iniciar sesion";
}

function showPublicHomePage() {
  document.body.classList.add("public-home-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = false;
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.invitationPage.hidden = true;
  elements.loginButton.hidden = false;
  elements.logoutButton.hidden = true;
  elements.authStatus.hidden = true;
  elements.dataSourceStatus.hidden = true;
  renderActiveCompanyIdentity(null);
}

function showInvitationPage() {
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.invitationPage.hidden = false;
  renderActiveCompanyIdentity(null);
}

function showLoginPage(options = {}) {
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.appBody.hidden = true;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = false;
  if (options.replaceRoute && !isCompanyLoginRoute()) {
    window.history.replaceState({}, "", "/login");
  }
  const pendingEmail = window.sessionStorage.getItem("puntoclubLoginEmail");
  if (pendingEmail && !elements.loginEmailInput.value) {
    elements.loginEmailInput.value = pendingEmail;
    window.sessionStorage.removeItem("puntoclubLoginEmail");
  }
  window.requestAnimationFrame(() => {
    elements.loginEmailInput.focus();
  });
}

async function showMainApp(options = {}) {
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.appBody.hidden = false;
  setActiveSection(getDefaultLoyaltySection(), { focus: options.focus !== false });

  if (options.replaceLoginRoute && isCompanyLoginRoute()) {
    window.history.replaceState({}, "", "/");
  }

  if (options.refreshCompany) {
    await loadCompanySettings();
  }
}

function showPublicCompanyRegistrationPage() {
  document.body.classList.remove("public-home-mode");
  document.body.classList.add("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
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
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.add("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
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

function startGlobalLoading(message, options = {}) {
  const delay = Number.isFinite(Number(options.delay)) ? Number(options.delay) : 3000;
  stopGlobalLoading();
  globalLoadingTimer = window.setTimeout(() => {
    elements.globalLoadingMessage.textContent = message;
    elements.globalLoading.hidden = false;
  }, Math.max(0, delay));
  return stopGlobalLoading;
}

function stopGlobalLoading() {
  if (globalLoadingTimer) {
    window.clearTimeout(globalLoadingTimer);
    globalLoadingTimer = null;
  }

  elements.globalLoading.hidden = true;
}

function validateCreateAccessForm() {
  const password = elements.accessPasswordInput.value;
  const confirmation = elements.accessPasswordConfirmationInput.value;
  let isValid = true;

  if (!isStrongPassword(password)) {
    elements.accessPasswordError.textContent = "Usa de 10 a 128 caracteres, con letras y numeros.";
    isValid = false;
  }

  if (password !== confirmation) {
    elements.accessPasswordConfirmationError.textContent = "Las contraseñas no coinciden.";
    isValid = false;
  }

  if (!isValid) {
    showAccessError("Revisa los campos marcados antes de continuar.");
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
    history: "Historial del cliente",
  };

  return titles[type] ?? "Ficha del cliente";
}

function getReportTypeLabel(type, item = {}) {
  if (type === "purchase") {
    return "Compra";
  }

  if (type === "membership") {
    return String(item.note || "").toLowerCase().includes("beneficio usado")
      ? "Beneficio usado"
      : "Membresia activada";
  }

  return "Redencion";
}

function getAuditEventLabel(eventType) {
  const labels = {
    "customer.created": "Cliente creado",
    "purchase.registered": "Compra registrada",
    "redemption.registered": "Puntos redimidos",
    "customer.rejected_duplicate": "Cliente duplicado",
    "purchase.rejected_duplicate_invoice": "Factura duplicada",
    "redemption.rejected_insufficient_points": "Saldo insuficiente",
    "company.settings.updated": "Configuracion actualizada",
    "membership.plan.created": "Plan de membresia creado",
    "membership.plan.updated": "Plan de membresia actualizado",
    "membership.benefit.created": "Beneficio creado",
    "membership.benefit.updated": "Beneficio actualizado",
    "membership.benefit.used": "Uso de beneficio registrado",
    "customer.membership.activated": "Membresia de cliente activada",
  };

  return labels[eventType] ?? (eventType || "Evento");
}

function getAuditEntityLabel(entityType) {
  const labels = {
    customer: "Cliente",
    purchase: "Compra",
    redemption: "Redencion",
    company: "Empresa",
    membership_plan: "Plan de membresia",
    membership_benefit: "Beneficio de membresia",
    membership_benefit_usage: "Uso de beneficio",
    customer_membership: "Membresia de cliente",
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

function getMembershipStatusLabel(status) {
  return status === "active" ? "Activo" : "Inactivo";
}

function getCustomerMembershipStatusLabel(status) {
  const labels = {
    active: "Activa",
    expired: "Vencida",
    cancelled: "Cancelada",
  };

  return labels[status] ?? (status || "No disponible");
}

function getMembershipTransactionTypeLabel(type) {
  const labels = {
    new_membership: "Activacion",
    renewal: "Renovacion",
    adjustment: "Ajuste",
    cancellation: "Cancelacion",
  };

  return labels[type] ?? "Transaccion";
}

function getPaymentMethodLabel(method) {
  const labels = {
    cash: "Efectivo",
    card: "Tarjeta",
    credit: "Credito",
    transfer: "Transferencia",
    other: "Otro",
  };

  return labels[method] ?? "Metodo de pago";
}

function isMembershipRenewable(membership) {
  return Boolean(membership) && membership.status !== "cancelled";
}

function isMembershipCurrentlyUsable(membership) {
  return Boolean(membership) && membership.status === "active" && String(membership.endDate || "") >= getToday();
}

function getRenewableMembership(memberships = []) {
  return memberships.find(isMembershipCurrentlyUsable)
    || memberships.find((membership) => isMembershipRenewable(membership) && String(membership.endDate || "") < getToday())
    || memberships.find(isMembershipRenewable)
    || null;
}

function getSelectedCustomerMembershipActionLabel() {
  if (!selectedCustomerActiveMembership) {
    return "Pagar membresia";
  }

  if (isMembershipCurrentlyUsable(selectedCustomerActiveMembership) && selectedCustomerMembershipBenefits.length > 0) {
    return "Aplicar beneficio";
  }

  if (isMembershipRenewable(selectedCustomerActiveMembership)) {
    return "Renovar membresia";
  }

  return "Pagar membresia";
}

function getMembershipOperationCustomer() {
  return activeSection === "memberships" ? selectedMembershipCustomer : selectedCustomer;
}

function getExpirationAlertLabel(alert = {}) {
  const labels = {
    none: "Sin alerta de vencimiento.",
    expires_today: "La membresia vence hoy.",
    expiring_soon: alert.message || `La membresia vence en ${alert.daysUntilExpiration} dias.`,
    expired: "Membresia vencida.",
  };

  return labels[alert.state] ?? "Sin alerta de vencimiento.";
}

function getMembershipExpirationStateLabel(item = {}) {
  const days = Number(item.daysUntilExpiration ?? 0);

  if (days < 0 || item.state === "expired") {
    return `Vencio hace ${formatReportNumber(Math.abs(days))} dias`;
  }

  if (days === 0 || item.state === "expires_today") {
    return "Vence hoy";
  }

  return `Vence en ${formatReportNumber(days)} dias`;
}

function getSelectedActivationPlan() {
  const planId = elements.membershipActivationPlanInput.value;
  return membershipPlans.find((plan) => String(plan.id) === String(planId) && plan.status === "active") || null;
}

function calculateExpectedMembershipEndDate(startDate, durationDays) {
  const date = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setUTCDate(date.getUTCDate() + Number(durationDays) - 1);
  return date.toISOString().slice(0, 10);
}

function getBenefitTypeLabel(type) {
  const labels = {
    informational: "Informativo",
    discount: "Descuento",
    allowance: "Cantidad incluida",
    free_item: "Producto incluido",
  };

  return labels[type] ?? (type || "Beneficio");
}

function getAppliesToTypeLabel(type) {
  const labels = {
    product: "Producto",
    service: "Servicio",
    category: "Categoria",
    text: "Texto libre",
  };

  return labels[type] ?? "Texto libre";
}

function getUsagePeriodLabel(period) {
  const labels = {
    none: "Sin control",
    day: "Dia",
    week: "Semana",
    month: "Mes",
    membership_term: "Vigencia",
  };

  return labels[period] ?? "Sin control";
}

function getMembershipBenefitSummary(benefit) {
  if (benefit.benefitType === "discount") {
    return `${benefit.discountPercent || 0}% de descuento`;
  }

  if (["allowance", "free_item"].includes(benefit.benefitType)) {
    return `${benefit.includedQuantity || 0} incluido, limite ${benefit.usageLimit || 0} por ${getUsagePeriodLabel(benefit.usagePeriod).toLowerCase()}`;
  }

  return "Beneficio informativo";
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
    return `Puntos redimidos.${points}`;
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
      getReportTypeLabel(item.type, item),
      item.customerName || "",
      item.customerPhone || "",
      item.customerEmail || "",
      getReportCsvDetail(item),
      ["purchase", "membership"].includes(item.type) && item.amount != null ? Number(item.amount ?? 0) : "",
      Number(item.points ?? 0),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

function exportMembershipFinancialReportCsv() {
  if (
    !currentMembershipFinancialReport
    || !Array.isArray(currentMembershipFinancialReport.items)
    || currentMembershipFinancialReport.items.length === 0
  ) {
    showMembershipFinancialReportError("Consulte un reporte de membresias antes de exportar.");
    return;
  }

  const csv = buildMembershipFinancialReportCsv(currentMembershipFinancialReport);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `punto-club-membresias-financiero-${currentMembershipFinancialReport.from}-${currentMembershipFinancialReport.to}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMembershipFinancialReportStatus("CSV de membresias exportado desde los datos cargados.");
}

function buildMembershipFinancialReportCsv(report) {
  const rows = [
    ["fecha_hora", "fecha_transaccion", "cliente", "telefono", "email", "plan", "tipo", "metodo_pago", "monto", "nota"],
    ...report.items.map((item) => [
      item.createdAt || "",
      item.transactionDate || "",
      item.customerName || "",
      item.customerPhone || "",
      item.customerEmail || "",
      item.planName || "",
      getMembershipTransactionTypeLabel(item.transactionType),
      getPaymentMethodLabel(item.paymentMethod),
      Number(item.amount ?? 0),
      item.note || "",
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

function getReportCsvDetail(item) {
  if (item.type === "purchase") {
    return item.invoiceNumber ? `Factura ${item.invoiceNumber}` : "Compra sin comprobante";
  }

  if (item.type === "membership") {
    return item.note || "Evento de membresia";
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

function getDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - Number(days));
  return date.toISOString().slice(0, 10);
}

function getMembershipUsageDateFilters() {
  return {
    from: getDateDaysAgo(30),
    to: getToday(),
  };
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
