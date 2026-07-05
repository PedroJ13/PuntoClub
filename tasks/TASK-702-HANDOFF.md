Equipo: Product / Architect / Release
Modo de ejecucion: Web Release
Tarea completada: TASK-702 - Publicar Web apuntando a api.puntoclubcr.com

Resultado:
- Se actualizo `app/app-config.js` para que `PUNTO_CLUB_API_BASE_URL` use `https://api.puntoclubcr.com`.
- Se hizo commit y push a `origin/main`.
- Workflow Web termino correctamente.
- No se cambio API, SQL, ACS, flags ni UI.
- No se enviaron correos reales.

Commit creado y publicado:
- `8e7e4c0`
- Mensaje:
  - `Point web config to API custom domain`

Archivos incluidos:
- `app/app-config.js`
- `tasks/TASK-696-HANDOFF.md`
- `tasks/TASK-697-HANDOFF.md`
- `tasks/TASK-698-HANDOFF.md`
- `tasks/TASK-699-HANDOFF.md`
- `tasks/TASK-700-HANDOFF.md`
- `tasks/TASK-701-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- handoffs antiguos no relacionados

Cambio publicado:
- Antes:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net`
- Despues:
  - `https://api.puntoclubcr.com`

Validacion previa:
- `GET https://api.puntoclubcr.com/api/me` sin sesion respondio `401 UNAUTHORIZED`.
- `git diff --check` sin errores para archivos incluidos.

Workflow publicado:
- Deploy Punto Club frontend:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28602823544`

Smoke publicado:
- `GET https://puntoclubcr.com/?cb=task702` respondio `200`.
- `GET https://puntoclubcr.com/app-config.js?cb=task702` respondio `200`.
- `app-config.js` publicado contiene `https://api.puntoclubcr.com`.
- `app-config.js` publicado no contiene `func-puntoclub-prod-br-001.azurewebsites.net`.
- `GET https://api.puntoclubcr.com/api/me` sin sesion respondio `401 UNAUTHORIZED`.

Uso Azure SQL:
- No.
- Motivo: cambio Web de configuracion sin datos ni migraciones.

Riesgos o pendientes:
- Falta QA publicado con sesion real/controlada:
  - login normal;
  - login incognito;
  - refresh;
  - logout;
  - endpoints privados basicos.
- Mantener `azurewebsites.net` disponible como fallback operativo hasta que QA confirme estabilidad.

Siguiente recomendado:
- Ejecutar `TASK-703` para validar login con API same-site en normal e incognito.
