# TASK-096 HANDOFF - QA

## Resultado

Aprobado.

No encontre P0/P1 en la revalidacion publicada. El endpoint de reporte ya esta desplegado, la UI publicada consume API real, permite consultar/exportar, y la caja sigue operativa para cliente existente, compra y canje.

## Alcance validado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de QA usada para datos existentes: `2026-06-06`
- Empresa: `companyId=1`

## Evidencia API

Consulta feliz:

- `GET /api/companies/1/reports/activity?from=2026-06-06&to=2026-06-06&type=all`
- Resultado: `200`
- Resumen post-prueba QA:
  - `purchaseCount`: 14
  - `purchaseAmountTotal`: 22300
  - `pointsEarnedTotal`: 1115
  - `redemptionCount`: 12
  - `pointsRedeemedTotal`: 252
  - `activeCustomerCount`: 11
  - `items`: 26

Validaciones de API:

- `missing_from`: `400`
- `missing_to`: `400`
- `bad_format`: `400`
- `from_after_to`: `400`
- `too_long`: `400`
- `bad_type`: `400`

Filtros API:

- `type=all`: `200`, 24 movimientos antes de crear datos QA minimos.
- `type=purchase`: `200`, 13 compras antes de crear datos QA minimos.
- `type=redemption`: `200`, 11 redenciones antes de crear datos QA minimos.
- Rango vacio `2020-01-01..2020-01-01`: `200`, resumen en cero e `items=0`.

## Evidencia UI publicada

La app publicada muestra:

- `API real`
- acceso `Reporte`
- seccion `Reporte de actividad`
- controles `Fecha desde`, `Fecha hasta`, `Tipo`
- opciones `Todas`, `Compras`, `Redenciones`
- acciones `Consultar` y `Exportar CSV`

Consulta UI para `2026-06-06..2026-06-06`, `type=all`:

- Mensaje: `Reporte cargado: 24 movimientos.`
- Resumen visible:
  - compras: 13
  - monto total: CRC 22200
  - puntos ganados: 1110
  - redenciones: 11
  - puntos redimidos: 251
  - clientes activos: 11
- Tabla con compras y redenciones, incluyendo fecha, tipo, cliente, detalle y puntos.

Filtros UI:

- `purchase`: `Reporte cargado: 13 movimientos.`
- `redemption`: `Reporte cargado: 11 movimientos.`
- rango vacio `2020-01-01..2020-01-01`: sin filas y mensaje de rango sin movimientos.

CSV:

- Export habilitado despues de cargar reporte.
- Header capturado:
  - `"fecha","tipo","cliente","telefono","email","detalle","monto","puntos"`
- Lineas capturadas: 25 antes de datos QA minimos, incluyendo header + 24 movimientos.
- Muestra contenia facturas y datos de cliente reales del reporte.

Responsive:

- Desktop `1280px`: sin overflow horizontal.
- Mobile `390px`: sin overflow horizontal y seccion de reporte visible.

## Caja existente

Cliente existente validado:

- `Task 071 Cliente 63492617`
- telefono: `+50671492617`
- email: `task071-63492617@example.com`

La UI encontro el cliente con busqueda completa `+50671492617` y mostro acciones:

- `Compra`
- `Historial`
- `Redimir`
- formularios/acciones `Confirmar compra` y `Confirmar canje`

Datos QA minimos creados para validar operacion real de caja:

- Compra:
  - factura: `T096-P-71492617-9634`
  - fecha: `2026-06-06`
  - monto: `100`
  - resultado UI: compra registrada y `+5 pts`
- Canje:
  - fecha: `2026-06-06`
  - puntos: `1`
  - nota: `TASK-096 QA canje minimo`
  - resultado UI: canje registrado y balance actualizado

Confirmacion posterior en reporte:

- El reporte paso de 24 a 26 movimientos.
- La factura `T096-P-71492617-9634` aparece en el endpoint de reporte.
- Los totales post-prueba reflejan +1 compra, +100 monto, +5 puntos ganados, +1 redencion y +1 punto redimido.

## Observaciones

- En una primera lectura durante la sesion el endpoint habia respondido `404`, pero al repetir la matriz completa ya respondio `200/400` correctamente. La evidencia final corresponde al estado publicado actual.
- No modifique codigo, configuracion ni Azure.
- Se creo solo este handoff.

## Recomendacion

Listo para continuar el cierre de release de esta funcionalidad. Mantendria este reporte en el smoke publicado porque cubre ruta nueva, validaciones, UI, CSV y caja en una sola pasada de bajo costo.
