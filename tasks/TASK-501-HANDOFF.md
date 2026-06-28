Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Tarea: TASK-501 - Clasificar stash y rama de resguardo post-reconciliacion
Resultado: completada como auditoria / recomendacion

Inventario stash:
- Stash revisado: `stash@{0}`.
- Hash observado: `7e80c01f2236864ff34d51741308c562ccca4fb5`.
- Mensaje: `On main: TASK-500 preserve pending work before main reconcile`.
- No se aplico el stash.
- Contenido modificado:
  - `.gitignore`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/OPERATING_STATUS.md`
  - `docs/TOOLS.md`
  - `package.json`
- Contenido no trackeado relevante:
  - `database/tools/20260626_legacy_import_staging.sql`
  - `database/tools/legacy_import_batch_report.sql`
  - `database/tools/legacy_import_invalidate_batch.sql`
  - `database/tools/legacy_import_validate_staging.sql`
  - `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`
  - `docs/AZURE_SQL_BACKUP_RESTORE_REVIEW_CHAT.md`
  - `docs/DATA_MIGRATION_FIRST_REAL_DRY_RUN.md`
  - `docs/DATA_MIGRATION_LEGACY_PLAN.md`
  - `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
  - `tasks/TASK-479*` a `tasks/TASK-499*`
  - `tools/migration/**`
  - logs temporales `.tmp-http-5195.*.log` y `debug.log`

Inventario rama resguardo:
- Rama revisada: `codex/pre-seo-reconcile-main-task500`.
- Punta: `7ab94a6 Publish SEO technical updates`.
- Contiene:
  - `7ab94a6 Publish SEO technical updates`
  - `d777038 chore: consolidate project tasks and tooling`
- `7ab94a6`:
  - Cambios SEO/Web ya reemplazados por `56b2b27 Publish SEO technical updates only` en `origin/main`.
  - No se recomienda restaurarlo ni publicarlo.
- `d777038`:
  - Commit amplio no publicado.
  - Toca API/tests, docs, tareas, tooling local, SQL migration, templates y configs.
  - No se recomienda publicarlo completo sin division/revision.

Clasificacion:
- Tareas/handoffs recientes:
  - `tasks/TASK-479*` a `tasks/TASK-499*`.
  - Recomendacion: restaurar selectivamente primero, porque son trazabilidad del trabajo ya ejecutado.
- Docs operativos recientes:
  - `docs/OPERATING_STATUS.md`, `docs/TOOLS.md`, `docs/DATA_MIGRATION_*`, `docs/AZURE_SQL_BACKUP_RESTORE_*`.
  - Recomendacion: restaurar por grupos; `DATA_MIGRATION_*` junto con herramientas de migracion, `AZURE_SQL_BACKUP_RESTORE_*` como bloque Infra.
- Migracion legacy:
  - `database/tools/**`, `tools/migration/**`, `docs/DATA_MIGRATION_*`, `package.json` si incluye script `migration:dry-run`, `.gitignore` si ignora outputs.
  - Recomendacion: restaurar y commitear como bloque propio, con QA local ya documentada en TASK-480/TASK-485.
- Tooling local:
  - En `d777038`: `package*.json`, `eslint.config.mjs`, `playwright.config.mjs`, `stylelint.config.mjs`, `tests/qa/**`, `tools/check-copy-terms.mjs`, `tools/run-playwright-smoke.mjs`, `tools/serve-static.mjs`, `docs/TOOLS.md`.
  - Recomendacion: no mezclar con migracion ni API; tratar como bloque separado si aun se quiere publicar.
- Cambios API:
  - En `d777038`: `api/src/lib/notifier.js` y tests de invitations/password resets/company registration/membership notifier.
  - Recomendacion: no publicar desde este commit amplio. Requiere tarea Backend/API separada, revision de alcance y QA.
- SQL:
  - En `d777038`: `database/migrations/20260622_memberships_enabled_default.sql`.
  - En stash: `database/tools/**` de staging legacy.
  - Recomendacion: separar migration historica/default memberships de tooling legacy; no aplicar a Azure SQL sin tarea explicita.
- Logs/artefactos generados:
  - `.tmp-http-5195.err.log`
  - `.tmp-http-5195.out.log`
  - `debug.log`
  - `node_modules/`, `playwright-report/`, `test-results/` siguen no trackeados en worktree actual.
  - Recomendacion: no commitear; limpiar/ignorar en tarea de limpieza con aprobacion.

Recomendacion:
- No aplicar `stash@{0}` completo.
- No publicar la rama `codex/pre-seo-reconcile-main-task500`.
- Secuencia recomendada:
  1. Restaurar selectivamente `tasks/TASK-479*` a `tasks/TASK-501*` para recuperar trazabilidad.
  2. Restaurar bloque `docs/AZURE_SQL_BACKUP_RESTORE_*` + TASK-479 si se quiere conservar la evidencia Infra.
  3. Restaurar bloque migracion legacy: `docs/DATA_MIGRATION_*`, `database/tools/**`, `tools/migration/**`, cambios necesarios de `.gitignore`, `package.json` y `docs/TOOLS.md`.
  4. Dejar `d777038` en rama de resguardo hasta decidir si se divide en tareas: API, tooling local, docs/chat-start/templates y SQL.
  5. Limpiar/ignorar artefactos generados (`node_modules`, `playwright-report`, `test-results`, logs) en tarea separada, sin tocar archivos funcionales.

Acciones no ejecutadas:
- No se aplico `stash@{0}`.
- No se borro ningun archivo.
- No se hizo `git clean`.
- No se hizo `git reset`.
- No se hizo push.
- No se hizo deploy.
- No se publico `d777038`.
- No se toco Azure SQL.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se uso GSC, Cloudflare ni DNS.
- No se hizo deploy.
- Solo Git local en modo lectura/inventario.

Riesgos o pendientes:
- El handoff actual `tasks/TASK-501-HANDOFF.md` queda fuera del stash y sin commit.
- Si se aplica el stash completo, volveran logs temporales y muchos archivos de diferentes bloques al worktree.
- Si se publica `d777038` completo, puede disparar workflow API porque contiene `api/**`.
- Si se descarta la rama de resguardo antes de dividir, se puede perder una ruta facil para recuperar `d777038`.

Siguiente recomendado:
- Crear una tarea de recuperacion selectiva:
  - restaurar primero tareas/handoffs y docs de migracion/backup desde `stash@{0}`;
  - no restaurar logs;
  - no aplicar `d777038`;
  - dejar commit separado de trazabilidad/docs/migracion.
- Crear tarea separada posterior para revisar `d777038` y decidir si se divide en API/tooling/docs o se archiva.

Movimiento de tablero sugerido:
- Mover TASK-501 a Done / Needs Review.
