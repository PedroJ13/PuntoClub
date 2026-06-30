Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Promociones
Tarea completada: TASK-562 - Preparar migracion SQL MVP para promociones

Resultado:
- Se preparo migracion SQL local no aplicada:
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`
- La migracion crea modelo minimo para:
  - preferencias promocionales y baja por cliente;
  - campanas promocionales;
  - destinatarios por campana;
  - snapshot de puntos por destinatario;
  - estados de envio por destinatario;
  - eventos de baja promocional.
- No se tocaron tablas de correos operativos existentes.
- No se enviaron correos.

Tablas propuestas:
- `dbo.CustomerPromotionalEmailPreferences`
  - estado: `subscribed`, `unsubscribed`, `suppressed`;
  - baja con fuente y razon;
  - supresion por rebote/fallo permanente si luego se integra.
- `dbo.PromotionalCampaigns`
  - nombre, asunto, cuerpo texto, incluir puntos;
  - estado: `draft`, `ready`, `sending`, `sent`, `cancelled`, `failed`;
  - limite MVP por campana: 1 a 5 destinatarios.
- `dbo.PromotionalCampaignRecipients`
  - destinatario por cliente;
  - email usado;
  - snapshot de puntos;
  - snapshot de preferencia;
  - estado: `pending`, `sent`, `failed`, `skipped`.
- `dbo.PromotionalUnsubscribeEvents`
  - trazabilidad de bajas promocionales.

Indices:
- `IX_PromotionalCampaigns_company_created`
- `UX_PromotionalCampaignRecipients_campaign_customer`
- `IX_PromotionalCampaignRecipients_campaign_status`
- `IX_CustomerPromotionalEmailPreferences_company_status`
- `IX_PromotionalUnsubscribeEvents_company_created`

Verificacion ejecutada:
- Revision local de archivo SQL.
- `node --check` no aplica a SQL.
- No se aplico en Azure SQL por alcance de preparacion.

Uso Azure SQL:
- No.
- Motivo: la tarea pide preparar migracion, no aplicarla.

Riesgos o pendientes:
- Requiere tarea SQL separada para aplicar en Azure SQL.
- Si se decide envio real, Backend/API debe mantener feature flag, limites y baja server-side antes de llamar ACS.
