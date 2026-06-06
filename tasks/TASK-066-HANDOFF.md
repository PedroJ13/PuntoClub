Equipo:
Web Dev

Tarea completada:
TASK-066 - Ajustar layout web por zonas segun PO Test.

Fecha:
2026-06-06

Archivos cambiados:
- `app/index.html`
- `app/styles.css`
- `tasks/TASK-066-HANDOFF.md`

Ambiente probado:
- Local: `http://127.0.0.1:4175`
- API estable usada por `app-config.js`: `https://func-puntoclub-prod-br-001.azurewebsites.net`
- URL publicada objetivo: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Cambios realizados:
- Se eliminaron los labels visibles `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4`.
- Se mantuvieron los nombres funcionales:
  - `Buscar cliente`
  - `Registrar cliente`
  - `Resultados`
  - `Operacion`
- Se reorganizo desktop para aproximar el boceto:
  - izquierda arriba: busqueda;
  - izquierda abajo: resultados;
  - derecha: registro de cliente;
  - abajo: operacion compra/redencion a ancho util.
- El panel `Registrar cliente` ahora es menos ancho que antes.
- El panel `Registrar cliente` se estira para alinearse visualmente con la suma de `Buscar cliente` + `Resultados` cuando el viewport lo permite.
- Resultados mantiene lista compacta, `Pts.` para puntos y scroll interno cuando hay varios clientes.
- Se preservo la logica existente de busqueda, registro, duplicado, compra, redencion y foco.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `rg -n "Zona [0-9]|Zona" app/index.html app/styles.css app/src/app.js`
- Navegador local contra API estable.
- Consola del navegador sin errores criticos.
- Responsive:
  - desktop `1280x800`
  - mobile `390x780`

Evidencia de que ya no aparecen labels `Zona X`:
- Busqueda por texto en archivos no encontro `Zona`.
- DOM local:
  - titulos visibles: `Buscar cliente`, `Registrar cliente`, `Resultados`, `Operacion`.
  - `zoneLabels: []`.

Evidencia desktop del layout:
- Viewport `1280x800`.
- Busqueda arriba izquierda:
  - top `95`
  - left `20`
  - width `776`
  - height `155`
- Resultados abajo izquierda:
  - top `265`
  - left `20`
  - width `776`
  - height `353`
- Registro derecha menos ancho:
  - top `95`
  - left `810`
  - width `450`
  - height `522`
- Alineacion visual:
  - busqueda `155` + gap `14` + resultados `353` = `522`
  - registro height `522`
- Operacion abajo:
  - top `632`
  - left `20`
  - width `1240`
  - height `120`
- Sin overflow horizontal:
  - `scrollWidth 1280`
  - `overflowX false`
  - `offscreenCount 0`

Evidencia de resultados con 1 cliente:
- Busqueda:
  - `+50653781769`
- Resultado:
  - `rows: 1`
  - fila: `Task 063 Cliente 53781769 +50653781769 task063-53781769@example.com Pts. 75 Compra Redimir`
  - accion `Redimir` visible porque tenia puntos.

Evidencia de resultados con 2 o mas clientes:
- Busqueda:
  - `QA`
- Resultado:
  - `rows: 18`
  - primeros resultados:
    - `QA Smoke 1780430104689 ... Pts. 173 Compra Redimir`
    - `QA Smoke 1780435470439 ... Pts. 49 Compra Redimir`
    - `QA Smoke 1780435841290 ... Pts. 49 Compra Redimir`
- Scroll interno desktop:
  - `listClientHeight 280`
  - `listScrollHeight 1497`
- No hubo controles fuera de pantalla:
  - `offscreenCount 0`

Evidencia mobile sin overflow horizontal:
- Viewport `390x780`.
- Orden visual:
  - buscar top `144`
  - resultados top `399`
  - registrar top `554`
  - operacion top `1026`
- Ancho de paneles `355`.
- `scrollWidth 375`
- `overflowX false`
- `offscreenCount 0`

Evidencia de compra/redencion y foco a buscar:
- Compra:
  - cliente `Task 063 Cliente 53781769`
  - factura `T066-P-57472672`
  - monto `100`
  - mensaje `Compra registrada. Pts. ganados: 5.`
  - puntos actualizados de `75` a `80`
  - `purchase-form` quedo oculto
  - foco volvio a `customer-search`
- Redencion:
  - puntos redimidos `1`
  - nota `Canje QA TASK-066`
  - mensaje `Canje registrado. Pts. redimidos: 1.`
  - puntos actualizados de `80` a `79`
  - `redemption-form` quedo oculto
  - foco volvio a `customer-search`

Resultado:
Aprobado en ambiente local contra API estable. Listo para commit/deploy a Static Web Apps y posterior QA en URL publicada.

Riesgos o pendientes:
- La URL publicada `https://calm-dune-075dc5c0f.7.azurestaticapps.net` no refleja estos cambios hasta que se suban a GitHub y corra el deploy de Static Web Apps.
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se tocaron contratos API, backend/API, recursos Azure ni secretos.

Siguiente recomendado:
- Commit/deploy de estos cambios.
- TASK-067: QA valida layout publicado despues de TASK-066.
