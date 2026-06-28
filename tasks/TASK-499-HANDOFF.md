Equipo: Product / Architect / Release

Modo de ejecucion: Git / Release hygiene

Tarea: TASK-499 - Reconciliar main local despues de release SEO-only

Resultado:
- Completada como auditoria y recomendacion.
- No se ejecutaron comandos destructivos.
- No se cambio `main` local.
- No se crearon ramas, no se hizo reset, no se hizo push y no se borro ningun archivo.

Estado Git:
- `main` local esta divergido de `origin/main`.
- Estado actual: `main...origin/main [ahead 2, behind 1]`.
- Remoto:
  - `origin/main`: `56b2b27 Publish SEO technical updates only`.
- Local pendiente:
  - `main`: `7ab94a6 Publish SEO technical updates`.
  - debajo de ese: `d777038 chore: consolidate project tasks and tooling`.
- Relacion observada:
  - remoto tiene `56b2b27`, commit SEO limpio ya publicado.
  - local tiene `7ab94a6`, commit SEO anterior duplicado y reemplazado por `56b2b27`.
  - local tiene `d777038`, commit amplio no publicado que incluye API, docs, tareas y tooling.

Commits pendientes:
- `d777038 chore: consolidate project tasks and tooling`
  - Contiene cambios amplios de proyecto.
  - Toca `api/**`:
    - `api/src/lib/notifier.js`
    - `api/test/company-invitations.test.js`
    - `api/test/company-password-resets.test.js`
    - `api/test/company-registration.test.js`
    - `api/test/membership-notifier.test.js`
  - Tambien toca `AGENTS.md`, `chat-start/**`, `codex-project-templates/**`, `database/migrations/**`, `docs/**`, `tasks/**`, `package*.json`, configs de lint/playwright/stylelint, `tests/qa/**` y `tools/**`.
- `7ab94a6 Publish SEO technical updates`
  - Toca:
    - `app/index.html`
    - `app/src/app.js`
    - `app/staticwebapp.config.json`
    - `app/robots.txt`
    - `app/sitemap.xml`
    - `tools/serve-static.mjs`
  - Este commit ya no debe publicarse como tal porque fue reemplazado por `56b2b27`, que publico solo `app/**` sin tooling local.
- Archivos modificados sin commit:
  - `.gitignore`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/OPERATING_STATUS.md`
  - `docs/TOOLS.md`
  - `package.json`
- Archivos no trackeados relevantes:
  - logs temporales: `.tmp-http-5195.*.log`, `debug.log`.
  - paquete legacy/migracion: `database/tools/**`, `tools/migration/**`, `docs/DATA_MIGRATION_*`, `docs/AZURE_SQL_BACKUP_RESTORE_*`.
  - tareas/handoffs recientes: `tasks/TASK-479*` a `tasks/TASK-499*` segun estado local.

Riesgo:
- Hacer `git push origin main` desde el `main` local actual intentaria publicar `d777038` y `7ab94a6`; eso mezclaria cambios API/tooling/docs con releases futuros.
- Hacer `git reset --hard origin/main` perderia la referencia directa de los commits locales si antes no se conserva una rama o tag.
- El commit `7ab94a6` es redundante y puede causar conflicto/duplicidad con `56b2b27` si se intenta rebasear todo sin seleccionar commits.
- Hay muchos untracked; un clean/delete global seria riesgoso porque contiene handoffs y herramientas de migracion recientes.

Recomendacion:
- Ruta segura en dos pasos, con aprobacion explicita antes de ejecutar:
  1. Preservar el estado actual en una rama local de resguardo:
     - `git branch codex/pre-seo-reconcile-main 7ab94a6`
  2. Reconciliar `main` local con el remoto publicado:
     - cambiar/asegurar `main`;
     - mover `main` a `origin/main` despues de confirmar que la rama de resguardo existe;
     - no publicar `d777038`;
     - no reintroducir `7ab94a6`.
- Despues de eso, procesar por separado:
  - `d777038`: revisar si se debe dividir en PR/tareas por area, porque incluye API, docs, tareas, tooling y SQL.
  - untracked de tareas/docs/migracion: agrupar en commits separados por bloque funcional.
  - logs temporales: confirmar si se pueden ignorar o borrar en una tarea de limpieza separada.

Accion requerida:
- Product / Architect / Release debe aprobar explicitamente una de estas opciones:
  1. Crear rama de resguardo y alinear `main` local a `origin/main`.
  2. Mantener `main` divergido hasta decidir el destino de `d777038`.
  3. Crear una rama/PR separada para revisar `d777038` antes de reconciliar `main`.
- No se recomienda hacer ningun push desde `main` local actual.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se uso GSC, Cloudflare ni DNS.
- No se hizo deploy.
- Se uso solo Git local y referencias remotas ya disponibles localmente.

Siguiente recomendado:
- Aprobar la opcion 1 si el objetivo es dejar el workspace listo para futuros releases desde `main`.
- Luego abrir tarea separada para clasificar y, si corresponde, publicar/archivar `d777038` y los untracked por bloque.

Movimiento de tablero sugerido:
- Mover TASK-499 a Done / Needs Review.
- Crear una decision de Release para ejecutar o no la reconciliacion propuesta.
