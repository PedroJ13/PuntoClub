Equipo:
QA

Tarea validada:
TASK-085 - Revalidar limpieza P3 despues del deploy.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport: desktop `1280x800`

Resultado:
Aprobado.

Resumen:
La correccion del P3 esta publicada. El mensaje de duplicado aparece cuando corresponde y se limpia al cambiar de contexto hacia compra, historial y redencion. Compra, historial y redencion siguen funcionando sin P0/P1 ni regresiones visuales bloqueantes.

Datos QA creados:
- Cliente:
  - `Task 085 Cliente 87457325`
  - telefono `+50685457325`
  - email `task085-87457325@example.com`
- Factura:
  - `T085-P-87457325`
- Canje:
  - `Canje TASK-085 87457325`

Checks ejecutados:
- Lectura de `src/app.js` publicado.
- Confirmacion de UI con `API real`.
- Confirmacion de ausencia de textos `Zona`/`zona`.
- Registro de cliente nuevo.
- Intento de duplicado por telefono.
- Confirmacion de mensaje claro de duplicado.
- Confirmacion de seleccion/busqueda del cliente existente.
- Apertura de compra desde ese cliente.
- Registro de compra.
- Repeticion de duplicado y apertura de historial.
- Repeticion de duplicado y apertura de redencion.
- Registro de redencion.
- Revision de consola/CDP.
- Validacion desktop sin overflow horizontal.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- Ninguno. El P3 de TASK-081 queda corregido en la URL publicada.

Evidencia:
- Estado inicial:
  - `apiReal: true`
  - `bodyZona: []`
  - `formError.hidden: true`
  - `overflowX: false`
- Cliente creado:
  - mensaje `Cliente registrado: Task 085 Cliente 87457325.`
  - fila `Task 085 Cliente 87457325 +50685457325 task085-87457325@example.com PTS. 0 Compra Historial`
  - `formError.hidden: true`
- Duplicado por telefono:
  - mensaje visible `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - `formError.hidden: false`
  - busqueda queda en `+50685457325`
  - cliente existente queda seleccionado/listado.
- Al abrir compra:
  - panel `Registrar compra`
  - `formError.text: ""`
  - `formError.hidden: true`
- Despues de registrar compra:
  - mensaje operativo `Compra registrada. Pts. ganados: 100.`
  - fila `PTS. 100 Compra Historial Redimir`
  - `formError.hidden: true`
- Al abrir historial despues de duplicado:
  - historial muestra factura `T085-P-87457325` y `+100 pts`
  - `formError.text: ""`
  - `formError.hidden: true`
- Al abrir redencion despues de duplicado:
  - panel `Redimir puntos`
  - `formError.text: ""`
  - `formError.hidden: true`
- Despues de redencion:
  - mensaje operativo `Canje registrado. Pts. redimidos: 25.`
  - fila `PTS. 75 Compra Historial Redimir`
  - historial muestra ganados `100`, redimidos `25`, actuales `75`
  - `formError.hidden: true`

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
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el P3 de mensaje persistente y considerar esta correccion lista para piloto.
