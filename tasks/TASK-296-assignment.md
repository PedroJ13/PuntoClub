# TASK-296 - QA cierre autenticado de Atender cliente

Equipo: QA
Round: 37
Depende de: TASK-295
Estado: Assigned

## Objetivo

Cerrar la observacion P2 de `TASK-295` con una validacion autenticada real en Azure.

## Contexto

`TASK-295` aprobo sin P0/P1, pero dejo pendiente validar con sesion real que los botones del resumen de cliente abren el panel correcto bajo demanda.

La Web publicada ya debe mostrar:

- `Atender cliente` como flujo principal.
- Resumen del cliente seleccionado con puntos y estado de membresia.
- Botones de accion visibles solo despues de seleccionar cliente.
- Formularios de compra/membresia ocultos hasta que se presione una accion.

## Alcance

1. Leer:
   - `tasks/TASK-294-HANDOFF.md`
   - `tasks/TASK-295-HANDOFF.md`
2. Iniciar sesion como empresa real de prueba en Azure.
3. En `Atender cliente`, buscar y seleccionar un cliente existente.
4. Validar que la ficha muestra solo resumen y botones principales.
5. Confirmar que no aparece automaticamente:
   - formulario de compra;
   - formulario de membresia/pago;
   - formulario de renovacion;
   - formulario de uso de beneficio.
6. Presionar `Registrar compra` y confirmar que abre solo el formulario de compra.
7. Presionar la accion de membresia correspondiente:
   - si no tiene membresia: `Pagar membresia` / `Activar membresia` abre pago de membresia;
   - si tiene membresia activa con beneficios: `Aplicar beneficio` abre uso de beneficio;
   - si esta vencida o renovable: `Renovar membresia` abre renovacion.
8. Limpiar o cambiar cliente y confirmar que los formularios abiertos se cierran.

## Validaciones minimas

- No hay formularios abiertos automaticamente al seleccionar cliente.
- Cada boton abre el panel esperado.
- Cambiar/limpiar cliente cierra paneles operativos.
- No aparecen opciones de `Membresias` como menu separado.
- No aparece `Admin empresas` para empresa normal.
- No hay regresion visible en `Mi empresa` ni `Reportes`.

## Fuera de alcance

- Cambios de diseno general, colores o estilos visuales.
- Cambios de API/SQL.
- Prueba completa de cobro real.

## Handoff esperado

Actualizar `tasks/TASK-296-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Empresa y cliente usados, sin exponer passwords ni tokens.
- Evidencia de cada boton validado.
- Hallazgos P0/P1/P2/P3 si aplica.
