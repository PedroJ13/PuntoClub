const defaultInternalNotificationEmail = "pj13eros_business@outlook.com";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getEmailConfig(env = process.env) {
  const connectionString = normalizeText(env.ACS_EMAIL_CONNECTION_STRING);
  const senderAddress = normalizeText(env.ACS_EMAIL_SENDER_ADDRESS);
  const senderDisplayName =
    normalizeText(env.ACS_EMAIL_SENDER_DISPLAY_NAME) || "Punto Club";
  const internalNotificationEmail =
    normalizeText(env.INTERNAL_NOTIFICATION_EMAIL) ||
    defaultInternalNotificationEmail;
  const publicBaseUrl = normalizeText(env.APP_PUBLIC_BASE_URL);

  return {
    connectionString,
    senderAddress,
    senderDisplayName,
    internalNotificationEmail,
    publicBaseUrl,
    enabled: Boolean(
      connectionString && senderAddress && internalNotificationEmail,
    ),
  };
}

function getPromotionalEmailConfig(env = process.env) {
  const config = getEmailConfig(env);
  const promotionalSenderAddress = normalizeText(
    env.PROMOTIONAL_EMAIL_SENDER_ADDRESS,
  );
  const promotionalSenderDisplayName = normalizeText(
    env.PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME,
  );

  return {
    ...config,
    senderAddress: promotionalSenderAddress || config.senderAddress,
    senderDisplayName: promotionalSenderDisplayName || config.senderDisplayName,
    enabled: Boolean(
      config.connectionString &&
      (promotionalSenderAddress || config.senderAddress) &&
      config.internalNotificationEmail,
    ),
  };
}

function getEmailSendErrorText(error) {
  if (!error) {
    return "";
  }

  return [
    error.message,
    error.reason,
    error.code,
    error.statusCode,
    error.status,
  ]
    .filter((value) => value != null && value !== "")
    .map((value) => String(value))
    .join(" ");
}

function isTransientEmailSendError(error) {
  const text = getEmailSendErrorText(error).toLowerCase();
  return (
    text.includes("try again after") ||
    text.includes("throttl") ||
    text.includes("too many") ||
    text.includes("rate limit") ||
    text.includes("timeout") ||
    text.includes("temporar") ||
    text.includes("econnreset") ||
    text.includes("etimedout") ||
    text.includes("429") ||
    text.includes("500") ||
    text.includes("502") ||
    text.includes("503") ||
    text.includes("504")
  );
}

function classifyEmailSendFailure(error, options = {}) {
  const text = getEmailSendErrorText(error).toLowerCase();
  const retrySuffix = options.retryExhausted ? "_retry_exhausted" : "";

  if (
    text.includes("sender domain has not been linked") ||
    text.includes("specified sender domain has not been linked") ||
    text.includes("domain has not been linked")
  ) {
    return "acs_sender_domain_not_linked";
  }

  if (
    text.includes("domain") &&
    (text.includes("not verified") || text.includes("verification"))
  ) {
    return "acs_sender_domain_not_verified";
  }

  if (
    text.includes("sender") &&
    (text.includes("unauthorized") ||
      text.includes("not authorized") ||
      text.includes("not allowed") ||
      text.includes("not permitted") ||
      text.includes("invalid sender"))
  ) {
    return "acs_sender_not_authorized";
  }

  if (
    text.includes("recipient") &&
    (text.includes("rejected") ||
      text.includes("invalid") ||
      text.includes("suppressed") ||
      text.includes("blocked"))
  ) {
    return "acs_recipient_rejected";
  }

  if (
    text.includes("try again after") ||
    text.includes("throttl") ||
    text.includes("too many") ||
    text.includes("rate limit") ||
    text.includes("429")
  ) {
    return `acs_email_throttled${retrySuffix}`;
  }

  if (
    text.includes("connection string") ||
    text.includes("authentication failed") ||
    text.includes("access key") ||
    text.includes("credential") ||
    text.includes("unauthorized") ||
    text.includes("401") ||
    text.includes("403")
  ) {
    return "acs_email_config_error";
  }

  if (isTransientEmailSendError(error)) {
    return `acs_email_transient${retrySuffix}`;
  }

  return "send_failed";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayValue(value) {
  const text = normalizeText(value);
  return text || "No indicado";
}

function getRequesterEmail(registrationRequest) {
  return (
    normalizeText(registrationRequest.contactEmail) ||
    normalizeText(registrationRequest.companyEmail)
  );
}

function getRegistrationLogoStatus(registrationRequest) {
  return registrationRequest &&
    registrationRequest.requestedLogo &&
    registrationRequest.requestedLogo.available
    ? "Adjunto"
    : "No incluido";
}

function wrapEmailHtml(title, bodyHtml) {
  return [
    '<div style="margin:0;padding:24px;background:#f5f7f8;font-family:Arial,sans-serif;color:#172026;line-height:1.5">',
    '<div style="max-width:640px;margin:0 auto">',
    '<div style="margin:0 0 14px;font-size:14px;font-weight:700;color:#115e59">Punto Club</div>',
    '<div style="border:1px solid #d9e1e5;border-radius:8px;background:#ffffff;padding:24px">',
    `<h1 style="font-size:22px;line-height:1.2;margin:0 0 12px;color:#172026">${escapeHtml(title)}</h1>`,
    bodyHtml,
    "</div>",
    '<p style="font-size:13px;color:#5f6d75;margin:16px 0 0">Punto Club ayuda a empresas a fidelizar clientes con puntos, membresias y beneficios.</p>',
    "</div>",
    "</div>",
  ].join("");
}

function renderEmailTable(rows) {
  return [
    '<table role="presentation" style="width:100%;border-collapse:collapse;margin:14px 0">',
    rows
      .map(([label, value]) =>
        [
          "<tr>",
          `<td style="width:38%;padding:9px 10px;border:1px solid #d9e1e5;background:#eef3f5;color:#5f6d75;font-size:12px;font-weight:700;text-transform:uppercase">${escapeHtml(label)}</td>`,
          `<td style="padding:9px 10px;border:1px solid #d9e1e5;color:#172026;font-weight:700">${escapeHtml(displayValue(value))}</td>`,
          "</tr>",
        ].join(""),
      )
      .join(""),
    "</table>",
  ].join("");
}

function renderEmailButton(href, label) {
  return `<p style="margin:18px 0"><a href="${escapeHtml(href)}" style="display:inline-block;border-radius:8px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 16px">${escapeHtml(label)}</a></p>`;
}

function createInternalInvitationSentHtml(invitation) {
  return wrapEmailHtml(
    "Invitacion enviada",
    [
      "<p>Se envio una invitacion de acceso en Punto Club.</p>",
      renderEmailTable([
        ["Empresa", invitation.companyName],
        ["Correo invitado", invitation.email],
        ["Rol", invitation.role],
        ["Estado", invitation.status],
        ["Fecha de envio", invitation.createdAt],
        ["Vence", invitation.expiresAt],
      ]),
      "<p><strong>Accion esperada:</strong> Dar seguimiento si la empresa no acepta la invitacion antes del vencimiento.</p>",
    ].join(""),
  );
}

function createInvitationLink(token, config) {
  const publicBaseUrl = normalizeText(config.publicBaseUrl);
  if (!publicBaseUrl) {
    return null;
  }

  const url = new URL(
    "/company-invitations/accept",
    publicBaseUrl.endsWith("/") ? publicBaseUrl : `${publicBaseUrl}/`,
  );
  url.searchParams.set("token", token);
  return url.toString();
}

function createInternalRegistrationEmail(registrationRequest, config) {
  const subject = `Punto Club - Nueva solicitud de empresa: ${registrationRequest.companyName}`;
  const logoStatus = getRegistrationLogoStatus(registrationRequest);
  const plainText = [
    "Punto Club",
    "",
    "Hay una nueva solicitud de empresa pendiente de revisión.",
    "",
    "Empresa:",
    `- Nombre: ${displayValue(registrationRequest.companyName)}`,
    `- Correo: ${displayValue(registrationRequest.companyEmail)}`,
    `- Teléfono: ${displayValue(registrationRequest.companyPhone)}`,
    `- Dirección: ${displayValue(registrationRequest.companyAddress)}`,
    "",
    "Contacto:",
    `- Nombre: ${displayValue(registrationRequest.contactName)}`,
    `- Correo: ${displayValue(registrationRequest.contactEmail)}`,
    `- Teléfono: ${displayValue(registrationRequest.contactPhone)}`,
    "",
    `Logo: ${logoStatus}`,
    "",
    "Acción esperada:",
    "Revisar la solicitud desde Admin empresas.",
  ].join("\n");

  const html = wrapEmailHtml(
    "Nueva solicitud de empresa",
    [
      "<p>Hay una nueva solicitud de empresa pendiente de revisión.</p>",
      "<h2>Empresa</h2>",
      "<ul>",
      `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.companyName))}</li>`,
      `<li>Correo: ${escapeHtml(displayValue(registrationRequest.companyEmail))}</li>`,
      `<li>Teléfono: ${escapeHtml(displayValue(registrationRequest.companyPhone))}</li>`,
      `<li>Dirección: ${escapeHtml(displayValue(registrationRequest.companyAddress))}</li>`,
      "</ul>",
      "<h2>Contacto</h2>",
      "<ul>",
      `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.contactName))}</li>`,
      `<li>Correo: ${escapeHtml(displayValue(registrationRequest.contactEmail))}</li>`,
      `<li>Teléfono: ${escapeHtml(displayValue(registrationRequest.contactPhone))}</li>`,
      "</ul>",
      `<p><strong>Logo:</strong> ${escapeHtml(logoStatus)}</p>`,
      "<p><strong>Acción esperada:</strong> Revisar la solicitud desde Admin empresas.</p>",
    ].join(""),
  );

  const formattedHtml = wrapEmailHtml(
    "Nueva solicitud de empresa",
    [
      "<p>Hay una nueva solicitud de empresa pendiente de revision.</p>",
      '<h2 style="font-size:16px;margin:18px 0 8px">Empresa</h2>',
      renderEmailTable([
        ["Nombre", registrationRequest.companyName],
        ["Correo", registrationRequest.companyEmail],
        ["Telefono", registrationRequest.companyPhone],
        ["Direccion", registrationRequest.companyAddress],
        ["Logo", logoStatus],
      ]),
      '<h2 style="font-size:16px;margin:18px 0 8px">Contacto</h2>',
      renderEmailTable([
        ["Nombre", registrationRequest.contactName],
        ["Correo", registrationRequest.contactEmail],
        ["Telefono", registrationRequest.contactPhone],
      ]),
      "<p><strong>Accion esperada:</strong> Revisar la solicitud desde Admin empresas.</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: config.internalNotificationEmail }],
    subject,
    plainText,
    html: formattedHtml,
  };
}

function createPasswordResetLink(token, config) {
  const publicBaseUrl = normalizeText(config.publicBaseUrl);
  if (!publicBaseUrl) {
    return null;
  }

  const url = new URL(
    "/company-password-reset",
    publicBaseUrl.endsWith("/") ? publicBaseUrl : `${publicBaseUrl}/`,
  );
  url.searchParams.set("token", token);
  return url.toString();
}

function createCompanyInvitationEmail(invitation, token, config) {
  const inviteLink = createInvitationLink(token, config);
  if (!inviteLink) {
    return null;
  }

  const subject = "Punto Club - Crea el acceso de tu empresa";
  const plainText = [
    "Punto Club",
    "",
    "Hola,",
    "",
    `La empresa ${displayValue(invitation.companyName)} fue aprobada para usar Punto Club.`,
    "",
    "Crea el acceso desde este enlace:",
    inviteLink,
    "",
    "Usa este correo como usuario de acceso:",
    displayValue(invitation.email),
    "",
    `Esta invitación vence el ${displayValue(invitation.expiresAt)}. Si no solicitaste este acceso o el enlace venció, contacta al equipo de Punto Club.`,
    "",
    "Gracias,",
    "Equipo Punto Club",
  ].join("\n");

  const html = wrapEmailHtml(
    "Activa el acceso de tu empresa",
    [
      `<p>La empresa <strong>${escapeHtml(displayValue(invitation.companyName))}</strong> fue aprobada para usar Punto Club.</p>`,
      `<p>Usa este correo como usuario de acceso: <strong>${escapeHtml(displayValue(invitation.email))}</strong></p>`,
      `<p><a href="${escapeHtml(inviteLink)}">Crear acceso</a></p>`,
      `<p>Esta invitación vence el ${escapeHtml(displayValue(invitation.expiresAt))}.</p>`,
      "<p>Si no solicitaste este acceso o el enlace venció, contacta al equipo de Punto Club.</p>",
      "<p>Gracias,<br />Equipo Punto Club</p>",
    ].join(""),
  );
  const formattedHtml = wrapEmailHtml(
    "Crea el acceso de tu empresa",
    [
      `<p>La empresa <strong>${escapeHtml(displayValue(invitation.companyName))}</strong> fue aprobada para usar Punto Club.</p>`,
      renderEmailTable([
        ["Empresa", invitation.companyName],
        ["Correo de acceso", invitation.email],
        ["Vence", invitation.expiresAt],
      ]),
      renderEmailButton(inviteLink, "Crear acceso"),
      "<p>Si no solicitaste este acceso o el enlace vencio, contacta al equipo de Punto Club.</p>",
      "<p>Gracias,<br />Equipo Punto Club</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: invitation.email }],
    subject,
    plainText,
    html: formattedHtml,
  };
}

function createInternalInvitationSentEmail(invitation, config) {
  const subject = `Punto Club - Invitacion enviada: ${invitation.companyName}`;
  const plainText = [
    "Se envió una invitación de acceso en Punto Club.",
    "",
    "Empresa:",
    `- Nombre: ${displayValue(invitation.companyName)}`,
    `- Correo invitado: ${displayValue(invitation.email)}`,
    `- Rol: ${displayValue(invitation.role)}`,
    "",
    "Invitación:",
    `- Estado: ${displayValue(invitation.status)}`,
    `- Fecha de envío: ${displayValue(invitation.createdAt)}`,
    `- Vence: ${displayValue(invitation.expiresAt)}`,
    "",
    "Acción esperada:",
    "Dar seguimiento si la empresa no acepta la invitación antes del vencimiento.",
  ].join("\n");

  const html = wrapEmailHtml(
    "Invitación enviada",
    [
      "<p>Se envió una invitación de acceso en Punto Club.</p>",
      "<h2>Empresa</h2>",
      "<ul>",
      `<li>Nombre: ${escapeHtml(displayValue(invitation.companyName))}</li>`,
      `<li>Correo invitado: ${escapeHtml(displayValue(invitation.email))}</li>`,
      `<li>Rol: ${escapeHtml(displayValue(invitation.role))}</li>`,
      "</ul>",
      "<h2>Invitación</h2>",
      "<ul>",
      `<li>Estado: ${escapeHtml(displayValue(invitation.status))}</li>`,
      `<li>Fecha de envío: ${escapeHtml(displayValue(invitation.createdAt))}</li>`,
      `<li>Vence: ${escapeHtml(displayValue(invitation.expiresAt))}</li>`,
      "</ul>",
      "<p><strong>Acción esperada:</strong> Dar seguimiento si la empresa no acepta la invitación antes del vencimiento.</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: config.internalNotificationEmail }],
    subject,
    plainText,
    html: createInternalInvitationSentHtml(invitation),
  };
}

function createCompanyPasswordResetEmail(reset, token, config) {
  const resetLink = createPasswordResetLink(token, config);
  if (!resetLink) {
    return null;
  }

  const subject = "Punto Club - Recupera el acceso de tu empresa";
  const plainText = [
    "Punto Club",
    "",
    "Hola,",
    "",
    `Se solicito recuperar el acceso de ${displayValue(reset.companyName)}.`,
    "",
    "Crea una nueva contrasena desde este enlace:",
    resetLink,
    "",
    `Este enlace vence el ${displayValue(reset.expiresAt)} y solo puede usarse una vez.`,
    "Si no solicitaste este correo, ignora el mensaje o contacta al equipo de Punto Club.",
    "",
    "Gracias,",
    "Equipo Punto Club",
  ].join("\n");
  const html = wrapEmailHtml(
    "Recupera el acceso de tu empresa",
    [
      `<p>Se solicito recuperar el acceso de <strong>${escapeHtml(displayValue(reset.companyName))}</strong>.</p>`,
      renderEmailTable([
        ["Empresa", reset.companyName],
        ["Correo de acceso", reset.email],
        ["Vence", reset.expiresAt],
      ]),
      renderEmailButton(resetLink, "Crear nueva contrasena"),
      "<p>Este enlace solo puede usarse una vez. Si no solicitaste este correo, ignora el mensaje o contacta al equipo de Punto Club.</p>",
      "<p>Gracias,<br />Equipo Punto Club</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: reset.email }],
    subject,
    plainText,
    html,
  };
}

function createInternalPasswordResetSentEmail(reset, config) {
  const subject = `Punto Club - Reset de password enviado: ${reset.companyName}`;
  const plainText = [
    "Se envio un correo de recuperacion de acceso en Punto Club.",
    "",
    `Empresa: ${displayValue(reset.companyName)}`,
    `Correo: ${displayValue(reset.email)}`,
    `Estado: ${displayValue(reset.status)}`,
    `Vence: ${displayValue(reset.expiresAt)}`,
    "",
    "No se muestra enlace ni token por seguridad.",
  ].join("\n");
  const html = wrapEmailHtml(
    "Reset de password enviado",
    [
      "<p>Se envio un correo de recuperacion de acceso en Punto Club.</p>",
      renderEmailTable([
        ["Empresa", reset.companyName],
        ["Correo", reset.email],
        ["Estado", reset.status],
        ["Vence", reset.expiresAt],
      ]),
      "<p>No se muestra enlace ni token por seguridad.</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: config.internalNotificationEmail }],
    subject,
    plainText,
    html,
  };
}

function createRequesterAcknowledgementEmail(registrationRequest, config) {
  const requesterEmail = getRequesterEmail(registrationRequest);
  if (!requesterEmail) {
    return null;
  }

  const subject = "Punto Club - Recibimos tu solicitud";
  const plainText = [
    "Punto Club",
    "",
    "Hola,",
    "",
    `Recibimos la solicitud para ${displayValue(registrationRequest.companyName)}.`,
    "",
    "Nuestro equipo revisará la información. Si la solicitud es aprobada, enviaremos una invitación para crear el acceso de la empresa.",
    "",
    `Correo de contacto: ${displayValue(registrationRequest.contactEmail)}`,
    "",
    "Gracias,",
    "Equipo Punto Club",
  ].join("\n");

  const html = wrapEmailHtml(
    "Solicitud recibida",
    [
      "<p>Hola,</p>",
      `<p>Recibimos la solicitud para <strong>${escapeHtml(displayValue(registrationRequest.companyName))}</strong>.</p>`,
      "<p>Nuestro equipo revisará la información. Si la solicitud es aprobada, enviaremos una invitación para crear el acceso de la empresa.</p>",
      `<p><strong>Correo de contacto:</strong> ${escapeHtml(displayValue(registrationRequest.contactEmail))}</p>`,
      "<p>Gracias,<br />Equipo Punto Club</p>",
    ].join(""),
  );

  const formattedHtml = wrapEmailHtml(
    "Solicitud recibida",
    [
      "<p>Hola,</p>",
      `<p>Recibimos la solicitud para <strong>${escapeHtml(displayValue(registrationRequest.companyName))}</strong>.</p>`,
      "<p>Nuestro equipo revisara la informacion. Si la solicitud es aprobada, enviaremos una invitacion para crear el acceso de la empresa.</p>",
      renderEmailTable([
        ["Empresa", registrationRequest.companyName],
        ["Correo de contacto", registrationRequest.contactEmail],
      ]),
      "<p>Gracias,<br />Equipo Punto Club</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: requesterEmail }],
    subject,
    plainText,
    html: formattedHtml,
  };
}

function createMembershipBenefitUsageCompanyEmail(details, config) {
  const usage = details.usage || {};
  const company = details.company || {};
  const customer = details.customer || {};
  const benefit = details.benefit || {};
  const toAddress = normalizeText(company.email);
  if (!toAddress) {
    return null;
  }

  const subject = "Punto Club - Beneficio utilizado";
  const benefitName = displayValue(usage.benefitName || benefit.name);
  const customerName = displayValue(customer.name || usage.customerName);
  const planName = displayValue(usage.planName || details.membership?.planName);
  const quantity = displayValue(usage.quantity);
  const usageDate = displayValue(usage.usageDate);
  const plainText = [
    "Punto Club",
    "",
    "Se registro el uso efectivo de un beneficio limitado.",
    "",
    `Empresa: ${displayValue(company.name)}`,
    `Cliente: ${customerName}`,
    `Beneficio: ${benefitName}`,
    `Plan: ${planName}`,
    `Fecha de uso: ${usageDate}`,
    `Cantidad usada: ${quantity}`,
    "",
    "Este correo es informativo. Revisa el panel de Punto Club si necesitas validar el historial.",
  ].join("\n");
  const html = wrapEmailHtml(
    "Beneficio utilizado",
    [
      "<p>Se registro el uso efectivo de un beneficio limitado.</p>",
      renderEmailTable([
        ["Empresa", company.name],
        ["Cliente", customerName],
        ["Beneficio", benefitName],
        ["Plan", planName],
        ["Fecha de uso", usageDate],
        ["Cantidad usada", quantity],
      ]),
      "<p>Este correo es informativo. Revisa el panel de Punto Club si necesitas validar el historial.</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: toAddress }],
    subject,
    plainText,
    html,
  };
}

function createMembershipBenefitUsageCustomerEmail(details, config) {
  const usage = details.usage || {};
  const company = details.company || {};
  const customer = details.customer || {};
  const benefit = details.benefit || {};
  const toAddress = normalizeText(customer.email);
  if (!toAddress) {
    return null;
  }

  const subject = "Punto Club - Beneficio utilizado";
  const benefitName = displayValue(usage.benefitName || benefit.name);
  const planName = displayValue(usage.planName || details.membership?.planName);
  const quantity = displayValue(usage.quantity);
  const usageDate = displayValue(usage.usageDate);
  const plainText = [
    "Punto Club",
    "",
    `Hola ${displayValue(customer.name)},`,
    "",
    `Se registro el uso efectivo del beneficio ${benefitName}.`,
    "",
    `Empresa: ${displayValue(company.name)}`,
    `Plan: ${planName}`,
    `Fecha de uso: ${usageDate}`,
    `Cantidad usada: ${quantity}`,
    "",
    "Si no reconoces este movimiento, contacta a la empresa donde tienes tu membresia.",
  ].join("\n");
  const html = wrapEmailHtml(
    "Beneficio utilizado",
    [
      `<p>Hola ${escapeHtml(displayValue(customer.name))},</p>`,
      `<p>Se registro el uso efectivo del beneficio <strong>${escapeHtml(benefitName)}</strong>.</p>`,
      renderEmailTable([
        ["Empresa", company.name],
        ["Plan", planName],
        ["Fecha de uso", usageDate],
        ["Cantidad usada", quantity],
      ]),
      "<p>Si no reconoces este movimiento, contacta a la empresa donde tienes tu membresia.</p>",
    ].join(""),
  );

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: toAddress }],
    subject,
    plainText,
    html,
  };
}

function loadAcsEmailClient() {
  try {
    const { EmailClient } = require("@azure/communication-email");
    return EmailClient;
  } catch {
    return null;
  }
}

async function sendEmailViaAcs(message, config, options = {}) {
  const EmailClient = options.EmailClient || loadAcsEmailClient();
  if (!EmailClient) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "sdk_unavailable",
    };
  }

  const client = options.client || new EmailClient(config.connectionString);
  const payload = {
    senderAddress: message.senderAddress,
    senderDisplayName: message.senderDisplayName,
    content: {
      subject: message.subject,
      plainText: message.plainText,
      html: message.html,
    },
    recipients: {
      to: message.to,
    },
  };

  if (message.replyTo && message.replyTo.length) {
    payload.replyTo = message.replyTo;
  }

  const poller = await client.beginSend(payload);
  const result = await poller.pollUntilDone();

  return {
    provider: "acs-email",
    status: "sent",
    id: result && result.id ? result.id : null,
  };
}

function safeWarn(context, message) {
  if (context && typeof context.warn === "function") {
    context.warn(message);
  }
}

async function notifyCompanyRegistrationSubmitted(
  registrationRequest,
  context,
  options = {},
) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "not_configured",
    };
  }

  const sendEmail =
    options.sendEmail ||
    ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    {
      type: "internal",
      message: createInternalRegistrationEmail(registrationRequest, config),
    },
    {
      type: "requester_ack",
      message: createRequesterAcknowledgementEmail(registrationRequest, config),
    },
  ].filter((item) => item.message);

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(
        context,
        `Company registration email was not sent: ${item.type}. ${error && error.message ? error.message : "Unknown email error."}`,
      );
      results.push({
        type: item.type,
        provider: "acs-email",
        status: "failed",
      });
    }
  }

  return {
    provider: "acs-email",
    status: results.some((result) => result.status === "sent")
      ? "sent"
      : "skipped",
    results,
  };
}

async function notifyCompanyInvitationCreated(
  invitation,
  token,
  context,
  options = {},
) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "not_configured",
    };
  }

  const inviteMessage = createCompanyInvitationEmail(invitation, token, config);
  if (!inviteMessage) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "public_base_url_not_configured",
    };
  }

  const sendEmail =
    options.sendEmail ||
    ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    { type: "invitee", message: inviteMessage },
    {
      type: "internal_invitation_sent",
      message: createInternalInvitationSentEmail(invitation, config),
    },
  ];

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(
        context,
        `Company invitation email was not sent: ${item.type}. ${error && error.message ? error.message : "Unknown email error."}`,
      );
      results.push({
        type: item.type,
        provider: "acs-email",
        status: "failed",
      });
    }
  }

  return {
    provider: "acs-email",
    status: results.some((result) => result.status === "sent")
      ? "sent"
      : "skipped",
    results,
  };
}

async function notifyCompanyPasswordResetCreated(
  reset,
  token,
  context,
  options = {},
) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "not_configured",
    };
  }

  const resetMessage = createCompanyPasswordResetEmail(reset, token, config);
  if (!resetMessage) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "public_base_url_not_configured",
    };
  }

  const sendEmail =
    options.sendEmail ||
    ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    { type: "password_reset", message: resetMessage },
    {
      type: "internal_password_reset_sent",
      message: createInternalPasswordResetSentEmail(reset, config),
    },
  ];

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(
        context,
        `Company password reset email was not sent: ${item.type}. ${error && error.message ? error.message : "Unknown email error."}`,
      );
      results.push({
        type: item.type,
        provider: "acs-email",
        status: "failed",
      });
    }
  }

  return {
    provider: "acs-email",
    status: results.some((result) => result.status === "sent")
      ? "sent"
      : "skipped",
    results,
  };
}

async function notifyMembershipBenefitUsed(details, context, options = {}) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "not_configured",
    };
  }

  const sendEmail =
    options.sendEmail ||
    ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    {
      type: "company",
      message: createMembershipBenefitUsageCompanyEmail(details, config),
    },
    {
      type: "customer",
      message: createMembershipBenefitUsageCustomerEmail(details, config),
    },
  ].filter((item) => item.message);

  if (!messages.length) {
    return {
      provider: "acs-email",
      status: "skipped",
      reason: "no_recipients",
    };
  }

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(
        context,
        `Membership benefit usage email was not sent: ${item.type}. ${error && error.message ? error.message : "Unknown email error."}`,
      );
      results.push({
        type: item.type,
        provider: "acs-email",
        status: "failed",
      });
    }
  }

  return {
    provider: "acs-email",
    status: results.some((result) => result.status === "sent")
      ? "sent"
      : "skipped",
    results,
  };
}

module.exports = {
  classifyEmailSendFailure,
  createCompanyInvitationEmail,
  createCompanyPasswordResetEmail,
  createInternalPasswordResetSentEmail,
  createInternalInvitationSentEmail,
  createInternalRegistrationEmail,
  createMembershipBenefitUsageCompanyEmail,
  createMembershipBenefitUsageCustomerEmail,
  createRequesterAcknowledgementEmail,
  defaultInternalNotificationEmail,
  escapeHtml,
  getEmailConfig,
  getPromotionalEmailConfig,
  isTransientEmailSendError,
  notifyCompanyInvitationCreated,
  notifyCompanyPasswordResetCreated,
  notifyCompanyRegistrationSubmitted,
  notifyMembershipBenefitUsed,
  sendEmailViaAcs,
};
