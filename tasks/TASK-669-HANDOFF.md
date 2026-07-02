Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Migracion SQL
Tarea completada: TASK-669 - Crear migracion SQL para metadata de imagenes de campanas

Archivos cambiados:
- `database/migrations/20260701_promotional_campaign_images.sql`
- `tasks/TASK-669-HANDOFF.md`

SQL agregado o modificado:
- Se creo migracion local versionada:
  - `database/migrations/20260701_promotional_campaign_images.sql`
- No se aplico en Azure SQL.

Modelo creado en migracion:
- Tabla:
  - `dbo.PromotionalCampaignImages`
- Metadata guardada:
  - `company_id`
  - `campaign_id`
  - `status`
  - `blob_container`
  - `blob_path`
  - `public_id`
  - `original_file_name`
  - `content_type`
  - `size_bytes`
  - `checksum_sha256`
  - `alt_text`
  - `created_by_user_id`
  - `updated_by_user_id`
  - fechas de creacion, actualizacion, reemplazo y eliminacion.

Constraints:
- PK:
  - `PK_PromotionalCampaignImages`
- FK:
  - `FK_PromotionalCampaignImages_Companies`
  - `FK_PromotionalCampaignImages_PromotionalCampaigns`
  - `FK_PromotionalCampaignImages_CreatedBy`
  - `FK_PromotionalCampaignImages_UpdatedBy`
- Checks:
  - status en `active`, `replaced`, `deleted`
  - content type en `image/jpeg`, `image/png`, `image/webp`
  - size entre 1 byte y 1 MB.

Indices:
- `UX_PromotionalCampaignImages_public_id`
- `UX_PromotionalCampaignImages_active_campaign`
- `IX_PromotionalCampaignImages_campaign_status`

Decisiones:
- No se guardan binarios en SQL.
- Se permite una sola imagen activa por campana.
- Reemplazo y eliminacion quedan trazables por status/fechas.
- `public_id` permite URL opaca para render en email sin exponer blob path.

Verificacion ejecutada:
- Revision local de migracion.
- `git diff --check`

Resultado:
- Migracion local creada.
- No hay cambios aplicados a datos reales.

Uso Azure SQL:
- No.
- Motivo: la tarea indica no aplicar en Azure SQL hasta decision de release.

Riesgos o pendientes:
- P1: Backend/API que use esta tabla requiere que la migracion se aplique antes de publicar funcionalidad en ambiente real.
- P2: la integridad company/campaign se refuerza en Backend; si se quiere FK compuesto SQL estricto, requiere ajustar indice unico en `PromotionalCampaigns`.

Siguiente recomendado:
- Product / Architect / Release decide ventana para aplicar migracion.
- SQL DEV aplica en Azure SQL solo con tarea explicita de release/migracion.
