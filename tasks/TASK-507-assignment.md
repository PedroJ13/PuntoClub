# TASK-507 - Decidir publicacion del paquete local de trazabilidad y migracion legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release decision
Estado: Ready
Prioridad: P1 decision
Depende de: TASK-506

## Objetivo

Decidir si el paquete local de trazabilidad y migracion legacy puede publicarse a `origin/main`, sin publicar `d777038` ni disparar cambios operativos de API/Web.

## Contexto

`main` quedo ahead de `origin/main` por commits locales de trazabilidad:

- `d510c0c chore: restore legacy migration traceability package`
- commit local de TASK-506 con handoffs de release hygiene.

El commit `d777038` fue clasificado en TASK-505 y no debe publicarse completo.

## Alcance

1. Revisar commits ahead de `origin/main`.
2. Revisar filtros de workflows GitHub Actions.
3. Decidir si conviene:
   - publicar ahora;
   - esperar;
   - dividir mas;
   - cancelar publicacion.
4. Crear handoff con decision y siguiente recomendado.

## Fuera de alcance

- No hacer push.
- No hacer deploy.
- No tocar Azure SQL.
- No aplicar `d777038`.
- No borrar stash ni ramas de resguardo.

## Criterios de aceptacion

- Existe una decision clara.
- Queda claro si se espera o no deploy API/Web.
- Queda claro el siguiente paso.

## Handoff esperado

Crear o actualizar `tasks/TASK-507-HANDOFF.md`.
