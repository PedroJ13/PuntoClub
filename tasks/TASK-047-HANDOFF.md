Equipo:
Web Dev

Tarea completada:
TASK-047 - Ajustar flujo clientes para registrar compra desde cliente.

Fecha:
2026-06-04

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-047-HANDOFF.md`

Ambiente probado:
- Local: `http://127.0.0.1:4175`
- API estable usada por `app-config.js`: `https://func-puntoclub-prod-br-001.azurewebsites.net`
- URL publicada objetivo: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Cambios realizados:
- La pantalla ya no ejecuta busqueda/listado inicial automaticamente al abrir.
- La busqueda queda manual por telefono, nombre o email.
- Cada cliente mostrado incluye:
  - nombre,
  - telefono,
  - email,
  - puntos acumulados actuales,
  - boton `Registrar compra`.
- Se agrego panel minimo para registrar compra del cliente seleccionado:
  - cliente seleccionado visible,
  - factura o comprobante,
  - fecha de compra con valor por defecto `2026-06-04`,
  - monto,
  - submit `Registrar compra`.
- Se integraron endpoints existentes:
  - `GET /api/companies/{companyId}/customers/{customerId}/balance`
  - `POST /api/companies/{companyId}/purchases`
- Al registrar compra se refresca el saldo del cliente seleccionado y de la fila visible.
- Si `POST /customers` responde `DUPLICATE_CUSTOMER`, la UI:
  - muestra mensaje claro,
  - busca el cliente existente por telefono/email,
  - lo selecciona,
  - abre el formulario de compra.
- Mock local actualizado para soportar saldos y compras sin cambiar contratos.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Navegador local contra API estable.
- Consola del navegador sin errores criticos.
- Responsive:
  - desktop `1280x800`
  - mobile `390x780`

Evidencia de no carga inicial automatica:
- Al abrir `http://127.0.0.1:4175`, la lista muestra:
  - `Busque por telefono, nombre o email para atender al cliente.`
- El formulario de compra inicia oculto.
- El indicador de fuente muestra `API real`.
- En codigo se reemplazo la llamada inicial `loadCustomers("")` por estado inicial manual `renderSearchPrompt()`.

Evidencia de puntos visibles:
- Busqueda `QA` devolvio 15 clientes.
- Cada fila mostro badge `Puntos` y boton `Registrar compra`.
- Ejemplo visible:
  - `QA Smoke 1780430104689`
  - telefono `+50630104689`
  - puntos antes de compra `49`
  - boton `Registrar compra`.

Evidencia de registrar compra desde cliente existente:
- Cliente seleccionado desde resultado:
  - `QA Smoke 1780430104689`
  - puntos actuales antes: `49`
- Compra registrada:
  - factura `T047-EX-10586316`
  - monto `1234.56`
- Resultado:
  - mensaje `Compra registrada. Puntos ganados: 62.`
  - puntos visibles despues: `111`
  - sin errores de consola.

Evidencia de crear cliente y pasar a compra:
- Cliente creado:
  - nombre `Task 047 Cliente 10631543`
  - telefono `+50610631543`
  - email `task047-1780610631543@example.com`
- Resultado despues de crear:
  - mensaje `Cliente registrado: Task 047 Cliente 10631543. Ahora puede registrar la compra.`
  - formulario de compra visible.
  - foco en `purchase-invoice-number`.
  - puntos iniciales `0`.
- Compra registrada para el cliente nuevo:
  - factura `T047-NEW-10631543`
  - monto `2000`
  - mensaje `Compra registrada. Puntos ganados: 100.`
  - puntos despues `100`.

Evidencia de duplicado y paso a compra del existente:
- Se intento registrar nuevamente:
  - `Task 047 Cliente 10631543`
  - `+50610631543`
  - `task047-1780610631543@example.com`
- Resultado:
  - mensaje `Ya existe un cliente con ese telefono o email. Abrimos su registro de compra.`
  - cliente existente seleccionado.
  - formulario de compra visible.
  - foco en `purchase-invoice-number`.
  - puntos actuales `100`.

Responsive:
- Desktop `1280x800`:
  - `scrollWidth 1265`
  - sin overflow horizontal
  - sin controles fuera de pantalla
  - 15 filas visibles para busqueda `QA`
- Mobile `390x780`:
  - `scrollWidth 375`
  - sin overflow horizontal
  - sin controles fuera de pantalla
  - 15 filas visibles para busqueda `QA`

Resultado:
Aprobado en ambiente local contra API estable. Listo para commit/deploy a Static Web Apps y posterior QA en URL publicada.

Riesgos o pendientes:
- La URL publicada `https://calm-dune-075dc5c0f.7.azurestaticapps.net` no refleja estos cambios hasta que se suban a GitHub y corra el deploy de Static Web Apps.
- Para MVP piloto se cargan saldos de los resultados visibles; si el listado crece mucho, conviene paginar o limitar resultados desde API.
- No se implementaron redenciones, login/auth ni cambios de contrato API.
- No se tocaron secretos ni recursos Azure.

Siguiente recomendado:
- Commit/deploy de estos cambios.
- TASK-048: QA valida en URL publicada el flujo clientes + registrar compra.
