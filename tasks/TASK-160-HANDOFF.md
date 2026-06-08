# TASK-160 - Handoff Backend API

## Resultado

Completado en codigo local Backend/API.

Se implemento auth propia MVP para empresas con password hash y sesiones server-side, siguiendo la decision de pausar Entra External ID para el piloto. La validacion real contra Azure SQL queda pendiente hasta que se aplique la migracion SQL preparada en `database/migrations/20260608_company_local_auth_sessions.sql`.

## Impacto identificado antes de tocar contratos/modelo/endpoints

Impacta directamente:

- `POST /api/company-invitations/accept`.
- `POST /api/company-auth/login`.
- `POST /api/company-auth/logout`.
- `GET /api/me`.
- Futuras rutas privadas que deben derivar `companyId` desde sesion server-side y no desde frontend.

No se modificaron endpoints internos protegidos por `INTERNAL_ADMIN_TOKEN`; siguen como mecanismo temporal separado para revision/aprobacion/reenvio.

## Cambios realizados

Archivos principales:

- `api/src/lib/companyAuth.js`
  - Hash de password con `crypto.pbkdf2Sync` + salt.
  - Verificacion con `crypto.timingSafeEqual`.
  - Generacion de token de sesion aleatorio.
  - Hash SHA-256 de token de sesion para persistencia.
  - Cookie `HttpOnly`, `SameSite=Lax`, `Secure` en prod.
  - Formateadores de respuesta sin hash, password, cookie ni token raw.
- `api/src/functions/companyAuth.js`
  - `POST /api/company-auth/login`.
  - `POST /api/company-auth/logout`.
  - `GET /api/me`.
- `api/src/functions/companyInvitations.js`
  - `POST /api/company-invitations/accept`.
- `api/src/lib/repository.js`
  - Aceptacion transaccional de invitacion con password.
  - Creacion de `CompanyUsers` con `auth_provider='local_password'`.
  - Marcado de invitacion como `accepted`.
  - Activacion de empresa cuando acepta owner.
  - Creacion, resolucion y revocacion de sesiones.
- `api/src/lib/validators.js`
  - `validateInvitationAcceptPayload` ahora acepta `password` y rechaza `companyId`, `email`, `externalSubject`.
  - `validateCompanyAuthLoginPayload`.
  - Validacion minima de password: 10 a 128 caracteres, letras y numeros.
- `api/src/lib/errors.js`
  - Mapea `UX_CompanyUsers_local_password_email` a `409 COMPANY_USER_ALREADY_EXISTS`.
- `api/src/lib/http.js`
  - Respuestas JSON con headers para `Set-Cookie`.
- `api/test/company-auth.test.js`, `api/test/validators.test.js`, `api/package.json`
  - Cobertura de hashing, cookies, tokens, formateadores y validadores.

## Endpoints implementados

### `POST /api/company-invitations/accept`

Payload:

```json
{
  "token": "raw-invite-token",
  "displayName": "Maria Soto",
  "password": "Password123"
}
```

Reglas implementadas:

- Hashea el token recibido y busca invitacion por `token_hash`.
- No acepta `companyId`, `email` ni `externalSubject` desde frontend.
- Crea usuario activo `local_password`.
- Guarda solo password hash + parametros de algoritmo.
- Marca invitacion como aceptada.
- Activa empresa si la invitacion owner pertenece a empresa `pending_activation`.
- Audita best-effort `company.invitation.accepted` y `company.user.created` sin secretos.

### `POST /api/company-auth/login`

Payload:

```json
{
  "email": "owner@cafecentral.test",
  "password": "Password123"
}
```

Reglas implementadas:

- Normaliza email server-side.
- Valida password contra hash.
- Requiere usuario `active` y empresa `active`.
- Crea sesion en `CompanySessions` guardando solo `token_hash`.
- Devuelve identidad y empresa autorizada.
- Setea cookie de sesion `HttpOnly`.

### `POST /api/company-auth/logout`

- Revoca la sesion activa si existe.
- Limpia cookie.

### `GET /api/me`

- Resuelve identidad por cookie de sesion.
- Busca `CompanySessions.token_hash`.
- Valida sesion `active`, no expirada, usuario `active` y empresa `active`.
- Devuelve usuario + empresa.

## Variables/configuracion requeridas

Sin secretos:

```text
COMPANY_SESSION_COOKIE_NAME=puntoclub_company_session
COMPANY_SESSION_TTL_HOURS=12
COMPANY_SESSION_COOKIE_SECURE=true
```

Notas:

- `COMPANY_SESSION_COOKIE_NAME` es opcional; default `puntoclub_company_session`.
- `COMPANY_SESSION_TTL_HOURS` es opcional; default 12 horas, maximo aceptado 14 dias.
- `COMPANY_SESSION_COOKIE_SECURE` puede omitirse en Azure porque se activa con `WEBSITE_SITE_NAME`; para local puede usarse `false`.

## Pruebas ejecutadas

Primero `npm test` fallo dentro del sandbox con `spawn EPERM`.

Reintento con permisos elevados:

```text
npm test
```

Resultado:

```text
79 tests passed
0 failed
```

## Riesgos o pendientes

- P1: la migracion SQL de TASK-159 no esta aplicada en Azure SQL. Estos endpoints fallaran en ambiente real hasta aplicar `database/migrations/20260608_company_local_auth_sessions.sql`.
- P1: frontend publicado y API publicada viven en dominios Azure distintos. La cookie cumple `SameSite=Lax`, pero Web Dev/QA deben validar envio de credenciales en navegador; si el navegador no envia cookie en `fetch` cross-site, se requerira proxy/API bajo mismo sitio o decision explicita de cookie strategy.
- P1/P2: no se implemento rate limiting ni lockout por intentos fallidos en esta tarea, aunque la migracion dejo columnas para intentos/bloqueo.
- P2: no existe limpieza automatica de sesiones expiradas; se hace validacion por expiracion al resolver sesion, pero falta job/limpieza oportunista futura.
- P2: `UX_CompanyUsers_local_password_email` hace el email unico global para auth local, segun tradeoff documentado por SQL DEV.
