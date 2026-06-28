Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea: TASK-482 - Preparar herramienta local de carga Excel/CSV legacy con dry-run

Resultado:

- Preparada herramienta local `migration:dry-run` para validar archivos legacy CSV sin Azure SQL, sin secretos y sin carga productiva.
- Agregadas plantillas CSV para clientes, movimientos y saldo compactado.
- Agregados fixtures sinteticos para caso feliz historico, saldo compactado, duplicados, movimientos sin cliente y fechas invalidas.
- El dry-run normaliza nombre/telefono/correo, valida headers, detecta duplicados, clasifica errores/warnings y genera `summary.json`, `summary.md`, `validation-messages.jsonl`, `staging-customers.jsonl` y `staging-movements.jsonl`.
- `.xlsx` queda detectado con error claro en esta version local; se debe convertir a CSV o aprobar un parser en una tarea posterior.

Archivos cambiados:

- `.gitignore`
- `package.json`
- `docs/TOOLS.md`
- `tools/migration/README.md`
- `tools/migration/dry-run-legacy-import.mjs`
- `tools/migration/templates/customers-template.csv`
- `tools/migration/templates/movements-template.csv`
- `tools/migration/templates/compact-balance-template.csv`
- `tools/migration/fixtures/happy-customers.csv`
- `tools/migration/fixtures/happy-movements.csv`
- `tools/migration/fixtures/compact-balance.csv`
- `tools/migration/fixtures/duplicates-customers.csv`
- `tools/migration/fixtures/movements-without-customer.csv`
- `tools/migration/fixtures/invalid-dates-movements.csv`
- `tools/migration/fixtures/missing-headers-customers.csv`

Verificacion ejecutada:

- `node --check tools/migration/dry-run-legacy-import.mjs`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/happy-movements.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task482-happy`
- `npm run migration:dry-run -- --compact tools/migration/fixtures/compact-balance.csv --scenario compact_balance --source-system synthetic --out %TEMP%/puntoclub-task482-compact`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/duplicates-customers.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task482-duplicates`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/movements-without-customer.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task482-orphan`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/invalid-dates-movements.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task482-invalid-dates`
- `npm run migration:dry-run -- --customers tools/migration/fixtures/missing-headers-customers.csv --scenario full_history --source-system synthetic --out %TEMP%/puntoclub-task482-missing-headers`
- `npx prettier --write package.json docs/TOOLS.md tools/migration/README.md tools/migration/dry-run-legacy-import.mjs`
- `npm run lint`
- `npm run format:check`
- `git diff --check`

Evidencia:

- Caso feliz historico: `customers=2/2 movements=3/3 errors=0 warnings=0`.
- Saldo compactado: `customers=2/2 movements=0/0 errors=0 warnings=0`.
- Duplicados: `customers=2/3 movements=0/0 errors=1 warnings=1`, salida esperada con codigo `1`.
- Movimiento sin cliente: `customers=2/2 movements=0/1 errors=1 warnings=0`, salida esperada con codigo `1`.
- Fechas invalidas/futuras: `customers=2/2 movements=1/2 errors=1 warnings=1`, salida esperada con codigo `1`.
- Columnas faltantes: `customers=0/1 movements=0/0 errors=2 warnings=0`, salida esperada con codigo `1`.
- Lint, formato y diff check pasan.

Uso cloud/SQL:

- No se uso Azure.
- No se uso Azure SQL.
- No se usaron servicios externos.
- No se cargaron datos reales.

Riesgos o pendientes:

- La lectura `.xlsx` no se implemento para evitar dependencias nuevas y mantener la herramienta totalmente local; por ahora se debe convertir a CSV.
- La herramienta genera staging JSONL local, no SQL insertable ni carga automatica.

Siguiente recomendado:

- Revision del handoff por Product / Architect / Release.
- Si se requiere Excel nativo, crear una tarea separada para aprobar dependencia/parser `.xlsx`.

Movimiento de tablero sugerido:

- Ready for Review.
