Equipo:
QA

Tarea validada:
TASK-081 - Regresion MVP publicada pre-piloto.

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
Aprobado con observacion P3.

Resumen:
La regresion MVP publicada paso sin P0/P1. La UI carga con `API real`, no muestra textos `Zona`/`zona`, permite busqueda por telefono/nombre/email, registro, duplicados, compra, redencion, negativos principales, historial y responsive sin overflow horizontal. Se detecto una observacion menor de copy/estado persistente en el formulario de registro despues de probar duplicados.

Datos QA creados:
- Cliente:
  - `Task 081 Cliente 77215349`
  - telefono `+50681215349`
  - email `task081-77215349@example.com`
- Factura valida:
  - `T081-P-77215349`
- Canje valido:
  - `Canje TASK-081 77215349`

Checks ejecutados:
- Lectura HTTP de archivos publicados y `app-config.js`.
- Confirmacion de API estable configurada.
- Confirmacion de UI con `API real`.
- Confirmacion de ausencia de `Zona`/`zona`.
- Confirmacion de historial publicado.
- Busqueda por telefono.
- Busqueda por nombre.
- Busqueda por email.
- Busqueda sin resultado y foco a registro.
- Registro de cliente nuevo.
- Duplicado por telefono.
- Duplicado por email.
- Historial vacio para cliente sin movimientos.
- Compra valida.
- Compra sin factura.
- Compra con monto `0`.
- Compra con factura duplicada.
- Redencion valida.
- Redencion con `0` puntos.
- Redencion por encima del saldo.
- Historial final con compra, canje y saldo.
- Desktop sin overflow horizontal.
- Mobile sin overflow horizontal.
- Revision de consola/CDP.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- P3: Despues de ejecutar duplicados, el mensaje del formulario de registro `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.` queda persistente mientras se operan compra/redencion. No bloquea el flujo ni altera datos, pero puede confundir visualmente si el usuario cambia de contexto.

Evidencia de carga/configuracion:
- `app-config.js` publicado:
  - `PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
  - `PUNTO_CLUB_COMPANY_ID = "1"`
  - `PUNTO_CLUB_USE_MOCK_API = false`
- UI:
  - `apiReal: true`
  - `bodyZona: []`
  - `hasHistoryPanel: true`
- Archivos publicados:
  - coincidencias `zona|Zona`: `0`
  - coincidencias de historial: `16`

Evidencia de busquedas:
- Telefono:
  - termino `+50671492617`
  - resultado `Task 071 Cliente 63492617 +50671492617 task071-63492617@example.com PTS. 75 Compra Historial Redimir`
- Nombre:
  - termino `Task 071 Cliente 63492617`
  - mismo resultado encontrado.
- Email:
  - termino `task071-63492617@example.com`
  - mismo resultado encontrado.
- Sin resultado:
  - termino `NORESULT-T081-77215349`
  - mensaje `No encontramos ese cliente. Complete el registro para crearlo.`
  - estado `Sin resultados. Complete el registro para crear este cliente.`
  - foco `customer-name`

Evidencia de registro y duplicados:
- Registro:
  - mensaje `Cliente registrado: Task 081 Cliente 77215349.`
  - resultado `Task 081 Cliente 77215349 +50681215349 task081-77215349@example.com PTS. 0 Compra Historial`
- Duplicado por telefono:
  - mensaje `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - selecciona el existente.
- Duplicado por email:
  - mismo mensaje claro.
  - selecciona el existente.

Evidencia de historial vacio:
- Historial de cliente recien creado:
  - ganados `0`
  - redimidos `0`
  - actuales `0`
  - texto `Sin movimientos para este cliente.`

Evidencia de compra:
- Compra valida:
  - factura `T081-P-77215349`
  - monto `2000`
  - mensaje `Compra registrada. Pts. ganados: 100.`
  - fila `PTS. 100 Compra Historial Redimir`
  - historial muestra `GANADOS 100`, `REDIMIDOS 0`, `ACTUALES 100`
  - movimiento `Compra 06/06/2026 - Factura T081-P-77215349 - CRC 2 000,00 +100 pts`
- Compra sin factura:
  - mensaje `La factura o comprobante es requerido y debe tener 80 caracteres o menos.`
  - mensaje general `Revise los campos marcados.`
  - saldo se mantiene `PTS. 100`.
- Compra con monto `0`:
  - mensaje `El monto debe ser mayor que 0.`
  - mensaje general `Revise los campos marcados.`
  - saldo se mantiene `PTS. 100`.
- Factura duplicada:
  - mensaje `Ya existe una compra con esa factura o comprobante.`
  - saldo se mantiene `PTS. 100`.

Evidencia de redencion:
- Redencion valida:
  - puntos `25`
  - nota `Canje TASK-081 77215349`
  - mensaje `Canje registrado. Pts. redimidos: 25.`
  - fila `PTS. 75 Compra Historial Redimir`
  - historial muestra `GANADOS 100`, `REDIMIDOS 25`, `ACTUALES 75`
  - movimiento `Canje 06/06/2026 - Canje TASK-081 77215349 -25 pts`
- Redencion con `0` puntos:
  - mensaje `Los puntos a redimir deben ser un entero mayor que 0.`
  - mensaje general `Revise los campos marcados.`
  - saldo se mantiene `PTS. 75`.
- Redencion mayor que saldo:
  - mensaje `El cliente no tiene puntos suficientes para este canje.`
  - saldo se mantiene `PTS. 75`.

Evidencia de historial final:
- Historial final del cliente QA:
  - actuales `75`
  - ganados `100`
  - redimidos `25`
  - canje `Canje TASK-081 77215349 -25 pts`
  - compra `Factura T081-P-77215349 - CRC 2 000,00 +100 pts`
  - orden observado: canje antes que compra, mas reciente primero.

Evidencia responsive:
- Desktop:
  - `innerWidth: 1280`
  - `scrollWidth: 1265`
  - `overflowX: false`
  - `offscreenCount: 0`
- Mobile:
  - `innerWidth: 390`
  - `scrollWidth: 390`
  - `overflowX: false`
  - `offscreenCount: 0`
  - `apiReal: true`
  - `bodyZona: []`

Consola / errores:
- No hubo excepciones JS capturadas por `window.__qaErrors`.
- CDP registro errores HTTP esperados por pruebas negativas:
  - `409` para duplicado de cliente/factura.
  - `400` para validaciones de compra/redencion.
  - `404` de recurso no critico.
- No se observaron errores criticos que bloqueen flujos.

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- Se observo una busqueda previa con latencia alta puntual al consultar cliente existente, pero en la corrida final las busquedas por telefono/nombre/email respondieron dentro de ~1.3s o menos. No queda como hallazgo abierto.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Product / Architect / Release puede considerar el MVP publicado listo para decision pre-piloto desde QA, con la observacion P3 como mejora menor.
