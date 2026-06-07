# TASK-096 - Revalidar reporte operativo publicado despues del deploy

## Equipo

QA

## Contexto

TASK-095 no aprobo porque el reporte operativo aun no estaba publicado:

- API estable respondia `404` para `/reports/activity`.
- Frontend publicado no contenia `Reporte`, `reports/activity` ni export CSV.

Backend/API completo TASK-093 localmente y Web Dev completo TASK-094 localmente. Esta tarea debe ejecutarse despues de que el commit con esos cambios haya pasado por los workflows de deploy de API y Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Revalidar que el reporte operativo publicado permite consultar actividad por rango de fechas y exportar CSV sin romper el flujo operativo ya validado.

## Alcance

- Confirmar que la API publicada responde `200` para:

```text
GET /api/companies/1/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all
```

- Confirmar validaciones API:
  - `from` y `to` requeridos;
  - formato `YYYY-MM-DD`;
  - `from <= to`;
  - rango maximo 31 dias;
  - `type` solo `all`, `purchase`, `redemption`.
- Confirmar que frontend publicado carga con `API real`.
- Confirmar que el flujo de caja existente sigue disponible.
- Confirmar que existe acceso a `Reporte` o `Actividad`.
- Consultar reporte por rango con datos existentes.
- Confirmar resumen:
  - compras;
  - monto total;
  - puntos ganados;
  - redenciones;
  - puntos redimidos;
  - clientes activos.
- Confirmar detalle de compras/redenciones:
  - fecha;
  - tipo;
  - cliente;
  - detalle;
  - puntos.
- Probar filtro por tipo:
  - todas;
  - compras;
  - redenciones.
- Probar rango sin datos.
- Exportar CSV y revisar columnas/contenido.
- Validar desktop/mobile sin overflow horizontal.

## Criterio de aprobacion

- Sin P0/P1.
- Endpoint publicado no devuelve `404`.
- UI publicada permite consultar y exportar.
- Caja cliente + compra + redencion sigue operativa.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar secretos.
- No crear datos excesivos; si necesitas datos de prueba, usa pocos y documentalos.

## Dependencias

- Commit/deploy de TASK-093 en Azure Functions.
- Commit/deploy de TASK-094 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-096-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1/P2/P3, evidencia API, evidencia UI, evidencia CSV y cualquier dato real de QA creado.
