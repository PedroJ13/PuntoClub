# TASK-886 - Handoff

Nombre del Equipo: Infra
Modo: Staging / Deploy pipeline
Fecha: 2026-07-09

## Estado

Completada.

Se preparo workflow staging separado para publicar API staging y Web staging sin afectar produccion.

## Cambios realizados

Workflow API staging:

```txt
.github/workflows/azure-functions-api-staging.yml
```

- Ejecuta `npm ci` y `npm test` dentro de `api/`.
- Empaqueta `api/` excluyendo `local.settings.json`, `local-secrets`, logs y tests.
- Despliega solo a `func-puntoclub-stg-br-001`.
- Reaplica settings seguros de staging antes del deploy:
  - `ENVIRONMENT_NAME=staging`
  - `EMAIL_SEND_MODE=disabled`
  - `PROMOTIONAL_EMAIL_SEND_ENABLED=false`
  - flags internos de registro, invitaciones y reset en `false`
- Smoke sin escritura:
  - `GET /api/health` debe responder 200.
  - `GET /api/me` sin sesion debe responder 401.

Workflow Web staging:

```txt
.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml
```

- Genera `app/app-config.js` para staging.
- Usa API staging:
  - `https://func-puntoclub-stg-br-001.azurewebsites.net`
- Define:
  - `PUNTO_CLUB_ENVIRONMENT="staging"`
  - `PUNTO_CLUB_COMPANY_ID="6"`
  - `PUNTO_CLUB_USE_MOCK_API=false`
- Incluye guard para impedir `api.puntoclubcr.com` en staging config.
- Usa secret separado:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001`

## Deploy aplicado

Ademas de preparar workflows, se publico el estado actual en staging para validar:

```txt
API staging: https://func-puntoclub-stg-br-001.azurewebsites.net/api
Web staging: https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

## Verificacion

API:

```txt
npm --prefix api test
Resultado: 192/192 tests passing

GET /api/health
Resultado: 200
environment: staging

GET /api/me sin sesion
Resultado: 401
```

Web:

```txt
GET /                         200
GET /app-config.js            200
app-config contiene API staging: true
app-config contiene api.puntoclubcr.com: false
```

## Restricciones respetadas

- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambio DNS.
- No se enviaron correos.
- No se cambio produccion.
- No se expusieron secretos.

## Observaciones

- Staging phase 1 sigue usando SQL productiva segun decision previa; los workflows evitan smokes con escritura.
- El deploy Web staging manual genero un warning inicial del SWA CLI por el nombre de job; se ajusto el workflow a `build_and_deploy_job`.

## Uso Azure SQL

No se consulto ni modifico Azure SQL.

