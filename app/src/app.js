import { config } from "./config.js";
import { ApiError, createCustomerApi } from "./customerApi.js";

const api = createCustomerApi(config);

const SEO_BASE_URL = "https://puntoclubcr.com";
const SEO_ROUTE_CONFIG = {
  "/": {
    title: "Punto Club | App de fidelización de clientes en Costa Rica",
    description:
      "Crea programas de puntos, membresías y beneficios con Punto Club. Fideliza clientes, aumenta la recompra y opera tu programa desde un panel simple.",
    canonical: `${SEO_BASE_URL}/`,
    robots: "index,follow",
    ogTitle: "Punto Club | App de fidelización de clientes",
    ogDescription:
      "Crea programas de puntos, membresías y beneficios para que tus clientes regresen con más frecuencia.",
  },
  "/producto": {
    title: "Software de fidelización de clientes | Punto Club",
    description:
      "Punto Club ayuda a negocios a registrar puntos, administrar membresías, aplicar beneficios y medir la actividad de sus clientes frecuentes.",
    canonical: `${SEO_BASE_URL}/producto`,
    robots: "index,follow",
    ogTitle: "Software de fidelización de clientes | Punto Club",
    ogDescription:
      "Software de lealtad para negocios en Costa Rica con puntos, membresías, beneficios y reportes.",
  },
};
const SEO_NOINDEX_CONFIG = {
  title: "Punto Club",
  description: "Panel operativo de Punto Club para empresas autorizadas.",
  canonical: SEO_BASE_URL,
  robots: "noindex,nofollow",
  ogTitle: "Punto Club",
  ogDescription: "Panel operativo de Punto Club.",
};

const elements = {
  publicHomePage: document.querySelector("#public-home-page"),
  publicProductPage: document.querySelector("#public-product-page"),
  globalLoading: document.querySelector("#global-loading"),
  globalLoadingMessage: document.querySelector("#global-loading-message"),
  dataSourceStatus: document.querySelector("#data-source-status"),
  authStatus: document.querySelector("#auth-status"),
  loginButton: document.querySelector("#login-button"),
  logoutButton: document.querySelector("#logout-button"),
  activeCompanyIdentity: document.querySelector("#active-company-identity"),
  activeCompanyLogoFallback: document.querySelector(
    "#active-company-logo-fallback",
  ),
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
  toggleLoginPasswordButton: document.querySelector("#toggle-login-password"),
  passwordResetRequestForm: document.querySelector(
    "#password-reset-request-form",
  ),
  passwordResetEmailInput: document.querySelector("#password-reset-email"),
  passwordResetEmailError: document.querySelector(
    "#password-reset-email-error",
  ),
  passwordResetRequestError: document.querySelector(
    "#password-reset-request-error",
  ),
  passwordResetRequestStatus: document.querySelector(
    "#password-reset-request-status",
  ),
  submitPasswordResetRequestButton: document.querySelector(
    "#submit-password-reset-request-button",
  ),
  togglePasswordResetRequestButton: document.querySelector(
    "#toggle-password-reset-request",
  ),
  passwordResetPage: document.querySelector("#password-reset-page"),
  passwordResetLoading: document.querySelector("#password-reset-loading"),
  passwordResetError: document.querySelector("#password-reset-error"),
  passwordResetStatus: document.querySelector("#password-reset-status"),
  passwordResetForm: document.querySelector("#password-reset-form"),
  newPasswordInput: document.querySelector("#new-password"),
  newPasswordConfirmationInput: document.querySelector(
    "#new-password-confirmation",
  ),
  newPasswordError: document.querySelector("#new-password-error"),
  newPasswordConfirmationError: document.querySelector(
    "#new-password-confirmation-error",
  ),
  submitPasswordResetButton: document.querySelector(
    "#submit-password-reset-button",
  ),
  toggleNewPasswordButton: document.querySelector("#toggle-new-password"),
  toggleNewPasswordConfirmationButton: document.querySelector(
    "#toggle-new-password-confirmation",
  ),
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
  accessPasswordConfirmationInput: document.querySelector(
    "#access-password-confirmation",
  ),
  accessDisplayNameError: document.querySelector("#access-display-name-error"),
  accessPasswordError: document.querySelector("#access-password-error"),
  accessPasswordConfirmationError: document.querySelector(
    "#access-password-confirmation-error",
  ),
  accessError: document.querySelector("#access-error"),
  accessStatus: document.querySelector("#access-status"),
  createAccessButton: document.querySelector("#create-access-button"),
  communicationCampaignNameInput: document.querySelector(
    "#communication-campaign-name",
  ),
  communicationCampaignForm: document.querySelector(
    "#communication-campaign-form",
  ),
  communicationCampaignSubjectInput: document.querySelector(
    "#communication-campaign-subject",
  ),
  communicationCampaignAudienceInput: document.querySelector(
    "#communication-campaign-audience",
  ),
  communicationCampaignBodyInput: document.querySelector(
    "#communication-campaign-body",
  ),
  communicationIncludePointsInput: document.querySelector(
    "#communication-include-points",
  ),
  communicationCampaignImageInput: document.querySelector(
    "#communication-campaign-image",
  ),
  communicationCampaignImageError: document.querySelector(
    "#communication-campaign-image-error",
  ),
  communicationCampaignImageStatus: document.querySelector(
    "#communication-campaign-image-status",
  ),
  communicationCampaignImagePreview: document.querySelector(
    "#communication-image-preview",
  ),
  communicationCampaignImagePreviewText: document.querySelector(
    "#communication-image-preview-text",
  ),
  communicationCampaignFormTitle: document.querySelector(
    "#communication-campaign-form-title",
  ),
  communicationCampaignFormSupport: document.querySelector(
    "#communication-campaign-form-support",
  ),
  communicationUploadImageButton: document.querySelector(
    "#communication-upload-image-button",
  ),
  communicationDeleteImageButton: document.querySelector(
    "#communication-delete-image-button",
  ),
  communicationCampaignSearchInput: document.querySelector(
    "#communication-campaign-search",
  ),
  communicationNewCampaignButton: document.querySelector(
    "#communication-new-campaign-button",
  ),
  communicationRefreshCampaignsButton: document.querySelector(
    "#communication-refresh-campaigns-button",
  ),
  communicationManageCampaignList: document.querySelector(
    "#communication-manage-campaign-list",
  ),
  communicationEditCampaignButton: document.querySelector(
    "#communication-edit-campaign-button",
  ),
  communicationSaveCampaignButton: document.querySelector(
    "#communication-save-campaign-button",
  ),
  communicationCampaignList: document.querySelector(
    "#communication-campaign-list",
  ),
  communicationResultPanel: document.querySelector(
    "#communication-result-panel",
  ),
  communicationSendButton: document.querySelector("#communication-send-button"),
  communicationCampaignStatus: document.querySelector(
    "#communication-campaign-status",
  ),
  communicationCampaignError: document.querySelector(
    "#communication-campaign-error",
  ),
  communicationPreview: document.querySelector("#communication-preview"),
  communicationPreviewContent: document.querySelector(
    "#communication-preview-content",
  ),
  communicationPreviewToggle: document.querySelector(
    "#communication-preview-toggle",
  ),
  communicationCustomerList: document.querySelector(
    "#communication-customer-list",
  ),
  communicationCustomerSearchInput: document.querySelector(
    "#communication-customer-search",
  ),
  communicationSelectedCount: document.querySelector(
    "#communication-selected-count",
  ),
  communicationSelectAllButton: document.querySelector(
    "#communication-select-all-button",
  ),
  communicationSelectPointsButton: document.querySelector(
    "#communication-select-points-button",
  ),
  communicationClearSelectionButton: document.querySelector(
    "#communication-clear-selection-button",
  ),
  communicationFilterButtons: [
    ...document.querySelectorAll("[data-communication-filter]"),
  ],
  communicationHistoryBody: document.querySelector(
    "#communication-history-body",
  ),
  companySubsectionButtons: [
    ...document.querySelectorAll("[data-company-subsection]"),
  ],
  companySubsectionPanels: [
    ...document.querySelectorAll("[data-company-panel]"),
  ],
  companyOpenCampaignsButton: document.querySelector(
    "#company-open-campaigns-button",
  ),
  companyOperationalEmailForm: document.querySelector(
    "#company-operational-email-form",
  ),
  companyEmailWelcomeEnabledInput: document.querySelector(
    "#company-email-welcome-enabled",
  ),
  companyEmailPurchaseEnabledInput: document.querySelector(
    "#company-email-purchase-enabled",
  ),
  companyEmailRedemptionEnabledInput: document.querySelector(
    "#company-email-redemption-enabled",
  ),
  companyEmailReplyToInput: document.querySelector("#company-email-reply-to"),
  companyEmailReplyToError: document.querySelector(
    "#company-email-reply-to-error",
  ),
  companyOperationalEmailStatus: document.querySelector(
    "#company-operational-email-status",
  ),
  companyOperationalEmailError: document.querySelector(
    "#company-operational-email-error",
  ),
  saveCompanyOperationalEmailButton: document.querySelector(
    "#save-company-operational-email-button",
  ),
  companyEmailHistoryFromInput: document.querySelector(
    "#company-email-history-from",
  ),
  companyEmailHistoryToInput: document.querySelector(
    "#company-email-history-to",
  ),
  companyEmailHistoryTypeInput: document.querySelector(
    "#company-email-history-type",
  ),
  companyEmailHistoryStatusInput: document.querySelector(
    "#company-email-history-status",
  ),
  companyEmailHistorySearchInput: document.querySelector(
    "#company-email-history-search",
  ),
  companyEmailHistoryLoadButton: document.querySelector(
    "#company-email-history-load-button",
  ),
  companyEmailHistoryStatusMessage: document.querySelector(
    "#company-email-history-status-message",
  ),
  companyEmailHistoryError: document.querySelector(
    "#company-email-history-error",
  ),
  companyEmailHistoryBody: document.querySelector(
    "#company-email-history-body",
  ),
  companyNavToggle: document.querySelector("#company-nav-toggle"),
  companySubnav: document.querySelector("#company-side-subnav"),
  communicationViewButtons: [
    ...document.querySelectorAll("[data-communication-view]"),
  ],
  communicationPanels: [
    ...document.querySelectorAll("[data-communication-panel]"),
  ],
  navButtons: [...document.querySelectorAll("[data-section-target]")],
  sectionPanels: [...document.querySelectorAll("[data-section]")],
  pointsNavButton: document.querySelector('[data-section-target="operations"]'),
  membershipsNavButton: document.querySelector(
    '[data-section-target="memberships"]',
  ),
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
  membershipOperationPanel: document.querySelector(
    "#membership-operation-panel",
  ),
  reloadMembershipOperationButton: document.querySelector(
    "#reload-membership-operation-button",
  ),
  membershipOperationStatus: document.querySelector(
    "#membership-operation-status",
  ),
  membershipOperationError: document.querySelector(
    "#membership-operation-error",
  ),
  membershipPaymentHost: document.querySelector("#membership-payment-host"),
  membershipOperationActive: document.querySelector(
    "#membership-operation-active",
  ),
  membershipRenewalForm: document.querySelector("#membership-renewal-form"),
  membershipRenewalPaymentMethodInput: document.querySelector(
    "#membership-renewal-payment-method",
  ),
  membershipRenewalAmountInput: document.querySelector(
    "#membership-renewal-amount",
  ),
  membershipRenewalPaymentMethodError: document.querySelector(
    "#membership-renewal-payment-method-error",
  ),
  membershipRenewalAmountError: document.querySelector(
    "#membership-renewal-amount-error",
  ),
  cancelMembershipRenewalButton: document.querySelector(
    "#cancel-membership-renewal-button",
  ),
  confirmMembershipRenewalButton: document.querySelector(
    "#confirm-membership-renewal-button",
  ),
  membershipOperationBenefits: document.querySelector(
    "#membership-operation-benefits",
  ),
  membershipBenefitUsageForm: document.querySelector(
    "#membership-benefit-usage-form",
  ),
  membershipBenefitUsageBenefitIdInput: document.querySelector(
    "#membership-benefit-usage-benefit-id",
  ),
  membershipBenefitUsageSummary: document.querySelector(
    "#membership-benefit-usage-summary",
  ),
  membershipBenefitUsageDateInput: document.querySelector(
    "#membership-benefit-usage-date",
  ),
  membershipBenefitUsageQuantityInput: document.querySelector(
    "#membership-benefit-usage-quantity",
  ),
  membershipBenefitUsageNoteInput: document.querySelector(
    "#membership-benefit-usage-note",
  ),
  membershipBenefitUsageDateError: document.querySelector(
    "#membership-benefit-usage-date-error",
  ),
  membershipBenefitUsageQuantityError: document.querySelector(
    "#membership-benefit-usage-quantity-error",
  ),
  membershipBenefitUsageNoteError: document.querySelector(
    "#membership-benefit-usage-note-error",
  ),
  cancelMembershipBenefitUsageButton: document.querySelector(
    "#cancel-membership-benefit-usage-button",
  ),
  confirmMembershipBenefitUsageButton: document.querySelector(
    "#confirm-membership-benefit-usage-button",
  ),
  membershipOperationUsages: document.querySelector(
    "#membership-operation-usages",
  ),
  membershipOperationTransactions: document.querySelector(
    "#membership-operation-transactions",
  ),
  historyPanel: document.querySelector("#history-panel"),
  historySummary: document.querySelector("#history-summary"),
  historyList: document.querySelector("#history-list"),
  historyError: document.querySelector("#history-error"),
  purchaseForm: document.querySelector("#purchase-form"),
  purchaseInvoiceInput: document.querySelector("#purchase-invoice-number"),
  purchaseDateInput: document.querySelector("#purchase-date"),
  purchaseAmountInput: document.querySelector("#purchase-amount"),
  purchaseInvoiceError: document.querySelector(
    "#purchase-invoice-number-error",
  ),
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
  membershipFinancialReportForm: document.querySelector(
    "#membership-financial-report-form",
  ),
  membershipFinancialReportFromInput: document.querySelector(
    "#membership-financial-report-from",
  ),
  membershipFinancialReportToInput: document.querySelector(
    "#membership-financial-report-to",
  ),
  membershipFinancialReportError: document.querySelector(
    "#membership-financial-report-error",
  ),
  membershipFinancialReportStatus: document.querySelector(
    "#membership-financial-report-status",
  ),
  membershipFinancialReportSummary: document.querySelector(
    "#membership-financial-report-summary",
  ),
  membershipFinancialPaymentSummary: document.querySelector(
    "#membership-financial-payment-summary",
  ),
  membershipFinancialReportEmpty: document.querySelector(
    "#membership-financial-report-empty",
  ),
  membershipFinancialReportTableWrap: document.querySelector(
    "#membership-financial-report-table-wrap",
  ),
  membershipFinancialReportTableBody: document.querySelector(
    "#membership-financial-report-table-body",
  ),
  loadMembershipFinancialReportButton: document.querySelector(
    "#load-membership-financial-report-button",
  ),
  exportMembershipFinancialReportButton: document.querySelector(
    "#export-membership-financial-report-button",
  ),
  reportTabs: document.querySelectorAll("[data-report-view]"),
  reportPanels: document.querySelectorAll("[data-report-panel]"),
  customerReportForm: document.querySelector("#customer-report-form"),
  customerReportSearchInput: document.querySelector("#customer-report-search"),
  customerReportFromInput: document.querySelector("#customer-report-from"),
  customerReportToInput: document.querySelector("#customer-report-to"),
  customerReportTypeInput: document.querySelector("#customer-report-type"),
  customerReportError: document.querySelector("#customer-report-error"),
  customerReportStatus: document.querySelector("#customer-report-status"),
  customerReportSummary: document.querySelector("#customer-report-summary"),
  customerReportCandidates: document.querySelector(
    "#customer-report-candidates",
  ),
  customerReportEmpty: document.querySelector("#customer-report-empty"),
  customerReportTableWrap: document.querySelector(
    "#customer-report-table-wrap",
  ),
  customerReportTableBody: document.querySelector(
    "#customer-report-table-body",
  ),
  loadCustomerReportButton: document.querySelector(
    "#load-customer-report-button",
  ),
  exportCustomerReportButton: document.querySelector(
    "#export-customer-report-button",
  ),
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
  exportAuditButton: document.querySelector("#export-audit-button"),
  companyForm: document.querySelector("#company-form"),
  companyNameInput: document.querySelector("#company-name"),
  companyEmailInput: document.querySelector("#company-email"),
  companyPhoneInput: document.querySelector("#company-phone"),
  companyPointsPercentageInput: document.querySelector(
    "#company-points-percentage",
  ),
  companyNameError: document.querySelector("#company-name-error"),
  companyEmailError: document.querySelector("#company-email-error"),
  companyPhoneError: document.querySelector("#company-phone-error"),
  companyPointsPercentageError: document.querySelector(
    "#company-points-percentage-error",
  ),
  companyLogoFileInput: document.querySelector("#company-logo-file"),
  companyLogoFileError: document.querySelector("#company-logo-file-error"),
  companyLogoPreviewText: document.querySelector("#company-logo-preview-text"),
  companyLogoPreviewImage: document.querySelector(
    "#company-logo-preview-image",
  ),
  companyLogoStatus: document.querySelector("#company-logo-status"),
  companyLogoError: document.querySelector("#company-logo-error"),
  uploadCompanyLogoButton: document.querySelector(
    "#upload-company-logo-button",
  ),
  clearCompanyLogoButton: document.querySelector("#clear-company-logo-button"),
  companyStatus: document.querySelector("#company-status"),
  companyError: document.querySelector("#company-error"),
  companyEmpty: document.querySelector("#company-empty"),
  companyCurrentStatus: document.querySelector("#company-current-status"),
  companyCurrentUpdated: document.querySelector("#company-current-updated"),
  companyCurrentLogo: document.querySelector("#company-current-logo"),
  reloadCompanyButton: document.querySelector("#reload-company-button"),
  saveCompanyButton: document.querySelector("#save-company-button"),
  companyPasswordForm: document.querySelector("#company-password-form"),
  companyCurrentPasswordInput: document.querySelector(
    "#company-current-password",
  ),
  companyNewPasswordInput: document.querySelector("#company-new-password"),
  companyNewPasswordConfirmationInput: document.querySelector(
    "#company-new-password-confirmation",
  ),
  companyCurrentPasswordError: document.querySelector(
    "#company-current-password-error",
  ),
  companyNewPasswordError: document.querySelector(
    "#company-new-password-error",
  ),
  companyNewPasswordConfirmationError: document.querySelector(
    "#company-new-password-confirmation-error",
  ),
  companyPasswordStatus: document.querySelector("#company-password-status"),
  companyPasswordError: document.querySelector("#company-password-error"),
  saveCompanyPasswordButton: document.querySelector(
    "#save-company-password-button",
  ),
  resetCompanyPasswordFormButton: document.querySelector(
    "#reset-company-password-form-button",
  ),
  toggleCompanyPasswordPanelButton: document.querySelector(
    "#toggle-company-password-panel",
  ),
  toggleCompanyCurrentPasswordButton: document.querySelector(
    "#toggle-company-current-password",
  ),
  toggleCompanyNewPasswordButton: document.querySelector(
    "#toggle-company-new-password",
  ),
  toggleCompanyNewPasswordConfirmationButton: document.querySelector(
    "#toggle-company-new-password-confirmation",
  ),
  companyRegistrationForm: document.querySelector("#company-registration-form"),
  registrationCompanyNameInput: document.querySelector(
    "#registration-company-name",
  ),
  registrationCompanyEmailInput: document.querySelector(
    "#registration-company-email",
  ),
  registrationCompanyAddressInput: document.querySelector(
    "#registration-company-address",
  ),
  registrationCompanyPhoneInput: document.querySelector(
    "#registration-company-phone",
  ),
  registrationContactNameInput: document.querySelector(
    "#registration-contact-name",
  ),
  registrationContactEmailInput: document.querySelector(
    "#registration-contact-email",
  ),
  registrationContactPhoneInput: document.querySelector(
    "#registration-contact-phone",
  ),
  registrationCompanyNameError: document.querySelector(
    "#registration-company-name-error",
  ),
  registrationCompanyEmailError: document.querySelector(
    "#registration-company-email-error",
  ),
  registrationCompanyAddressError: document.querySelector(
    "#registration-company-address-error",
  ),
  registrationCompanyPhoneError: document.querySelector(
    "#registration-company-phone-error",
  ),
  registrationContactNameError: document.querySelector(
    "#registration-contact-name-error",
  ),
  registrationContactEmailError: document.querySelector(
    "#registration-contact-email-error",
  ),
  registrationContactPhoneError: document.querySelector(
    "#registration-contact-phone-error",
  ),
  registrationLogoFileInput: document.querySelector("#registration-logo-file"),
  registrationLogoFileError: document.querySelector(
    "#registration-logo-file-error",
  ),
  registrationLogoPreviewText: document.querySelector(
    "#registration-logo-preview-text",
  ),
  registrationLogoPreviewImage: document.querySelector(
    "#registration-logo-preview-image",
  ),
  clearRegistrationLogoButton: document.querySelector(
    "#clear-registration-logo-button",
  ),
  registrationStatus: document.querySelector("#registration-status"),
  registrationError: document.querySelector("#registration-error"),
  registrationResult: document.querySelector("#registration-result"),
  resetRegistrationButton: document.querySelector("#reset-registration-button"),
  submitRegistrationButton: document.querySelector(
    "#submit-registration-button",
  ),
  membershipPlansList: document.querySelector("#membership-plans-list"),
  membershipPlansStatus: document.querySelector("#membership-plans-status"),
  membershipPlansError: document.querySelector("#membership-plans-error"),
  reloadMembershipPlansButton: document.querySelector(
    "#reload-membership-plans-button",
  ),
  membershipPlanForm: document.querySelector("#membership-plan-form"),
  membershipPlanIdInput: document.querySelector("#membership-plan-id"),
  membershipPlanNameInput: document.querySelector("#membership-plan-name"),
  membershipPlanDescriptionInput: document.querySelector(
    "#membership-plan-description",
  ),
  membershipPlanDurationDaysInput: document.querySelector(
    "#membership-plan-duration-days",
  ),
  membershipPlanPriceInput: document.querySelector("#membership-plan-price"),
  membershipPlanRenewalNoticeDaysInput: document.querySelector(
    "#membership-plan-renewal-notice-days",
  ),
  membershipPlanNameError: document.querySelector(
    "#membership-plan-name-error",
  ),
  membershipPlanDescriptionError: document.querySelector(
    "#membership-plan-description-error",
  ),
  membershipPlanDurationDaysError: document.querySelector(
    "#membership-plan-duration-days-error",
  ),
  membershipPlanPriceError: document.querySelector(
    "#membership-plan-price-error",
  ),
  membershipPlanRenewalNoticeDaysError: document.querySelector(
    "#membership-plan-renewal-notice-days-error",
  ),
  saveMembershipPlanButton: document.querySelector(
    "#save-membership-plan-button",
  ),
  resetMembershipPlanButton: document.querySelector(
    "#reset-membership-plan-button",
  ),
  cancelMembershipPlanButton: document.querySelector(
    "#cancel-membership-plan-button",
  ),
  membershipExpirationForm: document.querySelector(
    "#membership-expiration-form",
  ),
  membershipExpirationWithinDaysInput: document.querySelector(
    "#membership-expiration-within-days",
  ),
  membershipExpirationWithinDaysError: document.querySelector(
    "#membership-expiration-within-days-error",
  ),
  reloadMembershipExpirationButton: document.querySelector(
    "#reload-membership-expiration-button",
  ),
  loadMembershipExpirationButton: document.querySelector(
    "#load-membership-expiration-button",
  ),
  membershipExpirationStatus: document.querySelector(
    "#membership-expiration-status",
  ),
  membershipExpirationError: document.querySelector(
    "#membership-expiration-error",
  ),
  membershipExpiringList: document.querySelector("#membership-expiring-list"),
  membershipExpiredList: document.querySelector("#membership-expired-list"),
  membershipBenefitsContext: document.querySelector(
    "#membership-benefits-context",
  ),
  membershipBenefitsList: document.querySelector("#membership-benefits-list"),
  membershipBenefitsStatus: document.querySelector(
    "#membership-benefits-status",
  ),
  membershipBenefitsError: document.querySelector("#membership-benefits-error"),
  membershipBenefitForm: document.querySelector("#membership-benefit-form"),
  membershipBenefitIdInput: document.querySelector("#membership-benefit-id"),
  membershipBenefitNameInput: document.querySelector(
    "#membership-benefit-name",
  ),
  membershipBenefitDescriptionInput: document.querySelector(
    "#membership-benefit-description",
  ),
  membershipBenefitTypeInput: document.querySelector(
    "#membership-benefit-type",
  ),
  membershipBenefitAppliesToTypeInput: document.querySelector(
    "#membership-benefit-applies-to-type",
  ),
  membershipBenefitAppliesToNameInput: document.querySelector(
    "#membership-benefit-applies-to-name",
  ),
  membershipBenefitDiscountPercentInput: document.querySelector(
    "#membership-benefit-discount-percent",
  ),
  membershipBenefitIncludedQuantityInput: document.querySelector(
    "#membership-benefit-included-quantity",
  ),
  membershipBenefitUsageLimitInput: document.querySelector(
    "#membership-benefit-usage-limit",
  ),
  membershipBenefitUsagePeriodInput: document.querySelector(
    "#membership-benefit-usage-period",
  ),
  membershipBenefitNameError: document.querySelector(
    "#membership-benefit-name-error",
  ),
  membershipBenefitDescriptionError: document.querySelector(
    "#membership-benefit-description-error",
  ),
  membershipBenefitTypeError: document.querySelector(
    "#membership-benefit-type-error",
  ),
  membershipBenefitAppliesToTypeError: document.querySelector(
    "#membership-benefit-applies-to-type-error",
  ),
  membershipBenefitAppliesToNameError: document.querySelector(
    "#membership-benefit-applies-to-name-error",
  ),
  membershipBenefitDiscountPercentError: document.querySelector(
    "#membership-benefit-discount-percent-error",
  ),
  membershipBenefitIncludedQuantityError: document.querySelector(
    "#membership-benefit-included-quantity-error",
  ),
  membershipBenefitUsageLimitError: document.querySelector(
    "#membership-benefit-usage-limit-error",
  ),
  membershipBenefitUsagePeriodError: document.querySelector(
    "#membership-benefit-usage-period-error",
  ),
  saveMembershipBenefitButton: document.querySelector(
    "#save-membership-benefit-button",
  ),
  resetMembershipBenefitButton: document.querySelector(
    "#reset-membership-benefit-button",
  ),
  cancelMembershipBenefitButton: document.querySelector(
    "#cancel-membership-benefit-button",
  ),
  membershipCustomerSearchForm: document.querySelector(
    "#membership-activation-search-form",
  ),
  membershipCustomerSearchInput: document.querySelector(
    "#membership-customer-search",
  ),
  searchMembershipCustomerButton: document.querySelector(
    "#search-membership-customer-button",
  ),
  membershipCustomerSearchStatus: document.querySelector(
    "#membership-customer-search-status",
  ),
  membershipCustomerSearchError: document.querySelector(
    "#membership-customer-search-error",
  ),
  membershipCustomerResults: document.querySelector(
    "#membership-customer-results",
  ),
  membershipActivationForm: document.querySelector(
    "#membership-activation-form",
  ),
  membershipSelectedCustomer: document.querySelector(
    "#membership-selected-customer",
  ),
  membershipPointsContext: document.querySelector("#membership-points-context"),
  membershipActivationPlanInput: document.querySelector(
    "#membership-activation-plan",
  ),
  membershipActivationStartDateInput: document.querySelector(
    "#membership-activation-start-date",
  ),
  membershipActivationPricePaidInput: document.querySelector(
    "#membership-activation-price-paid",
  ),
  membershipActivationPaymentMethodInput: document.querySelector(
    "#membership-activation-payment-method",
  ),
  membershipActivationPlanError: document.querySelector(
    "#membership-activation-plan-error",
  ),
  membershipActivationStartDateError: document.querySelector(
    "#membership-activation-start-date-error",
  ),
  membershipActivationPricePaidError: document.querySelector(
    "#membership-activation-price-paid-error",
  ),
  membershipActivationPaymentMethodError: document.querySelector(
    "#membership-activation-payment-method-error",
  ),
  membershipActivationPreview: document.querySelector(
    "#membership-activation-preview",
  ),
  membershipActivationStatus: document.querySelector(
    "#membership-activation-status",
  ),
  membershipActivationError: document.querySelector(
    "#membership-activation-error",
  ),
  activateMembershipButton: document.querySelector(
    "#activate-membership-button",
  ),
  reloadCustomerMembershipsButton: document.querySelector(
    "#reload-customer-memberships-button",
  ),
  membershipCustomerMembershipsStatus: document.querySelector(
    "#membership-customer-memberships-status",
  ),
  membershipCustomerMembershipsError: document.querySelector(
    "#membership-customer-memberships-error",
  ),
  membershipCustomerMembershipsList: document.querySelector(
    "#membership-customer-memberships-list",
  ),
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
  loadAdminRequestsButton: document.querySelector(
    "#load-admin-requests-button",
  ),
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
  adminConfirmationMessage: document.querySelector(
    "#admin-confirmation-message",
  ),
  adminConfirmationCancel: document.querySelector("#admin-confirmation-cancel"),
  adminConfirmationConfirm: document.querySelector(
    "#admin-confirmation-confirm",
  ),
};

const ICON_PATHS = {
  "arrow-left": '<path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path>',
  "arrow-right": '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
  "bar-chart":
    '<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-5"></path><path d="M13 16V8"></path><path d="M18 16v-3"></path>',
  check: '<path d="m5 12 4 4L19 6"></path>',
  "circle-minus":
    '<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path>',
  "clipboard-list":
    '<path d="M9 5h6"></path><path d="M9 3h6v4H9z"></path><path d="M7 5H5v16h14V5h-2"></path><path d="M8 12h.01"></path><path d="M11 12h5"></path><path d="M8 16h.01"></path><path d="M11 16h5"></path>',
  crown:
    '<path d="m3 7 4 5 5-7 5 7 4-5-2 11H5z"></path><path d="M5 21h14"></path>',
  download:
    '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="3"></circle>',
  "eye-off":
    '<path d="m3 3 18 18"></path><path d="M10.6 10.6a3 3 0 0 0 2.8 2.8"></path><path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.1 4.1"></path><path d="M6.1 6.8C3.4 8.6 2 12 2 12s3.5 7 10 7c1.2 0 2.3-.2 3.3-.6"></path>',
  gift: '<path d="M20 12v8H4v-8"></path><path d="M2 7h20v5H2z"></path><path d="M12 22V7"></path><path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5c0 1.4 1 2.5 1 2.5Z"></path><path d="M12 7h3.5A2.5 2.5 0 1 0 13 4.5c0 1.4-1 2.5-1 2.5Z"></path>',
  key: '<circle cx="8" cy="15" r="4"></circle><path d="m11 12 8-8"></path><path d="m17 6 2 2"></path>',
  "log-in":
    '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path>',
  "log-out":
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
  plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  receipt:
    '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path><path d="M9 16h4"></path>',
  refresh:
    '<path d="M20 12a8 8 0 0 1-13.7 5.7L4 15"></path><path d="M4 20v-5h5"></path><path d="M4 12A8 8 0 0 1 17.7 6.3L20 9"></path><path d="M20 4v5h-5"></path>',
  save: '<path d="M5 3h12l2 2v16H5z"></path><path d="M8 3v6h8"></path><path d="M8 21v-7h8v7"></path>',
  search:
    '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
  send: '<path d="m22 2-7 20-4-9-9-4z"></path><path d="M22 2 11 13"></path>',
  "shield-check":
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path>',
  upload:
    '<path d="M12 21V9"></path><path d="m7 14 5-5 5 5"></path><path d="M5 3h14"></path>',
  user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  "user-plus":
    '<circle cx="10" cy="8" r="4"></circle><path d="M3 21a7 7 0 0 1 14 0"></path><path d="M19 8v6"></path><path d="M16 11h6"></path>',
  x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
};

const LEGACY_ICON_NAMES = {
  "+": "plus",
  "✓": "check",
  "×": "x",
  "⌕": "search",
  "↻": "refresh",
  "★": "gift",
  "↑": "upload",
  "↓": "download",
  "→": "arrow-right",
  "←": "arrow-left",
};

function getIconName(value) {
  const iconName = String(value || "").trim();
  return LEGACY_ICON_NAMES[iconName] || iconName;
}

function createIconMarkup(iconName) {
  const paths = ICON_PATHS[getIconName(iconName)];
  if (!paths) {
    return "";
  }

  return `<span class="button-icon" data-rendered-icon aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg></span>`;
}

function applyButtonIcon(button) {
  if (!button) {
    return;
  }

  button
    .querySelectorAll("[data-rendered-icon]")
    .forEach((icon) => icon.remove());
  const iconMarkup = createIconMarkup(button.dataset.icon);

  if (!iconMarkup) {
    button.classList.remove("has-svg-icon", "is-icon-only");
    return;
  }

  button.insertAdjacentHTML("afterbegin", iconMarkup);
  button.classList.add("has-svg-icon");
  button.classList.toggle("is-icon-only", button.textContent.trim() === "");
}

function applyButtonIcons(root = document) {
  root
    .querySelectorAll("button[data-icon], .button-link[data-icon]")
    .forEach(applyButtonIcon);
}

function setButtonText(button, text) {
  button.textContent = text;
  applyButtonIcon(button);
}

function observeIconButtons() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) {
          return;
        }

        if (node.matches("button[data-icon], .button-link[data-icon]")) {
          applyButtonIcon(node);
        }

        applyButtonIcons(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

let currentCustomers = [];
let selectedCustomer = null;
let currentReport = null;
let currentMembershipFinancialReport = null;
let currentCustomerReport = null;
let currentAuditEvents = null;
let currentCompanySettings = null;
let currentOperationalEmailSettings = null;
let currentOperationalEmailHistory = [];
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
let activeCommunicationFilter = "all";
let activeCommunicationCustomerSearch = "";
let activeCompanySubsection = "profile";
let activeCommunicationView = "send";
let isCommunicationCampaignFormOpen = false;
let isCommunicationPreviewExpanded = false;
let isManagingNewPromotionalCampaign = false;
let currentPromotionalCampaign = null;
let managedPromotionalCampaign = null;
let communicationCampaigns = [];
let promotionalRecipients = [];
let selectedPromotionalRecipientIds = new Set();
const customerBalances = new Map();
const communicationPreviewCustomer = {
  name: "María Fernández",
  email: "maria@example.com",
  pointsBalance: 1250,
};
const communicationDefaultBody =
  "Hola {{customer.name}}, {{company.name}} tiene una promoción para clientes de Punto Club.";
let communicationCustomers = [
  {
    name: "María Fernández",
    email: "maria@example.com",
    pointsBalance: 1250,
    status: "subscribed",
  },
  {
    name: "Carlos Mora",
    email: "carlos@example.com",
    pointsBalance: 840,
    status: "subscribed",
  },
  {
    name: "Ana Jiménez",
    email: "ana@example.com",
    pointsBalance: 0,
    status: "unsubscribed",
  },
  {
    name: "Cliente sin correo",
    email: "",
    pointsBalance: 320,
    status: "blocked",
  },
];
let communicationHistory = [
  {
    date: "2026-06-29",
    type: "Compra registrada",
    recipient: "maria@example.com",
    status: "Entregado",
  },
  {
    date: "2026-06-29",
    type: "Canje registrado",
    recipient: "carlos@example.com",
    status: "En cola",
  },
  {
    date: "2026-06-28",
    type: "Promoción local",
    recipient: "ana@example.com",
    status: "Bloqueado por baja",
  },
];
const invitationToken = getInvitationTokenFromUrl();
const passwordResetToken = getPasswordResetTokenFromUrl();
const isInvitationPage = isCompanyInvitationRoute();
const isPasswordResetPage = isCompanyPasswordResetRoute();
const isProductPage = isProductRoute();
const isOperationalAppPage = isOperationalAppRoute();
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
elements.customerReportFromInput.value = getToday();
elements.customerReportToInput.value = getToday();
elements.auditFromInput.value = getToday();
elements.auditToInput.value = getToday();
elements.membershipActivationStartDateInput.value = getToday();
elements.membershipExpirationWithinDaysInput.value = "5";
elements.communicationCampaignBodyInput.value = communicationDefaultBody;
applyButtonIcons();
observeIconButtons();

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

  openMembershipBenefitUsageConfirmation(
    button.dataset.membershipUsageBenefitId,
  );
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

elements.membershipBenefitUsageForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    await submitMembershipBenefitUsage();
  },
);

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

elements.membershipFinancialReportForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    await loadMembershipFinancialReport();
  },
);

elements.exportMembershipFinancialReportButton.addEventListener("click", () => {
  exportMembershipFinancialReportCsv();
});

elements.reportTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveReportView(tab.dataset.reportView);
  });
});

elements.customerReportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadCustomerReport();
});

elements.exportCustomerReportButton.addEventListener("click", () => {
  exportCustomerReportCsv();
});

elements.auditForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadAuditEvents();
});

elements.exportAuditButton.addEventListener("click", () => {
  exportAuditCsv();
});

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanyLogin();
});

elements.passwordResetRequestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitPasswordResetRequest();
});

elements.togglePasswordResetRequestButton.addEventListener("click", () => {
  togglePasswordResetRequestPanel();
});

elements.passwordResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitPasswordResetComplete();
});

elements.toggleLoginPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(
    elements.loginPasswordInput,
    elements.toggleLoginPasswordButton,
  );
});

elements.toggleNewPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(
    elements.newPasswordInput,
    elements.toggleNewPasswordButton,
  );
});

elements.toggleNewPasswordConfirmationButton.addEventListener("click", () => {
  togglePasswordVisibility(
    elements.newPasswordConfirmationInput,
    elements.toggleNewPasswordConfirmationButton,
  );
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

elements.companyPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCompanyPasswordChange();
});

elements.companyOperationalEmailForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    await submitOperationalEmailSettings();
  },
);

elements.companyEmailHistoryLoadButton.addEventListener("click", async () => {
  await loadOperationalEmailHistory();
});

elements.resetCompanyPasswordFormButton.addEventListener("click", () => {
  clearCompanyPasswordForm();
});

elements.toggleCompanyPasswordPanelButton.addEventListener("click", () => {
  setCompanySubsection("access");
});

elements.toggleCompanyCurrentPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(
    elements.companyCurrentPasswordInput,
    elements.toggleCompanyCurrentPasswordButton,
  );
});

elements.toggleCompanyNewPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(
    elements.companyNewPasswordInput,
    elements.toggleCompanyNewPasswordButton,
  );
});

elements.toggleCompanyNewPasswordConfirmationButton.addEventListener(
  "click",
  () => {
    togglePasswordVisibility(
      elements.companyNewPasswordConfirmationInput,
      elements.toggleCompanyNewPasswordConfirmationButton,
    );
  },
);

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

elements.registrationLogoFileInput.addEventListener("change", async () => {
  await previewSelectedRegistrationLogo();
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

elements.reloadMembershipExpirationButton.addEventListener(
  "click",
  async () => {
    await loadMembershipExpirationAlerts();
  },
);

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

elements.membershipCustomerSearchForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    await searchMembershipCustomers();
  },
);

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

  const membershipButton = event.target.closest(
    "[data-profile-membership-action]",
  );
  if (!membershipButton) {
    return;
  }

  if (!isMembershipsEnabled()) {
    return;
  }

  await loadOperationMembershipPanel({ openPanel: true });

  if (
    selectedCustomerActiveMembership &&
    isMembershipCurrentlyUsable(selectedCustomerActiveMembership)
  ) {
    elements.membershipOperationPanel.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    return;
  }

  if (
    selectedCustomerActiveMembership &&
    isMembershipRenewable(selectedCustomerActiveMembership)
  ) {
    openMembershipRenewalForm();
    return;
  }

  elements.membershipPaymentHost.hidden = false;
  elements.membershipActivationForm.hidden = false;
  elements.membershipActivationPlanInput.focus();
});

elements.membershipActivationPlanInput.addEventListener("change", () => {
  const plan = getSelectedActivationPlan();
  elements.membershipActivationPricePaidInput.value = plan
    ? (plan.price ?? "")
    : "";
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
  const button = event.target.closest(
    "[data-admin-request-id], [data-admin-card-action]",
  );
  if (!button) {
    return;
  }

  const request = adminRequests.find(
    (item) => String(item.id) === String(button.dataset.adminRequestId),
  );
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
  } else if (action === "reset-password") {
    await sendSelectedAdminPasswordReset();
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

elements.communicationCampaignForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitPromotionalCampaignDraft();
});

[
  elements.communicationCampaignNameInput,
  elements.communicationCampaignSubjectInput,
  elements.communicationCampaignAudienceInput,
  elements.communicationCampaignBodyInput,
  elements.communicationIncludePointsInput,
].forEach((control) => {
  control.addEventListener("input", renderCommunicationPreview);
  control.addEventListener("change", renderCommunicationPreview);
});

elements.communicationCampaignImageInput.addEventListener("change", () => {
  clearCommunicationCampaignImageMessages();
  if (!canModifyManagedPromotionalCampaignImage()) {
    elements.communicationCampaignImageInput.value = "";
    renderCommunicationCampaignImage(managedPromotionalCampaign?.image || null);
    updatePromotionalSendState();
    return;
  }
  const [file] = elements.communicationCampaignImageInput.files;
  if (!file) {
    renderCommunicationCampaignImage(
      isManagingNewPromotionalCampaign
        ? null
        : managedPromotionalCampaign?.image || null,
    );
    updatePromotionalSendState();
    return;
  }
  const message = getCampaignImageValidationMessage(file);
  if (message) {
    elements.communicationCampaignImageError.textContent = message;
    updatePromotionalSendState();
    return;
  }
  renderCommunicationImageDraft(file);
  updatePromotionalSendState();
});

elements.communicationUploadImageButton.addEventListener("click", async () => {
  await uploadPromotionalCampaignImage();
});

elements.communicationDeleteImageButton.addEventListener("click", async () => {
  await deletePromotionalCampaignImage();
});

elements.communicationNewCampaignButton.addEventListener("click", () => {
  setCommunicationCampaignFormOpen(true, { reset: true });
});

elements.communicationRefreshCampaignsButton.addEventListener(
  "click",
  async () => {
    await loadPromotionalCampaigns({ keepCurrent: true });
  },
);

elements.communicationEditCampaignButton.addEventListener("click", async () => {
  const campaignId = elements.communicationManageCampaignList.value;
  if (!campaignId) {
    return;
  }
  await selectManagedPromotionalCampaign(campaignId);
});

elements.communicationCampaignSearchInput.addEventListener("input", () => {
  renderCommunicationCampaignList();
});

elements.communicationCampaignList.addEventListener("change", async () => {
  if (!elements.communicationCampaignList.value) {
    return;
  }

  await selectPromotionalCampaign(elements.communicationCampaignList.value);
});

elements.communicationManageCampaignList.addEventListener(
  "change",
  async () => {
    const campaignId = elements.communicationManageCampaignList.value;
    if (!campaignId) {
      return;
    }
    await selectManagedPromotionalCampaign(campaignId);
  },
);

elements.communicationFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCommunicationFilter = button.dataset.communicationFilter;
    loadPromotionalRecipients();
  });
});

elements.communicationCustomerSearchInput.addEventListener("input", () => {
  activeCommunicationCustomerSearch =
    elements.communicationCustomerSearchInput.value.trim();
  renderCommunicationCustomers();
});

elements.communicationCustomerList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-promotional-customer-id]");
  if (!checkbox) {
    return;
  }

  if (checkbox.checked) {
    selectedPromotionalRecipientIds.add(checkbox.dataset.promotionalCustomerId);
  } else {
    selectedPromotionalRecipientIds.delete(
      checkbox.dataset.promotionalCustomerId,
    );
  }
  updatePromotionalSelectionSummary();
  updatePromotionalSendState();
});

elements.communicationCustomerList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-promotional-unsubscribe-id]");
  if (!button) {
    return;
  }

  await unsubscribePromotionalCustomer(button.dataset.promotionalUnsubscribeId);
});

elements.communicationSelectAllButton.addEventListener("click", () => {
  selectPromotionalRecipientsByRule((customer) => customer.eligible);
});

elements.communicationSelectPointsButton.addEventListener("click", () => {
  selectPromotionalRecipientsByRule(
    (customer) => customer.eligible && Number(customer.pointsBalance || 0) > 0,
  );
});

elements.communicationClearSelectionButton.addEventListener("click", () => {
  selectedPromotionalRecipientIds = new Set();
  clearCommunicationCampaignMessages();
  renderCommunicationCustomers();
  updatePromotionalSelectionSummary();
  updatePromotionalSendState();
});

elements.communicationSendButton.addEventListener("click", async () => {
  await sendPromotionalCampaign();
});

elements.communicationPreviewToggle.addEventListener("click", () => {
  setCommunicationPreviewExpanded(!isCommunicationPreviewExpanded);
});

elements.companySubsectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (activeSection !== "company") {
      setActiveSection("company", { focus: false });
    }
    setCompanySubsection(button.dataset.companySubsection);
  });
});

elements.companyOpenCampaignsButton.addEventListener("click", async () => {
  await openCommunicationSendView();
});

elements.communicationViewButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (
      button.dataset.communicationView === "send" &&
      !(await ensureCurrentSessionForOperations())
    ) {
      return;
    }
    setCommunicationView(button.dataset.communicationView);
  });
});

elements.navButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (
      button.dataset.sectionTarget === "adminCompanies" &&
      !isAdminCompaniesRoute()
    ) {
      window.location.assign("/admin-companies");
      return;
    }

    if (
      button.dataset.sectionTarget === "communications" &&
      !(await ensureCurrentSessionForOperations())
    ) {
      return;
    }

    setActiveSection(button.dataset.sectionTarget);
    if (button.dataset.sectionTarget === "company") {
      setCompanySubsection("profile");
    }
  });
});

setActiveSection(activeSection, { focus: false });
setCompanySubsection(activeCompanySubsection, { focus: false });
setCommunicationView(activeCommunicationView, { focus: false });
renderSearchPrompt();
resetOperation();
renderReportPrompt();
renderMembershipFinancialReportPrompt();
renderCustomerReportPrompt();
renderAuditPrompt();
renderAdminPrompt();
renderCommunicationPreview();
renderCommunicationHistory();

if (isInvitationPage) {
  showInvitationPage();
  validateCompanyInvitation(invitationToken);
} else if (isPasswordResetPage) {
  showPasswordResetPage();
  validateCompanyPasswordReset(passwordResetToken);
} else if (isProductPage) {
  showProductPage();
} else if (isOperationalAppPage) {
  refreshAuthIdentity({ silent: true }).then((identity) => {
    if (identity) {
      return showMainApp({ focus: false, refreshCompany: true });
    }

    showLoginPage({ replaceRoute: true });
    return null;
  });
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
    requestedSection =
      membershipsEnabled || pointsEnabled ? "operations" : "company";
  }
  if (
    requestedSection === "operations" &&
    !pointsEnabled &&
    !membershipsEnabled
  ) {
    requestedSection = "company";
  }
  const nextSection = [
    "operations",
    "company",
    "memberships",
    "reports",
    "communications",
    "adminCompanies",
  ].includes(requestedSection)
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
  updateCompanySubnavState();

  if (
    (nextSection === "operations" || nextSection === "memberships") &&
    membershipPlans.length === 0 &&
    membershipsEnabled
  ) {
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
    communications: elements.communicationCampaignSearchInput,
    adminCompanies: elements.adminTokenInput,
  }[nextSection];

  window.requestAnimationFrame(() => {
    if (!focusTarget) {
      return;
    }

    if (isCompactViewport()) {
      focusTarget.focus({ preventScroll: true });
      return;
    }

    focusTarget.focus();
  });
}

function setCompanySubsection(subsection, options = {}) {
  const nextSubsection = [
    "profile",
    "logo",
    "access",
    "memberships",
    "communications",
  ].includes(subsection)
    ? subsection
    : "profile";
  activeCompanySubsection = nextSubsection;

  elements.companySubsectionButtons.forEach((button) => {
    const isActive = button.dataset.companySubsection === nextSubsection;
    button.classList.toggle("active", isActive);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  elements.companySubsectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.companyPanel !== nextSubsection;
  });

  if (nextSubsection === "access") {
    setCompanyPasswordPanelVisible(true, {
      focus: options.focus,
      keepForm: true,
    });
  } else {
    setCompanyPasswordPanelVisible(false, { focus: false, keepForm: true });
  }

  if (nextSubsection === "memberships" && isMembershipsEnabled()) {
    if (membershipPlans.length === 0) {
      loadMembershipPlans();
    }
    loadMembershipExpirationAlerts();
  }

  if (options.focus === false) {
    return;
  }

  const focusTarget = {
    profile: elements.companyNameInput,
    logo: elements.companyLogoFileInput,
    access: elements.companyCurrentPasswordInput,
    memberships: elements.membershipConfigHost,
    communications: elements.companyOpenCampaignsButton,
  }[nextSubsection];

  window.requestAnimationFrame(() => {
    focusTarget?.focus({ preventScroll: isCompactViewport() });
  });
}

function updateCompanySubnavState() {
  const isCompanyActive = activeSection === "company";
  if (elements.companySubnav) {
    elements.companySubnav.hidden = !isCompanyActive;
  }
  if (elements.companyNavToggle) {
    elements.companyNavToggle.setAttribute(
      "aria-expanded",
      String(isCompanyActive),
    );
  }
}

function setCommunicationView(view, options = {}) {
  const nextView = ["send", "customers", "history"].includes(view)
    ? view
    : "send";
  activeCommunicationView = nextView;

  elements.communicationViewButtons.forEach((button) => {
    const isActive = button.dataset.communicationView === nextView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.communicationPanels.forEach((panel) => {
    panel.hidden = !String(panel.dataset.communicationPanel || "")
      .split(" ")
      .includes(nextView);
  });

  if (options.focus === false) {
    return;
  }

  const focusTarget = {
    send: elements.communicationCampaignSearchInput,
    customers: elements.communicationFilterButtons[0],
    history: document.querySelector(".communication-history-table"),
  }[nextView];

  window.requestAnimationFrame(() => {
    focusTarget?.focus({ preventScroll: isCompactViewport() });
  });
}

function setCommunicationPreviewExpanded(isExpanded) {
  isCommunicationPreviewExpanded = isExpanded;
  elements.communicationPreviewContent.hidden = !isExpanded;
  elements.communicationPreviewToggle.setAttribute(
    "aria-expanded",
    String(isExpanded),
  );
  setButtonText(
    elements.communicationPreviewToggle,
    isExpanded ? "Ocultar preview" : "Ver preview",
  );
  elements.communicationPreviewToggle
    .closest(".communications-preview-panel")
    ?.classList.toggle("is-collapsed", !isExpanded);
}

async function ensureCurrentSessionForOperations() {
  const identity = await refreshAuthIdentity({ silent: true });

  if (identity) {
    return true;
  }

  redirectToLoginForExpiredSession();
  return false;
}

async function openCommunicationSendView() {
  if (!(await ensureCurrentSessionForOperations())) {
    return;
  }

  setActiveSection("communications");
  setCommunicationView("send");
}

async function loadPromotionalCampaigns(options = {}) {
  clearCommunicationCampaignMessages();

  try {
    const previousSendCampaignId = currentPromotionalCampaign?.id;
    const previousManagedCampaignId = managedPromotionalCampaign?.id;
    const result = await api.listPromotionalCampaigns({
      status: "all",
      limit: 10,
    });
    communicationCampaigns = result.items || [];
    renderCommunicationCampaignList();
    const nextSendCampaign =
      (options.keepCurrent &&
        communicationCampaigns.find(
          (campaign) => String(campaign.id) === String(previousSendCampaignId),
        )) ||
      result.items?.[0] ||
      null;

    const nextManagedCampaign =
      options.keepCurrent &&
      communicationCampaigns.find(
        (campaign) => String(campaign.id) === String(previousManagedCampaignId),
      );

    currentPromotionalCampaign = nextSendCampaign;
    if (currentPromotionalCampaign) {
      await selectPromotionalCampaign(currentPromotionalCampaign.id, {
        silent: true,
      });
    } else {
      selectedPromotionalRecipientIds = new Set();
      updatePromotionalSendState();
      renderCommunicationCampaignList();
      renderCommunicationPreview();
    }

    if (nextManagedCampaign) {
      await selectManagedPromotionalCampaign(nextManagedCampaign.id, {
        silent: true,
      });
    } else if (!managedPromotionalCampaign) {
      setCommunicationCampaignFormOpen(true, { reset: true });
    }
  } catch (error) {
    if (!options.silent) {
      renderCommunicationCampaignError(error);
    }
  }
}

async function selectPromotionalCampaign(campaignId, options = {}) {
  clearCommunicationCampaignMessages();

  try {
    const detail = await api.getPromotionalCampaign(campaignId);
    currentPromotionalCampaign = detail.campaign;
    promotionalRecipients = detail.recipients || [];
    selectedPromotionalRecipientIds = new Set();
    renderCommunicationCampaignList();
    renderCommunicationHistory();
    updatePromotionalSelectionSummary();
    updatePromotionalSendState();
    await loadPromotionalCampaignPreview();
  } catch (error) {
    if (!options.silent) {
      renderCommunicationCampaignError(error);
    }
  }
}

async function selectManagedPromotionalCampaign(campaignId, options = {}) {
  clearCommunicationCampaignMessages();
  clearCommunicationCampaignImageMessages();
  isManagingNewPromotionalCampaign = false;

  try {
    const detail = await api.getPromotionalCampaign(campaignId);
    managedPromotionalCampaign = detail.campaign;
    populatePromotionalCampaignForm(managedPromotionalCampaign);
    renderCommunicationCampaignImage(managedPromotionalCampaign.image || null);
    setCommunicationCampaignFormOpen(true, { reset: false });
    renderCommunicationCampaignList();
  } catch (error) {
    if (!options.silent) {
      renderCommunicationCampaignError(error);
    }
  }
}

async function submitPromotionalCampaignDraft() {
  clearCommunicationCampaignMessages();
  const previousSendCampaignId = currentPromotionalCampaign?.id || "";

  const payload = {
    name: elements.communicationCampaignNameInput.value.trim(),
    subject: elements.communicationCampaignSubjectInput.value.trim(),
    bodyText: elements.communicationCampaignBodyInput.value.trim(),
    includePoints: elements.communicationIncludePointsInput.checked,
  };

  setPromotionalCampaignSubmitting(true);
  try {
    const isNewCampaign =
      isManagingNewPromotionalCampaign || !managedPromotionalCampaign?.id;
    managedPromotionalCampaign = isNewCampaign
      ? await api.createPromotionalCampaign(payload)
      : await api.updatePromotionalCampaign(
          managedPromotionalCampaign.id,
          payload,
        );
    isManagingNewPromotionalCampaign = false;
    communicationCampaigns = isNewCampaign
      ? [
          managedPromotionalCampaign,
          ...communicationCampaigns.filter(
            (campaign) => campaign.id !== managedPromotionalCampaign.id,
          ),
        ]
      : communicationCampaigns.map((campaign) =>
          String(campaign.id) === String(managedPromotionalCampaign.id)
            ? {
                ...campaign,
                ...managedPromotionalCampaign,
                image:
                  managedPromotionalCampaign.image === undefined
                    ? campaign.image || null
                    : managedPromotionalCampaign.image,
              }
            : campaign,
        );
    if (
      currentPromotionalCampaign &&
      String(currentPromotionalCampaign.id) ===
        String(managedPromotionalCampaign.id)
    ) {
      currentPromotionalCampaign = {
        ...currentPromotionalCampaign,
        ...managedPromotionalCampaign,
        image:
          managedPromotionalCampaign.image === undefined
            ? currentPromotionalCampaign.image || null
            : managedPromotionalCampaign.image,
      };
      await loadPromotionalCampaignPreview();
    }
    populatePromotionalCampaignForm(managedPromotionalCampaign);
    renderCommunicationCampaignImage(managedPromotionalCampaign.image || null);
    showCommunicationCampaignStatus(
      isNewCampaign
        ? "Campaña guardada. Ahora puedes agregar una imagen o seleccionarla para envío."
        : "Campaña actualizada.",
    );
    renderCommunicationCampaignList();
    if (!previousSendCampaignId && isNewCampaign) {
      currentPromotionalCampaign = null;
      promotionalRecipients = [];
      selectedPromotionalRecipientIds = new Set();
      elements.communicationCampaignList.value = "";
      renderCommunicationPreview();
      updatePromotionalSelectionSummary();
      updatePromotionalSendState();
    }
  } catch (error) {
    renderCommunicationCampaignError(error);
  } finally {
    setPromotionalCampaignSubmitting(false);
  }
}

async function loadPromotionalCampaignPreview() {
  clearCommunicationCampaignMessages();

  if (!currentPromotionalCampaign) {
    renderCommunicationPreview();
    showCommunicationCampaignStatus(
      "Guarda el borrador para generar preview con el contrato real.",
    );
    return;
  }

  try {
    const preview = await api.previewPromotionalCampaign(
      currentPromotionalCampaign.id,
    );
    if (Object.prototype.hasOwnProperty.call(preview || {}, "image")) {
      currentPromotionalCampaign = {
        ...currentPromotionalCampaign,
        image: preview.image || null,
      };
      communicationCampaigns = communicationCampaigns.map((campaign) =>
        String(campaign.id) === String(currentPromotionalCampaign.id)
          ? currentPromotionalCampaign
          : campaign,
      );
    }
    renderCommunicationPreview(preview);
  } catch (error) {
    renderCommunicationCampaignError(error);
  }
}

async function uploadPromotionalCampaignImage() {
  clearCommunicationCampaignImageMessages();

  if (isManagingNewPromotionalCampaign || !managedPromotionalCampaign?.id) {
    elements.communicationCampaignImageError.textContent =
      "Guarda la campaña para agregar una imagen";
    renderCommunicationCampaignImage(null);
    updatePromotionalSendState();
    return;
  }

  if (!isPromotionalCampaignEditable(managedPromotionalCampaign)) {
    elements.communicationCampaignImageError.textContent =
      "No se puede modificar la imagen de una campaña enviada.";
    updatePromotionalSendState();
    return;
  }

  const [file] = elements.communicationCampaignImageInput.files;
  const validationMessage = getCampaignImageValidationMessage(file);
  if (validationMessage) {
    elements.communicationCampaignImageError.textContent = validationMessage;
    updatePromotionalSendState();
    return;
  }

  setCommunicationImageSubmitting(true);
  try {
    const result = await api.uploadPromotionalCampaignImage(
      managedPromotionalCampaign.id,
      file,
    );
    managedPromotionalCampaign = {
      ...managedPromotionalCampaign,
      image: result.image,
    };
    communicationCampaigns = communicationCampaigns.map((campaign) =>
      String(campaign.id) === String(managedPromotionalCampaign.id)
        ? managedPromotionalCampaign
        : campaign,
    );
    elements.communicationCampaignImageInput.value = "";
    renderCommunicationCampaignImage(result.image);
    if (
      currentPromotionalCampaign &&
      String(currentPromotionalCampaign.id) ===
        String(managedPromotionalCampaign.id)
    ) {
      currentPromotionalCampaign = {
        ...currentPromotionalCampaign,
        image: result.image,
      };
      renderCommunicationPreview();
    }
    updatePromotionalSendState();
    elements.communicationCampaignImageStatus.textContent = "Imagen agregada.";
  } catch (error) {
    renderCommunicationCampaignImageError(error);
  } finally {
    setCommunicationImageSubmitting(false);
    updatePromotionalSendState();
  }
}

async function deletePromotionalCampaignImage() {
  clearCommunicationCampaignImageMessages();

  if (!canModifyManagedPromotionalCampaignImage()) {
    if (isManagingNewPromotionalCampaign || !managedPromotionalCampaign?.id) {
      elements.communicationCampaignImageError.textContent =
        "Guarda la campaña para agregar una imagen";
    } else {
      elements.communicationCampaignImageError.textContent =
        "No se puede modificar la imagen de una campaña enviada.";
    }
    updatePromotionalSendState();
    return;
  }

  if (!managedPromotionalCampaign?.image) {
    return;
  }

  if (!window.confirm("¿Eliminar imagen de esta campaña?")) {
    return;
  }

  setCommunicationImageSubmitting(true);
  try {
    await api.deletePromotionalCampaignImage(managedPromotionalCampaign.id);
    managedPromotionalCampaign = {
      ...managedPromotionalCampaign,
      image: null,
    };
    communicationCampaigns = communicationCampaigns.map((campaign) =>
      String(campaign.id) === String(managedPromotionalCampaign.id)
        ? managedPromotionalCampaign
        : campaign,
    );
    renderCommunicationCampaignImage(null);
    if (
      currentPromotionalCampaign &&
      String(currentPromotionalCampaign.id) ===
        String(managedPromotionalCampaign.id)
    ) {
      currentPromotionalCampaign = {
        ...currentPromotionalCampaign,
        image: null,
      };
      renderCommunicationPreview();
    }
    updatePromotionalSendState();
    elements.communicationCampaignImageStatus.textContent = "Imagen eliminada.";
  } catch (error) {
    renderCommunicationCampaignImageError(error);
  } finally {
    setCommunicationImageSubmitting(false);
    updatePromotionalSendState();
  }
}

async function loadPromotionalRecipients(options = {}) {
  try {
    const result = await api.listPromotionalRecipients({
      status: activeCommunicationFilter,
      limit: 25,
    });
    communicationCustomers = result.items || [];
    renderCommunicationCustomers();
  } catch (error) {
    communicationCustomers = [];
    renderCommunicationCustomers();
    if (!options.silent) {
      renderCommunicationCampaignError(error);
    }
  }
}

async function unsubscribePromotionalCustomer(customerId) {
  clearCommunicationCampaignMessages();

  try {
    const result = await api.unsubscribePromotionalCustomer({
      customerId,
      reason: "Baja registrada desde panel de empresa",
    });
    selectedPromotionalRecipientIds.delete(String(customerId));
    promotionalRecipients = promotionalRecipients.filter(
      (recipient) => String(recipient.customerId) !== String(customerId),
    );
    showCommunicationCampaignStatus(
      result.message ||
        "Baja promocional registrada. Los puntos y beneficios se mantienen.",
    );
    await loadPromotionalRecipients();
    renderCommunicationHistory();
    updatePromotionalSelectionSummary();
    updatePromotionalSendState();
  } catch (error) {
    renderCommunicationCampaignError(error);
  }
}

async function sendPromotionalCampaign() {
  clearCommunicationCampaignMessages();

  if (!currentPromotionalCampaign) {
    showCommunicationCampaignError(
      "Elige una campaña guardada antes de enviar.",
    );
    return;
  }

  const selectedCustomerIds = [...selectedPromotionalRecipientIds];

  if (!selectedCustomerIds.length) {
    showCommunicationCampaignError(
      "Selecciona al menos un destinatario elegible para este envío.",
    );
    return;
  }

  if (selectedCustomerIds.length > 5) {
    showCommunicationCampaignError(
      "El MVP permite hasta 5 destinatarios por envío.",
    );
    return;
  }

  const confirmed = window.confirm(
    `Vas a enviar "${currentPromotionalCampaign.name}" a ${selectedCustomerIds.length} destinatario${selectedCustomerIds.length === 1 ? "" : "s"} seleccionado${selectedCustomerIds.length === 1 ? "" : "s"}. No se enviará a clientes no seleccionados ni dados de baja. ¿Confirmas el envío real?`,
  );

  if (!confirmed) {
    return;
  }

  elements.communicationSendButton.disabled = true;
  elements.communicationSendButton.textContent = "Enviando...";

  try {
    const result = await api.sendPromotionalCampaign(
      currentPromotionalCampaign.id,
      selectedCustomerIds,
    );
    if (result.campaign) {
      currentPromotionalCampaign = {
        ...currentPromotionalCampaign,
        ...result.campaign,
        image:
          result.campaign.image === undefined
            ? currentPromotionalCampaign.image || null
            : result.campaign.image,
      };
    }
    communicationCampaigns = communicationCampaigns.map((campaign) =>
      String(campaign.id) === String(currentPromotionalCampaign.id)
        ? currentPromotionalCampaign
        : campaign,
    );
    promotionalRecipients = result.recipients || promotionalRecipients;
    selectedPromotionalRecipientIds = new Set();
    showPromotionalSendResult(result);
    renderCommunicationHistory();
    renderCommunicationCampaignList();
    renderCommunicationCustomers();
    updatePromotionalSelectionSummary();
  } catch (error) {
    renderCommunicationCampaignError(error, { action: "send" });
  } finally {
    updatePromotionalSendState();
  }
}

function resetPromotionalCampaignForm() {
  isManagingNewPromotionalCampaign = true;
  managedPromotionalCampaign = null;
  elements.communicationCampaignFormTitle.textContent = "Nueva campaña";
  elements.communicationCampaignFormSupport.textContent =
    "Guarda el borrador para agregar imagen y preparar envíos.";
  elements.communicationCampaignNameInput.value = "";
  elements.communicationCampaignSubjectInput.value = "";
  elements.communicationCampaignAudienceInput.value = "subscribed";
  elements.communicationCampaignBodyInput.value = communicationDefaultBody;
  elements.communicationIncludePointsInput.checked = true;
  setPromotionalCampaignContentControlsDisabled(false);
  elements.communicationCampaignImageInput.value = "";
  clearCommunicationCampaignImageMessages();
  renderCommunicationCampaignImage(null);
  setButtonText(elements.communicationSaveCampaignButton, "Guardar borrador");
  elements.communicationSaveCampaignButton.disabled = false;
}

function setCommunicationCampaignFormOpen(isOpen, options = {}) {
  isCommunicationCampaignFormOpen = isOpen;
  elements.communicationCampaignForm.hidden = !isOpen;
  elements.communicationNewCampaignButton.setAttribute(
    "aria-expanded",
    String(isOpen),
  );
  setButtonText(
    elements.communicationNewCampaignButton,
    isOpen ? "Nueva campaña" : "Nueva campaña",
  );

  if (isOpen && options.reset !== false) {
    resetPromotionalCampaignForm();
    window.requestAnimationFrame(() => {
      elements.communicationCampaignNameInput.focus({
        preventScroll: isCompactViewport(),
      });
    });
  } else if (!isOpen && isManagingNewPromotionalCampaign) {
    isManagingNewPromotionalCampaign = false;
    elements.communicationCampaignImageInput.value = "";
    renderCommunicationCampaignImage(managedPromotionalCampaign?.image || null);
  }
}

function populatePromotionalCampaignForm(campaign) {
  elements.communicationCampaignFormTitle.textContent = "Editar campaña";
  elements.communicationCampaignFormSupport.textContent =
    isPromotionalCampaignEditable(campaign)
      ? "Actualiza el contenido de la campaña o gestiona su imagen antes de preparar un envío."
      : "Esta campaña ya no se puede editar. Puedes revisar su contenido e imagen.";
  elements.communicationCampaignNameInput.value = campaign?.name || "";
  elements.communicationCampaignSubjectInput.value = campaign?.subject || "";
  elements.communicationCampaignAudienceInput.value = "subscribed";
  elements.communicationCampaignBodyInput.value =
    campaign?.bodyText || communicationDefaultBody;
  elements.communicationIncludePointsInput.checked = Boolean(
    campaign?.includePoints,
  );
  setPromotionalCampaignContentControlsDisabled(
    !isPromotionalCampaignEditable(campaign),
  );
  setButtonText(
    elements.communicationSaveCampaignButton,
    isPromotionalCampaignEditable(campaign)
      ? "Guardar cambios"
      : "Campaña no editable",
  );
  elements.communicationSaveCampaignButton.disabled =
    !isPromotionalCampaignEditable(campaign);
}

function setPromotionalCampaignContentControlsDisabled(isDisabled) {
  [
    elements.communicationCampaignNameInput,
    elements.communicationCampaignSubjectInput,
    elements.communicationCampaignAudienceInput,
    elements.communicationCampaignBodyInput,
    elements.communicationIncludePointsInput,
  ].forEach((control) => {
    control.disabled = isDisabled;
  });
}

function renderCommunicationCampaignList() {
  if (
    !elements.communicationCampaignList ||
    !elements.communicationManageCampaignList
  ) {
    return;
  }

  const search = normalize(elements.communicationCampaignSearchInput.value);
  const campaigns = communicationCampaigns.filter(
    (campaign) =>
      !search ||
      normalize(campaign.name).includes(search) ||
      normalize(campaign.subject).includes(search),
  );

  if (!campaigns.length) {
    elements.communicationCampaignList.innerHTML =
      '<option value="">No hay campañas guardadas</option>';
    elements.communicationManageCampaignList.innerHTML =
      '<option value="">No hay campañas guardadas</option>';
    elements.communicationCampaignList.disabled = true;
    elements.communicationManageCampaignList.disabled = true;
    elements.communicationEditCampaignButton.disabled = true;
    return;
  }

  elements.communicationCampaignList.disabled = false;
  elements.communicationManageCampaignList.disabled = false;
  elements.communicationEditCampaignButton.disabled = false;
  const campaignOptions = campaigns
    .map(
      (campaign) => `
        <option value="${escapeHtml(campaign.id)}">
          ${escapeHtml(campaign.name)} - ${escapeHtml(campaign.subject)}
        </option>
      `,
    )
    .join("");
  elements.communicationCampaignList.innerHTML = `
    <option value="">Selecciona una campaña para enviar</option>
    ${campaignOptions}
  `;
  elements.communicationManageCampaignList.innerHTML = campaignOptions;
  if (
    currentPromotionalCampaign &&
    campaigns.some(
      (campaign) =>
        String(campaign.id) === String(currentPromotionalCampaign.id),
    )
  ) {
    elements.communicationCampaignList.value = currentPromotionalCampaign.id;
  } else {
    elements.communicationCampaignList.value = "";
  }
  if (
    managedPromotionalCampaign &&
    campaigns.some(
      (campaign) =>
        String(campaign.id) === String(managedPromotionalCampaign.id),
    )
  ) {
    elements.communicationManageCampaignList.value =
      managedPromotionalCampaign.id;
  }
}

function getCampaignImageValidationMessage(file) {
  if (!file) {
    return "Selecciona una imagen para la campaña.";
  }

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
  if (!allowedTypes.has(file.type)) {
    return "Usa una imagen JPG, PNG o WebP.";
  }

  if (file.size > 1048576) {
    return "La imagen supera el límite de 1 MB.";
  }

  return "";
}

function clearCommunicationCampaignImageMessages() {
  elements.communicationCampaignImageError.textContent = "";
  elements.communicationCampaignImageStatus.textContent = "";
}

function isPromotionalCampaignEditable(campaign = managedPromotionalCampaign) {
  if (!campaign?.id) {
    return false;
  }

  return ["draft", "ready"].includes(String(campaign.status || "draft"));
}

function canModifyManagedPromotionalCampaignImage() {
  return (
    !isManagingNewPromotionalCampaign &&
    isPromotionalCampaignEditable(managedPromotionalCampaign)
  );
}

function renderCommunicationImageDraft(file) {
  const draftUrl = URL.createObjectURL(file);
  elements.communicationCampaignImagePreview.src = draftUrl;
  elements.communicationCampaignImagePreview.onload = () => {
    URL.revokeObjectURL(draftUrl);
  };
  elements.communicationCampaignImagePreview.hidden = false;
  elements.communicationCampaignImagePreviewText.hidden = true;
  elements.communicationCampaignImageStatus.textContent =
    "Imagen seleccionada. Presiona Agregar imagen para guardarla antes de enviar.";
}

function renderCommunicationCampaignImage(image) {
  clearCommunicationCampaignImageMessages();
  const imageUrl = image?.imageUrl
    ? api.getCampaignImageUrl(image.imageUrl)
    : "";
  elements.communicationCampaignImagePreview.hidden = !imageUrl;
  elements.communicationCampaignImagePreviewText.hidden = Boolean(imageUrl);
  elements.communicationCampaignImagePreviewText.textContent = "Sin imagen";
  elements.communicationCampaignImagePreview.alt =
    image?.altText || "Preview de imagen de campaña";
  elements.communicationCampaignImagePreview.removeAttribute("src");

  if (imageUrl) {
    elements.communicationCampaignImagePreview.src = imageUrl;
    elements.communicationCampaignImageStatus.textContent = `${image.fileName || "Imagen"} · ${formatFileSize(image.sizeBytes || 0)}`;
  }

  elements.communicationDeleteImageButton.disabled = !imageUrl;
  setButtonText(
    elements.communicationUploadImageButton,
    imageUrl ? "Reemplazar" : "Agregar imagen",
  );
  updateCommunicationCampaignImageControls(imageUrl);
}

function updateCommunicationCampaignImageControls(imageUrl = "") {
  const isNewDraft = isManagingNewPromotionalCampaign;
  const hasSavedCampaign = Boolean(managedPromotionalCampaign?.id);
  const isExistingNotEditable =
    hasSavedCampaign &&
    !isPromotionalCampaignEditable(managedPromotionalCampaign);
  const canModify = canModifyManagedPromotionalCampaignImage();

  elements.communicationCampaignImageInput.disabled = !canModify;
  elements.communicationUploadImageButton.disabled = !canModify;
  elements.communicationDeleteImageButton.disabled = !canModify || !imageUrl;

  if (isNewDraft || !hasSavedCampaign) {
    elements.communicationCampaignImageStatus.textContent =
      "Guarda la campaña para agregar una imagen";
    return;
  }

  if (isExistingNotEditable) {
    elements.communicationCampaignImageError.textContent =
      "No se puede modificar la imagen de una campaña enviada.";
  }
}

function renderCommunicationCampaignImageError(error) {
  const code = error instanceof ApiError ? error.code : "";
  const messages = {
    PROMOTIONAL_CAMPAIGN_IMAGE_REQUIRED:
      "Selecciona una imagen para la campaña.",
    PROMOTIONAL_CAMPAIGN_IMAGE_UNSUPPORTED_TYPE:
      "Usa una imagen JPG, PNG o WebP.",
    PROMOTIONAL_CAMPAIGN_IMAGE_TOO_LARGE: "La imagen supera el límite de 1 MB.",
    PROMOTIONAL_CAMPAIGN_IMAGE_INVALID:
      "No pudimos leer la imagen. Intenta con otro archivo.",
    PROMOTIONAL_CAMPAIGN_NOT_EDITABLE:
      "No se puede modificar la imagen de una campaña enviada.",
    UNAUTHORIZED: "Tu sesión venció. Inicia sesión para continuar.",
    FORBIDDEN: "No tienes permiso para modificar esta campaña.",
  };
  elements.communicationCampaignImageError.textContent =
    messages[code] || "No se pudo guardar la imagen. Intenta de nuevo.";
}

function setCommunicationImageSubmitting(isSubmitting) {
  const canModify = canModifyManagedPromotionalCampaignImage();
  elements.communicationCampaignImageInput.disabled =
    isSubmitting || !canModify;
  elements.communicationUploadImageButton.disabled = isSubmitting || !canModify;
  elements.communicationDeleteImageButton.disabled =
    isSubmitting || !canModify || !managedPromotionalCampaign?.image;
  setButtonText(
    elements.communicationUploadImageButton,
    isSubmitting
      ? "Guardando..."
      : managedPromotionalCampaign?.image
        ? "Reemplazar"
        : "Agregar imagen",
  );
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size >= 1048576) {
    return `${(size / 1048576).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function hasPendingCampaignImageSelection() {
  return (
    canModifyManagedPromotionalCampaignImage() &&
    Boolean(elements.communicationCampaignImageInput.files?.length)
  );
}

function renderCommunicationPreview(preview = null) {
  const companyName = currentCompanySettings?.name || "Punto Club Demo";
  const subject =
    preview?.subject ||
    currentPromotionalCampaign?.subject ||
    "Selecciona una campaña guardada";
  const body =
    preview?.bodyText ||
    currentPromotionalCampaign?.bodyText ||
    "El preview se mostrará cuando tengas una campaña seleccionada.";
  const includePoints = Boolean(currentPromotionalCampaign?.includePoints);
  const image = preview?.image || currentPromotionalCampaign?.image || null;
  const imageUrl = image?.imageUrl
    ? api.getCampaignImageUrl(image.imageUrl)
    : "";
  const renderedBody = preview
    ? body
    : body
        .replaceAll("{{customer.name}}", communicationPreviewCustomer.name)
        .replaceAll("{{company.name}}", companyName)
        .replaceAll(
          "{{points.currentBalance}}",
          formatPoints(communicationPreviewCustomer.pointsBalance),
        )
        .replaceAll("{{promotion.validUntil}}", "31/07/2026");

  elements.communicationPreview.innerHTML = `
    <div class="communication-preview-meta">
      <span>Asunto</span>
      <h3>${escapeHtml(subject)}</h3>
    </div>
    ${
      imageUrl
        ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(image.altText || currentPromotionalCampaign?.name || "Imagen de campaña")}" />`
        : ""
    }
    <p>${escapeHtml(renderedBody)}</p>
    ${
      preview?.pointsLine
        ? `<p><strong>Puntos disponibles:</strong> ${escapeHtml(preview.pointsLine)}</p>`
        : includePoints
          ? `<p><strong>Puntos disponibles:</strong> ${formatPoints(communicationPreviewCustomer.pointsBalance)} pts.</p>`
          : ""
    }
    <div class="communication-preview-footer">
      ${escapeHtml(
        preview?.footerText ||
          `Recibes este correo porque aceptas promociones de ${companyName} en Punto Club. Puedes dejar de recibir promociones sin perder tus puntos, beneficios, membresías ni historial.`,
      )}
    </div>
  `;
}

function renderCommunicationCustomers() {
  elements.communicationFilterButtons.forEach((button) => {
    const isActive =
      button.dataset.communicationFilter === activeCommunicationFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  const customers = communicationCustomers.filter((customer) => {
    const matchesStatus =
      activeCommunicationFilter === "all" ||
      (customer.promotionalStatus || customer.status) ===
        activeCommunicationFilter;
    const search = normalize(activeCommunicationCustomerSearch);
    const matchesSearch =
      !search ||
      normalize(customer.name).includes(search) ||
      normalize(customer.email).includes(search);

    return matchesStatus && matchesSearch;
  });

  if (!customers.length) {
    elements.communicationCustomerList.innerHTML =
      '<div class="empty-state">No hay destinatarios para este filtro.</div>';
    return;
  }

  elements.communicationCustomerList.innerHTML = customers
    .map(renderCommunicationCustomerCard)
    .join("");
}

function renderCommunicationCustomerCard(customer) {
  const customerId = customer.customerId || customer.id || customer.email;
  const status = customer.promotionalStatus || customer.status;
  const checked = selectedPromotionalRecipientIds.has(String(customerId));
  const disabled =
    !customer.eligible || selectedPromotionalRecipientIds.size >= 5;
  const disabledReason = getCommunicationBlockedReason(customer);
  const shouldShowDisabledReason =
    disabledReason && !["unsubscribed", "suppressed"].includes(status);
  return `
    <article class="communication-customer-card${disabled && !checked ? " is-disabled" : ""}">
      <label class="communication-recipient-check">
        <input
          type="checkbox"
          data-promotional-customer-id="${escapeHtml(customerId)}"
          ${checked ? "checked" : ""}
          ${disabled && !checked ? "disabled" : ""}
        />
        <span class="sr-only">Seleccionar destinatario</span>
      </label>
      <div class="communication-customer-identity">
        <strong>${escapeHtml(customer.name)}</strong>
        <span>${customer.email ? escapeHtml(customer.email) : "Sin correo registrado"}</span>
      </div>
      <div class="communication-customer-points">
        <span>Puntos</span>
        <strong>${formatPoints(customer.pointsBalance)}</strong>
      </div>
      <span class="communication-state-pill">${escapeHtml(getCommunicationPreferenceLabel(status))}</span>
      ${
        shouldShowDisabledReason
          ? `<p class="communication-disabled-reason">${escapeHtml(disabledReason)}</p>`
          : ""
      }
      ${
        status === "subscribed"
          ? `<button
              class="secondary-button communication-unsubscribe-button"
              type="button"
              data-promotional-unsubscribe-id="${escapeHtml(customerId)}"
            >
              Dar de baja
            </button>`
          : ""
      }
    </article>
  `;
}

function selectPromotionalRecipientsByRule(predicate) {
  const selectedIds = [];

  for (const customer of communicationCustomers) {
    if (selectedIds.length >= 5) {
      break;
    }

    if (predicate(customer)) {
      selectedIds.push(String(customer.customerId || customer.id));
    }
  }

  selectedPromotionalRecipientIds = new Set(selectedIds);
  renderCommunicationCustomers();
  updatePromotionalSelectionSummary();
  updatePromotionalSendState();
  showCommunicationCampaignStatus(
    `${selectedIds.length} destinatario${selectedIds.length === 1 ? "" : "s"} seleccionado${selectedIds.length === 1 ? "" : "s"} para este envío.`,
  );
}

function renderCommunicationHistory() {
  const rows = promotionalRecipients.length
    ? promotionalRecipients.map((recipient) => ({
        date: recipient.selectedAt?.slice(0, 10) || getToday(),
        type: currentPromotionalCampaign?.name || "Campaña promocional",
        recipient: recipient.recipientEmail,
        status: getPromotionalRecipientStatusLabel(recipient.status),
      }))
    : communicationHistory;

  elements.communicationHistoryBody.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.date)}</td>
          <td>${escapeHtml(item.type)}</td>
          <td>${escapeHtml(item.recipient)}</td>
          <td><span class="communication-state-pill">${escapeHtml(item.status)}</span></td>
        </tr>
      `,
    )
    .join("");
}

function getCommunicationPreferenceLabel(status) {
  const labels = {
    subscribed: "Suscrito",
    unsubscribed: "Baja promocional",
    suppressed: "Suprimido",
    blocked: "No apto",
  };

  return labels[status] ?? "Sin estado";
}

function getCommunicationBlockedReason(customer) {
  if (customer.eligible) {
    return null;
  }

  const reason = customer.blockedReason || customer.blocked || customer.status;
  const labels = {
    missing_email: "No tiene correo válido.",
    unsubscribed: "Dado de baja de promociones.",
    suppressed: "Correo suprimido para promociones.",
    blocked: "No apto para este envío.",
  };

  return labels[reason] || "No apto para este envío.";
}

function getPromotionalRecipientStatusLabel(status) {
  const labels = {
    pending: "Pendiente",
    sent: "Enviado",
    failed: "Fallido",
    skipped: "Omitido",
  };

  return labels[status] ?? "Sin estado";
}

function updatePromotionalSelectionSummary() {
  const count = selectedPromotionalRecipientIds.size;
  elements.communicationSelectedCount.textContent = `${count} seleccionado${count === 1 ? "" : "s"} de 5`;
  elements.communicationClearSelectionButton.disabled = count === 0;
}

function updatePromotionalSendState() {
  const selectedCount = selectedPromotionalRecipientIds.size;
  const canSend =
    Boolean(currentPromotionalCampaign) &&
    selectedCount > 0 &&
    selectedCount <= 5;

  elements.communicationSendButton.disabled = !canSend;
  elements.communicationSendButton.textContent = canSend
    ? `Enviar a ${selectedCount}`
    : "Enviar campaña";
}

function clearCommunicationCampaignMessages() {
  elements.communicationResultPanel.hidden = true;
  elements.communicationCampaignStatus.hidden = true;
  elements.communicationCampaignStatus.replaceChildren();
  elements.communicationCampaignError.textContent = "";
}

function showCommunicationCampaignStatus(message) {
  elements.communicationResultPanel.hidden = false;
  elements.communicationCampaignStatus.hidden = false;
  elements.communicationCampaignStatus.textContent = message;
}

function focusCommunicationCampaignMessage(element) {
  if (!element) {
    return;
  }

  window.requestAnimationFrame(() => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus({ preventScroll: true });
  });
}

function showCommunicationCampaignError(message, shouldFocus = true) {
  elements.communicationResultPanel.hidden = false;
  elements.communicationCampaignError.textContent = message;
  if (shouldFocus) {
    focusCommunicationCampaignMessage(elements.communicationCampaignError);
  }
}

function formatPromotionalResultReason(reason) {
  const rawReason = String(reason || "").trim();

  if (!rawReason) {
    return "";
  }

  const knownReasons = {
    missing_email: "No tiene correo válido.",
    not_found: "Cliente no encontrado.",
    suppressed: "Correo suprimido.",
    unsubscribed: "Cliente dado de baja.",
    provider_not_sent: "El proveedor no confirmó el envío.",
    send_failed: "El proveedor reportó un fallo de envío.",
  };

  if (knownReasons[rawReason]) {
    return knownReasons[rawReason];
  }

  if (/password|secret|token|key|connection string/i.test(rawReason)) {
    return "El servidor rechazó el envío. Revisa el historial técnico.";
  }

  return rawReason.slice(0, 160);
}

function showPromotionalSendResult(result) {
  const summary = result?.summary || {};
  const sent = Number(summary.sent || 0);
  const failed = Number(summary.failed || 0);
  const skipped = Number(summary.skipped || 0);
  const recipients = Array.isArray(result?.recipients) ? result.recipients : [];
  const status = elements.communicationCampaignStatus;
  const heading = document.createElement("strong");
  const details = document.createElement("span");

  heading.textContent = `Envío finalizado: ${sent} enviado${sent === 1 ? "" : "s"}, ${failed} fallido${failed === 1 ? "" : "s"} y ${skipped} omitido${skipped === 1 ? "" : "s"}.`;
  details.textContent = recipients.length
    ? "Resultado guardado para los destinatarios seleccionados."
    : "No se registraron destinatarios procesados.";

  status.replaceChildren(heading, details);

  if (recipients.length) {
    const list = document.createElement("ul");
    list.className = "communication-send-results";

    recipients.forEach((recipient) => {
      const item = document.createElement("li");
      const label = document.createElement("strong");
      const reason = formatPromotionalResultReason(
        recipient.lastError || recipient.skipReason,
      );

      label.textContent = getPromotionalRecipientStatusLabel(recipient.status);
      item.append(label);
      item.append(
        `: ${recipient.customerName || recipient.recipientEmail || "Cliente"}`,
      );

      if (reason) {
        item.append(` - ${reason}`);
      }

      list.append(item);
    });

    status.append(list);
  }

  status.hidden = false;
  elements.communicationResultPanel.hidden = false;
  focusCommunicationCampaignMessage(status);
}

function renderCommunicationCampaignError(error, options = {}) {
  if (isSessionInvalidForActiveCompanyError(error)) {
    redirectToLoginForExpiredSession();
    return;
  }

  if (options.action === "send" && error instanceof ApiError) {
    if (
      error.code === "INTERNAL_ERROR" ||
      error.message === "Unexpected API error."
    ) {
      showCommunicationCampaignError(
        "No pudimos confirmar el envío. No lo reintentes todavía; revisa el historial o contacta soporte para confirmar si hubo intento.",
      );
      return;
    }

    if (
      error.message &&
      !/password|secret|token|key|connection string/i.test(error.message)
    ) {
      showCommunicationCampaignError(error.message);
      return;
    }
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showCommunicationCampaignError("Revisa los campos marcados de la campaña.");
    return;
  }

  if (error instanceof ApiError && error.code === "PROMOTIONAL_SEND_BLOCKED") {
    showCommunicationCampaignError(
      "El envío real de promociones no está habilitado en el servidor.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "PROMOTIONAL_EMAIL_NOT_CONFIGURED"
  ) {
    showCommunicationCampaignError(
      "El remitente de correo promocional no está configurado.",
    );
    return;
  }

  const safeMessage =
    error instanceof ApiError &&
    error.message &&
    !/password|secret|token|key|connection string/i.test(error.message)
      ? error.message
      : "No pudimos cargar o guardar la campaña promocional.";

  showCommunicationCampaignError(safeMessage);
}

function setPromotionalCampaignSubmitting(isSubmitting) {
  elements.communicationSaveCampaignButton.disabled =
    isSubmitting ||
    (!isManagingNewPromotionalCampaign &&
      !isPromotionalCampaignEditable(managedPromotionalCampaign));
  setButtonText(
    elements.communicationSaveCampaignButton,
    isSubmitting
      ? "Guardando..."
      : isManagingNewPromotionalCampaign
        ? "Guardar borrador"
        : isPromotionalCampaignEditable(managedPromotionalCampaign)
          ? "Guardar cambios"
          : "Campaña no editable",
  );
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
      setCustomersFeedback(
        "No encontramos ese cliente. Completa el registro para crearlo.",
      );
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
    showSuccess(
      `Cliente registrado: ${customer.name}. Ya puedes continuar la atención.`,
    );
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
      "Este cliente ya existe. Búscalo para continuar la atención.",
    );
    return;
  }

  const [customerWithBalance] = await withBalances([match]);
  currentCustomers = [customerWithBalance];
  elements.searchInput.value =
    customerWithBalance.phone || customerWithBalance.email || "";
  setCustomersFeedback("");
  renderCustomers(currentCustomers, elements.searchInput.value);
  await selectCustomer(
    customerWithBalance,
    "Este cliente ya existe. Lo seleccionamos para continuar la atención.",
  );
  showSuccess(
    "Este cliente ya existe. Lo seleccionamos para continuar la atención.",
  );
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
      const samePhone =
        payload.phone.trim() &&
        normalize(customer.phone) === normalize(payload.phone);
      const sameEmail =
        payload.email.trim() &&
        normalize(customer.email) === normalize(payload.email);
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
    String(customer.id) === String(customerId)
      ? { ...customer, balance }
      : customer,
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
  elements.customersList.innerHTML =
    '<div class="loading-state">Buscando clientes...</div>';
}

function renderCustomers(customers, search) {
  if (customers.length === 0) {
    const text = search
      ? "No encontramos clientes con esa búsqueda. Puedes registrar uno nuevo para continuar."
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
        setButtonText(button, "Cargando...");
        selectCustomer(customer)
          .catch((error) => {
            console.error(
              "No se pudo completar la seleccion del cliente.",
              error,
            );
            showOperationStatus(
              "Cliente seleccionado. Algunas secciones pueden tardar en cargar.",
            );
          })
          .finally(() => {
            button.disabled = false;
            setButtonText(button, "Atender");
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
        <button type="button" data-icon="arrow-right" data-action="attend" data-customer-id="${escapeHtml(customer.id)}">Atender</button>
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
    balance:
      customerWithBalance.balance ??
      customerBalances.get(String(customerWithBalance.id)),
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
  resetOperation(
    "Cliente conservado desde Membresías. Selecciona compra, historial o redimir puntos.",
  );
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
  elements.operationEmpty.textContent =
    message ||
    "Selecciona un cliente para ver su resumen y operar puntos o membresías.";
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
    selectedCustomerActiveMembership = getRenewableMembership(
      membershipsResult.items || [],
    );

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

    const isUsableMembership = isMembershipCurrentlyUsable(
      selectedCustomerActiveMembership,
    );
    const [benefitsResult, usagesResult] = isUsableMembership
      ? await Promise.all([
          api.listMembershipBenefits(selectedCustomerActiveMembership.planId, {
            status: "active",
          }),
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
    showMembershipOperationError("Selecciona una membresía antes de renovar.");
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
    await api.renewCustomerMembership(
      operationCustomer.id,
      selectedCustomerActiveMembership.id,
      payload,
    );
    clearMembershipRenewalForm();
    await loadOperationMembershipPanel();
    showMembershipOperationStatus("Membresía renovada.");
  } catch (error) {
    renderMembershipRenewalError(error);
  } finally {
    setMembershipRenewalSubmitting(false);
  }
}

async function submitMembershipBenefitUsage() {
  const operationCustomer = getMembershipOperationCustomer();
  if (
    !operationCustomer ||
    !selectedCustomerActiveMembership ||
    !pendingMembershipBenefitUsage
  ) {
    showMembershipOperationError(
      "Selecciona un beneficio antes de aplicar beneficio.",
    );
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
    const usage = await api.createMembershipBenefitUsage(
      operationCustomer.id,
      payload,
    );
    clearMembershipBenefitUsageForm();
    await loadOperationMembershipPanel();
    showMembershipOperationStatus(
      `Beneficio aplicado: ${usage.benefitName || "beneficio"}.`,
    );
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

    if (
      !selectedCustomer ||
      String(selectedCustomer.id) !== String(customerId)
    ) {
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
    showMembershipFinancialReportError(
      "La fecha hasta debe ser igual o posterior a fecha desde.",
    );
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

function setActiveReportView(view) {
  const activeView = view || "activity";
  elements.reportTabs.forEach((tab) => {
    const isActive = tab.dataset.reportView === activeView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  elements.reportPanels.forEach((panel) => {
    panel.hidden = panel.dataset.reportPanel !== activeView;
  });
}

async function loadCustomerReport() {
  const filters = {
    search: elements.customerReportSearchInput.value.trim(),
    from: elements.customerReportFromInput.value,
    to: elements.customerReportToInput.value,
    type: elements.customerReportTypeInput.value,
  };

  clearCustomerReportMessages();

  if (!filters.search) {
    showCustomerReportError("Ingresa teléfono, nombre o correo del cliente.");
    return;
  }

  if (!filters.from || !filters.to) {
    showCustomerReportError("Selecciona fecha desde y fecha hasta.");
    return;
  }

  if (filters.from > filters.to) {
    showCustomerReportError(
      "La fecha hasta debe ser igual o posterior a fecha desde.",
    );
    return;
  }

  setCustomerReportSubmitting(true);
  renderCustomerReportLoading();

  try {
    const report = await api.getCustomerReport(filters);
    currentCustomerReport = report;
    renderCustomerReport(report);
  } catch (error) {
    currentCustomerReport = null;
    renderCustomerReportError(error);
  } finally {
    setCustomerReportSubmitting(false);
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
    currentAuditEvents = result;
    renderAuditEvents(result);
  } catch (error) {
    currentAuditEvents = null;
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
    await loadOperationalEmailSettings({ silent: true });
    await loadOperationalEmailHistory({ silent: true });
    await loadPromotionalCampaigns({ silent: true });
    await loadPromotionalRecipients({ silent: true });
    if (activeSection === "memberships") {
      await loadMembershipPlans();
    }
  } catch (error) {
    currentCompanySettings = null;
    if (isSessionInvalidForActiveCompanyError(error)) {
      redirectToLoginForExpiredSession();
      return;
    }
    renderActiveCompanyIdentity(currentAuthIdentity?.company || null);
    updateMembershipNavigation(null);
    renderCompanySettingsError(error);
  } finally {
    stopLoading();
    setCompanyLoading(false);
  }
}

async function loadOperationalEmailSettings(options = {}) {
  clearOperationalEmailMessages();

  try {
    const settings = await api.getOperationalEmailSettings();
    currentOperationalEmailSettings = settings;
    renderOperationalEmailSettings(settings);
  } catch (error) {
    currentOperationalEmailSettings = null;
    renderOperationalEmailSettings({
      welcomeEnabled: true,
      purchaseEnabled: true,
      redemptionEnabled: true,
      replyToEmail: "",
    });
    if (!options.silent) {
      renderOperationalEmailError(error);
    }
  }
}

async function loadOperationalEmailHistory(options = {}) {
  clearOperationalEmailHistoryMessages();
  setOperationalEmailHistoryDefaults();
  renderOperationalEmailHistoryLoading();
  setOperationalEmailHistoryLoading(true);

  try {
    const filters = getOperationalEmailHistoryFilters();
    const result = await api.listOperationalEmailHistory(filters);
    currentOperationalEmailHistory = result.items || [];
    renderOperationalEmailHistory(currentOperationalEmailHistory);
    showOperationalEmailHistoryStatus(
      `${currentOperationalEmailHistory.length} correos encontrados.`,
    );
  } catch (error) {
    currentOperationalEmailHistory = [];
    renderOperationalEmailHistory([]);
    if (!options.silent) {
      renderOperationalEmailHistoryError(error);
    }
  } finally {
    setOperationalEmailHistoryLoading(false);
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

async function submitOperationalEmailSettings() {
  clearOperationalEmailMessages();

  if (!validateOperationalEmailSettingsForm()) {
    return;
  }

  setOperationalEmailSubmitting(true);
  const stopLoading = startGlobalLoading("Estamos guardando los correos...");

  const payload = {
    welcomeEnabled: elements.companyEmailWelcomeEnabledInput.checked,
    purchaseEnabled: elements.companyEmailPurchaseEnabledInput.checked,
    redemptionEnabled: elements.companyEmailRedemptionEnabledInput.checked,
    replyToEmail: elements.companyEmailReplyToInput.value.trim() || null,
  };

  try {
    const settings = await api.updateOperationalEmailSettings(payload);
    currentOperationalEmailSettings = settings;
    renderOperationalEmailSettings(settings);
    showOperationalEmailStatus("Correos operativos actualizados.");
  } catch (error) {
    renderOperationalEmailError(error);
  } finally {
    stopLoading();
    setOperationalEmailSubmitting(false);
  }
}

async function submitCompanyPasswordChange() {
  clearCompanyPasswordMessages();

  if (!validateCompanyPasswordChangeForm()) {
    return;
  }

  setCompanyPasswordSubmitting(true);
  const stopLoading = startGlobalLoading(
    "Estamos actualizando la contraseña...",
  );

  try {
    await api.changeCompanyPassword({
      currentPassword: elements.companyCurrentPasswordInput.value,
      newPassword: elements.companyNewPasswordInput.value,
      passwordConfirmation: elements.companyNewPasswordConfirmationInput.value,
    });
    clearCompanyPasswordForm({ keepStatus: true });
    showCompanyPasswordStatus("Contraseña actualizada correctamente.");
  } catch (error) {
    renderCompanyPasswordChangeError(error);
  } finally {
    stopLoading();
    setCompanyPasswordSubmitting(false);
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

    if (
      selectedMembershipPlanId &&
      membershipPlans.some(
        (plan) => String(plan.id) === String(selectedMembershipPlanId),
      )
    ) {
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
  const withinDays = Number(
    elements.membershipExpirationWithinDaysInput.value || 5,
  );

  if (!Number.isInteger(withinDays) || withinDays < 0 || withinDays > 365) {
    elements.membershipExpirationWithinDaysError.textContent =
      "Ingresa un valor de 0 a 365.";
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
      `${formatReportNumber(membershipExpirationAlerts.active.length)} próximas, ${formatReportNumber(membershipExpirationAlerts.expired.length)} vencidas.`,
    );
  } catch (error) {
    membershipExpirationAlerts = { active: [], expired: [] };
    renderMembershipExpirationError(error);
  } finally {
    setMembershipExpirationLoading(false);
  }
}

async function selectMembershipPlan(planId, options = {}) {
  const plan = membershipPlans.find(
    (item) => String(item.id) === String(planId),
  );
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
    showMembershipCustomerSearchError("Ingresa nombre, teléfono o correo.");
    elements.membershipCustomerResults.innerHTML =
      '<div class="empty-state">Busca un cliente existente para activar una membresía.</div>';
    return;
  }

  setMembershipActivationSubmitting(true, { searching: true });
  elements.membershipCustomerResults.innerHTML =
    '<div class="loading-state">Buscando clientes...</div>';

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
  const customer = membershipCustomerResults.find(
    (item) => String(item.id) === String(customerId),
  );
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
  elements.membershipCustomerMembershipsList.innerHTML =
    '<div class="loading-state">Cargando membresías...</div>';
  elements.reloadCustomerMembershipsButton.disabled = true;

  try {
    const result = await api.listCustomerMemberships(
      selectedMembershipCustomer.id,
      { status: "all" },
    );
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
    showMembershipActivationError(
      "Selecciona un cliente antes de activar la membresía.",
    );
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
    showMembershipOperationStatus("Membresía activada.");
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
      showMembershipPlansStatus(
        action === "activate" ? "Plan activado." : "Plan inactivado.",
      );
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
    showMembershipBenefitsError(
      "Selecciona un plan antes de crear beneficios.",
    );
    return;
  }

  setMembershipBenefitSubmitting(true);

  const benefitId = elements.membershipBenefitIdInput.value;
  const payload = {
    name: elements.membershipBenefitNameInput.value,
    description:
      elements.membershipBenefitDescriptionInput.value.trim() || null,
    benefitType: elements.membershipBenefitTypeInput.value,
    appliesToType: elements.membershipBenefitAppliesToTypeInput.value,
    appliesToName:
      elements.membershipBenefitAppliesToNameInput.value.trim() || null,
    discountPercent:
      elements.membershipBenefitDiscountPercentInput.value || null,
    includedQuantity:
      elements.membershipBenefitIncludedQuantityInput.value || null,
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
    showMembershipBenefitsStatus(
      benefitId ? "Beneficio actualizado." : "Beneficio creado.",
    );
  } catch (error) {
    renderMembershipBenefitFormError(error);
  } finally {
    setMembershipBenefitSubmitting(false);
  }
}

async function handleMembershipBenefitAction(button) {
  const benefitId = button.dataset.membershipBenefitId;
  const action = button.dataset.membershipBenefitAction;
  const benefit = membershipBenefits.find(
    (item) => String(item.id) === String(benefitId),
  );

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
      showMembershipBenefitsStatus(
        action === "activate" ? "Beneficio activado." : "Beneficio inactivado.",
      );
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
  const logoValidationMessage = logoFile
    ? await getRegistrationLogoValidationMessage(logoFile)
    : "";

  if (logoValidationMessage) {
    elements.registrationLogoFileError.textContent = logoValidationMessage;
    showCompanyRegistrationError("Revisa el logo antes de enviar los datos.");
    return;
  }

  setCompanyRegistrationSubmitting(true);
  const stopLoading = startGlobalLoading("Estamos enviando los datos...");

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
    elements.adminTokenError.textContent =
      "Ingresa el token interno para cargar empresas por activar.";
    showAdminGlobalError("Token interno requerido.");
    return;
  }

  adminToken = nextToken;
  elements.adminTokenInput.value = "";
  showAdminTokenStatus("Acceso interno activo en esta pestaña.");
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
    elements.adminTokenError.textContent =
      "Ingresa el token interno para cargar empresas por activar.";
    showAdminGlobalError(
      "Ingresa el token interno para cargar empresas por activar.",
    );
    return;
  }

  setAdminLoading(true);
  renderAdminListLoading();
  const stopLoading = startGlobalLoading("Estamos cargando empresas...");

  try {
    const result = await api.listCompanyRegistrationRequests(
      {
        status: elements.adminRequestStatusInput.value || "pending",
        limit: "25",
      },
      adminToken,
    );
    adminRequests = Array.isArray(result.items) ? result.items : [];
    selectedAdminRequest = reconcileSelectedAdminRequest(
      selectedAdminRequest,
      adminRequests,
    );
    renderAdminRequestsList();
    renderAdminDetail();
    showAdminListStatus(
      `Empresas cargadas: ${formatReportNumber(adminRequests.length)}.`,
    );
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
    showAdminDetailError("Selecciona una empresa y confirma el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta empresa ya fue procesada. Actualiza la lista.");
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Activar empresa",
    message: `Vas a activar ${selectedAdminRequest.companyName || "esta empresa"} y enviar un acceso al correo ${selectedAdminRequest.companyEmail || "registrado"}.`,
    confirmLabel: "Activar y enviar",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "approve");
  const stopLoading = startGlobalLoading("Estamos activando la empresa...");

  try {
    const result = await api.approveCompanyRegistrationRequest(
      selectedAdminRequest.id,
      { reviewNote: "Activada desde panel interno." },
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
    showAdminDetailStatus(
      `Empresa activada. El acceso fue enviado a ${selectedAdminRequest.companyEmail}.`,
    );
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    stopLoading();
    setAdminActionLoading(false);
  }
}

async function rejectSelectedAdminRequest() {
  if (!selectedAdminRequest || !adminToken) {
    showAdminDetailError("Selecciona una empresa y confirma el token interno.");
    return;
  }

  if (selectedAdminRequest.status !== "pending") {
    showAdminDetailError("Esta empresa ya fue procesada. Actualiza la lista.");
    return;
  }

  const noteInput =
    elements.adminRequestDetail.querySelector("#admin-reject-note");
  const reviewNote = noteInput?.value.trim() || "";

  if (!reviewNote) {
    showAdminDetailError("Ingresa una nota interna para continuar.");
    noteInput?.focus();
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "No continuar",
    message:
      "Vas a marcar esta empresa como no continuada. La nota queda como referencia interna.",
    confirmLabel: "No continuar",
    danger: true,
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "reject");
  const stopLoading = startGlobalLoading(
    "Estamos guardando la nota interna...",
  );

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
    showAdminDetailStatus("Empresa marcada como no continuada.");
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
    showAdminDetailError("No hay un acceso pendiente para reenviar.");
    return;
  }

  if (invitation.status === "accepted") {
    showAdminDetailError(
      "El acceso ya fue creado. No es necesario reenviarlo.",
    );
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Reenviar acceso",
    message: `Se reenviará el acceso al correo ${invitation.email || selectedAdminRequest.companyEmail}. No se mostrará el enlace en pantalla.`,
    confirmLabel: "Reenviar",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "resend");
  const stopLoading = startGlobalLoading("Estamos reenviando el acceso...");

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
    showAdminDetailStatus(
      `Acceso reenviado a ${result.email || invitation.email}.`,
    );
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    stopLoading();
    setAdminActionLoading(false);
  }
}

async function sendSelectedAdminPasswordReset() {
  const email =
    selectedAdminRequest?.invitation?.email ||
    selectedAdminRequest?.companyEmail;

  if (!email || !adminToken) {
    showAdminDetailError(
      "No hay un correo de empresa disponible para enviar el reset.",
    );
    return;
  }

  const confirmed = await requestAdminConfirmation({
    title: "Enviar reset de acceso",
    message: `Se enviará un correo para restablecer la contraseña de ${email}. No se mostrará el enlace en pantalla.`,
    confirmLabel: "Enviar reset",
  });
  if (!confirmed) {
    return;
  }

  clearAdminMessages({ keepTokenStatus: true });
  setAdminActionLoading(true, "reset-password");
  const stopLoading = startGlobalLoading("Estamos enviando el reset...");

  try {
    const result = await api.requestCompanyPasswordReset({ email }, adminToken);
    showAdminDetailStatus(`Reset enviado a ${result.email || email}.`);
  } catch (error) {
    renderAdminActionError(error);
  } finally {
    stopLoading();
    setAdminActionLoading(false);
  }
}

async function validateCompanyPasswordReset(token) {
  renderPasswordResetLoading();

  if (!token) {
    renderPasswordResetUnavailable("invalid");
    return;
  }

  try {
    const result = await api.validateCompanyPasswordReset(token);

    if (result.valid) {
      renderPasswordResetValid(result);
      return;
    }

    renderPasswordResetUnavailable(result.reason || "invalid");
  } catch (error) {
    renderPasswordResetUnavailable("service");
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
  const stopLoading = startGlobalLoading("Estamos accediendo a tu panel...");

  try {
    await api.loginCompany({
      email: elements.loginEmailInput.value,
      password: elements.loginPasswordInput.value,
    });
    let identity;
    try {
      identity = await api.getCurrentCompanyUser();
    } catch (sessionError) {
      if (
        sessionError instanceof ApiError &&
        sessionError.code === "UNAUTHORIZED"
      ) {
        throw new ApiError(
          "SESSION_NOT_PERSISTED",
          "Login succeeded but the browser did not keep the session.",
        );
      }
      throw sessionError;
    }
    currentAuthIdentity = identity;
    renderAuthIdentity(identity);
    elements.loginPasswordInput.value = "";
    await showMainApp({
      replaceLoginRoute: true,
      focus: true,
      refreshCompany: true,
    });
  } catch (error) {
    renderLoginError(error);
  } finally {
    stopLoading();
    setLoginSubmitting(false);
  }
}

async function submitPasswordResetRequest() {
  clearPasswordResetRequestMessages();
  const email = elements.passwordResetEmailInput.value.trim();

  if (!isEmail(email)) {
    elements.passwordResetEmailError.textContent = "Ingresa un correo válido.";
    showPasswordResetRequestError("Revisa los datos ingresados.");
    return;
  }

  setPasswordResetRequestSubmitting(true);
  const stopLoading = startGlobalLoading("Estamos enviando instrucciones...");

  try {
    await api.requestCompanyPasswordReset({ email });
    showPasswordResetRequestStatus(
      "Si el correo está registrado, enviaremos instrucciones para restablecer la contraseña.",
    );
  } catch (error) {
    renderPasswordResetRequestError(error);
  } finally {
    stopLoading();
    setPasswordResetRequestSubmitting(false);
  }
}

async function submitPasswordResetComplete() {
  clearPasswordResetCompleteMessages();

  if (!validatePasswordResetCompleteForm()) {
    return;
  }

  setPasswordResetSubmitting(true);
  const stopLoading = startGlobalLoading(
    "Estamos guardando la nueva contraseña...",
  );

  try {
    await api.completeCompanyPasswordReset({
      token: passwordResetToken,
      password: elements.newPasswordInput.value,
    });
    elements.passwordResetForm.hidden = true;
    showPasswordResetStatus(
      "Contraseña actualizada. Ya puedes acceder a tu panel con tu nuevo acceso.",
    );
    window.history.replaceState({}, "", "/login");
    window.requestAnimationFrame(() => {
      showLoginPage();
      showLoginStatus(
        "Contraseña actualizada. Accede a tu panel con tu nuevo acceso.",
      );
    });
  } catch (error) {
    renderPasswordResetCompleteError(error);
  } finally {
    stopLoading();
    setPasswordResetSubmitting(false);
  }
}

async function refreshAuthIdentity(options = {}) {
  try {
    const identity = await api.getCurrentCompanyUser();
    currentAuthIdentity = identity;
    renderAuthIdentity(identity);

    if (isCompanyLoginRoute()) {
      await showMainApp({ replaceLoginRoute: true, refreshCompany: true });
    }

    return identity;
  } catch (error) {
    currentAuthIdentity = null;
    renderSignedOut();

    if (
      !options.silent &&
      error instanceof ApiError &&
      error.code === "UNAUTHORIZED"
    ) {
      showLoginError("Tu sesión expiró. Accede nuevamente a tu panel.");
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
  showLoginStatus("Sesión cerrada.");
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
  const membershipExpirationAlert =
    selectedCustomerActiveMembership?.expirationAlert;
  const canRedeem = pointsEnabled && points > 0;
  const membershipAction = getSelectedCustomerMembershipActionLabel();
  const alerts = [
    !selectedCustomer.email ? "Cliente sin correo." : "",
    pointsEnabled && points > 0 ? "Cliente tiene puntos disponibles." : "",
    membershipsEnabled &&
    membershipExpirationAlert &&
    membershipExpirationAlert.state !== "none"
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
                <span>Membresía</span>
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
          ? `<button type="button" data-icon="receipt" data-profile-action="purchase">Registrar compra</button>
             <button class="secondary-button" type="button" data-icon="clipboard-list" data-profile-action="history">Ver historial</button>
             ${canRedeem ? '<button class="secondary-button" type="button" data-icon="gift" data-profile-action="redemption">Redimir puntos</button>' : ""}`
          : ""
      }
      ${
        membershipsEnabled
          ? `<button class="secondary-button" type="button" data-icon="crown" data-profile-membership-action="payment">${membershipAction}</button>`
          : ""
      }
    </div>
  `;
  renderPointsMembershipContext();
}

function renderHistoryLoading() {
  elements.historySummary.innerHTML = "";
  elements.historyList.innerHTML =
    '<div class="loading-state">Cargando historial...</div>';
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
    elements.historyList.innerHTML =
      '<div class="empty-state">Sin movimientos para este cliente.</div>';
    return;
  }

  elements.historyList.innerHTML = items
    .map((item) => renderHistoryItem(item))
    .join("");
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
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND"
      ? "El cliente seleccionado ya no está disponible."
      : "No pudimos cargar el historial. Intenta de nuevo.";
  elements.historySummary.innerHTML = "";
  elements.historyList.innerHTML = "";
  elements.historyError.hidden = false;
  elements.historyError.textContent = message;
}

function renderOperationMembershipLoading() {
  elements.membershipOperationActive.innerHTML =
    '<div class="loading-state">Cargando membresía...</div>';
  elements.membershipOperationBenefits.innerHTML = "";
  elements.membershipOperationUsages.innerHTML = "";
  elements.membershipOperationTransactions.innerHTML = "";
}

function renderOperationMembershipDisabled() {
  elements.membershipOperationActive.innerHTML =
    '<div class="empty-state">Las membresías no están habilitadas para esta empresa.</div>';
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
  const canUseBenefits = isMembershipCurrentlyUsable(
    selectedCustomerActiveMembership,
  );
  elements.membershipOperationActive.innerHTML = `
    <article class="membership-card membership-operation-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(selectedCustomerActiveMembership.planName || selectedCustomerActiveMembership.plan?.name || "Membresía")}</h3>
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
              <button class="secondary-button" type="button" data-icon="refresh" data-membership-renew-action="open">Renovar membresía</button>
            </div>`
          : ""
      }
    </article>
  `;

  if (canUseBenefits) {
    renderOperationMembershipBenefits();
  } else {
    elements.membershipOperationBenefits.innerHTML =
      '<div class="empty-state">Renueva la membresía antes de aplicar beneficios.</div>';
  }
  renderOperationMembershipUsages();
  renderOperationMembershipTransactions();
  renderSelectedCustomer();
}

function renderOperationMembershipBenefits() {
  if (!selectedCustomerMembershipBenefits.length) {
    elements.membershipOperationBenefits.innerHTML =
      '<div class="empty-state">El plan activo no tiene beneficios disponibles.</div>';
    return;
  }

  elements.membershipOperationBenefits.innerHTML =
    selectedCustomerMembershipBenefits
      .map(
        (benefit) => `
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
            ${benefit.usageLimit ? `<span>Límite ${formatReportNumber(benefit.usageLimit)}</span>` : "<span>Sin límite</span>"}
          </div>
        </div>
        <div class="membership-actions">
          <button class="secondary-button" type="button" data-icon="gift" data-membership-usage-benefit-id="${escapeHtml(benefit.id)}">Aplicar beneficio</button>
        </div>
      </article>
    `,
      )
      .join("");
}

function renderOperationMembershipUsages() {
  if (!selectedCustomerMembershipUsages.length) {
    elements.membershipOperationUsages.innerHTML =
      '<div class="empty-state">Sin usos recientes de beneficios.</div>';
    return;
  }

  elements.membershipOperationUsages.innerHTML =
    selectedCustomerMembershipUsages
      .slice(0, 8)
      .map(
        (usage) => `
      <article class="history-row membership-usage-row">
        <div>
          <h3>${escapeHtml(usage.benefitName || "Beneficio")}</h3>
          <p>${formatDate(usage.usageDate)} - ${escapeHtml(usage.note || usage.planName || "Uso registrado")}</p>
        </div>
        <strong class="history-points">x${formatReportNumber(usage.quantity)}</strong>
      </article>
    `,
      )
      .join("");
}

function renderOperationMembershipTransactions() {
  if (!selectedCustomerMembershipTransactions.length) {
    elements.membershipOperationTransactions.innerHTML = "";
    return;
  }

  const header = '<h3 class="section-subtitle">Transacciones de membresía</h3>';
  elements.membershipOperationTransactions.innerHTML = `
    ${header}
    ${selectedCustomerMembershipTransactions
      .slice(0, 8)
      .map(
        (transaction) => `
        <article class="history-row membership-transaction-row">
          <div>
            <h3>${escapeHtml(getMembershipTransactionTypeLabel(transaction.transactionType))}</h3>
            <p>${formatDate(transaction.transactionDate)} - ${escapeHtml(getPaymentMethodLabel(transaction.paymentMethod))}</p>
            <p>${escapeHtml(transaction.planName || transaction.note || "Membresía")}</p>
          </div>
          <strong class="history-points">${formatMoney(transaction.amount)}</strong>
        </article>
      `,
      )
      .join("")}
  `;
}

function openMembershipRenewalForm() {
  if (
    !selectedCustomerActiveMembership ||
    !isMembershipRenewable(selectedCustomerActiveMembership)
  ) {
    return;
  }

  clearMembershipOperationMessages();
  clearMembershipRenewalErrors();
  const price =
    selectedCustomerActiveMembership.pricePaid ??
    selectedCustomerActiveMembership.plan?.price ??
    "";
  elements.membershipRenewalAmountInput.value =
    price === "" || price == null ? "" : Number(price);
  elements.membershipRenewalPaymentMethodInput.value = "";
  elements.membershipRenewalForm.hidden = false;
  elements.membershipRenewalPaymentMethodInput.focus();
}

function openMembershipBenefitUsageConfirmation(benefitId) {
  const benefit = selectedCustomerMembershipBenefits.find(
    (item) => String(item.id) === String(benefitId),
  );
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
    <div>Plan: ${escapeHtml(selectedCustomerActiveMembership.planName || "Membresía activa")}</div>
  `;
  elements.membershipBenefitUsageForm.hidden = false;
  elements.membershipBenefitUsageDateInput.focus();
}

function renderOperationMembershipError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No pudimos cargar la membresía activa del cliente.";
  elements.membershipOperationActive.innerHTML =
    '<div class="empty-state">Membresía no disponible.</div>';
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
  elements.reportEmpty.textContent =
    "Selecciona un rango de fechas para ver la actividad.";
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
      <span>Membresías</span>
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
    elements.reportEmpty.textContent =
      "Sin movimientos para el rango seleccionado.";
    elements.reportTableWrap.hidden = true;
    elements.reportTableBody.innerHTML = "";
    elements.exportReportButton.disabled = true;
    return;
  }

  elements.reportEmpty.hidden = true;
  elements.reportTableWrap.hidden = false;
  elements.reportTableBody.innerHTML = items
    .map((item) => renderReportRow(item))
    .join("");
  elements.exportReportButton.disabled = false;
  showReportStatus(
    `Reporte cargado: ${formatReportNumber(items.length)} movimientos.`,
  );
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
    const invoice = item.invoiceNumber
      ? `Factura ${item.invoiceNumber}`
      : "Compra sin comprobante";
    return `${escapeHtml(invoice)}<span>${formatMoney(item.amount)}</span>`;
  }

  if (item.type === "membership") {
    const label = item.planName
      ? `Membresía: ${item.planName}`
      : item.note || "Evento de membresía";
    const amount = Number.isFinite(Number(item.amount))
      ? `<span>${formatMoney(item.amount)}</span>`
      : "";
    return `${escapeHtml(label)}${amount}`;
  }

  if (item.type === "benefit") {
    const quantity = item.quantity ? ` x${item.quantity}` : "";
    const label = item.benefitName
      ? `Beneficio usado: ${item.benefitName}${quantity}`
      : item.note || "Beneficio usado";
    const plan = item.planName
      ? `<span>${escapeHtml(item.planName)}</span>`
      : "";
    return `${escapeHtml(label)}${plan}`;
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

function renderCustomerReportPrompt() {
  currentCustomerReport = null;
  elements.customerReportSummary.hidden = true;
  elements.customerReportSummary.innerHTML = "";
  elements.customerReportCandidates.hidden = true;
  elements.customerReportCandidates.innerHTML = "";
  elements.customerReportTableWrap.hidden = true;
  elements.customerReportTableBody.innerHTML = "";
  elements.customerReportEmpty.hidden = false;
  elements.customerReportEmpty.textContent =
    "Busca un cliente y selecciona un rango para ver sus movimientos.";
  elements.exportCustomerReportButton.disabled = true;
}

function renderCustomerReportLoading() {
  elements.customerReportSummary.hidden = true;
  elements.customerReportCandidates.hidden = true;
  elements.customerReportCandidates.innerHTML = "";
  elements.customerReportTableWrap.hidden = true;
  elements.customerReportEmpty.hidden = false;
  elements.customerReportEmpty.textContent = "Cargando reporte por cliente...";
  elements.exportCustomerReportButton.disabled = true;
}

function renderCustomerReport(report) {
  const items = Array.isArray(report.items) ? report.items : [];
  const summary = report.summary ?? {};

  elements.customerReportCandidates.hidden = true;
  elements.customerReportCandidates.innerHTML = "";
  elements.customerReportTableWrap.hidden = true;
  elements.customerReportTableBody.innerHTML = "";
  elements.exportCustomerReportButton.disabled = true;

  if (report.status === "not_found") {
    elements.customerReportSummary.hidden = true;
    elements.customerReportSummary.innerHTML = "";
    elements.customerReportEmpty.hidden = false;
    elements.customerReportEmpty.textContent =
      "No encontramos un cliente con ese dato. Revisa teléfono, nombre o correo.";
    showCustomerReportStatus("Sin cliente encontrado para la búsqueda.");
    return;
  }

  if (report.status === "ambiguous") {
    elements.customerReportSummary.hidden = true;
    elements.customerReportSummary.innerHTML = "";
    elements.customerReportEmpty.hidden = false;
    elements.customerReportEmpty.textContent =
      "Hay varios clientes posibles. Refina la búsqueda con teléfono o correo exacto.";
    elements.customerReportCandidates.hidden = false;
    elements.customerReportCandidates.innerHTML = (report.candidates || [])
      .map(
        (candidate) => `
      <div>
        <strong>${escapeHtml(candidate.name || "Cliente sin nombre")}</strong>
        <span>${escapeHtml(candidate.phone || "Sin teléfono")} · ${escapeHtml(candidate.email || "Sin correo")}</span>
      </div>
    `,
      )
      .join("");
    showCustomerReportStatus(
      `Coincidencias encontradas: ${formatReportNumber((report.candidates || []).length)}.`,
    );
    return;
  }

  elements.customerReportSummary.hidden = false;
  elements.customerReportSummary.innerHTML = `
    <div>
      <span>Movimientos</span>
      <strong>${formatReportNumber(summary.movementCount)}</strong>
    </div>
    <div>
      <span>Compras</span>
      <strong>${formatReportNumber(summary.purchaseCount)}</strong>
    </div>
    <div>
      <span>Monto compras</span>
      <strong>${formatMoney(summary.purchaseAmountTotal)}</strong>
    </div>
    <div>
      <span>Puntos ganados</span>
      <strong>${formatReportNumber(summary.pointsEarnedTotal)}</strong>
    </div>
    <div>
      <span>Puntos redimidos</span>
      <strong>${formatReportNumber(summary.pointsRedeemedTotal)}</strong>
    </div>
    <div>
      <span>Membresías</span>
      <strong>${formatReportNumber(summary.membershipCount)}</strong>
    </div>
    <div>
      <span>Beneficios</span>
      <strong>${formatReportNumber(summary.benefitUsageCount)}</strong>
    </div>
  `;

  if (items.length === 0) {
    elements.customerReportEmpty.hidden = false;
    elements.customerReportEmpty.textContent =
      "Cliente encontrado, sin movimientos para el rango seleccionado.";
    return;
  }

  elements.customerReportEmpty.hidden = true;
  elements.customerReportTableWrap.hidden = false;
  elements.customerReportTableBody.innerHTML = items
    .map((item) => renderReportRow(item))
    .join("");
  elements.exportCustomerReportButton.disabled = false;
  showCustomerReportStatus(
    `Reporte cargado: ${formatReportNumber(items.length)} movimientos.`,
  );
}

function renderCustomerReportError(error) {
  renderCustomerReportPrompt();

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showCustomerReportError(
      "Revisa búsqueda, rango de fechas y tipo de reporte.",
    );
    return;
  }

  if (isAuthRequiredError(error)) {
    showCustomerReportError(getAuthRequiredMessage());
    return;
  }

  showCustomerReportError(
    "No pudimos cargar el reporte por cliente. Intenta de nuevo.",
  );
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
  elements.membershipFinancialReportEmpty.textContent =
    "Selecciona un rango de fechas para ver ventas y renovaciones.";
  elements.exportMembershipFinancialReportButton.disabled = true;
}

function renderMembershipFinancialReportLoading() {
  elements.membershipFinancialReportSummary.hidden = true;
  elements.membershipFinancialPaymentSummary.hidden = true;
  elements.membershipFinancialReportTableWrap.hidden = true;
  elements.membershipFinancialReportEmpty.hidden = false;
  elements.membershipFinancialReportEmpty.textContent =
    "Cargando reporte de membresías...";
  elements.exportMembershipFinancialReportButton.disabled = true;
}

function renderMembershipFinancialReport(report) {
  const items = Array.isArray(report.items) ? report.items : [];
  const summary = report.summary || {};

  elements.membershipFinancialReportSummary.hidden = false;
  elements.membershipFinancialReportSummary.innerHTML = `
    <div>
      <span>Membresías nuevas</span>
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
      <span>Monto por método de pago</span>
      <strong>${paymentMethods.length ? formatReportNumber(paymentMethods.length) : "0"}</strong>
    </div>
    ${paymentMethods
      .map(
        (item) => `
        <div>
          <span>${escapeHtml(getPaymentMethodLabel(item.paymentMethod))} (${formatReportNumber(item.count)})</span>
          <strong>${formatMoney(item.amount)}</strong>
        </div>
      `,
      )
      .join("")}
  `;

  if (!items.length) {
    elements.membershipFinancialReportEmpty.hidden = false;
    elements.membershipFinancialReportEmpty.textContent =
      "Sin transacciones de membresía para el rango seleccionado.";
    elements.membershipFinancialReportTableWrap.hidden = true;
    elements.membershipFinancialReportTableBody.innerHTML = "";
    elements.exportMembershipFinancialReportButton.disabled = true;
    return;
  }

  elements.membershipFinancialReportEmpty.hidden = true;
  elements.membershipFinancialReportTableWrap.hidden = false;
  elements.membershipFinancialReportTableBody.innerHTML = items
    .map(renderMembershipFinancialReportRow)
    .join("");
  elements.exportMembershipFinancialReportButton.disabled = false;
  showMembershipFinancialReportStatus(
    `Reporte de membresías cargado: ${formatReportNumber(items.length)} transacciones.`,
  );
}

function renderMembershipFinancialReportRow(item) {
  return `
    <tr>
      <td>${formatDateTime(item.createdAt || item.transactionDate)}</td>
      <td>
        <strong>${escapeHtml(item.customerName || "Cliente sin nombre")}</strong>
        <span>${escapeHtml(item.customerPhone || item.customerEmail || "Sin contacto")}</span>
      </td>
      <td>${escapeHtml(item.planName || "Membresía")}</td>
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
  elements.membershipFinancialReportEmpty.textContent =
    "No hay reporte de membresías cargado.";
  elements.exportMembershipFinancialReportButton.disabled = true;

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showMembershipFinancialReportError("Revisa el rango de fechas.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showMembershipFinancialReportError(getAuthRequiredMessage());
    return;
  }

  showMembershipFinancialReportError(
    "No pudimos cargar el reporte de membresías.",
  );
}

function renderAuditPrompt() {
  currentAuditEvents = null;
  elements.auditTableWrap.hidden = true;
  elements.auditTableBody.innerHTML = "";
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent =
    "Selecciona un rango de fechas para ver eventos recientes.";
  elements.exportAuditButton.disabled = true;
}

function renderAuditLoading() {
  elements.auditTableWrap.hidden = true;
  elements.auditEmpty.hidden = false;
  elements.auditEmpty.textContent = "Cargando historial...";
  elements.exportAuditButton.disabled = true;
}

function renderAuditEvents(result) {
  const items = Array.isArray(result.items) ? result.items : [];

  if (items.length === 0) {
    elements.auditTableWrap.hidden = true;
    elements.auditTableBody.innerHTML = "";
    elements.auditEmpty.hidden = false;
    elements.auditEmpty.textContent = "Sin eventos para el rango seleccionado.";
    elements.exportAuditButton.disabled = true;
    return;
  }

  elements.auditEmpty.hidden = true;
  elements.auditTableWrap.hidden = false;
  elements.auditTableBody.innerHTML = items
    .map((item) => renderAuditRow(item))
    .join("");
  elements.exportAuditButton.disabled = false;
  showAuditStatus(
    `Historial cargado: ${formatReportNumber(items.length)} eventos.`,
  );
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
  elements.auditEmpty.textContent = "No hay historial cargado.";
  elements.exportAuditButton.disabled = true;

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAuditError("Revisa el rango de fechas y el límite de eventos.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showAuditError(getAuthRequiredMessage());
    return;
  }

  showAuditError(
    "No pudimos consultar el historial. Revisa el rango e intenta de nuevo despues del deploy.",
  );
}

function updateMembershipNavigation(settings) {
  const membershipsEnabled = Boolean(settings?.loyaltyMembershipsEnabled);
  const pointsEnabled = settings
    ? Boolean(settings.loyaltyPointsEnabled)
    : true;
  elements.pointsNavButton.hidden = !pointsEnabled && !membershipsEnabled;
  if (elements.membershipsNavButton) {
    elements.membershipsNavButton.hidden = true;
  }

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

  if (
    activeSection === "memberships" ||
    (activeSection === "operations" && !pointsEnabled && !membershipsEnabled)
  ) {
    setActiveSection(getDefaultLoyaltySection(), { focus: false });
  }
}

function isMembershipsEnabled() {
  return Boolean(currentCompanySettings?.loyaltyMembershipsEnabled);
}

function isPointsEnabled() {
  return currentCompanySettings
    ? Boolean(currentCompanySettings.loyaltyPointsEnabled)
    : true;
}

function getDefaultLoyaltySection() {
  if (isPointsEnabled() || isMembershipsEnabled()) {
    return "operations";
  }

  return "company";
}

function renderMembershipDisabled() {
  elements.membershipPlansList.innerHTML =
    '<div class="empty-state">Las membresías no están habilitadas para esta empresa.</div>';
  elements.membershipBenefitsContext.textContent =
    "Habilita membresías para configurar beneficios.";
  elements.membershipBenefitsList.innerHTML =
    '<div class="empty-state">Selecciona un plan para gestionar sus beneficios.</div>';
  elements.membershipCustomerResults.innerHTML =
    '<div class="empty-state">Las membresías no están habilitadas para esta empresa.</div>';
  elements.membershipCustomerMembershipsList.innerHTML =
    '<div class="empty-state">Selecciona un cliente para ver sus membresías.</div>';
  elements.membershipExpiringList.innerHTML =
    '<div class="empty-state">Las membresías no están habilitadas para esta empresa.</div>';
  elements.membershipExpiredList.innerHTML =
    '<div class="empty-state">Las membresías no están habilitadas para esta empresa.</div>';
  membershipExpirationAlerts = { active: [], expired: [] };
  renderMembershipActivationPlanOptions();
}

function renderMembershipExpirationLoading() {
  elements.membershipExpiringList.innerHTML =
    '<div class="loading-state">Cargando próximas a vencer...</div>';
  elements.membershipExpiredList.innerHTML =
    '<div class="loading-state">Cargando vencidas...</div>';
}

function renderMembershipExpirationAlerts() {
  const activeItems = membershipExpirationAlerts.active || [];
  const expiredItems = membershipExpirationAlerts.expired || [];

  elements.membershipExpiringList.innerHTML = activeItems.length
    ? activeItems.map(renderMembershipExpirationCard).join("")
    : '<div class="empty-state">No hay membresías próximas a vencer para este periodo.</div>';
  elements.membershipExpiredList.innerHTML = expiredItems.length
    ? expiredItems.map(renderMembershipExpirationCard).join("")
    : '<div class="empty-state">No hay membresías vencidas para este periodo.</div>';
}

function renderMembershipExpirationCard(item) {
  return `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(item.customerName || "Cliente sin nombre")}</h3>
          <span class="status-pill">${escapeHtml(getMembershipExpirationStateLabel(item))}</span>
        </div>
        <p>${escapeHtml(item.planName || "Membresía")}</p>
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
    showMembershipExpirationError("Revisa los días antes de vencer.");
    return;
  }

  showMembershipExpirationError("No pudimos cargar las alertas de membresías.");
}

function renderMembershipPlansLoading() {
  elements.membershipPlansList.innerHTML =
    '<div class="loading-state">Cargando planes de membresía...</div>';
}

function renderMembershipPlans() {
  if (!membershipPlans.length) {
    elements.membershipPlansList.innerHTML = renderMembershipEmptyState({
      title: "No existen planes de membresía",
      text: "Crea un plan para empezar a ofrecer beneficios a tus clientes.",
      action: "Crear plan",
      actionAttribute: 'data-membership-plan-action="create"',
    });
    renderMembershipActivationPlanOptions();
    return;
  }

  elements.membershipPlansList.innerHTML = membershipPlans
    .map(renderMembershipPlanCard)
    .join("");
  renderMembershipActivationPlanOptions();
}

function renderMembershipActivationPlanOptions() {
  const activePlans = membershipPlans.filter(
    (plan) => plan.status === "active",
  );

  if (!activePlans.length) {
    elements.membershipActivationPlanInput.innerHTML =
      '<option value="">Sin planes activos</option>';
    elements.membershipActivationPricePaidInput.value = "";
    renderMembershipActivationPreview();
    return;
  }

  const currentValue = elements.membershipActivationPlanInput.value;
  elements.membershipActivationPlanInput.innerHTML = activePlans
    .map(
      (plan) =>
        `<option value="${escapeHtml(plan.id)}">${escapeHtml(plan.name)}</option>`,
    )
    .join("");

  if (
    currentValue &&
    activePlans.some((plan) => String(plan.id) === String(currentValue))
  ) {
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
    elements.membershipCustomerResults.innerHTML =
      '<div class="empty-state">No encontramos clientes con esa búsqueda. Puedes registrarlo desde Atender cliente.</div>';
    return;
  }

  elements.membershipCustomerResults.innerHTML = membershipCustomerResults
    .map(
      (customer) => `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(customer.name)}</h3>
        </div>
        <div class="membership-meta">
          <span>${escapeHtml(customer.phone || "Sin teléfono")}</span>
          <span>${escapeHtml(customer.email || "Sin correo")}</span>
        </div>
      </div>
      <div class="membership-actions">
        <button class="secondary-button" type="button" data-icon="arrow-right" data-membership-customer-id="${escapeHtml(customer.id)}">Seleccionar</button>
      </div>
    </article>
  `,
    )
    .join("");
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
    elements.membershipActivationPreview.innerHTML =
      "Selecciona un plan activo.";
    return;
  }

  const expectedEndDate = startDate
    ? calculateExpectedMembershipEndDate(startDate, plan.durationDays)
    : null;
  elements.membershipActivationPreview.innerHTML = `
    <div><strong>${escapeHtml(plan.name)}</strong></div>
    <div>Duracion: ${formatReportNumber(plan.durationDays)} días</div>
    <div>Precio: ${formatMoney(elements.membershipActivationPricePaidInput.value || plan.price)}</div>
    <div>Vence: ${expectedEndDate ? formatDate(expectedEndDate) : "Selecciona fecha de inicio"}</div>
  `;
}

function renderCustomerMembershipsPrompt() {
  elements.membershipCustomerMembershipsList.innerHTML =
    '<div class="empty-state">Selecciona un cliente para ver sus membresías.</div>';
}

function renderCustomerMemberships() {
  if (!selectedCustomerMemberships.length) {
    elements.membershipCustomerMembershipsList.innerHTML =
      '<div class="empty-state">Este cliente no tiene una membresía activa. Puedes activar una membresía para habilitar sus beneficios.</div>';
    return;
  }

  elements.membershipCustomerMembershipsList.innerHTML =
    selectedCustomerMemberships.map(renderCustomerMembershipCard).join("");
}

function renderCustomerMembershipCard(membership) {
  const alert = membership.expirationAlert || {};
  const alertLabel = getExpirationAlertLabel(alert);

  return `
    <article class="membership-card">
      <div>
        <div class="membership-card-title">
          <h3>${escapeHtml(membership.planName || membership.plan?.name || "Membresía")}</h3>
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
          <span>${formatReportNumber(plan.durationDays)} días</span>
          <span>${formatMoney(plan.price)}</span>
          <span>${formatReportNumber(plan.benefitCount || 0)} beneficios</span>
        </div>
      </div>
      <div class="membership-actions">
        <button class="secondary-button" type="button" data-icon="gift" data-membership-plan-action="select" data-membership-plan-id="${escapeHtml(plan.id)}">Gestionar beneficios</button>
        <button class="secondary-button" type="button" data-icon="clipboard-list" data-membership-plan-action="edit" data-membership-plan-id="${escapeHtml(plan.id)}">Editar</button>
        <button class="secondary-button" type="button" data-icon="${plan.status === "active" ? "circle-minus" : "check"}" data-membership-plan-action="${statusAction}" data-membership-plan-id="${escapeHtml(plan.id)}">${statusLabel}</button>
      </div>
    </article>
  `;
}

function renderMembershipBenefitsPrompt() {
  elements.membershipBenefitsContext.textContent =
    "Selecciona un plan para ver o crear sus beneficios.";
  elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
    title: "Selecciona un plan",
    text: "Elige un plan de membresía para ver o crear sus beneficios.",
  });
}

function renderMembershipBenefitsLoading() {
  elements.membershipBenefitsList.innerHTML =
    '<div class="loading-state">Cargando beneficios...</div>';
}

function renderMembershipBenefits() {
  const plan = membershipPlans.find(
    (item) => String(item.id) === String(selectedMembershipPlanId),
  );
  elements.membershipBenefitsContext.textContent = plan
    ? `Beneficios de ${plan.name}`
    : "Selecciona un plan para ver o crear sus beneficios.";

  if (!membershipBenefits.length) {
    elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
      title: "Este plan aún no tiene beneficios",
      text: "Agrega beneficios para explicar que incluye la membresía y controlar usos limitados.",
      action: "Crear beneficio",
      actionAttribute: 'data-membership-benefit-action="create"',
    });
    return;
  }

  elements.membershipBenefitsList.innerHTML = membershipBenefits
    .map(renderMembershipBenefitCard)
    .join("");
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
        <button class="secondary-button" type="button" data-icon="clipboard-list" data-membership-benefit-action="edit" data-membership-benefit-id="${escapeHtml(benefit.id)}">Editar</button>
        <button class="secondary-button" type="button" data-icon="${benefit.status === "active" ? "circle-minus" : "check"}" data-membership-benefit-action="${statusAction}" data-membership-benefit-id="${escapeHtml(benefit.id)}">${statusLabel}</button>
      </div>
    </article>
  `;
}

function renderMembershipEmptyState({
  title,
  text,
  action = "",
  actionAttribute = "",
}) {
  const actionButton =
    action && actionAttribute
      ? `<button class="secondary-button" type="button" data-icon="plus" ${actionAttribute}>${escapeHtml(action)}</button>`
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
  elements.membershipPlanRenewalNoticeDaysInput.value =
    plan.renewalNoticeDays ?? 5;
  setButtonText(elements.saveMembershipPlanButton, "Guardar cambios");
}

function openMembershipPlanForm(plan = null, options = {}) {
  if (plan) {
    fillMembershipPlanForm(plan);
  } else {
    clearMembershipPlanForm({ focus: false });
    elements.membershipPlanForm.hidden = false;
    setButtonText(elements.saveMembershipPlanButton, "Guardar plan");
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
  setButtonText(elements.saveMembershipPlanButton, "Guardar plan");
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
  elements.membershipBenefitTypeInput.value =
    benefit.benefitType || "informational";
  elements.membershipBenefitAppliesToTypeInput.value =
    benefit.appliesToType || "text";
  elements.membershipBenefitAppliesToNameInput.value =
    benefit.appliesToName || "";
  elements.membershipBenefitDiscountPercentInput.value =
    benefit.discountPercent ?? "";
  elements.membershipBenefitIncludedQuantityInput.value =
    benefit.includedQuantity ?? "";
  elements.membershipBenefitUsageLimitInput.value = benefit.usageLimit ?? "";
  elements.membershipBenefitUsagePeriodInput.value =
    benefit.usagePeriod || "none";
  setButtonText(elements.saveMembershipBenefitButton, "Guardar cambios");
}

function openMembershipBenefitForm(benefit = null, options = {}) {
  if (!selectedMembershipPlanId) {
    showMembershipBenefitsError(
      "Selecciona un plan antes de crear beneficios.",
    );
    return;
  }

  if (benefit) {
    fillMembershipBenefitForm(benefit);
  } else {
    clearMembershipBenefitForm({ focus: false });
    elements.membershipBenefitForm.hidden = false;
    setButtonText(elements.saveMembershipBenefitButton, "Guardar beneficio");
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
  setButtonText(elements.saveMembershipBenefitButton, "Guardar beneficio");
  clearMembershipBenefitMessages();

  if (options.focus !== false) {
    elements.membershipBenefitNameInput.focus();
  }
}

function renderMembershipPlansError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No se pudieron cargar los planes.";
  elements.membershipPlansList.innerHTML = renderMembershipEmptyState({
    title: "No se pudieron cargar los planes",
    text: "Intenta de nuevo para continuar configurando membresías.",
    action: "Reintentar",
    actionAttribute: 'data-membership-plan-action="retry"',
  });
  showMembershipPlansError(message);
}

function renderMembershipBenefitsError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No se pudieron cargar los beneficios.";
  elements.membershipBenefitsList.innerHTML = renderMembershipEmptyState({
    title: "No se pudieron cargar los beneficios",
    text: "Intenta de nuevo para continuar gestionando este plan.",
    action: "Reintentar",
    actionAttribute: 'data-membership-benefit-action="retry"',
  });
  showMembershipBenefitsError(message);
}

function renderMembershipPlanFormError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipPlanErrors(error.details);
    showMembershipPlansError("Revisa los campos del plan antes de continuar.");
    return;
  }

  showMembershipPlansError(
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : "No pudimos guardar el plan. Intenta de nuevo.",
  );
}

function renderMembershipBenefitFormError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipBenefitErrors(error.details);
    showMembershipBenefitsError(
      "Revisa los campos del beneficio antes de continuar.",
    );
    return;
  }

  showMembershipBenefitsError(
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : "No pudimos guardar el beneficio. Intenta de nuevo.",
  );
}

function renderMembershipCustomerSearchError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No pudimos buscar clientes.";
  elements.membershipCustomerResults.innerHTML =
    '<div class="empty-state">Sin clientes cargados.</div>';
  showMembershipCustomerSearchError(message);
}

function renderCustomerMembershipsError(error) {
  const message = isAuthRequiredError(error)
    ? getAuthRequiredMessage()
    : "No pudimos cargar las membresías del cliente.";
  elements.membershipCustomerMembershipsList.innerHTML =
    '<div class="empty-state">Sin membresías cargadas.</div>';
  showMembershipCustomerMembershipsError(message);
}

function renderMembershipActivationError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipActivationErrors(error.details);
    showMembershipActivationError(
      "Revisa los campos de activación de la membresía.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP"
  ) {
    showMembershipActivationError(
      "Este cliente ya tiene una membresía activa.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "MEMBERSHIP_PLAN_INACTIVE") {
    showMembershipActivationError(
      "Este plan está inactivo. Activa el plan o selecciona otro.",
    );
    return;
  }

  showMembershipActivationError(
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : "No pudimos activar la membresía. Intenta de nuevo.",
  );
}

function renderMembershipBenefitUsageError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipBenefitUsageErrors(error.details);
    showMembershipOperationError(
      "Revisa los campos antes de aplicar el beneficio.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "CUSTOMER_MEMBERSHIP_NOT_ACTIVE"
  ) {
    showMembershipOperationError(
      "Este cliente no tiene una membresía activa. Renueva o activa una membresía antes de aplicar beneficios.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "MEMBERSHIP_BENEFIT_INACTIVE"
  ) {
    showMembershipOperationError("Este beneficio está inactivo.");
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "MEMBERSHIP_BENEFIT_NOT_IN_ACTIVE_PLAN"
  ) {
    showMembershipOperationError(
      "Este beneficio no pertenece al plan activo del cliente.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED"
  ) {
    showMembershipOperationError(
      "Este beneficio ya alcanzo su límite de uso para el periodo.",
    );
    return;
  }

  showMembershipOperationError(
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : "No pudimos aplicar el beneficio. Intenta de nuevo.",
  );
}

function renderMembershipRenewalError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    mapMembershipRenewalErrors(error.details);
    showMembershipOperationError("Revisa los campos de renovacion.");
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "CUSTOMER_MEMBERSHIP_CANCELLED"
  ) {
    showMembershipOperationError(
      "No se puede renovar una membresía cancelada.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "CUSTOMER_MEMBERSHIP_NOT_FOUND"
  ) {
    showMembershipOperationError(
      "La membresía seleccionada ya no está disponible.",
    );
    return;
  }

  showMembershipOperationError(
    isAuthRequiredError(error)
      ? getAuthRequiredMessage()
      : "No pudimos renovar la membresía. Intenta de nuevo.",
  );
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
  elements.companyPasswordForm.hidden = true;
  elements.companySubsectionPanels.forEach((panel) => {
    panel.hidden = true;
  });
  elements.companyEmpty.hidden = false;
  elements.companyEmpty.textContent = "Cargando configuración...";
}

function renderCompanySettings(settings) {
  elements.companyEmpty.hidden = true;
  elements.companyForm.hidden = false;
  setCompanySubsection(activeCompanySubsection, { focus: false });
  elements.companyNameInput.value = settings.name ?? "";
  elements.companyEmailInput.value = settings.email ?? "";
  elements.companyPhoneInput.value = settings.phone ?? "";
  elements.companyPointsPercentageInput.value = settings.pointsPercentage ?? "";
  elements.companyCurrentStatus.textContent = getCompanyStatusLabel(
    settings.status,
  );
  elements.companyCurrentUpdated.textContent = settings.updatedAt
    ? formatDateTime(settings.updatedAt)
    : "No disponible";
  renderCompanyLogo(settings);
}

function renderOperationalEmailSettings(settings) {
  elements.companyEmailWelcomeEnabledInput.checked = Boolean(
    settings.welcomeEnabled,
  );
  elements.companyEmailPurchaseEnabledInput.checked = Boolean(
    settings.purchaseEnabled,
  );
  elements.companyEmailRedemptionEnabledInput.checked = Boolean(
    settings.redemptionEnabled,
  );
  elements.companyEmailReplyToInput.value = settings.replyToEmail || "";
}

function renderOperationalEmailHistoryLoading() {
  elements.companyEmailHistoryBody.innerHTML = `
    <tr>
      <td colspan="6">Cargando historial...</td>
    </tr>
  `;
}

function renderOperationalEmailHistory(items) {
  if (!items.length) {
    elements.companyEmailHistoryBody.innerHTML = `
      <tr>
        <td colspan="6">No hay correos operativos para los filtros seleccionados.</td>
      </tr>
    `;
    return;
  }

  elements.companyEmailHistoryBody.innerHTML = items
    .map((item) => {
      const event = item.event || {};
      const message = item.message || {};
      const customer = item.customer || {};
      const status = message.status || event.status || "pending";
      const recipient =
        message.recipientEmail || customer.email || "Sin correo";
      const reason = getOperationalEmailReasonLabel(item.reason);

      return `
        <tr>
          <td>${escapeHtml(formatDateTime(event.createdAt))}</td>
          <td>${escapeHtml(getOperationalEmailTypeLabel(event.type))}</td>
          <td>${escapeHtml(customer.name || "Cliente no disponible")}</td>
          <td>${escapeHtml(recipient)}</td>
          <td><span class="status-pill">${escapeHtml(getOperationalEmailStatusLabel(status))}</span></td>
          <td>${escapeHtml(reason)}</td>
        </tr>
      `;
    })
    .join("");
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
    elements.companyPasswordForm.hidden = true;
    elements.companyEmpty.hidden = false;
    elements.companyEmpty.textContent = "No hay configuración cargada.";
  }

  if (error instanceof ApiError && error.code === "COMPANY_NOT_FOUND") {
    showCompanyError("La empresa piloto no está disponible.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showCompanyError(getAuthRequiredMessage());
    return;
  }

  showCompanyError("No pudimos cargar la informacion de la empresa.");
}

function renderOperationalEmailError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      if (detail.field === "replyToEmail") {
        elements.companyEmailReplyToError.textContent =
          "Ingresa un correo reply-to válido.";
      }
    });
    showOperationalEmailError("Revisa los campos marcados antes de continuar.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showOperationalEmailError(getAuthRequiredMessage());
    return;
  }

  showOperationalEmailError(
    "No pudimos cargar o guardar la configuración de correos.",
  );
}

function renderOperationalEmailHistoryError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showOperationalEmailHistoryError("Revisa los filtros del historial.");
    return;
  }

  if (isAuthRequiredError(error)) {
    showOperationalEmailHistoryError(getAuthRequiredMessage());
    return;
  }

  showOperationalEmailHistoryError(
    "No pudimos cargar el historial de correos operativos.",
  );
}

function renderCompanyPasswordChangeError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        currentPassword: elements.companyCurrentPasswordError,
        newPassword: elements.companyNewPasswordError,
        passwordConfirmation: elements.companyNewPasswordConfirmationError,
      }[detail.field];

      if (target) {
        target.textContent = getCompanyPasswordValidationMessage(detail);
      }
    });
    showCompanyPasswordError("Revisa los datos ingresados.");
    return;
  }

  if (error instanceof ApiError && error.code === "INVALID_CURRENT_PASSWORD") {
    elements.companyCurrentPasswordError.textContent =
      "La contraseña actual no coincide.";
    showCompanyPasswordError(
      "No pudimos actualizar la contraseña. Revisa la contraseña actual.",
    );
    return;
  }

  if (isAuthRequiredError(error)) {
    showCompanyPasswordError("Tu sesión expiró. Accede nuevamente a tu panel.");
    return;
  }

  showCompanyPasswordError(
    "No pudimos actualizar la contraseña. Intenta de nuevo.",
  );
}

function renderCompanyLogo(settings) {
  revokeCompanyLogoPreviewUrl();
  const logoUrl = settings?.logoUrl
    ? api.getCompanyLogoUrl?.(settings.logoUrl)
    : "";
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

async function previewSelectedRegistrationLogo() {
  const [file] = elements.registrationLogoFileInput.files;
  elements.registrationLogoFileError.textContent = "";

  if (!file) {
    clearSelectedRegistrationLogo();
    return;
  }

  elements.registrationLogoPreviewText.hidden = false;
  elements.registrationLogoPreviewText.textContent = "Revisando logo...";
  elements.registrationLogoPreviewImage.hidden = true;
  elements.registrationLogoPreviewImage.removeAttribute("src");

  const validationMessage = await getRegistrationLogoValidationMessage(file);

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
  const companyName =
    result.companyName || elements.registrationCompanyNameInput.value.trim();
  const companyEmail =
    result.companyEmail || elements.registrationCompanyEmailInput.value.trim();
  const contactEmail =
    result.contactEmail || elements.registrationContactEmailInput.value.trim();
  const hasLogo = Boolean(
    result.requestedLogo?.available ||
    elements.registrationLogoFileInput.files.length,
  );

  elements.registrationStatus.hidden = false;
  elements.registrationStatus.textContent = "Datos recibidos";
  elements.registrationResult.hidden = false;
  elements.registrationResult.innerHTML = `
    <h3>Datos recibidos</h3>
    <p>
      Recibimos los datos de ${escapeHtml(companyName)}. Prepararemos el programa y enviaremos
      los siguientes pasos al correo de contacto cuando el acceso este listo.
    </p>
    <div class="registration-summary">
      ${renderAdminDetailItem("Empresa", companyName)}
      ${renderAdminDetailItem("Correo de empresa", companyEmail)}
      ${renderAdminDetailItem("Correo de contacto", contactEmail)}
      ${renderAdminDetailItem("Estado del programa", getRegistrationStatusLabel(result.status || "pending"))}
      ${renderAdminDetailItem("Logo", hasLogo ? "Incluido" : "No incluido")}
    </div>
    <p>Tambien notificamos internamente al equipo de Punto Club para dar seguimiento.</p>
    <div class="form-actions">
      <button class="secondary-button" id="new-registration-button" type="button" data-icon="send">Enviar otros datos</button>
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
    showCompanyRegistrationError(
      "Revisa los campos marcados antes de enviar los datos.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    [
      "UNSUPPORTED_MEDIA_TYPE",
      "UPLOAD_TOO_LARGE",
      "LOGO_FILE_UNREADABLE",
    ].includes(error.code)
  ) {
    const message = getCompanyRegistrationLogoErrorMessage(error);
    elements.registrationLogoFileError.textContent = message;
    showCompanyRegistrationError("Revisa el logo antes de enviar los datos.");
    return;
  }

  if (error instanceof ApiError && error.code === "LOGO_STORAGE_UNAVAILABLE") {
    const message = getCompanyRegistrationLogoErrorMessage(error);
    elements.registrationLogoFileError.textContent = message;
    showCompanyRegistrationError(message);
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_ALREADY_EXISTS") {
    showCompanyRegistrationError(
      "Ya existe una empresa registrada con ese correo. Accede a tu panel o contacta al equipo de Punto Club si necesitas recuperar el acceso.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "REGISTRATION_ALREADY_PENDING"
  ) {
    showCompanyRegistrationError(
      "Ya hay datos recibidos para ese correo. Prepararemos el acceso y enviaremos los siguientes pasos cuando este listo.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "INVITATION_ALREADY_PENDING"
  ) {
    showCompanyRegistrationError(
      "Ya hay un acceso pendiente para ese correo. Revisa la bandeja de entrada o solicita un reenvió si está disponible.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "RATE_LIMITED") {
    showCompanyRegistrationError(
      "Hay demasiados intentos recientes. Espera unos minutos e intenta de nuevo.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "SERVICE_UNAVAILABLE") {
    showCompanyRegistrationError(
      "El servicio no está disponible en este momento. Intenta más tarde.",
    );
    return;
  }

  if (error instanceof TypeError) {
    showCompanyRegistrationError(
      "No pudimos enviar los datos por un problema de conexion. Revisa tu internet e intenta de nuevo.",
    );
    return;
  }

  showCompanyRegistrationError(
    "No pudimos enviar los datos. Intenta de nuevo.",
  );
}

function renderAdminPrompt() {
  updateAdminAccessState();
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML =
    '<div class="empty-state">Ingresa el token interno para cargar empresas por activar.</div>';
  renderAdminDetailPrompt();
}

function renderAdminListLoading() {
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML =
    '<div class="loading-state">Cargando empresas...</div>';
}

function renderAdminRequestsList() {
  const search = normalize(elements.adminRequestSearchInput.value);
  const filteredRequests = adminRequests.filter((request) =>
    [
      request.companyName,
      request.companyEmail,
      request.contactName,
      request.contactEmail,
    ].some((value) => normalize(value).includes(search)),
  );

  elements.adminSummary.hidden = false;
  elements.adminSummary.innerHTML = `
    <div>
      <span>Total cargadas</span>
      <strong>${formatReportNumber(adminRequests.length)}</strong>
    </div>
    <div>
      <span>Por revisar</span>
      <strong>${formatReportNumber(adminRequests.filter((item) => item.status === "pending").length)}</strong>
    </div>
    <div>
      <span>Filtro visible</span>
      <strong>${formatReportNumber(filteredRequests.length)}</strong>
    </div>
  `;

  if (filteredRequests.length === 0) {
    const message = search
      ? "No encontramos empresas con esos datos."
      : elements.adminRequestStatusInput.value === "pending"
        ? "No hay empresas por revisar."
        : "No hay empresas para revisar.";
    elements.adminRequestsList.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
    return;
  }

  elements.adminRequestsList.innerHTML = filteredRequests
    .map((request) => renderAdminRequestCard(request))
    .join("");
}

function renderAdminRequestCard(request) {
  const isSelected =
    selectedAdminRequest &&
    String(selectedAdminRequest.id) === String(request.id);
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
                data-icon="check"
                data-admin-card-action="approve"
              >
                Activar
              </button>
            `
            : ""
        }
        <button
          class="secondary-button icon-button"
          type="button"
          data-icon="eye"
          data-admin-request-id="${escapeHtml(request.id)}"
          aria-label="Ver detalle de ${escapeHtml(request.companyName || "empresa")}"
          title="Ver detalle"
        ></button>
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
  elements.adminDetailEmpty.textContent =
    "Selecciona una empresa para revisar sus datos.";
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
        <p class="eyebrow">Empresa por activar</p>
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
        ${renderAdminDetailItem("Teléfono", request.companyPhone)}
        ${renderAdminDetailItem("Dirección", request.companyAddress)}
        ${renderAdminLogoDetailItem(request)}
      </div>
    </section>

    <section class="admin-detail-section" aria-label="Contacto">
      <h3>Contacto</h3>
      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Nombre", request.contactName)}
        ${renderAdminDetailItem("Correo de contacto", request.contactEmail)}
        ${renderAdminDetailItem("Teléfono de contacto", request.contactPhone)}
      </div>
    </section>

    <section class="admin-detail-section" aria-label="Seguimiento">
      <h3>Seguimiento</h3>
      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Estado del programa", getRegistrationStatusLabel(request.status))}
        ${renderAdminDetailItem("Datos recibidos", formatDateTime(request.createdAt))}
        ${renderAdminDetailItem("Actualizacion", formatDateTime(request.updatedAt))}
      </div>
    </section>

    ${renderAdminInvitationPanel(request.invitation)}

    ${
      isPending
        ? `
          <div class="admin-action-panel">
            <div class="form-actions">
              <button id="approve-admin-request-button" type="button" data-icon="check" data-admin-action="approve">
                Activar y enviar acceso
              </button>
            </div>

            <div class="field">
              <label for="admin-reject-note">Nota interna</label>
              <textarea
                id="admin-reject-note"
                maxlength="500"
                rows="3"
                placeholder="Ej. Datos incompletos, correo no corresponde o empresa fuera del piloto."
              ></textarea>
              <p class="field-help">Esta nota queda como referencia interna.</p>
            </div>

            <div class="form-actions">
              <button
                class="secondary-button danger-button"
                id="reject-admin-request-button"
                type="button"
                data-icon="x"
                data-admin-action="reject"
              >
                No continuar
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
    const blob = await api.getCompanyRegistrationRequestLogo(
      request.id,
      adminToken,
    );
    if (
      !isSelectedAdminRequest(requestId) ||
      adminRequestLogoPreviewLoadId !== loadId
    ) {
      return;
    }

    const previewUrl = URL.createObjectURL(blob);
    adminRequestLogoPreviewUrl = previewUrl;
    adminRequestLogoPreviewRequestId = requestId;
    target.innerHTML = '<img alt="Logo solicitado" loading="lazy" />';
    const image = target.querySelector("img");
    image.addEventListener(
      "error",
      () => {
        if (isSelectedAdminRequest(requestId)) {
          revokeAdminRequestLogoPreview();
          target.innerHTML = "<span>Logo no disponible</span>";
        }
      },
      { once: true },
    );
    image.src = previewUrl;
  } catch (error) {
    if (
      isSelectedAdminRequest(requestId) &&
      adminRequestLogoPreviewLoadId === loadId
    ) {
      target.innerHTML = "<span>Logo no disponible</span>";
    }
  }
}

function getAdminLogoPreviewTarget(requestId) {
  return (
    [
      ...elements.adminRequestDetail.querySelectorAll(
        "[data-admin-logo-preview]",
      ),
    ].find((target) => target.dataset.adminLogoPreview === requestId) || null
  );
}

function isSelectedAdminRequest(requestId) {
  return (
    selectedAdminRequest &&
    String(selectedAdminRequest.id) === String(requestId)
  );
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
      <section class="admin-invitation-panel" aria-label="Acceso">
        <h3>Acceso</h3>
        <p>Esta empresa aún no tiene acceso asociado.</p>
      </section>
    `;
  }

  const canResend = ["pending", "expired"].includes(invitation.status);

  return `
    <section class="admin-invitation-panel" aria-label="Acceso">
      <div class="section-header compact-header">
        <div>
          <h3>Acceso</h3>
          <p class="section-support">Enlace generado y enviado por correo. No se muestra el enlace en pantalla.</p>
        </div>
      </div>

      <div class="admin-detail-grid">
        ${renderAdminDetailItem("Estado del acceso", getInvitationStatusLabel(invitation.status))}
        ${renderAdminDetailItem("Correo de acceso", invitation.email)}
        ${renderAdminDetailItem("Rol", getInvitationRoleLabel(invitation.role))}
        ${renderAdminDetailItem("Enviado", formatDateTime(invitation.createdAt))}
        ${renderAdminDetailItem("Expira", formatDateTime(invitation.expiresAt))}
        ${renderAdminDetailItem("Acceso creado", invitation.acceptedAt ? formatDateTime(invitation.acceptedAt) : "No")}
      </div>

      ${
        canResend
          ? `
            <div class="form-actions">
              <button
                class="secondary-button"
                id="resend-admin-invitation-button"
                type="button"
                data-icon="mail"
                data-admin-action="resend"
              >
                Reenviar acceso
              </button>
            </div>
          `
          : ""
      }

      <div class="form-actions">
        <button
          class="secondary-button"
          id="send-admin-password-reset-button"
          type="button"
          data-icon="key"
          data-admin-action="reset-password"
        >
          Enviar reset de acceso
        </button>
      </div>
    </section>
  `;
}

function reconcileSelectedAdminRequest(selected, requests) {
  if (!selected) {
    return null;
  }

  return (
    requests.find((request) => String(request.id) === String(selected.id)) ||
    selected
  );
}

function renderAdminListError(error) {
  elements.adminSummary.hidden = true;
  elements.adminSummary.innerHTML = "";
  elements.adminRequestsList.innerHTML =
    '<div class="empty-state">No hay empresas cargadas.</div>';

  if (isAdminPermissionError(error)) {
    showAdminListError(
      "El token interno no es válido o venció. Ingrésalo de nuevo.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    showAdminListError("Revisa el filtro de estado e intenta de nuevo.");
    return;
  }

  showAdminListError(
    "No pudimos cargar las empresas. Revisa el token interno e intenta de nuevo.",
  );
}

function updateAdminAccessState() {
  elements.adminCompaniesSection.classList.toggle(
    "has-admin-token",
    Boolean(adminToken),
  );
}

function requestAdminConfirmation(options) {
  if (pendingAdminConfirmation) {
    pendingAdminConfirmation(false);
  }

  elements.adminConfirmationTitle.textContent =
    options.title || "Confirmar accion";
  elements.adminConfirmationMessage.textContent = options.message || "";
  elements.adminConfirmationConfirm.textContent =
    options.confirmLabel || "Confirmar";
  elements.adminConfirmationConfirm.classList.toggle(
    "danger-button",
    Boolean(options.danger),
  );
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
    showAdminDetailError(
      "No tienes acceso para realizar esta accion con el token actual.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    ["COMPANY_REGISTRATION_REQUEST_NOT_FOUND", "COMPANY_NOT_FOUND"].includes(
      error.code,
    )
  ) {
    showAdminDetailError(
      "La empresa ya fue procesada por otro flujo. Actualiza la lista.",
    );
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

  if (
    error instanceof ApiError &&
    error.code === "INVITATION_ALREADY_ACCEPTED"
  ) {
    showAdminDetailError(
      "El acceso ya fue creado. No es necesario reenviarlo.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_EXPIRED") {
    showAdminDetailError(
      "El acceso venció. Actualiza la lista antes de reenviar.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "INVITATION_NOT_FOUND") {
    showAdminDetailError("No hay un acceso pendiente para reenviar.");
    return;
  }

  if (error instanceof ApiError && error.code === "COMPANY_USER_NOT_FOUND") {
    showAdminDetailError("No encontramos un acceso activo con ese correo.");
    return;
  }

  showAdminDetailError("No pudimos completar la accion. Intenta de nuevo.");
}

function renderInvitationLoading() {
  currentInvitation = null;
  elements.invitationLoading.hidden = false;
  elements.invitationLoading.textContent = "Revisando acceso...";
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
  elements.invitationCompanyName.textContent =
    invitation.companyName || "No disponible";
  elements.invitationEmail.textContent = invitation.email || "No disponible";
  elements.invitationRole.textContent = getInvitationRoleLabel(invitation.role);
  elements.invitationExpiresAt.textContent = formatDateTime(
    invitation.expiresAt,
  );
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
  elements.invitationError.textContent =
    "El servicio no está disponible en este momento. Intenta más tarde.";
}

function renderPasswordResetLoading() {
  elements.passwordResetLoading.hidden = false;
  elements.passwordResetLoading.textContent = "Revisando enlace...";
  elements.passwordResetForm.hidden = true;
  clearPasswordResetCompleteMessages();
}

function renderPasswordResetValid(result) {
  elements.passwordResetLoading.hidden = true;
  elements.passwordResetForm.hidden = false;
  clearPasswordResetCompleteMessages();
  elements.newPasswordInput.value = "";
  elements.newPasswordConfirmationInput.value = "";
  elements.passwordResetStatus.hidden = false;
  elements.passwordResetStatus.textContent = `Enlace válido para ${result.email || "la empresa"}.`;
  window.requestAnimationFrame(() => {
    elements.newPasswordInput.focus();
  });
}

function renderPasswordResetUnavailable(reason) {
  const states = {
    invalid:
      "El enlace de recuperación no es válido. Solicita un nuevo correo de restablecimiento.",
    expired:
      "El enlace de recuperación expiró. Solicita un nuevo correo de restablecimiento.",
    used: "Este enlace ya fue utilizado. Accede a tu panel o solicita un nuevo correo si lo necesitas.",
    service:
      "No pudimos revisar el enlace en este momento. Intenta de nuevo más tarde.",
  };
  elements.passwordResetLoading.hidden = true;
  elements.passwordResetForm.hidden = true;
  elements.passwordResetStatus.hidden = true;
  elements.passwordResetStatus.textContent = "";
  elements.passwordResetError.hidden = false;
  elements.passwordResetError.textContent = states[reason] || states.invalid;
}

function renderAccessCreated(result) {
  const email = result.email || currentInvitation?.email || "";
  elements.createAccessForm.hidden = true;
  elements.accessStatus.hidden = false;
  elements.accessStatus.textContent =
    "Acceso creado correctamente. Ya puedes acceder a tu panel.";
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

  if (
    error instanceof ApiError &&
    error.code === "INVITATION_ALREADY_ACCEPTED"
  ) {
    renderInvitationUnavailable("accepted");
    return;
  }

  if (
    error instanceof ApiError &&
    error.code === "COMPANY_USER_ALREADY_EXISTS"
  ) {
    showAccessError("Ya existe un acceso para ese correo. Accede a tu panel.");
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
    showLoginError(
      "Completa el correo y la contraseña para acceder a tu panel.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "UNAUTHORIZED") {
    showLoginError(
      "Correo o contraseña incorrectos. Revisa los datos o recupera el acceso.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "SESSION_NOT_PERSISTED") {
    showLoginError(
      "No pudimos conservar la sesión en este navegador. Actualiza la página o revisa si el navegador está bloqueando cookies.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "FORBIDDEN") {
    showLoginError(
      "El acceso no está activo. Contacta al administrador de Punto Club.",
    );
    return;
  }

  if (
    error instanceof ApiError &&
    ["RATE_LIMITED", "TOO_MANY_ATTEMPTS"].includes(error.code)
  ) {
    showLoginError(
      "Hay demasiados intentos recientes. Espere unos minutos o recupere el acceso.",
    );
    return;
  }

  if (!(error instanceof ApiError)) {
    showLoginError(
      "No pudimos conectar con Punto Club. Verifique internet o intente de nuevo.",
    );
    return;
  }

  showLoginError("No pudimos acceder a tu panel. Intenta de nuevo.");
}

function renderPasswordResetRequestError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      if (detail.field === "email") {
        elements.passwordResetEmailError.textContent =
          "Ingresa un correo válido.";
      }
    });
    showPasswordResetRequestError("Revisa los datos ingresados.");
    return;
  }

  showPasswordResetRequestError(
    "No pudimos enviar las instrucciones. Intenta de nuevo más tarde.",
  );
}

function renderPasswordResetCompleteError(error) {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    error.details.forEach((detail) => {
      const target = {
        password: elements.newPasswordError,
        token: elements.passwordResetError,
      }[detail.field];

      if (target) {
        target.textContent =
          detail.field === "password"
            ? "Usa de 10 a 128 caracteres, con letras y números."
            : "El enlace no es válido. Solicita un nuevo correo de restablecimiento.";
      }
    });
    showPasswordResetError("Revisa los datos ingresados.");
    return;
  }

  if (
    error instanceof ApiError &&
    [
      "PASSWORD_RESET_NOT_FOUND",
      "PASSWORD_RESET_ALREADY_USED",
      "PASSWORD_RESET_EXPIRED",
    ].includes(error.code)
  ) {
    renderPasswordResetUnavailable(
      error.code === "PASSWORD_RESET_EXPIRED"
        ? "expired"
        : error.code === "PASSWORD_RESET_ALREADY_USED"
          ? "used"
          : "invalid",
    );
    return;
  }

  showPasswordResetError(
    "No pudimos guardar la nueva contraseña. Intenta de nuevo.",
  );
}

function renderAuthIdentity(identity) {
  const companyName = identity?.company?.name || "Empresa";
  const email = identity?.user?.email || "Sesión iniciada";
  api.setActiveCompanyId?.(identity?.company?.id);
  elements.authStatus.textContent =
    email && email !== companyName ? email : "Sesión iniciada";
  elements.loginButton.hidden = true;
  elements.logoutButton.hidden = false;
  renderActiveCompanyIdentity(identity?.company || null);
}

function renderSignedOut() {
  api.setActiveCompanyId?.(config.companyId);
  elements.authStatus.textContent = "Sesión no iniciada";
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
  elements.activeCompanyLogoFallback.textContent =
    getCompanyInitials(companyName);

  const logoSource = company?.logoUrl ? company : currentCompanySettings;
  const logoUrl = logoSource?.logoUrl
    ? api.getCompanyLogoUrl?.(logoSource.logoUrl)
    : "";
  const updatedAt = logoSource?.logoUpdatedAt || logoSource?.updatedAt;

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
  return (
    String(name || "PC")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PC"
  );
}

function renderCustomersError(error) {
  const message = isAuthRequiredError(error)
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
    showPurchaseError(
      "Ya existe una compra con esa factura o comprobante. Usa otro número o revisa el historial del cliente.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND") {
    showPurchaseError("El cliente seleccionado ya no está disponible.");
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
    showRedemptionError(
      "El cliente no tiene puntos suficientes para redimir esa cantidad.",
    );
    return;
  }

  if (error instanceof ApiError && error.code === "CUSTOMER_NOT_FOUND") {
    showRedemptionError("El cliente seleccionado ya no está disponible.");
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
    phone: "El teléfono es requerido y debe tener 32 caracteres o menos.",
    email: "El correo debe tener un formato válido y 254 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getPurchaseValidationMessage(detail) {
  const messagesByField = {
    invoiceNumber:
      "La factura o comprobante es requerido y debe tener 80 caracteres o menos.",
    purchaseDate: "La fecha de compra es requerida.",
    amount: "El monto debe ser mayor que 0.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getRedemptionValidationMessage(detail) {
  const messagesByField = {
    redemptionDate: "La fecha de redención es requerida.",
    pointsRedeemed: "Los puntos a redimir deben ser un entero mayor que 0.",
    note: "La nota debe tener 500 caracteres o menos.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    email: "El correo debe tener un formato válido y 254 caracteres o menos.",
    phone: "El teléfono debe tener entre 7 y 32 caracteres.",
    pointsPercentage:
      "El porcentaje debe ser mayor que 0 y menor o igual que 100.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyPasswordValidationMessage(detail) {
  const messagesByField = {
    currentPassword: "Ingresa la contraseña actual.",
    newPassword:
      "Usa de 10 a 128 caracteres, con letras y números, distinta a la actual.",
    passwordConfirmation:
      "La confirmación debe coincidir con la nueva contraseña.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyLogoValidationMessage(file) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

  if (!file) {
    return "Selecciona una imagen de logo.";
  }

  if (!allowedTypes.has(file.type)) {
    return "El logo debe ser una imagen PNG, JPG o WebP.";
  }

  if (file.size > 1048576) {
    return "El logo debe pesar 1 MB o menos.";
  }

  return "";
}

async function getRegistrationLogoValidationMessage(file) {
  const validationMessage = getCompanyLogoValidationMessage(file);

  if (validationMessage) {
    return validationMessage;
  }

  if (file.size <= 0) {
    return "No pudimos leer el archivo. Descárgalo en este equipo y vuelve a seleccionarlo.";
  }

  try {
    await file.slice(0, Math.min(file.size, 4096)).arrayBuffer();
  } catch (error) {
    return "No pudimos leer el archivo. Descárgalo en este equipo y vuelve a seleccionarlo.";
  }

  try {
    await validateReadableImageFile(file);
  } catch (error) {
    return "No pudimos leer la imagen. Guarda una copia nueva en PNG, JPG o WebP y vuelve a intentarlo.";
  }

  return "";
}

async function validateReadableImageFile(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close?.();
      return;
    } catch (error) {
      // Fall back to the same rendering path used by the preview image.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function getCompanyRegistrationValidationMessage(detail) {
  const messagesByField = {
    companyName: "Ingresa el nombre de la empresa.",
    companyEmail: "Ingresa un correo de empresa válido.",
    companyAddress: "Ingresa la dirección de la empresa.",
    companyPhone: "El teléfono de empresa debe tener 32 caracteres o menos.",
    contactName: "El nombre de contacto debe tener 160 caracteres o menos.",
    contactEmail: "Ingresa un correo de contacto válido.",
    contactPhone: "El teléfono de contacto debe tener 32 caracteres o menos.",
    logoFile:
      "No pudimos procesar el logo. Quítalo o selecciona otra imagen para continuar.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getCompanyRegistrationLogoErrorMessage(error) {
  const messagesByCode = {
    LOGO_FILE_UNREADABLE:
      "No pudimos leer la imagen. Guarda una copia nueva en PNG, JPG o WebP y vuelve a intentarlo.",
    LOGO_STORAGE_UNAVAILABLE:
      "No pudimos guardar el logo en este momento. Puedes intentar de nuevo o enviar los datos sin logo.",
    UNSUPPORTED_MEDIA_TYPE: "El logo debe ser una imagen PNG, JPG o WebP.",
    UPLOAD_TOO_LARGE: "El logo debe pesar 1 MB o menos.",
  };

  return (
    messagesByCode[error.code] ||
    "No pudimos procesar el logo. Quítalo o selecciona otra imagen para continuar."
  );
}

function getCreateAccessValidationMessage(detail) {
  const messagesByField = {
    displayName: "El nombre debe tener 160 caracteres o menos.",
    password: "Usa de 10 a 128 caracteres, con letras y números.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function getLoginValidationMessage(detail) {
  const messagesByField = {
    email: "Ingresa un correo válido.",
    password: "Ingresa la contraseña.",
  };

  return messagesByField[detail.field] ?? detail.message;
}

function isAuthRequiredError(error) {
  return (
    error instanceof ApiError &&
    ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code)
  );
}

function isSessionInvalidForActiveCompanyError(error) {
  return (
    isAuthRequiredError(error) ||
    (Boolean(currentAuthIdentity) &&
      error instanceof ApiError &&
      error.code === "COMPANY_NOT_FOUND")
  );
}

function redirectToLoginForExpiredSession() {
  currentAuthIdentity = null;
  renderSignedOut();
  showLoginPage({ replaceRoute: true });
  showLoginError("Tu sesión expiró. Accede nuevamente a tu panel.");
}

function isAdminPermissionError(error) {
  return (
    error instanceof ApiError &&
    ["UNAUTHORIZED", "FORBIDDEN"].includes(error.code)
  );
}

function getAuthRequiredMessage() {
  return "Accede a tu panel para operar con la empresa activa.";
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

function showCustomerReportStatus(message) {
  elements.customerReportStatus.hidden = false;
  elements.customerReportStatus.textContent = message;
}

function showCustomerReportError(message) {
  elements.customerReportError.hidden = false;
  elements.customerReportError.textContent = message;
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

function showCompanyPasswordStatus(message) {
  elements.companyPasswordStatus.hidden = false;
  elements.companyPasswordStatus.textContent = message;
}

function showCompanyPasswordError(message) {
  elements.companyPasswordError.hidden = false;
  elements.companyPasswordError.textContent = message;
}

function showOperationalEmailStatus(message) {
  elements.companyOperationalEmailStatus.hidden = false;
  elements.companyOperationalEmailStatus.textContent = message;
}

function showOperationalEmailError(message) {
  elements.companyOperationalEmailError.hidden = false;
  elements.companyOperationalEmailError.textContent = message;
}

function showOperationalEmailHistoryStatus(message) {
  elements.companyEmailHistoryStatusMessage.hidden = false;
  elements.companyEmailHistoryStatusMessage.textContent = message;
}

function showOperationalEmailHistoryError(message) {
  elements.companyEmailHistoryError.textContent = message;
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

function showPasswordResetRequestError(message) {
  elements.passwordResetRequestError.hidden = false;
  elements.passwordResetRequestError.textContent = message;
}

function showPasswordResetRequestStatus(message) {
  elements.passwordResetRequestStatus.hidden = false;
  elements.passwordResetRequestStatus.textContent = message;
}

function showPasswordResetError(message) {
  elements.passwordResetError.hidden = false;
  elements.passwordResetError.textContent = message;
}

function showPasswordResetStatus(message) {
  elements.passwordResetStatus.hidden = false;
  elements.passwordResetStatus.textContent = message;
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

function clearCustomerReportMessages() {
  elements.customerReportError.hidden = true;
  elements.customerReportError.textContent = "";
  elements.customerReportStatus.hidden = true;
  elements.customerReportStatus.textContent = "";
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

function clearCompanyPasswordMessages() {
  elements.companyCurrentPasswordError.textContent = "";
  elements.companyNewPasswordError.textContent = "";
  elements.companyNewPasswordConfirmationError.textContent = "";
  elements.companyPasswordError.hidden = true;
  elements.companyPasswordError.textContent = "";
  elements.companyPasswordStatus.hidden = true;
  elements.companyPasswordStatus.textContent = "";
}

function clearOperationalEmailMessages() {
  elements.companyEmailReplyToError.textContent = "";
  elements.companyOperationalEmailError.hidden = true;
  elements.companyOperationalEmailError.textContent = "";
  elements.companyOperationalEmailStatus.hidden = true;
  elements.companyOperationalEmailStatus.textContent = "";
}

function clearOperationalEmailHistoryMessages() {
  elements.companyEmailHistoryError.textContent = "";
  elements.companyEmailHistoryStatusMessage.hidden = true;
  elements.companyEmailHistoryStatusMessage.textContent = "";
}

function clearCompanyPasswordForm(options = {}) {
  elements.companyPasswordForm.reset();
  setPasswordInputHidden(
    elements.companyCurrentPasswordInput,
    elements.toggleCompanyCurrentPasswordButton,
  );
  setPasswordInputHidden(
    elements.companyNewPasswordInput,
    elements.toggleCompanyNewPasswordButton,
  );
  setPasswordInputHidden(
    elements.companyNewPasswordConfirmationInput,
    elements.toggleCompanyNewPasswordConfirmationButton,
  );

  if (options.keepStatus) {
    const message = elements.companyPasswordStatus.textContent;
    clearCompanyPasswordMessages();
    if (message) {
      showCompanyPasswordStatus(message);
    }
    return;
  }

  clearCompanyPasswordMessages();
}

function setCompanyPasswordPanelVisible(isVisible, options = {}) {
  elements.companyPasswordForm.hidden = !isVisible;
  elements.toggleCompanyPasswordPanelButton.setAttribute(
    "aria-expanded",
    String(isVisible),
  );
  setButtonText(
    elements.toggleCompanyPasswordPanelButton,
    isVisible ? "Ocultar cambio de contraseña" : "Cambiar contraseña",
  );

  if (!isVisible && !options.keepForm) {
    clearCompanyPasswordForm();
  }

  if (isVisible && options.focus !== false) {
    window.requestAnimationFrame(() => {
      elements.companyCurrentPasswordInput.focus({
        preventScroll: isCompactViewport(),
      });
    });
  }
}

function toggleCompanyPasswordPanel() {
  setCompanyPasswordPanelVisible(elements.companyPasswordForm.hidden);
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
      ? "Acceso interno activo en esta pestaña."
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

function clearPasswordResetRequestMessages() {
  elements.passwordResetEmailError.textContent = "";
  elements.passwordResetRequestError.hidden = true;
  elements.passwordResetRequestError.textContent = "";
  elements.passwordResetRequestStatus.hidden = true;
  elements.passwordResetRequestStatus.textContent = "";
}

function setPasswordResetRequestPanelVisible(isVisible, options = {}) {
  elements.passwordResetRequestForm.hidden = !isVisible;
  elements.togglePasswordResetRequestButton.setAttribute(
    "aria-expanded",
    String(isVisible),
  );
  setButtonText(
    elements.togglePasswordResetRequestButton,
    isVisible ? "Ocultar recuperación" : "Recuperar acceso",
  );

  if (!isVisible && !options.keepMessages) {
    clearPasswordResetRequestMessages();
  }

  if (isVisible) {
    if (
      !elements.passwordResetEmailInput.value &&
      elements.loginEmailInput.value
    ) {
      elements.passwordResetEmailInput.value = elements.loginEmailInput.value;
    }
    window.requestAnimationFrame(() => {
      elements.passwordResetEmailInput.focus();
    });
  }
}

function togglePasswordResetRequestPanel() {
  setPasswordResetRequestPanelVisible(elements.passwordResetRequestForm.hidden);
}

function clearPasswordResetCompleteMessages() {
  elements.newPasswordError.textContent = "";
  elements.newPasswordConfirmationError.textContent = "";
  elements.passwordResetError.hidden = true;
  elements.passwordResetError.textContent = "";
  elements.passwordResetStatus.hidden = true;
  elements.passwordResetStatus.textContent = "";
}

function setSubmitting(isSubmitting) {
  elements.saveButton.disabled = isSubmitting;
  setButtonText(
    elements.saveButton,
    isSubmitting ? "Registrando..." : "Registrar cliente",
  );
}

function setPurchaseSubmitting(isSubmitting) {
  elements.savePurchaseButton.disabled = isSubmitting;
  setButtonText(
    elements.savePurchaseButton,
    isSubmitting ? "Registrando..." : "Registrar compra",
  );
}

function setRedemptionSubmitting(isSubmitting) {
  elements.saveRedemptionButton.disabled = isSubmitting;
  setButtonText(
    elements.saveRedemptionButton,
    isSubmitting ? "Redimiendo..." : "Redimir puntos",
  );
}

function setReportSubmitting(isSubmitting) {
  elements.loadReportButton.disabled = isSubmitting;
  setButtonText(
    elements.loadReportButton,
    isSubmitting ? "Consultando..." : "Consultar",
  );
}

function setMembershipFinancialReportSubmitting(isSubmitting) {
  elements.loadMembershipFinancialReportButton.disabled = isSubmitting;
  elements.exportMembershipFinancialReportButton.disabled =
    isSubmitting || !currentMembershipFinancialReport?.items?.length;
  setButtonText(
    elements.loadMembershipFinancialReportButton,
    isSubmitting ? "Consultando..." : "Consultar",
  );
}

function setCustomerReportSubmitting(isSubmitting) {
  elements.loadCustomerReportButton.disabled = isSubmitting;
  elements.exportCustomerReportButton.disabled =
    isSubmitting || !currentCustomerReport?.items?.length;
  setButtonText(
    elements.loadCustomerReportButton,
    isSubmitting ? "Consultando..." : "Consultar",
  );
}

function setAuditSubmitting(isSubmitting) {
  elements.loadAuditButton.disabled = isSubmitting;
  elements.exportAuditButton.disabled =
    isSubmitting || !currentAuditEvents?.items?.length;
  setButtonText(
    elements.loadAuditButton,
    isSubmitting ? "Consultando..." : "Consultar",
  );
}

function setCompanyLoading(isLoading) {
  elements.reloadCompanyButton.disabled = isLoading;
  setButtonText(
    elements.reloadCompanyButton,
    isLoading ? "Cargando..." : "Actualizar",
  );
}

function setCompanySubmitting(isSubmitting) {
  elements.saveCompanyButton.disabled = isSubmitting;
  setButtonText(
    elements.saveCompanyButton,
    isSubmitting ? "Guardando..." : "Guardar configuración",
  );
}

function setCompanyPasswordSubmitting(isSubmitting) {
  elements.saveCompanyPasswordButton.disabled = isSubmitting;
  elements.resetCompanyPasswordFormButton.disabled = isSubmitting;
  elements.companyCurrentPasswordInput.disabled = isSubmitting;
  elements.companyNewPasswordInput.disabled = isSubmitting;
  elements.companyNewPasswordConfirmationInput.disabled = isSubmitting;
  elements.toggleCompanyCurrentPasswordButton.disabled = isSubmitting;
  elements.toggleCompanyNewPasswordButton.disabled = isSubmitting;
  elements.toggleCompanyNewPasswordConfirmationButton.disabled = isSubmitting;
  setButtonText(
    elements.saveCompanyPasswordButton,
    isSubmitting ? "Actualizando..." : "Actualizar contraseña",
  );
}

function setOperationalEmailSubmitting(isSubmitting) {
  elements.saveCompanyOperationalEmailButton.disabled = isSubmitting;
  elements.companyEmailWelcomeEnabledInput.disabled = isSubmitting;
  elements.companyEmailPurchaseEnabledInput.disabled = isSubmitting;
  elements.companyEmailRedemptionEnabledInput.disabled = isSubmitting;
  elements.companyEmailReplyToInput.disabled = isSubmitting;
  setButtonText(
    elements.saveCompanyOperationalEmailButton,
    isSubmitting ? "Guardando..." : "Guardar correos operativos",
  );
}

function setOperationalEmailHistoryLoading(isLoading) {
  elements.companyEmailHistoryLoadButton.disabled = isLoading;
  setButtonText(
    elements.companyEmailHistoryLoadButton,
    isLoading ? "Consultando..." : "Consultar",
  );
}

function setCompanyLogoSubmitting(isSubmitting) {
  elements.uploadCompanyLogoButton.disabled = isSubmitting;
  elements.clearCompanyLogoButton.disabled = isSubmitting;
  elements.companyLogoFileInput.disabled = isSubmitting;
  setButtonText(
    elements.uploadCompanyLogoButton,
    isSubmitting ? "Subiendo..." : "Subir logo",
  );
}

function setCompanyRegistrationSubmitting(isSubmitting) {
  elements.submitRegistrationButton.disabled = isSubmitting;
  elements.resetRegistrationButton.disabled = isSubmitting;
  setButtonText(
    elements.submitRegistrationButton,
    isSubmitting ? "Enviando..." : "Enviar datos",
  );
}

function setMembershipPlanSubmitting(isSubmitting) {
  elements.reloadMembershipPlansButton.disabled = isSubmitting;
  elements.saveMembershipPlanButton.disabled = isSubmitting;
  elements.resetMembershipPlanButton.disabled = isSubmitting;
  elements.cancelMembershipPlanButton.disabled = isSubmitting;
  setButtonText(
    elements.saveMembershipPlanButton,
    isSubmitting
      ? "Guardando..."
      : elements.membershipPlanIdInput.value
        ? "Guardar cambios"
        : "Guardar plan",
  );
}

function setMembershipBenefitSubmitting(isSubmitting) {
  elements.saveMembershipBenefitButton.disabled = isSubmitting;
  elements.resetMembershipBenefitButton.disabled = isSubmitting;
  elements.cancelMembershipBenefitButton.disabled = isSubmitting;
  setButtonText(
    elements.saveMembershipBenefitButton,
    isSubmitting
      ? "Guardando..."
      : elements.membershipBenefitIdInput.value
        ? "Guardar cambios"
        : "Guardar beneficio",
  );
}

function setMembershipExpirationLoading(isLoading) {
  elements.membershipExpirationWithinDaysInput.disabled = isLoading;
  elements.loadMembershipExpirationButton.disabled = isLoading;
  elements.reloadMembershipExpirationButton.disabled = isLoading;
  setButtonText(
    elements.loadMembershipExpirationButton,
    isLoading ? "Consultando..." : "Consultar",
  );
  setButtonText(
    elements.reloadMembershipExpirationButton,
    isLoading ? "Cargando..." : "Actualizar",
  );
}

function setMembershipActivationSubmitting(isSubmitting, options = {}) {
  elements.searchMembershipCustomerButton.disabled = isSubmitting;
  elements.membershipCustomerSearchInput.disabled = isSubmitting;
  elements.membershipActivationPlanInput.disabled = isSubmitting;
  elements.membershipActivationStartDateInput.disabled = isSubmitting;
  elements.membershipActivationPricePaidInput.disabled = isSubmitting;
  elements.membershipActivationPaymentMethodInput.disabled = isSubmitting;
  elements.activateMembershipButton.disabled = isSubmitting;
  setButtonText(
    elements.activateMembershipButton,
    isSubmitting && !options.searching ? "Activando..." : "Activar membresía",
  );
  setButtonText(
    elements.searchMembershipCustomerButton,
    isSubmitting && options.searching ? "Buscando..." : "Buscar cliente",
  );
}

function setMembershipOperationLoading(isLoading) {
  elements.reloadMembershipOperationButton.disabled = isLoading;
  setButtonText(
    elements.reloadMembershipOperationButton,
    isLoading ? "Cargando..." : "Actualizar",
  );
}

function setMembershipBenefitUsageSubmitting(isSubmitting) {
  elements.confirmMembershipBenefitUsageButton.disabled = isSubmitting;
  elements.cancelMembershipBenefitUsageButton.disabled = isSubmitting;
  elements.membershipBenefitUsageDateInput.disabled = isSubmitting;
  elements.membershipBenefitUsageQuantityInput.disabled = isSubmitting;
  elements.membershipBenefitUsageNoteInput.disabled = isSubmitting;
  setButtonText(
    elements.confirmMembershipBenefitUsageButton,
    isSubmitting ? "Aplicando..." : "Aplicar beneficio",
  );
}

function setMembershipRenewalSubmitting(isSubmitting) {
  elements.confirmMembershipRenewalButton.disabled = isSubmitting;
  elements.cancelMembershipRenewalButton.disabled = isSubmitting;
  elements.membershipRenewalPaymentMethodInput.disabled = isSubmitting;
  elements.membershipRenewalAmountInput.disabled = isSubmitting;
  setButtonText(
    elements.confirmMembershipRenewalButton,
    isSubmitting ? "Renovando..." : "Renovar membresía",
  );
}

function setAdminLoading(isLoading) {
  elements.loadAdminRequestsButton.disabled = isLoading;
  setButtonText(
    elements.loadAdminRequestsButton,
    isLoading ? "Cargando..." : "Actualizar",
  );
  elements.saveAdminTokenButton.disabled = isLoading;
}

function setAdminActionLoading(isLoading, action = "") {
  const approveButton = elements.adminRequestDetail.querySelector(
    "#approve-admin-request-button",
  );
  const rejectButton = elements.adminRequestDetail.querySelector(
    "#reject-admin-request-button",
  );
  const resendButton = elements.adminRequestDetail.querySelector(
    "#resend-admin-invitation-button",
  );
  const resetPasswordButton = elements.adminRequestDetail.querySelector(
    "#send-admin-password-reset-button",
  );

  [approveButton, rejectButton, resendButton, resetPasswordButton].forEach(
    (button) => {
      if (button) {
        button.disabled = isLoading;
      }
    },
  );

  if (approveButton) {
    setButtonText(
      approveButton,
      isLoading && action === "approve"
        ? "Activando empresa..."
        : "Activar y enviar acceso",
    );
  }

  if (rejectButton) {
    setButtonText(
      rejectButton,
      isLoading && action === "reject" ? "Guardando nota..." : "No continuar",
    );
  }

  if (resendButton) {
    setButtonText(
      resendButton,
      isLoading && action === "resend"
        ? "Reenviando acceso..."
        : "Reenviar acceso",
    );
  }

  if (resetPasswordButton) {
    setButtonText(
      resetPasswordButton,
      isLoading && action === "reset-password"
        ? "Enviando reset..."
        : "Enviar reset de acceso",
    );
  }
}

function setCreateAccessSubmitting(isSubmitting) {
  elements.createAccessButton.disabled = isSubmitting;
  setButtonText(
    elements.createAccessButton,
    isSubmitting ? "Creando..." : "Crear acceso",
  );
}

function setLoginSubmitting(isSubmitting) {
  elements.submitLoginButton.disabled = isSubmitting;
  setButtonText(
    elements.submitLoginButton,
    isSubmitting ? "Accediendo..." : "Acceder a mi panel",
  );
}

function setPasswordResetRequestSubmitting(isSubmitting) {
  elements.submitPasswordResetRequestButton.disabled = isSubmitting;
  setButtonText(
    elements.submitPasswordResetRequestButton,
    isSubmitting ? "Enviando..." : "Enviar instrucciones",
  );
}

function setPasswordResetSubmitting(isSubmitting) {
  elements.submitPasswordResetButton.disabled = isSubmitting;
  setButtonText(
    elements.submitPasswordResetButton,
    isSubmitting ? "Guardando..." : "Guardar contraseña",
  );
}

function applySeoForRoute(route) {
  const seoConfig = SEO_ROUTE_CONFIG[route] ?? SEO_ROUTE_CONFIG["/"];
  applySeoConfig(seoConfig);
}

function applyNoindexSeo() {
  applySeoConfig(SEO_NOINDEX_CONFIG);
}

function applySeoConfig(seoConfig) {
  document.title = seoConfig.title;
  setMetaContent("name", "description", seoConfig.description);
  setMetaContent("name", "robots", seoConfig.robots);
  setCanonicalHref(seoConfig.canonical);
  setMetaContent("property", "og:title", seoConfig.ogTitle);
  setMetaContent("property", "og:description", seoConfig.ogDescription);
  setMetaContent("property", "og:url", seoConfig.canonical);
  setMetaContent("name", "twitter:title", seoConfig.ogTitle);
  setMetaContent("name", "twitter:description", seoConfig.ogDescription);
}

function setMetaContent(attributeName, attributeValue, content) {
  let meta = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    document.head.append(meta);
  }
  meta.setAttribute("content", content);
}

function setCanonicalHref(href) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }
  canonical.setAttribute("href", href);
}

function showPublicHomePage() {
  applySeoForRoute("/");
  document.body.classList.add("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = false;
  elements.publicProductPage.hidden = true;
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
  elements.invitationPage.hidden = true;
  elements.loginButton.hidden = false;
  elements.logoutButton.hidden = true;
  elements.authStatus.hidden = true;
  elements.dataSourceStatus.hidden = true;
  renderActiveCompanyIdentity(null);
}

function showProductPage() {
  const route = window.location.pathname.replace(/\/$/, "") || "/";
  applySeoForRoute(route === "/producto" ? "/producto" : "/");
  document.body.classList.remove("public-home-mode");
  document.body.classList.add("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = false;
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
  elements.invitationPage.hidden = true;
  elements.loginButton.hidden = false;
  elements.logoutButton.hidden = true;
  elements.authStatus.hidden = true;
  elements.dataSourceStatus.hidden = true;
  renderActiveCompanyIdentity(null);
}

function showInvitationPage() {
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.appBody.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
  elements.invitationPage.hidden = false;
  renderActiveCompanyIdentity(null);
}

function showPasswordResetPage() {
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.appBody.hidden = true;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = false;
  elements.loginButton.hidden = false;
  elements.logoutButton.hidden = true;
  elements.authStatus.textContent = "Recuperación de acceso";
  renderActiveCompanyIdentity(null);
}

function showLoginPage(options = {}) {
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.appBody.hidden = true;
  elements.invitationPage.hidden = true;
  elements.passwordResetPage.hidden = true;
  elements.authPage.hidden = false;
  setPasswordResetRequestPanelVisible(false, {
    keepMessages: Boolean(options.keepPasswordResetMessages),
  });
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
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
  elements.appBody.hidden = false;
  if (isCompactViewport()) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
  const requestedSection = options.section || getDefaultLoyaltySection();
  setActiveSection(requestedSection, {
    focus: options.focus !== false,
  });

  if (options.replaceLoginRoute && isCompanyLoginRoute()) {
    window.history.replaceState({}, "", "/app");
  }

  if (options.refreshCompany) {
    await loadCompanySettings();
  }
}

function showPublicCompanyRegistrationPage() {
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.add("public-registration-mode");
  document.body.classList.remove("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
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
  applyNoindexSeo();
  document.body.classList.remove("public-home-mode");
  document.body.classList.remove("public-product-mode");
  document.body.classList.remove("public-registration-mode");
  document.body.classList.add("admin-companies-page-mode");
  elements.publicHomePage.hidden = true;
  elements.publicProductPage.hidden = true;
  elements.authStatus.hidden = false;
  elements.dataSourceStatus.hidden = false;
  elements.invitationPage.hidden = true;
  elements.authPage.hidden = true;
  elements.passwordResetPage.hidden = true;
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

function isCompactViewport() {
  return (
    window.matchMedia?.("(max-width: 860px)").matches ??
    window.innerWidth <= 860
  );
}

function startGlobalLoading(message, options = {}) {
  const delay = Number.isFinite(Number(options.delay))
    ? Number(options.delay)
    : 3000;
  stopGlobalLoading();
  globalLoadingTimer = window.setTimeout(
    () => {
      elements.globalLoadingMessage.textContent = message;
      elements.globalLoading.hidden = false;
    },
    Math.max(0, delay),
  );
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
    elements.accessPasswordError.textContent =
      "Usa de 10 a 128 caracteres, con letras y números.";
    isValid = false;
  }

  if (password !== confirmation) {
    elements.accessPasswordConfirmationError.textContent =
      "Las contraseñas no coinciden.";
    isValid = false;
  }

  if (!isValid) {
    showAccessError("Revisa los campos marcados antes de continuar.");
  }

  return isValid;
}

function validatePasswordResetCompleteForm() {
  const password = elements.newPasswordInput.value;
  const confirmation = elements.newPasswordConfirmationInput.value;
  let isValid = true;

  if (!isStrongPassword(password)) {
    elements.newPasswordError.textContent =
      "Usa de 10 a 128 caracteres, con letras y números.";
    isValid = false;
  }

  if (password !== confirmation) {
    elements.newPasswordConfirmationError.textContent =
      "Las contraseñas no coinciden.";
    isValid = false;
  }

  if (!passwordResetToken) {
    showPasswordResetError(
      "El enlace no es válido. Solicita un nuevo correo de restablecimiento.",
    );
    isValid = false;
  }

  if (!isValid) {
    showPasswordResetError("Revisa los datos ingresados.");
  }

  return isValid;
}

function validateCompanyPasswordChangeForm() {
  const currentPassword = elements.companyCurrentPasswordInput.value;
  const newPassword = elements.companyNewPasswordInput.value;
  const confirmation = elements.companyNewPasswordConfirmationInput.value;
  let isValid = true;

  if (!currentPassword || currentPassword.length > 128) {
    elements.companyCurrentPasswordError.textContent =
      "Ingresa la contraseña actual.";
    isValid = false;
  }

  if (!isStrongPassword(newPassword)) {
    elements.companyNewPasswordError.textContent =
      "Usa de 10 a 128 caracteres, con letras y números.";
    isValid = false;
  } else if (newPassword === currentPassword) {
    elements.companyNewPasswordError.textContent =
      "La nueva contraseña debe ser distinta a la actual.";
    isValid = false;
  }

  if (newPassword !== confirmation) {
    elements.companyNewPasswordConfirmationError.textContent =
      "Las contraseñas no coinciden.";
    isValid = false;
  }

  if (!isValid) {
    showCompanyPasswordError("Revisa los datos ingresados.");
  }

  return isValid;
}

function validateOperationalEmailSettingsForm() {
  const replyToEmail = elements.companyEmailReplyToInput.value.trim();
  if (replyToEmail && !isEmail(replyToEmail)) {
    elements.companyEmailReplyToError.textContent =
      "Ingresa un correo reply-to válido.";
    showOperationalEmailError("Revisa los datos ingresados.");
    return false;
  }

  return true;
}

function setOperationalEmailHistoryDefaults() {
  const today = new Date().toISOString().slice(0, 10);
  if (!elements.companyEmailHistoryFromInput.value) {
    elements.companyEmailHistoryFromInput.value = today;
  }
  if (!elements.companyEmailHistoryToInput.value) {
    elements.companyEmailHistoryToInput.value = today;
  }
}

function getOperationalEmailHistoryFilters() {
  return {
    from: elements.companyEmailHistoryFromInput.value,
    to: elements.companyEmailHistoryToInput.value,
    type: elements.companyEmailHistoryTypeInput.value,
    status: elements.companyEmailHistoryStatusInput.value,
    search: elements.companyEmailHistorySearchInput.value.trim(),
    limit: 25,
  };
}

function getOperationalEmailTypeLabel(type) {
  return (
    {
      welcome: "Bienvenida",
      purchase: "Compra",
      redemption: "Canje",
    }[type] || "Operativo"
  );
}

function getOperationalEmailStatusLabel(status) {
  return (
    {
      pending: "Pendiente",
      skipped: "Omitido",
      sent: "Enviado",
      failed: "Fallido",
    }[status] || "Pendiente"
  );
}

function getOperationalEmailReasonLabel(reason) {
  if (!reason) {
    return "Sin errores";
  }

  return (
    {
      disabled_by_company_settings: "Desactivado en configuración",
      customer_without_email: "Cliente sin correo",
      email_not_configured: "Correo no configurado",
      provider_not_sent: "Proveedor no confirmó envío",
      send_failed: "Fallo al enviar",
    }[reason] || "No disponible"
  );
}

function togglePasswordVisibility(input, button) {
  const isVisible = input.type === "text";
  input.type = isVisible ? "password" : "text";
  button.setAttribute("aria-pressed", String(!isVisible));
  const label = isVisible ? "Mostrar contraseña" : "Ocultar contraseña";
  button.dataset.icon = isVisible ? "eye" : "eye-off";
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  setButtonText(button, "");
  input.focus();
}

function setPasswordInputHidden(input, button) {
  input.type = "password";
  button.setAttribute("aria-pressed", "false");
  button.dataset.icon = "eye";
  const label = "Mostrar contraseña";
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  setButtonText(button, "");
}

function getBalanceValue(balance) {
  return balance && balance.pointsBalance != null
    ? Number(balance.pointsBalance)
    : 0;
}

function updateCustomerBalance(customerId, balance) {
  if (!balance) {
    return;
  }

  customerBalances.set(String(customerId), balance);
  currentCustomers = currentCustomers.map((customer) =>
    String(customer.id) === String(customerId)
      ? { ...customer, balance }
      : customer,
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
  return new Intl.NumberFormat("es-CR", { maximumFractionDigits: 0 }).format(
    Number(value),
  );
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
    return String(item.note || "")
      .toLowerCase()
      .includes("beneficio usado")
      ? "Beneficio usado"
      : "Membresía activada";
  }

  if (type === "benefit") {
    return "Beneficio usado";
  }

  return "Redención";
}

function getAuditEventLabel(eventType) {
  const labels = {
    "customer.created": "Cliente creado",
    "purchase.registered": "Compra registrada",
    "redemption.registered": "Puntos redimidos",
    "customer.rejected_duplicate": "Cliente duplicado",
    "purchase.rejected_duplicate_invoice": "Factura duplicada",
    "redemption.rejected_insufficient_points": "Saldo insuficiente",
    "company.settings.updated": "Configuración actualizada",
    "membership.plan.created": "Plan de membresía creado",
    "membership.plan.updated": "Plan de membresía actualizado",
    "membership.benefit.created": "Beneficio creado",
    "membership.benefit.updated": "Beneficio actualizado",
    "membership.benefit.used": "Uso de beneficio registrado",
    "customer.membership.activated": "Membresía de cliente activada",
  };

  return labels[eventType] ?? (eventType || "Evento");
}

function getAuditEntityLabel(entityType) {
  const labels = {
    customer: "Cliente",
    purchase: "Compra",
    redemption: "Redención",
    company: "Empresa",
    membership_plan: "Plan de membresía",
    membership_benefit: "Beneficio de membresía",
    membership_benefit_usage: "Uso de beneficio",
    customer_membership: "Membresía de cliente",
  };

  return labels[entityType] ?? (entityType || "Entidad");
}

function getCompanyStatusLabel(status) {
  const labels = {
    active: "Activa",
    inactive: "Inactiva",
    pending_activation: "Por activar",
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
    credit: "Crédito",
    transfer: "Transferencia",
    other: "Otro",
  };

  return labels[method] ?? "Método de pago";
}

function isMembershipRenewable(membership) {
  return Boolean(membership) && membership.status !== "cancelled";
}

function isMembershipCurrentlyUsable(membership) {
  return (
    Boolean(membership) &&
    membership.status === "active" &&
    String(membership.endDate || "") >= getToday()
  );
}

function getRenewableMembership(memberships = []) {
  return (
    memberships.find(isMembershipCurrentlyUsable) ||
    memberships.find(
      (membership) =>
        isMembershipRenewable(membership) &&
        String(membership.endDate || "") < getToday(),
    ) ||
    memberships.find(isMembershipRenewable) ||
    null
  );
}

function getSelectedCustomerMembershipActionLabel() {
  if (!selectedCustomerActiveMembership) {
    return "Activar membresía";
  }

  if (
    isMembershipCurrentlyUsable(selectedCustomerActiveMembership) &&
    selectedCustomerMembershipBenefits.length > 0
  ) {
    return "Aplicar beneficio";
  }

  if (isMembershipRenewable(selectedCustomerActiveMembership)) {
    return "Renovar membresía";
  }

  return "Activar membresía";
}

function getMembershipOperationCustomer() {
  return activeSection === "memberships"
    ? selectedMembershipCustomer
    : selectedCustomer;
}

function getExpirationAlertLabel(alert = {}) {
  const labels = {
    none: "Sin alerta de vencimiento.",
    expires_today: "La membresía vence hoy.",
    expiring_soon:
      alert.message ||
      `La membresía vence en ${alert.daysUntilExpiration} días.`,
    expired: "Membresía vencida.",
  };

  return labels[alert.state] ?? "Sin alerta de vencimiento.";
}

function getMembershipExpirationStateLabel(item = {}) {
  const days = Number(item.daysUntilExpiration ?? 0);

  if (days < 0 || item.state === "expired") {
    return `Vencio hace ${formatReportNumber(Math.abs(days))} días`;
  }

  if (days === 0 || item.state === "expires_today") {
    return "Vence hoy";
  }

  return `Vence en ${formatReportNumber(days)} días`;
}

function getSelectedActivationPlan() {
  const planId = elements.membershipActivationPlanInput.value;
  return (
    membershipPlans.find(
      (plan) => String(plan.id) === String(planId) && plan.status === "active",
    ) || null
  );
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
    category: "Categoría",
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
    return `${benefit.includedQuantity || 0} incluido, límite ${benefit.usageLimit || 0} por ${getUsagePeriodLabel(benefit.usagePeriod).toLowerCase()}`;
  }

  return "Beneficio informativo";
}

function getRegistrationStatusLabel(status) {
  const labels = {
    pending: "Por revisar",
    approved: "Activada",
    rejected: "No continuada",
    cancelled: "Cancelada",
  };

  return labels[status] ?? (status || "No disponible");
}

function getInvitationStatusLabel(status) {
  const labels = {
    pending: "Acceso pendiente",
    accepted: "Acceso creado",
    expired: "Acceso vencido",
    revoked: "Acceso no disponible",
  };

  return labels[status] ?? (status || "Acceso no disponible");
}

function getAdminInvitationLabel(invitation) {
  if (!invitation) {
    return "Sin acceso";
  }

  return getInvitationStatusLabel(invitation.status);
}

function getAdminRequestStateMessage(status) {
  const messages = {
    pending: "Datos recibidos para revisar.",
    approved: "Esta empresa ya está activada.",
    rejected: "Esta empresa quedó como no continuada.",
    cancelled: "Esta empresa ya no está disponible.",
  };

  return (
    messages[status] ??
    "Esta empresa ya fue procesada. Actualiza la lista para ver el estado más reciente."
  );
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
      title: "Acceso no disponible",
      message:
        "Este enlace expiró, ya fue usado o no está disponible. Solicita un nuevo acceso.",
    },
    expired: {
      title: "Acceso vencido",
      message:
        "Este enlace expiró. Contacta al equipo de Punto Club para recibir un nuevo acceso.",
    },
    accepted: {
      title: "Acceso creado",
      message:
        "Este enlace ya fue usado. Si no puedes entrar, contacta al equipo de Punto Club.",
    },
    revoked: {
      title: "Acceso no disponible",
      message:
        "Este enlace ya no está disponible. Contacta al equipo de Punto Club para revisar el acceso de la empresa.",
    },
  };

  return states[reason] ?? states.invalid;
}

function isCompanyInvitationRoute() {
  return (
    window.location.pathname.replace(/\/$/, "") ===
    "/company-invitations/accept"
  );
}

function isCompanyPasswordResetRoute() {
  return (
    window.location.pathname.replace(/\/$/, "") === "/company-password-reset"
  );
}

function isProductRoute() {
  const route = window.location.pathname.replace(/\/$/, "") || "/";
  return route === "/" || route === "/producto";
}

function isOperationalAppRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/app";
}

function isCompanyLoginRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/login";
}

function isCompanyRegistrationRoute() {
  return (
    window.location.pathname.replace(/\/$/, "") === "/company-registration"
  );
}

function isAdminCompaniesRoute() {
  return window.location.pathname.replace(/\/$/, "") === "/admin-companies";
}

function getInvitationTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("token") || "";
}

function getPasswordResetTokenFromUrl() {
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
    const invoice = metadata.invoiceNumber
      ? ` Factura ${metadata.invoiceNumber}.`
      : "";
    return `Compra registrada.${invoice}`;
  }

  if (eventType === "redemption.registered") {
    const points = metadata.pointsRedeemed
      ? ` ${metadata.pointsRedeemed} pts.`
      : "";
    return `Puntos redimidos.${points}`;
  }

  if (eventType === "company.settings.updated") {
    const fields = Array.isArray(metadata.changedFields)
      ? metadata.changedFields.join(", ")
      : "";
    return fields
      ? `Configuración actualizada: ${fields}.`
      : "Configuración actualizada.";
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
  if (
    !currentReport ||
    !Array.isArray(currentReport.items) ||
    currentReport.items.length === 0
  ) {
    showReportError("Consulta un reporte con movimientos antes de exportar.");
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
    [
      "fecha",
      "tipo",
      "cliente",
      "telefono",
      "email",
      "detalle",
      "monto",
      "puntos",
    ],
    ...report.items.map((item) => [
      item.date || "",
      getReportTypeLabel(item.type, item),
      item.customerName || "",
      item.customerPhone || "",
      item.customerEmail || "",
      getReportCsvDetail(item),
      ["purchase", "membership"].includes(item.type) && item.amount != null
        ? Number(item.amount ?? 0)
        : "",
      Number(item.points ?? 0),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

function exportMembershipFinancialReportCsv() {
  if (
    !currentMembershipFinancialReport ||
    !Array.isArray(currentMembershipFinancialReport.items) ||
    currentMembershipFinancialReport.items.length === 0
  ) {
    showMembershipFinancialReportError(
      "Consulta un reporte de membresías antes de exportar.",
    );
    return;
  }

  const csv = buildMembershipFinancialReportCsv(
    currentMembershipFinancialReport,
  );
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `punto-club-membresías-financiero-${currentMembershipFinancialReport.from}-${currentMembershipFinancialReport.to}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMembershipFinancialReportStatus(
    "CSV de membresías exportado desde los datos cargados.",
  );
}

function exportCustomerReportCsv() {
  if (
    !currentCustomerReport ||
    currentCustomerReport.status !== "resolved" ||
    !Array.isArray(currentCustomerReport.items) ||
    currentCustomerReport.items.length === 0
  ) {
    showCustomerReportError(
      "Consulta un reporte por cliente con movimientos antes de exportar.",
    );
    return;
  }

  const csv = buildReportCsv(currentCustomerReport);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const customer = currentCustomerReport.customer?.id || "cliente";
  link.href = url;
  link.download = `punto-club-reporte-cliente-${customer}-${currentCustomerReport.from}-${currentCustomerReport.to}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showCustomerReportStatus("CSV exportado desde los datos cargados.");
}

function exportAuditCsv() {
  if (
    !currentAuditEvents ||
    !Array.isArray(currentAuditEvents.items) ||
    currentAuditEvents.items.length === 0
  ) {
    showAuditError("Consulta un historial con eventos antes de exportar.");
    return;
  }

  const rows = [
    ["fecha_hora", "evento", "cliente", "entidad", "entidad_id", "resumen"],
    ...currentAuditEvents.items.map((item) => {
      const eventType = item.eventType || item.event_type || "";
      const entityType = item.entityType || item.entity_type || "";
      const entityId = item.entityId || item.entity_id || "";
      const customerName = item.customerName || item.customer_name || "";
      const customerId = item.customerId || item.customer_id || "";
      return [
        item.occurredAt || item.occurred_at || "",
        getAuditEventLabel(eventType),
        customerName || (customerId ? `Cliente ${customerId}` : "No aplica"),
        getAuditEntityLabel(entityType),
        entityId,
        getAuditSummary(item, eventType),
      ];
    }),
  ];

  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `punto-club-historial-${currentAuditEvents.from || "desde"}-${currentAuditEvents.to || "hasta"}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showAuditStatus("CSV de historial exportado desde los datos cargados.");
}

function buildMembershipFinancialReportCsv(report) {
  const rows = [
    [
      "fecha_hora",
      "fecha_transaccion",
      "cliente",
      "telefono",
      "email",
      "plan",
      "tipo",
      "metodo_pago",
      "monto",
      "nota",
    ],
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
    return item.invoiceNumber
      ? `Factura ${item.invoiceNumber}`
      : "Compra sin comprobante";
  }

  if (item.type === "membership") {
    return item.note || "Evento de membresía";
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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
