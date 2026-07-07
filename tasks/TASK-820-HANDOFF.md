Equipo: Web Dev
Modo de ejecucion: Promociones / UI destinatarios
Tarea completada: TASK-820 - Agregar Seleccionar todos elegibles y quitar limite visual de 5

Resultado:
- Eliminado el limite visual de 5 destinatarios seleccionados en Enviar campanas.
- El contador muestra la cantidad real seleccionada sin texto `de 5`.
- El boton Enviar campana se habilita con campana seleccionada y al menos un destinatario, sin tope visual.
- El mensaje de confirmacion usa la cantidad real de destinatarios.
- Se cambio la accion rapida a `Seleccionar todos elegibles`.
- La seleccion rapida opera sobre el listado/filtro/busqueda visible actual.
- Los checkboxes ya no se bloquean por cantidad seleccionada.
- Se mantienen bloqueados los clientes no elegibles:
  - dados de baja;
  - suprimidos;
  - sin email valido;
  - no aptos para la campana.
- Se mantiene `Limpiar seleccion`, `Con puntos`, filtro `Todos` y busqueda.
- El mock local fue alineado para rechazar destinatarios no elegibles con error controlado en vez de omitirlos silenciosamente.
- No se cambio API adicional fuera del consumo existente.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-820-HANDOFF.md`

Detalle UI:
- Copy del panel Enviar campanas ya no menciona `hasta 5 clientes`.
- Boton de accion rapida: `Seleccionar todos elegibles`.
- `getVisibleCommunicationCustomers()` centraliza el filtro activo + busqueda para render y acciones rapidas.
- `selectPromotionalRecipientsByRule()` toma los clientes visibles actuales y no corta al llegar a 5.
- `renderCommunicationCustomerCard()` solo deshabilita por elegibilidad, no por cantidad seleccionada.
- `updatePromotionalSendState()` ya no usa `selectedCount <= 5`.
- `sendPromotionalCampaign()` ya no bloquea localmente selecciones mayores a 5.

Validaciones:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `node --test api/test/promotional-campaigns.test.js`
- `npm --prefix api test`
- `npx prettier --check api/src/lib/validators.js api/src/lib/repository.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis Web OK.
- Test focal promociones: 23/23 pass.
- Suite API completa: 179/179 pass.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: cambio local de UI/mock y validacion automatizada; no se requeria DB real.

Riesgos o pendientes:
- QA debe validar visualmente que la accion `Seleccionar todos elegibles` respete filtro, busqueda y estados no elegibles en la pantalla publicada/local.
