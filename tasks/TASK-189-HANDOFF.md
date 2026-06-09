# TASK-189 - Handoff Backend API

## Resultado

Completado en codigo local.

Se implemento rate limiting/lockout minimo para auth propia usando la tabla persistente `dbo.AuthAttemptLimits` preparada y aplicada por SQL DEV en TASK-187.

El limite por IP queda diferido/deshabilitado por decision de Infra/Azure en TASK-188: la arquitectura actual no garantiza una IP cliente confiable para bloqueo fuerte.

## Reglas implementadas

Politica comun:

- Ventana: `15` minutos.
- Maximo de fallos por ventana: `5`.
- Al alcanzar el umbral, el sujeto queda bloqueado por `15` minutos.
- Mientras esta bloqueado, la API responde:

```json
{
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many attempts. Please try again later."
  }
}
```

Status:

- `429`.

### Login

Endpoint:

- `POST /api/company-auth/login`

Scope persistente:

- `company_login_email`

Subject:

- SHA-256 del email normalizado.
- No se guarda email raw en `AuthAttemptLimits`.

Flujo:

1. Valida payload y normaliza email.
2. Hashea email normalizado.
3. Consulta bloqueo vigente.
4. Si esta bloqueado, responde `429 TOO_MANY_ATTEMPTS`.
5. Si credenciales/estado no son validos, registra fallo y mantiene respuesta generica `401 UNAUTHORIZED`.
6. Si login es exitoso, crea sesion y limpia fallos para ese email.

No se revela si el email existe.

### Aceptar invitacion / Crear acceso

Endpoint:

- `POST /api/company-invitations/accept`

Scope persistente:

- `company_invitation_token`

Subject:

- Hash SHA-256 del token de invitacion, usando el mismo `hashInvitationToken()`.
- No se guarda token raw ni password.

Flujo:

1. Lee JSON.
2. Valida formato del token.
3. Hashea token.
4. Consulta bloqueo vigente.
5. Si esta bloqueado, responde `429 TOO_MANY_ATTEMPTS`.
6. Valida payload completo, incluido password.
7. Si el payload/token/invitacion falla de forma controlada, registra fallo del token.
8. Si accept es exitoso, crea usuario/acceso y limpia fallos del token.

## Limite por IP

Estado: diferido/deshabilitado.

Motivo:

- TASK-188 concluyo que `x-forwarded-for` no debe usarse como fuente autoritativa mientras la Function App acepte trafico publico directo y no haya Front Door/Application Gateway/Private Endpoint obligado.

Implementacion actual:

- `getClientIp()` retorna `null`.
- No se evalua ni persiste `company_login_ip`.
- No se evalua ni persiste `company_invitation_ip`.

Los scopes SQL por IP quedan disponibles para una fase futura si Infra cambia la arquitectura y confirma proxy confiable.

## Archivos modificados

- `api/src/lib/authRateLimit.js`
  - Nueva libreria de politica, hashing de sujeto, error `429`, helper de bloqueo y `getClientIp()` deshabilitado.
- `api/src/lib/repository.js`
  - Nuevos helpers persistentes:
    - `getAuthAttemptLimit()`
    - `recordAuthAttemptFailure()`
    - `clearAuthAttemptLimit()`
  - `recordAuthAttemptFailure()` usa transaccion y `UPDLOCK, HOLDLOCK` para evitar condiciones de carrera por `(scope, subject_hash)`.
- `api/src/functions/companyAuth.js`
  - Integra rate limiting por email en login.
- `api/src/functions/companyInvitations.js`
  - Integra rate limiting por token en accept.
- `api/test/auth-rate-limit.test.js`
  - Nueva cobertura de reglas.
- `api/package.json`
  - Incluye `test/auth-rate-limit.test.js` en `npm test`.
- `docs/API_CONTRACTS.md`
  - Actualiza contrato de error `429` a `TOO_MANY_ATTEMPTS`.

No se cambio schema SQL en esta tarea.

## Pruebas ejecutadas

- `npm test` desde `api/`.

Resultado:

- Primer intento en sandbox fallo con `spawn EPERM`, antes de ejecutar pruebas.
- Reejecucion elevada paso correctamente.
- `91` tests ejecutados.
- `91` pass.
- `0` fail.

Cobertura nueva:

- El subject se hashea a SHA-256 y no queda como raw.
- La ventana incrementa fallos y bloquea al umbral.
- La ventana expirada reinicia conteo.
- Un sujeto bloqueado devuelve `429 TOO_MANY_ATTEMPTS`.
- El reset en exito delega limpieza persistente por hash.
- `getClientIp()` queda deshabilitado hasta proxy confiable.

## Riesgos o pendientes

- Pendiente deploy API para validar publicado.
- QA / TASK-190 debe validar:
  - login invalido repetido hasta `429`;
  - bloqueo por email sin revelar existencia de cuenta;
  - limpieza/reset despues de login exitoso en un caso controlado;
  - accept con token/control de intentos sin exponer token/password.
- Si Infra implementa Front Door/Application Gateway y bloquea acceso directo a Function App, Backend/API puede habilitar limite por IP en una tarea futura.
- `AuthAttemptLimits` no tiene limpieza automatica; por ahora se actualiza/borra oportunistamente en fallo/exito. Limpieza programada puede ser tarea futura si la tabla crece.

## Seguridad

- No se guardan emails raw, IPs raw, tokens raw, passwords, cookies ni connection strings en `AuthAttemptLimits`.
- No se imprimieron secretos.
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se uso password real ni token real de invitacion.
