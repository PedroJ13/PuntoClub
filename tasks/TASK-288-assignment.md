# TASK-288 - QA Atender cliente cliente primero

Equipo: QA
Round: 30
Depende de: TASK-287
Estado: Assigned

## Objetivo

Validar en Azure que la experiencia operativa principal funciona como `Atender cliente`, con puntos y membresias como acciones de la ficha del cliente.

## Alcance

1. Leer:
   - `tasks/TASK-284-HANDOFF.md`
   - `tasks/TASK-287-HANDOFF.md`
2. Validar Web publicada.
3. Validar menu:
   - `Atender cliente`;
   - `Mi empresa`;
   - `Reportes`;
   - sin `Puntos`/`Membresias` como entradas operativas principales para empresa normal.
4. Validar flujo cliente primero:
   - buscar cliente;
   - sin resultados;
   - registrar cliente nuevo;
   - cliente queda seleccionado;
   - ficha muestra resumen y acciones.
5. Validar acciones:
   - puntos: registrar compra/redimir si puntos habilitado;
   - membresias: pagar/renovar/aplicar beneficio si membresias habilitado.
6. Validar que configuracion de membresias sigue en `Mi empresa`.
7. Validar Reportes sin regresion.

## Validaciones minimas

- No hay P0/P1 visibles.
- No se pierde cliente despues de registrarlo.
- No se mezclan configuraciones dentro de la atencion.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Si falta sesion real, validar por assets/markers y dejar bloqueo parcial para flujos autenticados.

## Handoff esperado

Actualizar `tasks/TASK-288-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Flujos validados.
- Hallazgos P1/P2/P3.
