# TASK-283 - QA pantalla Membresias equivalente a Puntos

Equipo: QA
Round: 26
Depende de: TASK-282
Estado: Superseded

## Nota Product / Architect / Release

Esta tarea queda reemplazada por el flujo `Atender cliente` / Cliente Primero.

No ejecutar esta QA salvo nueva instruccion explicita. La validacion de la nueva direccion se hara con las tareas del bloque Cliente Primero.

Referencia nueva:

- `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
- `tasks/TASK-288-assignment.md`

## Objetivo

Validar que la pantalla de `Membresias` quedo con la misma logica visual que `Puntos` y que el flujo de registrar cliente termina naturalmente en pagar membresia.

## Alcance

1. Leer `tasks/TASK-282-HANDOFF.md`.
2. Validar Web publicada con empresa autenticada si hay sesion disponible.
3. Comparar estructura:
   - `Puntos`: buscar, resultados, registrar cliente, operacion de puntos.
   - `Membresias`: buscar, resultados, registrar cliente, operacion de membresias.
4. Validar flujo de cliente nuevo:
   - entrar a `Membresias`;
   - registrar cliente;
   - confirmar que queda seleccionado;
   - confirmar que aparece accion principal `Pagar membresia`.
5. Validar flujo de cliente existente:
   - buscar cliente;
   - seleccionar;
   - ver estado de membresia;
   - confirmar acciones validas:
     - pagar/activar;
     - renovar/pagar;
     - uso de beneficio si tiene membresia activa.
6. Validar boton contextual `Ir a Puntos` cuando aplique.

## Validaciones minimas

- Web publicada carga.
- `Membresias` no mezcla configuracion de planes/beneficios dentro de operacion.
- `Pagar membresia` aparece como accion principal cuando corresponde.
- Registrar cliente desde `Membresias` no deja al usuario perdido.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Si no hay sesion real, validar por assets/markers y dejar bloqueo parcial de flujos autenticados.

## Handoff esperado

Actualizar `tasks/TASK-283-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Flujos validados.
- Hallazgos P1/P2/P3.
