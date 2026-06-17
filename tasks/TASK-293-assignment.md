# TASK-293 - QA seleccion y duplicado en Atender cliente

Equipo: QA
Round: 34
Depende de: TASK-292
Estado: Assigned

## Objetivo

Validar en Azure que `Atender cliente` permite seleccionar un cliente y que el duplicado de registro guia correctamente al usuario.

## Alcance

1. Leer:
   - `tasks/TASK-292-HANDOFF.md`
2. Validar Web publicada.
3. Con sesion real o evidencia segura:
   - buscar cliente existente;
   - presionar `Atender`;
   - confirmar que `Ficha del cliente` muestra datos y acciones;
   - intentar registrar el mismo cliente;
   - confirmar que el mensaje dice que ya estaba registrado y permite continuar.
4. Si no hay sesion real, validar markers/DOM y dejar bloqueo parcial para flujo autenticado.

## Validaciones minimas

- `Atender` no deja ficha vacia.
- Duplicado no muestra mensaje generico.
- Cliente duplicado queda seleccionado si es posible.
- No hay acciones visibles sin cliente seleccionado.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-293-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Confirmacion de duplicado.
- Confirmacion de ficha poblada.
- Hallazgos P1/P2/P3.
