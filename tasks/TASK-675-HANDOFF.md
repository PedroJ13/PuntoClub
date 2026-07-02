Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-675 - Commit y push controlado de imagen opcional en campanas

Resultado:
- Se publico el paquete de imagen opcional en campanas promocionales.
- Se incluyeron cambios API, Web, migracion SQL versionada y handoffs disponibles de `TASK-656`, `TASK-664` a `TASK-674`.
- No se incluyo `debug.log`.
- No se enviaron correos reales.
- No se cambiaron feature flags.

Commit publicado:
- `0d29a070c0301cd508f9c1b329027db90e27f8a7`
- Mensaje:
  - `Add promotional campaign images`

Archivos incluidos:
- `database/migrations/20260701_promotional_campaign_images.sql`
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/campaignAssetStorage.js`
- `api/src/lib/logoStorage.js`
- `api/src/lib/repository.js`
- `api/test/logo-storage.test.js`
- `api/test/promotional-campaigns.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-656-HANDOFF.md`
- `tasks/TASK-664-HANDOFF.md`
- `tasks/TASK-665-HANDOFF.md`
- `tasks/TASK-666-HANDOFF.md`
- `tasks/TASK-667-HANDOFF.md`
- `tasks/TASK-668-HANDOFF.md`
- `tasks/TASK-669-HANDOFF.md`
- `tasks/TASK-670-HANDOFF.md`
- `tasks/TASK-671-HANDOFF.md`
- `tasks/TASK-672-HANDOFF.md`
- `tasks/TASK-673-HANDOFF.md`
- `tasks/TASK-674-HANDOFF.md`

Verificacion local antes del commit:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/campaignAssetStorage.js`
- `node --check api/src/lib/logoStorage.js`
- `node --check api/src/lib/repository.js`
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `git diff --check`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js test/logo-storage.test.js`
  - Resultado observado: `162` tests passed, `0` failed.

Workflows publicados:
- Deploy Punto Club frontend:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28563163976`
- Deploy Punto Club API:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28563163983`

Smoke publicado:
- Web:
  - `https://puntoclubcr.com/?cb=task675` respondio `200`.
  - `https://puntoclubcr.com/src/app.js?cb=task675` respondio `200`.
  - `https://puntoclubcr.com/styles.css?cb=task675` respondio `200`.
  - HTML publicado contiene `Imagen opcional`.
  - JS publicado contiene `uploadPromotionalCampaignImage` y `deletePromotionalCampaignImage`.
  - CSS publicado contiene `communication-image-panel`.
- API:
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/8/promotional-campaigns/7/image` sin sesion respondio `401 UNAUTHORIZED`.
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/public/promotional-campaign-images/00000000-0000-0000-0000-000000000000` respondio `404` para imagen inexistente.

Uso Azure SQL:
- No en esta tarea.
- Motivo: la migracion Azure SQL ya fue aplicada y verificada en `TASK-674`.
- En esta tarea solo se publico codigo y se ejecuto smoke HTTP.

Confirmaciones:
- `main` quedo alineada con `origin/main` despues del push.
- No se cambio sender ACS.
- No se cambiaron secretos.
- No se habilito public access del contenedor.
- No se activaron envios reales promocionales.

Riesgos o pendientes:
- Queda pendiente QA Web publicado funcional con sesion real para subir, reemplazar, eliminar y previsualizar imagen de campana sin enviar correos reales.
- Limpieza fisica de blobs reemplazados/eliminados sigue fuera del alcance de esta publicacion.
- WebP queda permitido por contrato, pero conviene observar compatibilidad visual real en clientes de correo antes de uso amplio.

Siguiente recomendado:
- Crear/ejecutar `TASK-676` para QA Web publicado de imagen opcional en campanas, sin envio real de correos.
