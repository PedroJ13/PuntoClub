# TASK-504 - Commit de restauracion selectiva de trazabilidad y migracion legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Ready
Prioridad: P1 consolidacion local
Depende de: TASK-503

## Objetivo

Crear un commit local separado con el paquete restaurado y aprobado por QA en TASK-503: tareas/handoffs, documentacion backup/restore, documentacion y tooling de migracion legacy, sin incluir cambios API ni artefactos generados.

## Contexto

TASK-502 restauro selectivamente contenido util desde `stash@{0}`. TASK-503 aprobo localmente la restauracion sin P0/P1:

- no hay cambios `api/**`;
- no se restauraron logs temporales;
- no hay staged;
- fixtures de migracion son sinteticos;
- `node --check` y dry-run sintetico pasaron;
- `git diff --check` paso.

Este commit no debe hacer push ni deploy.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `tasks/TASK-502-HANDOFF.md`
- `tasks/TASK-503-HANDOFF.md`

## Alcance

1. Revisar `git status --short`.
2. Confirmar que no hay cambios bajo `api/**`.
3. Excluir artefactos generados:
   - `node_modules/`;
   - `playwright-report/`;
   - `test-results/`;
   - `tools/migration/output/`;
   - logs temporales.
4. Stagear solo:
   - `.gitignore`;
   - `package.json`;
   - `docs/TOOLS.md`;
   - docs backup/restore restaurados;
   - docs migracion legacy;
   - `database/tools/**`;
   - `tools/migration/**` excepto outputs;
   - `tasks/TASK-479*` a `tasks/TASK-504*` que correspondan.
5. Crear commit local con mensaje claro.
6. No hacer push.
7. Crear o actualizar `tasks/TASK-504-HANDOFF.md`.

## Fuera de alcance

- No hacer push.
- No hacer deploy.
- No publicar API.
- No tocar Azure SQL.
- No eliminar `stash@{0}`.
- No borrar la rama `codex/pre-seo-reconcile-main-task500`.
- No revisar ni publicar `d777038`.

## Criterios de aceptacion

- Existe commit local con el paquete restaurado.
- El commit no contiene `api/**`.
- El commit no contiene logs temporales ni outputs generados.
- `main` queda ahead de `origin/main` solo por este commit local.
- El handoff identifica commit y archivos incluidos.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Solo Git local.

## Handoff esperado

Crear o actualizar `tasks/TASK-504-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Commit:
Archivos incluidos:
Archivos excluidos:
Verificacion ejecutada:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

