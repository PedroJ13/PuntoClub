# TASK-024 - Levantar API real y ejecutar smoke test

## Estado

Asignada a Backend/API.

## Contexto

TASK-020 no pudo completar API real porque faltaban usuario runtime, `SQL_CONNECTION_STRING`, `PILOT_COMPANY_ID` y Azure Functions Core Tools o despliegue.

## Objetivo

Levantar API conectada a `sqlserver-pj13-brazil/sql-db-puntoclub` y ejecutar `npm run smoke` exitosamente.

## Alcance

- Confirmar TASK-023 completada.
- Confirmar variables seguras:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
- Usar Azure Functions Core Tools local o una Azure Function desplegada.
- Ejecutar:

```powershell
cd api
npm test
npm run smoke
```

- Entregar URL/comandos seguros para QA.

## No tocar

- No guardar secretos.
- No cambiar frontend.
- No crear otra DB.

## Handoff esperado

Crear `tasks/TASK-024-HANDOFF.md`.
