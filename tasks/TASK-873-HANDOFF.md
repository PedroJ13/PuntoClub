# TASK-873 - Handoff

Nombre del Equipo: Backend/API
Modo: Staging / API readiness
Fecha: 2026-07-09

## Estado

Completada como revision. No se cambio logica funcional, app settings, Azure, SQL, Storage ni codigo.

## Documento base leido

- `docs/STAGING_ENVIRONMENT_PHASE1.md`

## Compatibilidad general

La API puede correr en una Function App separada para staging phase 1, siempre que tenga app settings propios y CORS configurado hacia la Web staging.

No se encontro endpoint `/api/health` dedicado. Para smoke seguro sin sesion se recomienda usar:

```txt
GET /api/me
Resultado esperado sin cookie: 401 UNAUTHORIZED / Authentication is required.
```

El smoke actual `npm run smoke` no es seguro para phase 1 con SQL productiva porque crea cliente, compra y canje.

## Settings requeridos

Runtime/base:

```txt
FUNCTIONS_WORKER_RUNTIME=node
FUNCTIONS_EXTENSION_VERSION
AzureWebJobsStorage=<storage staging>
APPLICATIONINSIGHTS_CONNECTION_STRING=<AI staging>
SQL_CONNECTION_STRING=<productiva temporal solo si Product lo aprueba>
PILOT_COMPANY_ID=<empresa QA/controlada>
```

Auth/sesiones:

```txt
COMPANY_SESSION_COOKIE_NAME=puntoclub_staging_company_session
COMPANY_SESSION_COOKIE_SECURE=true
COMPANY_SESSION_COOKIE_SAMESITE=none
COMPANY_SESSION_TTL_HOURS=<opcional>
INVITE_TOKEN_SECRET=<secreto staging distinto>
```

URLs:

```txt
APP_PUBLIC_BASE_URL=https://<web-staging-url>
PUBLIC_API_BASE_URL=https://<api-staging-url>/api
```

Admin interno:

```txt
INTERNAL_ADMIN_TOKEN=<token staging distinto>
COMPANY_REGISTRATION_REVIEW_ENABLED=false por defecto
COMPANY_INVITATION_MANAGEMENT_ENABLED=false por defecto
COMPANY_PASSWORD_RESET_ENABLED=false por defecto
COMPANY_PASSWORD_RESET_EXPIRES_MINUTES=<si se habilita prueba controlada>
```

Correos:

```txt
ACS_EMAIL_CONNECTION_STRING=<vacio por defecto en staging phase 1>
ACS_EMAIL_SENDER_ADDRESS=<vacio por defecto>
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
INTERNAL_NOTIFICATION_EMAIL=<mailbox QA si se aprueba>
PROMOTIONAL_EMAIL_SEND_ENABLED=false
PROMOTIONAL_EMAIL_SENDER_ADDRESS=<vacio por defecto>
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS=<opcional si alguna vez se habilita prueba>
```

Storage/logo/assets:

```txt
LOGO_STORAGE_ACCOUNT=<idealmente storage/container staging>
LOGO_CONTAINER=<container staging, no productivo>
LOGO_MAX_BYTES
LOGO_ALLOWED_MIME_TYPES
LOGO_SERVE_MODE
```

## CORS esperado

Function App staging:

```txt
allowedOrigins:
- https://<web-staging-default>.azurestaticapps.net
- https://staging.puntoclubcr.com si se crea
supportCredentials: true
```

No usar `*` con credentials.

La Web usa `credentials: include` para endpoints privados. La cookie actual se emite sin `Domain`, por lo que queda host-only del API staging. Esto es correcto y reduce interferencia con produccion.

## Cookies / sesion

El modulo `api/src/lib/companyAuth.js`:

- usa cookie default `puntoclub_company_session`;
- permite override con `COMPANY_SESSION_COOKIE_NAME`;
- en Azure marca cookie `Secure`;
- si el entorno es seguro, default `SameSite=None`;
- no define `Domain`.

Recomendacion staging:

```txt
COMPANY_SESSION_COOKIE_NAME=puntoclub_staging_company_session
COMPANY_SESSION_COOKIE_SECURE=true
COMPANY_SESSION_COOKIE_SAMESITE=none
```

Esto evita que pruebas staging compartan nombre de cookie con produccion.

## Endpoints smoke recomendados

Seguros sin escribir datos:

```txt
GET /api/me
Esperado sin sesion: 401

GET /api/company-invitations/validate?token=synthetic
Esperado: error controlado, sin escritura

GET /api/company-password-resets/validate?token=synthetic
Esperado: error controlado si feature/endpoint activo
```

Con sesion QA autorizada:

```txt
POST /api/company-auth/login
GET /api/me
POST /api/company-auth/logout
GET /api/companies/{companyId}/settings
GET /api/companies/{companyId}/customers?search=<qa>
GET /api/companies/{companyId}/communications-summary
GET /api/companies/{companyId}/operational-emails
```

No ejecutar por defecto contra SQL productiva:

```txt
npm run smoke
POST /api/companies/{companyId}/customers
POST /api/companies/{companyId}/purchases
POST /api/companies/{companyId}/redemptions
POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send
POST /api/company-password-resets
POST /api/company-invitations
```

## Flags para deshabilitar correos/campanas reales

Minimo requerido:

```txt
PROMOTIONAL_EMAIL_SEND_ENABLED=false
ACS_EMAIL_CONNECTION_STRING vacio o ACS staging sin remitentes reales
COMPANY_PASSWORD_RESET_ENABLED=false
COMPANY_INVITATION_MANAGEMENT_ENABLED=false
COMPANY_REGISTRATION_REVIEW_ENABLED=false
```

Estado del codigo:

- Promociones reales se bloquean por `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- Correos operativos dependen de `ACS_EMAIL_CONNECTION_STRING` y sender configurado; si se configuran, pueden enviarse cuando se registren eventos operativos.
- Password reset/invitaciones pueden enviar correos si las features y ACS estan configurados.

Riesgo: no hay un flag global unico `EMAIL_SEND_DISABLED=true`. Para staging robusto conviene crear una tarea Backend posterior si Product quiere bloqueo centralizado independiente de ACS.

## Riesgos de usar SQL productiva

- Staging puede escribir datos reales si se prueba alta/compra/canje/campanas/membresias.
- El smoke actual crea datos; no debe ejecutarse automaticamente contra staging phase 1.
- Eventos operativos pueden crear trazabilidad de correos y datos en tablas reales.
- Sessions de staging quedan en SQL productiva si se usa la misma DB.
- Si staging usa una version de API con cambios no aprobados, puede escribir con logica no publicada.
- No valida migraciones de forma segura.

Mitigaciones:

- Usar empresa QA/controlada.
- Cookie name staging distinto.
- Features de email/admin/reset deshabilitadas por defecto.
- No ejecutar pruebas de carga.
- No ejecutar migraciones.
- Documentar toda prueba que escriba datos.

## Ajustes recomendados antes de crear staging

No bloqueantes para phase 1:

1. Agregar endpoint `GET /api/health` que no toque SQL ni secretos.
2. Agregar script `npm run smoke:safe` para validar API sin escrituras.
3. Agregar flag global de entorno para bloqueo de email en staging, por ejemplo `EMAIL_SEND_MODE=disabled`.
4. Agregar validacion defensiva para que `PROMOTIONAL_EMAIL_SEND_ENABLED=true` no funcione en `ENVIRONMENT_NAME=staging` salvo override explicito.

## Verificacion realizada

Lectura local:

- `docs/STAGING_ENVIRONMENT_PHASE1.md`
- `api/local.settings.sample.json`
- `api/package.json`
- `api/scripts/smoke-test.js`
- `api/src/lib/companyAuth.js`
- `api/src/functions/companyAuth.js`
- rutas `app.http` bajo `api/src/functions`

Azure lectura:

- Se listaron nombres de app settings productivos sin valores.
- No se leyeron ni documentaron secretos.

## Restricciones respetadas

- No se cambio logica funcional.
- No se cambiaron app settings.
- No se cambio Azure.
- No se cambio SQL.
- No se cambio Storage.
- No se enviaron correos.
- No se expusieron secretos.

## Uso Azure SQL

No se uso Azure SQL.

## Siguiente paso recomendado

Crear tareas Backend posteriores solo si Product aprueba:

- `GET /api/health` sin SQL;
- smoke seguro sin escrituras;
- bloqueo global de emails para staging;
- proteccion adicional para impedir envios promocionales reales en staging salvo override explicito.
