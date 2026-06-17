# TASK-295 - QA Atender cliente acciones bajo demanda

Equipo: QA
Round: 36
Depende de: TASK-294
Estado: Assigned

## Objetivo

Validar que `Atender cliente` muestra primero resumen y solo abre formularios operativos cuando el usuario presiona una accion.

## Alcance

1. Leer `tasks/TASK-294-HANDOFF.md`.
2. Validar Web publicada.
3. Con sesion real o evidencia segura:
   - buscar/seleccionar cliente;
   - confirmar que la ficha muestra resumen;
   - confirmar que no hay formulario de compra abierto;
   - confirmar que no hay formulario de membresia abierto;
   - presionar `Registrar compra` y validar que abre compra;
   - presionar `Pagar membresia` / `Activar membresia` y validar que abre membresia;
   - cambiar o limpiar cliente y confirmar que se cierran formularios.
4. Sin sesion real, validar markers/DOM y dejar bloqueo parcial para flujo autenticado.

## Validaciones minimas

- No hay formularios abiertos automaticamente al seleccionar cliente.
- Botones de accion abren el panel correcto.
- Cliente sin membresia muestra accion para pagar/activar membresia.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- No hay P0/P1 visibles.

## Handoff esperado

Actualizar `tasks/TASK-295-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Hallazgos P1/P2/P3.
