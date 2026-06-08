Equipo: QA

Tarea validada: TASK-171 - Revalidar Crear acceso despues del diagnostico

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 3

Resultado: no aprobado

Checks ejecutados:
- Lectura de `tasks/TASK-171-assignment.md`.
- Lectura de `tasks/TASK-169-HANDOFF.md`.
- Lectura de `tasks/TASK-170-HANDOFF.md`.
- Lectura de `tasks/TASK-168-HANDOFF.md`.
- Validacion publicada sin token real:
  - inspeccion de `/src/customerApi.js`;
  - preflight CORS de `POST /api/company-invitations/accept` desde origen Static Web Apps;
  - `GET /api/me` sin sesion;
  - `POST /api/company-auth/login` con credenciales QA invalidas;
  - `POST /api/company-invitations/accept` con token sintetico no real y password debil.

Hallazgos:
- P1: El ajuste Web de TASK-170 no esta desplegado en Static Web Apps publicada.
  - El bundle publicado `/src/customerApi.js` todavia muestra `credentials: "include"` en `acceptCompanyInvitation`.
  - TASK-170 indica que el ajuste local quitaba `credentials: "include"` solo de accept, pero quedaba pendiente de commit/deploy.
- P1: El preflight CORS publicado de `POST /api/company-invitations/accept` sigue sin `Access-Control-Allow-Credentials`.
  - `OPTIONS /api/company-invitations/accept` responde `204`.
  - `Access-Control-Allow-Origin` corresponde al origen de Static Web Apps.
  - `Access-Control-Allow-Credentials` esta ausente.
  - Mientras Web publicada mande `credentials: "include"` en accept, el navegador seguira bloqueando `Crear acceso`.
- P1: Login incorrecto publicado no fue consistentemente controlado.
  - Primer intento de login invalido aborto por timeout a los 25s.
  - Reintento respondio `500 INTERNAL_ERROR`.
  - Esto no cumple el comportamiento esperado de error controlado para credenciales invalidas.
- No se ejecuto crear acceso con invitacion real ni password temporal porque el bloqueo CORS sigue vigente en publicado y no se debe exponer token/password.
- No se pidio ni uso `INTERNAL_ADMIN_TOKEN`.

P0/P1:
- P1 abierto: `Crear acceso` sigue bloqueado en navegador publicado porque el bundle aun envia credentials y el preflight no permite credentials.
- P1 abierto: login invalido publicado respondio timeout/`500 INTERNAL_ERROR` en esta corrida, no error controlado.
- No se detectaron P0.

P2/P3:
- P2 heredado: cookie `HttpOnly`/`SameSite=Lax` entre Web/API sigue pendiente de validacion real con login correcto.
- P2 heredado: rate limiting/lockout no implementado segun TASK-160.

Evidencia redaccionada:
- Bundle publicado:
  - `/src/customerApi.js`: contiene `acceptCompanyInvitation`.
  - Slice de `acceptCompanyInvitation` aun contiene `credentials: "include"`.
  - Login/logout/me mantienen `credentials: "include"`, como esperado para sesion.
- Preflight CORS publicado:
  - Metodo: `OPTIONS /api/company-invitations/accept`.
  - Origen: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
  - Status: `204`.
  - `Access-Control-Allow-Origin = https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
  - `Access-Control-Allow-Methods = POST`.
  - `Access-Control-Allow-Headers = content-type`.
  - `Access-Control-Allow-Credentials = <ausente>`.
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales invalidas:
    - intento 1: timeout 25s;
    - intento 2: `500 INTERNAL_ERROR`.
  - `POST /api/company-invitations/accept` con token sintetico y password debil: `400 VALIDATION_ERROR`.
- No se pego token de invitacion completo, link completo, password temporal, cookie ni token de sesion.

Riesgos o pendientes:
- Desplegar el ajuste de TASK-170 o habilitar `Access-Control-Allow-Credentials: true` en CORS de Function App con origen acotado, segun la estrategia elegida.
- Revalidar que `acceptCompanyInvitation` publicado ya no use `credentials: "include"` si se mantiene la alternativa Web.
- Investigar el `500 INTERNAL_ERROR` de login invalido antes de aprobar el flujo de auth.
- Luego reintentar con invitacion fresca no comprometida:
  - invitacion valida;
  - crear password/acceso;
  - login correcto;
  - `/api/me` con sesion;
  - panel empresa correcto;
  - logout.

Siguiente recomendado:
- Web Dev / Release debe desplegar TASK-170 y confirmar hash/asset publicado.
- Backend/API debe revisar App Insights para el `500` en `POST /api/company-auth/login` con credenciales invalidas, sin exponer payloads.
- QA debe reintentar TASK-171 despues del deploy/fix.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion completo.
- No se pego link completo.
- No se pego password temporal.
- No se pego cookie ni token de sesion.
- No se capturo barra de direccion con token visible.
- No se modifico codigo ni Azure.
