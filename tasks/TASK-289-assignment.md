# TASK-289 - Reconciliar cambios parciales Web antes de Atender cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 28.5
Depende de: TASK-280, TASK-281, TASK-282, TASK-283
Estado: Assigned

## Objetivo

Revisar y reconciliar los cambios locales parciales que quedaron despues de detener la ejecucion de las tareas reemplazadas TASK-282/TASK-283, antes de implementar `Atender cliente`.

## Contexto

TASK-280 fue publicada y TASK-281 fue aprobada con observaciones.

Luego se inicio una direccion anterior para hacer `Membresias` similar a `Puntos`:

- TASK-282
- TASK-283

Esa direccion fue reemplazada por `Atender cliente` / Cliente Primero. Sin embargo, quedaron cambios locales en Web sin handoff ni QA.

Archivos con cambios locales detectados:

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

No asumir que esos cambios estan correctos ni publicados.

## Alcance

1. Leer:
   - `tasks/TASK-280-HANDOFF.md`
   - `tasks/TASK-281-HANDOFF.md`
   - `tasks/TASK-282-assignment.md`
   - `tasks/TASK-283-assignment.md`
   - `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
2. Revisar `git status` y `git diff` de Web.
3. Clasificar cambios locales:
   - utiles para `Atender cliente`;
   - incompatibles con `Atender cliente`;
   - dudosos o incompletos.
4. No publicar.
5. No continuar implementando `Atender cliente` en esta tarea.
6. Dejar el repo en un estado entendible para TASK-287:
   - si se conserva codigo parcial, documentar por que;
   - si se revierte codigo parcial, hacerlo solo sobre cambios propios de TASK-282/TASK-283 y documentarlo;
   - no revertir cambios ajenos sin justificacion.

## Reglas

- TASK-282/TASK-283 estan `Superseded`.
- La direccion vigente es `Atender cliente`.
- No hacer deploy.
- No cambiar API/SQL.
- No borrar tareas ni handoffs.
- No usar `git reset --hard`.

## Validaciones minimas

- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Confirmar que no hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Entregar resumen claro para TASK-287.

## Handoff esperado

Actualizar `tasks/TASK-289-HANDOFF.md` con:

- Resultado.
- Cambios locales encontrados.
- Que se conserva.
- Que se descarta/revierte, si aplica.
- Estado final de archivos Web.
- Recomendacion exacta para TASK-287.
