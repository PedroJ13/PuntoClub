# TASK-506 - Commit de handoffs TASK-504 y TASK-505

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release hygiene
Estado: Ready
Prioridad: P1 trazabilidad

## Objetivo

Consolidar en un commit local separado los handoffs de TASK-504 y TASK-505, junto con la asignacion de TASK-505 y este cierre de trazabilidad.

## Contexto

TASK-504 creo el commit local `d510c0c chore: restore legacy migration traceability package`.

TASK-505 reviso `d777038` en modo lectura y recomendo no publicarlo completo.

Despues de ambas tareas quedaron archivos de trazabilidad locales sin commit.

## Alcance

1. Confirmar estado Git local.
2. Stagear solo archivos de trazabilidad:
   - `tasks/TASK-504-HANDOFF.md`
   - `tasks/TASK-505-assignment.md`
   - `tasks/TASK-505-HANDOFF.md`
   - `tasks/TASK-506-assignment.md`
   - `tasks/TASK-506-HANDOFF.md`
3. Crear commit local.
4. No hacer push.
5. No hacer deploy.

## Fuera de alcance

- No publicar `main`.
- No tocar `d777038`.
- No tocar API.
- No tocar Azure SQL.
- No borrar stash ni ramas de resguardo.

## Criterios de aceptacion

- Existe un commit local separado con la trazabilidad de TASK-504/TASK-505/TASK-506.
- El working tree queda limpio o solo con archivos deliberadamente posteriores a TASK-506.
- No hay cambios `api/**`.

## Handoff esperado

Crear o actualizar `tasks/TASK-506-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Commit:
Archivos incluidos:
Verificacion ejecutada:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```
