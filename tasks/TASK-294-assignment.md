# TASK-294 - Atender cliente con acciones bajo demanda

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 35
Depende de: TASK-293
Estado: Assigned

## Objetivo

Refinar `Atender cliente` para que la ficha muestre resumen y acciones principales, pero no despliegue formularios operativos hasta que el usuario presione una accion.

## Contexto

Product Owner valido que el resumen de cliente esta bien:

- datos del cliente;
- puntos actuales;
- estado de membresia;
- botones principales.

Pero despues de seleccionar cliente, la pantalla muestra directamente paneles/formularios operativos, por ejemplo:

- formulario de registrar compra;
- formulario de pagar membresia.

Esto genera ruido visual. La ficha debe mostrar primero resumen y acciones; los formularios deben aparecer solo bajo demanda.

## Alcance

1. Leer:
   - `tasks/TASK-292-HANDOFF.md`
   - `tasks/TASK-293-HANDOFF.md`
2. Ajustar `Atender cliente` para que al seleccionar cliente:
   - muestre resumen de cliente;
   - muestre botones de accion;
   - no abra automaticamente `Registrar compra`;
   - no abra automaticamente `Pagar membresia`;
   - no abra automaticamente formularios de uso de beneficio.
3. En el resumen de membresia:
   - si no tiene membresia activa/renovable, mostrar boton `Pagar membresia` o `Activar membresia`;
   - si tiene membresia activa, mostrar acciones validas de beneficio;
   - si esta vencida/renovable, mostrar `Renovar membresia`.
4. Al presionar `Registrar compra`, mostrar el panel/formulario de compra.
5. Al presionar `Pagar membresia` o `Activar membresia`, mostrar el panel/formulario de pago de membresia.
6. Al presionar `Renovar membresia`, mostrar el panel/formulario de renovacion.
7. Al presionar accion de beneficio, mostrar el panel/formulario correspondiente.
8. Publicar Web en Azure Static Web Apps.

## Copy / botones esperados

Resumen:

```text
Registrar compra
Ver historial
Pagar membresia
```

Para cliente sin membresia:

```text
Membresia: Sin activa
```

Con boton:

```text
Pagar membresia
```

Si el equipo decide usar `Activar membresia`, debe mantener consistencia en todo el flujo y documentarlo en handoff.

## Reglas

- No mostrar panel/formulario de compra hasta presionar `Registrar compra`.
- No mostrar panel/formulario de membresia hasta presionar `Pagar membresia` / `Activar membresia` / `Renovar membresia`.
- La ficha debe seguir visible despues de abrir un panel.
- Al cambiar de cliente, cerrar paneles abiertos y volver al resumen.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.

## Fuera de alcance

- Cambiar endpoints.
- Cambiar reglas de negocio.
- Redisenar colores/tipografia.
- Crear nuevos reportes.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Al seleccionar cliente, se muestra resumen sin formularios abiertos.
- `Registrar compra` abre formulario de compra.
- `Pagar membresia` abre formulario de membresia.
- Cambiar/limpiar cliente cierra formularios.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-294-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de resumen sin formularios.
- Evidencia de acciones abriendo paneles.
- Riesgos o notas para QA.
