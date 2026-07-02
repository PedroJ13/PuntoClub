Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-716 - Commit y push controlado de separacion y edicion de campanas

Resultado:
- Se commiteo y publico el paquete API/Web para separar Crear/Editar campana de Enviar campana.
- Se publico tambien el endpoint API para editar contenido de campanas existentes.
- Workflows API y Web terminaron correctamente.
- No se enviaron correos reales.
- No se cambio `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se cambio SQL, ACS, sender, storage, DNS, CORS ni app settings.

Commit creado y publicado:
- `3a6d0ff`
- Mensaje:
  - `Separate campaign editing from sending`

Archivos incluidos:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/test/promotional-campaigns.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-708.md`
- `tasks/TASK-708-HANDOFF.md`
- `tasks/TASK-709-HANDOFF.md`
- `tasks/TASK-710-HANDOFF.md`
- `tasks/TASK-711-HANDOFF.md`
- `tasks/TASK-712-HANDOFF.md`
- `tasks/TASK-713-HANDOFF.md`
- `tasks/TASK-714-HANDOFF.md`
- `tasks/TASK-715-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- handoffs antiguos no relacionados.

Validacion local antes del commit:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/repository.js`
- `node --test api/test/promotional-campaigns.test.js`
  - 18/18 OK.
- `npm test` en `api/`
  - 166/166 OK.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/test/promotional-campaigns.test.js`
- `git diff --check`

Workflows publicados:
- Deploy Punto Club frontend:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28611247759`
- Deploy Punto Club API:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28611247863`

Smoke publicado:
- `GET https://puntoclubcr.com/?cb=task716`
  - `200`
  - home carga bundle de app.
- `GET https://puntoclubcr.com/src/app.js?cb=task716`
  - `200`
  - bundle contiene `updatePromotionalCampaign`.
  - bundle contiene `managedPromotionalCampaign`.
- `GET https://api.puntoclubcr.com/api/me`
  - `401` sin sesion, respuesta controlada esperada.

Nota:
- `GET https://api.puntoclubcr.com/api/health` respondio `404`; no se toma como fallo de release porque ese endpoint no esta publicado como contrato del dominio API actual. Se valido API con `/api/me` sin sesion.

Uso Azure SQL:
- No.
- Motivo: release sin migracion SQL y sin smoke con datos reales.

Riesgos o pendientes:
- Falta QA publicada con sesion real/controlada para validar crear/editar campanas e imagen contra API/Blob reales.
- No se ejecuto envio real promocional.
- `tasks/TASK-716-HANDOFF.md` queda creado despues del commit/push de release y debera commitearse en una tarea de higiene posterior si se requiere trazabilidad remota inmediata.

Siguiente recomendado:
- Ejecutar `TASK-717` de QA publicada.
- Luego cerrar release con handoff de QA y commitear handoffs de cierre si corresponde.
