# TASK-290 - Corregir Atender cliente para ocultar membresias sin cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 31
Depende de: TASK-287, TASK-288
Estado: Assigned

## Objetivo

Corregir el P1 reportado por QA en TASK-288: `Atender cliente` no debe mostrar formularios ni acciones operativas de membresia antes de seleccionar o registrar un cliente.

## Contexto

TASK-287 publico `Atender cliente` como entrada operativa principal. QA en TASK-288 no aprobo porque, sin cliente seleccionado, se ven formularios/acciones de membresias:

- `membership-payment-host`
- `membership-activation-form`
- `membership-benefit-usage-form`
- `membership-operation-panel`

Esto rompe la regla de cliente primero.

## Alcance

1. Leer:
   - `tasks/TASK-284-HANDOFF.md`
   - `tasks/TASK-287-HANDOFF.md`
   - `tasks/TASK-288-HANDOFF.md`
2. Corregir visibilidad en `Atender cliente`.
3. Estado sin cliente seleccionado:
   - mostrar solo busqueda, resultados, registrar cliente y mensaje de ficha vacia;
   - ocultar acciones de puntos que requieran cliente;
   - ocultar acciones/formularios de membresia que requieran cliente.
4. Estado con cliente seleccionado:
   - mostrar ficha;
   - mostrar puntos si habilitado;
   - mostrar membresias si habilitado;
   - mostrar acciones validas.
5. Estado despues de registrar cliente:
   - seleccionar cliente;
   - mostrar ficha;
   - permitir acciones.
6. Publicar Web en Azure Static Web Apps.

## Reglas obligatorias

- No mostrar `Pagar membresia` antes de tener cliente seleccionado.
- No mostrar formulario de activacion de membresia antes de tener cliente seleccionado.
- No mostrar formulario de uso de beneficio antes de tener cliente con membresia/beneficio aplicable.
- No mostrar campos operativos sin contexto valido.
- Mantener `Mi empresa` y `Reportes` sin regresion.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- En estado inicial de `Atender cliente`, no son visibles:
  - `membership-payment-host`
  - `membership-activation-form`
  - `membership-benefit-usage-form`
  - acciones operativas de membresia.
- `Atender cliente`, `Mi empresa`, `Reportes` siguen visibles.
- `Puntos` y `Membresias` no vuelven como entradas principales.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-290-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de visibilidad inicial corregida.
- Riesgos o notas para QA.
