# TASK-316 - QA revalidacion final despues de deploy API

Equipo: QA
Round: 52
Depende de: TASK-315
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Revalidar el estado publicado despues de que el workflow API quede en verde y la DB vuelva a estar activa.

## Contexto

El frontend de UX/copy/iconos ya publico OK en `TASK-313`, pero la validacion final quedo frenada porque el deploy API fallaba por DB pausada.

Esta tarea debe ejecutarse solo despues de `TASK-315` completada con workflow API en success.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-312-HANDOFF.md`
- `tasks/TASK-315-HANDOFF.md`

## Alcance

Validar ambiente publicado:

- API smoke basico publicado.
- Registro de empresa.
- Login/logout.
- Atender cliente.
- Puntos: compra/redencion/historial.
- Membresias y beneficios si hay datos disponibles.
- Mi empresa.
- Reportes.
- Copy/iconos visibles de UX polish.
- Responsive desktop/mobile si el entorno lo permite.

## Validaciones minimas

- `/companies/1/settings` o endpoint equivalente responde sin 500 por DB pausada.
- No quedan textos legacy criticos: `Password`, `Confirmar password`, `Confirmar compra`, `Confirmar canje`, `Confirmar uso`.
- No aparecen `Mock local` / `API real` como textos tecnicos para empresa normal.
- Botones principales tienen icono + texto o equivalente documentado.
- No hay P0/P1 funcional en flujos principales.

## Handoff esperado

Crear o actualizar `tasks/TASK-316-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia por flujo.
- Hallazgos P0/P1/P2/P3.
- Recomendacion de cierre o siguiente round.
