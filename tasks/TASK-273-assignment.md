# TASK-273 - Web de renovacion y transacciones de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 17
Depende de: TASK-272
Estado: Assigned

## Objetivo

Agregar en la Web el flujo para renovar membresias y ver transacciones de membresia del cliente.

## Contexto

La empresa ya puede activar membresias, registrar usos y ver vencimientos. Falta que desde la operacion se pueda renovar una membresia vencida/proxima a vencer y dejar trazabilidad economica.

## Alcance

1. Revisar handoff de TASK-272.
2. En ficha/operacion del cliente, mostrar accion `Renovar membresia` cuando exista membresia activa o vencida.
3. Solicitar metodo de pago y monto.
4. Mostrar confirmacion inline dentro de la app.
5. Mostrar historial reciente de transacciones de membresia del cliente.
6. Publicar Web en Azure Static Web Apps.

## Reglas de UX MVP

- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.
- Mantener textos simples:
  - `Renovar membresia`
  - `Metodo de pago`
  - `Monto`
  - `Transacciones de membresia`
- Si no hay membresia renovable, no mostrar accion de renovar.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Bundle contiene markers de renovacion/transacciones.
- No hay regresion visible en Operaciones, Membresias, Mi empresa, Reportes ni Login.

## Fuera de alcance

- Redisenar pantalla.
- Pasarela de pago.
- Reporte financiero avanzado.

## Handoff esperado

Actualizar `tasks/TASK-273-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de markers publicados.
- Notas para QA.
