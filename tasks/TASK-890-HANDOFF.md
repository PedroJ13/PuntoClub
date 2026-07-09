# TASK-890 - Handoff

Nombre del Equipo: Backend/API
Modo: Staging / Email safety
Fecha: 2026-07-09

## Estado

Completada.

Se implemento bloqueo global de correos con:

```txt
EMAIL_SEND_MODE=disabled
```

Cuando esta activo, bloquea envios operativos, invitaciones, resets, beneficios y promociones aunque ACS quede configurado por error.

## Cambios realizados

Archivos:

```txt
api/src/lib/notifier.js
api/src/functions/promotionalCampaigns.js
api/src/functions/communicationsSummary.js
api/test/company-registration.test.js
api/test/communications-summary.test.js
```

Comportamiento:

- `getEmailConfig` y `getPromotionalEmailConfig` quedan `enabled=false` si `EMAIL_SEND_MODE=disabled`.
- `sendEmailViaAcs` devuelve skip seguro antes de construir cliente ACS.
- Notificaciones operativas devuelven:

```json
{
  "provider": "acs-email",
  "status": "skipped",
  "reason": "email_send_disabled"
}
```

- Promociones quedan deshabilitadas aunque `PROMOTIONAL_EMAIL_SEND_ENABLED=true`.
- El resumen de comunicaciones reporta promociones como bloqueadas si el modo global esta disabled.

## Validacion local

```txt
npm --prefix api test
Resultado: 192/192 tests passing

node --check api/src/lib/notifier.js
node --check api/src/functions/promotionalCampaigns.js
node --check api/src/functions/communicationsSummary.js
Resultado: sin errores
```

Tests agregados:

- ACS configurado + `EMAIL_SEND_MODE=disabled` no llama `sendEmail`.
- `sendEmailViaAcs` respeta `EMAIL_SEND_MODE=disabled`.
- Promociones no quedan habilitadas si el modo global esta disabled.

## Configuracion aplicada en staging

En `func-puntoclub-stg-br-001`:

```txt
ENVIRONMENT_NAME=staging
EMAIL_SEND_MODE=disabled
PROMOTIONAL_EMAIL_SEND_ENABLED=false
COMPANY_REGISTRATION_REVIEW_ENABLED=false
COMPANY_INVITATION_MANAGEMENT_ENABLED=false
COMPANY_PASSWORD_RESET_ENABLED=false
```

Valores secretos no fueron leidos ni expuestos.

## Restricciones respetadas

- No se envio correo real.
- No se cambio ACS.
- No se cambio sender.
- No se cambio SQL.
- No se cambio DNS.
- No se expusieron secretos.

## Rollback

Para permitir correos en un ambiente especifico, requiere decision explicita y cambiar:

```txt
EMAIL_SEND_MODE=enabled
```

o retirar la variable, ademas de configurar ACS/senders/flags de forma controlada. No recomendado para staging phase 1 sin aprobacion Product/Infra.

## Uso Azure SQL

No se consulto ni modifico Azure SQL.

