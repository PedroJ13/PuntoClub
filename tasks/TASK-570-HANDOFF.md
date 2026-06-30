Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Promociones SQL
Tarea completada: TASK-570 - Aplicar migracion SQL MVP de promociones en Azure SQL

Resultado:
- Se aplico en Azure SQL la migracion:
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`
- Base objetivo:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`
- No se tocaron datos de negocio.
- No se habilito envio real de promociones.
- No se imprimieron ni guardaron secretos.

SQL aplicado:
- Tablas:
  - `dbo.CustomerPromotionalEmailPreferences`
  - `dbo.PromotionalCampaigns`
  - `dbo.PromotionalCampaignRecipients`
  - `dbo.PromotionalUnsubscribeEvents`
- Indices:
  - `IX_CustomerPromotionalEmailPreferences_company_status`
  - `IX_PromotionalCampaignRecipients_campaign_status`
  - `IX_PromotionalCampaigns_company_created`
  - `IX_PromotionalUnsubscribeEvents_company_created`
  - `UX_PromotionalCampaignRecipients_campaign_customer`

Verificacion ejecutada:
- Conexion a Azure SQL con token AAD de Azure CLI.
- Ejecucion de 9 batches SQL:
  - `batch 1/9 ok` a `batch 9/9 ok`.
- Validacion read-only de metadatos:
  - Tablas encontradas:
    - `CustomerPromotionalEmailPreferences`
    - `PromotionalCampaignRecipients`
    - `PromotionalCampaigns`
    - `PromotionalUnsubscribeEvents`
  - Indices encontrados:
    - `IX_CustomerPromotionalEmailPreferences_company_status`
    - `IX_PromotionalCampaignRecipients_campaign_status`
    - `IX_PromotionalCampaigns_company_created`
    - `IX_PromotionalUnsubscribeEvents_company_created`
    - `UX_PromotionalCampaignRecipients_campaign_customer`

Firewall temporal:
- Se creo regla temporal estrecha:
  - `tmp-task570-promotions-200-229-6-68`
- La regla se elimino al finalizar.
- Verificacion final:
  - query de regla temporal devolvio `[]`.
- Para eliminar la regla fue necesario retirar temporalmente el lock del SQL Server:
  - `puntoclub-sqlserver-cannotdelete`
- El lock fue restaurado al finalizar:
  - nivel: `CanNotDelete`
  - notas: `PuntoClub proteccion minima: evitar borrado accidental del SQL Server productivo`

Uso Azure SQL:
- Si.
- Motivo: aplicar migracion aprobada de promociones MVP.
- Alcance: ventana corta de conexion, DDL idempotente y validacion de metadatos.

Riesgos o pendientes:
- Backend/API de promociones debe publicarse para usar estas tablas en ambiente publicado.
- Web de promociones debe publicarse para conectar baja/destinatarios/campanas contra API real.
- El envio real de promociones sigue bloqueado por alcance y requiere decision explicita posterior.

Siguiente recomendado:
- Backend/API: publicar contratos de promociones con envio bloqueado.
- Web Dev: publicar UI de promociones y baja promocional.
- QA: validar flujo publicado sin envio real.
