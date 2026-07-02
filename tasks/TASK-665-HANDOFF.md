Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Modelo datos
Tarea completada: TASK-665 - Disenar modelo SQL para imagen opcional de campana

Resultado:
- Se propuso modelo SQL para metadata de imagen opcional por campana promocional, continuando desde `TASK-656`.
- No se creo migracion fisica.
- No se aplico SQL.
- No se uso Azure SQL.

Decision recomendada:
- Crear tabla nueva:
  - `dbo.PromotionalCampaignImages`
- No guardar binario en SQL.
- No agregar solo columnas a `dbo.PromotionalCampaigns`, porque reemplazo/eliminacion necesita trazabilidad minima.

Migracion sugerida:
- Archivo futuro:
  - `database/migrations/20260701_promotional_campaign_images.sql`
- La fecha debe ajustarse al dia real de implementacion.

DDL propuesto:

```sql
CREATE TABLE dbo.PromotionalCampaignImages (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    campaign_id bigint NOT NULL,
    status varchar(20) NOT NULL
        CONSTRAINT DF_PromotionalCampaignImages_status DEFAULT ('active'),
    blob_container nvarchar(63) NOT NULL,
    blob_path nvarchar(512) NOT NULL,
    public_id uniqueidentifier NOT NULL
        CONSTRAINT DF_PromotionalCampaignImages_public_id DEFAULT (NEWID()),
    original_file_name nvarchar(255) NOT NULL,
    content_type varchar(80) NOT NULL,
    size_bytes int NOT NULL,
    checksum_sha256 varbinary(32) NULL,
    alt_text nvarchar(160) NULL,
    created_by_user_id bigint NULL,
    updated_by_user_id bigint NULL,
    created_at datetime2(0) NOT NULL
        CONSTRAINT DF_PromotionalCampaignImages_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at datetime2(0) NOT NULL
        CONSTRAINT DF_PromotionalCampaignImages_updated_at DEFAULT (SYSUTCDATETIME()),
    replaced_at datetime2(0) NULL,
    deleted_at datetime2(0) NULL,
    CONSTRAINT PK_PromotionalCampaignImages PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_PromotionalCampaignImages_Companies
        FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT FK_PromotionalCampaignImages_PromotionalCampaigns
        FOREIGN KEY (campaign_id) REFERENCES dbo.PromotionalCampaigns(id),
    CONSTRAINT FK_PromotionalCampaignImages_CreatedBy
        FOREIGN KEY (created_by_user_id) REFERENCES dbo.CompanyUsers(id),
    CONSTRAINT FK_PromotionalCampaignImages_UpdatedBy
        FOREIGN KEY (updated_by_user_id) REFERENCES dbo.CompanyUsers(id),
    CONSTRAINT CK_PromotionalCampaignImages_status CHECK (
        status IN ('active', 'replaced', 'deleted')
    ),
    CONSTRAINT CK_PromotionalCampaignImages_content_type CHECK (
        content_type IN ('image/jpeg', 'image/png', 'image/webp')
    ),
    CONSTRAINT CK_PromotionalCampaignImages_size CHECK (
        size_bytes > 0 AND size_bytes <= 1048576
    )
);
```

Indices propuestos:

```sql
CREATE UNIQUE INDEX UX_PromotionalCampaignImages_public_id
ON dbo.PromotionalCampaignImages (public_id);

CREATE UNIQUE INDEX UX_PromotionalCampaignImages_active_campaign
ON dbo.PromotionalCampaignImages (company_id, campaign_id)
WHERE status = 'active';

CREATE INDEX IX_PromotionalCampaignImages_campaign_status
ON dbo.PromotionalCampaignImages (company_id, campaign_id, status, updated_at DESC)
INCLUDE (content_type, size_bytes, original_file_name, public_id);
```

Reglas:
- Una sola imagen `active` por campana.
- Reemplazar imagen:
  - marcar la actual como `replaced`;
  - insertar nueva `active`;
  - generar nuevo `public_id`.
- Eliminar imagen:
  - marcar `deleted`;
  - conservar metadata para trazabilidad.
- Backend debe validar que `company_id` de la campana coincida con empresa de sesion.

Snapshot historico:
- Para MVP, la imagen se resuelve desde la campana al momento de enviar.
- Si QA/Producto requiere auditoria exacta de la imagen enviada, agregar luego `image_id_snapshot` o `image_public_id_snapshot` en `PromotionalCampaignRecipients`.

Archivos cambiados:
- Solo este handoff:
  - `tasks/TASK-665-HANDOFF.md`

SQL agregado o modificado:
- Ninguno aplicado.
- Este handoff contiene propuesta de DDL.

Verificacion ejecutada:
- Revision local/documental de:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `chat-start/SQL_DEV.md`
  - `tasks/TASK-656-HANDOFF.md`
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`

Uso Azure SQL:
- No.
- Motivo: tarea de diseno, sin decision de release para aplicar migracion.

Riesgos o pendientes:
- P1: no guardar binarios en SQL.
- P1: no guardar URL editable desde frontend.
- P2: FK simple a `PromotionalCampaigns(id)` evita huerfanos, pero la consistencia company/campaign debe validarla Backend o reforzarse con FK compuesto en migracion final.

Siguiente recomendado:
- Esperar decision de release.
- Si se aprueba, crear migracion idempotente versionada y coordinar con Backend/API antes de aplicar.
