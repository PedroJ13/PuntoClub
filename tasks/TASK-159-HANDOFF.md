Equipo:
SQL DEV

Tarea completada:
TASK-159 - Preparar SQL para auth propia MVP de empresas.

Archivos cambiados:
- database/migrations/20260608_company_local_auth_sessions.sql
- tasks/TASK-159-HANDOFF.md

SQL agregado o modificado:
- Creada migracion versionada no aplicada:
  - `database/migrations/20260608_company_local_auth_sessions.sql`
- La migracion adapta `dbo.CompanyUsers` para auth propia MVP:
  - permite `auth_provider IN ('local_password', 'entra_external_id')`;
  - cambia el default de `auth_provider` a `local_password`;
  - hace `external_subject` nullable;
  - recrea `UX_CompanyUsers_auth_subject` como indice unico filtrado solo cuando `external_subject IS NOT NULL`;
  - agrega `password_hash`, `password_algorithm`, `password_params`, `password_updated_at`, `password_failed_attempts`, `password_locked_until`;
  - agrega constraint para exigir hash/algoritmo/timestamp en usuarios `local_password` no `invited`;
  - agrega constraint para mantener `external_subject` obligatorio en `entra_external_id`;
  - agrega indice unico filtrado `UX_CompanyUsers_local_password_email` para evitar login ambiguo por email en auth local;
  - agrega `IX_CompanyUsers_login_email` para lookup de login.
- La migracion crea `dbo.CompanySessions`:
  - `company_id`;
  - `company_user_id`;
  - `token_hash varbinary(32)`;
  - `status`;
  - `expires_at`;
  - `created_at`;
  - `last_seen_at`;
  - `revoked_at`;
  - FK a `Companies`;
  - FK compuesta a `CompanyUsers(company_id, id)`;
  - constraint de longitud de `token_hash`;
  - constraint de estado `active`, `revoked`, `expired`;
  - indices para buscar sesion por `token_hash`, usuario/estado y expiracion.

Verificacion ejecutada:
- Leido `tasks/TASK-159-assignment.md`.
- Leido `chat-start/SQL_DEV.md`.
- Leido `AGENTS.md`.
- Leido `docs/DECISION_LOG.md`.
- Leido `docs/API_CONTRACTS.md`.
- Leido `docs/DATA_MODEL.md`.
- Revisada migracion vigente `database/migrations/20260607_company_registration_invitations.sql`.
- Revisado que no existia `tasks/TASK-159-HANDOFF.md`.
- Revision estatica de la nueva migracion:
  - contiene `local_password`;
  - contiene `CompanySessions`;
  - usa `password_hash`, no password plano;
  - usa `token_hash`, no token plano;
  - no contiene `INSERT`, `UPDATE` ni `DELETE`;
  - los `DROP` son solo para recrear constraint/index/default necesarios sobre `CompanyUsers`.

Prevalidaciones sugeridas antes de aplicar:

```sql
SELECT auth_provider, COUNT(*) AS rows_count
FROM dbo.CompanyUsers
GROUP BY auth_provider
HAVING auth_provider NOT IN ('local_password', 'entra_external_id');
```

```sql
SELECT email, COUNT(*) AS duplicates
FROM dbo.CompanyUsers
WHERE auth_provider = 'local_password'
GROUP BY email
HAVING COUNT(*) > 1;
```

```sql
SELECT auth_provider, external_subject, COUNT(*) AS duplicates
FROM dbo.CompanyUsers
WHERE external_subject IS NOT NULL
GROUP BY auth_provider, external_subject
HAVING COUNT(*) > 1;
```

```sql
SELECT id, company_id, email
FROM dbo.CompanyUsers
WHERE auth_provider = 'entra_external_id'
  AND external_subject IS NULL;
```

Resultado:
Migracion SQL preparada para soportar auth propia MVP con password hash y sesiones server-side. No fue aplicada en Azure SQL.

Riesgos o pendientes:
- `UX_CompanyUsers_local_password_email` hace unico el email para auth local. Esto simplifica `POST /api/company-auth/login` por email, pero impide que el mismo correo tenga acceso local a varias empresas durante el piloto.
- Backend/API debe elegir algoritmo fuerte y formato de `password_hash`. La columna `password_hash nvarchar(512)` soporta formatos autocontenidos tipo PHC/bcrypt/argon2; `password_algorithm` y `password_params` quedan como metadata operativa.
- Backend/API debe guardar solo hash de sesion en `CompanySessions.token_hash`; la cookie debe contener solo token aleatorio raw y nunca persistirse en frontend.
- Backend/API debe setear `password_updated_at` al crear/cambiar password, o el constraint bloqueara usuarios `local_password` activos sin hash completo.
- `CompanySessions` no limpia sesiones expiradas automaticamente; se requiere job/tarea futura o limpieza oportunista desde API.
- No se agregaron eventos nuevos de auditoria para login/logout en esta migracion; si Product los requiere, hace falta ampliar `CK_OperationalAuditEvents_event_type`.
- Esta migracion mantiene compatibilidad con `entra_external_id` para una fase posterior, pero el default nuevo queda en `local_password`.

Confirmacion de Azure SQL:
- No se aplico esta migracion en Azure SQL.
- No se abrio regla temporal de firewall.
- No se usaron credenciales ni se imprimieron secretos.

Siguiente recomendado:
Product / Architect / Release y Backend/API deben revisar el tradeoff de email unico global para auth local. Si se aprueba, SQL DEV o Infra puede aplicar la migracion en una tarea separada con prevalidaciones y validacion posterior.
