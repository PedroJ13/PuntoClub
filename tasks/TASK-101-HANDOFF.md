# TASK-101 HANDOFF - QA

## Resultado

No aprobado.

Motivo principal: la auditoria operativa no esta publicada de forma validable. El frontend publicado no contiene la UI de `Auditoria` y el endpoint esperado de lectura `GET /api/companies/1/audit/events` responde `404 Not Found`.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba: `2026-06-07`
- Empresa: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Evidencia publicada

Frontend publicado:

- Renderiza `API real`: si.
- Renderiza Caja: si.
- Renderiza Reporte de actividad: si.
- Renderiza `Auditoria` / `Auditoria operativa`: no.
- Links/botones visibles en header/superficie publicada:
  - `Reporte`
  - `Limpiar`
  - `Buscar`
  - `Vaciar`
  - `Registrar cliente`
  - `Exportar CSV`
  - `Consultar`
- Fuente publicada:
  - `index.html`: no contiene `Auditoria`.
  - `src/app.js`: no contiene `Auditoria` ni `audit`.
  - `src/customerApi.js`: no contiene `audit/events`.

Endpoint esperado de auditoria:

- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=10`
- Resultado: `404 Not Found`

Tambien probe:

- `GET /api/companies/1/audit/events?from=1999-01-01&to=1999-01-01&limit=10`
- `GET /api/companies/1/audit/events?from=2026-06-10&to=2026-06-01&limit=10`
- Ambos respondieron `404 Not Found`.

## Eventos esperados vs observados

Eventos esperados segun TASK-099:

- `customer.created`
- `purchase.registered`
- `redemption.registered`
- `customer.rejected_duplicate`
- `purchase.rejected_duplicate_invoice`
- `redemption.rejected_insufficient_points`

Observado en publicado:

- No fue posible consultar eventos.
- No hay UI publicada de auditoria para ver eventos.
- No hay endpoint publicado de lectura de auditoria en la ruta preparada por TASK-100.

Por esta razon no cree nuevos datos QA para auditoria: crear cliente/compra/redencion no permitiria validar persistencia ni visibilidad de eventos mientras la lectura publicada devuelve `404`.

## Regresion Caja y Reporte

Caja/API sigue operativa:

- `GET /api/companies/1/customers?search=%2B50671492617`
- Resultado: `200`
- Cliente encontrado:
  - `Task 071 Cliente 63492617`
  - `+50671492617`
  - `task071-63492617@example.com`

Reporte operativo sigue operativo:

- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all`
- Resultado: `200`, resumen en cero e `items=0`.

Reporte con datos QA previos:

- `GET /api/companies/1/reports/activity?from=2026-06-06&to=2026-06-06&type=all`
- Resultado: `200`
- Resumen:
  - `purchaseCount`: 14
  - `purchaseAmountTotal`: 22300
  - `pointsEarnedTotal`: 1115
  - `redemptionCount`: 12
  - `pointsRedeemedTotal`: 252
  - `activeCustomerCount`: 11
  - `items`: 26

Responsive publicado:

- Desktop `1280px`: sin overflow horizontal.
- Mobile `390px`: sin overflow horizontal.
- La UI de auditoria no se puede validar en responsive porque no esta publicada.

## Hallazgos

### P1 - Auditoria operativa no validable en publicado

El alcance central de TASK-101 no se puede aprobar porque la UI de auditoria no esta publicada y la API publicada responde `404` para `/audit/events`.

Impacto:

- QA no puede confirmar eventos de operaciones criticas.
- QA no puede confirmar rechazos auditados.
- QA no puede validar rango/ultimos N, estado vacio/error ni responsive de la UI de auditoria.

Evidencia:

- Frontend publicado sin `Auditoria`.
- `GET /api/companies/1/audit/events?...` -> `404`.

## P2/P3

No registro P2/P3 adicionales. La regresion base de Caja/Reporte publicada responde correctamente.

## Datos QA creados

No cree datos nuevos en esta pasada.

Motivo: el bloqueo es de despliegue/contrato de auditoria. Crear datos nuevos no permitiria validar eventos mientras no exista lectura publicada ni UI publicada.

## Siguiente recomendado

Antes de reintentar TASK-101:

- Aplicar la migracion SQL de auditoria si aun no esta aplicada.
- Exponer y desplegar el endpoint de lectura de auditoria, o confirmar otra ruta/contrato si no sera `/api/companies/{companyId}/audit/events`.
- Desplegar frontend con la seccion `Auditoria operativa`.
- Reejecutar TASK-101 con datos QA minimos para cliente, compra, redencion y rechazos auditados.
