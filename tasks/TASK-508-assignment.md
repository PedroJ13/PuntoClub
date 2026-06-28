# TASK-508 - Push controlado del paquete local de trazabilidad y migracion legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release publish
Estado: Ready
Prioridad: P1 publicacion controlada
Depende de: TASK-507

## Objetivo

Publicar a `origin/main` los commits locales aprobados en TASK-507, confirmando que no contienen cambios `api/**`, `app/**` ni workflows que disparen deploy operativo.

## Alcance

1. Revisar estado local.
2. Confirmar commits ahead.
3. Confirmar que el diff contra `origin/main` no toca `api/`, `app/` ni `.github/workflows/`.
4. Ejecutar push controlado a `origin/main`.
5. Crear handoff con evidencia.

## Fuera de alcance

- No hacer deploy manual.
- No tocar Azure SQL.
- No aplicar `d777038`.
- No borrar `stash@{0}` ni la rama de resguardo.

## Handoff esperado

Crear o actualizar `tasks/TASK-508-HANDOFF.md` con resultado, commits publicados, verificaciones, uso cloud/SQL, riesgos y siguiente recomendado.
