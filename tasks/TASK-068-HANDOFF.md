Equipo:
QA

Tarea validada:
TASK-068 - Revalidar layout ajustado despues del deploy.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewports:
  - Desktop `1280x800`
  - Mobile `390x780`

Resultado:
No aprobado.

Resumen:
El deploy ya refleja el layout principal de TASK-066: no aparecen los labels superiores `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4`, el orden desktop/mobile es el esperado y el flujo cliente + compra + redencion funciono sin romper. Sin embargo, en el estado de busqueda sin resultados aparece el texto visible `Sin resultados. Registre el cliente en la zona 2.`, que reintroduce una referencia a zona y contradice el criterio de no mostrar `Zona X` ni labels equivalentes.

Checks ejecutados:
- Lectura HTTP de HTML publicado.
- Confirmacion de ausencia de `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4` en HTML inicial.
- Confirmacion de ausencia de `.panel-nav` y `[data-panel]` en HTML publicado.
- Validacion desktop de layout por cajas.
- Validacion mobile de orden visual y overflow horizontal.
- Busqueda con multiples resultados usando `QA`.
- Busqueda sin resultado.
- Registro de cliente nuevo.
- Reintento de registro duplicado.
- Busqueda de cliente unico por telefono.
- Apertura de panel inferior de compra.
- Registro de compra y actualizacion de puntos.
- Apertura de panel inferior de redencion.
- Redencion de puntos y actualizacion de puntos.
- Confirmacion de foco de regreso a `customer-search` despues de compra/redencion.

Hallazgos:
P0/P1:
- P1: La pantalla publicada muestra una referencia visible a zona en el estado sin resultados: `Sin resultados. Registre el cliente en la zona 2.`. Aunque no es el label superior `Zona 2`, es un label/referencia equivalente dentro del flujo de busqueda y bloquea la aceptacion del criterio visual de TASK-068.

P2/P3:
- P2: La busqueda amplia `QA` devuelve muchos clientes y la UI tarda varios segundos en completar balances antes de pintar resultados. La API responde `200`, pero para listas grandes la experiencia queda temporalmente en `Buscando clientes...`. No bloqueo la prueba porque finalmente renderizo resultados.

Evidencia desktop:
- Viewport `1280x800`.
- Sin labels `Zona X` en pantalla inicial:
  - `zoneLabels: []`
  - `hasPanelNav: false`
  - `hasDataPanel: false`
- `Buscar cliente`:
  - top `95`
  - left `20`
  - width `776`
  - height `155`
- `Resultados`:
  - top `265`
  - left `20`
  - width `776`
  - height `353`
- `Registrar cliente`:
  - top `95`
  - left `810`
  - width `450`
  - height `522`
- `Operacion`:
  - top `632`
  - left `20`
  - width `1240`
  - height `120`
- Sin overflow horizontal:
  - `scrollWidth: 1280`
  - `overflowX: false`
  - `offscreenCount: 0`

Evidencia mobile:
- Viewport `390x780`.
- Orden visual:
  - `Buscar cliente` top `144`
  - `Resultados` top `398`
  - `Registrar cliente` top `554`
  - `Operacion` top `1026`
- Ancho de paneles: `370`.
- Sin overflow horizontal:
  - `scrollWidth: 390`
  - `overflowX: false`
  - `offscreenCount: 0`

Evidencia de resultado multiple:
- Busqueda: `QA`.
- API directa respondio `200` con multiples clientes.
- UI renderizo multiples filas, incluyendo:
  - `QA Smoke 1780430104689 ... PTS. 173 Compra Redimir`
  - `QA Smoke 1780435470439 ... PTS. 49 Compra Redimir`
  - `QA Smoke 1780435841290 ... PTS. 49 Compra Redimir`
  - `QA Task029 1780436267875 ... PTS. 750 Compra Redimir`
  - `QA Task038 1780497970254 ... PTS. 0 Compra`
- Cada resultado revisado mostro datos principales, puntos `PTS.` y accion `Compra`; cuando tenia puntos tambien mostro `Redimir`.

Evidencia funcional:
- Cliente creado para QA:
  - nombre `Task 068 Cliente 60912069`
  - telefono `+50668912069`
  - email `task068-60912069@example.com`
- Busqueda sin resultado:
  - termino `NORESULT-T068-60912069`
  - mensaje superior `No encontramos ese cliente. Complete el registro para crearlo.`
  - foco `customer-name`
  - texto de lista `Sin resultados. Registre el cliente en la zona 2.`
- Registro nuevo:
  - mensaje `Cliente registrado: Task 068 Cliente 60912069.`
  - busqueda queda en `+50668912069`
  - foco `customer-search`
  - fila muestra `PTS. 0` y `Compra`
- Duplicado:
  - mensaje `Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
  - selecciona el existente
  - foco `customer-search`
- Compra:
  - abre panel inferior con titulo `Registrar compra`
  - foco `purchase-invoice-number`
  - factura `T068-P-60912069`
  - monto `2000`
  - mensaje `Compra registrada. Pts. ganados: 100.`
  - fila actualizada a `PTS. 100`
  - formularios compra/redencion ocultos
  - foco `customer-search`
- Redencion:
  - boton `Redimir` disponible despues de tener puntos
  - abre panel inferior con titulo `Redimir puntos`
  - foco `redemption-points`
  - puntos redimidos `25`
  - mensaje `Canje registrado. Pts. redimidos: 25.`
  - fila actualizada a `PTS. 75`
  - formularios compra/redencion ocultos
  - foco `customer-search`

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- La referencia `zona 2` puede confundir al usuario porque el layout ya no muestra zonas numeradas.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Web Dev debe cambiar el copy del estado sin resultados para no mencionar `zona 2`; por ejemplo, referirse a `Registrar cliente`.
- Reintentar QA puntual de TASK-068 despues del ajuste de copy publicado.
