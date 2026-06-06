Equipo:
QA

Tarea validada:
TASK-076 - Revalidar historial publicado despues del deploy.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewports:
  - desktop `1280x800`
  - mobile `390x780`

Resultado:
Aprobado.

Resumen:
La UI publicada ya contiene historial resumido de cliente. El historial se abre desde la accion `Historial`, muestra balance, compras y redenciones, y se actualiza despues de registrar compra y canje. No se detectaron P0/P1.

Checks ejecutados:
- Lectura HTTP de HTML publicado.
- Lectura HTTP de `src/app.js` publicado.
- Lectura HTTP de `styles.css` publicado.
- Busqueda estatica de `Zona|zona` en HTML/JS/CSS publicados.
- Busqueda estatica de referencias de historial: `Historial`, `history`, `activity`, `movimientos`.
- Apertura de UI publicada en Chrome headless.
- Busqueda de cliente existente con movimientos.
- Apertura de historial desde resultado.
- Validacion de balance y movimientos en historial.
- Registro de cliente nuevo sin movimientos.
- Apertura de historial vacio.
- Registro de compra para ese cliente.
- Confirmacion de historial actualizado despues de compra.
- Redencion de puntos.
- Confirmacion de historial actualizado despues de redencion.
- Validacion desktop sin overflow horizontal.
- Validacion mobile sin overflow horizontal.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo.

Evidencia estatica:
- HTML publicado:
  - length `7181`
- JS publicado:
  - length `27165`
- CSS publicado:
  - length `8459`
- Coincidencias `Zona|zona` en HTML+JS+CSS:
  - `0`
- Coincidencias de historial en HTML+JS+CSS:
  - patrones `Historial|history|activity|movimientos|No se pudo cargar el historial|Sin movimientos`
  - `79`

Evidencia de cliente existente con movimientos:
- Busqueda:
  - `+50671492617`
- Resultado:
  - `Task 071 Cliente 63492617 +50671492617 task071-63492617@example.com PTS. 75 Compra Historial Redimir`
- Historial abierto:
  - puntos actuales `75`
  - ganados `100`
  - redimidos `25`
  - canje `06/06/2026 - Canje QA TASK-071 -25 pts`
  - compra `06/06/2026 - Factura T071-P-63492617 - CRC 2 000,00 +100 pts`
- Orden observado:
  - canje antes que compra, es decir movimiento mas reciente primero en el caso probado.

Evidencia de cliente sin movimientos:
- Cliente creado:
  - `Task 076 Cliente 74484252`
  - telefono `+50676484252`
  - email `task076-74484252@example.com`
- Resultado inicial:
  - `PTS. 0 Compra Historial`
- Historial vacio:
  - ganados `0`
  - redimidos `0`
  - actuales `0`
  - texto `Sin movimientos para este cliente.`
- Pantalla no se rompio y no aparecieron textos `Zona|zona`.

Evidencia de compra e historial actualizado:
- Accion:
  - `Compra`
- Panel:
  - titulo `Registrar compra`
  - foco inicial `purchase-invoice-number`
- Factura:
  - `T076-P-74484252`
- Monto:
  - `2000`
- Resultado:
  - mensaje `Compra registrada. Pts. ganados: 100.`
  - historial muestra ganados `100`, redimidos `0`, actuales `100`
  - movimiento `Compra 06/06/2026 - Factura T076-P-74484252 - CRC 2 000,00 +100 pts`
  - fila actualizada `PTS. 100 Compra Historial Redimir`

Evidencia de redencion e historial actualizado:
- Accion:
  - `Redimir`
- Panel:
  - titulo `Redimir puntos`
  - foco inicial `redemption-points`
- Puntos redimidos:
  - `25`
- Nota:
  - `Canje TASK-076 74484252`
- Resultado:
  - mensaje `Canje registrado. Pts. redimidos: 25.`
  - historial muestra ganados `100`, redimidos `25`, actuales `75`
  - movimiento `Canje 06/06/2026 - Canje TASK-076 74484252 -25 pts`
  - compra anterior sigue visible con `+100 pts`
  - fila actualizada `PTS. 75 Compra Historial Redimir`

Evidencia responsive:
- Desktop:
  - `innerWidth: 1280`
  - `scrollWidth: 1280`
  - `overflowX: false`
  - textos `Zona|zona`: `[]`
- Mobile:
  - `innerWidth: 390`
  - `scrollWidth: 390`
  - `overflowX: false`
  - `offscreenCount: 0`
  - `hasHistoryPanel: true`
  - textos `Zona|zona`: `[]`

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se simulo error de `/activity`; no se cambio API ni se interceptaron respuestas porque el alcance no permite tocar Azure ni datos reales.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el bloqueo de historial publicado reportado en TASK-075.
