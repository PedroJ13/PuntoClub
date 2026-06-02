Equipo:
Web Dev

Tarea completada:
TASK-018 - Revalidar UI contra API real.

Archivos cambiados:
- `tasks/TASK-018-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-018.md`.
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-017-HANDOFF.md`.
- Leido `tasks/TASK-013-HANDOFF.md`.
- Leido `tasks/TASK-015-HANDOFF.md`.
- Revisada presencia de ambiente sin imprimir secretos:
  - `SQL_CONNECTION_STRING`: no configurado.
  - `PILOT_COMPANY_ID`: no configurado.
  - `API_BASE_URL`: no configurado.
  - `api/local.settings.json`: no existe.
  - `api/node_modules`: existe.
- Revisado puerto local API esperado:
  - `localhost:7071`: sin proceso escuchando.
- Ejecutado `node --check` en:
  - `app/src/config.js`
  - `app/src/customerApi.js`
- Ejecutado `npm test` en `api/`:
  - dentro del sandbox fallo por `spawn EPERM`,
  - fuera del sandbox pasaron 7/7 tests.
- Levantado frontend local con `python -m http.server 4173 --bind 127.0.0.1`.
- Verificado en Browser:
  - UI carga con fuente `API real`,
  - `window.PUNTO_CLUB_COMPANY_ID` mantiene default `"1"` por configuracion frontend,
  - sin API disponible, muestra error controlado de listado,
  - sin errores criticos de consola,
  - desktop 1280x800 sin overflow horizontal,
  - mobile 390x780 sin overflow horizontal.
- Servidor frontend local detenido al terminar.

Resultado:
- No aprobado para validacion end-to-end contra API real.
- La UI esta lista para API real desde TASK-015, pero TASK-018 no puede cerrar como validada porque no existe API local/Azure accesible contra SQL.
- No se pudo validar contra API real:
  - buscar clientes,
  - registrar cliente,
  - error de duplicado desde SQL,
  - errores de validacion desde endpoint real.
- Si se pudo validar:
  - configuracion frontend no editable con companyId default `"1"`,
  - fuente `API real` por defecto,
  - error controlado cuando API falla/no esta disponible,
  - responsive basico desktop/mobile.

Riesgos o pendientes:
- TASK-017 declara que la ejecucion contra Azure SQL existente sigue bloqueada por falta de conexion segura configurada.
- TASK-013 mantiene P1 bloqueante: sin ambiente SQL/API real, QA no aprueba saldos, duplicados ni separacion por empresa.
- La UI mostrara error de listado mientras no exista API accesible en mismo origen o mientras `window.PUNTO_CLUB_API_BASE_URL` no apunte a una API disponible.
- No se guardaron secretos ni se creo `local.settings.json`.
- No se implementaron compras/redenciones ni se cambiaron contratos API.

Siguiente recomendado:
- Infra/Backend debe configurar de forma segura `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1`, aplicar schema/seed en `sqlserver-pj13-brazil/sql-db-puntoclub`, levantar API y entregar URL/comandos sin secretos.
- QA debe repetir TASK-013 y confirmar que no hay P0/P1 en endpoints de clientes.
- Luego Web Dev puede repetir TASK-018 y validar busqueda, registro, duplicado y validacion contra API real.
