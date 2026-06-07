Equipo:
SQL DEV

Tarea completada:
TASK-115 - Disenar modelo SQL para registro de empresas e invitaciones.

Archivos cambiados:
- tasks/TASK-115-HANDOFF.md
- docs/TASK_BOARD.md

SQL agregado o modificado:
- Ninguno aplicado en Azure SQL.
- Se propone modelo y migracion futura no aplicada para multiempresa controlado con registro/invitaciones.
- No se crearon seeds productivos.
- No se implemento auth/password.
- No se cambio API.
- No se imprimieron secretos.

Verificacion ejecutada:
- Leido `tasks/TASK-115-assignment.md`.
- Leido `docs/TASK_BOARD.md`.
- Confirmado que `TASK-115` estaba en `Assigned`, asignada a SQL DEV y sin dependencias.
- Movida `TASK-115` de `Assigned` a `In Progress`.
- Leido `chat-start/SQL_DEV.md`.
- Leido `docs/DATA_MODEL.md`.
- Leido `docs/ARCHITECTURE.md`.
- Leido `docs/NEXT_PHASE_COMPANY_MULTIEMPRESA.md`.
- Leido `tasks/TASK-111-HANDOFF.md`.
- Leido `database/schema.sql`.

Contexto de decision:
- TASK-111 mantuvo Opcion A como fase activa: empresa piloto unica con `PILOT_COMPANY_ID`.
- TASK-115 pide disenar persistencia para registro/invitacion antes de implementar API/UI.
- Este handoff no activa multiempresa por si solo; deja el modelo listo para que Product / Architect / Release decida alcance.

Propuesta de modelo:

1. `dbo.Companies`
- Mantener como entidad canonical de empresa operativa.
- Ya contiene:
  - `id`
  - `name`
  - `email`
  - `phone`
  - `logo_url`
  - `points_percentage`
  - `status`
  - `created_at`
  - `updated_at`
- Cambio recomendado:
  - ampliar `status` para aceptar `pending_activation`.
  - agregar unicidad filtrada de `email` cuando existe.
- No recomiendo unicidad de `name` en MVP: nombres comerciales pueden repetirse o variar.

2. `dbo.CompanyRegistrationRequests`
- Guarda solicitudes publicas o internas antes de crear/activar una empresa.
- Evita crear empresas operativas hasta aprobacion.
- Campos clave:
  - datos solicitados de empresa;
  - contacto inicial;
  - estado de revision;
  - timestamps de solicitud/revision;
  - `review_note` para motivo interno.

3. `dbo.CompanyInvitations`
- Guarda invitaciones enviadas a un correo para activar/acceder a una empresa.
- Usa `token_hash`, nunca token plano.
- Tiene expiracion y estado.
- Puede apuntar a `company_id` y opcionalmente a `registration_request_id`.

4. `dbo.CompanyUsers`
- Guarda miembros/accesos asociados a una empresa.
- Permite auth local minima o referencia externa futura.
- Para password propio, guardar solo hash, nunca password plano.
- Para proveedor externo, guardar `auth_provider` + `external_subject`.
- Relaciona usuario con empresa mediante `company_id`.

5. Logo / metadata
- Para esta fase, `Companies.logo_url` sigue siendo suficiente si se usa URL externa.
- Si Infra decide upload propio, agregar columnas simples en `Companies` o tabla separada luego. No bloquear registro/invitacion por logo.

SQL propuesto:

```sql
-- Proposed migration for controlled company registration/invitations.
-- Not applied in TASK-115.

-- 1. Expand company lifecycle.
IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.Companies')
      AND name = 'CK_Companies_status'
)
BEGIN
    ALTER TABLE dbo.Companies
    DROP CONSTRAINT CK_Companies_status;
END;
GO

ALTER TABLE dbo.Companies WITH CHECK
ADD CONSTRAINT CK_Companies_status CHECK (
    status IN ('pending_activation', 'active', 'inactive')
);
GO

ALTER TABLE dbo.Companies
CHECK CONSTRAINT CK_Companies_status;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.Companies')
      AND name = 'UX_Companies_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_Companies_email
    ON dbo.Companies (email)
    WHERE email IS NOT NULL;
END;
GO

-- 2. Registration requests before approval/company activation.
CREATE TABLE dbo.CompanyRegistrationRequests (
    id bigint IDENTITY(1,1) NOT NULL,
    company_name nvarchar(160) NOT NULL,
    company_email nvarchar(254) NOT NULL,
    company_phone nvarchar(32) NULL,
    contact_name nvarchar(160) NULL,
    contact_email nvarchar(254) NOT NULL,
    contact_phone nvarchar(32) NULL,
    requested_logo_url nvarchar(2048) NULL,
    status varchar(30) NOT NULL
        CONSTRAINT DF_CompanyRegistrationRequests_status DEFAULT ('pending'),
    reviewed_at datetime2(0) NULL,
    reviewed_by_label nvarchar(120) NULL,
    review_note nvarchar(500) NULL,
    approved_company_id bigint NULL,
    created_at datetime2(0) NOT NULL
        CONSTRAINT DF_CompanyRegistrationRequests_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at datetime2(0) NOT NULL
        CONSTRAINT DF_CompanyRegistrationRequests_updated_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_CompanyRegistrationRequests PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_CompanyRegistrationRequests_ApprovedCompany
        FOREIGN KEY (approved_company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT CK_CompanyRegistrationRequests_status CHECK (
        status IN ('pending', 'approved', 'rejected', 'cancelled')
    )
);
GO

CREATE INDEX IX_CompanyRegistrationRequests_status_created
ON dbo.CompanyRegistrationRequests (status, created_at DESC, id DESC)
INCLUDE (company_name, company_email, contact_email);
GO

CREATE UNIQUE INDEX UX_CompanyRegistrationRequests_pending_company_email
ON dbo.CompanyRegistrationRequests (company_email)
WHERE status = 'pending';
GO

-- 3. Invitations. Store only token hash, never the raw token.
CREATE TABLE dbo.CompanyInvitations (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    registration_request_id bigint NULL,
    email nvarchar(254) NOT NULL,
    token_hash varbinary(32) NOT NULL,
    role varchar(30) NOT NULL
        CONSTRAINT DF_CompanyInvitations_role DEFAULT ('owner'),
    status varchar(30) NOT NULL
        CONSTRAINT DF_CompanyInvitations_status DEFAULT ('pending'),
    expires_at datetime2(0) NOT NULL,
    accepted_at datetime2(0) NULL,
    revoked_at datetime2(0) NULL,
    created_at datetime2(0) NOT NULL
        CONSTRAINT DF_CompanyInvitations_created_at DEFAULT (SYSUTCDATETIME()),
    created_by_label nvarchar(120) NULL,
    CONSTRAINT PK_CompanyInvitations PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_CompanyInvitations_Companies
        FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT FK_CompanyInvitations_RegistrationRequests
        FOREIGN KEY (registration_request_id) REFERENCES dbo.CompanyRegistrationRequests(id),
    CONSTRAINT CK_CompanyInvitations_role CHECK (
        role IN ('owner', 'admin', 'staff')
    ),
    CONSTRAINT CK_CompanyInvitations_status CHECK (
        status IN ('pending', 'accepted', 'revoked', 'expired')
    )
);
GO

CREATE UNIQUE INDEX UX_CompanyInvitations_token_hash
ON dbo.CompanyInvitations (token_hash);
GO

CREATE UNIQUE INDEX UX_CompanyInvitations_pending_email_company
ON dbo.CompanyInvitations (company_id, email)
WHERE status = 'pending';
GO

CREATE INDEX IX_CompanyInvitations_company_status
ON dbo.CompanyInvitations (company_id, status, created_at DESC)
INCLUDE (email, role, expires_at);
GO

CREATE INDEX IX_CompanyInvitations_email_status
ON dbo.CompanyInvitations (email, status, expires_at);
GO

-- 4. Users/members per company.
CREATE TABLE dbo.CompanyUsers (
    id bigint IDENTITY(1,1) NOT NULL,
    company_id bigint NOT NULL,
    email nvarchar(254) NOT NULL,
    display_name nvarchar(160) NULL,
    role varchar(30) NOT NULL
        CONSTRAINT DF_CompanyUsers_role DEFAULT ('owner'),
    status varchar(30) NOT NULL
        CONSTRAINT DF_CompanyUsers_status DEFAULT ('active'),
    auth_provider varchar(40) NOT NULL
        CONSTRAINT DF_CompanyUsers_auth_provider DEFAULT ('local'),
    external_subject nvarchar(255) NULL,
    password_hash varbinary(256) NULL,
    password_set_at datetime2(0) NULL,
    last_login_at datetime2(0) NULL,
    created_at datetime2(0) NOT NULL
        CONSTRAINT DF_CompanyUsers_created_at DEFAULT (SYSUTCDATETIME()),
    updated_at datetime2(0) NOT NULL
        CONSTRAINT DF_CompanyUsers_updated_at DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_CompanyUsers PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_CompanyUsers_Companies
        FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
    CONSTRAINT CK_CompanyUsers_role CHECK (
        role IN ('owner', 'admin', 'staff')
    ),
    CONSTRAINT CK_CompanyUsers_status CHECK (
        status IN ('invited', 'active', 'disabled')
    ),
    CONSTRAINT CK_CompanyUsers_auth_provider CHECK (
        auth_provider IN ('local', 'external')
    ),
    CONSTRAINT CK_CompanyUsers_local_password CHECK (
        (auth_provider = 'local' AND password_hash IS NOT NULL)
        OR (auth_provider = 'external' AND external_subject IS NOT NULL)
    )
);
GO

CREATE UNIQUE INDEX UX_CompanyUsers_company_email
ON dbo.CompanyUsers (company_id, email);
GO

CREATE UNIQUE INDEX UX_CompanyUsers_external_subject
ON dbo.CompanyUsers (auth_provider, external_subject)
WHERE external_subject IS NOT NULL;
GO

CREATE INDEX IX_CompanyUsers_company_status
ON dbo.CompanyUsers (company_id, status, role)
INCLUDE (email, display_name);
GO
```

Eventos auditables recomendados:
- `company.registration.submitted`
- `company.registration.approved`
- `company.registration.rejected`
- `company.invitation.created`
- `company.invitation.accepted`
- `company.invitation.revoked`
- `company.user.created`
- `company.user.disabled`

Impacto en `dbo.OperationalAuditEvents`:
- Los checks actuales ya aceptan `entity_type = company` y `company.settings.updated`.
- Para los eventos anteriores habria que ampliar `CK_OperationalAuditEvents_event_type` nuevamente, o cambiar estrategia a un catalogo de tipos de evento.
- Recomendacion para esta fase: si se agregan muchos eventos, crear `dbo.AuditEventTypes` y reemplazar check cerrado por FK/catalogo en una tarea separada.

Impacto sobre `PILOT_COMPANY_ID`:
- Mientras siga modo empresa piloto unica, `PILOT_COMPANY_ID` debe mantenerse como fuente confiable para endpoints operativos existentes.
- Registro/invitacion no debe permitir operar datos de una empresa nueva hasta que Backend/API tenga auth/autorizacion server-side.
- Para multiempresa controlado, el `companyId` efectivo debe salir del usuario autenticado/sesion/token, no del frontend.
- Los endpoints operativos pueden conservar `/api/companies/{companyId}`, pero Backend/API debe validar que ese `companyId` pertenece al usuario autenticado.

Separacion por `companyId`:
- El modelo actual ya separa `Customers`, `Purchases`, `Redemptions`, reportes y auditoria por `company_id`.
- `CompanyUsers` agrega la relacion usuario-empresa necesaria para autorizacion futura.
- Invitaciones y requests no deben exponer datos operativos; solo preparan acceso.

Logo:
- `Companies.logo_url` es suficiente para URL externa o URL publica controlada.
- Si se implementa upload propio, Infra debe decidir storage y Backend puede guardar en `logo_url` la URL final.
- No recomiendo agregar metadata de storage ahora salvo que Infra confirme Azure Storage propio. Si se confirma, columnas futuras posibles:
  - `logo_storage_path nvarchar(512) NULL`
  - `logo_content_type nvarchar(100) NULL`
  - `logo_updated_at datetime2(0) NULL`

Decisiones abiertas:
- Auth:
  - local con password propio;
  - Azure Static Web Apps auth;
  - proveedor externo;
  - modelo hibrido.
- Si se guarda password local:
  - algoritmo de hash;
  - longitud/formato de `password_hash`;
  - politica de reset/rotacion.
- Si se crea `Companies` al aprobar solicitud o al aceptar invitacion.
- Si empresas pendientes deben vivir en `Companies.status = pending_activation` o solo en `CompanyRegistrationRequests`.
- Expiracion default de invitaciones.
- Si `company_email` debe ser unico globalmente desde solicitud o solo al aprobar.
- Politica de retencion de solicitudes rechazadas/canceladas.
- Si admin interno necesitara tabla separada de administradores globales.

Riesgos de integridad/seguridad:
- P0: No confiar en `companyId` enviado por frontend para separar empresas.
- P0: No guardar tokens de invitacion en texto plano; guardar solo `token_hash`.
- P0: No guardar passwords en texto plano; usar solo hash gestionado por backend/auth provider.
- P1: `UX_Companies_email` puede fallar al aplicar si ya existen emails duplicados no nulos; requiere auditoria previa.
- P1: `UX_CompanyRegistrationRequests_pending_company_email` evita duplicados pendientes, pero no evita solicitudes historicas repetidas aprobadas/rechazadas, intencionalmente.
- P1: Con check cerrado en `OperationalAuditEvents.event_type`, cada nuevo evento requiere migracion; evaluar catalogo.
- P1: Permitir multiples invitaciones pendientes para el mismo email/empresa aumenta riesgo operativo; se recomienda indice unico filtrado.
- P2: `updated_at` en tablas nuevas debe actualizarlo Backend/API; SQL no propone triggers por ahora.
- P2: Logo/upload puede introducir costos, permisos y exposicion de archivos si se implementa sin decision Infra.

Validacion sugerida antes de aplicar en futura tarea:
- Auditar duplicados:
  - `SELECT email, COUNT(*) FROM dbo.Companies WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1;`
- Confirmar que `dbo.OperationalAuditEvents` existe si se van a auditar eventos.
- Ejecutar migracion en orden:
  1. ampliar `Companies.status` y `UX_Companies_email`;
  2. crear `CompanyRegistrationRequests`;
  3. crear `CompanyInvitations`;
  4. crear `CompanyUsers`;
  5. ampliar auditoria/catalogo de eventos si aplica.

Resultado:
Modelo SQL minimo propuesto para que Backend/API defina contratos de registro, aprobacion, invitacion y acceso por empresa, y para que Product / Architect / Release decida si se implementa multiempresa controlado.

Riesgos o pendientes:
- No aplicar este SQL sin decision de Product / Architect / Release sobre auth y flujo exacto.
- Infra debe definir email, auth y storage/logo antes de cerrar detalles de invitaciones y usuarios.
- Backend/API debe decidir si usa password local o identidad externa para ajustar `CompanyUsers`.

Siguiente recomendado:
Product / Architect / Release debe comparar este handoff con TASK-113 y TASK-114, y luego liberar TASK-116 para contratos API si decide avanzar con multiempresa controlado.
