Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Tarea: TASK-505 - Revisar destino de d777038 sin publicar API

Resultado:
- Se reviso `d777038 chore: consolidate project tasks and tooling` en modo lectura.
- No se aplico, no se cherry-pickeo y no se publico el commit.
- La recomendacion es no publicar `d777038` completo.
- El commit debe quedar como rama de resguardo hasta dividirlo o descartarlo por bloques.

Inventario d777038:
- Commit revisado:
  - `d777038 chore: consolidate project tasks and tooling`
- Rama que lo conserva:
  - `codex/pre-seo-reconcile-main-task500`
- Tamano observado:
  - 326 archivos cambiados.
  - 23523 inserciones.
  - 86 eliminaciones.
- Archivos/grupos principales:
  - API:
    - `api/src/lib/notifier.js`
    - `api/test/company-invitations.test.js`
    - `api/test/company-password-resets.test.js`
    - `api/test/company-registration.test.js`
    - `api/test/membership-notifier.test.js`
  - SQL:
    - `database/migrations/20260622_memberships_enabled_default.sql`
  - Tooling:
    - `eslint.config.mjs`
    - `package-lock.json`
    - `package.json`
    - `playwright.config.mjs`
    - `stylelint.config.mjs`
    - `tests/qa/public-smoke.spec.js`
    - `tools/check-copy-terms.mjs`
    - `tools/run-playwright-smoke.mjs`
    - `tools/serve-static.mjs`
  - Docs/process:
    - `AGENTS.md`
    - `chat-start/*.md`
    - `codex-project-templates/*.md`
    - `docs/DECISION_LOG.md`
    - `docs/MVP_RELEASE_STATUS.md`
    - `docs/NEXT_PHASE_COPY_TONE_ALIGNMENT.md`
    - `docs/NEXT_PHASE_ICONOGRAPHY_SYSTEM.md`
    - `docs/NEXT_PHASE_VISUAL_IDENTITY_REFRESH.md`
    - `docs/OPERATING_STATUS.md`
    - `docs/PROJECT_OPERATING_RULES.md`
    - `docs/PROYECTO_TOOLING_ADOPTION.md`
    - `docs/PUNTO_CLUB_VISUAL_IDENTITY_GUIDE.md`
    - `docs/README.md`
    - `docs/TOOLS.md`
    - `docs/WORKFLOW_CODEX.md`
  - Tareas/handoffs:
    - `tasks/TASK-326*` a `tasks/TASK-478*`

Clasificacion:
- API:
  - Requiere tarea Backend/API separada.
  - Requiere QA API/local y posiblemente publicacion posterior controlada.
  - No debe entrar en un commit de higiene porque puede disparar workflow API si se empuja.
- SQL:
  - `20260622_memberships_enabled_default.sql` debe tratarse como migracion separada.
  - Requiere SQL DEV y decision explicita antes de tocar Azure SQL.
- Tooling:
  - Puede ser util, pero debe separarse de API/SQL.
  - Requiere revision de dependencias antes de commitear `package-lock.json`.
  - Puede requerir QA local de herramientas.
- Docs/process:
  - Puede recuperarse selectivamente, pero hay riesgo de pisar docs actuales.
  - Debe compararse contra los documentos ya restaurados y contra el estado vigente del proyecto.
- Tareas/handoffs:
  - Es trazabilidad historica amplia.
  - Se puede restaurar por rango si Product / Architect / Release quiere completar archivo historico, pero no mezclado con API/SQL/tooling.

Recomendacion:
- No publicar `d777038` completo.
- No cherry-pickear `d777038` completo.
- Mantener la rama `codex/pre-seo-reconcile-main-task500` como respaldo por ahora.
- Dividir solo si hay necesidad real:
  1. Tarea Product / Architect / Release para decidir si se restaura trazabilidad `TASK-326` a `TASK-478`.
  2. Tarea Product / Architect / Release para comparar docs/process antiguos contra docs actuales y recuperar solo lo vigente.
  3. Tarea Tooling / QA Automation para revisar `eslint`, `playwright`, `stylelint`, scripts y `package-lock.json`.
  4. Tarea SQL DEV para revisar `database/migrations/20260622_memberships_enabled_default.sql` sin aplicarla.
  5. Tarea Backend/API para revisar cambios en `api/src/lib/notifier.js` y tests asociados.
- Si no hay una necesidad funcional o de trazabilidad, archivar `d777038` como rama de resguardo y no moverlo a `main`.

Acciones no ejecutadas:
- No se hizo push.
- No se hizo deploy.
- No se cherry-pickeo `d777038`.
- No se hizo checkout de la rama de resguardo.
- No se aplicaron cambios API.
- No se aplico SQL.
- No se borro la rama `codex/pre-seo-reconcile-main-task500`.
- No se elimino `stash@{0}`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se uso GSC, Cloudflare ni DNS.
- No se usaron servicios externos.
- Solo Git local en modo lectura.

Riesgos o pendientes:
- `d777038` mezcla demasiados dominios para publicarse con seguridad.
- Publicarlo completo podria disparar workflow API porque contiene `api/**`.
- Recuperar docs/process sin comparacion puede reintroducir reglas viejas o duplicadas.
- Recuperar tooling sin revision puede modificar dependencias locales de forma amplia.
- Borrar la rama de resguardo ahora podria perder contexto historico recuperable.

Siguiente recomendado:
- No publicar nada todavia.
- Decidir si se necesita recuperar trazabilidad historica `TASK-326` a `TASK-478`.
- Si se decide recuperar algo de `d777038`, crear tareas pequenas por equipo y por bloque.
- Cuando Product / Architect / Release confirme que ya no se necesita `d777038`, crear una tarea final de limpieza para decidir rama de resguardo y stash.

Movimiento de tablero sugerido:
- TASK-505 a Done / Needs Review.
