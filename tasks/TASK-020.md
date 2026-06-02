# TASK-020 - Levantar API con conexion real y ejecutar smoke test

## Estado

Asignada a Backend/API.

## Contexto

TASK-017 preparo API local, dependencias y `npm run smoke`, pero no pudo conectar contra SQL real porque faltaba aplicar schema/seed y configurar `SQL_CONNECTION_STRING`.

## Objetivo

Levantar API contra `sqlserver-pj13-brazil/sql-db-puntoclub` y ejecutar smoke test real.

## Alcance

- Confirmar que TASK-019 aplico schema/seed.
- Configurar entorno sin commitear secretos:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
- Levantar API local o Azure.
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

Crear `tasks/TASK-020-HANDOFF.md`.
