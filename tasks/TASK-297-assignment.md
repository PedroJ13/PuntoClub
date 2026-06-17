# TASK-297 - Ajustar membresia bajo demanda en Atender cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 38
Depende de: TASK-296
Estado: Assigned

## Objetivo

Ajustar la experiencia de `Atender cliente` para que el panel de membresia no muestre informacion secundaria antes de completar o intentar el pago/activacion de membresia.

## Contexto

Product Owner valido que el resumen del cliente esta bien, pero observo que al presionar `Pagar membresia` para un cliente sin membresia activa aparecen elementos que se sienten fuera de secuencia:

- Se muestra el formulario de pago/activacion.
- Tambien aparece `Transacciones de membresia` aunque todavia no existe membresia ni transaccion.
- El flujo deberia sentirse como: primero pagar/activar membresia; luego, si corresponde, mostrar estado/resultado/transacciones.

## Alcance

1. Leer:
   - `tasks/TASK-294-HANDOFF.md`
   - `tasks/TASK-295-HANDOFF.md`
   - `tasks/TASK-296-HANDOFF.md` si existe.
2. Ajustar `Atender cliente` para cliente sin membresia activa:
   - El resumen debe mostrar `Pagar membresia` o `Activar membresia` como accion principal de membresia.
   - Al presionar esa accion, mostrar solo el formulario necesario para pagar/activar membresia.
   - No mostrar `Transacciones de membresia` antes de que exista una membresia/transaccion o antes de que el usuario haya completado una accion.
3. Despues de pagar/activar membresia correctamente:
   - actualizar el resumen del cliente;
   - mostrar estado de membresia activa;
   - si existe historial, mostrar `Transacciones de membresia` como resultado/historial posterior.
4. Para cliente con membresia activa:
   - mantener el acceso a acciones validas de membresia;
   - mostrar transacciones/historial solo como informacion secundaria, no como el primer foco operativo.
5. Mantener `Registrar compra` igual: el formulario de compra solo aparece al presionar `Registrar compra`.

## Criterios de aceptacion

- Seleccionar cliente no abre formularios automaticamente.
- Cliente sin membresia activa ve en el resumen una accion clara para `Pagar membresia` / `Activar membresia`.
- Al abrir pago de membresia, el foco visual es pagar/activar; no se muestra una seccion de transacciones vacia antes de completar el flujo.
- Despues de pago/activacion exitosa, el resumen cambia a membresia activa y se puede consultar/ver transacciones si aplica.
- No se reintroduce menu separado de `Membresias`.
- No aparece `Admin empresas` para empresa normal.
- No usar `window.confirm`, `localStorage` ni `sessionStorage`.

## Fuera de alcance

- Cambios de API/SQL salvo que se detecte bloqueo real y se documente.
- Redisenar colores o estilo general.
- Implementar pagos reales externos.

## Handoff esperado

Crear o actualizar `tasks/TASK-297-HANDOFF.md` con:

- Resultado.
- Archivos tocados.
- Evidencia local y/o publicada.
- Confirmacion de deploy si aplica.
- Riesgos o notas para QA.
