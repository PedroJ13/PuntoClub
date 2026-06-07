# TASK-110 HANDOFF - QA

## Resultado

Aprobado.

La configuracion de empresa piloto publicada permite leer y editar datos operativos, valida entradas invalidas, afecta compras futuras solamente, conserva historicos sin recalculo y registra auditoria de cambios. Caja, Reporte y Auditoria siguen operativos. No encontre P0/P1 abiertos.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Empresa: `companyId=1`
- Fecha de prueba: `2026-06-07`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Configuracion inicial

`GET /api/companies/1/settings`:

- status: `200`
- `id`: `1`
- `name`: `Cafe Central`
- `email`: `null`
- `phone`: `null`
- `logoUrl`: `null`
- `pointsPercentage`: `5`
- `status`: `active`
- `updatedAt`: `2026-06-02T19:16:06Z`

## Validaciones API

`PATCH /api/companies/1/settings` rechazo correctamente:

- `pointsPercentage=0` -> `400`
- `pointsPercentage=-1` -> `400`
- `pointsPercentage=101` -> `400`
- `email=bad-email` -> `400`
- `logoUrl=ftp://logo.test/a.png` -> `400`

## Cambio reversible probado

Cambio temporal aplicado:

```json
{
  "name": "Cafe Central QA TASK-110",
  "email": "task110-settings@example.com",
  "phone": "+50622110110",
  "logoUrl": "https://example.com/task110-logo.png",
  "pointsPercentage": 6
}
```

Resultado:

- `PATCH /api/companies/1/settings` -> `200`
- La respuesta devolvio los valores actualizados.
- `updatedAt`: `2026-06-07T18:17:57Z`

Restauracion aplicada:

```json
{
  "name": "Cafe Central",
  "email": null,
  "phone": null,
  "logoUrl": null,
  "pointsPercentage": 5
}
```

Resultado:

- `PATCH /api/companies/1/settings` -> `200`
- `GET /api/companies/1/settings` posterior confirmo restauracion:
  - `name`: `Cafe Central`
  - `email`: `null`
  - `phone`: `null`
  - `logoUrl`: `null`
  - `pointsPercentage`: `5`

## Compra futura vs historicos

Datos QA creados mientras el porcentaje temporal era `6%`:

- Cliente:
  - `Task 110 Cliente 112497`
  - telefono `+5062112497`
  - email `task110-112497@example.com`
  - `customerId`: `81`
- Compra:
  - factura `T110-P-112497`
  - fecha `2026-06-07`
  - monto `1000`
  - `purchaseId`: `55`
  - puntos ganados: `60`

Evidencia:

- `POST /customers` -> `201`
- `POST /purchases` -> `201`
- Compra nueva con monto `1000` genero `60` puntos, consistente con `6%`.

Historico no recalculado:

- Compra previa `T105-P-99928506`
- monto `2000`
- puntos historicos se mantienen en `100`
- No se recalculo a `120`.

Reporte publicado:

- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all` -> `200`
- Resumen:
  - `purchaseCount`: `2`
  - `purchaseAmountTotal`: `3000`
  - `pointsEarnedTotal`: `160`
  - `redemptionCount`: `1`
  - `pointsRedeemedTotal`: `25`
  - `activeCustomerCount`: `2`
- Incluye factura `T110-P-112497` con `60` puntos.

## Auditoria

`GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=50`:

- status: `200`
- `items`: `13`
- Eventos `company.settings.updated` observados: `2`

Eventos de settings:

- `eventType`: `company.settings.updated`
- `entityType`: `company`
- `entityId`: `1`
- metadata:
  - `changedFields`: `["name","email","phone","logoUrl","pointsPercentage"]`
  - `affectsPurchases`: `future_only`
  - `requestId`: presente

Tambien se observaron eventos relacionados con los datos QA:

- `customer.created` para `Task 110 Cliente 112497`
- `purchase.registered` para factura `T110-P-112497`

## UI publicada

La app publicada renderiza:

- `API real`
- acceso `Empresa`
- panel `Empresa piloto`
- campos de configuracion:
  - nombre
  - email
  - telefono
  - logo URL
  - porcentaje de puntos

Valores visibles tras restauracion:

- `company-name`: `Cafe Central`
- `company-points-percentage`: `5`
- email/telefono/logo vacios

Validaciones UI:

Con nombre vacio, email invalido, telefono corto, logo `ftp://...` y porcentaje `101`, la UI mostro:

- `Revise los campos marcados.`
- `El nombre es requerido...`
- `El email debe tener un formato valido...`
- `El telefono debe tener entre 7 y 32 caracteres.`
- `El logo URL debe ser una URL http(s) valida.`
- `El porcentaje debe ser mayor que 0 y menor o igual que 100.`

Reporte desde UI:

- Consulta `2026-06-07..2026-06-07`
- Resultado: `Reporte cargado: 3 movimientos.`
- Factura `T110-P-112497` visible con `+60 pts`.

Auditoria desde UI:

- Consulta `2026-06-07..2026-06-07`, `limit=50`
- Resultado: `Auditoria cargada: 13 eventos.`
- Filas visibles incluyeron:
  - `Configuracion actualizada`
  - `Compra registrada` para `Task 110 Cliente 112497`
  - `Cliente creado` para `Task 110 Cliente 112497`

Responsive:

- Desktop `1366x900`: sin overflow horizontal.
- Mobile `390x900`: sin overflow horizontal.
- Panel empresa visible en mobile; ancho aproximado `370px`.

## Regresion Caja, Reporte y Auditoria

- Caja/API: cliente QA creado y consultable.
- Reporte: incluye compra nueva y mantiene historicos.
- Auditoria: incluye cambios de settings y eventos operativos.

## Hallazgos

### P0/P1

Ninguno.

### P2/P3

Ninguno nuevo observado.

## Datos cambiados y restauracion

Cambios temporales en empresa:

- nombre, email, telefono, logo URL y porcentaje de puntos.

Restauracion:

- completada y verificada por `GET /settings`.
- Estado final de configuracion:
  - `name`: `Cafe Central`
  - `email`: `null`
  - `phone`: `null`
  - `logoUrl`: `null`
  - `pointsPercentage`: `5`

Datos QA persistentes creados:

- Cliente `Task 110 Cliente 112497`
- Compra `T110-P-112497`

Estos datos quedan documentados para trazabilidad del piloto.

## Siguiente recomendado

Product / Architect / Release puede procesar el handoff y mover TASK-110 a `Done` si acepta la evidencia.
