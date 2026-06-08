Equipo:
Web Dev

Tarea completada:
TASK-143 - Corregir fallback/rewrite de Static Web Apps para rutas profundas.

Archivos modificados:
- `app/staticwebapp.config.json`
- `tasks/TASK-143-HANDOFF.md`

Cambios realizados:
- Agregue `app/staticwebapp.config.json`.
- Configure `navigationFallback.rewrite` a `/index.html` para que rutas profundas como `/company-invitations/accept?token=...` sirvan la app.
- Agregue exclusiones para assets existentes:
  - `/styles.css`
  - `/app-config.js`
  - `/src/*`

Validacion local:
- `Get-Content app/staticwebapp.config.json -Raw | ConvertFrom-Json`: OK.
- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- Azure Static Web Apps CLI disponible: `swa 2.0.9`.
- `swa start . --host 127.0.0.1 --port 4281` desde `app/` detecto `staticwebapp.config.json`.
- Validacion HTTP contra emulador SWA:
  - `/` -> `200 text/html`.
  - `/styles.css` -> `200 text/css`.
  - `/src/app.js` -> `200 text/javascript`.
  - `/src/customerApi.js` -> `200 text/javascript`.
  - `/app-config.js` -> `200 text/javascript`.
  - `/company-invitations/accept?token=mock-valid-token` -> `200 text/html`.
- Smoke de navegador contra emulador SWA con `app-config.js` interceptado en mock:
  - Ruta `/company-invitations/accept?token=mock-valid-token` carga la app.
  - La vista publica de invitacion queda visible.
  - El flujo operativo queda oculto en esa ruta.
  - Se muestran `Cafe Central` y `hola@cafecentral.test`.
  - Sin overflow horizontal en viewport desktop.

Validacion publicada:
- No ejecutada en esta tarea. Requiere deploy de frontend y revalidacion QA sobre Static Web Apps publicado.

Riesgos / pendientes:
- La correccion depende de que el deploy incluya `app/staticwebapp.config.json` en la raiz publicada.
- Static Web Apps CLI advierte que el emulador puede no coincidir exactamente con cloud; QA debe revalidar publicado.
- No se tocaron API, Entra login ni `POST /api/company-invitations/accept`.
