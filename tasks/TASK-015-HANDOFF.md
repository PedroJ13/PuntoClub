Equipo:
Web Dev

Tarea completada:
TASK-015 - Integrar UI de clientes contra API real.

Archivos cambiados:
- `app/app-config.sample.js`
- `app/src/config.js`
- `app/src/customerApi.js`
- `app/src/app.js`
- `tasks/TASK-015-HANDOFF.md`

Verificacion ejecutada:
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `docs/API_CONTRACTS.md`.
- Leido `tasks/TASK-009-HANDOFF.md`.
- Leido `app/src/config.js` y `app/src/customerApi.js`.
- Revisado `api/src/functions/customers.js`, `api/src/lib/errors.js` y `api/src/lib/validators.js`.
- Ejecutado `node --check` en:
  - `app/src/config.js`
  - `app/src/app.js`
  - `app/src/customerApi.js`
- Ejecutado `npm test` en `api/`; primero fallo dentro del sandbox por `spawn EPERM`, luego paso fuera del sandbox:
  - 7 tests passing.
- Probado `customerApi.js` contra servidor HTTP local temporal con contrato de clientes:
  - `GET /api/companies/1/customers?search=Laura`
  - `POST /api/companies/1/customers`
  - error `409 DUPLICATE_CUSTOMER`
- Levantado frontend local con `python -m http.server 4173 --bind 127.0.0.1`.
- Verificado en Browser:
  - la UI queda en fuente `API real` por defecto,
  - sin API corriendo muestra error controlado,
  - sin errores criticos de consola,
  - sin overflow horizontal.
- Servidor local detenido al terminar.

Resultado:
- La UI de clientes ya usa API real por defecto.
- El mock local queda aislado y solo se activa explicitamente con `window.PUNTO_CLUB_USE_MOCK_API = true`.
- `PILOT_COMPANY_ID` frontend queda como configuracion no editable (`window.PUNTO_CLUB_COMPANY_ID`, default `"1"`).
- Se agrego `app/app-config.sample.js` como ejemplo no secreto para configurar:
  - `window.PUNTO_CLUB_API_BASE_URL`
  - `window.PUNTO_CLUB_COMPANY_ID`
  - `window.PUNTO_CLUB_USE_MOCK_API`
- `customerApi.js` normaliza `apiBaseUrl` para evitar rutas con doble slash si se configura una URL con slash final.
- El cliente HTTP usa los endpoints reales de Backend/API:
  - `GET /api/companies/{companyId}/customers?search={text}`
  - `POST /api/companies/{companyId}/customers`
- La UI muestra errores de validacion y duplicado de forma operativa:
  - `VALIDATION_ERROR` se refleja por campo.
  - `DUPLICATE_CUSTOMER` muestra mensaje especifico para buscar antes de registrar.

Riesgos o pendientes:
- No se pudo validar end-to-end contra Azure Functions + SQL real porque `api/node_modules`, `SQL_CONNECTION_STRING`, `PILOT_COMPANY_ID` y una base DEV ejecutada aun no estan listos en el entorno local.
- La UI con API real por defecto mostrara error de listado hasta que Azure Functions este corriendo en el mismo origen o `window.PUNTO_CLUB_API_BASE_URL` apunte a un host disponible.
- Falta definir el mecanismo final de inyeccion de `app-config` para Azure Static Web Apps sin editar codigo de aplicacion.
- No se implementaron compras, redenciones ni detalle de cliente, respetando el alcance.

Siguiente recomendado:
- Infra/Backend debe dejar disponible una API DEV con SQL configurado.
- QA debe ejecutar TASK-013 contra esa API.
- Web Dev debe hacer una revalidacion final en ambiente real cuando exista `API_BASE_URL` o Static Web Apps + Functions integrados.
