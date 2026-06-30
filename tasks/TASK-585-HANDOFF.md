Equipo: Ejecucion Tecnica
Modo de ejecucion: Comunicaciones / Promociones envio real
Tarea completada: TASK-585 - Habilitar envio real promocional controlado

Resultado:
- Se preparo el envio real promocional controlado usando Azure/ACS Email actual.
- El endpoint de envio ya no queda bloqueado por codigo despues del feature flag, pero conserva controles server-side.
- El envio real solo procesa destinatarios ya seleccionados en `dbo.PromotionalCampaignRecipients` para la campana.
- No se envia a clientes no seleccionados.
- Antes de enviar, la API exige `confirmSend: true`.
- Antes de enviar, la Web muestra una confirmacion explicita con nombre de campana y cantidad de destinatarios.
- Se mantiene el limite MVP de 5 destinatarios.
- Se revalida la preferencia promocional actual al momento de enviar; clientes dados de baja/suppressed se marcan `skipped` y no reciben correo.
- Se revalida correo actual al momento de enviar; destinatarios sin correo valido se marcan `skipped`.
- Cada destinatario queda registrado como `sent`, `failed` o `skipped`.
- La campana pasa por estado `sending` y luego queda `sent` si al menos un correo salio, o `failed` si ninguno salio.
- No se hicieron pruebas reales ni se enviaron correos reales.

Controles de seguridad:
- Requiere sesion autenticada de empresa heredada de las correcciones P0/P1 previas.
- Requiere que `companyId` de ruta coincida con empresa de sesion.
- Requiere `PROMOTIONAL_EMAIL_SEND_ENABLED=true`.
- Requiere ACS Email configurado (`ACS_EMAIL_CONNECTION_STRING`, `ACS_EMAIL_SENDER_ADDRESS` y display actual).
- Requiere payload `confirmSend: true`.
- Requiere campana en estado `ready`.
- Requiere al menos un destinatario `pending`.
- Requiere no superar `recipient_limit` MVP.

Archivos modificados:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`

Contrato API:
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send`
- Body requerido:
  - `{ "confirmSend": true }`
- Respuesta esperada:
  - `campaign`
  - `summary.selected`
  - `summary.sent`
  - `summary.failed`
  - `summary.skipped`
  - `recipients`

Mensajes / UX:
- El boton queda deshabilitado hasta que exista campana lista con destinatarios pendientes guardados.
- El boton muestra `Enviar a N`.
- La confirmacion del navegador indica cantidad de destinatarios seleccionados y aclara que no se envia a clientes no seleccionados ni dados de baja.
- El resultado visible resume enviados, fallidos y omitidos.
- Si el feature flag no esta activo, la UI muestra que el envio real no esta habilitado en servidor.
- Si ACS no esta configurado, la UI muestra que el remitente promocional no esta configurado.

Verificacion ejecutada:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/repository.js`
- `node --check api/src/lib/validators.js`
- `node --check api/test/promotional-campaigns.test.js`
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js`
  - Resultado: OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 21/21 OK.
- `npm test` en `api/`
  - Resultado: 154/154 OK.

Tests agregados:
- Confirmacion explicita requerida para envio.
- Render de email promocional a un destinatario seleccionado.
- Envio mockeado a destinatario suscrito seleccionado.
- Skip de destinatario dado de baja antes de llamar ACS.
- Skip por preferencia actual o correo faltante.

Uso Azure SQL:
- No.
- Motivo: implementacion y validacion local con tests/mocks. No se consulto ni modifico DB real.

Uso ACS / correos reales:
- No.
- Motivo: la tarea prohibe pruebas reales fuera de destinatarios controlados por PO. No se llamo ACS real.

Riesgos o pendientes:
- Requiere publicar API/Web antes de prueba PO.
- Requiere configurar `PROMOTIONAL_EMAIL_SEND_ENABLED=true` solo cuando Product/Release autorice la prueba real controlada.
- QA debe validar publicado con sesion real/controlada antes o durante la prueba PO:
  - no envia sin sesion;
  - no envia con empresa no autorizada;
  - no envia sin `confirmSend`;
  - no envia a no seleccionados;
  - no envia a bajas promocionales;
  - respeta maximo 5 destinatarios;
  - registra `sent/failed/skipped`.
