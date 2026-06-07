# TASK-095 - Validar reporte operativo publicado

## Equipo

QA

## Contexto

TASK-093/TASK-094 agregan reporte operativo basico por rango de fechas.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Validar que el reporte operativo publicado permite consultar actividad y exportar CSV sin romper el flujo de caja validado.

## Alcance

- Confirmar UI carga con `API real`.
- Confirmar flujo de caja sigue disponible.
- Consultar reporte por rango con datos existentes.
- Confirmar resumen:
  - compras;
  - monto total;
  - puntos ganados;
  - redenciones;
  - puntos redimidos;
  - clientes activos.
- Confirmar detalle de compras/redenciones.
- Probar filtro por tipo.
- Probar rango sin datos.
- Probar validaciones de fecha.
- Exportar CSV y revisar columnas/contenido.
- Validar desktop/mobile sin overflow.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-093 y TASK-094 completadas y desplegadas.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-095-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1/P2/P3 y evidencia resumida.
