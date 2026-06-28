# TASK-499 - Reconciliar main local despues de release SEO-only

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Ready
Prioridad: P1 higiene release
Depende de: TASK-497, TASK-498

## Objetivo

Resolver la divergencia del `main` local despues del release SEO-only, sin perder commits locales pendientes ni mezclar cambios API/tooling con futuros releases.

## Contexto

Despues de TASK-497:

- `origin/main` apunta a `56b2b27 Publish SEO technical updates only`.
- `main` local conserva commits no publicados:
  - `d777038 chore: consolidate project tasks and tooling`
  - `7ab94a6 Publish SEO technical updates`
- El commit `7ab94a6` ya fue reemplazado en remoto por el commit limpio `56b2b27`.
- Hay muchos archivos no trackeados de tareas/docs/migracion que deben revisarse antes de cualquier push futuro.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `tasks/TASK-497-HANDOFF.md`
- `tasks/TASK-498-HANDOFF.md`

## Alcance

1. Auditar estado Git local:
   - commits ahead/behind;
   - archivos modificados;
   - archivos no trackeados;
   - commits pendientes que tocan `api/**`.
2. Proponer una ruta segura para reconciliar:
   - conservar `d777038` en rama separada;
   - descartar solo el commit SEO duplicado si ya esta cubierto por `56b2b27`;
   - actualizar `main` local a `origin/main`;
   - mantener docs/tareas no trackeadas para commit separado si corresponde.
3. No ejecutar comandos destructivos sin decision explicita.
4. Crear handoff con recomendacion clara.

## Fuera de alcance

- No hacer `git reset --hard` sin aprobacion explicita.
- No borrar archivos.
- No publicar API.
- No hacer deploy.
- No tocar Azure SQL.
- No cambiar DNS/GSC.

## Criterios de aceptacion

- Queda claro que commits estan pendientes y cuales ya fueron reemplazados.
- Queda recomendada una estrategia de reconciliacion.
- No se pierden cambios del usuario ni se borran archivos.
- No se ejecutan acciones destructivas sin aprobacion.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC ni Cloudflare.

Permitido usar Git local y lectura de estado remoto si hace falta.

## Handoff esperado

Crear o actualizar `tasks/TASK-499-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Estado Git:
Commits pendientes:
Riesgo:
Recomendacion:
Accion requerida:
Uso cloud/SQL:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

