Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea: TASK-484 - Alinear tipos de movimiento legacy entre contrato y dry-run

Resultado:

- Corregido el dry-run legacy para aceptar el vocabulario canonico definido en `docs/DATA_MIGRATION_LEGACY_PLAN.md`: `purchase`, `redemption`, `points_adjustment_positive`, `points_adjustment_negative`, `legacy_balance_import` y `legacy_balance_reconciliation`.
- Mantenida compatibilidad con aliases legacy: `redeem` se normaliza a `redemption` y `balance_snapshot` se normaliza a `legacy_balance_import`.
- Los outputs de staging usan el tipo canonico en `type` y conservan el valor original en `source_type_raw`.
- El error de `.xlsx` queda controlado, sin stack trace de Node.
- Agregados fixtures sinteticos especificos para tipos canonicos, aliases y tipo desconocido.

Archivos cambiados:

- `tools/migration/dry-run-legacy-import.mjs`
- `tools/migration/README.md`
- `tools/migration/fixtures/happy-movements.csv`
- `tools/migration/fixtures/movement-types-canonical.csv`
- `tools/migration/fixtures/movement-types-aliases.csv`
- `tools/migration/fixtures/unknown-type-movements.csv`

Verificacion ejecutada:

- `node --check tools/migration/dry-run-legacy-import.mjs`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/movement-types-canonical.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-canonical`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/movement-types-aliases.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-aliases`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/unknown-type-movements.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-unknown`
- Revision de `staging-movements.jsonl` generado por aliases.
- `npm run migration:dry-run -- --customers tools/migration/fixtures/fake.xlsx --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-xlsx`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/happy-movements.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-happy`
- `npm run migration:dry-run -- --compact tools/migration/fixtures/compact-balance.csv --scenario compact_balance --source-system synthetic --out %TEMP%/puntoclub-task484-compact`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/duplicates-customers.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-duplicates`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/movements-without-customer.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-orphan`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/invalid-dates-movements.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-invalid-dates`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/missing-headers-customers.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task484-missing-headers`
- `npx prettier --write tools/migration/dry-run-legacy-import.mjs tools/migration/README.md tasks/TASK-484-HANDOFF.md`
- `npm run lint`
- `npm run format:check`
- `git diff --check`

Evidencia:

- Tipos canonicos: `customers=2/2 movements=6/6 errors=0 warnings=0`.
- Aliases: `customers=2/2 movements=2/2 errors=0 warnings=0`.
- Staging de aliases: `redeem->redemption` y `balance_snapshot->legacy_balance_import`.
- Tipo desconocido: `customers=2/2 movements=0/1 errors=1 warnings=0`, falla controlada con `INVALID_MOVEMENT_TYPE`.
- `.xlsx`: falla controlada con `XLSX_UNSUPPORTED_WITHOUT_PARSER`, sin stack trace.
- Caso feliz historico: `customers=2/2 movements=3/3 errors=0 warnings=0`.
- Saldo compactado: `customers=2/2 movements=0/0 errors=0 warnings=0`.
- Duplicados: `customers=2/3 movements=0/0 errors=1 warnings=1`, falla esperada.
- Movimiento sin cliente: `customers=2/2 movements=0/1 errors=1 warnings=0`, falla esperada.
- Fecha invalida/futura: `customers=2/2 movements=1/2 errors=1 warnings=1`, falla esperada.
- Columnas faltantes: `customers=0/1 movements=0/0 errors=2 warnings=0`, falla esperada.
- Lint, formato y diff check pasan.

Uso cloud/SQL:

- No se uso Azure.
- No se uso Azure SQL.
- No se usaron servicios externos.
- No se cargaron datos reales.

Riesgos o pendientes:

- `.xlsx` sigue sin parser nativo por alcance; se mantiene conversion previa a CSV o tarea separada para aprobar parser.
- No se implementa carga SQL ni endpoint API; el paquete sigue siendo dry-run local.

Siguiente recomendado:

- Ejecutar TASK-485 para QA local de la correccion de tipos legacy.

Movimiento de tablero sugerido:

- Ready for Review.
