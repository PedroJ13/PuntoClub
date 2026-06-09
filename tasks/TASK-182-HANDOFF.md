# TASK-182 - Handoff Backend API

## Resultado

Propuesta tecnica completada. No se implemento codigo ni se tocaron recursos Azure, segun alcance.

Recomendacion: implementar rate limiting/lockout persistente en SQL para `POST /api/company-auth/login` y `POST /api/company-invitations/accept`. No usar memoria local como mecanismo principal porque Azure Functions puede escalar, reciclar procesos o ejecutar instancias paralelas.

## Recomendacion tecnica

### Login

Endpoint:

- `POST /api/company-auth/login`

Reglas minimas recomendadas:

- Por email normalizado:
  - permitir hasta `5` intentos fallidos en ventana de `15` minutos;
  - al sexto fallo, bloquear el email por `15` minutos;
  - respuesta mientras esta bloqueado: `423 ACCOUNT_LOCKED` o `429 TOO_MANY_REQUESTS`.
- Por IP:
  - si se puede obtener IP confiable desde headers de Azure Functions, aplicar limite suave adicional;
  - ejemplo: `30` fallos por IP en `15` minutos;
  - respuesta: `429 TOO_MANY_REQUESTS`.
- Reset:
  - al login exitoso, limpiar contador de fallos para ese email.
- Seguridad de respuesta:
  - mantener mensaje generico para credenciales invalidas: `Invalid email or password.`
  - para bloqueo temporal usar copy no sensible: `Too many attempts. Please try again later.`
  - no revelar si el email existe.

### Crear acceso / aceptar invitacion

Endpoint:

- `POST /api/company-invitations/accept`

Reglas minimas recomendadas:

- Por token hash:
  - permitir hasta `5` intentos fallidos en `15` minutos;
  - bloquear temporalmente el token/invitacion por `15` minutos si excede.
- Por email de invitacion:
  - cuando el token existe, asociar fallos al email de la invitacion sin exponerlo.
- Por IP:
  - limite suave adicional, por ejemplo `30` fallos por IP en `15` minutos.
- Respuesta:
  - si excede limite: `429 TOO_MANY_REQUESTS`;
  - copy: `Too many attempts. Please try again later.`
- No registrar password raw, token raw ni hash de password en logs/auditoria.

## Cambios necesarios por capa

### SQL

Agregar una tabla pequena de intentos/bloqueos, por ejemplo `dbo.AuthAttemptLimits`:

Campos sugeridos:

- `id bigint identity primary key`
- `scope varchar(40)`:
  - `company_login_email`
  - `company_login_ip`
  - `company_invitation_token`
  - `company_invitation_ip`
- `subject_hash varbinary(32)`
  - hash SHA-256 de email normalizado, IP normalizada o token hash derivado;
  - no guardar email/IP/token raw si no es necesario.
- `window_started_at datetime2(0)`
- `failed_count int`
- `locked_until datetime2(0) null`
- `last_failed_at datetime2(0) null`
- `created_at datetime2(0)`
- `updated_at datetime2(0)`

Indices:

- unico por `(scope, subject_hash)`;
- indice por `locked_until` para limpieza/consulta.

Alternativa aceptable si se decide algo aun mas pequeno:

- usar columnas existentes en `CompanyUsers` para login por email si ya hay `password_locked_until`;
- aun asi se requiere una tabla separada para IP y para invitaciones, porque una invitacion no siempre tiene usuario activo.

### Backend/API

Agregar helpers en repository/lib:

- `getAuthLimit(scope, subjectHash)`
- `recordAuthFailure(scope, subjectHash, policy)`
- `clearAuthFailures(scope, subjectHash)`
- `assertNotRateLimited(scope, subjectHash)`

Integracion login:

1. Normalizar email.
2. Verificar limite por email antes de PBKDF2.
3. Verificar limite por IP si IP confiable esta disponible.
4. En fallo de credenciales/estado, registrar fallo.
5. En exito, limpiar fallos por email.

Integracion accept:

1. Validar formato basico del token sin registrar token raw.
2. Aplicar limite por IP antes de trabajo caro.
3. Si token existe, aplicar limite por token hash/invitacion.
4. En fallos controlados de token/password/duplicado, registrar fallo segun corresponda.
5. En exito, limpiar fallos por token.

### Azure Functions / Infra

IP confiable:

- Revisar headers disponibles en la Function App publicada.
- Candidatos usuales:
  - `x-forwarded-for`
  - `x-client-ip`
  - headers propios de plataforma.
- Definir una funcion `getClientIp(request)` que:
  - use solo headers confiables del entorno Azure;
  - normalice IPv4/IPv6;
  - tome el primer IP publico valido si aplica;
  - degrade sin IP limit si no hay senal confiable.

No se recomienda:

- rate limiting in-memory en Azure Functions para produccion;
- depender solo de App Service/Front Door si no existe ese componente en arquitectura actual;
- almacenar tokens raw, passwords o cookies.

## Contrato de errores recomendado

Agregar a `docs/API_CONTRACTS.md` cuando se apruebe implementar:

```json
{
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many attempts. Please try again later."
  }
}
```

Status sugerido:

- `429 Too Many Requests` para rate limit por ventana.
- `423 Locked` solo si Product/Architect prefiere distinguir bloqueo de cuenta; para no revelar existencia de email, `429` es mas simple y seguro.

Recomendacion final: usar `429 TOO_MANY_ATTEMPTS` para ambos endpoints.

## Riesgos

- P1: un lockout por email puede ser usado para denegar acceso a usuarios legitimos si el umbral es muy bajo.
- P1: usar IP sin normalizacion o sin confianza en headers puede bloquear usuarios incorrectos o ser evadible.
- P1: memoria local no es confiable en serverless y daria falsa seguridad.
- P2: registrar email/IP raw puede aumentar superficie de datos sensibles; preferir hashes.
- P2: `POST /api/company-invitations/accept` usa token de alta entropia, pero igualmente conviene protegerlo por token/IP para evitar fuerza bruta y abuso de PBKDF2.

## Tareas sugeridas si se aprueba implementar

1. SQL DEV:
   - preparar migracion `AuthAttemptLimits` con indices y limpieza basica.
2. Backend/API:
   - implementar repository/helpers de limites;
   - integrar en login y accept;
   - agregar pruebas unitarias de ventanas, lockout, reset en exito y errores `429`.
3. Infra / Azure:
   - confirmar header de IP confiable en Function App publicada.
4. QA:
   - validar intentos fallidos, bloqueo temporal, exito despues de ventana, y que no se exponen email/token/password/cookies.

## Seguridad

- No se usaron passwords reales.
- No se usaron tokens reales de invitacion.
- No se imprimieron cookies, hashes de sesion ni secretos.
