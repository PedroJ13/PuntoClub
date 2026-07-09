# TASK-892A - Handoff

Equipo: QA

Tarea validada: TASK-892A - Validar preflight local antes del commit hardening staging

Ambiente: Workspace local `C:\Work\Productos Digitales\PuntoClub`, revision de cambios pendientes sin commit/push. Fecha: 2026-07-09.

Resultado: no aprobado

Checks ejecutados:
- `git status --short`
- `git diff --stat`
- Revision de diff en `api/src/lib/notifier.js`, `api/src/functions/communicationsSummary.js`, `api/src/functions/promotionalCampaigns.js`, `app/index.html`, `app/src/app.js`, `app/src/config.js`, `app/styles.css`.
- Revision de archivos nuevos `api/src/functions/health.js`, `api/test/health.test.js`.
- Revision de workflows nuevos `.github/workflows/azure-functions-api-staging.yml` y `.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml`.
- Confirmacion local de `app/app-config.js` productivo.
- Confirmacion de que no hay diff en workflows productivos existentes.
- `node --check` sobre archivos JS tocados.
- `npm --prefix api test`
- `npx prettier --check` sobre archivos tocados relevantes.

Hallazgos:
- El app-config productivo del repo sigue apuntando a `https://api.puntoclubcr.com`.
- El app-config productivo no define `PUNTO_CLUB_ENVIRONMENT`, por lo que `config.environmentName` cae a `production`.
- El badge `STAGING` queda oculto por defecto y solo se muestra si `PUNTO_CLUB_ENVIRONMENT=staging` o si la API base contiene señales de staging/stg.
- No hay cambios en workflows productivos existentes.
- Los workflows staging nuevos usan `workflow_dispatch`; no se disparan automaticamente por push.
- El workflow API staging configura `EMAIL_SEND_MODE=disabled` solo para `func-puntoclub-stg-br-001`.
- `EMAIL_SEND_MODE=disabled` no altera produccion salvo que alguien configure explicitamente esa variable en produccion.
- `/api/health` retorna estado runtime basico y no lee SQL, connection strings ni secretos.
- Tests API pasan: `192` tests OK.
- Sintaxis JS pasa con `node --check`.
- Prettier falla en 2 archivos: `api/src/lib/notifier.js` y `.github/workflows/azure-functions-api-staging.yml`.

P0/P1:
- Sin P0/P1 funcionales confirmados para produccion en la revision local.
- No se autoriza commit/push mientras Prettier este fallando, aunque el hallazgo es de formato y no de riesgo productivo directo.

P2/P3:
- P2: Prettier falla en `api/src/lib/notifier.js`.
- P2: Prettier falla en `.github/workflows/azure-functions-api-staging.yml`.
- P2: El hardening depende de que produccion no configure accidentalmente `EMAIL_SEND_MODE=disabled`; si se configura en produccion, bloquearia correos operativos/promocionales reales.
- P3: `git status` muestra muchos handoffs no trackeados previos; el commit de release debe seleccionar alcance cuidadosamente para no mezclar evidencia/tareas no relacionadas.

Evidencia:
- `app/app-config.js` actual:
  - `window.PUNTO_CLUB_API_BASE_URL = "https://api.puntoclubcr.com";`
  - `window.PUNTO_CLUB_COMPANY_ID = "1";`
  - `window.PUNTO_CLUB_USE_MOCK_API = false;`
- Check estatico:
  - `prodApi=true`
  - `prodNoEnvironment=true`
  - `prodNoStagingApi=true`
  - `noProdWorkflowDiff=true`
- `npm --prefix api test`: `1..192`, `# pass 192`, `# fail 0`.
- `node --check`: OK para los archivos JS revisados.
- `npx prettier --check ...`: falla con advertencias en:
  - `api/src/lib/notifier.js`
  - `.github/workflows/azure-functions-api-staging.yml`
- `api/src/functions/health.js` expone `readHealth()` con `ok`, `service`, `environment`, `timestamp`; test confirma que no incluye `sql` ni `secrets`.

Uso DB cloud: No. Solo se reviso codigo local y se ejecutaron tests/checks locales; no se uso Azure SQL ni ambiente cloud real.

Riesgos o pendientes:
- Formatear los 2 archivos con Prettier y reintentar el preflight antes de commit/push.
- Verificar antes de deploy productivo que `EMAIL_SEND_MODE` no este configurado como `disabled` en Function App productiva.
- Mantener workflows staging manuales y confirmar que secrets/tokens staging no se mezclen con produccion.
- Seleccionar cuidadosamente archivos para commit: hay muchos handoffs no trackeados no necesariamente relacionados con TASK-892.

Siguiente recomendado:
- Ejecucion Tecnica debe corregir formato con Prettier.
- Reejecutar `npx prettier --check ...` y `npm --prefix api test`.
- Solo despues de checks verdes, proceder con TASK-892 commit/push controlado.
