# TASK-036 - Decidir GET settings

## Estado

Asignada a Backend/API.

## Contexto

QA TASK-033 encontro que `GET /api/companies/1/settings` responde `404`, aunque la ruta existe en `docs/API_CONTRACTS.md`.

## Objetivo

Decidir si `GET /settings` sigue siendo MVP y, si aplica, implementarla.

## Alcance

- Revisar `docs/API_CONTRACTS.md`.
- Si se mantiene:
  - implementar `GET /api/companies/{companyId}/settings`.
  - validar `companyId` contra `PILOT_COMPANY_ID`.
  - devolver datos de `dbo.Companies`.
  - agregar prueba/smoke si corresponde.
- Si se retira:
  - actualizar contrato y backlog.

## No tocar

- No cambiar UI salvo tarea separada.
- No guardar secretos.
- No crear recursos Azure.

## Handoff esperado

Crear `tasks/TASK-036-HANDOFF.md`.
