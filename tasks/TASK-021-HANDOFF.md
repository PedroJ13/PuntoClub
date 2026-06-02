Equipo: QA
Tarea completada: TASK-021 - Revalidar SQL/API base contra ambiente real
Archivos cambiados:
- tasks/TASK-021-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-021.md.
- Leido tasks/TASK-019-HANDOFF.md.
- Leido tasks/TASK-020-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/QA_TEST_PLAN.md.
- Leido docs/API_CONTRACTS.md.
- Confirmado que `api/local.settings.json` no existe.
- Confirmado sin exponer secretos:
  - `SQL_CONNECTION_STRING`: no configurado.
  - `PILOT_COMPANY_ID`: no configurado.
  - `API_BASE_URL`: no configurado.
- Ejecutado `npm test` en `api/`; fallo dentro del sandbox por `spawn EPERM` y paso fuera del sandbox con permiso elevado.

Resultado:
- No aprobado.
- TASK-019 completo la parte SQL real: schema/seed aplicados en Azure SQL existente y empresa piloto `id = 1` validada.
- TASK-020 no entrego API real: sigue bloqueada por falta de usuario SQL runtime, `SQL_CONNECTION_STRING`, `PILOT_COMPANY_ID`, Azure Functions Core Tools o URL Azure verificable.
- QA no pudo validar endpoints reales contra Azure SQL porque no existe API local/Azure disponible para ejecutar el checklist.

Checks ejecutados:
- `npm test` en `api/`: 7/7 tests pasados fuera del sandbox.
- Evidencia unitaria cubierta:
  - `409 DUPLICATE_INVOICE`.
  - `409 DUPLICATE_CUSTOMER`.
  - `409 INSUFFICIENT_POINTS`.
  - calculo server-side de puntos.
  - rechazo de `pointsEarned` enviado por frontend.
  - validaciones basicas de cliente y redencion.

Checks no ejecutados:
- Crear cliente contra endpoint real.
- Validar cliente duplicado contra endpoint real.
- Registrar compra contra endpoint real.
- Validar factura duplicada contra endpoint real.
- Consultar saldo real.
- Validar redencion real.
- Confirmar `404 COMPANY_NOT_FOUND`.
- Confirmar `404 CUSTOMER_NOT_FOUND`.
- Confirmar `400 VALIDATION_ERROR`.
- Ejecutar `npm run smoke`, porque no hay `API_BASE_URL` ni API corriendo contra SQL real.

Hallazgos:
- P1: No hay API real disponible para QA, aunque SQL real ya fue preparado.
- P1: Falta crear/configurar usuario SQL runtime con permisos minimos y `SQL_CONNECTION_STRING` como secreto.
- P1: Falta `PILOT_COMPANY_ID=1` configurado en el ambiente que ejecute API.
- P1: TASK-020 no esta completada funcionalmente; por dependencia, TASK-021 no puede aprobarse.

P0/P1:
- P1: Sin API real no se validan saldos, duplicados, redenciones ni errores HTTP contratados.
- P1: Sin smoke test real no se debe liberar integracion Web Dev contra Azure SQL/API.

P2/P3:
- P2: La base SQL puede auto-pausarse; la primera prueba real podria tardar o requerir reintento.
- P2: `AllowAllWindowsAzureIps` queda como riesgo de red amplia documentado por Infra.

Evidencia:
- TASK-019-HANDOFF:
  - `database/schema.sql` aplicado.
  - `database/seed.sql` aplicado.
  - Empresa piloto validada: `id = 1`, `name = Cafe Central`, `points_percentage = 5.00`, `status = active`.
- TASK-020-HANDOFF:
  - API no levantada contra SQL.
  - Smoke test real no ejecutado.
  - `SQL_CONNECTION_STRING`, `PILOT_COMPANY_ID` y `API_BASE_URL` no configurados.
- Revision local:
  - `api/local.settings.json`: no existe.
  - `SQL_CONNECTION_STRING set: False`.
  - `PILOT_COMPANY_ID set: False`.
  - `API_BASE_URL set: False`.
  - `npm test`: 7/7 tests pasados fuera del sandbox.

Riesgos o pendientes:
- Crear usuario SQL de aplicacion con permisos minimos:
  - `db_datareader`.
  - `db_datawriter`.
  - `EXECUTE` sobre `dbo.RegisterRedemption`.
- Configurar `SQL_CONNECTION_STRING` fuera del repo.
- Configurar `PILOT_COMPANY_ID=1`.
- Levantar API local con Azure Functions Core Tools o desplegar/configurar Azure Function.
- Entregar a QA una URL real o `API_BASE_URL` para ejecutar `npm run smoke` y pruebas negativas.
- No guardar secretos en `local.settings.json` versionado, docs, handoffs ni terminal compartida.

Siguiente recomendado:
- Backend/API debe completar TASK-020 funcionalmente: API corriendo contra `sqlserver-pj13-brazil/sql-db-puntoclub`, smoke test real ejecutado y URL/comandos seguros entregados a QA.
- Luego QA debe repetir TASK-021 y ejecutar el checklist real de clientes, compras, saldos, duplicados, redenciones y errores HTTP.
