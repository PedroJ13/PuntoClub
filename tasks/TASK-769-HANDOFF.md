Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada apply
Tarea completada: TASK-769 - Ejecutar limpieza de campanas conservando Nueva Bebida

Archivos cambiados:
- `tasks/TASK-769-HANDOFF.md`

Evidencia local generada:
- `tmp/task769/task769-preflight-dry-run-evidence-redacted.json`
- `tmp/task769/task769-apply-evidence-redacted.json`
- `tmp/task769/task769-post-commit-validation.json`

SQL agregado o modificado:
- No se modifico el script en disco.
- Se ejecuto en Azure SQL:
  - `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`
- Parametros efectivos del apply:
  - `@DryRun = 0`
  - `@ConfirmTask = N'TASK-764-APPLY'`
  - `@ExpectedRecentRecipientEmail = N'fatima2210@gmail.com'`

Verificacion ejecutada:
- Preflight/dry-run fresco con guarda de destinatario esperado.
- Apply con la misma guarda.
- Validacion post-commit independiente.

Resultado:
- Commit aplicado correctamente.
- Campana conservada:
  - `campaign_id = 19`;
  - `company_id = 8`;
  - `name = Nuevo`;
  - `subject = Nueva Bebida`;
  - `status = sent`;
  - imagen activa `D750ABD9-206B-456F-9345-8C42A03271C8`;
  - `recipient_count = 1`;
  - `sent_recipient_count = 1`;
  - `acs_recipient_count = 1`;
  - `expected_email_recipient_count = 1`.
- Eliminado:
  - `19` campanas promocionales de prueba;
  - `6` filas de metadata de imagen de campanas eliminadas;
  - `0` recipients de campanas eliminadas.
- No hubo eventos de baja bloqueantes:
  - `blocking_unsubscribe_events = 0`.
- Post-commit:
  - `PromotionalCampaigns` para `company_id = 8`: `1`;
  - `PromotionalCampaignImages` para `company_id = 8`: `1`;
  - `PromotionalCampaignRecipients` para `company_id = 8`: `1`.
- Tablas no objetivo verificadas post-commit:
  - `CustomerPromotionalEmailPreferences`: `2`;
  - `PromotionalUnsubscribeEvents`: `2`;
  - `Customers`: `10`;
  - `Purchases`: `11`;
  - `Redemptions`: `1`;
  - `CustomerMemberships`: `0`.
- No se borraron clientes, puntos, compras, canjes, membresias, preferencias de baja ni eventos de baja.
- No se enviaron correos reales.

Uso Azure SQL:
- Si.
- Motivo: TASK-769 autorizo apply controlado en Azure SQL.
- Alcance: dry-run preflight, apply transaccional y validacion post-commit.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task769-campaign-cleanup-apply-200-229-6-68`
  - IP: `200.229.6.68`
- Se retiro temporalmente el lock `puntoclub-sqlserver-cannotdelete` para eliminar la regla.
- Verificacion final de regla temporal: `[]`.
- Se restauro el lock del servidor con nivel `CanNotDelete` y nota original.

Rollback plan:
- Si Product/SQL DEV decide reversar:
  - usar la evidencia de `tmp/task769/task769-apply-evidence-redacted.json`;
  - restaurar campanas, metadata de imagen y recipients en orden;
  - no restaurar desde memoria;
  - abrir tarea explicita de rollback.

Riesgos o pendientes:
- Los blobs fisicos de imagen de campanas eliminadas no fueron borrados; si se desea limpieza de storage, requiere tarea Infra separada.

Siguiente recomendado:
- Ejecutar/registrar QA TASK-770 sobre Web publicada.
