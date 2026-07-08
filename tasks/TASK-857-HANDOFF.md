# TASK-857 - Handoff

Nombre del Equipo: Backend/API
Modo: Comunicaciones / Sender separado
Fecha: 2026-07-08

## Estado

Completada localmente.

## Alcance implementado

Se agrego soporte Backend/API para separar el remitente de correos promocionales del remitente operativo.

Variables existentes que se mantienen para correos operativos:

```txt
ACS_EMAIL_SENDER_ADDRESS
ACS_EMAIL_SENDER_DISPLAY_NAME
```

Variables nuevas soportadas para correos promocionales:

```txt
PROMOTIONAL_EMAIL_SENDER_ADDRESS
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME
```

Si las variables promocionales no existen o vienen vacias, promociones usan fallback al sender global actual para mantener compatibilidad.

## Cambios realizados

- `api/src/lib/notifier.js`
  - Agregado `getPromotionalEmailConfig(env)`.
  - Reusa connection string, internal notification email y public base URL del config global.
  - Sobrescribe solo `senderAddress` y `senderDisplayName` cuando existen variables promocionales.
  - Mantiene fallback a `getEmailConfig()`.

- `api/src/functions/promotionalCampaigns.js`
  - `sendPromotionalCampaign` ahora usa `notifier.getPromotionalEmailConfig()`.
  - Los correos operativos siguen usando `notifier.getEmailConfig()`.

- `api/test/company-registration.test.js`
  - Test de `getPromotionalEmailConfig` con sender promocional y fallback global.

- `api/test/operational-emails.test.js`
  - Test explicito confirmando que correo operativo usa `operaciones@mail.puntoclubcr.com` cuando ese es el sender global.

- `api/test/promotional-campaigns.test.js`
  - Test explicito confirmando que email promocional usa `campanas@mail.puntoclubcr.com` cuando ese config se pasa al builder.

## Verificacion

Ejecutado en `api/`:

```txt
npm test
```

Resultado:

```txt
tests 186
pass 186
fail 0
```

## Restricciones respetadas

- No se cambiaron app settings.
- No se cambio Azure Functions.
- No se cambio SQL.
- No se cambio DNS.
- No se cambio ACS.
- No se enviaron correos reales.
- No se tocaron secretos.

## Pendiente para Infra / Release

Una vez publicado este cambio Backend/API, Infra puede reintentar la activacion productiva con:

```txt
ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones
PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas
```

Rollback esperado:

```txt
ACS_EMAIL_SENDER_ADDRESS=DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club
```

Si se retiran las variables `PROMOTIONAL_EMAIL_SENDER_*`, promociones vuelven al sender global por fallback.
