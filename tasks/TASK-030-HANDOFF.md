Equipo:
Web Dev

Tarea completada:
TASK-030 - Revalidar UI contra API real con ambiente repetible.

Archivos cambiados:
- `tasks/TASK-030-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-030.md`.
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-028-HANDOFF.md`.
- Leido `tasks/TASK-029-HANDOFF.md`.
- Confirmado que TASK-029 no dejo P0/P1 abiertos para endpoints de clientes.
- Creada regla temporal Azure SQL `AllowTask030ValidationTemp` para IP publica local `200.229.6.103`.
- Levantado Backend/API local con `node scripts/local-api-server.js` en `http://localhost:7071/api`.
- Levantado frontend local con `python -m http.server 4173 --bind 127.0.0.1`.
- Ejecutado `npm run smoke` contra `http://localhost:7071/api`: exitoso.
- Verificado en Browser contra API real:
  - UI carga con fuente `API real`.
  - `window.PUNTO_CLUB_API_BASE_URL` apunta a `http://localhost:7071`.
  - `window.PUNTO_CLUB_COMPANY_ID = "1"`.
  - busqueda/listado carga clientes reales.
  - registro de cliente real exitoso.
  - busqueda por telefono del cliente creado exitosa.
  - duplicado por telefono muestra error operativo.
  - campos requeridos muestran errores por campo.
  - consola sin errores criticos.
  - desktop 1280x800 sin overflow horizontal.
  - mobile 390x780 sin overflow horizontal.
- Detenidos servidores locales.
- Eliminada regla temporal Azure SQL `AllowTask030ValidationTemp`.
- Confirmado firewall final: solo queda `AllowAllWindowsAzureIps`.

Resultado:
- Aprobado para el alcance de TASK-030.
- La UI de busqueda/listado y registro de cliente funciona contra API real disponible.
- Cliente creado desde UI durante la validacion:
  - nombre: `Task 030 Cliente 0034`
  - telefono: `+50636950034`
  - email: `task030-1780436950034@example.com`
- La API real respondio correctamente:
  - smoke test exitoso con `customerId = "8"`.
  - duplicado directo por API devolvio `409 DUPLICATE_CUSTOMER`.
  - duplicado desde UI mostro `Ya existe un cliente con ese telefono o email. Busquelo antes de registrar.`
  - validacion de campos vacios mostro errores para nombre y telefono.

Riesgos o pendientes:
- La validacion local sigue dependiendo de abrir/cerrar una regla temporal de firewall por IP local.
- Para una validacion compartible y estable entre equipos, conviene desplegar Azure Functions con app settings seguros.
- TASK-029 mantiene observaciones P2 sobre `createdAt` de redencion e ids BigInt como string; no bloquean el flujo de clientes validado por Web Dev.
- No se implementaron compras/redenciones y no se cambiaron contratos API.
- No se guardaron secretos ni se imprimio `SQL_CONNECTION_STRING`.

Siguiente recomendado:
- Product / Architect / Release puede marcar TASK-030 como aprobado.
- Backend/API o Infra deberia priorizar una URL Azure Functions estable para evitar depender de firewall temporal local en las siguientes validaciones.
