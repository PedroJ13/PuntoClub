Equipo:
QA

Tarea validada:
TASK-083 - Validar limpieza de mensaje persistente.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport: desktop `1280x800`

Resultado:
No aprobado.

Resumen:
El mensaje de duplicado aparece correctamente al intentar registrar un cliente duplicado, pero sigue visible al cambiar de contexto hacia `Compra`, `Historial` y `Redimir`. Por tanto, el P3 reportado en TASK-081 sigue abierto en la URL publicada.

Datos QA creados:
- Cliente:
  - `Task 083 Cliente 86192043`
  - telefono `+50683192043`
  - email `task083-86192043@example.com`
- Factura:
  - `T083-P-86192043`
- Canje:
  - `Canje TASK-083 86192043`

Checks ejecutados:
- Lectura de `src/app.js` publicado.
- Confirmacion de UI con `API real`.
- Confirmacion de ausencia de textos `Zona`/`zona`.
- Registro de cliente nuevo.
- Intento de duplicado por telefono.
- Confirmacion de mensaje claro de duplicado.
- Confirmacion de seleccion/busqueda del cliente existente.
- Apertura de compra desde ese cliente.
- Smoke corto de compra.
- Apertura de historial.
- Apertura de redencion.
- Smoke corto de redencion.
- Historial final con compra y redencion.
- Revision de consola/CDP.
- Validacion desktop sin overflow horizontal.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- P3 abierto: El mensaje `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.` queda visible despues de abrir `Compra`, `Historial` y `Redimir`. Es exactamente el comportamiento que TASK-083 debia validar como corregido.

Evidencia:
- Estado inicial:
  - `apiReal: true`
  - `bodyZona: []`
  - `formError.hidden: true`
  - `overflowX: false`
- Cliente creado:
  - mensaje `Cliente registrado: Task 083 Cliente 86192043.`
  - fila `Task 083 Cliente 86192043 +50683192043 task083-86192043@example.com PTS. 0 Compra Historial`
  - `formError.hidden: true`
- Duplicado por telefono:
  - mensaje visible `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - `formError.hidden: false`
  - busqueda queda en `+50683192043`
  - cliente existente queda seleccionado/listado.
- Al abrir compra:
  - panel `Registrar compra`
  - `formError.text: Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - `formError.hidden: false`
  - resultado: no se limpio el mensaje viejo.
- Despues de registrar compra:
  - mensaje operativo `Compra registrada. Pts. ganados: 100.`
  - fila `PTS. 100 Compra Historial Redimir`
  - `formError.hidden: false`
  - el mensaje viejo sigue visible.
- Al abrir historial despues de duplicado:
  - historial muestra factura `T083-P-86192043` y `+100 pts`
  - `formError.hidden: false`
  - el mensaje viejo sigue visible.
- Al abrir redencion despues de duplicado:
  - panel `Redimir puntos`
  - `formError.hidden: false`
  - el mensaje viejo sigue visible.
- Despues de redencion:
  - mensaje operativo `Canje registrado. Pts. redimidos: 25.`
  - fila `PTS. 75 Compra Historial Redimir`
  - `formError.hidden: false`
  - el mensaje viejo sigue visible.
- Historial final:
  - ganados `100`
  - redimidos `25`
  - actuales `75`
  - canje `Canje TASK-083 86192043 -25 pts`
  - compra `Factura T083-P-86192043 - CRC 2 000,00 +100 pts`

Consola / errores:
- No hubo excepciones JS capturadas.
- CDP registro errores HTTP esperados por pruebas de duplicado:
  - `409` para duplicados.
  - `404` de recurso no critico.
- No se observaron errores criticos que bloqueen compra/redencion/historial.

Responsive:
- Desktop:
  - `innerWidth: 1280`
  - `scrollWidth: 1265`
  - `overflowX: false`
  - `offscreenCount: 0`

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- Puede que TASK-082 no este desplegada, o que el fix local no cubra el estado publicado actual.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Web Dev / Release debe revisar que el cambio de TASK-082 este commiteado/desplegado y que `#form-error` se oculte al abrir compra, historial y redencion.
- Reintentar TASK-083 en la URL publicada despues del ajuste/deploy.
