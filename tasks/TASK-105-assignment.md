# TASK-105 - Revalidar auditoria operativa publicada

## Equipo

QA

## Contexto

TASK-101 no aprobo porque la auditoria no estaba publicada ni disponible por API. Esta tarea reintenta la validacion despues de:

- migracion SQL aplicada;
- endpoint de lectura desplegado;
- frontend con UI de auditoria desplegado.

## Objetivo

Validar en ambiente publicado que la auditoria registra y permite consultar eventos operativos criticos sin romper Caja ni Reporte.

## Alcance

- Confirmar frontend publicado con `API real`.
- Confirmar UI `Auditoria` o `Auditoria operativa`.
- Confirmar endpoint:

```text
GET /api/companies/1/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=25
```

- Crear datos minimos de QA si hace falta:
  - cliente;
  - compra;
  - redencion.
- Confirmar eventos esperados:
  - `customer.created`;
  - `purchase.registered`;
  - `redemption.registered`.
- Validar al menos un rechazo auditado si es seguro:
  - cliente duplicado;
  - factura duplicada;
  - saldo insuficiente.
- Validar filtros/rango/limit.
- Validar estado vacio.
- Validar Caja sigue operativa.
- Validar Reporte sigue operativo.
- Validar desktop/mobile sin overflow.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar secretos.
- Crear solo datos QA minimos y documentarlos.

## Dependencias

- TASK-102 completada.
- TASK-103 completada y desplegada.
- TASK-104 completada y desplegada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-105-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, endpoint probado, eventos esperados/observados, datos QA creados y hallazgos P0/P1/P2/P3.
