Equipo:
Web Dev

Tarea completada:
TASK-037 - Revalidar UI contra API estable con CORS.

Archivos cambiados:
- `tasks/TASK-037-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-037.md`.
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-035-HANDOFF.md`.
- Confirmado que `app/app-config.js` apunta a:
  - `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
  - `window.PUNTO_CLUB_COMPANY_ID = "1"`
  - `window.PUNTO_CLUB_USE_MOCK_API = false`
- Verificado CORS con Node desde `Origin: http://127.0.0.1:4175`:
  - `GET /api/companies/1/customers?search=QA`: `200`
  - `Access-Control-Allow-Origin: http://127.0.0.1:4175`
- Levantado frontend local con `python -m http.server 4175 --bind 127.0.0.1`.
- Verificado en Browser contra API estable:
  - UI carga con fuente `API real`.
  - busqueda/listado inicial carga clientes reales.
  - registro de cliente real exitoso.
  - busqueda por telefono del cliente creado exitosa.
  - duplicado por telefono muestra error operativo.
  - campos requeridos muestran errores por campo.
  - consola sin errores criticos.
  - desktop 1280x800 sin overflow horizontal.
  - mobile 390x780 sin overflow horizontal.
- Servidor frontend local detenido al terminar.

Resultado:
- Aprobado para el alcance de TASK-037.
- La UI de clientes funciona en navegador contra la API estable con CORS habilitado.
- Cliente creado desde UI durante validacion:
  - nombre: `Task 037 Cliente 4637`
  - telefono: `+50696174637`
  - email: `task037-1780496174637@example.com`
- Estados/errores validados:
  - listado con datos reales.
  - confirmacion de registro: `Cliente registrado: Task 037 Cliente 4637.`
  - duplicado: `Ya existe un cliente con ese telefono o email. Busquelo antes de registrar.`
  - campos requeridos: nombre y telefono muestran error por campo.

Riesgos o pendientes:
- CORS actualmente permite origenes locales de prueba (`127.0.0.1:4173` y `127.0.0.1:4175`). Antes de production debe reemplazarse por el origen real de Static Web Apps o same-origin.
- `GET /settings` sigue fuera del alcance de esta tarea y ya fue reportado como pendiente en handoffs previos.
- No se implementaron compras/redenciones, no se creo Static Web Apps y no se guardaron secretos.

Siguiente recomendado:
- QA puede ejecutar TASK-038 como smoke UI/API despues de CORS.
- Product / Architect / Release puede marcar TASK-037 como aprobado y mantener pendiente la decision de origen production para CORS.
