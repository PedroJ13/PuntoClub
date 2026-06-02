Equipo:
Web Dev

Tarea completada:
TASK-026 - Revalidar UI contra API real despues de QA.

Archivos cambiados:
- `app/index.html`
- `app/app-config.js`
- `app/src/app.js`
- `api/scripts/local-api-server.js`
- `tasks/TASK-026-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-026.md`.
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-024-HANDOFF.md`.
- Leido `tasks/TASK-025-HANDOFF.md`.
- Confirmado sin imprimir secretos:
  - `api/local.settings.json` existe.
  - `SQL_CONNECTION_STRING` no esta en el entorno global de la terminal.
  - `PILOT_COMPANY_ID` no esta en el entorno global de la terminal.
  - `API_BASE_URL` no esta en el entorno global de la terminal.
- Ejecutado `node --check` en:
  - `api/scripts/local-api-server.js`
  - `app/src/config.js`
  - `app/src/customerApi.js`
  - `app/src/app.js`
- Levantado API local con `node scripts/local-api-server.js`.
- Levantado frontend local con `python -m http.server 4173 --bind 127.0.0.1`.
- Ejecutado `npm run smoke` contra `http://localhost:7071/api`; fallo en `POST /companies/1/customers` con `500 INTERNAL_ERROR`.
- Ejecutados requests reales de clientes:
  - `GET /api/companies/1/customers?search=Cafe`: `500 INTERNAL_ERROR`.
  - `POST /api/companies/1/customers`: `500 INTERNAL_ERROR`.
  - `POST /api/companies/1/customers` con campos invalidos: `500 INTERNAL_ERROR`.
- Ejecutada prueba directa de repositorio `ensureActiveCompany(1)` sin imprimir connection string:
  - fallo por Azure SQL firewall bloqueando la IP local actual.
- Verificado en Browser:
  - UI carga con fuente `API real`.
  - `window.PUNTO_CLUB_API_BASE_URL` configurado a `http://localhost:7071` sin secretos.
  - `window.PUNTO_CLUB_COMPANY_ID` configurado a `"1"`.
  - cuando API/SQL falla, la UI muestra error controlado: `No se pudo consultar clientes. Intente de nuevo.`
  - sin errores criticos de consola.
  - desktop/mobile sin overflow horizontal.
- Servidores locales detenidos al terminar.

Resultado:
- No aprobado para validacion end-to-end contra API real.
- TASK-024 reporto un smoke exitoso previo, pero TASK-025 no aprobo y en esta pasada Web Dev el ambiente local vuelve a fallar contra SQL por firewall.
- No se pudo validar exitosamente:
  - buscar/listar clientes,
  - registrar cliente,
  - duplicado,
  - errores de campo desde endpoint real.
- Si se pudo validar:
  - configuracion frontend sin secretos via `app/app-config.js`,
  - `companyId = "1"` no editable en UI,
  - fuente `API real`,
  - error controlado cuando la API real falla,
  - responsive basico.

Cambios realizados:
- `app/index.html`: carga `app-config.js` antes del modulo principal.
- `app/app-config.js`: configura API local no secreta:
  - `window.PUNTO_CLUB_API_BASE_URL = "http://localhost:7071"`
  - `window.PUNTO_CLUB_COMPANY_ID = "1"`
  - `window.PUNTO_CLUB_USE_MOCK_API = false`
- `api/scripts/local-api-server.js`: agrega CORS/OPTIONS para permitir validacion local desde el frontend en otro puerto.
- `app/src/app.js`: traduce `INTERNAL_ERROR` a copy operativo en UI.

Riesgos o pendientes:
- TASK-025 mantiene P1: endpoints reales contra SQL no estan aprobados.
- La validacion local depende de acceso de red/firewall hacia Azure SQL; en la sesion actual Azure SQL bloquea la IP local.
- No se guardaron secretos ni se imprimio `SQL_CONNECTION_STRING`.
- `app/app-config.js` no contiene secretos, pero es configuracion de ambiente local; Product/Infra debe decidir el mecanismo final para Static Web Apps.
- No se implementaron compras/redenciones ni se cambiaron contratos API.

Siguiente recomendado:
- Infra/Backend debe entregar una API estable que no dependa de reglas temporales locales, o habilitar temporalmente la IP local de validacion y repetir smoke.
- QA debe repetir TASK-025 hasta no tener P0/P1 en endpoints de clientes.
- Luego Web Dev debe repetir TASK-026 para validar busqueda, registro, duplicado y errores de campo contra API real aprobada.
