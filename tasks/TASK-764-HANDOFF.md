Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada
Tarea completada: TASK-764 - Preparar script seguro para eliminar campanas promocionales de prueba

Archivos cambiados:
- `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`
- `tasks/TASK-764-HANDOFF.md`

Evidencia local generada:
- `tmp/task764/task764-identification-readonly-redacted.json`
- `tmp/task764/task764-dry-run-evidence.json`
- `tmp/task764/task764-post-dry-run-rollback-validation.json`

SQL agregado o modificado:
- Se agrego script operativo seguro con `@DryRun = 1` por defecto:
  - `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`
- El script conserva exactamente:
  - `company_id = 8`
  - `campaign_id = 19`
  - `name = Nuevo`
  - `subject = Nueva Bebida`
  - `active_image_public_id = D750ABD9-206B-456F-9345-8C42A03271C8`
- Para un apply futuro requiere:
  - `@DryRun = 0`
  - `@ConfirmTask = N'TASK-764-APPLY'`

Controles incluidos:
- Valida que la campana a conservar exista y coincida con ID, nombre, asunto, imagen activa y envio reciente.
- Requiere al menos un recipient `sent` reciente si `@RequireRecentSentRecipient = 1`.
- Permite activar una guarda opcional por correo exacto con `@ExpectedRecentRecipientEmail`; queda `NULL` por defecto por la discrepancia detectada.
- Muestra evidencia previa:
  - parametros;
  - campana a conservar;
  - campanas a eliminar;
  - imagenes a eliminar;
  - recipients a eliminar;
  - eventos de baja que bloquearian apply;
  - resumen de conteos.
- Detiene apply si existen referencias en `dbo.PromotionalUnsubscribeEvents`.
- Borra en orden seguro solo dentro de transaccion:
  - `dbo.PromotionalCampaignRecipients`;
  - `dbo.PromotionalCampaignImages`;
  - `dbo.PromotionalCampaigns`.
- No borra blobs fisicos en storage.
- Hace `ROLLBACK` automatico en dry-run.

Verificacion ejecutada:
- Lectura de reglas de proyecto y guardrails Azure SQL.
- Consulta read-only de identificacion en Azure SQL.
- Ejecucion del script en dry-run contra Azure SQL.
- Validacion post dry-run/rollback.

Resultado del dry-run:
- Campana conservada:
  - `campaign_id = 19`;
  - `Nuevo - Nueva Bebida`;
  - `status = sent`;
  - `recipient_count = 1`;
  - `sent_recipient_count = 1`;
  - `acs_recipient_count = 1`;
  - imagen activa `D750ABD9-206B-456F-9345-8C42A03271C8`.
- Campanas que el script eliminaria:
  - `19` campanas.
- Imagenes metadata que el script eliminaria:
  - `6` filas.
- Recipients que el script eliminaria:
  - `0` filas.
- Eventos de baja bloqueantes:
  - `0`.
- Conteos no objetivo solo leidos:
  - `CustomerPromotionalEmailPreferences`: `2`;
  - `PromotionalUnsubscribeEvents`: `2`;
  - `Customers`: `10`;
  - `Purchases`: `11`;
  - `Redemptions`: `1`;
  - `CustomerMemberships`: `0`.
- Validacion dentro de transaccion en dry-run:
  - quedarian `0` campanas eliminadas remanentes;
  - quedarian `0` imagenes eliminadas remanentes;
  - quedarian `0` recipients eliminados remanentes;
  - la campana conservada seguiria existiendo.
- Validacion post-rollback:
  - campañas actuales: `20`;
  - imagenes actuales: `7`;
  - recipients actuales: `1`;
  - `campaign_id = 19` sigue existiendo en `sent`.

Nota de discrepancia:
- La tarea menciona envio reciente a `pj13eros@hotmail.com`.
- La evidencia SQL actual muestra que el recipient reciente de `campaign_id = 19` existe, fue enviado por ACS, pero el correo redaccionado no coincide con `pj13eros@hotmail.com`.
- Por eso `@ExpectedRecentRecipientEmail` quedo `NULL` por defecto y se documento que Product debe confirmar si el correo exacto es obligatorio antes de aplicar.

Uso Azure SQL:
- Si.
- Motivo: identificar campana exacta, generar dry-run real y validar rollback.
- Alcance: consultas read-only, dry-run transaccional con rollback y validacion post-rollback.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task764-campaign-cleanup-read-200-229-6-68`
  - IP: `200.229.6.68`
- Se retiro temporalmente el lock `puntoclub-sqlserver-cannotdelete` para eliminar la regla.
- Verificacion final de regla temporal: `[]`.
- Se restauro el lock del servidor con nivel `CanNotDelete` y nota original.

Riesgos o pendientes:
- No ejecutar apply hasta que QA/Product revisen la discrepancia del correo objetivo.
- Si se requiere borrar blobs fisicos de imagenes en storage, abrir tarea Infra separada.
- El script elimina metadata SQL de imagenes de campanas eliminadas, pero no elimina el binario en blob storage.

Siguiente recomendado:
- TASK-765 debe revisar evidencia dry-run.
- Si Product confirma aplicar pese a la discrepancia de correo, crear una tarea separada de apply con `@DryRun = 0` y `@ConfirmTask = N'TASK-764-APPLY'`.
