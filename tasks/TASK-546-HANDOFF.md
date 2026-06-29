Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Correos operativos
Tarea completada: TASK-546 - Preparar migracion SQL minima para correos operativos

Archivos cambiados:
- `database/migrations/20260629_operational_emails.sql`
- `tasks/TASK-546-HANDOFF.md`

SQL agregado o modificado:
- Nueva tabla `dbo.CompanyOperationalEmailSettings`.
  - `company_id` como PK/FK a `Companies`.
  - switches `welcome_enabled`, `purchase_enabled`, `redemption_enabled`.
  - `reply_to_email` opcional.
  - timestamps `created_at`, `updated_at`.
- Nueva tabla `dbo.OperationalEmailEvents`.
  - `event_type` limitado a `welcome`, `purchase`, `redemption`.
  - `idempotency_key` por empresa.
  - entidad origen y cliente asociado.
  - estado `pending`, `skipped`, `sent`, `failed`.
  - indice unico `UX_OperationalEmailEvents_company_idempotency`.
- Nueva tabla `dbo.OperationalEmailMessages`.
  - destinatario, asunto, proveedor, provider id, error y estado.
- Nueva tabla `dbo.OperationalEmailAttempts`.
  - intentos por mensaje, provider, estado, error y fecha.

Verificacion ejecutada:
- Revision estatica del script.
- Validacion estatica con Node:
  - existe tabla de settings.
  - existe indice unico de idempotencia.
  - existen tablas de mensajes e intentos.
- No se ejecuto contra Azure SQL.

Resultado:
- Migracion no destructiva preparada.
- Alcance limitado a correos operativos.
- No incluye promociones ni envios masivos.

Riesgos o pendientes:
- Requiere tarea SQL/Infra posterior para aplicar en Azure SQL.
- La API que consume estas tablas requiere que la migracion este aplicada antes de publicar/usar en ambiente real.

Siguiente recomendado:
- Aplicar `database/migrations/20260629_operational_emails.sql` con credencial aprobada.
- Luego publicar API de TASK-547 y validar smoke corto.
