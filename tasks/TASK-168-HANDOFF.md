Equipo: QA

Tarea validada: TASK-168 - Reintentar QA E2E auth propia con invitacion fresca

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 2

Resultado: bloqueado

Checks ejecutados:
- Lectura de `tasks/TASK-168-assignment.md`.
- Lectura de `tasks/TASK-167-HANDOFF.md`.
- Lectura de `tasks/TASK-166-HANDOFF.md`.
- Validacion segura publicada sin token real:
  - `GET /api/me` sin sesion.
  - `POST /api/company-auth/login` con credenciales QA invalidas.
  - `POST /api/company-auth/logout` sin sesion.
  - `POST /api/company-invitations/accept` con token sintetico no real y password debil.
  - `POST /api/company-invitations/accept` con token sintetico no real y `companyId` prohibido.
  - Smoke HTTP de `/`, `/login` y `/company-invitations/accept`.

Hallazgos:
- TASK-167 completo la reemision de la invitacion fresca y roto el token anterior expuesto.
- TASK-167 no incluye link completo ni token, correctamente por seguridad.
- En esta sesion QA no se recibio el link fresco posterior a `2026-06-08T22:13:46.829Z` por canal seguro.
- No se reutilizo ningun token expuesto en capturas previas.
- Sin el link fresco no se puede ejecutar el E2E real:
  - invitacion valida;
  - crear password/acceso;
  - confirmar link aceptado no reutilizable;
  - login correcto;
  - `/api/me` con cookie/sesion;
  - panel empresa con empresa correcta;
  - logout;
  - validacion real de cookie `HttpOnly`/`SameSite=Lax` entre Web/API.
- Los checks negativos/controlados publicados siguen funcionando.

P0/P1:
- P1 operativo: E2E de auth propia permanece bloqueado hasta que QA reciba el link fresco por canal seguro.
- No se detectaron P0.

P2/P3:
- P2: cookie cross-site `HttpOnly`/`SameSite=Lax` sigue pendiente de validacion real con login correcto.
- P2 heredado: rate limiting/lockout no implementado segun TASK-160.

Evidencia redaccionada:
- TASK-167:
  - `invitationId = 1`.
  - `invitationStatus = pending`.
  - `email = pj13eros_business+task146-20260608092947@outlook.com`.
  - `expiresAt = 2026-06-15T15:30:01Z`.
  - `resentAt = 2026-06-08T22:13:46.829Z`.
  - `responseContainsTokenOrLink = false`.
  - ACS `DeliveryStatusUpdate Result=Success`.
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales invalidas: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/logout` sin sesion: `200`, `Set-Cookie` presente.
  - `POST /api/company-invitations/accept` con token sintetico y password debil: `400 VALIDATION_ERROR`.
  - `POST /api/company-invitations/accept` enviando `companyId`: `400 VALIDATION_ERROR`.
- Web publicada:
  - `/`: `200`, titulo `Punto Club`, sin 404.
  - `/login`: `200`, titulo `Punto Club`, sin 404.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin 404.
- No se pego token de invitacion completo, link completo, password temporal, cookie ni token de sesion.

Riesgos o pendientes:
- QA/Product Owner debe usar solo el ultimo correo recibido posterior a `2026-06-08T22:13:46.829Z`.
- Entregar el link fresco a QA por canal seguro fuera del repo/handoff, o ejecutar el E2E con PO compartiendo evidencia redaccionada sin barra de direccion.
- Si el nuevo link se expone en captura/chat/handoff, debe rotarse nuevamente.
- Reintentar TASK-168 cuando el link fresco este disponible.

Siguiente recomendado:
- Product Owner debe abrir el ultimo correo de invitacion y pasar el link a QA por canal seguro, sin mostrar barra de direccion ni token.
- Reejecutar TASK-168 para cerrar el E2E con password temporal controlado y sin documentar secretos.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion completo.
- No se pego link completo.
- No se pego password temporal.
- No se pego cookie ni token de sesion.
- No se capturo barra de direccion con token visible.
- No se modifico codigo ni Azure.
