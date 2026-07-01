Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Correccion envio promocional
Tarea completada: TASK-638 - Corregir 500 al enviar campana promocional con destinatarios seleccionados

Archivos cambiados:
- `api/src/lib/repository.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-638-HANDOFF.md`

Implementacion:
- Se exporto `replacePromotionalCampaignRecipients` desde `api/src/lib/repository.js`.
- Esto corrige la causa del `500` diagnosticado en TASK-635:
  - `TypeError: repositoryAdapter.replacePromotionalCampaignRecipients is not a function`.
- No se cambiaron reglas de envio.
- No se cambio el feature flag de envio promocional.
- No se envio ningun correo real.
- No se modifico ACS, sender ni secretos.

Prueba agregada:
- Se agrego el test:
  - `promotional send default repository adapter exports selected-recipient operations`
- La prueba valida que el adaptador real exportado por `repository.js` exponga las operaciones requeridas por `sendPromotionalCampaignToRecipients`, incluyendo:
  - `replacePromotionalCampaignRecipients`
  - `beginPromotionalCampaignSend`
  - `getCompanySettings`
  - `listPendingPromotionalCampaignRecipientsForSend`
  - `recordPromotionalCampaignRecipientResult`
  - `completePromotionalCampaignSend`
- Esta prueba evita repetir la regresion donde el fake del test tenia el metodo, pero el repositorio real exportado no.

Verificacion ejecutada:
- `node --check api\src\lib\repository.js`
- `node --check api\test\promotional-campaigns.test.js`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
- Resultado del suite ejecutado:
  - `160` tests ejecutados
  - `160` passed
  - `0` failed
- `git diff --check -- api\src\lib\repository.js api\test\promotional-campaigns.test.js`

Uso Azure SQL:
- No.
- Motivo: correccion de export local y tests unitarios; no requiere DB real.

Riesgos o pendientes:
- Falta publicar API para que el ambiente publicado deje de responder `500` al enviar promociones con destinatarios seleccionados.
- Despues de publicar API, QA/PO debe repetir prueba controlada con destinatario autorizado.
- Si la prueba avanza hasta ACS, Infra puede validar telemetria solo si aparece `providerMessageId`.
