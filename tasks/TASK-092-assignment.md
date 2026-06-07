# TASK-092 - Disenar consultas SQL para reporte operativo

## Equipo

SQL DEV

## Contexto

El flujo operativo de clientes ya fue validado. La siguiente fase de programacion sera reporte operativo basico para revisar actividad por fechas y exportar datos simples.

La base existente sigue siendo:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Proponer las consultas SQL seguras y eficientes para un reporte operativo por empresa y rango de fechas.

## Alcance

Definir consultas para:

- resumen por rango:
  - cantidad de compras;
  - monto total vendido;
  - puntos ganados;
  - cantidad de redenciones;
  - puntos redimidos;
  - clientes con actividad;
- detalle combinado de actividad:
  - compras;
  - redenciones;
  - fecha;
  - cliente;
  - telefono/email;
  - factura/monto si compra;
  - nota si redencion;
  - puntos positivos/negativos;
  - orden descendente por fecha/creacion.
- filtros:
  - `company_id`;
  - fecha desde/hasta;
  - opcional tipo: `purchase`, `redemption`, `all`.

## Requisitos

- No mezclar datos entre empresas.
- No modificar datos.
- Revisar indices existentes y recomendar si hace falta algun indice nuevo.
- Mantener salida compatible con API JSON y CSV.

## No tocar

- No aplicar cambios SQL sin nueva tarea.
- No borrar datos.
- No crear nueva base de datos.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-092-HANDOFF.md
```

Incluye:

- Queries propuestas.
- Recomendacion de indices si aplica.
- Riesgos de performance.
- Recomendacion para Backend/API.
