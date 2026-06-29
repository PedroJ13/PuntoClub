Equipo: SQL DEV
Tarea completada: TASK-513 - Disenar modelo SQL para comunicaciones, preferencias, campanas y estados de envio

Archivos cambiados:
- `tasks/TASK-513-HANDOFF.md`

SQL agregado o modificado:
- No se agrego migracion ejecutable en esta tarea.
- Se propone el siguiente modelo relacional para una migracion posterior:

1. `dbo.CompanyCommunicationSettings`
- `company_id bigint not null primary key`
- `operational_welcome_enabled bit not null default 0`
- `operational_purchase_enabled bit not null default 0`
- `operational_redemption_enabled bit not null default 0`
- `operational_benefit_enabled bit not null default 0`
- `operational_membership_enabled bit not null default 0`
- `promotional_campaigns_enabled bit not null default 0`
- `include_points_in_promotions_default bit not null default 0`
- `reply_to_email nvarchar(254) null`
- `updated_at datetime2 not null default sysutcdatetime()`
- FK a `dbo.Companies(id)`.

2. `dbo.CustomerCommunicationPreferences`
- `company_id bigint not null`
- `customer_id bigint not null`
- `operational_emails_enabled bit not null default 1`
- `promotional_emails_enabled bit not null default 1`
- `promotional_unsubscribed_at datetime2 null`
- `promotional_unsubscribe_source nvarchar(40) null`
- `promotional_resubscribed_at datetime2 null`
- `email_suppressed_at datetime2 null`
- `email_suppression_reason nvarchar(80) null`
- `updated_at datetime2 not null default sysutcdatetime()`
- PK `(company_id, customer_id)`.
- FK a `dbo.Companies(id)` y `dbo.Customers(id)`.
- Regla: baja promocional no elimina cliente ni bloquea correos operativos criticos.

3. `dbo.CommunicationCampaigns`
- `id bigint identity primary key`
- `company_id bigint not null`
- `campaign_type nvarchar(30) not null` con valores iniciales `promotional`, `operational_batch`.
- `status nvarchar(30) not null` con valores `draft`, `scheduled`, `sending`, `sent`, `cancelled`, `failed`.
- `name nvarchar(140) not null`
- `subject nvarchar(180) not null`
- `body_text nvarchar(max) not null`
- `body_html nvarchar(max) null`
- `include_points_snapshot bit not null default 0`
- `scheduled_at datetime2 null`
- `created_by_user_id bigint null`
- `created_at datetime2 not null default sysutcdatetime()`
- `updated_at datetime2 not null default sysutcdatetime()`
- FK a `dbo.Companies(id)`.

4. `dbo.CommunicationCampaignRecipients`
- `id bigint identity primary key`
- `campaign_id bigint not null`
- `company_id bigint not null`
- `customer_id bigint not null`
- `email nvarchar(254) not null`
- `customer_name nvarchar(160) null`
- `points_balance_snapshot int null`
- `preference_snapshot nvarchar(30) not null`
- `status nvarchar(30) not null default 'pending'`
- `created_at datetime2 not null default sysutcdatetime()`
- FK a `dbo.CommunicationCampaigns(id)`.
- Indices recomendados: `(campaign_id, status)`, `(company_id, customer_id)`.

5. `dbo.CommunicationOperationalEvents`
- `id bigint identity primary key`
- `company_id bigint not null`
- `customer_id bigint null`
- `event_type nvarchar(60) not null`
- `source_entity_type nvarchar(60) not null`
- `source_entity_id bigint null`
- `status nvarchar(30) not null default 'pending'`
- `idempotency_key nvarchar(160) not null`
- `created_at datetime2 not null default sysutcdatetime()`
- UNIQUE `(company_id, idempotency_key)`.
- Eventos iniciales: `customer.welcome`, `purchase.registered`, `redemption.registered`, `benefit.used`, `membership.updated`.

6. `dbo.CommunicationEmailMessages`
- `id bigint identity primary key`
- `company_id bigint not null`
- `customer_id bigint null`
- `campaign_id bigint null`
- `campaign_recipient_id bigint null`
- `operational_event_id bigint null`
- `message_category nvarchar(30) not null` con valores `operational`, `promotional`.
- `template_key nvarchar(80) not null`
- `to_email nvarchar(254) not null`
- `subject nvarchar(180) not null`
- `sender_domain nvarchar(120) null`
- `reply_to_email nvarchar(254) null`
- `points_balance_snapshot int null`
- `payload_snapshot_json nvarchar(max) not null`
- `provider_message_id nvarchar(160) null`
- `status nvarchar(30) not null default 'queued'`
- `queued_at datetime2 not null default sysutcdatetime()`
- `sent_at datetime2 null`
- `last_status_at datetime2 null`
- `failure_code nvarchar(80) null`
- `failure_reason nvarchar(400) null`
- Checks: exactamente uno de `campaign_recipient_id` u `operational_event_id` debe existir para mensajes generados; permitir ambos null solo para preview/test interno si se decide.

7. `dbo.CommunicationEmailDeliveryEvents`
- `id bigint identity primary key`
- `email_message_id bigint not null`
- `provider_event_type nvarchar(80) not null`
- `provider_status nvarchar(80) null`
- `smtp_status_code nvarchar(30) null`
- `occurred_at datetime2 not null`
- `raw_event_redacted_json nvarchar(max) null`
- `created_at datetime2 not null default sysutcdatetime()`
- FK a `dbo.CommunicationEmailMessages(id)`.

8. `dbo.CommunicationUnsubscribeTokens`
- `id bigint identity primary key`
- `company_id bigint not null`
- `customer_id bigint not null`
- `token_hash varbinary(32) not null`
- `status nvarchar(20) not null default 'active'`
- `expires_at datetime2 null`
- `created_at datetime2 not null default sysutcdatetime()`
- `used_at datetime2 null`
- UNIQUE `token_hash`.
- Regla: guardar solo hash, nunca token plano.

Verificacion ejecutada:
- Lectura de contexto requerido de SQL DEV.
- Revision de `docs/DATA_MODEL.md`, `docs/API_CONTRACTS.md`, `tasks/TASK-510-HANDOFF.md`, `tasks/TASK-511-HANDOFF.md` y `tasks/TASK-512-HANDOFF.md`.
- No se ejecuto Azure SQL ni se aplico migracion.

Resultado:
- Modelo propuesto cubre:
  - configuracion por empresa;
  - preferencias por cliente;
  - bajas promocionales;
  - historial de mensajes;
  - eventos operativos;
  - campanas;
  - destinatarios;
  - eventos de entrega/rebote;
  - snapshot de puntos usado en cada correo.
- Se mantiene separacion operativos/promocionales para proteger correos criticos.

Riesgos o pendientes:
- Falta migracion versionada y validacion contra schema real.
- Falta decidir si los cuerpos HTML/texto se guardan completos o si solo se guarda template key + snapshot.
- Falta politica de retencion para payloads y eventos de delivery.
- Falta confirmar si unsubscribe token sera global por cliente/empresa o por campana.

Siguiente recomendado:
- SQL DEV prepara migracion versionada cuando Product apruebe la arquitectura.
- Backend/API debe alinear contratos e idempotencia con este modelo.
