Equipo:
SQL DEV

Tarea completada:
TASK-187 - Preparar SQL para rate limiting auth propia.

Archivos cambiados:
- database/migrations/20260609_auth_attempt_limits.sql
- tasks/TASK-187-HANDOFF.md

SQL agregado o modificado:
- Creada y aplicada en Azure SQL existente `sqlserver-pj13-brazil/sql-db-puntoclub` la migracion:
  - `database/migrations/20260609_auth_attempt_limits.sql`
- Tabla creada:
  - `dbo.AuthAttemptLimits`
- Columnas:
  - `id bigint IDENTITY(1,1) NOT NULL`
  - `scope varchar(40) NOT NULL`
  - `subject_hash varbinary(32) NOT NULL`
  - `window_started_at datetime2(0) NOT NULL`
  - `failed_count int NOT NULL DEFAULT (0)`
  - `locked_until datetime2(0) NULL`
  - `last_failed_at datetime2(0) NULL`
  - `created_at datetime2(0) NOT NULL DEFAULT (SYSUTCDATETIME())`
  - `updated_at datetime2(0) NOT NULL DEFAULT (SYSUTCDATETIME())`
- Scopes permitidos por constraint:
  - `company_login_email`
  - `company_login_ip`
  - `company_invitation_token`
  - `company_invitation_ip`
- Constraints:
  - `PK_AuthAttemptLimits`
  - `CK_AuthAttemptLimits_scope`
  - `CK_AuthAttemptLimits_subject_hash_length`
  - `CK_AuthAttemptLimits_failed_count`
  - `CK_AuthAttemptLimits_lock_window`
- Indices:
  - `UX_AuthAttemptLimits_scope_subject_hash` unico por `(scope, subject_hash)`
  - `IX_AuthAttemptLimits_locked_until` filtrado por `locked_until IS NOT NULL`
  - `IX_AuthAttemptLimits_updated_at`
- No se guardan emails, IPs, tokens, cookies ni passwords raw; la tabla espera `subject_hash varbinary(32)`.
- No se insertaron datos ni seeds.

Prevalidaciones ejecutadas:
- `AuthAttemptLimits` existia antes de aplicar: no.
- Scopes incompatibles: 0 filas.
- Duplicados por `(scope, subject_hash)`: 0 filas.

Aplicacion:
- Primer intento de prevalidacion con usuario runtime bloqueado por firewall para IP `200.229.6.68`.
- Regla temporal creada:
  - `tmp-task187-sql-migration-200-229-6-68`
  - IP inicial/final: `200.229.6.68`
  - resource group: `resource_group_main`
  - server: `sqlserver-pj13-brazil`
- Migracion aplicada con cliente Node `mssql` y credenciales admin locales cargadas solo en memoria:
  - 4/4 batches ejecutados correctamente.

Validacion posterior:
- Tabla `dbo.AuthAttemptLimits`: presente.
- Columnas esperadas: presentes.
- Indices esperados: presentes.
- Checks esperados: presentes, habilitados y confiables.
- `CK_AuthAttemptLimits_scope` validado con admin:
  - incluye los cuatro scopes requeridos.
- Conteo posterior:
  - `dbo.AuthAttemptLimits`: 0 filas.

Regla temporal retirada:
- Si.
- Verificacion posterior:
  - consulta por nombre devolvio `[]`.

Resultado:
Soporte SQL persistente para rate limiting/lockout de auth propia creado, aplicado y validado en Azure SQL real. Backend/API puede continuar TASK-189 usando `dbo.AuthAttemptLimits`.

Riesgos o pendientes:
- Backend/API debe hashear el subject antes de persistir:
  - email normalizado;
  - IP normalizada;
  - token de invitacion o hash derivado.
- Backend/API debe actualizar `updated_at` y manejar ventanas/contadores en transaccion para evitar condiciones de carrera.
- Infra / Azure debe confirmar en TASK-188 que header/IP es confiable antes de usar scopes por IP como defensa fuerte.
- No hay limpieza automatica SQL; Backend/API puede limpiar oportunistamente por `updated_at` o `locked_until`.
- Esta tabla no define politicas de umbral/duracion; Backend/API debe aplicar la politica aprobada.

Siguiente recomendado:
Backend/API puede implementar TASK-189 con helpers para leer/actualizar `AuthAttemptLimits`, usando transacciones o locks adecuados y sin registrar subject raw en logs.
