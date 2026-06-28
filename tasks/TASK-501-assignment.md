# TASK-501 - Clasificar stash y rama de resguardo post-reconciliacion

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Ready
Prioridad: P1 orden de trabajo local
Depende de: TASK-500

## Objetivo

Clasificar el contenido preservado en `stash@{0}` y en la rama local `codex/pre-seo-reconcile-main-task500`, para decidir que se restaura, que se divide en commits/tareas y que se descarta o limpia con aprobacion.

## Contexto

TASK-500 dejo `main` alineado con `origin/main`, pero preservo trabajo pendiente:

- Rama local: `codex/pre-seo-reconcile-main-task500`.
- Stash local: `stash@{0}` con mensaje `TASK-500 preserve pending work before main reconcile`.

El stash contiene tareas/docs/migracion y algunos logs temporales. La rama conserva `d777038`, que incluye cambios amplios de API/docs/tareas/tooling/SQL y no debe publicarse completo sin revision.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `tasks/TASK-500-HANDOFF.md`

## Alcance

1. Listar contenido de `stash@{0}` sin aplicarlo completo.
2. Listar diferencias de `d777038` y `7ab94a6` desde la rama de resguardo.
3. Separar por grupos:
   - tareas/handoffs;
   - docs operativos;
   - migracion legacy;
   - tooling local;
   - cambios API;
   - logs/artefactos generados.
4. Recomendar que grupos restaurar primero.
5. Recomendar que grupos requieren tarea tecnica o QA propia.
6. No hacer push, deploy ni limpieza destructiva.

## Fuera de alcance

- No aplicar el stash completo.
- No borrar archivos.
- No publicar `d777038`.
- No hacer reset destructivo.
- No tocar Azure SQL.
- No hacer deploy.

## Criterios de aceptacion

- Existe inventario claro de stash y rama de resguardo.
- Queda recomendada una secuencia de recuperacion.
- Queda claro que se puede restaurar sin mezclar API con docs/tareas.
- No se pierden cambios ni se borran archivos.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Solo Git local y lectura de archivos.

## Handoff esperado

Crear o actualizar `tasks/TASK-501-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Inventario stash:
Inventario rama resguardo:
Clasificacion:
Recomendacion:
Acciones no ejecutadas:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

