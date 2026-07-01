Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-600 - Commit y push controlado del nuevo flujo de campanas y envios

Resultado:
- Se realizo commit y push controlado del nuevo flujo de campanas/plantillas y seleccion de destinatarios al enviar.
- Se incluyeron cambios API/Web de `TASK-594` a `TASK-596`.
- Se incluyeron handoffs `TASK-588`, `TASK-589` y `TASK-593` a `TASK-599`.
- `debug.log` quedo excluido.
- No se activo envio real desde esta tarea.
- `PROMOTIONAL_EMAIL_SEND_ENABLED` sigue en `false` en Azure Functions.

Commit:
- `8e1f2ece98be147b47258c682f5b81870bfc7615`
- Mensaje: `Release promotional campaign send flow`
- Push: `origin/main`

Archivos principales incluidos:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-588-HANDOFF.md`
- `tasks/TASK-589-HANDOFF.md`
- `tasks/TASK-593-HANDOFF.md`
- `tasks/TASK-594-HANDOFF.md`
- `tasks/TASK-595-HANDOFF.md`
- `tasks/TASK-596-HANDOFF.md`
- `tasks/TASK-597-HANDOFF.md`
- `tasks/TASK-598-HANDOFF.md`
- `tasks/TASK-599-HANDOFF.md`

Validacion local previa:
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js app/styles.css`
  - Resultado: OK.
- `node --check` en archivos JS tocados
  - Resultado: OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 21/21 OK.
- `npm test` en `api/`
  - Resultado: 154/154 OK.

Workflows publicados:
- `Deploy Punto Club frontend`
  - Run: `28477980783`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28477980783`
  - Resultado: `success`.
- `Deploy Punto Club API`
  - Run: `28477980784`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28477980784`
  - Resultado: `success`.
  - Steps relevantes en success: `Run tests`, `Deploy Azure Functions`, `Smoke test stable API`.

Verificacion publicada segura:
- `GET https://puntoclubcr.com/` -> `200`.
- `GET https://puntoclubcr.com/src/app.js` -> `200`.
- Bundle publicado contiene senales del nuevo flujo:
  - `communicationCampaignList`.
  - `selectedCustomerIds`.
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/6/promotional-campaigns?limit=1&status=all` sin sesion -> `401 UNAUTHORIZED`.
- `PROMOTIONAL_EMAIL_SEND_ENABLED` confirmado en Azure Functions como `false`.

Confirmacion de alcance:
- No se activo envio real.
- No se llamo endpoint de envio.
- No se enviaron correos reales.
- No se cambio sender ni secretos.
- No se incluyo `debug.log`.

Uso Azure SQL:
- No directo.
- Motivo: validacion publicada segura corta sin sesion, que corta en `401` antes de operar datos. Los workflows ejecutaron deploy/smoke habitual.

Riesgos o pendientes:
- Requiere QA publicado del nuevo flujo sin envio real.
- Requiere decision/tarea posterior para reactivar `PROMOTIONAL_EMAIL_SEND_ENABLED=true` durante una ventana de prueba PO.
- El historial completo de multiples envios por una misma plantilla queda como mejora futura si se decide crear `PromotionalCampaignSends`.
