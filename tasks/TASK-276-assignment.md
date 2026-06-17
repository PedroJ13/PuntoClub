# TASK-276 - Web reporte diario financiero de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 19
Depende de: TASK-275
Estado: Assigned

## Objetivo

Mostrar en Reportes el resumen diario financiero de membresias y permitir exportacion CSV.

## Contexto

La empresa necesita ver rapidamente cuanto se vendio/renovo en membresias y por que metodo de pago.

## Alcance

1. Revisar handoff de TASK-275.
2. En Reportes, agregar seccion o vista de membresias financieras.
3. Mostrar resumen:
   - membresias nuevas;
   - monto nuevas;
   - renovaciones;
   - monto renovaciones;
   - monto por metodo de pago.
4. Mostrar detalle de transacciones.
5. Permitir exportar CSV con el detalle.
6. Publicar Web en Azure Static Web Apps.

## Reglas de UX MVP

- Mantener layout actual de Reportes.
- Usar textos claros:
  - `Reporte diario - Membresias`
  - `Membresias nuevas`
  - `Renovaciones`
  - `Monto por metodo de pago`
- No agregar graficos todavia.
- No usar `window.confirm`, `localStorage` ni `sessionStorage`.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Reporte de membresias aparece en Reportes.
- CSV se mantiene funcional.
- No hay regresion visible en Operaciones, Membresias, Mi empresa, Reportes ni Login.

## Handoff esperado

Actualizar `tasks/TASK-276-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de markers publicados.
- Notas para QA.
