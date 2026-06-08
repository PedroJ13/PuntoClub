Equipo: QA

Tarea validada: TASK-177 - Reintentar E2E auth propia final

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 2

Resultado: bloqueado por falta de link fresco/evidencia E2E final

Checks ejecutados:
- Lectura de `tasks/TASK-177-assignment.md`.
- Lectura de `tasks/TASK-173-HANDOFF.md`.
- Lectura de `tasks/TASK-174-HANDOFF.md`.
- Lectura de `tasks/TASK-176-HANDOFF.md`.
- Lectura de `tasks/TASK-175-HANDOFF.md`.
- Validacion publicada sin token real:
  - `GET /api/me` sin sesion.
  - `POST /api/company-auth/login` con credenciales QA invalidas.
  - `POST /api/company-auth/logout` sin sesion.
  - `POST /api/company-invitations/accept` con token sintetico no real y password debil.
  - Preflights CORS de login, `/api/me` y logout desde origen SWA publicado.

Hallazgos:
- Las dependencias tecnicas principales estan completadas:
  - TASK-173: CORS credentials habilitado con origen acotado.
  - TASK-174: Web publicado con `acceptCompanyInvitation` sin `credentials: "include"`.
  - TASK-176: API publicada con fix de login resiliente y cookie productiva `SameSite=None; Secure`.
- Checks seguros publicados pasan:
  - `/api/me` sin sesion responde `401 UNAUTHORIZED`.
  - Login invalido responde `401 UNAUTHORIZED` rapido en esta corrida.
  - Logout sin sesion responde `200` y devuelve cookie de limpieza con flags esperados.
  - Accept con password debil responde `400 VALIDATION_ERROR`.
  - Preflights CORS devuelven `Access-Control-Allow-Credentials: true` y origen acotado.
- No se recibio link fresco/no comprometido ni evidencia redaccionada final del Product Owner para completar E2E.
- Sin link fresco/evidencia final no se puede aprobar:
  - invitacion valida;
  - crear acceso con password temporal;
  - link aceptado no reutilizable;
  - login correcto;
  - `/api/me` con sesion;
  - panel empresa correcto;
  - logout real desde sesion;
  - cookie de sesion real en navegador publicado.

P0/P1:
- P1 operativo: E2E auth propia final permanece bloqueado hasta recibir link fresco/no comprometido o evidencia redaccionada completa del PO.
- No se detectaron P0.

P2/P3:
- P2 heredado: rate limiting/lockout no implementado segun TASK-160.

Evidencia redaccionada:
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales invalidas: `401 UNAUTHORIZED`, ~684ms.
  - `POST /api/company-auth/logout` sin sesion: `200`.
  - Cookie de limpieza presente, redaccionada, con flags:
    - `HttpOnly = true`;
    - `SameSite=None = true`;
    - `Secure = true`;
    - `Expires=Thu, 01 Jan 1970 = true`.
  - `POST /api/company-invitations/accept` con token sintetico y password debil: `400 VALIDATION_ERROR`.
- CORS publicado:
  - `OPTIONS /api/company-auth/login`: `204`, `Access-Control-Allow-Credentials=true`, origen SWA publicado.
  - `OPTIONS /api/me`: `204`, `Access-Control-Allow-Credentials=true`, origen SWA publicado.
  - `OPTIONS /api/company-auth/logout`: `204`, `Access-Control-Allow-Credentials=true`, origen SWA publicado.
- TASK-174 confirma:
  - `acceptCompanyInvitation` publicado no envia `credentials: "include"`.
  - login/logout/me mantienen `credentials: "include"`.
- No se pego token de invitacion completo, link completo, password temporal, cookie ni token de sesion.

Riesgos o pendientes:
- Product Owner/QA debe usar un link fresco/no comprometido y no capturar barra de direccion.
- Ejecutar o aportar evidencia redaccionada del flujo completo:
  - invitacion valida;
  - crear acceso;
  - link aceptado no reutilizable;
  - login invalido controlado;
  - login correcto;
  - `/api/me` devuelve empresa desde cookie/sesion;
  - panel empresa correcto;
  - logout limpia sesion.
- Si el link fresco se expone nuevamente, rotarlo antes de usarlo.

Siguiente recomendado:
- Entregar el link fresco por canal seguro fuera del repo/handoff, o que Product Owner ejecute el E2E y comparta evidencia redaccionada sin token/password/cookie/barra de direccion.
- Reintentar TASK-177 cuando el insumo este disponible.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion completo.
- No se pego link completo.
- No se pego password temporal.
- No se pego cookie ni token de sesion.
- No se capturo barra de direccion con token visible.
- No se modifico codigo ni Azure.
