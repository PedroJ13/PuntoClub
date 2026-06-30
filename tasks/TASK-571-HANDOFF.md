Equipo: Product / Architect / Release
Tarea validada: TASK-571 - Commit y push controlado de promociones MVP sin envio real
Ambiente: Local `main` en `C:\Work\Productos Digitales\PuntoClub`; GitHub `PedroJ13/PuntoClub`; workflows GitHub Actions API/Web; assets publicados en Azure Static Web Apps; API publicada Azure Functions en modo verificacion acotada.
Resultado: aprobado
Checks ejecutados:
- Lectura de `chat-start/PRODUCT_ARCHITECT_RELEASE.md`, `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, handoffs `tasks/TASK-568-HANDOFF.md`, `tasks/TASK-569-HANDOFF.md` y `tasks/TASK-570-HANDOFF.md`.
- Revision de alcance staged: API, Web, SQL y handoffs `TASK-561` a `TASK-570`.
- `debug.log` excluido del commit; queda untracked local.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css api/src/functions/promotionalCampaigns.js api/src/lib/validators.js api/test/promotional-campaigns.test.js` -> OK.
- `node --check app/src/app.js`, `app/src/customerApi.js`, `api/src/functions/promotionalCampaigns.js`, `api/src/lib/validators.js` -> OK.
- `npm test` en `api/` -> 145/145 tests OK.
- Revision textual de bloqueo de envio: API conserva `PROMOTIONAL_SEND_BLOCKED` y `feature_flag_disabled`; Web conserva boton `Envio real bloqueado` / manejo `PROMOTIONAL_SEND_BLOCKED`; mock conserva error bloqueado.
- Commit creado: `722eb26cb6923133df0062bb99ad1ef1a843c3eb` (`Release promociones MVP sin envio real`).
- Push ejecutado a `origin/main`.
- Workflow `Deploy Punto Club frontend` -> success: https://github.com/PedroJ13/PuntoClub/actions/runs/28446772379
- Workflow `Deploy Punto Club API` -> success: https://github.com/PedroJ13/PuntoClub/actions/runs/28446772401
- Verificacion publicada Web:
  - Home/index SWA responden 200.
  - `index.html` publicado contiene texto de `Envio real bloqueado`.
  - `src/app.js` publicado contiene `PROMOTIONAL_SEND_BLOCKED` y accion `data-promotional-unsubscribe-id`.
  - `src/customerApi.js` publicado contiene `sendPromotionalCampaign`, `PROMOTIONAL_SEND_BLOCKED`, mensaje mock de envio bloqueado y `unsubscribePromotionalCustomer`.
- Verificacion publicada API acotada:
  - `GET /api/companies/6/promotional-campaigns?limit=10&status=all` respondio 200 sin campanas existentes; no se crearon campanas nuevas.
  - No se ejecuto envio real ni se generaron correos.
Hallazgos:
- Release tecnico de promociones MVP quedo commiteado y publicado por workflows API/Web.
- El envio real promocional sigue bloqueado por UI, mock y backend.
- La migracion SQL ya habia sido aplicada por TASK-570 antes del push.
P0/P1:
- Ninguno.
P2/P3:
- P3: `tasks/TASK-571.md` no existe en workspace; se trabajo con la instruccion pegada por el usuario y handoffs previos.
- P3: `app-config.js` publicado aun declara `PUNTO_CLUB_COMPANY_ID = "1"`, pero la API publicada respondio `COMPANY_NOT_FOUND` para list promos de company 1. No bloquea este release porque el flujo autenticado usa contexto de sesion; conviene que QA publicado lo confirme en la siguiente tarea.
Evidencia:
- Commit: `722eb26cb6923133df0062bb99ad1ef1a843c3eb`
- Push: `main -> origin/main`
- Frontend workflow: `Deploy Punto Club frontend`, run `28446772379`, conclusion `success`.
- API workflow: `Deploy Punto Club API`, run `28446772401`, conclusion `success`; pasos `Run tests`, `Deploy Azure Functions` y `Smoke test stable API` en success.
- `git status --short --branch`: `main...origin/main`; solo `?? debug.log` queda local sin trackear.
Uso DB cloud: No directo en TASK-571. Si se uso cloud real para deploy y verificacion acotada: GitHub Actions desplego API/Web; se leyeron assets publicados y endpoints publicados de promociones. No se abrio Azure SQL manualmente, no se modificaron datos desde esta tarea y no se enviaron correos.
Riesgos o pendientes:
- QA Web publicado debe validar con sesion real/controlada: campanas, destinatarios, baja promocional, preview, historial y bloqueo de envio.
- Si QA publicado usa `companyId=1` desde config publica, revisar posible inconsistencia con `COMPANY_NOT_FOUND`; validar contexto autenticado antes de clasificar.
- El envio promocional real sigue fuera de alcance hasta decision explicita posterior.
Siguiente recomendado: Crear/asignar QA publicado de promociones MVP sin envio real para validar el release desplegado end-to-end.
