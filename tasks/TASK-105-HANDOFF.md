# TASK-105 HANDOFF - QA

## Resultado

No aprobado.

Hay avance respecto a TASK-101: el frontend publicado ya contiene `Auditoria` / `Auditoria operativa`, usa `API real`, muestra controles de filtro y maneja el error de consulta. Pero el endpoint publicado esperado para lectura de auditoria sigue respondiendo `404 Not Found`, por lo que no es posible validar eventos operativos reales.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba: `2026-06-07`
- Empresa: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Endpoint probado

Endpoint esperado:

```text
GET /api/companies/1/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=25
```

Resultados publicados:

- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=25` -> `404 Not Found`
- `GET /api/companies/1/audit/events?from=1999-01-01&to=1999-01-01&limit=25` -> `404 Not Found`
- `GET /api/companies/1/audit/events?to=2026-06-07&limit=25` -> `404 Not Found`
- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=20` -> `404 Not Found`

La respuesta `404` ocurre tambien en casos que deberian devolver `200` o `400`, lo que apunta a ruta no desplegada/no registrada en la API publicada.

## Frontend publicado

Fuente publicada:

- `index.html` contiene `Auditoria`.
- `src/app.js` contiene logica de auditoria.
- `src/customerApi.js` contiene `audit/events` y `limit`.

UI renderizada:

- `API real`: visible.
- Link `Auditoria`: visible.
- Seccion `Auditoria operativa`: visible.
- Controles visibles:
  - `Fecha desde`
  - `Fecha hasta`
  - `Ultimos eventos`
  - opciones `10`, `25`, `50`
  - boton `Consultar auditoria`
- Estado inicial visible:
  - `Consulte un rango de fechas para ver eventos recientes.`

Consulta UI con `2026-06-07..2026-06-07`, `limit=25`:

- No carga eventos.
- Muestra error controlado:
  - `No se pudo consultar auditoria. Si el endpoint aun no esta disponible, intente despues del deploy.`
- Tabla sin filas.
- Estado posterior:
  - `No hay auditoria cargada.`

Responsive:

- Desktop `1280px`: sin overflow horizontal.
- Mobile `390px`: sin overflow horizontal.
- Auditoria visible en mobile.

## Eventos esperados vs observados

Eventos esperados:

- `customer.created`
- `purchase.registered`
- `redemption.registered`

Rechazos esperados si es seguro validar:

- cliente duplicado
- factura duplicada
- saldo insuficiente

Observado:

- No fue posible consultar eventos.
- No fue posible validar `limit`, rango, estado vacio real ni eventos/rechazos auditados porque `/audit/events` responde `404`.

No cree nuevos datos QA para auditoria. Con el endpoint de lectura en `404`, crear cliente/compra/redencion no permitiria confirmar persistencia ni visibilidad de eventos.

## Regresion Caja y Reporte

Caja sigue operativa por API publicada:

- `GET /api/companies/1/customers?search=%2B50671492617` -> `200`
- Cliente encontrado:
  - `Task 071 Cliente 63492617`
  - `+50671492617`
  - `task071-63492617@example.com`

Reporte operativo sigue operativo:

- `GET /api/companies/1/reports/activity?from=2026-06-06&to=2026-06-06&type=all` -> `200`
- Resumen:
  - `purchaseCount`: 14
  - `purchaseAmountTotal`: 22300
  - `pointsEarnedTotal`: 1115
  - `redemptionCount`: 12
  - `pointsRedeemedTotal`: 252
  - `activeCustomerCount`: 11
  - `items`: 26

## Hallazgos

### P1 - Endpoint publicado de auditoria responde 404

La UI ya esta publicada, pero la API estable no expone la ruta esperada:

```text
/api/companies/1/audit/events
```

Impacto:

- No se pueden validar eventos `customer.created`, `purchase.registered` ni `redemption.registered`.
- No se pueden validar rechazos auditados.
- No se pueden validar filtros/rango/limit ni estado vacio real desde API.
- La UI queda bloqueada en error controlado.

## P2/P3

No registre P2/P3 adicionales. Caja y Reporte siguen operativos.

## Datos QA creados

No cree datos nuevos en esta pasada.

Motivo: el bloqueo P1 es de endpoint publicado. Crear datos no aportaria evidencia de auditoria mientras no exista lectura publicada.

## Siguiente recomendado

Revisar deploy/registro de la Azure Function de lectura de auditoria (`listAuditEvents` o equivalente) y reintentar TASK-105 cuando:

- `GET /api/companies/1/audit/events?...` responda `200` para consultas validas.
- Validaciones negativas respondan `400` segun contrato.
- La UI pueda cargar eventos reales.
