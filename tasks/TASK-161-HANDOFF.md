# TASK-161 - Handoff Web Dev

## Resultado

Completado en codigo local Web.

Se conecto la experiencia Web para auth propia MVP con password y sesion server-side, siguiendo el contrato de TASK-160. No se usa Entra External ID, no se guarda password/token/cookie en storage y no se muestra el token de invitacion.

## Cambios realizados

Archivos modificados:

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-161-HANDOFF.md`

Detalle:

- Pantalla publica de invitacion:
  - El CTA `Crear acceso` ahora abre un formulario real.
  - Campos: nombre de contacto, password y confirmacion.
  - Validacion cliente: password 10 a 128 caracteres, con letras y numeros; confirmacion igual.
  - Envia `POST /api/company-invitations/accept` con `token`, `displayName` y `password`.
  - No envia `companyId`, `email` ni `externalSubject`.
  - No guarda token ni password en localStorage/sessionStorage.
- Login recurrente:
  - Nueva ruta/pantalla `/login`.
  - Formulario email/password.
  - Envia `POST /api/company-auth/login` con `credentials: "include"`.
  - Maneja login incorrecto, validaciones y rate limit.
- Sesion:
  - Agregado `GET /api/me` con `credentials: "include"` para resolver identidad por cookie HttpOnly.
  - Agregado `POST /api/company-auth/logout` con `credentials: "include"`.
  - Header muestra estado de sesion y acciones `Iniciar sesion` / `Cerrar sesion`.
  - El frontend no lee ni persiste cookie/token de sesion.
- Mock local:
  - Soporte mock para accept/login/logout/me.
  - Usuario mock recurrente: `owner@mock.test` / `Password123`.
  - Invitacion mock `mock-valid-token` permite crear acceso sin exponer token visible.

## Pantallas / rutas afectadas

- `/company-invitations/accept?token=...`
- `/login`
- Header global de la app
- `Operaciones`
- `Mi empresa`
- `Reportes`

## Estados cubiertos

- Invitacion valida.
- Invitacion invalida/expirada/aceptada/revocada desde validacion existente.
- Password invalido.
- Confirmacion de password distinta.
- Acceso creado.
- Usuario existente en aceptacion (`COMPANY_USER_ALREADY_EXISTS`).
- Login incorrecto.
- Sesion expirada/no autenticada (`UNAUTHORIZED` en `/api/me`).
- Logout.
- Error generico de accept/login.

## Pruebas locales ejecutadas

- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- Smoke local con Azure Static Web Apps CLI en `http://127.0.0.1:4282`, interceptando `app-config.js` para mock:
  - `/company-invitations/accept?token=mock-valid-token` carga invitacion.
  - Password debil muestra `Use 10 a 128 caracteres, con letras y numeros.`
  - Confirmacion distinta muestra `Los passwords no coinciden.`
  - Crear acceso muestra `Acceso creado. Ya puede iniciar sesion con el correo de la invitacion.`
  - El token `mock-valid-token` no aparece en texto visible.
  - `/login` muestra login.
  - Password incorrecto muestra `Correo o password incorrecto.`
  - Login correcto actualiza header a `Empresa Mock - owner@mock.test`.
  - Logout vuelve a `Sesion no iniciada`.
  - `/` mantiene `Operaciones` visible y navegacion a `Reportes`.
  - Sin overflow horizontal en desktop y mobile 390x844.

## Validacion publicada

No ejecutada en esta tarea.

Pendiente hasta que:

- Se aplique en Azure SQL la migracion `database/migrations/20260608_company_local_auth_sessions.sql`.
- Se despliegue Backend/API de TASK-160.
- Se confirme si la cookie HttpOnly `SameSite=Lax` funciona entre Static Web Apps y Azure Functions en dominios distintos.

## Riesgos / pendientes

- P1: TASK-160 advierte que los endpoints reales fallaran en Azure hasta aplicar la migracion SQL de sesiones/auth local.
- P1: Web publicada y API publicada estan en dominios distintos; si el navegador no envia/recibe cookie con `fetch credentials: include`, se necesitara proxy bajo mismo sitio o decision de cookie strategy.
- P1/P2: Backend aun no implementa rate limiting/lockout; Web solo muestra `RATE_LIMITED` si API lo devuelve.
- P2: Los endpoints operativos actuales siguen usando `companyId` de configuracion para el piloto. Esta tarea no migra Caja/Reportes/Mi empresa a endpoints privados derivados de sesion porque esos endpoints no existen todavia.
