# TASK-094 - Implementar pantalla de reporte operativo

## Equipo

Web Dev

## Contexto

La fase actual agrega reportería operativa básica. Backend/API implementara `GET /reports/activity`.

## Objetivo

Agregar en la UI publicada una vista simple para consultar actividad por rango de fechas y exportar CSV.

## Alcance

- Agregar acceso a `Reporte` o `Actividad` sin romper la pantalla actual de caja.
- Controles:
  - fecha desde;
  - fecha hasta;
  - tipo: todas, compras, redenciones;
  - boton consultar;
  - boton exportar CSV.
- Mostrar resumen:
  - compras;
  - monto total;
  - puntos ganados;
  - redenciones;
  - puntos redimidos;
  - clientes activos.
- Mostrar lista/tablas de movimientos:
  - fecha;
  - tipo;
  - cliente;
  - factura/monto o nota;
  - puntos.
- Exportar CSV desde datos cargados en pantalla.
- Manejar estado vacio y errores.

## Requisitos de UX operativo

- Priorizar funcionalidad y legibilidad.
- No hacer rediseño visual grande.
- No tocar colores/branding salvo minimo necesario.
- Debe funcionar en desktop y mobile sin overflow horizontal.
- No debe cargar reporte automaticamente al abrir si eso puede ser costoso.

## Dependencias

- TASK-093 endpoint disponible localmente o en API estable.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-094-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Evidencia de consulta con datos.
- Evidencia de estado vacio.
- Evidencia de export CSV.
- Evidencia desktop/mobile.
- Pruebas ejecutadas.
