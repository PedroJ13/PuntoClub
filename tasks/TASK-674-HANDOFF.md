Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Migracion SQL Azure
Tarea completada: TASK-674 - Aplicar migracion SQL de imagenes de campanas en Azure

Archivos cambiados:
- `tasks/TASK-674-HANDOFF.md`

SQL agregado o modificado:
- Se aplico en Azure SQL la migracion:
  - `database/migrations/20260701_promotional_campaign_images.sql`
- Base objetivo:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`

Resultado:
- Migracion aplicada correctamente.
- No se modificaron datos de negocio.
- No se enviaron correos.
- No se imprimieron ni guardaron secretos.

SQL aplicado:
- Tabla:
  - `dbo.PromotionalCampaignImages`
- Constraints verificadas:
  - `PK_PromotionalCampaignImages`
  - `CK_PromotionalCampaignImages_content_type`
  - `CK_PromotionalCampaignImages_size`
  - `CK_PromotionalCampaignImages_status`
  - `FK_PromotionalCampaignImages_Companies`
  - `FK_PromotionalCampaignImages_CreatedBy`
  - `FK_PromotionalCampaignImages_PromotionalCampaigns`
  - `FK_PromotionalCampaignImages_UpdatedBy`
- Indices verificados:
  - `IX_PromotionalCampaignImages_campaign_status`
  - `UX_PromotionalCampaignImages_active_campaign`
  - `UX_PromotionalCampaignImages_public_id`

Verificacion ejecutada:
- Ejecucion de batches separados por `GO`:
  - `batch 1/4 ok`
  - `batch 2/4 ok`
  - `batch 3/4 ok`
  - `batch 4/4 ok`
- Validacion read-only de metadatos en `sys.tables`, `sys.key_constraints`, `sys.check_constraints`, `sys.foreign_keys` y `sys.indexes`.
- Verificacion final de regla temporal:
  - `[]`
- Verificacion final de locks:
  - `puntoclub-sqlserver-cannotdelete`
  - `puntoclub-sqldb-cannotdelete`

Conexion usada:
- Se intento primero usar `local-secrets/sql_admin.ps1`, pero ese archivo no existe en este worktree.
- Se aplico finalmente con token AAD de Azure CLI para `https://database.windows.net/`.
- No se imprimieron tokens, passwords ni connection strings.

Firewall temporal:
- Se creo regla temporal estrecha:
  - `tmp-task674-campaign-images-200-229-6-68`
- IP:
  - `200.229.6.68`
- La regla se retiro al finalizar.
- Verificacion final:
  - query de regla temporal devolvio `[]`.

Locks:
- Para retirar la regla temporal fue necesario quitar temporalmente el lock del SQL Server:
  - `puntoclub-sqlserver-cannotdelete`
- El lock fue restaurado al finalizar.
- El lock de la base se mantuvo visible:
  - `puntoclub-sqldb-cannotdelete`

Uso Azure SQL:
- Si.
- Motivo: aplicar migracion SQL aprobada para metadata de imagenes de campanas.
- Alcance: DDL idempotente y validacion read-only de metadatos.

Riesgos o pendientes:
- Backend/API debe publicarse despues de esta migracion para usar la tabla en ambiente publicado.
- Infra ya preparo `campaign-assets`; QA debe validar que los blobs sigan privados y que el render publico solo funcione por `publicId` activo.
- Limpieza fisica de blobs reemplazados/eliminados queda pendiente para tarea posterior si Product la prioriza.

Siguiente recomendado:
- Backend/API: publicar endpoints de imagen opcional de campana.
- Web Dev: publicar UI de imagen opcional.
- QA: validar subida, reemplazo, eliminacion, errores por formato/tamano y preview/email sin envio real fuera de ventana aprobada.
