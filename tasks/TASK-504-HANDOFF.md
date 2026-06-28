Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Tarea: TASK-504 - Commit de restauracion selectiva de trazabilidad y migracion legacy

Resultado:
- Se creo un commit local separado con el paquete restaurado y aprobado por QA en TASK-503.
- `main` queda ahead de `origin/main` por 1 commit local.
- No se hizo push.
- No se hizo deploy.
- No se uso Azure, Azure SQL, GSC, Cloudflare ni servicios externos.
- No se elimino `stash@{0}`.
- No se borro la rama `codex/pre-seo-reconcile-main-task500`.
- No se reviso ni aplico `d777038`.

Commit:
- `d510c0c chore: restore legacy migration traceability package`

Archivos incluidos:
- `.gitignore`
- `package.json`
- `docs/TOOLS.md`
- Documentacion backup/restore:
  - `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`
  - `docs/AZURE_SQL_BACKUP_RESTORE_REVIEW_CHAT.md`
- Documentacion migracion legacy:
  - `docs/DATA_MIGRATION_FIRST_REAL_DRY_RUN.md`
  - `docs/DATA_MIGRATION_LEGACY_PLAN.md`
  - `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- SQL/tooling legacy:
  - `database/tools/20260626_legacy_import_staging.sql`
  - `database/tools/legacy_import_batch_report.sql`
  - `database/tools/legacy_import_invalidate_batch.sql`
  - `database/tools/legacy_import_validate_staging.sql`
  - `tools/migration/README.md`
  - `tools/migration/dry-run-legacy-import.mjs`
  - `tools/migration/fixtures/*.csv`
  - `tools/migration/templates/*.csv`
- Trazabilidad:
  - `tasks/TASK-479*` a `tasks/TASK-504-assignment.md`

Archivos excluidos:
- No se incluyo ningun archivo bajo `api/**`.
- No se incluyo `tools/migration/output/**`.
- No se incluyeron logs temporales:
  - `.tmp-http-5195.err.log`
  - `.tmp-http-5195.out.log`
  - `debug.log`
- No se incluyo `node_modules/`, `playwright-report/` ni `test-results/`.
- `tasks/TASK-505-assignment.md` quedo fuera del commit porque TASK-505 depende de TASK-504.

Verificacion ejecutada:
- `git status --short --branch`
- `git status --short -- api`
- `git diff --check`
- `git diff --cached --name-status`
- `git diff --cached --name-only -- api`
- `git diff --cached --name-only -- tools/migration/output`
- `git show --stat --oneline --name-only --no-renames HEAD`
- `git diff HEAD~1..HEAD --name-only -- api`

Uso cloud/SQL:
- No se uso cloud.
- No se uso Azure SQL.
- No hubo push, deploy ni consultas remotas.

Riesgos o pendientes:
- `main` queda localmente ahead de `origin/main` por el commit `d510c0c`; publicar requiere decision separada.
- `stash@{0}` sigue disponible como respaldo hasta que Product / Architect / Release decida limpiarlo.
- `d777038` sigue preservado en la rama `codex/pre-seo-reconcile-main-task500` y requiere revision separada.
- `tasks/TASK-505-assignment.md` permanece como archivo local no trackeado hasta que se procese o se decida commitearlo.

Siguiente recomendado:
- Ejecutar TASK-505 para clasificar `d777038` sin aplicarlo ni publicarlo.
- No empujar `main` hasta procesar la recomendacion de TASK-505 y decidir el proximo paso de release.

Movimiento de tablero sugerido:
- TASK-504 a Done.
