Equipo:
QA

Tarea validada:
TASK-075 - Validar historial publicado de cliente.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport probado: desktop `1280x800`

Resultado:
No aprobado.

Resumen:
El backend `/activity` responde correctamente, pero la UI publicada todavia no contiene la funcionalidad de historial de TASK-073. No aparece accion `Historial`, no existe panel `#history-panel` y los archivos publicados no contienen referencias a `Historial`, `history`, `activity` ni mensajes de historial.

Checks ejecutados:
- Lectura HTTP de HTML publicado.
- Lectura HTTP de `src/app.js` publicado.
- Lectura HTTP de `styles.css` publicado.
- Busqueda estatica de referencias a historial en archivos publicados.
- Confirmacion de ausencia de textos `Zona`/`zona` en archivos publicados.
- Apertura de pantalla publicada en Chrome headless.
- Busqueda de cliente existente con movimientos.
- Revision de acciones visibles en resultado.
- Verificacion directa del endpoint `/activity` para el mismo cliente.
- Validacion desktop basica sin overflow horizontal.

Hallazgos:
P0/P1:
- P1: La UI publicada no permite abrir historial de cliente. El resultado del cliente solo muestra acciones `Compra` y `Redimir`; no aparece `Historial` ni panel de historial. Esto bloquea el objetivo principal de TASK-075.

P2/P3:
- Ninguno adicional.

Evidencia estatica del frontend publicado:
- HTML publicado:
  - length `6855`
- JS publicado:
  - length `21953`
- CSS publicado:
  - length `6944`
- Coincidencias `zona|Zona` en HTML+JS+CSS:
  - `0`
- Coincidencias de historial en HTML+JS+CSS:
  - patrones `Historial|history|activity|movimientos|No se pudo cargar el historial`
  - `0`
- `.panel-nav` / `[data-panel]`:
  - `0`

Evidencia en navegador:
- Cliente buscado:
  - telefono `+50671492617`
  - fila `Task 071 Cliente 63492617 +50671492617 task071-63492617@example.com PTS. 75 Compra Redimir`
- Acciones visibles:
  - `Compra`
  - `Redimir`
- Acciones/panel de historial:
  - `historyButtons: []`
  - `historyPanelExists: false`
  - `bodyHasHistory: false`
- Sin textos `Zona`/`zona`:
  - `bodyZonaMatches: []`
- Desktop sin overflow horizontal:
  - `overflowX: false`
  - `scrollWidth: 1280`
  - `innerWidth: 1280`

Evidencia API directa:
- Cliente:
  - `customerId 57`
- Endpoint:
  - `GET /api/companies/1/customers/57/activity`
  - respuesta `200`
- Balance devuelto:
  - ganados `100`
  - redimidos `25`
  - actuales `75`
- Movimientos devueltos:
  - redencion `2026-06-06`, nota `Canje QA TASK-071`, puntos `-25`
  - compra `2026-06-06`, factura `T071-P-63492617`, monto `2000`, puntos `100`
- Orden:
  - mas reciente primero para el caso probado: redencion antes de compra.

Checks no ejecutados por bloqueo:
- Abrir historial desde resultado/cliente seleccionado.
- Confirmar render de balance, compras y redenciones en UI.
- Registrar nueva compra y validar actualizacion del historial en UI.
- Redimir puntos y validar actualizacion del historial en UI.
- Probar cliente sin movimientos en historial UI.
- Mobile completo del panel historial.
- Simulacion de error `/activity` en UI.

Motivo:
- Al no existir la accion ni el panel de historial en la URL publicada, los checks de historial en UI no son ejecutables en esta version.

Riesgos o pendientes:
- TASK-073 puede estar pendiente de commit/deploy o Static Web Apps puede estar sirviendo una version anterior.
- La API de historial parece disponible, pero el frontend publicado no la consume.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Web Dev / Release debe confirmar commit y deploy de TASK-073 a Static Web Apps.
- Reintentar TASK-075 cuando `src/app.js` publicado incluya `Historial`/`activity` y la UI muestre la accion de historial.
