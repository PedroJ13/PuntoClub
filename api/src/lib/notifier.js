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
  const subject = `Nueva solicitud de empresa en Punto Club: ${registrationRequest.companyName}`;
  const plainText = [
    'Se recibio una nueva solicitud de empresa en Punto Club.',
    '',
    'Empresa:',
    `- Nombre: ${displayValue(registrationRequest.companyName)}`,
    `- Correo de empresa: ${displayValue(registrationRequest.companyEmail)}`,
    `- Telefono de empresa: ${displayValue(registrationRequest.companyPhone)}`,
    `- Direccion: ${displayValue(registrationRequest.companyAddress)}`,
    '',
    'Contacto:',
    `- Nombre: ${displayValue(registrationRequest.contactName)}`,
    `- Correo: ${displayValue(registrationRequest.contactEmail)}`,
    `- Telefono: ${displayValue(registrationRequest.contactPhone)}`,
    '',
    'Estado:',
    `- Solicitud: ${displayValue(registrationRequest.status)}`,
    `- Fecha de solicitud: ${displayValue(registrationRequest.createdAt)}`,
    '',
    'Accion esperada:',
    'Revise la solicitud. Si corresponde, apruebe la empresa y envie la invitacion de acceso.'
  ].join('\n');

  const html = [
    '<p>Se recibio una nueva solicitud de empresa en Punto Club.</p>',
    '<h2>Empresa</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.companyName))}</li>`,
    `<li>Correo de empresa: ${escapeHtml(displayValue(registrationRequest.companyEmail))}</li>`,
    `<li>Telefono de empresa: ${escapeHtml(displayValue(registrationRequest.companyPhone))}</li>`,
    `<li>Direccion: ${escapeHtml(displayValue(registrationRequest.companyAddress))}</li>`,
    '</ul>',
    '<h2>Contacto</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(registrationRequest.contactName))}</li>`,
    `<li>Correo: ${escapeHtml(displayValue(registrationRequest.contactEmail))}</li>`,
    `<li>Telefono: ${escapeHtml(displayValue(registrationRequest.contactPhone))}</li>`,
    '</ul>',
    '<h2>Estado</h2>',
    '<ul>',
    `<li>Solicitud: ${escapeHtml(displayValue(registrationRequest.status))}</li>`,
    `<li>Fecha de solicitud: ${escapeHtml(displayValue(registrationRequest.createdAt))}</li>`,
    '</ul>',
    '<p><strong>Accion esperada:</strong> Revise la solicitud. Si corresponde, apruebe la empresa y envie la invitacion de acceso.</p>'
  ].join('');

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

  const subject = 'Invitacion para activar Punto Club';
  const plainText = [
    'Hola,',
    '',
    `Su empresa ${displayValue(invitation.companyName)} fue invitada a usar Punto Club.`,
    '',
    'Para crear el acceso, abra el siguiente enlace:',
    inviteLink,
    '',
    'Este correo sera su usuario de acceso:',
    displayValue(invitation.email),
    '',
    `La invitacion vence el ${displayValue(invitation.expiresAt)}. Si vence o usted no solicito este acceso, contacte al equipo de Punto Club.`,
    '',
    'Gracias,',
    'Equipo Punto Club'
  ].join('\n');

  const html = [
    '<h1>Active el acceso de su empresa</h1>',
    `<p>Su empresa <strong>${escapeHtml(displayValue(invitation.companyName))}</strong> fue invitada a usar Punto Club.</p>`,
    `<p>Use este correo como usuario de acceso: <strong>${escapeHtml(displayValue(invitation.email))}</strong></p>`,
    `<p><a href="${escapeHtml(inviteLink)}">Crear acceso</a></p>`,
    `<p>La invitacion vence el ${escapeHtml(displayValue(invitation.expiresAt))}.</p>`,
    '<p>Si vence o usted no solicito este acceso, contacte al equipo de Punto Club.</p>',
    '<p>Gracias,<br />Equipo Punto Club</p>'
  ].join('');

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
  const subject = `Invitacion enviada en Punto Club: ${invitation.companyName}`;
  const plainText = [
    'Se envio una invitacion de acceso en Punto Club.',
    '',
    'Empresa:',
    `- Nombre: ${displayValue(invitation.companyName)}`,
    `- Correo invitado: ${displayValue(invitation.email)}`,
    `- Rol: ${displayValue(invitation.role)}`,
    '',
    'Invitacion:',
    `- Estado: ${displayValue(invitation.status)}`,
    `- Fecha de envio: ${displayValue(invitation.createdAt)}`,
    `- Vence: ${displayValue(invitation.expiresAt)}`,
    '',
    'Accion esperada:',
    'Dar seguimiento si la empresa no acepta la invitacion antes del vencimiento.'
  ].join('\n');

  const html = [
    '<p>Se envio una invitacion de acceso en Punto Club.</p>',
    '<h2>Empresa</h2>',
    '<ul>',
    `<li>Nombre: ${escapeHtml(displayValue(invitation.companyName))}</li>`,
    `<li>Correo invitado: ${escapeHtml(displayValue(invitation.email))}</li>`,
    `<li>Rol: ${escapeHtml(displayValue(invitation.role))}</li>`,
    '</ul>',
    '<h2>Invitacion</h2>',
    '<ul>',
    `<li>Estado: ${escapeHtml(displayValue(invitation.status))}</li>`,
    `<li>Fecha de envio: ${escapeHtml(displayValue(invitation.createdAt))}</li>`,
    `<li>Vence: ${escapeHtml(displayValue(invitation.expiresAt))}</li>`,
    '</ul>',
    '<p><strong>Accion esperada:</strong> Dar seguimiento si la empresa no acepta la invitacion antes del vencimiento.</p>'
  ].join('');

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

  const contactName = normalizeText(registrationRequest.contactName) || normalizeText(registrationRequest.companyName);
  const subject = 'Recibimos su solicitud para Punto Club';
  const plainText = [
    `Hola ${displayValue(contactName)},`,
    '',
    `Recibimos la solicitud de ${displayValue(registrationRequest.companyName)} para usar Punto Club.`,
    '',
    'Revisaremos los datos y, si corresponde, enviaremos una invitacion al correo de empresa:',
    displayValue(registrationRequest.companyEmail),
    '',
    'Este mensaje confirma la recepcion de la solicitud. Todavia no crea acceso operativo.',
    '',
    'Gracias,',
    'Equipo Punto Club'
  ].join('\n');

  const html = [
    `<p>Hola ${escapeHtml(displayValue(contactName))},</p>`,
    `<p>Recibimos la solicitud de <strong>${escapeHtml(displayValue(registrationRequest.companyName))}</strong> para usar Punto Club.</p>`,
    '<p>Revisaremos los datos y, si corresponde, enviaremos una invitacion al correo de empresa:</p>',
    `<p><strong>${escapeHtml(displayValue(registrationRequest.companyEmail))}</strong></p>`,
    '<p>Este mensaje confirma la recepcion de la solicitud. Todavia no crea acceso operativo.</p>',
    '<p>Gracias,<br />Equipo Punto Club</p>'
  ].join('');

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
