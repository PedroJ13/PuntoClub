Equipo:
Web Dev

Tarea completada:
TASK-034 - Validar UI contra API estable.

Archivos cambiados:
- `app/app-config.js`
- `tasks/TASK-034-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-034.md`.
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-032-HANDOFF.md`.
- Leido `tasks/TASK-033-HANDOFF.md`.
- Confirmado que TASK-033 no dejo P0/P1 abiertos para endpoints principales de clientes.
- Configurado `app/app-config.js` con API estable sin secretos:
  - `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
  - `window.PUNTO_CLUB_COMPANY_ID = "1"`
  - `window.PUNTO_CLUB_USE_MOCK_API = false`
- Ejecutado `node --check` en:
  - `app/src/config.js`
  - `app/src/customerApi.js`
  - `app/src/app.js`
- Verificada respuesta directa de API estable con Node:
  - `GET /api/companies/1/customers?search=QA`: `200`
  - `POST /api/companies/1/customers`: `201`
  - `OPTIONS /api/companies/1/customers`: `204`
- Verificados headers CORS desde API estable:
  - `Access-Control-Allow-Origin`: ausente en `GET`.
  - `Access-Control-Allow-Origin`: ausente en `POST`.
  - `Access-Control-Allow-Origin`: ausente en `OPTIONS`.
  - `Access-Control-Allow-Methods`: ausente en `OPTIONS`.
- Levantado frontend local en `http://127.0.0.1:4173` y `http://127.0.0.1:4175` para descartar cache.
- Verificado en Browser:
  - UI carga con fuente `API real`.
  - la UI no puede cargar el listado desde la API estable.
  - muestra error controlado de listado.
  - sin errores criticos de consola capturados por Browser.
  - sin overflow horizontal en la carga inicial.
- Servidores frontend locales detenidos al terminar.

Resultado:
- No aprobado para validacion UI contra API estable.
- La API estable esta viva y responde correctamente a llamadas server-side/directas.
- La UI en navegador no puede validar buscar/listar, registrar, duplicado ni errores de campo contra esa URL estable porque Azure Functions no devuelve headers CORS para el origen del frontend.
- Cliente creado por prueba directa de API, no por UI:
  - nombre: `Task 034 Direct 1780493337811`
  - telefono: `+50693337811`
  - email: `task034-direct-1780493337811@example.com`

Riesgos o pendientes:
- Falta configurar CORS en Azure Functions o servir frontend y API desde un mismo origen compatible.
- Sin CORS, la API puede pasar QA por scripts/server-side pero seguir bloqueada para navegador.
- `GET /settings` sigue fuera del alcance de esta tarea y ya fue reportado como P2 en TASK-033.
- No se guardaron secretos, no se creo Static Web Apps, no se implementaron compras/redenciones y no se cambiaron contratos API.

Siguiente recomendado:
- Infra/Backend debe habilitar CORS para el origen de la UI que se usara en pruebas, o definir un despliegue same-origin.
- Luego Web Dev debe repetir TASK-034 y validar busqueda/listado, registro, duplicado y validacion de campos desde el navegador.
