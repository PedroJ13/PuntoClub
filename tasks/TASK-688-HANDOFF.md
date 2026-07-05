Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-688 - Commit y push controlado de fixes imagen campana y mensaje sesion

Resultado:
- Se commiteo y publico el paquete API/Web de fixes para imagen de campana y mensaje de sesion no persistida.
- Se publicaron workflows API y Web correctamente.
- No se enviaron correos reales.
- No se cambiaron feature flags.
- No se cambio DNS, CORS, SQL, ACS ni app settings.

Commit creado y publicado:
- `f7f72a2`
- Mensaje:
  - `Fix campaign image preview and session messaging`

Nota de push:
- `main` ya tenia pendiente el commit local `8fa61ce Add campaign image release handoffs`.
- El push de esta tarea publico ambos commits pendientes hasta `f7f72a2`.

Archivos incluidos en el commit `f7f72a2`:
- `api/src/functions/promotionalCampaigns.js`
- `api/test/promotional-campaigns.test.js`
- `app/src/app.js`
- `tasks/TASK-680-HANDOFF.md`
- `tasks/TASK-681-HANDOFF.md`
- `tasks/TASK-682-HANDOFF.md`
- `tasks/TASK-683-HANDOFF.md`
- `tasks/TASK-684-HANDOFF.md`
- `tasks/TASK-685-HANDOFF.md`
- `tasks/TASK-686-HANDOFF.md`
- `tasks/TASK-687-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- handoffs antiguos no relacionados
- `tasks/TASK-678-HANDOFF.md`
- `tasks/TASK-679-HANDOFF.md`

Validacion local:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/test/promotional-campaigns.test.js`
- `node --check app/src/app.js`
- `git diff --check`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
  - Resultado observado: `163` tests passed, `0` failed.

Workflows publicados:
- Deploy Punto Club frontend:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28595646929`
- Deploy Punto Club API:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28595647043`

Smoke publicado:
- Web:
  - `https://puntoclubcr.com/?cb=task688` respondio `200`.
  - `https://puntoclubcr.com/src/app.js?cb=task688` respondio `200`.
  - Bundle publicado contiene `SESSION_NOT_PERSISTED`.
  - Bundle publicado contiene el mensaje `No pudimos conservar`.
  - Bundle publicado contiene sincronizacion de imagen de preview con `renderCommunicationCampaignImage(currentPromotionalCampaign.image)`.
- API:
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me` sin cookie respondio `401` controlado con `UNAUTHORIZED`.
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/public/promotional-campaign-images/00000000-0000-0000-0000-000000000000` respondio `404` controlado para imagen inexistente.

Confirmaciones de alcance:
- API corrige construccion de URL absoluta para imagen de campana en correo usando:
  - `PUBLIC_API_BASE_URL`, o
  - `APP_PUBLIC_BASE_URL + /api`, o
  - URL del request cuando aplique.
- Web corrige preview de imagen activa y preserva imagen despues de envio si la respuesta no trae `image`.
- Web valida `/api/me` despues del login y muestra mensaje especifico si el navegador no conserva la sesion.

Uso Azure SQL:
- No.
- Motivo: publicacion de codigo sin migraciones ni consultas SQL.

Riesgos o pendientes:
- Falta QA publicado posterior al deploy:
  - preview de campana con imagen visible;
  - correo real controlado con imagen, solo si PO autoriza envio;
  - login normal/incognito con mensaje de sesion no persistida si aplica.
- Sigue vigente el riesgo arquitectonico de cookies cross-site entre `puntoclubcr.com` y `func-puntoclub-prod-br-001.azurewebsites.net`.
- La ruta recomendada por Infra sigue siendo API bajo dominio same-site, por ejemplo `api.puntoclubcr.com`, o proxy same-origin equivalente.

Siguiente recomendado:
- Crear tareas de QA publicado para revalidar imagen de campana y login normal/incognito.
- Decidir en una tarea separada si se avanza con `api.puntoclubcr.com` para reducir fallas por cookies de terceros.
