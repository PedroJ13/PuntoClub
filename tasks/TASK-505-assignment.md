# TASK-505 - Revisar destino de d777038 sin publicar API

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Pending TASK-504
Prioridad: P2 decision pendiente
Depende de: TASK-504

## Objetivo

Revisar el commit amplio `d777038 chore: consolidate project tasks and tooling` preservado en la rama `codex/pre-seo-reconcile-main-task500` y decidir si se divide, se archiva o se convierte en tareas separadas.

## Contexto

`d777038` no debe publicarse completo porque mezcla:

- cambios API y tests;
- docs y chat-start;
- tareas/handoffs antiguas;
- tooling local;
- SQL migration;
- templates.

Ademas, al tocar `api/**`, empujarlo a `main` podria disparar workflow API.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `tasks/TASK-500-HANDOFF.md`
- `tasks/TASK-501-HANDOFF.md`
- `tasks/TASK-504-HANDOFF.md`

## Alcance

1. Revisar `git show --name-status d777038`.
2. Separar el contenido por grupos:
   - API;
   - SQL;
   - tooling;
   - docs/process;
   - tareas/handoffs.
3. Recomendar si:
   - se descarta/archiva;
   - se divide en commits;
   - se convierte en tareas por equipo;
   - se deja solo como rama de resguardo.
4. No publicar nada.

## Fuera de alcance

- No hacer push.
- No cherry-pickear `d777038`.
- No tocar API.
- No hacer deploy.
- No tocar Azure SQL.
- No borrar la rama de resguardo.

## Criterios de aceptacion

- Queda una recomendacion clara sobre `d777038`.
- Queda claro que partes requieren ejecucion tecnica o QA.
- No se publica ni aplica el commit.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Solo Git local en modo lectura.

## Handoff esperado

Crear o actualizar `tasks/TASK-505-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Inventario d777038:
Clasificacion:
Recomendacion:
Acciones no ejecutadas:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

