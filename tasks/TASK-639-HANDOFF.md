Equipo: QA
Tarea validada: TASK-639 - Validar envio promocional con destinatarios seleccionados sin 500
Ambiente: Local controlado en `api/` con tests Node y stubs/mocks in-memory. Sin Azure SQL, sin API publicada, sin ACS real y sin envio de correos reales.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`.
- `tasks/TASK-639.md`: no existe en workspace; se uso el alcance pegado por el Product Owner.
- Lectura de `tasks/TASK-637-HANDOFF.md` y `tasks/TASK-638-HANDOFF.md`.
- Revision focal de `api/src/functions/promotionalCampaigns.js`, `api/src/lib/repository.js` y `api/test/promotional-campaigns.test.js`.
- `node --check api\src\functions\promotionalCampaigns.js`.
- `node --check api\src\lib\repository.js`.
- `node --check api\test\promotional-campaigns.test.js`.
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js` en `api/`.
- Prueba directa local de `sendPromotionalCampaignToRecipients` con `repositoryAdapter` fake y `sendEmail` mock, usando `customerIds` seleccionados `[100, 101, 102]`.
Hallazgos:
- La suite API paso completa: `160` tests ejecutados, `160` passed, `0` failed.
- El test anti-regresion `promotional send default repository adapter exports selected-recipient operations` paso y confirma que el repositorio real exporta:
  - `replacePromotionalCampaignRecipients`;
  - `beginPromotionalCampaignSend`;
  - `getCompanySettings`;
  - `listPendingPromotionalCampaignRecipientsForSend`;
  - `recordPromotionalCampaignRecipientResult`;
  - `completePromotionalCampaignSend`.
- La prueba directa con stub invoco `replacePromotionalCampaignRecipients` con `companyId=10`, `campaignId=5` y `customerIds=[100,101,102]`.
- El flujo preparo destinatarios seleccionados antes de iniciar el envio.
- El mock de envio proceso solo destinatarios elegibles/suscritos: intento enviar a `ana@example.com` y `luis@example.com`.
- El destinatario dado de baja `Marta` fue omitido con `skipReason=unsubscribed`.
- El resultado mixto fue controlado: `selected=3`, `sent=1`, `failed=1`, `skipped=1`.
- No se reprodujo el `TypeError: repositoryAdapter.replacePromotionalCampaignRecipients is not a function`.
- No hubo `500` en la validacion local.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existe archivo local `tasks/TASK-639.md`; se uso el alcance del chat.
Evidencia:
- Sintaxis OK:
  - `node --check api\src\functions\promotionalCampaigns.js`.
  - `node --check api\src\lib\repository.js`.
  - `node --check api\test\promotional-campaigns.test.js`.
- Suite API: `1..160`, `pass 160`, `fail 0`.
- Prueba directa stub:
  - `selectedPayloads=[{ companyId: 10, campaignId: 5, customerIds: [100, 101, 102] }]`.
  - `sentMessages=["ana@example.com","luis@example.com"]`.
  - `summary={ selected: 3, sent: 1, failed: 1, skipped: 1 }`.
  - `statuses=["sent","failed","skipped"]`.
  - `failedReason=provider_not_sent`.
  - `skippedReason=unsubscribed`.
- Warnings esperados de `@azure/functions` en modo test local; no afectan el resultado.
Uso DB cloud: No. Validacion local con tests y stubs; no se consulto Azure SQL ni ambiente cloud.
Riesgos o pendientes:
- Esta QA valida el fix local y el contrato con mocks/stubs. Falta publicar API para corregir el `500` en ambiente publicado.
- Despues del deploy, corresponde QA/PO controlado del flujo publicado con destinatario autorizado, sin ampliar destinatarios ni exponer secretos.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y, si corresponde, abrir tarea de release/deploy API y QA publicado posterior.
