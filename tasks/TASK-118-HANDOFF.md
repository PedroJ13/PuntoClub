# TASK-118 HANDOFF - QA

## Resultado

Aprobado.

El menu lateral publicado funciona y no encontre regresiones P0/P1 en Operaciones, Mi empresa, Reportes ni responsive. Caja, Reporte y Auditoria siguen operativos.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba: `2026-06-07`
- Empresa: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Evidencia de publicacion

Fuente publicada:

- `index.html` contiene `Operaciones`, `Mi empresa` y `Reportes`.
- `src/app.js` contiene logica de secciones/navegacion.
- `styles.css` contiene estilos de menu/sidebar.

API base antes de flujo:

- `GET /api/companies/1/settings` -> `200`
- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all` -> `200`
- `GET /api/companies/1/audit/events?from=2026-06-07&to=2026-06-07&limit=10` -> `200`

## Navegacion

Estado inicial:

- `API real` visible.
- Menu visible con:
  - `Operaciones`
  - `Mi empresa`
  - `Reportes`
- Seccion inicial activa: `Operaciones`.
- Solo una seccion principal visible a la vez:
  - inicial: Operaciones visible, Mi empresa oculta, Reportes oculta.
  - al ir a Mi empresa: Mi empresa visible, Operaciones/Reportes ocultas.
  - al ir a Reportes: Reportes visible, Operaciones/Mi empresa ocultas.
- Desktop sin overflow horizontal.

## Operaciones

Datos QA creados:

- Cliente:
  - nombre: `Task 118 Cliente 280659`
  - telefono: `+5063280659`
  - email: `task118-280659@example.com`
- Compra:
  - factura: `T118-P-280659`
  - fecha: `2026-06-07`
  - monto: `1000`
  - puntos ganados: `50`
- Redencion:
  - fecha: `2026-06-07`
  - puntos: `10`
  - nota: `TASK-118 canje 280659`

Validado en UI:

- Cliente creado y visible en resultados.
- Acciones `Compra`, `Historial` y `Redimir` visibles.
- Compra registrada correctamente.
- Canje registrado correctamente.
- Historial visible con:
  - compra `T118-P-280659`
  - canje `TASK-118 canje 280659`
  - balance actual `40`
  - ganados `50`
  - redimidos `10`

Confirmacion API posterior:

- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all` -> `200`
- `items`: `5`
- factura `T118-P-280659`: presente.
- redencion de `Task 118 Cliente 280659`: presente.
- resumen:
  - `purchaseCount`: `3`
  - `purchaseAmountTotal`: `4000`
  - `pointsEarnedTotal`: `210`
  - `redemptionCount`: `2`
  - `pointsRedeemedTotal`: `35`
  - `activeCustomerCount`: `3`

## Mi empresa

Validado en UI:

- Navegacion a `Mi empresa` funciona.
- Panel muestra configuracion publicada.
- Nombre visible: `Cafe Central`.
- Porcentaje visible: `5`.
- Estado visible: `Activa`.
- Mensajes informativos fuera de alcance visibles:
  - `Invitacion por correo pendiente de arquitectura.`
  - `Upload a storage queda fuera de esta fase.`

Guardado de configuracion existente:

- Se ejecuto `Guardar configuracion` sin cambios reales.
- Confirmacion visible: `Configuracion guardada.`
- No se probaron acciones fuera de alcance como invitaciones, login, password o upload real de logos.

## Reportes

Reporte operativo:

- Navegacion a `Reportes` funciona.
- Consulta `2026-06-07..2026-06-07`, tipo `Todas`.
- Factura `T118-P-280659` visible.
- Redencion visible.

Export CSV:

- Header capturado:
  - `"fecha","tipo","cliente","telefono","email","detalle","monto","puntos"`
- CSV contiene factura `T118-P-280659`.
- CSV generado con 6 lineas en la captura: header + movimientos.

Auditoria operativa:

- Consulta `2026-06-07..2026-06-07`, `limit=25`.
- Resultado visible: `Auditoria cargada: 16 eventos.`
- Tabla visible con eventos de:
  - cliente creado
  - compra registrada
  - canje registrado
- Eventos de `Task 118 Cliente 280659` y factura `T118-P-280659` visibles.

## Responsive

Desktop `1366x900`:

- Sin overflow horizontal.
- Menu lateral visible.
- Secciones navegables.

Mobile `390x900`:

- Sin overflow horizontal.
- Menu compacto/top visible con `Operaciones`, `Mi empresa`, `Reportes`.
- `Mi empresa` visible, panel ancho aprox. `370px`.
- `Reportes` visible, paneles de reporte/auditoria ancho aprox. `370px`.

## Hallazgos

### P0/P1

Ninguno.

### P2/P3

Ninguno nuevo observado.

## Notas

- Se crearon datos reales de QA en empresa piloto para validar flujo operativo publicado.
- No se modifico codigo, Azure ni secretos.
- Se valido que las funciones fuera de alcance queden solo como informacion/no accion real.

## Siguiente recomendado

Product / Architect / Release puede revisar el handoff y mover TASK-118 a `Done` si acepta la evidencia.
