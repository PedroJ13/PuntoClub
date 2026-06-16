const defaultInternalNotificationEmail = 'pj13eros_business@outlook.com';

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getEmailConfig(env = process.env) {
  const connectionString = normalizeText(env.ACS_EMAIL_CONNECTION_STRING);
  const senderAddress = normalizeText(env.ACS_EMAIL_SENDER_ADDRESS);
  const senderDisplayName = normalizeText(env.ACS_EMAIL_SENDER_DISPLAY_NAME) || 'Punto Club';
  const internalNotificationEmail = normalizeText(env.INTERNAL_NOTIFICATION_EMAIL) || defaultInternalNotificationEmail;
  const publicBaseUrl = normalizeText(env.APP_PUBLIC_BASE_URL);

  return {
    connectionString,
    senderAddress,
    senderDisplayName,
    internalNotificationEmail,
    publicBaseUrl,
    enabled: Boolean(connectionString && senderAddress && internalNotificationEmail)
  };
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function displayValue(value) {
  const text = normalizeText(value);
  return text || 'No indicado';
}

function getRequesterEmail(registrationRequest) {
  return normalizeText(registrationRequest.contactEmail) || normalizeText(registrationRequest.companyEmail);
}

function getRegistrationLogoStatus(registrationRequest) {
  return registrationRequest && registrationRequest.requestedLogo && registrationRequest.requestedLogo.available
    ? 'Adjunto'
    : 'No incluido';
}

function wrapEmailHtml(title, bodyHtml) {
  return [
    '<div style="font-family:Arial,sans-serif;color:#17202a;line-height:1.45;max-width:640px">',
    `<h1 style="font-size:22px;margin:0 0 16px">${escapeHtml(title)}</h1>`,
    bodyHtml,
    '<p style="font-size:13px;color:#5f6b7a;margin-top:24px">Punto Club</p>',
    '</div>'
  ].join('');
}

function createInvitationLink(token, config) {
  const publicBaseUrl = normalizeText(config.publicBaseUrl);
  if (!publicBaseUrl) {
    return null;
  }

  const url = new URL('/company-invitations/accept', publicBaseUrl.endsWith('/') ? publicBaseUrl : `${publicBaseUrl}/`);
  url.searchParams.set('token', token);
  return url.toString();
}

function createInternalRegistrationEmail(registrationRequest, config) {
  const subject = `Nueva solicitud de empresa: ${registrationRequest.companyName}`;
  const logoStatus = getRegistrationLogoStatus(registrationRequest);
  const plainText = [
    'Hay una nueva solicitud de empresa pendiente de revisión.',
    '',
    'Empresa:',
    `- Nombre: ${displayValue(registrationRequest.companyName)}`,
    `- Correo: ${displayValue(registrationRequest.companyEmail)}`,
    `- Teléfono: ${displayValue(registrationRequest.companyPhone)}`,
    `- Dirección: ${displayValue(registrationRequest.companyAddress)}`,
    '',
    'Contacto:',
    `- Nombre: ${displayValue(registrationRequest.contactName)}`,
    `- Correo: ${displayValue(registrationRequest.contactEmail)}`,
    `- Teléfono: ${displayValue(registrationRequest.contactPhone)}`,
    '',
    `Logo: ${logoStatus}`,
    '',
    'Acción esperada:',
    'Revisar la solicitud desde Admin empresas.'
  ].join('\n');

  const html = wrapEmailHtml('Nueva solicitud de empresa', [
    '<p>Hay una nueva solicitud de empresa pendiente de revisión.</p>',
    '<h2>Empresa</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.companyName))}</li>`,
    `<li>Correo: ${escapeHtml(displayValue(registrationRequest.companyEmail))}</li>`,
    `<li>Teléfono: ${escapeHtml(displayValue(registrationRequest.companyPhone))}</li>`,
    `<li>Dirección: ${escapeHtml(displayValue(registrationRequest.companyAddress))}</li>`,
    '</ul>',
    '<h2>Contacto</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.contactName))}</li>`,
    `<li>Correo: ${escapeHtml(displayValue(registrationRequest.contactEmail))}</li>`,
    `<li>Teléfono: ${escapeHtml(displayValue(registrationRequest.contactPhone))}</li>`,
    '</ul>',
    `<p><strong>Logo:</strong> ${escapeHtml(logoStatus)}</p>`,
    '<p><strong>Acción esperada:</strong> Revisar la solicitud desde Admin empresas.</p>'
  ].join(''));

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: config.internalNotificationEmail }],
    subject,
    plainText,
    html
  };
}

function createCompanyInvitationEmail(invitation, token, config) {
  const inviteLink = createInvitationLink(token, config);
  if (!inviteLink) {
    return null;
  }

  const subject = 'Activa el acceso de tu empresa en Punto Club';
  const plainText = [
    'Hola,',
    '',
    `La empresa ${displayValue(invitation.companyName)} fue aprobada para usar Punto Club.`,
    '',
    'Crea el acceso desde este enlace:',
    inviteLink,
    '',
    'Usa este correo como usuario de acceso:',
    displayValue(invitation.email),
    '',
    `Esta invitación vence el ${displayValue(invitation.expiresAt)}. Si no solicitaste este acceso o el enlace venció, contacta al equipo de Punto Club.`,
    '',
    'Gracias,',
    'Equipo Punto Club'
  ].join('\n');

  const html = wrapEmailHtml('Activa el acceso de tu empresa', [
    `<p>La empresa <strong>${escapeHtml(displayValue(invitation.companyName))}</strong> fue aprobada para usar Punto Club.</p>`,
    `<p>Usa este correo como usuario de acceso: <strong>${escapeHtml(displayValue(invitation.email))}</strong></p>`,
    `<p><a href="${escapeHtml(inviteLink)}">Crear acceso</a></p>`,
    `<p>Esta invitación vence el ${escapeHtml(displayValue(invitation.expiresAt))}.</p>`,
    '<p>Si no solicitaste este acceso o el enlace venció, contacta al equipo de Punto Club.</p>',
    '<p>Gracias,<br />Equipo Punto Club</p>'
  ].join(''));

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: invitation.email }],
    subject,
    plainText,
    html
  };
}

function createInternalInvitationSentEmail(invitation, config) {
  const subject = `Invitación enviada en Punto Club: ${invitation.companyName}`;
  const plainText = [
    'Se envió una invitación de acceso en Punto Club.',
    '',
    'Empresa:',
    `- Nombre: ${displayValue(invitation.companyName)}`,
    `- Correo invitado: ${displayValue(invitation.email)}`,
    `- Rol: ${displayValue(invitation.role)}`,
    '',
    'Invitación:',
    `- Estado: ${displayValue(invitation.status)}`,
    `- Fecha de envío: ${displayValue(invitation.createdAt)}`,
    `- Vence: ${displayValue(invitation.expiresAt)}`,
    '',
    'Acción esperada:',
    'Dar seguimiento si la empresa no acepta la invitación antes del vencimiento.'
  ].join('\n');

  const html = wrapEmailHtml('Invitación enviada', [
    '<p>Se envió una invitación de acceso en Punto Club.</p>',
    '<h2>Empresa</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(invitation.companyName))}</li>`,
    `<li>Correo invitado: ${escapeHtml(displayValue(invitation.email))}</li>`,
    `<li>Rol: ${escapeHtml(displayValue(invitation.role))}</li>`,
    '</ul>',
    '<h2>Invitación</h2>',
    '<ul>',
    `<li>Estado: ${escapeHtml(displayValue(invitation.status))}</li>`,
    `<li>Fecha de envío: ${escapeHtml(displayValue(invitation.createdAt))}</li>`,
    `<li>Vence: ${escapeHtml(displayValue(invitation.expiresAt))}</li>`,
    '</ul>',
    '<p><strong>Acción esperada:</strong> Dar seguimiento si la empresa no acepta la invitación antes del vencimiento.</p>'
  ].join(''));

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: config.internalNotificationEmail }],
    subject,
    plainText,
    html
  };
}

function createRequesterAcknowledgementEmail(registrationRequest, config) {
  const requesterEmail = getRequesterEmail(registrationRequest);
  if (!requesterEmail) {
    return null;
  }

  const subject = 'Recibimos tu solicitud en Punto Club';
  const plainText = [
    'Hola,',
    '',
    `Recibimos la solicitud para ${displayValue(registrationRequest.companyName)}.`,
    '',
    'Nuestro equipo revisará la información. Si la solicitud es aprobada, enviaremos una invitación para crear el acceso de la empresa.',
    '',
    `Correo de contacto: ${displayValue(registrationRequest.contactEmail)}`,
    '',
    'Gracias,',
    'Equipo Punto Club'
  ].join('\n');

  const html = wrapEmailHtml('Solicitud recibida', [
    '<p>Hola,</p>',
    `<p>Recibimos la solicitud para <strong>${escapeHtml(displayValue(registrationRequest.companyName))}</strong>.</p>`,
    '<p>Nuestro equipo revisará la información. Si la solicitud es aprobada, enviaremos una invitación para crear el acceso de la empresa.</p>',
    `<p><strong>Correo de contacto:</strong> ${escapeHtml(displayValue(registrationRequest.contactEmail))}</p>`,
    '<p>Gracias,<br />Equipo Punto Club</p>'
  ].join(''));

  return {
    senderAddress: config.senderAddress,
    senderDisplayName: config.senderDisplayName,
    to: [{ address: requesterEmail }],
    subject,
    plainText,
    html
  };
}

function loadAcsEmailClient() {
  try {
    const { EmailClient } = require('@azure/communication-email');
    return EmailClient;
  } catch {
    return null;
  }
}

async function sendEmailViaAcs(message, config, options = {}) {
  const EmailClient = options.EmailClient || loadAcsEmailClient();
  if (!EmailClient) {
    return { provider: 'acs-email', status: 'skipped', reason: 'sdk_unavailable' };
  }

  const client = options.client || new EmailClient(config.connectionString);
  const poller = await client.beginSend({
    senderAddress: message.senderAddress,
    senderDisplayName: message.senderDisplayName,
    content: {
      subject: message.subject,
      plainText: message.plainText,
      html: message.html
    },
    recipients: {
      to: message.to
    }
  });
  const result = await poller.pollUntilDone();

  return {
    provider: 'acs-email',
    status: 'sent',
    id: result && result.id ? result.id : null
  };
}

function safeWarn(context, message) {
  if (context && typeof context.warn === 'function') {
    context.warn(message);
  }
}

async function notifyCompanyRegistrationSubmitted(registrationRequest, context, options = {}) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return { provider: 'acs-email', status: 'skipped', reason: 'not_configured' };
  }

  const sendEmail = options.sendEmail || ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    { type: 'internal', message: createInternalRegistrationEmail(registrationRequest, config) },
    { type: 'requester_ack', message: createRequesterAcknowledgementEmail(registrationRequest, config) }
  ].filter((item) => item.message);

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(context, `Company registration email was not sent: ${item.type}. ${error && error.message ? error.message : 'Unknown email error.'}`);
      results.push({ type: item.type, provider: 'acs-email', status: 'failed' });
    }
  }

  return {
    provider: 'acs-email',
    status: results.some((result) => result.status === 'sent') ? 'sent' : 'skipped',
    results
  };
}

async function notifyCompanyInvitationCreated(invitation, token, context, options = {}) {
  const config = options.config || getEmailConfig(options.env || process.env);
  if (!config.enabled) {
    return { provider: 'acs-email', status: 'skipped', reason: 'not_configured' };
  }

  const inviteMessage = createCompanyInvitationEmail(invitation, token, config);
  if (!inviteMessage) {
    return { provider: 'acs-email', status: 'skipped', reason: 'public_base_url_not_configured' };
  }

  const sendEmail = options.sendEmail || ((message) => sendEmailViaAcs(message, config, options));
  const messages = [
    { type: 'invitee', message: inviteMessage },
    { type: 'internal_invitation_sent', message: createInternalInvitationSentEmail(invitation, config) }
  ];

  const results = [];
  for (const item of messages) {
    try {
      const result = await sendEmail(item.message);
      results.push({ type: item.type, ...result });
    } catch (error) {
      safeWarn(context, `Company invitation email was not sent: ${item.type}. ${error && error.message ? error.message : 'Unknown email error.'}`);
      results.push({ type: item.type, provider: 'acs-email', status: 'failed' });
    }
  }

  return {
    provider: 'acs-email',
    status: results.some((result) => result.status === 'sent') ? 'sent' : 'skipped',
    results
  };
}

module.exports = {
  createCompanyInvitationEmail,
  createInternalInvitationSentEmail,
  createInternalRegistrationEmail,
  createRequesterAcknowledgementEmail,
  defaultInternalNotificationEmail,
  escapeHtml,
  getEmailConfig,
  notifyCompanyInvitationCreated,
  notifyCompanyRegistrationSubmitted,
  sendEmailViaAcs
};
