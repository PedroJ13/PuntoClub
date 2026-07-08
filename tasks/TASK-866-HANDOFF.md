# TASK-866 - Handoff

Nombre del Equipo: Backend/API
Modo: Comunicaciones / Diagnostico envio fallido
Fecha: 2026-07-08

## Estado

Completada localmente.

## Alcance implementado

Se agrego normalizacion segura para fallos de envio ACS, evitando que los casos accionables queden como `send_failed` generico.

No se cambiaron sender, app settings, SQL, DNS, ACS ni se enviaron correos reales.

## Cambios realizados

- `api/src/lib/notifier.js`
  - Agregado `classifyEmailSendFailure(error, options)`.
  - Agregado `isTransientEmailSendError(error)`.
  - Clasifica fallos ACS en codigos seguros:
    - `acs_sender_domain_not_linked`
    - `acs_sender_domain_not_verified`
    - `acs_sender_not_authorized`
    - `acs_recipient_rejected`
    - `acs_email_throttled`
    - `acs_email_throttled_retry_exhausted`
    - `acs_email_config_error`
    - `acs_email_transient`
    - `acs_email_transient_retry_exhausted`
    - `send_failed`

- `api/src/lib/operationalEmails.js`
  - Cuando ACS lanza error, registra `reason` y `errorMessage` con codigo seguro.
  - El warning ya no guarda el mensaje crudo del proveedor; usa el codigo normalizado.
  - El resultado best-effort devuelve `reason` seguro.

- `api/src/functions/promotionalCampaigns.js`
  - `sanitizePromotionalSendError` usa el clasificador compartido.
  - Mantiene retry para throttling/transitorios.
  - Un error como `The specified sender domain has not been linked.` queda como `acs_sender_domain_not_linked`.

## Tests agregados / ajustados

- `api/test/company-registration.test.js`
  - Valida mapeo seguro para:
    - dominio sender no enlazado;
    - throttling con retry agotado;
    - recipient rejected;
    - error de config/credencial.

- `api/test/operational-emails.test.js`
  - Valida que el flujo operativo registre `acs_sender_domain_not_linked` y no el mensaje crudo.

- `api/test/promotional-campaigns.test.js`
  - Valida que promocionales registren `acs_sender_domain_not_linked`.

## Verificacion

Sintaxis:

```txt
node --check api/src/lib/notifier.js
node --check api/src/lib/operationalEmails.js
node --check api/src/functions/promotionalCampaigns.js
```

Resultado: OK.

Formato:

```txt
npx prettier --check api/src/lib/notifier.js api/src/lib/operationalEmails.js api/src/functions/promotionalCampaigns.js api/test/company-registration.test.js api/test/operational-emails.test.js api/test/promotional-campaigns.test.js
```

Resultado:

```txt
All matched files use Prettier code style!
```

Tests:

```txt
npm --prefix api test
```

Resultado:

```txt
tests 189
pass 189
fail 0
```

## Restricciones respetadas

- No se cambiaron app settings.
- No se cambio SQL.
- No se cambio DNS.
- No se cambio ACS.
- No se cambio sender.
- No se enviaron correos reales.
- No se tocaron secretos.

## Uso Azure SQL

No se uso Azure SQL.

## Pendiente

Publicar este cambio Backend/API para que futuros fallos publicados muestren motivos seguros accionables.

Para el caso TASK-864/TASK-865, el codigo esperado despues de publicar seria:

```txt
acs_sender_domain_not_linked
```
