# TASK-028 - Reintentar API real y smoke test con acceso estable

## Estado

Asignada a Backend/API.

## Contexto

TASK-024 logro smoke real una vez, pero TASK-025/TASK-026 no pudieron repetirlo por conectividad SQL/firewall. TASK-027 debe entregar una ruta estable o repetible.

## Objetivo

Levantar API contra Azure SQL y ejecutar smoke test real de forma repetible para QA.

## Alcance

- Confirmar TASK-027 completada.
- Levantar API local o usar URL Azure.
- Ejecutar:

```powershell
cd api
npm test
npm run smoke
```

- Entregar `API_BASE_URL` o comandos seguros para QA.
- No revelar secretos.

## No tocar

- No guardar secrets.
- No cambiar frontend salvo que sea imprescindible y se documente.
- No crear otra DB.

## Handoff esperado

Crear `tasks/TASK-028-HANDOFF.md`.
