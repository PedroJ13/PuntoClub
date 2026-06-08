Equipo: QA

Tarea validada: TASK-162 - Validar auth propia publicada de empresa

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 4

Resultado: no aprobado / bloqueado por deploy y migracion pendiente

Checks ejecutados:
- Lectura de `tasks/TASK-162-assignment.md`.
- Lectura de `tasks/TASK-159-HANDOFF.md`.
- Lectura de `tasks/TASK-160-HANDOFF.md`.
- Lectura de `tasks/TASK-161-HANDOFF.md`.
- Validacion HTTP publicada sin secretos:
  - `GET /api/me`.
  - `POST /api/company-auth/login` con credenciales QA invalidas.
  - `POST /api/company-invitations/accept` con token sintetico no real y password fuerte.
  - `GET /src/customerApi.js`.
  - `GET /src/app.js`.
  - `GET /login`.
- Regresion operativa publicada:
  - crear cliente;
  - registrar compra;
  - consultar saldo.

Hallazgos:
- P1: Los endpoints publicados de auth propia no estan disponibles.
  - `GET /api/me` responde `404`.
  - `POST /api/company-auth/login` responde `404`.
  - `POST /api/company-invitations/accept` responde `404`.
- P1: La migracion SQL requerida por TASK-159 no fue aplicada en Azure SQL. TASK-159 lo declara explicitamente y TASK-160 advierte que los endpoints reales fallaran hasta aplicar `database/migrations/20260608_company_local_auth_sessions.sql`.
- P1: El frontend publicado no parece contener la integracion de auth propia de TASK-161.
  - `/src/customerApi.js` publicado no contiene referencias a `company-auth/login` ni `/api/me`.
  - `/src/app.js` publicado no contiene referencias a `/api/me`.
  - `/login` responde `200` por fallback, pero no hay evidencia de pantalla de login publicada funcional.
- No fue posible validar invitacion valida, crear password/acceso, login recurrente, sesion activa, `/api/me`, logout, reutilizacion de link aceptado ni derivacion de empresa desde sesion.
- No se pidio ni uso `INTERNAL_ADMIN_TOKEN`.

P0/P1:
- P1 abierto: auth propia MVP no esta disponible en API publicada.
- P1 abierto: migracion SQL de auth/sesiones no aplicada en Azure SQL.
- P1 abierto: frontend publicado no refleja todavia la integracion de auth propia.
- No se detectaron P0.

P2/P3:
- P2 heredado de TASK-160/TASK-161: aun pendiente validar estrategia de cookie `HttpOnly`/`SameSite=Lax` entre Static Web Apps y Azure Functions cuando el deploy exista.
- P2 heredado: no hay rate limiting/lockout backend efectivo para login segun TASK-160.

Evidencia redaccionada:
- Dependencias:
  - `TASK-159-HANDOFF.md`: migracion preparada, no aplicada en Azure SQL.
  - `TASK-160-HANDOFF.md`: endpoints implementados en codigo local Backend/API, validacion real pendiente hasta aplicar migracion.
  - `TASK-161-HANDOFF.md`: Web implementado localmente, validacion publicada pendiente.
- API publicada:
  - `GET /api/me`: `404`.
  - `POST /api/company-auth/login`: `404`.
  - `POST /api/company-invitations/accept`: `404`.
- Web publicada:
  - `/src/customerApi.js`: `200`, sin referencias publicadas a `company-auth/login` ni `/api/me`.
  - `/src/app.js`: `200`, sin referencia publicada a `/api/me`.
  - `/login`: `200` por fallback `Punto Club`, sin evidencia de login funcional publicado.
- Regresion operativa:
  - Cliente QA creado: id `95`, `201`.
  - Compra QA: `201`, `pointsEarned = 500`.
  - Saldo: `200`, `pointsEarned = 500`, `pointsRedeemed = 0`, `pointsBalance = 500`.
- No se pego password real, password hash, cookie, token de sesion, token de invitacion ni link completo.

Riesgos o pendientes:
- Aplicar en Azure SQL `database/migrations/20260608_company_local_auth_sessions.sql` con prevalidaciones.
- Desplegar Backend/API de TASK-160.
- Desplegar Web de TASK-161.
- Revalidar flujo completo despues del deploy:
  - invitacion valida;
  - password debil rechazado;
  - crear acceso con password fuerte;
  - link aceptado no reutilizable;
  - login incorrecto controlado;
  - login correcto y sesion activa;
  - `/api/me` deriva empresa desde cookie/sesion;
  - panel empresa carga empresa correcta;
  - logout;
  - sesion expirada/invalida controlada;
  - frontend no envia `companyId` como autoridad en endpoints privados nuevos.
- Validar especialmente si la cookie server-side funciona entre el dominio de Static Web Apps y el dominio de Azure Functions.

Siguiente recomendado:
- Infra/SQL debe aplicar migracion Azure SQL.
- Backend/API y Web deben confirmar deploy publicado de TASK-160/TASK-161.
- Reintentar TASK-162 solo cuando los endpoints de auth dejen de responder `404` en publicado.

Confirmacion de seguridad:
- No se usaron secretos.
- No se reprodujo token de invitacion.
- No se reprodujo token de sesion, cookie, password ni hash.
- No se modifico codigo ni Azure.
