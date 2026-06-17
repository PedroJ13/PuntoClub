# TASK-298 - QA ajuste de membresia bajo demanda

Equipo: QA
Round: 39
Depende de: TASK-297
Estado: Assigned

## Objetivo

Validar que el ajuste de membresia en `Atender cliente` queda en el orden esperado: resumen primero, pago/activacion bajo demanda y transacciones solo cuando aportan valor despues del flujo.

## Alcance

1. Leer `tasks/TASK-297-HANDOFF.md`.
2. Validar Web publicada en Azure.
3. Con sesion real de empresa:
   - buscar/seleccionar un cliente sin membresia activa;
   - confirmar que el resumen muestra accion de membresia;
   - presionar `Pagar membresia` / `Activar membresia`;
   - confirmar que aparece el formulario de pago/activacion;
   - confirmar que no aparece una seccion vacia de `Transacciones de membresia` antes de completar el pago/activacion;
   - completar el flujo si hay plan activo disponible y datos seguros para hacerlo;
   - confirmar que luego se actualiza el resumen y se muestra historial/transacciones si aplica.
4. Validar que `Registrar compra` sigue abriendo solo compra bajo demanda.

## Validaciones minimas

- No hay formularios abiertos automaticamente al seleccionar cliente.
- No hay transacciones vacias de membresia como foco inicial para cliente sin membresia.
- El boton de membresia abre el panel correcto.
- Despues del pago/activacion, el resumen refleja el nuevo estado si la operacion se ejecuta.
- No hay regresion visible en `Atender cliente`, `Mi empresa` o `Reportes`.
- No hay `Admin empresas` visible para empresa normal.

## Handoff esperado

Crear o actualizar `tasks/TASK-298-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Hallazgos P0/P1/P2/P3 si aplica.
