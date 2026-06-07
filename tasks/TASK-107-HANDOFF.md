Equipo:
SQL DEV

Tarea completada:
TASK-107 - Revisar modelo SQL de configuracion de empresa piloto.

Archivos cambiados:
- tasks/TASK-107-HANDOFF.md
- docs/TASK_BOARD.md

SQL agregado o modificado:
- Ninguno aplicado en Azure SQL.
- Se propone una migracion no destructiva solo para ampliar constraints de auditoria operativa si Backend/API va a registrar cambios de settings.
- No se modificaron datos reales.
- No se creo empresa nueva.
- No se cambio auth ni multiempresa.
- No se imprimieron secretos.

Verificacion ejecutada:
- Leido `tasks/TASK-107-assignment.md`.
- Leido `docs/TASK_BOARD.md`.
- Movida `TASK-107` de `Ready` a `In Progress`.
- Leido `database/schema.sql`.
- Leido `docs/API_CONTRACTS.md`.
- Leido `database/migrations/20260606_operational_audit_events.sql`.
- Revisado `api/src/functions/companies.js`.
- Revisado `api/src/lib/repository.js`.
- Revisado `api/src/lib/audit.js`.

Columnas actuales en `dbo.Companies`:
- `id bigint IDENTITY(1,1) NOT NULL`
- `name nvarchar(160) NOT NULL`
- `email nvarchar(254) NULL`
- `phone nvarchar(32) NULL`
- `logo_url nvarchar(2048) NULL`
- `points_percentage decimal(5,2) NOT NULL`
- `status varchar(20) NOT NULL DEFAULT ('active')`
- `created_at datetime2(0) NOT NULL DEFAULT (SYSUTCDATETIME())`
- `updated_at datetime2(0) NOT NULL DEFAULT (SYSUTCDATETIME())`

Soporte para configuracion de empresa piloto:
- Nombre: soportado por `Companies.name`.
- Email: soportado por `Companies.email`.
- Telefono: soportado por `Companies.phone`.
- Logo URL: soportado por `Companies.logo_url`.
- Porcentaje de puntos: soportado por `Companies.points_percentage`.
- Estado: soportado por `Companies.status`.

Constraints actuales relevantes:
- `PK_Companies` sobre `id`.
- `CK_Companies_points_percentage`: `points_percentage > 0 AND points_percentage <= 100`.
- `CK_Companies_status`: `status IN ('active', 'inactive')`.

Unicidad necesaria:
- Para modo empresa piloto unica con `PILOT_COMPANY_ID`, no hace falta agregar unicidad nueva en `Companies.email` o `Companies.phone`.
- En fase multiempresa controlado podria evaluarse unicidad de email por empresa/tenant o reglas de identificacion, pero queda fuera de esta fase.

Gaps encontrados:
- No hay gap de columnas para editar settings basicos.
- `updated_at` existe, pero no se actualiza automaticamente en SQL. Recomendacion: Backend/API debe setear `updated_at = SYSUTCDATETIME()` en el `PATCH /settings`.
- La tabla de auditoria `dbo.OperationalAuditEvents` existe por TASK-102, pero sus checks actuales no aceptan:
  - `event_type = 'company.settings.updated'`
  - `entity_type = 'company'`
- Si Backend/API intenta auditar cambios de configuracion con esos valores, el insert fallara por constraint.

Decision SQL:
- No recomiendo migracion sobre `dbo.Companies`.
- Si Product/Backend decide auditar cambios de configuracion, si recomiendo una migracion no destructiva sobre `dbo.OperationalAuditEvents` para ampliar los checks existentes.

SQL propuesto si se audita `company.settings.updated`:

```sql
-- Non-destructive migration: expand allowed audit event/entity values for company settings.
-- Does not alter customer/purchase/redemption data.

IF OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents')
          AND name = 'CK_OperationalAuditEvents_event_type'
    )
    BEGIN
        ALTER TABLE dbo.OperationalAuditEvents
        DROP CONSTRAINT CK_OperationalAuditEvents_event_type;
    END;

    ALTER TABLE dbo.OperationalAuditEvents WITH CHECK
    ADD CONSTRAINT CK_OperationalAuditEvents_event_type CHECK (
        event_type IN (
            'customer.created',
            'purchase.registered',
            'redemption.registered',
            'customer.rejected_duplicate',
            'purchase.rejected_duplicate_invoice',
            'redemption.rejected_insufficient_points',
            'company.settings.updated'
        )
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_event_type;
END;
GO

IF OBJECT_ID('dbo.OperationalAuditEvents', 'U') IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents')
          AND name = 'CK_OperationalAuditEvents_entity_type'
    )
    BEGIN
        ALTER TABLE dbo.OperationalAuditEvents
        DROP CONSTRAINT CK_OperationalAuditEvents_entity_type;
    END;

    ALTER TABLE dbo.OperationalAuditEvents WITH CHECK
    ADD CONSTRAINT CK_OperationalAuditEvents_entity_type CHECK (
        entity_type IN ('customer', 'purchase', 'redemption', 'company')
    );

    ALTER TABLE dbo.OperationalAuditEvents
    CHECK CONSTRAINT CK_OperationalAuditEvents_entity_type;
END;
GO
```

Query recomendada para `PATCH /settings`:

```sql
UPDATE dbo.Companies
SET
    name = @name,
    email = @email,
    phone = @phone,
    logo_url = @logo_url,
    points_percentage = @points_percentage,
    updated_at = SYSUTCDATETIME()
OUTPUT
    INSERTED.id,
    INSERTED.name,
    INSERTED.email,
    INSERTED.phone,
    INSERTED.logo_url,
    INSERTED.points_percentage,
    INSERTED.status,
    INSERTED.updated_at
WHERE id = @company_id
  AND status = 'active';
```

Evento de auditoria recomendado:
- `event_type`: `company.settings.updated`
- `entity_type`: `company`
- `entity_id`: id de la empresa piloto
- `customer_id`: `NULL`
- `source`: `api`
- `actor_label`: nullable
- `metadata`: JSON minimo, sin secretos, por ejemplo:

```json
{
  "changedFields": ["name", "pointsPercentage"],
  "requestId": "..."
}
```

Riesgos:
- P1: Si se implementa auditoria de settings sin ampliar los checks, `recordAuditEvent` fallara; hoy es best-effort, por lo que no romperia caja, pero no quedaria trazabilidad del cambio.
- P1: Cambiar `points_percentage` afecta puntos ganados solo hacia compras futuras; compras existentes conservan `points_earned` persistido. Backend/API debe comunicarlo como configuracion prospectiva.
- P2: `updated_at` depende de que Backend/API lo actualice explicitamente. Si se olvida, UI podria mostrar settings actualizados con timestamp viejo.
- P2: No guardar valores anteriores completos en metadata si contienen PII. Para piloto, basta `changedFields`; si Product pide auditoria mas fuerte, definir politica de datos.

Recomendacion para Backend/API:
- Implementar `PATCH /api/companies/{companyId}/settings` usando `PILOT_COMPANY_ID` server-side.
- Validar:
  - `name` requerido/no vacio y max 160.
  - `email` nullable, formato email y max 254.
  - `phone` nullable y max 32.
  - `logoUrl` nullable, URL valida y max 2048.
  - `pointsPercentage > 0 AND <= 100`.
- Actualizar `updated_at = SYSUTCDATETIME()`.
- Si se audita el cambio, aplicar primero la migracion propuesta de checks o crear tarea SQL para hacerlo.
- Registrar `company.settings.updated` como auditoria best-effort con `entityId = companyId` y `customerId = null`.

Resultado:
El modelo SQL actual de `dbo.Companies` soporta configuracion basica de empresa piloto sin migracion sobre la tabla. La unica migracion recomendada es ampliar los checks de auditoria si se va a persistir el evento `company.settings.updated`.

Riesgos o pendientes:
- Backend/API debe confirmar si TASK-108 incluira auditoria del PATCH settings.
- Si si la incluye, Product/Release debe crear/aprobar una tarea SQL corta para aplicar la migracion de checks antes o junto con TASK-108.
- Si no se audita settings en esta ronda, no hay cambios SQL necesarios.

Siguiente recomendado:
Product / Architect / Release debe revisar este handoff y liberar TASK-108 para Backend/API con la decision de auditar o no `company.settings.updated`.
