Equipo:
Web Dev

Tarea completada:
TASK-058 - Reorganizar UI por menu lateral de paneles.

Fecha:
2026-06-05

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-058-HANDOFF.md`

Ambiente probado:
- Local: `http://127.0.0.1:4175`
- API estable usada por `app-config.js`: `https://func-puntoclub-prod-br-001.azurewebsites.net`
- URL publicada objetivo: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Cambios realizados:
- Se agrego menu lateral izquierdo con opciones:
  - `Registrar cliente`
  - `Registrar compra`
  - `Redimir puntos`
- La pantalla operativa ahora muestra un solo panel activo mediante `data-panel`.
- La busqueda/lista de clientes queda visible como contexto para seleccionar cliente existente.
- El panel default al abrir es `Registrar cliente`.
- Se elimino la necesidad de buscar compra/redencion haciendo scroll entre formularios apilados.
- En mobile, el menu pasa a un control superior de tres opciones en una sola columna.
- Al crear cliente nuevo:
  - se mantiene el panel `Registrar cliente`;
  - se muestra confirmacion clara;
  - no se fuerza automaticamente el panel de compra.
- Al intentar crear un cliente duplicado:
  - se muestra mensaje claro;
  - se selecciona el cliente existente;
  - se cambia automaticamente a `Registrar compra`.
- En `Registrar compra` se agrego boton `Ir a redimir puntos` para abrir `Redimir puntos` del mismo cliente.
- Compra y redencion mantienen los endpoints y contratos existentes.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Navegador local contra API estable.
- Consola del navegador sin errores criticos.
- Responsive:
  - desktop `1280x800`
  - mobile `390x780`

Evidencia de menu lateral/panel activo:
- Al abrir:
  - menu visible con `Registrar cliente`, `Registrar compra`, `Redimir puntos`.
  - `Registrar cliente` tiene `aria-pressed="true"` y clase activa.
  - panel visible: `customer`.
- Al seleccionar `Registrar compra`:
  - panel visible: `purchase`.
  - solo queda un panel operativo visible.
- Al seleccionar `Redimir puntos`:
  - panel visible: `redemption`.
  - foco pasa a `redemption-points` cuando hay cliente seleccionado.

Evidencia de default en `Registrar cliente`:
- Carga inicial:
  - fuente `API real`.
  - boton activo `Registrar cliente`.
  - panel visible `customer`.
  - listado inicial muestra `Busque por telefono, nombre o email para atender al cliente.`
  - no carga clientes automaticamente.

Evidencia de alta sin salto automatico a compra:
- Cliente creado:
  - `Task 058 Cliente 00871045`
  - telefono `+50600871045`
  - email `task058-00871045@example.com`
- Resultado:
  - mensaje `Cliente registrado: Task 058 Cliente 00871045. Puede registrar compra desde el menu.`
  - panel activo se mantuvo en `Registrar cliente`.
  - panel `Registrar compra` permanecio oculto.
  - cliente quedo seleccionado y visible en lista con `Puntos 0`.

Evidencia de duplicado pasando a `Registrar compra`:
- Se reintento registrar el mismo cliente.
- Resultado:
  - mensaje `Ya existe un cliente con ese telefono o email. Abrimos su registro de compra.`
  - boton activo `Registrar compra`.
  - panel visible `purchase`.
  - formulario `purchase-form` visible.
  - foco en `purchase-invoice-number`.
  - cliente seleccionado con `Puntos actuales 0`.

Evidencia de boton desde compra hacia `Redimir puntos`:
- En panel `Registrar compra` existe boton `Ir a redimir puntos`.
- Al usarlo:
  - boton activo cambia a `Redimir puntos`.
  - panel visible `redemption`.
  - formulario `redemption-form` visible.
  - foco en `redemption-points`.
  - cliente seleccionado se conserva con `Puntos actuales 100`.

Confirmacion de que compra sigue funcionando:
- Cliente usado:
  - `Task 058 Cliente 00871045`
- Compra registrada:
  - factura `T058-P-00871045`
  - monto `2000`
- Resultado:
  - mensaje `Compra registrada. Puntos ganados: 100.`
  - saldo visible `Puntos actuales 100`.

Confirmacion de que redencion sigue funcionando:
- Desde el boton `Ir a redimir puntos`, se registro canje:
  - puntos `25`
  - nota `Canje QA TASK-058`
- Resultado:
  - mensaje `Canje registrado. Puntos redimidos: 25.`
  - saldo visible `Puntos actuales 75`.
  - fila del cliente actualizada a `Puntos 75`.

Evidencia responsive desktop/mobile:
- Desktop `1280x800`:
  - columnas: menu `220px`, panel activo y lista de clientes.
  - `scrollWidth 1280`.
  - sin overflow horizontal.
  - sin controles fuera de pantalla.
  - panel visible `purchase` al cambiar por menu.
- Mobile `390x780`:
  - layout de una columna.
  - menu superior de tres opciones.
  - `scrollWidth 375`.
  - sin overflow horizontal.
  - sin controles fuera de pantalla.
  - solo panel activo visible.

Resultado:
Aprobado en ambiente local contra API estable. Listo para commit/deploy a Static Web Apps y posterior QA en URL publicada.

Riesgos o pendientes:
- La URL publicada `https://calm-dune-075dc5c0f.7.azurestaticapps.net` no refleja estos cambios hasta que se suban a GitHub y corra el deploy de Static Web Apps.
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se tocaron contratos API, backend/API, recursos Azure ni secretos.

Siguiente recomendado:
- Commit/deploy de estos cambios.
- TASK-059: QA valida en URL publicada menu lateral, transiciones, compra y redencion.
