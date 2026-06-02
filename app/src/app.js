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
};

elements.dataSourceStatus.textContent = api.sourceLabel;

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadCustomers(elements.searchInput.value);
});

elements.clearSearchButton.addEventListener("click", () => {
  elements.searchInput.value = "";
  loadCustomers("");
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitCustomer();
});

elements.resetFormButton.addEventListener("click", () => {
  clearForm();
});

loadCustomers("");

async function loadCustomers(search) {
  setCustomersFeedback("");
  renderLoading();

  try {
    const result = await api.searchCustomers(search.trim());
    renderCustomers(result.items, search.trim());
  } catch (error) {
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
    showSuccess(`Cliente registrado: ${customer.name}.`);
    clearForm({ keepSuccess: true });
    elements.searchInput.value = customer.phone;
    await loadCustomers(customer.phone);
  } catch (error) {
    renderFormError(error);
  } finally {
    setSubmitting(false);
  }
}

function renderLoading() {
  elements.customersList.innerHTML = '<div class="loading-state">Cargando clientes...</div>';
}

function renderCustomers(customers, search) {
  if (customers.length === 0) {
    const text = search
      ? "No encontramos clientes con esa busqueda. Puede registrarlo en el formulario."
      : "No hay clientes cargados para mostrar.";
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
          <div class="row-actions">
            <button class="secondary-button" type="button" data-action="future">Detalle</button>
          </div>
        </article>
      `,
    )
    .join("");

  elements.customersList.querySelectorAll("[data-action='future']").forEach((button) => {
    button.addEventListener("click", () => {
      setCustomersFeedback("Detalle, compras y redenciones quedan para las siguientes tareas MVP.");
    });
  });
}

function renderCustomersError(error) {
  const message =
    error instanceof ApiError && error.code === "INTERNAL_ERROR"
      ? "No se pudo consultar clientes. Intente de nuevo."
      : error instanceof ApiError
        ? error.message
        : "No se pudo cargar el listado.";
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
        target.textContent = getValidationMessage(detail);
      }
    });
    showFormError("Revise los campos marcados.");
    return;
  }

  if (error instanceof ApiError && error.code === "DUPLICATE_CUSTOMER") {
    showFormError("Ya existe un cliente con ese telefono o email. Busquelo antes de registrar.");
    return;
  }

  if (error instanceof ApiError && error.code === "INTERNAL_ERROR") {
    showFormError("No se pudo registrar el cliente. Intente de nuevo.");
    return;
  }

  showFormError("No se pudo registrar el cliente. Intente de nuevo.");
}

function getValidationMessage(detail) {
  const messagesByField = {
    name: "El nombre es requerido y debe tener 160 caracteres o menos.",
    phone: "El telefono es requerido y debe tener 32 caracteres o menos.",
    email: "El email debe tener un formato valido y 254 caracteres o menos.",
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

function clearForm(options = {}) {
  elements.form.reset();
  clearFormMessages(options);
  elements.nameInput.focus();
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

function setSubmitting(isSubmitting) {
  elements.saveButton.disabled = isSubmitting;
  elements.saveButton.textContent = isSubmitting ? "Registrando..." : "Registrar cliente";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
