# TASK-039 - Redeployar Azure Functions con GET settings

## Estado

Asignada a Backend/API.

## Contexto

TASK-036 implemento `GET /api/companies/{companyId}/settings` en codigo local, pero no se redeployo Azure Functions. La URL estable aun puede responder `404` para settings.

## Objetivo

Publicar el paquete actualizado de API en `func-puntoclub-prod-br-001` y validar `GET /settings` en la URL estable.

## Alcance

- Crear paquete limpio excluyendo:
  - `api/local.settings.json`
  - `local-secrets/`
  - logs
  - tests si no son necesarios en runtime
- Actualizar `WEBSITE_RUN_FROM_PACKAGE` o usar mecanismo de deploy aprobado.
- Validar:
  - `npm run smoke` contra URL estable.
  - `GET /api/companies/1/settings` devuelve `200`.
- No imprimir secretos ni SAS.

## No tocar

- No crear Static Web Apps.
- No cambiar DB.
- No guardar secretos.

## Handoff esperado

Crear `tasks/TASK-039-HANDOFF.md`.
