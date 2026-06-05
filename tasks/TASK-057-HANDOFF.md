Equipo: QA

Tarea completada: TASK-057 - Validar API estable despues del primer run real del workflow API

Ambiente:
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-05

Resultado:
- Aprobado.
- El primer run real exitoso del workflow API fue revisado.
- La API estable sigue funcionando despues del deploy del workflow.
- No hay P0/P1 abiertos en el alcance de TASK-057.

Run revisado:
- Workflow: `Deploy Punto Club API`
- Run aprobado: `27042830528`
- URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/27042830528`
- Commit: `6411d7b557ab5260165a298564a64dcee248ce05`
- Titulo: `Clear run-from-package before API zip deploy`
- Rama: `main`
- Evento: `push`
- Estado: `completed`
- Conclusion: `success`
- Creado: `2026-06-05T22:12:48Z`
- Actualizado: `2026-06-05T22:15:17Z`

Contexto de runs previos:
- Run `27042362711`: `failure`, titulo `Add API deploy workflow`.
- Run `27042570553`: `failure`, titulo `Use Azure CLI for API deploy workflow`.
- Run vigente para esta validacion: `27042830528`, `success`.

Archivos cambiados:
- `tasks/TASK-057-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-057-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-055-HANDOFF.md`.
- Leido `tasks/TASK-056-HANDOFF.md`.
- Consultada API publica de GitHub Actions para el workflow `azure-functions-api.yml`.
- Revisados jobs/steps del run `27042830528`.
- Ejecutado smoke test real contra API estable.
- Ejecutados checks negativos de redencion.
- Confirmado CORS/API real desde origen del frontend publicado.
- Confirmada configuracion publicada del frontend.

Checks ejecutados:
- Job `Test and deploy API` del run `27042830528`:
  - `Checkout`: success;
  - `Setup Node`: success;
  - `Install dependencies`: success;
  - `Run tests`: success;
  - `Azure login`: success;
  - `Package API`: success;
  - `Clear run-from-package setting`: success;
  - `Deploy Azure Functions`: success;
  - `Smoke test stable API`: success.
- Smoke API estable con `npm run smoke`:
  - `GET /companies/1/settings`: OK;
  - `POST /companies/1/customers`: OK;
  - `GET /companies/1/customers?search={phone}`: OK;
  - `POST /companies/1/purchases`: OK;
  - `GET /companies/1/customers/{customerId}/balance`: OK;
  - `POST /companies/1/redemptions`: OK;
  - `GET /companies/1/customers/{customerId}/activity`: OK.
- Evidencia smoke:
  - cliente creado por smoke: `customerId = 41`;
  - saldo antes de redencion: `pointsEarned = 50`, `pointsRedeemed = 0`, `pointsBalance = 50`;
  - saldo despues de redencion: `pointsEarned = 50`, `pointsRedeemed = 1`, `pointsBalance = 49`;
  - `activityItems = 2`.
- Validacion saldo insuficiente:
  - endpoint: `POST /companies/1/redemptions`;
  - status: `409`;
  - error: `INSUFFICIENT_POINTS`;
  - mensaje: `Redemption exceeds available point balance.`
- Validacion de campos de redencion:
  - endpoint: `POST /companies/1/redemptions`;
  - payload con `redemptionDate` vacio y `pointsRedeemed = 0`;
  - status: `400`;
  - error: `VALIDATION_ERROR`;
  - detalle `redemptionDate`: `redemptionDate must use YYYY-MM-DD format.`;
  - detalle `pointsRedeemed`: `Points redeemed must be a positive integer.`
- CORS/frontend publicado:
  - `GET /companies/1/settings` con `Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net` respondio `200`;
  - `Access-Control-Allow-Origin = https://calm-dune-075dc5c0f.7.azurestaticapps.net`;
  - `settings.id = 1`;
  - `settings.status = active`.
- Config frontend publicado:
  - `app-config.js` respondio `200`;
  - `PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`;
  - `PUNTO_CLUB_COMPANY_ID = "1"`;
  - `PUNTO_CLUB_USE_MOCK_API = false`.

Hallazgos:

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo observado en el alcance de TASK-057.

Evidencia:
- El workflow API ya tuvo un run real exitoso en `main`.
- El deploy formal por workflow ejecuto `Clear run-from-package setting`, `Deploy Azure Functions` y `Smoke test stable API` con conclusion `success`.
- La API estable respondio correctamente settings, clientes, compras, saldo, redenciones y actividad despues del deploy.
- Los errores negativos principales no exponen secretos y devuelven codigos esperados.
- El frontend publicado sigue configurado contra API real y CORS permite el origen publicado.

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se imprimieron secretos ni se cambio Azure.
- Los dos primeros runs del workflow fallaron, pero el run vigente validado para esta tarea paso correctamente.

Siguiente recomendado:
- Product / Architect / Release puede procesar este handoff y considerar cerrado el smoke QA post-primer deploy real del workflow API.
