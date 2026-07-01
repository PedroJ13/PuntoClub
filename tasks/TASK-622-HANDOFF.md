Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Diagnostico envio promocional
Tarea completada: TASK-622 - Trazar ultimo intento de envio promocional a Fatima Arraiz

Resultado:
- Se reviso el ambiente publicado en Azure SQL para `companyId=8`, `customerId=112`, cliente Fatima Arraiz, correo enmascarado `fa***@gmail.com`.
- No se reenviaron correos.
- No se modificaron datos.
- No existe registro persistido en `dbo.PromotionalCampaignRecipients` para `customerId=112` ni para el correo indicado.
- No hay `provider`, `providerMessageId`, `lastError`, `skippedReason`, `sentAt` ni `updatedAt` de destinatario para Fatima porque no existe fila de destinatario.

Datos confirmados:
- Cliente:
  - `companyId=8`
  - `customerId=112`
  - nombre: Fatima Arraiz
  - email enmascarado: `fa***@gmail.com`
  - estado promocional actual: `subscribed`
- Coincidencias directas en `PromotionalCampaignRecipients`:
  - `0`
- Destinatarios promocionales recientes de `companyId=8`:
  - `0`

Campanas revisadas en `companyId=8`:
- `campaignId=5`, `Promo clientes frecuentes`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T15:33:46Z`.
- `campaignId=7`, `QA TASK-616 917797`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T15:33:07Z`.
- `campaignId=4`, `Promo clientes frecuentes`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T15:27:20Z`.
- `campaignId=6`, `QA TASK-601 704778`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T14:52:03Z`.
- `campaignId=2`, `Promo clientes frecuentes`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T13:11:12Z`.
- `campaignId=3`, `Promo clientes frecuentes`, estado `draft`, `recipients=0`, `sent=0`, `failed=0`, `skipped=0`, `providerMessages=0`, `updatedAt=2026-07-01T13:11:09Z`.

Respuesta esperada del endpoint segun contrato/codigo:
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send` requiere sesion de empresa, `confirmSend=true` y `customerIds`.
- Si el envio hubiera procesado correctamente a Fatima como destinataria elegible, deberia existir una fila en `PromotionalCampaignRecipients` para `customerId=112` con estado final `sent`, `failed` u `omitted/skipped`, y el response incluiria esa fila en `recipients` junto con `summary`.
- Como no hay fila persistida para Fatima ni para otros destinatarios de la empresa 8, el ambiente publicado no muestra evidencia de un `200 OK` de envio real que haya procesado a Fatima.
- Si se invoco el endpoint y la seleccion no genero destinatarios elegibles, la respuesta esperada seria un resumen sin enviados y sin destinatarios procesados; no habria `providerMessageId`.

Verificacion ejecutada:
- Consulta read-only a `dbo.Customers`, `dbo.CustomerPromotionalEmailPreferences`, `dbo.PromotionalCampaigns` y `dbo.PromotionalCampaignRecipients`.
- Revision local de contrato/codigo de envio en:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`
  - `api/src/lib/validators.js`

Uso Azure SQL:
- Si.
- Motivo: la tarea pidio revisar el ambiente publicado y la trazabilidad real del intento.
- Alcance: consultas read-only.

Firewall / acceso temporal:
- Se uso regla temporal SQL:
  - `tmp-task622-promosend-200-229-6-68`
  - inicialmente `200.229.6.68-200.229.6.68`
- El intento de borrado fue bloqueado por el lock `puntoclub-sqlserver-cannotdelete`.
- No se retiro el lock desde esta tarea.
- Alternativa segura aplicada:
  - regla neutralizada a `0.0.0.1-0.0.0.1`.
- Verificacion final:
  - regla `tmp-task622-promosend-200-229-6-68`: `0.0.0.1-0.0.0.1`
  - lock SQL Server `puntoclub-sqlserver-cannotdelete`: presente
  - lock SQL DB `puntoclub-sqldb-cannotdelete`: presente

Riesgos o pendientes:
- No hay evidencia SQL de envio promocional real para Fatima; si el usuario percibio que envio, el problema probable esta antes de persistir/procesar destinatarios o en feedback visual de la UI.
- Recomendado validar con TASK-623 que la UI muestre resultado persistente/error visible luego de confirmar envio.
- Recomendado crear tarea Infra para eliminar reglas temporales neutralizadas cuando se gestione el lock con aprobacion explicita.
