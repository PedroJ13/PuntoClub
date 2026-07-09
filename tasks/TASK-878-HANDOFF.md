# TASK-878 - Handoff

Nombre del Equipo: Backend/API
Modo: Staging / Smoke seguro
Fecha: 2026-07-09

## Estado

Completada como validacion segura inicial.

No se ejecuto smoke que cree clientes, compras o canjes contra SQL productiva.

## Ambiente validado

API staging:

```txt
Function App: func-puntoclub-stg-br-001
URL: https://func-puntoclub-stg-br-001.azurewebsites.net/api
Runtime: Node|22
HTTPS only: true
CORS origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
CORS credentials: true
```

Settings no secretos relevantes:

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
```

Correos:

```txt
ACS_EMAIL_CONNECTION_STRING: configurado vacio
ACS_EMAIL_SENDER_ADDRESS: configurado vacio
PROMOTIONAL_EMAIL_SENDER_ADDRESS: configurado vacio
PROMOTIONAL_EMAIL_SEND_ENABLED=false
```

## Validacion ejecutada

Smoke sin escritura:

```txt
GET https://func-puntoclub-stg-br-001.azurewebsites.net/api/me
```

Resultado:

```txt
Status: 401
Body: {"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

CORS sin escritura:

```txt
OPTIONS https://func-puntoclub-stg-br-001.azurewebsites.net/api/me
Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
Access-Control-Request-Method: GET
```

Resultado:

```txt
Status: 204
Access-Control-Allow-Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
```

## Login/logout QA

No se ejecuto login/logout QA porque no se recibieron credenciales QA en esta tarea y no se deben exponer ni inferir.

Flujo recomendado cuando PO/QA entregue credenciales por canal seguro:

```txt
POST /api/company-auth/login
GET /api/me
POST /api/company-auth/logout
GET /api/me -> 401
```

Este flujo escribe sesion en SQL productiva porque phase 1 no duplica SQL. Debe hacerse solo con usuario/empresa QA autorizada.

## Endpoints seguros para smoke sin escritura

Disponibles ahora:

```txt
GET /api/me
```

Esperado sin cookie:

```txt
401 UNAUTHORIZED
```

Validaciones adicionales sin escritura, con cuidado:

```txt
GET /api/company-invitations/validate?token=synthetic
GET /api/company-password-resets/validate?token=synthetic
```

Nota: pueden tocar SQL en lectura para buscar token hash, pero no escriben datos. Usarlos solo si se necesita validar rutas publicas.

Con sesion QA autorizada:

```txt
GET /api/me
GET /api/companies/{companyId}/settings
GET /api/companies/{companyId}/customers?search=<qa>
GET /api/companies/{companyId}/communications-summary
GET /api/companies/{companyId}/operational-emails
```

## No ejecutar en staging phase 1 sin aprobacion

No ejecutar:

```txt
npm run smoke
```

Motivo:

- `api/scripts/smoke-test.js` crea cliente.
- Registra compra.
- Registra canje.
- Consulta reportes sobre esos datos.

Tampoco ejecutar por defecto:

```txt
POST /api/companies/{companyId}/customers
POST /api/companies/{companyId}/purchases
POST /api/companies/{companyId}/redemptions
POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send
POST /api/company-password-resets
POST /api/company-invitations
```

## Ajustes recomendados

Crear tareas Backend posteriores para:

1. `GET /api/health`
   - No debe tocar SQL.
   - Debe validar runtime/config minima no secreta.
   - Debe responder 200 si la Function App esta viva.
2. `npm run smoke:safe`
   - Debe validar `/api/me` 401.
   - Debe validar CORS si se pasa origen.
   - No debe crear datos.
3. Bloqueo global de emails staging:
   - Ejemplo: `EMAIL_SEND_MODE=disabled`.
   - Debe impedir operativos, resets, invitaciones y promociones aunque por error exista connection string ACS.
4. Proteccion defensiva:
   - Si `ENVIRONMENT_NAME=staging`, requerir override explicito para cualquier envio real.

## Restricciones respetadas

- No se ejecuto smoke con escritura.
- No se enviaron correos.
- No se cambio codigo.
- No se cambio SQL.
- No se expusieron secretos.
- No se cambiaron settings desde esta tarea fuera de lo ejecutado por Infra en TASK-877.

## Uso Azure SQL

No se consulto ni modifico Azure SQL directamente.

`GET /api/me` sin cookie no requiere consulta SQL porque falla antes de validar sesion.

## Siguiente paso recomendado

QA puede validar Web/API staging con:

- rutas publicas;
- `/api/me` 401 sin sesion;
- login/logout solo con credenciales QA autorizadas;
- ningun flujo de escritura salvo decision explicita mientras SQL staging no exista.
