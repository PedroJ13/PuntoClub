Equipo:
Web Dev

Tarea completada:
TASK-063 - Redisenar pantalla web en una sola vista por zonas.

Fecha:
2026-06-06

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-063-HANDOFF.md`

Ambiente probado:
- Local: `http://127.0.0.1:4175`
- API estable usada por `app-config.js`: `https://func-puntoclub-prod-br-001.azurewebsites.net`
- URL publicada objetivo: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Cambios realizados:
- Se elimino el menu lateral/tabs de TASK-058.
- Se implemento una pantalla operativa en una sola vista con 4 zonas:
  - Zona 1: `Buscar cliente`.
  - Zona 2: `Registrar cliente`.
  - Zona 3: `Resultados`.
  - Zona 4: `Operacion`.
- La busqueda, registro, resultados y panel operativo conviven en la misma pantalla.
- El panel operativo inferior alterna entre:
  - compra;
  - redencion.
- Los resultados son compactos y muestran:
  - nombre;
  - telefono/email;
  - `Pts.`;
  - accion `Compra`;
  - accion `Redimir` solo cuando el cliente tiene puntos disponibles.
- Despues de compra o redencion:
  - se actualizan puntos;
  - se limpia/oculta el formulario operativo;
  - el foco vuelve a buscar.
- No se tocaron contratos API, backend/API, Azure ni secretos.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Navegador local contra API estable.
- Consola del navegador sin errores criticos.
- Responsive:
  - desktop `1280x800`
  - mobile `390x780`

Evidencia de las 4 zonas:
- Titulos visibles en carga inicial:
  - `Buscar cliente`
  - `Registrar cliente`
  - `Resultados`
  - `Operacion`
- No existe `.panel-nav` en DOM (`hasMenu: false`).
- Texto inicial de resultados:
  - `Busque un cliente para operar o registre uno nuevo.`
- Texto inicial de operacion:
  - `Seleccione una accion de un cliente para registrar compra o redimir puntos.`

Evidencia de foco default en buscar:
- Al abrir `http://127.0.0.1:4175`:
  - fuente `API real`.
  - elemento activo `customer-search`.

Evidencia de busqueda sin resultado pasando a registro:
- Busqueda usada:
  - `NORESULT-FRESH-1780753946785`
- Resultado:
  - foco paso a `customer-name`.
  - feedback `No encontramos ese cliente. Complete el registro para crearlo.`
  - resultados muestra `Sin resultados. Registre el cliente en la zona 2.`

Evidencia de registro nuevo pasando a resultados:
- Cliente creado:
  - `Task 063 Cliente 53781769`
  - telefono `+50653781769`
  - email `task063-53781769@example.com`
- Resultado:
  - mensaje `Cliente registrado: Task 063 Cliente 53781769.`
  - busqueda quedo con `+50653781769`.
  - resultados muestra el cliente creado.
  - fila seleccionada.
  - puntos iniciales `Pts. 0`.
  - panel operativo sigue limpio/inactivo.
  - foco vuelve a `customer-search`.

Evidencia de duplicado buscando/seleccionando existente:
- Se intento registrar nuevamente el mismo cliente.
- Resultado:
  - mensaje `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - busqueda quedo con `+50653781769`.
  - resultados muestra el cliente existente.
  - fila seleccionada.
  - foco vuelve a `customer-search`.

Evidencia de compra desde resultados usando panel inferior:
- Accion usada en resultados:
  - `Compra`
- Panel inferior:
  - titulo `Registrar compra`.
  - formulario de compra visible.
  - formulario de redencion oculto.
  - foco en `purchase-invoice-number`.
  - cliente seleccionado visible con `Pts. actuales 0`.
- Compra registrada:
  - factura `T063-P-53781769`
  - monto `2000`
  - mensaje `Compra registrada. Pts. ganados: 100.`
  - resultados actualizados a `Pts. 100`.
  - panel operativo limpio/oculto.
  - foco vuelve a `customer-search`.

Evidencia de redencion desde resultados usando panel inferior:
- Despues de la compra, la fila mostro accion `Redimir`.
- Accion usada:
  - `Redimir`
- Panel inferior:
  - titulo `Redimir puntos`.
  - formulario de redencion visible.
  - formulario de compra oculto.
  - foco en `redemption-points`.
  - cliente seleccionado visible con `Pts. actuales 100`.
- Redencion registrada:
  - puntos `25`
  - nota `Canje QA TASK-063`
  - mensaje `Canje registrado. Pts. redimidos: 25.`
  - resultados actualizados a `Pts. 75`.
  - panel operativo limpio/oculto.
  - foco vuelve a `customer-search`.

Evidencia desktop/mobile:
- Desktop `1280x800`:
  - zonas visibles con posiciones:
    - busqueda top `95`, width `478`;
    - registro top `95`, width `748`;
    - resultados top `442`, width `1240`;
    - operacion top `595`, width `1240`.
  - `scrollWidth 1280`.
  - sin overflow horizontal.
  - sin controles fuera de pantalla.
- Mobile `390x780`:
  - orden logico:
    - buscar;
    - registrar;
    - resultados;
    - operacion.
  - `scrollWidth 375`.
  - sin overflow horizontal.
  - sin controles fuera de pantalla.

Resultado:
Aprobado en ambiente local contra API estable. Listo para commit/deploy a Static Web Apps y posterior QA en URL publicada.

Riesgos o pendientes:
- La URL publicada `https://calm-dune-075dc5c0f.7.azurestaticapps.net` no refleja estos cambios hasta que se suban a GitHub y corra el deploy de Static Web Apps.
- Las pruebas crean datos reales de QA en la empresa piloto.
- En mobile las zonas se apilan; esto conserva el orden logico aunque requiere scroll normal de pantalla pequena.

Siguiente recomendado:
- Commit/deploy de estos cambios.
- TASK-064: QA valida pantalla web por zonas y flujo foco/busqueda/registro/operacion en URL publicada.
