# TASK-877 - Handoff

Nombre del Equipo: Infra
Modo: Staging / Azure apply
Fecha: 2026-07-09

## Estado

Completada.

Se crearon recursos staging phase 1 Web/API sin duplicar SQL, sin tocar DNS y sin enviar correos reales.

## Recursos creados

Static Web App staging:

```txt
Name: swa-puntoclub-stg-001
Resource group: resource_group_main
Location: East US 2
SKU: Free
Default hostname: calm-coast-0fabaec0f.7.azurestaticapps.net
URL: https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

Storage staging para Azure Functions:

```txt
Name: stpuntoclubstgfunc001
Resource group: resource_group_main
Location: Brazil South
Kind: StorageV2
SKU: Standard_LRS
HTTPS only: true
Allow blob public access: false
Minimum TLS: TLS1_2
```

Application Insights staging:

```txt
Name: ai-puntoclub-stg-br-001
Resource group: resource_group_main
Location: Brazil South
Application type: web
```

Function App staging:

```txt
Name: func-puntoclub-stg-br-001
Resource group: resource_group_main
Location: Brazil South
Kind: functionapp,linux
Runtime: Node|22
Plan: BrazilSouthLinuxDynamicPlan
Identity: SystemAssigned
HTTPS only: true
Default hostname: func-puntoclub-stg-br-001.azurewebsites.net
API URL: https://func-puntoclub-stg-br-001.azurewebsites.net/api
```

Nota: Azure creo la Function App en el plan serverless existente `BrazilSouthLinuxDynamicPlan`, equivalente al patron productivo actual.

## App settings staging

Settings no secretos confirmados:

```txt
PILOT_COMPANY_ID=6
APP_PUBLIC_BASE_URL=https://calm-coast-0fabaec0f.7.azurestaticapps.net
PUBLIC_API_BASE_URL=https://func-puntoclub-stg-br-001.azurewebsites.net/api
COMPANY_SESSION_COOKIE_NAME=puntoclub_staging_company_session
COMPANY_SESSION_COOKIE_SECURE=true
COMPANY_SESSION_COOKIE_SAMESITE=none
PROMOTIONAL_EMAIL_SEND_ENABLED=false
COMPANY_REGISTRATION_REVIEW_ENABLED=false
COMPANY_INVITATION_MANAGEMENT_ENABLED=false
COMPANY_PASSWORD_RESET_ENABLED=false
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
LOGO_CONTAINER=company-logos-staging
```

Settings sensibles configurados sin exponer valores:

```txt
SQL_CONNECTION_STRING
INVITE_TOKEN_SECRET
INTERNAL_ADMIN_TOKEN
AzureWebJobsStorage
APPLICATIONINSIGHTS_CONNECTION_STRING
```

Notas:

- `INTERNAL_ADMIN_TOKEN` staging fue generado distinto al productivo y no se documento.
- `ACS_EMAIL_CONNECTION_STRING`, `ACS_EMAIL_SENDER_ADDRESS`, `PROMOTIONAL_EMAIL_SENDER_ADDRESS` quedaron vacios para bloquear envios por defecto.
- `SQL_CONNECTION_STRING` apunta temporalmente a SQL productiva, segun phase 1 aprobada. No se duplico SQL.

## CORS / cookies

CORS staging:

```txt
Allowed origins:
- https://calm-coast-0fabaec0f.7.azurestaticapps.net
supportCredentials: true
```

No se habilito wildcard.

Cookie staging:

```txt
Name: puntoclub_staging_company_session
Secure: true
SameSite: none
Domain: no configurado por API; cookie host-only de API staging
```

## Deploy aplicado

API:

- Se publico el paquete actual de `api/` en `func-puntoclub-stg-br-001`.
- Se excluyeron `local.settings.json`, `local-secrets`, `test` y `.gitignore`.
- No se ejecuto `npm run smoke` porque crea datos reales contra SQL productiva.

Web:

- Se publico `app/` en `swa-puntoclub-stg-001` desde una copia temporal.
- En la copia temporal se reemplazo `app-config.js` para apuntar a API staging:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "6";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

- No se modifico `app/app-config.js` del repo ni la Web productiva.

## Verificacion

API smoke seguro:

```txt
GET https://func-puntoclub-stg-br-001.azurewebsites.net/api/me
Status: 401
Body: {"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

CORS:

```txt
OPTIONS /api/me
Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
Status: 204
Access-Control-Allow-Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
```

Web staging:

```txt
GET /                          200
GET /app                       200
GET /company-registration      200
GET /company-invitations/accept 200
GET /company-password-reset    200
GET /admin-companies           200
GET /app-config.js             200
```

`app-config.js` publicado:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "6";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

Confirmado:

- `app-config.js` staging contiene API staging.
- `app-config.js` staging no contiene `api.puntoclubcr.com`.
- API staging responde con CORS correcto para Web staging.

## Restricciones respetadas

- No se duplico SQL.
- No se cambio DNS.
- No se cambio Web produccion.
- No se cambio Function App produccion.
- No se enviaron correos reales.
- No se ejecutaron smokes con escritura.
- No se expusieron secretos en handoff.

## Riesgos abiertos

- API staging usa SQL productiva temporalmente. Cualquier prueba con escritura crea datos reales.
- No existe todavia SQL staging.
- No existe endpoint `/api/health` sin SQL.
- No existe flag global unico de bloqueo de email; el bloqueo actual depende de dejar ACS sin connection string/sender y `PROMOTIONAL_EMAIL_SEND_ENABLED=false`.
- La Web staging fue publicada manualmente desde copia temporal; conviene crear workflow staging formal.

## Uso Azure SQL

No se consulto ni modifico Azure SQL desde esta tarea.

La Function App staging quedo configurada con `SQL_CONNECTION_STRING` productivo temporal segun phase 1, pero no se ejecuto ningun endpoint con escritura ni smoke que cree datos.

## Siguiente paso recomendado

- QA/Backend debe validar solo smokes seguros sin escritura.
- Web Dev debe formalizar workflow staging o mecanismo de `app-config.js` por ambiente.
- Product debe priorizar phase 2 con SQL staging antes de migraciones o QA con datos falsos.
