const notifier = require("./notifier");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function displayValue(value) {
  return normalizeText(value) || "No indicado";
}

function formatPoints(value) {
  const points = Number(value || 0);
  return new Intl.NumberFormat("es-CR", { maximumFractionDigits: 0 }).format(
    points,
  );
}

function formatAmount(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(amount);
}

function wrapOperationalEmailHtml(title, bodyHtml) {
  return [
    '<div style="margin:0;padding:24px;background:#f5f7f8;font-family:Arial,sans-serif;color:#172026;line-height:1.5">',
    '<div style="max-width:640px;margin:0 auto">',
    '<div style="margin:0 0 14px;font-size:14px;font-weight:700;color:#115e59">Punto Club</div>',
    '<div style="border:1px solid #d9e1e5;border-radius:8px;background:#ffffff;padding:24px">',
    `<h1 style="font-size:22px;line-height:1.2;margin:0 0 12px;color:#172026">${notifier.escapeHtml(title)}</h1>`,
    bodyHtml,
    "</div>",
    '<p style="font-size:13px;color:#5f6d75;margin:16px 0 0">Correo operativo enviado por la empresa desde Punto Club.</p>',
    "</div>",
    "</div>",
  ].join("");
}

function renderTable(rows) {
  return [
    '<table role="presentation" style="width:100%;border-collapse:collapse;margin:14px 0">',
    rows
      .map(([label, value]) =>
        [
          "<tr>",
          `<td style="width:38%;padding:9px 10px;border:1px solid #d9e1e5;background:#eef3f5;color:#5f6d75;font-size:12px;font-weight:700;text-transform:uppercase">${notifier.escapeHtml(label)}</td>`,
          `<td style="padding:9px 10px;border:1px solid #d9e1e5;color:#172026;font-weight:700">${notifier.escapeHtml(displayValue(value))}</td>`,
          "</tr>",
        ].join(""),
      )
      .join(""),
    "</table>",
  ].join("");
}

function buildBaseMessage({
  config,
  settings,
  customer,
  subject,
  plainText,
  html,
}) {
  const replyToEmail = normalizeText(settings.replyToEmail);
  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: customer.email }],
    replyTo: replyToEmail ? [{ address: replyToEmail }] : undefined,
    subject,
    plainText,
    html,
  };
}

function createWelcomeEmail(details, config, settings) {
  const { company, customer } = details;
  const subject = `Bienvenido a ${displayValue(company.name)}`;
  const plainText = [
    "Punto Club",
    "",
    `Hola ${displayValue(customer.name)},`,
    "",
    `Ya formas parte del programa de puntos de ${displayValue(company.name)}.`,
    "Cada compra registrada puede sumar puntos para futuros beneficios.",
    "",
    "Gracias por ser parte de Punto Club.",
  ].join("\n");
  const html = wrapOperationalEmailHtml(
    "Bienvenido a Punto Club",
    [
      `<p>Hola ${notifier.escapeHtml(displayValue(customer.name))},</p>`,
      `<p>Ya formas parte del programa de puntos de <strong>${notifier.escapeHtml(displayValue(company.name))}</strong>.</p>`,
      "<p>Cada compra registrada puede sumar puntos para futuros beneficios.</p>",
    ].join(""),
  );

  return buildBaseMessage({
    config,
    settings,
    customer,
    subject,
    plainText,
    html,
  });
}

function createPurchaseEmail(details, config, settings) {
  const { company, customer, purchase, balance } = details;
  const subject = `Puntos ganados en ${displayValue(company.name)}`;
  const plainText = [
    "Punto Club",
    "",
    `Hola ${displayValue(customer.name)},`,
    "",
    `Registramos tu compra en ${displayValue(company.name)}.`,
    `Monto: ${formatAmount(purchase.amount)}`,
    `Puntos ganados: ${formatPoints(purchase.pointsEarned)}`,
    `Saldo total: ${formatPoints(balance.pointsBalance)} puntos`,
    "",
    "Gracias por seguir acumulando puntos.",
  ].join("\n");
  const html = wrapOperationalEmailHtml(
    "Puntos ganados",
    [
      `<p>Hola ${notifier.escapeHtml(displayValue(customer.name))},</p>`,
      `<p>Registramos tu compra en <strong>${notifier.escapeHtml(displayValue(company.name))}</strong>.</p>`,
      renderTable([
        ["Monto", formatAmount(purchase.amount)],
        ["Puntos ganados", formatPoints(purchase.pointsEarned)],
        ["Saldo total", `${formatPoints(balance.pointsBalance)} puntos`],
      ]),
      "<p>Gracias por seguir acumulando puntos.</p>",
    ].join(""),
  );

  return buildBaseMessage({
    config,
    settings,
    customer,
    subject,
    plainText,
    html,
  });
}

function createRedemptionEmail(details, config, settings) {
  const { company, customer, redemption } = details;
  const subject = `Canje registrado en ${displayValue(company.name)}`;
  const plainText = [
    "Punto Club",
    "",
    `Hola ${displayValue(customer.name)},`,
    "",
    `Registramos un canje en ${displayValue(company.name)}.`,
    `Puntos redimidos: ${formatPoints(redemption.pointsRedeemed)}`,
    `Saldo total: ${formatPoints(redemption.balanceAfter)} puntos`,
    "",
    "Si no reconoces este movimiento, contacta a la empresa.",
  ].join("\n");
  const html = wrapOperationalEmailHtml(
    "Canje registrado",
    [
      `<p>Hola ${notifier.escapeHtml(displayValue(customer.name))},</p>`,
      `<p>Registramos un canje en <strong>${notifier.escapeHtml(displayValue(company.name))}</strong>.</p>`,
      renderTable([
        ["Puntos redimidos", formatPoints(redemption.pointsRedeemed)],
        ["Saldo total", `${formatPoints(redemption.balanceAfter)} puntos`],
      ]),
      "<p>Si no reconoces este movimiento, contacta a la empresa.</p>",
    ].join(""),
  );

  return buildBaseMessage({
    config,
    settings,
    customer,
    subject,
    plainText,
    html,
  });
}

function isEventEnabled(eventType, settings) {
  if (eventType === "welcome") {
    return settings.welcomeEnabled;
  }
  if (eventType === "purchase") {
    return settings.purchaseEnabled;
  }
  if (eventType === "redemption") {
    return settings.redemptionEnabled;
  }
  return false;
}

function createMessage(eventType, details, config, settings) {
  if (eventType === "welcome") {
    return createWelcomeEmail(details, config, settings);
  }
  if (eventType === "purchase") {
    return createPurchaseEmail(details, config, settings);
  }
  if (eventType === "redemption") {
    return createRedemptionEmail(details, config, settings);
  }
  return null;
}

function warn(context, message) {
  if (context && typeof context.warn === "function") {
    context.warn(message);
  }
}

async function sendOperationalEmailBestEffort(
  repository,
  eventSpec,
  details,
  context,
  options = {},
) {
  try {
    const { event, created } =
      await repository.createOperationalEmailEventIfNeeded(eventSpec);
    if (!created) {
      return { status: "skipped", reason: "duplicate_event", event };
    }

    const settings = await repository.getOperationalEmailSettings(
      eventSpec.companyId,
    );
    const config =
      options.config || notifier.getEmailConfig(options.env || process.env);
    const customer = details.customer || {};

    if (!isEventEnabled(eventSpec.eventType, settings)) {
      const message = await repository.createOperationalEmailMessage({
        eventId: event.id,
        companyId: eventSpec.companyId,
        customerId: eventSpec.customerId,
        recipientEmail: customer.email || null,
        subject: null,
        status: "skipped",
        provider: "acs-email",
        lastError: "disabled_by_company_settings",
      });
      await repository.recordOperationalEmailAttempt(
        message.id,
        event.id,
        eventSpec.companyId,
        {
          provider: "acs-email",
          status: "skipped",
          reason: "disabled_by_company_settings",
        },
      );
      return {
        status: "skipped",
        reason: "disabled_by_company_settings",
        event,
      };
    }

    if (!normalizeText(customer.email)) {
      const message = await repository.createOperationalEmailMessage({
        eventId: event.id,
        companyId: eventSpec.companyId,
        customerId: eventSpec.customerId,
        recipientEmail: null,
        subject: null,
        status: "skipped",
        provider: "acs-email",
        lastError: "customer_without_email",
      });
      await repository.recordOperationalEmailAttempt(
        message.id,
        event.id,
        eventSpec.companyId,
        {
          provider: "acs-email",
          status: "skipped",
          reason: "customer_without_email",
        },
      );
      return { status: "skipped", reason: "customer_without_email", event };
    }

    const emailMessage = createMessage(
      eventSpec.eventType,
      details,
      config,
      settings,
    );
    const message = await repository.createOperationalEmailMessage({
      eventId: event.id,
      companyId: eventSpec.companyId,
      customerId: eventSpec.customerId,
      recipientEmail: customer.email,
      subject: emailMessage.subject,
      status: "pending",
      provider: "acs-email",
      lastError: null,
    });

    if (!config.enabled) {
      await repository.recordOperationalEmailAttempt(
        message.id,
        event.id,
        eventSpec.companyId,
        {
          provider: "acs-email",
          status: "skipped",
          reason: "not_configured",
        },
      );
      return { status: "skipped", reason: "not_configured", event };
    }

    try {
      const sendEmail =
        options.sendEmail ||
        ((payload) => notifier.sendEmailViaAcs(payload, config, options));
      const result = await sendEmail(emailMessage);
      await repository.recordOperationalEmailAttempt(
        message.id,
        event.id,
        eventSpec.companyId,
        result,
      );
      return {
        status: result.status,
        provider: result.provider,
        id: result.id || null,
        event,
      };
    } catch (error) {
      const errorCode = notifier.classifyEmailSendFailure(error);
      warn(
        context,
        `Operational email was not sent: ${eventSpec.eventType}. ${errorCode}`,
      );
      await repository.recordOperationalEmailAttempt(
        message.id,
        event.id,
        eventSpec.companyId,
        {
          provider: "acs-email",
          status: "failed",
          reason: errorCode,
          errorMessage: errorCode,
        },
      );
      return {
        status: "failed",
        provider: "acs-email",
        reason: errorCode,
        event,
      };
    }
  } catch (error) {
    warn(
      context,
      `Operational email logging failed: ${eventSpec.eventType}. ${error && error.message ? error.message : "Unknown email error."}`,
    );
    return { status: "failed", reason: "logging_failed" };
  }
}

module.exports = {
  createPurchaseEmail,
  createRedemptionEmail,
  createWelcomeEmail,
  sendOperationalEmailBestEffort,
};
