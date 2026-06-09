# TASK-187 - Preparar SQL para rate limiting auth propia

Equipo responsable: SQL DEV

## Contexto

TASK-182 recomendo implementar rate limiting/lockout persistente para auth propia usando SQL, no memoria local, porque Azure Functions puede escalar o reciclar procesos.

La operacion autenticada publicada ya fue aprobada en TASK-186. Antes de abrir uso a mas empresas, conviene agregar defensa minima contra abuso de login y creacion de acceso.

## Objetivo

Preparar y, si corresponde segun el flujo del equipo, aplicar una migracion SQL pequena para soportar limites de intentos de autenticacion.

## Alcance

- Crear migracion versionada para tabla de limites, sugerida como `dbo.AuthAttemptLimits`.
- Soportar scopes minimos:
  - `company_login_email`;
  - `company_login_ip`;
  - `company_invitation_token`;
  - `company_invitation_ip`.
- Usar `subject_hash varbinary(32)` o equivalente para no guardar email/IP/token raw.
- Incluir campos de ventana, contador, bloqueo temporal y timestamps.
- Crear indice unico por `(scope, subject_hash)`.
- Crear indice util para `locked_until`.
- No guardar passwords, tokens raw, cookies, emails raw ni connection strings.
- No romper datos existentes.

## Entregable

Crear o actualizar `tasks/TASK-187-HANDOFF.md` con:

- Resultado.
- Migracion creada/aplicada.
- Nombre exacto de tabla, columnas e indices.
- Validaciones ejecutadas.
- Si no se aplico en Azure SQL, indicar pasos pendientes.
- Riesgos o pendientes.
