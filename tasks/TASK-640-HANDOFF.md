Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-640 - Decidir publicacion de correccion envio promocional

Resultado:
- Se revisaron los handoffs `TASK-635`, `TASK-636`, `TASK-637`, `TASK-638` y `TASK-639`.
- Se aprueba publicar la correccion API/Web del envio promocional.
- La publicacion aprobada incluye:
  - fix Backend/API para exportar `replacePromotionalCampaignRecipients`;
  - test anti-regresion de operaciones requeridas por el adaptador real;
  - mensaje Web seguro para error 500 en envio promocional.

Hallazgos procesados:
- `TASK-635` confirmo que el intento publicado fallo con `500` por:
  - `TypeError: repositoryAdapter.replacePromotionalCampaignRecipients is not a function`.
- `TASK-635` confirmo que el error ocurrio antes de persistir destinatarios y antes de invocar ACS.
- `TASK-636` confirmo que ACS no recibio intento verificable para ese caso.
- `TASK-637` mejoro el mensaje Web para no mostrar `Unexpected API error` en envios promocionales fallidos.
- `TASK-638` corrigio la causa raiz local:
  - `replacePromotionalCampaignRecipients` ahora queda exportada desde `api/src/lib/repository.js`.
  - Se agrego prueba anti-regresion para validar que el repositorio real exporta operaciones requeridas por `sendPromotionalCampaignToRecipients`.
- `TASK-639` aprobo QA local:
  - suite API `160/160` passed;
  - prueba directa con `customerIds` seleccionados proceso resultado mixto `sent/failed/skipped`;
  - no se reprodujo el `TypeError`;
  - no hubo `500`.

Decision:
- Publicar API y Web.
- No repetir prueba real hasta que los workflows API/Web terminen en `success`.
- Mantener prueba real posterior limitada a destinatarios autorizados por Product Owner.

Confirmaciones de alcance:
- No cambiar feature flags.
- No reenviar correos desde esta decision.
- No ejecutar envio real.
- No cambiar ACS, sender ni secretos.
- No ejecutar migraciones SQL.
- No modificar datos de negocio.

Validacion adicional ejecutada por Product / Architect / Release:
- `node --check api\src\lib\repository.js`: OK.
- `node --check api\test\promotional-campaigns.test.js`: OK.
- `node --check app\src\app.js`: OK.
- `git diff --check -- api\src\lib\repository.js api\test\promotional-campaigns.test.js app\src\app.js`: OK.
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js` en `api/`: `160/160` passed.

Riesgos o pendientes:
- La validacion fue local; falta confirmar deploy API/Web publicado.
- Despues del deploy, PO puede repetir prueba real controlada con Fatima o destinatario autorizado.
- Si aparece `providerMessageId`, Infra puede revisar telemetria ACS.

Uso Azure SQL:
- No en esta tarea.
- Se proceso evidencia de `TASK-635`, que uso Azure SQL read-only para confirmar que el intento fallido no dejo destinatarios ni provider.

Siguiente recomendado:
- Ejecutar `TASK-641` para commit y push controlado de la correccion API/Web.
