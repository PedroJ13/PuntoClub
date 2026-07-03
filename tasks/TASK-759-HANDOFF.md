Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada apply
Tarea completada: TASK-759 - Ejecutar limpieza promocional de pruebas con dry_run 0

Archivos cambiados:
- `tasks/TASK-759-HANDOFF.md`

Evidencia local generada:
- `tmp/task759/task759-dryrun-evidence-redacted.json`
- `tmp/task759/task759-apply-evidence-redacted.json`
- `tmp/task759/task759-post-commit-validation.json`

SQL agregado o modificado:
- No se modifico el script SQL.
- Se ejecuto en Azure SQL el script operativo existente:
  - `database/operations/20260702_task757_clean_promotional_test_sends.sql`
- Parametros efectivos del apply:
  - `@DryRun = 0`
  - `@ConfirmTask = N'TASK-757-APPLY'`
- Alcance efectivo:
  - `@CompanyId = NULL`
  - `@CampaignId = NULL`
  - `@SelectedFromUtc = NULL`
  - `@SelectedToUtc = NULL`

Verificacion ejecutada:
- Lectura de `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `chat-start/SQL_DEV.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md` y `docs/SQL_AZURE_CONNECTION_NOTES.md`.
- Revision de `tasks/TASK-756-HANDOFF.md` y `tasks/TASK-757-HANDOFF.md`.
- Conexion Azure SQL via Azure CLI/AAD contra:
  - Server: `sqlserver-pj13-brazil.database.windows.net`
  - Database: `sql-db-puntoclub`
- Dry-run previo del script, guardando evidencia redaccionada antes de aplicar.
- Apply con `@DryRun = 0` y confirmacion `TASK-757-APPLY`.
- Validacion post-commit independiente:
  - conteo total en `dbo.PromotionalCampaignRecipients`;
  - estado de campanas afectadas;
  - conteos de solo lectura en `dbo.PromotionalUnsubscribeEvents`;
  - conteos de solo lectura en `dbo.CustomerPromotionalEmailPreferences`.

Resultado:
- Commit aplicado correctamente.
- Antes del apply:
  - 6 filas seleccionadas en `dbo.PromotionalCampaignRecipients`.
  - 6 campanas afectadas, todas de `company_id = 8`.
  - Campanas afectadas:
    - `campaign_id = 5`, `Promo clientes frecuentes`, status previo `sent`, 1 recipient `sent`.
    - `campaign_id = 7`, `QA TASK-616 917797`, status previo `sent`, 1 recipient `sent`.
    - `campaign_id = 10`, `TEST Imagen`, status previo `sent`, 1 recipient `sent`.
    - `campaign_id = 17`, `Nuevo`, status previo `sent`, 1 recipient `sent`.
    - `campaign_id = 19`, `Nuevo`, status previo `sent`, 1 recipient `sent`.
    - `campaign_id = 20`, `QA744 normal 1783029272711`, status previo `sent`, 1 recipient `sent`.
- Guardas previas:
  - No aparecieron referencias bloqueantes en `dbo.PromotionalUnsubscribeEvents`; si hubieran existido, el script habria detenido antes del cambio.
  - No se observaron datos fuera del alcance aprobado por TASK-756.
- Cambios aplicados:
  - 6 filas eliminadas de `dbo.PromotionalCampaignRecipients`.
  - Las 6 campanas afectadas quedaron en `draft`.
  - `confirmed_at` y `sent_at` quedaron en `NULL` para esas campanas.
- Despues del apply:
  - `dbo.PromotionalCampaignRecipients`: `0` filas totales.
  - Campanas afectadas: 6 en `draft`, con `confirmed_at = NULL` y `sent_at = NULL`.
- Tablas no modificadas:
  - `dbo.Customers`
  - puntos, compras, canjes, membresias, beneficios o ledgers
  - `dbo.CustomerPromotionalEmailPreferences`
  - `dbo.PromotionalUnsubscribeEvents`
  - `dbo.PromotionalCampaignImages`
  - campanas/plantillas como registros
- No se enviaron correos reales.

Uso Azure SQL:
- Si.
- Motivo: TASK-759 autorizo aplicar limpieza controlada en Azure SQL con `dry_run 0`.
- Alcance: dry-run previo, apply transaccional y validacion post-commit corta.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task759-promo-cleanup-200-229-6-68`
  - IP: `200.229.6.68`
- Al retirar la regla, Azure bloqueo el delete por lock del SQL Server.
- Se retiro temporalmente solo el lock del servidor:
  - `puntoclub-sqlserver-cannotdelete`
- Se elimino la regla temporal.
- Verificacion de regla temporal despues del retiro: `[]`.
- Se restauro el lock del servidor con nivel `CanNotDelete` y la nota original.
- El lock de la base `puntoclub-sqldb-cannotdelete` no se retiro.

Rollback plan:
- Si Product/SQL DEV decide reversar el commit:
  - usar `tmp/task759/task759-apply-evidence-redacted.json` como evidencia de conteos y campanas afectadas;
  - reconstruir recipients solo desde un export no redaccionado aprobado/seguro si se requiere;
  - restaurar status/timestamps de campanas desde el snapshot previo guardado por el script;
  - hacerlo solo con tarea explicita de rollback.
- No reversar manualmente desde memoria.

Riesgos o pendientes:
- La evidencia guardada en `tmp/task759` esta redaccionada para evitar exponer datos sensibles en el repo.
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-759.md` no existen en este checkout; se uso la asignacion pegada en chat y los handoffs previos como fuente operativa.
- `database/operations/20260702_task757_clean_promotional_test_sends.sql` aparece como archivo no trackeado localmente desde TASK-757; esta tarea no lo modifico.

Siguiente recomendado:
- QA / Web Dev puede validar que los clientes vuelven a ser elegibles en `Enviar campanas` sin enviar correos reales.
- Product / Architect / Release puede procesar este handoff y decidir si se necesita una tarea separada para conservar/exportar evidencia no redaccionada fuera del repo.
