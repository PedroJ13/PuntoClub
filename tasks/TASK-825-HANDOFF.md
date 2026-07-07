Equipo: Web Dev
Modo de ejecucion: Promociones / UX confirmacion
Tarea completada: TASK-825 - Mostrar cantidad real en confirmacion final de envio promocional

Resultado:
- Ajustado el modal final de confirmacion de Enviar campanas para mostrar explicitamente la cantidad real de destinatarios seleccionados.
- El mensaje ahora abre con:
  - `Vas a enviar esta campana a N destinatarios seleccionados.`
- El nombre de la campana queda separado para mayor claridad.
- Se mantiene el aviso de que no se enviara a clientes no seleccionados ni dados de baja.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-825-HANDOFF.md`

Detalle UI:
- Se agrego `recipientCount` desde `selectedCustomerIds.length`.
- Se agrego `recipientLabel` para singular/plural.
- `window.confirm` usa la cantidad real en la primera linea del mensaje.
- Se mantiene el bloqueo existente cuando no hay campana o no hay destinatarios seleccionados.

Validaciones:
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis Web OK.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: ajuste local de copy/UX en Web, sin datos ni backend.

Riesgos o pendientes:
- QA debe validar visualmente el modal final con 1 y multiples destinatarios seleccionados.
