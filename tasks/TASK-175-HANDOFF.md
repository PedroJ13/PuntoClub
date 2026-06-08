Equipo: QA

Tarea validada: TASK-175 - Revalidar auth propia despues de CORS/cookie/deploy

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 3

Resultado: bloqueado por falta de link fresco disponible para QA

Checks ejecutados:
- Lectura de `tasks/TASK-175-assignment.md`.
- Lectura de `tasks/TASK-172-HANDOFF.md`.
- Lectura de `tasks/TASK-173-HANDOFF.md`.
- Lectura de `tasks/TASK-174-HANDOFF.md`.
- Validacion publicada sin token real:
  - inspeccion precisa de `acceptCompanyInvitation` en `/src/customerApi.js`;
  - preflight CORS de `POST /api/company-auth/login`;
  - preflight CORS de `GET /api/me`;
  - preflight CORS de `POST /api/company-invitations/accept`;
  - `GET /api/me` sin sesion;
  - `POST /api/company-auth/login` con credenciales QA invalidas;
  - `POST /api/company-auth/logout` sin sesion;
  - `POST /api/company-invitations/accept` con token sintetico no real y password debil;
  - smoke HTTP de `/`, `/login` y `/company-invitations/accept`.

Hallazgos:
- El ajuste Web de TASK-170/TASK-174 esta publicado:
  - `acceptCompanyInvitation` ya no incluye `credentials: "include"`;
  - no envia `companyId`, `email` ni `externalSubject`;
  - login/logout/me mantienen `credentials: "include"`, como esperado para sesion.
- CORS credentials de TASK-173 esta publicado:
  - preflights de login, `/api/me` y accept devuelven `Access-Control-Allow-Credentials: true`;
  - `Access-Control-Allow-Origin` queda acotado al dominio Static Web Apps publicado.
- Login invalido vuelve a responder controlado `401 UNAUTHORIZED`, pero con latencia alta en esta corrida.
- `/api/me` sin sesion responde `401 UNAUTHORIZED`.
- Logout sin sesion responde `200` y envia cookie de limpieza.
- Accept con password debil y token sintetico responde `400 VALIDATION_ERROR`.
- No se pudo ejecutar E2E real de invitacion valida -> crear acceso -> login correcto -> `/api/me` -> logout, porque esta sesion QA no recibio el link fresco por canal seguro.

P0/P1:
- P1 operativo: E2E de auth propia permanece bloqueado hasta que QA reciba el link fresco/no comprometido por canal seguro.
- No se detectaron P0.

P2/P3:
- P2: login invalido respondio `401 UNAUTHORIZED`, pero tardo aproximadamente 42s; conviene monitorear latencia de auth/login publicado.
- P2 heredado: rate limiting/lockout no implementado segun TASK-160.
- P2 pendiente: cookie real `HttpOnly`/`SameSite=None; Secure` y `/api/me` con sesion no se pudieron validar sin login correcto.

Evidencia redaccionada:
- Bundle publicado:
  - `acceptCompanyInvitation`: presente.
  - `acceptCompanyInvitation` contiene `credentials: "include"`: `false`.
  - `acceptCompanyInvitation` contiene `companyId`: `false`.
  - `acceptCompanyInvitation` contiene `email`: `false`.
  - `acceptCompanyInvitation` contiene `externalSubject`: `false`.
  - `loginCompany`, `logoutCompany` y `getCurrentCompanyUser` mantienen `credentials: "include"`.
- CORS publicado:
  - `OPTIONS /api/company-auth/login`: `204`, `Access-Control-Allow-Credentials=true`.
  - `OPTIONS /api/me`: `204`, `Access-Control-Allow-Credentials=true`.
  - `OPTIONS /api/company-invitations/accept`: `204`, `Access-Control-Allow-Credentials=true`.
  - `Access-Control-Allow-Origin=https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales invalidas: `401 UNAUTHORIZED`, ~42s.
  - `POST /api/company-auth/logout` sin sesion: `200`, `Set-Cookie` presente.
  - `POST /api/company-invitations/accept` con token sintetico y password debil: `400 VALIDATION_ERROR`.
- Web publicada:
  - `/`: `200`, titulo `Punto Club`, sin 404.
  - `/login`: `200`, titulo `Punto Club`, sin 404.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin 404.
- No se pego token de invitacion completo, link completo, password temporal, cookie ni token de sesion.

Riesgos o pendientes:
- Entregar a QA el link fresco/no comprometido por canal seguro fuera del repo/handoff.
- Ejecutar E2E completo con password temporal controlado, sin documentarlo en claro:
  - invitacion valida;
  - crear password/acceso;
  - link aceptado no reutilizable;
  - login incorrecto controlado;
  - login correcto crea sesion;
  - `/api/me` deriva empresa desde cookie/sesion;
  - panel empresa carga empresa correcta;
  - logout limpia sesion;
  - cookie `HttpOnly`/`SameSite=None; Secure` funciona entre Web/API publicados.
- Investigar o monitorear latencia de login publicado si se repite.

Siguiente recomendado:
- Product Owner debe entregar el link fresco a QA por canal seguro, o ejecutar el flujo y compartir evidencia redaccionada sin barra de direccion/token/password/cookies.
- Reintentar TASK-175 cuando el link fresco este disponible.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion completo.
- No se pego link completo.
- No se pego password temporal.
- No se pego cookie ni token de sesion.
- No se capturo barra de direccion con token visible.
- No se modifico codigo ni Azure.
