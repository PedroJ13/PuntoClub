Equipo: QA
Tarea validada: TASK-485 - QA local de correccion de tipos legacy
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; Node/npm local; dry-run ejecutado con fixtures sinteticos y salidas en `%TEMP%\puntoclub-task485`; sin Azure, sin Azure SQL, sin API real, sin datos reales.
Resultado: aprobado local con observaciones

Checks ejecutados:
- Lectura de contexto requerido: `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MIGRATION_LEGACY_PLAN.md`, `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`, `docs/TOOLS.md`, `tools/migration/README.md`, `tasks/TASK-483-HANDOFF.md`, `tasks/TASK-484-HANDOFF.md`, `tasks/TASK-485-assignment.md`.
- Revision estatica de `tools/migration/dry-run-legacy-import.mjs`: vocabulario canonico y aliases definidos.
- `node --check tools/migration/dry-run-legacy-import.mjs`: OK.
- Dry-run de tipos canonicos: OK.
- Dry-run de aliases permitidos: OK.
- Revision de `staging-movements.jsonl` para confirmar normalizacion de aliases.
- Dry-run de tipo desconocido: falla controlada esperada.
- Reejecucion de regresion TASK-483: happy path historico, saldo compactado, duplicados, movimiento sin cliente, fecha invalida/futura, columnas faltantes.
- Validacion `.xlsx`: falla controlada con `XLSX_UNSUPPORTED_WITHOUT_PARSER`, sin stack trace de Node.
- `npm run lint`: OK.
- `npm run format:check`: OK.
- `git diff --check -- tools/migration docs/TOOLS.md package.json`: OK; solo avisos LF/CRLF del entorno.
- Revision de `.gitignore`: `tools/migration/output/`, `.tmp/`, `node_modules/`, `playwright-report/` y `test-results/` estan ignorados.
- Barrido focal de archivos sensibles en `tools/migration`: no se encontraron `.xlsx/.xls`, `.env`, `local.settings.json`, llaves/certificados ni secretos.
- Barrido focal de patrones sensibles en `tools/migration`, `docs/TOOLS.md` y `package.json`: sin coincidencias.
- Verificacion de outputs: no quedaron `tools/migration/output/` ni `.tmp/` generados en el repo por QA.

P0/P1:
- No se encontraron P0/P1 abiertos.
- P1 de TASK-483 cerrado: la herramienta acepta los tipos canonicos del plan (`purchase`, `redemption`, `points_adjustment_positive`, `points_adjustment_negative`, `legacy_balance_import`, `legacy_balance_reconciliation`) y mantiene aliases normalizados (`redeem`, `balance_snapshot`).

P2/P3:
- P2 observado, no bloqueante para esta correccion: `.xlsx` sigue sin parser nativo por alcance; la herramienta lo rechaza limpiamente y documenta convertir a CSV o crear tarea posterior para parser aprobado.
- P3 cerrado desde TASK-483: el rechazo `.xlsx` ya no imprime stack trace de Node; muestra solo el error controlado.

Evidencia:
- Tipos canonicos:
  - comando: `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/movement-types-canonical.csv --scenario full_history --source-system synthetic --out %TEMP%\puntoclub-task485\canonical`
  - resultado: `exit=0`, `customers=2/2`, `movements=6/6`, `errors=0`, `warnings=0`.
- Aliases permitidos:
  - resultado: `exit=0`, `customers=2/2`, `movements=2/2`, `errors=0`, `warnings=0`.
  - staging: `source_type_raw="redeem"` queda `type="redemption"`.
  - staging: `source_type_raw="balance_snapshot"` queda `type="legacy_balance_import"`.
- Tipo desconocido:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/1`, `errors=1`, `warnings=0`.
  - mensaje: `INVALID_MOVEMENT_TYPE` con lista de tipos validos: `purchase`, `redemption`, `points_adjustment_positive`, `points_adjustment_negative`, `legacy_balance_import`, `legacy_balance_reconciliation`.
- Regresion happy path historico:
  - resultado: `exit=0`, `customers=2/2`, `movements=3/3`, `errors=0`, `warnings=0`.
- Regresion saldo compactado:
  - resultado: `exit=0`, `customers=2/2`, `movements=0/0`, `errors=0`, `warnings=0`.
- Regresion cliente duplicado:
  - resultado: `exit=1`, `customers=2/3`, `errors=1`, `warnings=1`; mensajes `DUPLICATE_LEGACY_CUSTOMER_ID`, `DUPLICATE_PHONE`.
- Regresion movimiento sin cliente:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/1`, `errors=1`; mensaje `MOVEMENT_WITHOUT_CUSTOMER`.
- Regresion fecha invalida/futura:
  - resultado: `exit=1`, `customers=2/2`, `movements=1/2`, `errors=1`, `warnings=1`; mensajes `INVALID_TRANSACTION_DATE`, `FUTURE_TRANSACTION_DATE`.
- Regresion columnas faltantes:
  - resultado: `exit=1`, `customers=0/1`, `errors=2`; mensajes `MISSING_REQUIRED_HEADER`, `MISSING_CUSTOMER_NAME`.
- `.xlsx`:
  - resultado: `exit=1`.
  - mensaje: `XLSX_UNSUPPORTED_WITHOUT_PARSER: ... Convert to CSV for this dry-run tool or add an approved XLSX parser in a later task.`
  - no se mostro stack trace.

Limitaciones:
- No se ejecuto ningun SQL contra motor real por alcance de QA local y prohibicion de usar Azure SQL/productiva.
- No se probaron archivos reales ni formatos reales del proveedor legacy.
- No se aprobo importacion final a produccion.
- La validacion SQL fue documental/estatica en esta tarea; el foco de TASK-485 fue la correccion de tipos en dry-run.
- `.xlsx` no tiene soporte nativo; requiere conversion previa a CSV o tarea posterior.
- El repo ya tenia cambios/no trackeados previos no relacionados; QA no los revirtio.

Uso cloud/SQL: No. No se uso Azure, Azure SQL, SQL local real, API real, servicios externos, correos ni datos reales.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff y cerrar el P1 de TASK-483.
- El paquete queda apto para un dry-run futuro con archivo real convertido a CSV, siempre fuera del repo y con aprobacion/alcance explicito.
- Si se requiere Excel nativo, crear tarea separada para aprobar parser `.xlsx`.

Movimiento de tablero sugerido:
- Mover `TASK-485` a `Needs Review` para procesamiento por Product / Architect / Release.
