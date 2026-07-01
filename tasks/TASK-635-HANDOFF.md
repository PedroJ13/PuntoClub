Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Diagnostico envio promocional
Tarea completada: TASK-635 - Diagnosticar Unexpected API error al enviar campana promocional

Resultado:
- Se diagnostico el intento publicado de envio promocional desde Aurisbel `companyId=8`.
- Campana revisada: `campaignId=7`, `QA TASK-616 917797`.
- Destinatario solicitado: Fatima Arraiz, `customerId=112`, email enmascarado `fa***@gmail.com`.
- No se reenviaron correos.
- No se modificaron feature flags.
- No se modificaron datos de negocio.
- No se aplico correccion Backend/API en esta tarea porque el alcance era diagnostico.

Intento publicado identificado:
- Hora UTC: `2026-07-01T17:42:03.6302838Z`.
- Endpoint: `POST https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/8/promotional-campaigns/7/send`.
- Function: `sendPromotionalCampaign`.
- Status real: `500`.
- Operation Id: `c2c3981be0bdcb39686f0460c350361b`.
- Duracion: `106.6 ms`.

Excepcion en logs:
- Application Insights `traces`, severity `3`.
- Mensaje:
  - `TypeError: repositoryAdapter.replacePromotionalCampaignRecipients is not a function`
  - Ubicacion:
    - `/home/site/wwwroot/src/functions/promotionalCampaigns.js:135:29`
    - `/home/site/wwwroot/src/functions/promotionalCampaigns.js:392:26`
    - `/home/site/wwwroot/src/lib/http.js:74:14`

Causa tecnica confirmada:
- `sendPromotionalCampaignToRecipients` intenta llamar `repositoryAdapter.replacePromotionalCampaignRecipients(...)` cuando recibe `customerIds` en el payload.
- `api/src/lib/repository.js` define la funcion `replacePromotionalCampaignRecipients`.
- Pero `replacePromotionalCampaignRecipients` no esta exportada en `module.exports`.
- Por eso el objeto `repository` inyectado como `repositoryAdapter` no tiene esa funcion y el endpoint falla antes de preparar destinatarios.

SQL / persistencia:
- Consulta read-only en Azure SQL confirmo:
  - Fatima existe en `companyId=8`, `customerId=112`.
  - Fatima esta en estado promocional `subscribed`.
  - Campana `7` sigue en estado `draft`.
  - `confirmedAt = NULL`.
  - `sentAt = NULL`.
  - `recipients = 0`.
  - `sent = 0`.
  - `failed = 0`.
  - `skipped = 0`.
  - `providerMessages = 0`.
- No existe fila en `dbo.PromotionalCampaignRecipients` para Fatima en la campana 7.
- No hay `recipientId`.
- No hay `provider`.
- No hay `providerMessageId`.
- No hay `lastError`.
- No hay `skippedReason`.
- No hay `recipientSentAt` ni `recipientUpdatedAt`.

ACS:
- Application Insights `dependencies` para el operation id fallido no mostro dependencias.
- La excepcion ocurre antes de insertar destinatarios y antes de invocar envio por ACS.
- No hay evidencia de invocacion ACS para este intento.

Verificacion ejecutada:
- Application Insights `requests` para `sendPromotionalCampaign`.
- Application Insights `traces` filtrado por operation id.
- Application Insights `dependencies` filtrado por operation id.
- Consulta read-only de Azure SQL sobre:
  - `dbo.Customers`
  - `dbo.CustomerPromotionalEmailPreferences`
  - `dbo.PromotionalCampaigns`
  - `dbo.PromotionalCampaignRecipients`
- Revision local de codigo:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`

Uso Azure SQL:
- Si.
- Motivo: confirmar si el intento publicado dejo destinatario/estado/proveedor persistido.
- Alcance: consultas read-only.

Firewall / acceso temporal:
- La conexion inicial fue bloqueada por firewall para la IP local `200.229.6.68`.
- Se creo regla temporal estrecha:
  - `tmp-task635-promosend-200-229-6-68`
  - `200.229.6.68-200.229.6.68`
- El intento de borrado fue bloqueado por el lock `puntoclub-sqlserver-cannotdelete`.
- No se retiro el lock desde esta tarea.
- Alternativa segura aplicada:
  - regla neutralizada a `0.0.0.1-0.0.0.1`.
- Verificacion final:
  - regla `tmp-task635-promosend-200-229-6-68`: `0.0.0.1-0.0.0.1`
  - lock SQL Server `puntoclub-sqlserver-cannotdelete`: presente
  - lock SQL DB `puntoclub-sqldb-cannotdelete`: presente

Riesgos o pendientes:
- Requiere una tarea Backend/API de correccion: exportar `replacePromotionalCampaignRecipients` desde `api/src/lib/repository.js`, agregar test de envio con `customerIds` y publicar API.
- Hasta corregir y publicar API, el envio promocional real con destinatarios seleccionados seguira fallando con `500`.
- Recomendado no reintentar envio real hasta publicar la correccion Backend/API y validar QA.
