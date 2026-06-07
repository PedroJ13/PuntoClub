# TASK-121 - Handoff

## Equipo

SQL DEV

## Estado

Completado para revision. Migracion preparada, no aplicada en Azure SQL.

## Archivo de migracion creado

- `database/migrations/20260607_company_registration_invitations.sql`

## Resumen de cambios

- Amplia `dbo.Companies.status` para aceptar `pending_activation`, `active`, `inactive`.
- Agrega `dbo.Companies.address` para el flujo aprobado de registro/configuracion.
- Agrega metadata minima de logo en `dbo.Companies` sin acoplarse a storage publico:
  - `logo_blob_path`
  - `logo_content_type`
  - `logo_updated_at`
- Agrega unicidad filtrada `UX_Companies_email` para `Companies.email` cuando no es NULL.
- Crea `dbo.CompanyRegistrationRequests` para solicitudes controladas de empresa.
- Crea `dbo.CompanyInvitations` para invitaciones por empresa con `token_hash`, expiracion y estados.
- Crea `dbo.CompanyUsers` para mapear usuarios autenticados por Microsoft Entra External ID a una empresa.
- Amplia checks de `dbo.OperationalAuditEvents` para eventos y entidades relacionadas con registro, invitaciones, usuarios y logo.

## Decisiones SQL aplicadas

- No se guarda password local ni hash de password propio.
- `CompanyUsers.auth_provider` queda limitado a `entra_external_id`.
- `CompanyUsers.external_subject` es obligatorio y tiene unicidad junto con `auth_provider`.
- Las invitaciones guardan solo `token_hash varbinary(32)`, nunca token plano.
- `CompanyRegistrationRequests.company_address` es obligatorio porque TASK-119 marco `address` como requerido para el flujo futuro.
- Logo queda representado como path/metadata privada de blob, no como blob publico.

## Prevalidaciones recomendadas antes de aplicar

```sql
SELECT email, COUNT(*) AS duplicates
FROM dbo.Companies
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

```sql
SELECT status, COUNT(*) AS rows_count
FROM dbo.Companies
GROUP BY status
HAVING status NOT IN ('pending_activation', 'active', 'inactive');
```

```sql
SELECT event_type, COUNT(*) AS rows_count
FROM dbo.OperationalAuditEvents
WHERE event_type NOT IN (
    'customer.created',
    'purchase.registered',
    'redemption.registered',
    'customer.rejected_duplicate',
    'purchase.rejected_duplicate_invoice',
    'redemption.rejected_insufficient_points',
    'company.settings.updated',
    'company.registration.submitted',
    'company.registration.approved',
    'company.registration.rejected',
    'company.invitation.created',
    'company.invitation.accepted',
    'company.invitation.revoked',
    'company.user.created',
    'company.user.disabled',
    'company.logo.updated'
)
GROUP BY event_type;
```

## Riesgos antes de aplicar

- `UX_Companies_email` fallara si existen emails duplicados no nulos en `dbo.Companies`.
- La ampliacion de checks de auditoria puede fallar si ya existen eventos fuera del catalogo permitido.
- `CompanyUsers.external_subject` requiere que Backend/API ya tenga claro el identificador estable que entregara Entra External ID.
- `CompanyRegistrationRequests.company_address` es `NOT NULL`; Backend/API debe requerirlo desde el contrato.
- `updated_at` no se actualiza por trigger; Backend/API debe mantenerlo al modificar registros.
- Esta migracion no activa aislamiento multiempresa por si sola. Backend/API debe resolver `companyId` desde usuario autenticado y mapeo SQL, no desde frontend.

## Dependencias para futura aplicacion

- Product / Architect / Release debe aprobar el modelo final antes de aplicar en Azure SQL.
- Backend/API debe revisar contratos de registro, aprobacion, invitacion, aceptacion y `/api/me`.
- Infra/Azure debe confirmar configuracion de ACS Email, Microsoft Entra External ID y Blob Storage privado.
- QA debe validar aislamiento por empresa despues de que Backend/API use `CompanyUsers`.

## Validacion ejecutada

- Leido `tasks/TASK-121-assignment.md`.
- Leidos handoffs relevantes: `TASK-115`, `TASK-119`, `TASK-114`, `TASK-116`.
- Revisado `database/schema.sql` y migraciones existentes.
- Creado script versionado en `database/migrations/`.
- Revisión estatica con `Select-String` para confirmar:
  - tablas creadas;
  - indices unicos filtrados;
  - `address` y metadata de logo;
  - uso de `token_hash`;
  - ausencia de columnas de password.

## No ejecutado

- No se aplico la migracion en Azure SQL.
- No se crearon seeds productivos.
- No se cambio API.
- No se cambio UI.
- No se configuraron auth, email ni storage.
