Equipo: Backend/API
Modo de ejecucion: Promociones / Anti-duplicado envio
Tarea completada: TASK-739 - Corregir bloqueo anti-duplicado en envio promocional

Resultado:
- Se reviso el flujo real de envio promocional cuando `sendPromotionalCampaignToRecipients` recibe `customerIds`.
- Se confirmo que el flujo llama `replacePromotionalCampaignRecipients` antes de iniciar el envio.
- Se corrigio `replacePromotionalCampaignRecipients` para no reabrir campañas ya `sent`/`failed` ni permitir recrear destinatarios para reenviar en la misma campaña.
- Se mantiene la regla anti-duplicado por `campaignId + customerId`:
  - Si un cliente ya tiene un destinatario no pendiente en la campaña, se devuelve `409 PROMOTIONAL_RECIPIENT_ALREADY_SELECTED`.
  - Si la campaña ya no esta en estado editable para preparar destinatarios, se devuelve `PROMOTIONAL_CAMPAIGN_NOT_EDITABLE`.
- No se relajo SQL ni se cambio la unique index existente.
- No se cambio ACS, sender, flags ni se enviaron correos reales.

Cambios realizados:
- `api/src/lib/repository.js`
  - Antes de borrar/recrear destinatarios `pending`, consulta si alguno de los `customerIds` ya existe en la campaña con estado distinto de `pending`.
  - Si existe, corta con `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED`.
  - Limita preparacion de destinatarios a campañas `draft` o `ready`; ya no permite preparar/reabrir `sent` o `failed`.
- `api/test/promotional-campaigns.test.js`
  - Agrega cobertura para confirmar que un duplicado en preparacion de destinatarios corta el flujo antes de invocar `sendEmail`.

Validacion local:
- `node --check api/src/lib/repository.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npx prettier --check api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`
- `git diff --check -- api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
  - Resultado: `167` tests passed, `0` failed.

Uso Azure SQL:
- No.
- Motivo: correccion local de repositorio y tests; no se consultaron ni modificaron datos reales.

Correos reales / flags:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se tocaron ACS, sender, secretos ni configuracion Azure.

Riesgos o pendientes:
- Pendiente QA local/publicada para validar el caso end-to-end con API real/local y UI.
- Si una campaña `sent` recibe un cliente nuevo, ahora se bloquea como campaña no editable; para reenviar promociones se debe crear una nueva campaña.
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-739.md` no existen en este checkout; se uso como fuente la tarea pegada por Product Owner.
