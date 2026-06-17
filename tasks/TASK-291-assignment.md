# TASK-291 - QA correccion Atender cliente sin cliente seleccionado

Equipo: QA
Round: 32
Depende de: TASK-290
Estado: Assigned

## Objetivo

Revalidar en Azure el P1 de TASK-288: `Atender cliente` no debe mostrar acciones/formularios de membresia antes de seleccionar cliente.

## Alcance

1. Leer:
   - `tasks/TASK-288-HANDOFF.md`
   - `tasks/TASK-290-HANDOFF.md`
2. Validar Web publicada.
3. Validar estado inicial de `Atender cliente`:
   - busqueda visible;
   - resultados visibles;
   - registrar cliente visible;
   - ficha vacia con mensaje;
   - sin formularios/acciones de membresia visibles.
4. Validar menu:
   - `Atender cliente`;
   - `Mi empresa`;
   - `Reportes`;
   - sin `Puntos`/`Membresias` como entradas principales.
5. Validar `Mi empresa`:
   - configuracion de membresias sigue alli.
6. Validar `Reportes`:
   - reportes siguen visibles.

## Validaciones minimas

- P1 de TASK-288 corregido.
- No hay P0/P1 nuevos.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Si no hay sesion real, dejar P2 para flujos autenticados.

## Handoff esperado

Actualizar `tasks/TASK-291-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual.
- Confirmacion del P1 corregido o hallazgo pendiente.
- Hallazgos P1/P2/P3.
