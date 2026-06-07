Equipo:
SQL DEV

Tarea completada:
TASK-097 - Disenar auditoria operativa minima en SQL.

Archivos cambiados:
- tasks/TASK-097-HANDOFF.md

SQL agregado o modificado:
- Ninguno aplicado en Azure SQL.
- Se propone una migracion no destructiva para crear una tabla nueva de auditoria.
- No se modificaron datos reales.
- No se cambio API ni frontend.

Supuestos:
- No hay autenticacion fuerte todavia; `actor_label` es texto opcional y no debe tratarse como identidad confiable.
- La fuente esperada inicial es Backend/API, usando `source = 'api'`.
- La auditoria debe registrar eventos operativos, no payloads completos ni secretos.
- `metadata` se guarda como JSON valido para flexibilidad MVP sin crear tablas adicionales.
- Los ids `bigint` se mantienen como ids SQL; Backend/API los serializa como string en JSON si los expone.
- Rechazos por duplicado o saldo insuficiente deben registrarse desde API, porque pueden ocurrir antes de insertar una compra/redencion.

SQL propuesto:

```sql
CREATE TABLE dbo.OperationalAuditEvents (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    event_type varchar(80) NOT NULL,
    entity_type varchar(40) NOT NULL,
    entity_id bigint NULL,
    customer_id bigint NULL,
    occurred_at datetime2(0) NOT NULL
        CONSTRAINT DF_OperationalAuditEvents_occurred_at DEFAULT (SYSUTCDATETIME()),
    actor_label nvarchar(120) NULL,
    source varchar(40) NOT NULL
        CONSTRAINT DF_OperationalAuditEvents_source DEFAULT ('api'),
    metadata nvarchar(max) NULL,
    CONSTRAINT PK_OperationalAuditEvents PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_OperationalAuditEvents_Companies
        FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT FK_OperationalAuditEvents_Customers
        FOREIGN KEY (company_id, customer_id) REFERENCES dbo.Customers(company_id, id),
    CONSTRAINT CK_OperationalAuditEvents_event_type CHECK (
        event_type IN (
            'customer.created',
            'purchase.registered',
            'redemption.registered',
            'customer.rejected_duplicate',
            'purchase.rejected_duplicate_invoice',
            'redemption.rejected_insufficient_points'
        )
    ),
    CONSTRAINT CK_OperationalAuditEvents_entity_type CHECK (
        entity_type IN ('customer', 'purchase', 'redemption')
    ),
    CONSTRAINT CK_OperationalAuditEvents_source CHECK (
        source IN ('api', 'web', 'system', 'manual')
    ),
    CONSTRAINT CK_OperationalAuditEvents_metadata_json CHECK (
        metadata IS NULL OR ISJSON(metadata) = 1
    )
);
GO

CREATE INDEX IX_OperationalAuditEvents_company_date
ON dbo.OperationalAuditEvents (company_id, occurred_at DESC, id DESC)
INCLUDE (event_type, entity_type, entity_id, customer_id, actor_label, source);
GO

CREATE INDEX IX_OperationalAuditEvents_company_customer_date
ON dbo.OperationalAuditEvents (company_id, customer_id, occurred_at DESC, id DESC)
INCLUDE (event_type, entity_type, entity_id, actor_label, source)
WHERE customer_id IS NOT NULL;
GO
```

Ejemplos de inserts desde Backend/API:

```sql
-- Backend/API debe construir @metadata_json como JSON valido y parametrizado.
-- SQL valida el formato con ISJSON(metadata) = 1.

-- Cliente creado
INSERT INTO dbo.OperationalAuditEvents (
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    actor_label,
    source,
    metadata
)
VALUES (
    @company_id,
    'customer.created',
    'customer',
    @customer_id,
    @customer_id,
    @actor_label,
    'api',
    @metadata_json
);

-- Compra registrada
INSERT INTO dbo.OperationalAuditEvents (
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    actor_label,
    source,
    metadata
)
VALUES (
    @company_id,
    'purchase.registered',
    'purchase',
    @purchase_id,
    @customer_id,
    @actor_label,
    'api',
    @metadata_json
);

-- Redencion registrada
INSERT INTO dbo.OperationalAuditEvents (
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    actor_label,
    source,
    metadata
)
VALUES (
    @company_id,
    'redemption.registered',
    'redemption',
    @redemption_id,
    @customer_id,
    @actor_label,
    'api',
    @metadata_json
);

-- Rechazo por factura duplicada
INSERT INTO dbo.OperationalAuditEvents (
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    actor_label,
    source,
    metadata
)
VALUES (
    @company_id,
    'purchase.rejected_duplicate_invoice',
    'purchase',
    NULL,
    @customer_id,
    @actor_label,
    'api',
    @metadata_json
);

-- Rechazo por saldo insuficiente
INSERT INTO dbo.OperationalAuditEvents (
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    actor_label,
    source,
    metadata
)
VALUES (
    @company_id,
    'redemption.rejected_insufficient_points',
    'redemption',
    NULL,
    @customer_id,
    @actor_label,
    'api',
    @metadata_json
);
```

Indices recomendados:
- `IX_OperationalAuditEvents_company_date`: consulta general por empresa y fecha descendente.
- `IX_OperationalAuditEvents_company_customer_date`: consulta de eventos por cliente dentro de empresa.
- No recomiendo indice inicial por `event_type` hasta ver uso real; si la pantalla filtra mucho por tipo, agregar luego:

```sql
-- Propuesta futura si QA/uso real confirma filtro frecuente por tipo.
CREATE INDEX IX_OperationalAuditEvents_company_event_date
ON dbo.OperationalAuditEvents (company_id, event_type, occurred_at DESC, id DESC)
INCLUDE (entity_type, entity_id, customer_id, actor_label, source);
```

Consultas de validacion post-migracion:

```sql
SELECT OBJECT_ID('dbo.OperationalAuditEvents', 'U') AS operational_audit_events_object_id;

SELECT name, is_disabled
FROM sys.indexes
WHERE object_id = OBJECT_ID('dbo.OperationalAuditEvents')
  AND name IN (
      'IX_OperationalAuditEvents_company_date',
      'IX_OperationalAuditEvents_company_customer_date'
  );

SELECT name, is_disabled, is_not_trusted
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents');

SELECT name, is_disabled, is_not_trusted
FROM sys.foreign_keys
WHERE parent_object_id = OBJECT_ID('dbo.OperationalAuditEvents');
```

Consulta operativa sugerida para lectura:

```sql
DECLARE @company_id bigint = @CompanyId;
DECLARE @date_from datetime2(0) = @DateFromUtc;
DECLARE @date_to datetime2(0) = @DateToUtc;
DECLARE @customer_id bigint = @CustomerId; -- nullable

SELECT
    id,
    company_id,
    event_type,
    entity_type,
    entity_id,
    customer_id,
    occurred_at,
    actor_label,
    source,
    metadata
FROM dbo.OperationalAuditEvents
WHERE company_id = @company_id
  AND occurred_at >= @date_from
  AND occurred_at < @date_to
  AND (@customer_id IS NULL OR customer_id = @customer_id)
ORDER BY occurred_at DESC, id DESC;
```

Decision sobre `ALTER` no destructivo:
- Si se aplica como migracion, este cambio es no destructivo porque solo crea una tabla nueva, constraints e indices nuevos.
- No requiere alterar `Companies`, `Customers`, `Purchases` ni `Redemptions`.
- No requiere backfill para datos existentes; la auditoria empezaria desde el momento de implementacion.
- Debe aplicarse en una tarea nueva de SQL/Infra, no en TASK-097.

Riesgos:
- P1: Si Backend/API registra la operacion principal pero falla al insertar auditoria fuera de la misma transaccion, puede quedar una accion sin traza. Recomendado: auditar en la misma transaccion cuando sea posible.
- P1: Si auditoria se vuelve obligatoria y falla, podria bloquear caja. Decision requerida por Product/Release: para piloto, preferir que operaciones exitosas intenten auditar en transaccion; para rechazos, registrar best-effort y loguear fallo tecnico.
- P2: `metadata` JSON flexible puede acumular campos inconsistentes. Backend/API debe centralizar nombres de campos por `event_type`.
- P2: No guardar PII innecesaria en `metadata`; cliente ya se puede resolver por `customer_id`. Evitar guardar telefono/email repetidos.
- P2: La tabla crecera con el uso. Para piloto es aceptable; post-piloto evaluar retencion/export.

Requiere aprobacion de Infra/Azure antes de aplicar:
- Si. Aunque no crea recursos Azure ni cambia datos existentes, si crea objeto SQL en la base production piloto.
- Requiere una tarea nueva para aplicar migracion, preferiblemente con:
  - ventana corta de cambio;
  - respaldo o punto de restauracion disponible;
  - validacion post-migracion;
  - despliegue coordinado con Backend/API para empezar a escribir eventos.

Recomendacion para Backend/API:
- Implementar una funcion interna `recordAuditEvent(...)` parametrizada.
- Usar `PILOT_COMPANY_ID` server-side; no aceptar `company_id` desde body.
- Generar o propagar `requestId` y guardarlo en `metadata`.
- Usar `actor_label` nullable, por ejemplo `Caja piloto` o `null`; no inventar usuario.
- Registrar:
  - `customer.created` despues de crear cliente;
  - `purchase.registered` despues de crear compra;
  - `redemption.registered` despues de registrar redencion;
  - `customer.rejected_duplicate` cuando API devuelva `409 DUPLICATE_CUSTOMER`;
  - `purchase.rejected_duplicate_invoice` cuando API devuelva `409 DUPLICATE_INVOICE`;
  - `redemption.rejected_insufficient_points` cuando API devuelva `409 INSUFFICIENT_POINTS`.

Resultado:
Diseno SQL minimo listo para que Product/Release cree una tarea posterior de aplicacion e integracion Backend/API.

Riesgos o pendientes:
- Falta decision de Product/Release sobre si un fallo de auditoria debe bloquear operaciones exitosas durante piloto.
- Falta tarea de aplicacion SQL.
- Falta tarea Backend/API para escribir eventos.
- Falta tarea Web/QA para consultar y validar auditoria operativa si se decide exponerla.

Siguiente recomendado:
Product/Release debe crear tarea SQL/Infra para aplicar la migracion y tarea Backend/API para registrar eventos desde los flujos criticos.
