# TASK-502 - Restaurar selectivamente trazabilidad y paquete legacy desde stash

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Ready
Prioridad: P1 recuperacion selectiva
Depende de: TASK-501

## Objetivo

Restaurar desde `stash@{0}` solo los archivos necesarios de trazabilidad, documentacion backup/restore y paquete de migracion legacy, sin aplicar el stash completo, sin restaurar logs temporales y sin tocar la rama de resguardo `d777038`.

## Contexto

TASK-501 clasifico el contenido preservado por TASK-500. La recomendacion fue recuperar por bloques:

- tareas/handoffs recientes;
- docs backup/restore;
- docs y herramientas de migracion legacy;
- cambios necesarios de `.gitignore`, `package.json` y `docs/TOOLS.md`.

Tambien se recomendo no aplicar `stash@{0}` completo y no publicar la rama `codex/pre-seo-reconcile-main-task500`.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `tasks/TASK-500-HANDOFF.md`
- `tasks/TASK-501-HANDOFF.md`

## Alcance

1. Restaurar selectivamente desde `stash@{0}`:
   - `tasks/TASK-479*` a `tasks/TASK-499*`;
   - `docs/AZURE_SQL_BACKUP_RESTORE_*`;
   - `docs/DATA_MIGRATION_*`;
   - `database/tools/**`;
   - `tools/migration/**`;
   - `.gitignore`, `package.json`, `docs/TOOLS.md` solo si son necesarios para el paquete migracion/tooling.
2. Mantener visibles `tasks/TASK-500*` y `tasks/TASK-501*`.
3. No restaurar logs temporales:
   - `.tmp-http-5195.err.log`;
   - `.tmp-http-5195.out.log`;
   - `debug.log`.
4. No aplicar ni cherry-pickear `d777038`.
5. Revisar estado Git y dejar inventario claro de archivos restaurados.
6. No hacer push ni deploy.

## Fuera de alcance

- No aplicar stash completo.
- No borrar archivos sin aprobacion.
- No publicar `d777038`.
- No tocar API.
- No tocar Azure SQL.
- No hacer deploy.
- No resolver todavia `node_modules/`, `playwright-report/` o `test-results/` salvo documentar que siguen como artefactos locales.

## Criterios de aceptacion

- Los archivos utiles quedan restaurados selectivamente.
- Los logs temporales no quedan restaurados.
- `main` sigue alineado con `origin/main` en commits.
- No se modifica API.
- El handoff explica que se restauro y que quedo pendiente.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Solo Git local y restauracion selectiva de archivos.

## Handoff esperado

Crear o actualizar `tasks/TASK-502-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos restaurados:
Archivos excluidos:
Estado Git:
Verificacion ejecutada:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

