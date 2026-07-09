# TASK-896 - Handoff

Equipo: QA

Tarea validada: TASK-896 - Revalidar preflight local hardening staging

Ambiente: Workspace local `C:\Work\Productos Digitales\PuntoClub`, revision de cambios pendientes sin commit/push. Fecha: 2026-07-09.

Resultado: aprobado

Checks ejecutados:
- Revision de `tasks/TASK-895-HANDOFF.md`.
- `git status --short`
- `git diff --stat`
- `node --check` sobre archivos JS tocados.
- `npm --prefix api test`
- `npx prettier --check` sobre archivos API/Web/workflows tocados.
- Confirmacion estatica de `app/app-config.js` productivo.
- Confirmacion estatica de badge `STAGING` oculto por defecto.
- Confirmacion estatica de workflows staging `workflow_dispatch`.
- Confirmacion de que no hay diff en workflows productivos existentes.
- Revision de alcance de `EMAIL_SEND_MODE=disabled`.

Hallazgos:
- Prettier ahora pasa en todos los archivos revisados.
- Tests API pasan completos: 192/192.
- Sintaxis JS pasa con `node --check`.
- `app/app-config.js` productivo sigue apuntando a `https://api.puntoclubcr.com`.
- `app/app-config.js` productivo no contiene API staging ni `PUNTO_CLUB_ENVIRONMENT`.
- `app/src/config.js` deja `environmentName` en `production` por defecto.
- Badge `STAGING` esta en HTML con `hidden` y solo se activa por ambiente/API staging.
- No hay cambios en workflows productivos existentes.
- Workflows staging nuevos son manuales por `workflow_dispatch`.
- Workflow API staging configura `EMAIL_SEND_MODE=disabled` solo para `func-puntoclub-stg-br-001`.
- `/api/health` esta cubierto por test y no incluye campos SQL ni secretos.
- `EMAIL_SEND_MODE=disabled` bloquea correos solo si se configura explicitamente; sin esa app setting no cambia el flujo productivo esperado.

P0/P1:
- Sin P0/P1 abiertos.

P2/P3:
- P2 preventivo: antes de cualquier deploy productivo, confirmar que Function App productiva no tenga `EMAIL_SEND_MODE=disabled`, porque esa app setting bloquearia correos reales si se configura por error.
- P3: `git status` muestra muchos handoffs no trackeados previos; el commit de TASK-892 debe seleccionar alcance cuidadosamente.

Evidencia:
- `npx prettier --check ...` -> `All matched files use Prettier code style!`
- `npm --prefix api test` -> `1..192`, `# pass 192`, `# fail 0`.
- `node --check` -> OK para `api/src/functions/health.js`, `api/src/lib/notifier.js`, `api/src/functions/communicationsSummary.js`, `api/src/functions/promotionalCampaigns.js`, `app/src/config.js`, `app/src/app.js`.
- Check estatico:
  - `prodApi=true`
  - `prodNoEnvironment=true`
  - `prodNoStagingApi=true`
  - `badgeHiddenByDefault=true`
  - `configDefaultProduction=true`
  - `noProdWorkflowDiff=true`
- Workflows staging:
  - `.github/workflows/azure-functions-api-staging.yml` usa `workflow_dispatch`, `func-puntoclub-stg-br-001` y setea `EMAIL_SEND_MODE=disabled`.
  - `.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml` usa `workflow_dispatch`, genera `PUNTO_CLUB_ENVIRONMENT="staging"` y guarda contra `api.puntoclubcr.com` en config staging.
- `git diff -- .github/workflows/azure-functions-api.yml .github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml` -> sin salida.

Uso DB cloud: No. Solo revision local y tests/checks locales. No se uso Azure SQL ni ambiente cloud real. No se enviaron correos reales.

Riesgos o pendientes:
- Validar app settings productivos antes de deploy: `EMAIL_SEND_MODE` no debe estar en `disabled`.
- En TASK-892, stagear solo archivos del hardening staging y handoffs relacionados; evitar mezclar handoffs no relacionados.
- Mantener workflows staging manuales y verificar secrets de staging separados antes del primer run.

Siguiente recomendado:
- Proceder con TASK-892 commit/push controlado del hardening staging.
- Luego validar workflows y staging publicado segun el flujo release.
