Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-578 - Commit y push controlado de correcciones promociones P0/P1

Resultado:
- Se realizo commit y push controlado de las correcciones P0/P1 de promociones.
- Se incluyeron los cambios Backend/API, Web y handoffs `TASK-571` a `TASK-577`.
- `debug.log` quedo excluido del commit.
- Los workflows API y Web finalizaron en `success`.
- Se confirmo en publicado que promociones sin sesion ya responden `401 UNAUTHORIZED`.
- Se confirmo que el envio real promocional sigue bloqueado.

Commit:
- `9a2a849581a27c8294c6971d3f8f425efe19d7aa`
- Mensaje: `Fix promotional security and recipients`
- Push: `origin/main`

Archivos incluidos en el commit:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/errors.js`
- `api/test/promotional-campaigns.test.js`
- `app/src/app.js`
- `tasks/TASK-571-HANDOFF.md`
- `tasks/TASK-572-HANDOFF.md`
- `tasks/TASK-573-HANDOFF.md`
- `tasks/TASK-574-HANDOFF.md`
- `tasks/TASK-575-HANDOFF.md`
- `tasks/TASK-576-HANDOFF.md`
- `tasks/TASK-577-HANDOFF.md`

Validacion local previa al commit:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/errors.js`
- `node --check api/test/promotional-campaigns.test.js`
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/errors.js api/test/promotional-campaigns.test.js app/src/app.js app/src/customerApi.js`
  - Resultado: OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 17/17 OK.
- `npm test` en `api/`
  - Resultado: 150/150 OK.

Workflows publicados:
- `Deploy Punto Club frontend`
  - Run: `28454717103`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28454717103`
  - Resultado: `success`.
- `Deploy Punto Club API`
  - Run: `28454716382`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28454716382`
  - Resultado: `success`.
  - Steps relevantes en success: `Run tests`, `Deploy Azure Functions`, `Smoke test stable API`.

Verificacion publicada acotada:
- `GET https://puntoclubcr.com/` -> `200`.
- `GET https://puntoclubcr.com/src/app.js` -> `200`.
- `GET https://puntoclubcr.com/src/customerApi.js` -> `200`.
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/6/promotional-campaigns?limit=1&status=all` sin sesion -> `401 UNAUTHORIZED`.
- Assets Web publicados conservan `PROMOTIONAL_SEND_BLOCKED` / bloqueo visible de envio real.

Confirmacion de alcance:
- No se habilito envio real promocional.
- No se hizo envio de correos promocionales.
- No se borro la campana QA real creada durante `TASK-572`.
- No se incluyo `debug.log`.

Uso Azure SQL:
- No directo.
- Motivo: no se abrio conexion SQL manual ni se modificaron datos por SQL. Los workflows publicados ejecutaron deploy y smoke acotado de API.

Riesgos o pendientes:
- Requiere QA publicado posterior con sesion real/controlada para cerrar:
  - negativos sin sesion;
  - companyId no autorizado;
  - seleccion real de destinatarios sin 500;
  - uso de empresa activa en Web autenticado;
  - envio real promocional bloqueado.
