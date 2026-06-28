Equipo: QA
Tarea validada: TASK-483 - QA local del paquete de migracion legacy
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; Node/npm local; dry-run ejecutado con fixtures sinteticos y salidas en `%TEMP%\puntoclub-task483`; sin Azure, sin Azure SQL, sin API real, sin datos reales.
Resultado: no aprobado local

Checks ejecutados:
- Lectura de contexto requerido: `AGENTS.md`, `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/QA.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/README.md`, `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `docs/DATA_MIGRATION_LEGACY_PLAN.md`, `docs/TOOLS.md`, `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`, `tools/migration/README.md`, `tasks/TASK-480-HANDOFF.md`, `tasks/TASK-481-HANDOFF.md`, `tasks/TASK-482-HANDOFF.md`, `tasks/TASK-483-assignment.md`.
- `node --check tools/migration/dry-run-legacy-import.mjs`: OK.
- Dry-run sintetico clientes + historico correcto: OK.
- Dry-run sintetico clientes + saldo compactado: OK.
- Dry-run sintetico cliente duplicado: falla controlada esperada.
- Dry-run sintetico movimiento sin cliente: falla controlada esperada.
- Dry-run sintetico fecha invalida/futura: falla controlada esperada.
- Dry-run sintetico columnas faltantes: falla controlada esperada.
- Dry-run sintetico tipo de movimiento desconocido: falla controlada esperada.
- Dry-run adicional de tipo `redemption` definido en `docs/DATA_MIGRATION_LEGACY_PLAN.md`: falla como `INVALID_MOVEMENT_TYPE`.
- Dry-run adicional de tipos `legacy_balance_import` y `legacy_balance_reconciliation` definidos en `docs/DATA_MIGRATION_LEGACY_PLAN.md`: fallan como `INVALID_MOVEMENT_TYPE`.
- Dry-run adicional `.xlsx`: falla con mensaje `XLSX_UNSUPPORTED_WITHOUT_PARSER`, pero con stack trace de Node.
- `npm run lint`: OK.
- `npm run format:check`: OK.
- `git diff --check -- database/tools docs/DATA_MIGRATION_LEGACY_PLAN.md docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md docs/TOOLS.md tools/migration package.json .gitignore`: OK; solo avisos LF/CRLF del entorno.
- Revision de `.gitignore`: `tools/migration/output/`, `.tmp/`, `node_modules/`, `playwright-report/` y `test-results/` estan ignorados.
- Barrido de archivos sensibles en `tools/migration`, `database/tools` y `docs`: no se encontraron `.xlsx/.xls` reales, `.env`, `local.settings.json`, llaves, certificados ni archivos de secretos.
- Barrido de SQL destructivo/productivo: sin escrituras directas contra `dbo.Customers`, `dbo.Purchases`, `dbo.Redemptions` o `dbo.Companies`; sin `DROP TABLE`/`TRUNCATE TABLE` sobre tablas operativas principales.

P0/P1:
- P1 abierto: el contrato documental y la herramienta no usan los mismos tipos de movimiento. `docs/DATA_MIGRATION_LEGACY_PLAN.md` define como soportados `redemption`, `legacy_balance_import` y `legacy_balance_reconciliation`, pero `tools/migration/dry-run-legacy-import.mjs` solo acepta `redeem`, `balance_snapshot`, `purchase`, `points_adjustment_positive` y `points_adjustment_negative`. Un archivo real preparado segun el plan queda rechazado por `INVALID_MOVEMENT_TYPE`, lo que bloquea aprobar el paquete para dry-run real futuro sin correccion o decision explicita de mapeo.

P2/P3:
- P2: `.xlsx` no se procesa nativamente. La herramienta lo rechaza con mensaje claro y workaround documentado de convertir a CSV, pero el objetivo de TASK-483 menciona Excel/CSV; si el proveedor entrega Excel, se requiere conversion previa o tarea separada para parser aprobado.
- P3: el rechazo `.xlsx` muestra stack trace de Node ademas del mensaje `XLSX_UNSUPPORTED_WITHOUT_PARSER`; para Product/PO seria mas limpio mostrar solo error controlado y ruta de accion.

Evidencia:
- Caso feliz historico:
  - comando: `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/happy-movements.csv --scenario full_history --source-system synthetic --out %TEMP%\puntoclub-task483\happy`
  - resultado: `exit=0`, `customers=2/2`, `movements=3/3`, `errors=0`, `warnings=0`.
- Saldo compactado:
  - resultado: `exit=0`, `customers=2/2`, `movements=0/0`, `errors=0`, `warnings=0`.
- Cliente duplicado:
  - resultado: `exit=1`, `customers=2/3`, `errors=1`, `warnings=1`.
  - mensajes: `DUPLICATE_LEGACY_CUSTOMER_ID`, `DUPLICATE_PHONE`.
- Movimiento sin cliente:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/1`, `errors=1`.
  - mensaje: `MOVEMENT_WITHOUT_CUSTOMER`.
- Fecha invalida/futura:
  - resultado: `exit=1`, `customers=2/2`, `movements=1/2`, `errors=1`, `warnings=1`.
  - mensajes: `INVALID_TRANSACTION_DATE`, `FUTURE_TRANSACTION_DATE`.
- Columnas faltantes:
  - resultado: `exit=1`, `customers=0/1`, `errors=2`.
  - mensajes: `MISSING_REQUIRED_HEADER`, `MISSING_CUSTOMER_NAME`.
- Tipo desconocido:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/1`, `errors=1`.
  - mensaje: `INVALID_MOVEMENT_TYPE`.
- Tipo `redemption` segun plan:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/1`, `errors=1`.
  - mensaje: `INVALID_MOVEMENT_TYPE`.
- Tipos `legacy_balance_import` y `legacy_balance_reconciliation` segun plan:
  - resultado: `exit=1`, `customers=2/2`, `movements=0/2`, `errors=3`.
  - mensajes: dos `INVALID_MOVEMENT_TYPE` y `NEGATIVE_POINTS_FOR_TYPE`.
- Reportes generados:
  - `summary.md` incluye batch, source system, scenario, tabla de conteos, errores/warnings y mensajes por archivo/fila.
  - `summary.json`, `validation-messages.jsonl`, `staging-customers.jsonl`, `staging-movements.jsonl` se generan en `%TEMP%`, no en el repo.
- Seguridad local:
  - fixtures revisados contienen datos sinteticos (`example.com`, telefonos/nombres de prueba).
  - `git status --short -- tasks/TASK-483-HANDOFF.md tools/migration/output .tmp` no mostro outputs de migracion generados dentro del repo antes de crear este handoff.

Limitaciones:
- No se ejecuto ningun SQL contra motor real por alcance de QA local y prohibicion de usar Azure SQL/productiva.
- No se probaron archivos reales ni formatos del proveedor legacy.
- No se aprobo importacion final a produccion.
- La validacion SQL fue estatica, no runtime.
- El repo ya tenia cambios/no trackeados previos no relacionados; QA no los revirtio.

Uso cloud/SQL: No. No se uso Azure, Azure SQL, SQL local real, API real, servicios externos, correos ni datos reales.

Siguiente recomendado:
- Devolver a Ejecucion Tecnica para alinear el contrato de tipos de movimiento entre `docs/DATA_MIGRATION_LEGACY_PLAN.md`, `tools/migration/README.md`, fixtures y `tools/migration/dry-run-legacy-import.mjs`.
- Decidir explicitamente si el vocabulario canonico sera `redemption`/`legacy_balance_*` o `redeem`/`balance_snapshot`, y documentar alias si se quieren aceptar ambos.
- Despues de corregir el P1, reejecutar TASK-483 con los mismos casos sinteticos antes de usar archivos reales.

Movimiento de tablero sugerido:
- Mover `TASK-483` a `Needs Review` como no aprobado local / requiere correccion tecnica antes de dry-run real.
