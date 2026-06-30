Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-588 - Commit y push controlado de envio real promocional

Resultado:
- Se realizo commit y push controlado del paquete API/Web para envio real promocional controlado.
- Se incluyeron cambios API/Web de `TASK-585` y handoffs `TASK-584` a `TASK-587`.
- `debug.log` fue excluido.
- No se activo `PROMOTIONAL_EMAIL_SEND_ENABLED` desde esta tarea.
- No se enviaron correos reales.
- Workflows API y Web terminaron en `success`.

Commit publicado:
- `0b70baf592e2e0870f152518e2e78b54b4046165`
- Mensaje: `Release controlled promotional sends`
- Push: `origin/main`

Archivos incluidos:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-584-HANDOFF.md`
- `tasks/TASK-585-HANDOFF.md`
- `tasks/TASK-586-HANDOFF.md`
- `tasks/TASK-587-HANDOFF.md`

Validacion local previa:
- `node --check`:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`
  - `api/src/lib/validators.js`
  - `api/test/promotional-campaigns.test.js`
  - `app/src/app.js`
  - `app/src/customerApi.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js`
  - Resultado: OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 21/21 OK.
- `npm test` en `api/`
  - Resultado: 154/154 OK.

Workflows publicados:
- `Deploy Punto Club frontend`
  - Run: `28467610615`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28467610615`
  - Resultado: `success`.
- `Deploy Punto Club API`
  - Run: `28467610696`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28467610696`
  - Resultado: `success`.

Smoke publicado acotado:
- `GET https://puntoclubcr.com/?cb=task588b` -> `200`.
- `GET https://puntoclubcr.com/src/app.js?cb=task588b` -> `200`.
  - Contiene texto de no enviar a clientes no seleccionados.
  - Contiene estado/boton `Enviar a`.
- `GET https://puntoclubcr.com/src/customerApi.js?cb=task588` -> `200`.
  - Contiene `sendPromotionalCampaign`.
  - Contiene `confirmSend`.
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/6/promotional-campaigns?limit=1&status=all` sin sesion -> `401 UNAUTHORIZED`.

Confirmacion de alcance:
- Publicado el codigo para envio real promocional controlado.
- No se activo el feature flag de envio real desde esta tarea.
- No se ejecuto prueba real ni se enviaron correos.
- El envio real sigue condicionado a `PROMOTIONAL_EMAIL_SEND_ENABLED=true`, sesion valida, destinatarios seleccionados, confirmacion explicita y controles server-side.

Uso Azure SQL:
- No directo.
- Motivo: release git + workflows + smoke HTTP publicado sin sesion; no hubo conexion SQL manual ni scripts.

Uso ACS / correos reales:
- No.
- Motivo: esta tarea excluia activar el flag y no debia ejecutar envios.

Riesgos o pendientes:
- Falta activar `PROMOTIONAL_EMAIL_SEND_ENABLED=true` solo para ventana de prueba PO si Product / Release lo autoriza.
- Falta prueba real PO con destinatarios controlados.
- Falta QA/PO publicado de confirmacion real una vez activo el flag.
- `debug.log` permanece untracked local y excluido.

Siguiente recomendado:
- Ejecutar `TASK-589` para configurar el feature flag solo en ventana controlada.
- Ejecutar `TASK-590` para prueba real PO con destinatarios seleccionados.
