# TASK-105 HANDOFF - QA

## Resultado

Aprobado.

La auditoria operativa publicada ya registra y permite consultar eventos criticos. Caja y Reporte siguen operativos. No encontre P0/P1 abiertos.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba: `2026-06-07`
- Empresa: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Endpoint probado

Endpoint:

```text
GET /api/companies/1/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=25
```

Resultados:

- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=25` -> `200`, `items=6`
- `GET /api/companies/1/audit/events?from=1999-01-01&to=1999-01-01&limit=25` -> `200`, `items=0`
- `GET /api/companies/1/audit/events?to=2026-06-07&limit=25` -> `400`
- `GET /api/companies/1/audit/events?from=2026-06-08&to=2026-06-07&limit=25` -> `400`
- `GET /api/companies/1/audit/events?from=2026-05-01&to=2026-06-07&limit=25` -> `400`
- `GET /api/companies/1/audit/events?from=2026/06/07&to=2026-06-07&limit=25` -> `400`
- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=20` -> `400`
- `GET /api/companies/999/audit/events?from=2026-06-07&to=2026-06-07&limit=25` -> `404`

Filtros `limit`:

- `limit=10` -> `200`, `limit=10`, `items=6`
- `limit=25` -> `200`, `limit=25`, `items=6`
- `limit=50` -> `200`, `limit=50`, `items=6`

## Datos QA creados

Cliente:

- nombre: `Task 105 Cliente 99928506`
- telefono: `+506199928506`
- email: `task105-99928506@example.com`
- `customerId`: `78`
- resultado: `201`

Compra:

- factura: `T105-P-99928506`
- fecha: `2026-06-07`
- monto: `2000`
- `purchaseId`: `52`
- puntos ganados: `100`
- resultado: `201`

Redencion:

- fecha: `2026-06-07`
- puntos: `25`
- nota: `TASK-105 QA canje 99928506`
- `redemptionId`: `39`
- balance posterior: `75`
- resultado: `201`

Rechazos seguros validados:

- Cliente duplicado con mismo telefono -> `409`
- Factura duplicada con `T105-P-99928506` -> `409`
- Redencion por `999999` puntos -> `409`

## Eventos esperados vs observados

Eventos exitosos esperados y observados:

- `customer.created`
  - `entityType`: `customer`
  - `entityId`: `78`
  - `customerId`: `78`
  - `customerName`: `Task 105 Cliente 99928506`
  - metadata: `{ "emailProvided": true }`
- `purchase.registered`
  - `entityType`: `purchase`
  - `entityId`: `52`
  - `customerId`: `78`
  - metadata: factura `T105-P-99928506`, fecha `2026-06-07`, monto `2000`, puntos `100`
- `redemption.registered`
  - `entityType`: `redemption`
  - `entityId`: `39`
  - `customerId`: `78`
  - metadata: fecha `2026-06-07`, puntos `25`, `balanceAfter=75`

Rechazos esperados y observados:

- `customer.rejected_duplicate`
  - `entityType`: `customer`
  - `entityId`: `null`
  - `customerId`: `null`
  - metadata: `reason=duplicate_customer`
- `purchase.rejected_duplicate_invoice`
  - `entityType`: `purchase`
  - `entityId`: `null`
  - `customerId`: `78`
  - metadata: factura `T105-P-99928506`, fecha `2026-06-07`
- `redemption.rejected_insufficient_points`
  - `entityType`: `redemption`
  - `entityId`: `null`
  - `customerId`: `78`
  - metadata: fecha `2026-06-07`, puntos `999999`

Orden observado:

- `redemption.rejected_insufficient_points`
- `purchase.rejected_duplicate_invoice`
- `customer.rejected_duplicate`
- `redemption.registered`
- `purchase.registered`
- `customer.created`

## UI publicada

Frontend publicado:

- Renderiza `API real`.
- Renderiza link `Auditoria`.
- Renderiza seccion `Auditoria operativa`.
- Estado inicial sin carga automatica:
  - `Consulte un rango de fechas para ver eventos recientes.`

Consulta UI:

- Filtros: `from=2026-06-07`, `to=2026-06-07`, `limit=25`
- Resultado: `Auditoria cargada: 6 eventos.`
- Filas visibles:
  - `Saldo insuficiente`
  - `Factura duplicada`
  - `Cliente duplicado`
  - `Canje registrado`
  - `Compra registrada`
  - `Cliente creado`
- Cliente visible: `Task 105 Cliente 99928506`

Estado vacio:

- Filtros: `1999-01-01..1999-01-01`, `limit=25`
- Resultado: `Sin eventos para el rango seleccionado.`

Validacion local UI:

- Sin `fecha desde` y sin `fecha hasta`
- Resultado: `Seleccione fecha desde y fecha hasta.`

Responsive:

- Desktop `1280px`: sin overflow horizontal.
- Mobile `390px`: sin overflow horizontal.
- Mobile con tabla cargada:
  - `rowCount=6`
  - pagina sin overflow
  - tabla con scroll interno (`wrapClientWidth=336`, `wrapScrollWidth=760`)

## Regresion Caja y Reporte

Caja sigue operativa:

- `GET /api/companies/1/customers?search=%2B506199928506` -> `200`
- Cliente creado encontrado correctamente.

Reporte operativo sigue operativo:

- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all` -> `200`
- Resumen:
  - `purchaseCount`: 1
  - `purchaseAmountTotal`: 2000
  - `pointsEarnedTotal`: 100
  - `redemptionCount`: 1
  - `pointsRedeemedTotal`: 25
  - `activeCustomerCount`: 1
  - `items`: 2
- La factura `T105-P-99928506` aparece en el reporte.

## Hallazgos

### P0/P1

Ninguno.

### P2/P3

Ninguno nuevo observado en esta pasada.

## Notas

- La auditoria inicia desde la migracion de TASK-102; no se espera backfill historico.
- Se crearon datos reales de QA en empresa piloto, documentados arriba.
- No modifique codigo, Azure ni secretos.

## Siguiente recomendado

Mover TASK-105 a revision de Product / Architect / Release y considerar incorporar el endpoint de auditoria en smoke publicado regular.
