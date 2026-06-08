Equipo: QA

Tarea validada: TASK-166 - Revalidar auth propia publicada end-to-end

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08
- Round: 3

Resultado: no aprobado / bloqueado para E2E por falta de invitacion fresca segura

Checks ejecutados:
- Lectura de `tasks/TASK-166-assignment.md`.
- Lectura de `tasks/TASK-163-HANDOFF.md`.
- Lectura de `tasks/TASK-164-HANDOFF.md`.
- Lectura de `tasks/TASK-165-HANDOFF.md`.
- Validacion API publicada sin secretos:
  - `GET /api/me` sin sesion.
  - `POST /api/company-auth/login` con credenciales QA invalidas.
  - `POST /api/company-auth/logout` sin sesion.
  - `POST /api/company-invitations/accept` con token sintetico no real y password debil.
  - `POST /api/company-invitations/accept` con token sintetico no real y password fuerte.
  - `POST /api/company-invitations/accept` con `companyId` prohibido.
- Validacion de bundles publicados:
  - endpoints de auth presentes;
  - `credentials: "include"` presente;
  - payload de accept no incluye `companyId`, `email` ni `externalSubject`.
- Smoke visual publicado con navegador headless:
  - `/login`;
  - login incorrecto;
  - `/company-invitations/accept?token=[fake-redacted]`;
  - `/`.
- Revision de evidencia visual compartida por Product Owner con invitacion real abierta.

Hallazgos:
- Backend/API publicado ya contiene auth propia: los endpoints dejaron de responder `404`.
- SQL de auth/sesiones ya esta aplicado segun TASK-163.
- Web publicada ya contiene integracion de auth propia segun bundles y smoke visual.
- Caminos negativos/controlados pasan:
  - `/api/me` sin sesion responde `401 UNAUTHORIZED`.
  - login con credenciales invalidas responde `401 UNAUTHORIZED`.
  - logout sin sesion responde `200` y envia `Set-Cookie` de limpieza.
  - accept con password debil responde `400 VALIDATION_ERROR` y detalle de politica minima.
  - accept con token sintetico fuerte/no existente responde `404 INVITATION_NOT_FOUND`.
  - accept con `companyId` prohibido responde `400 VALIDATION_ERROR`.
- La UI `/login` publicada renderiza pantalla de acceso y muestra estado `Sesion no iniciada`.
- Login incorrecto desde UI muestra error controlado.
- La ruta de invitacion con token sintetico no real muestra estado controlado `Invitacion no disponible` y no muestra el token en texto visible.
- Navegacion normal `/` mantiene `Operaciones`, `Mi empresa` y `Reportes` visibles.
- No se pudo ejecutar el E2E real de invitacion valida -> crear password -> login correcto -> `/api/me` -> logout, porque no hay una invitacion fresca segura disponible para QA.
- Evidencia nueva de Product Owner confirma que una invitacion real publicada llega a estado `Invitacion valida` y muestra formulario real de `Crear acceso`.
- La captura nueva vuelve a exponer token real en barra de direccion. Se trata como secreto comprometido y no se reproduce en este handoff.
- No se ejecuto el E2E real de crear password -> login correcto -> `/api/me` -> logout desde QA; queda pendiente. No se debe reutilizar el token expuesto para nuevas pruebas sin rotarlo/reemitirlo.

P0/P1:
- P1 abierto: E2E real de auth propia no queda aprobado hasta validar crear acceso, login correcto, `/api/me`, panel empresa y logout con una invitacion/token no comprometido.
- No se detectaron P0.

P2/P3:
- P2: la estrategia de cookie `HttpOnly`/`SameSite=Lax` entre Static Web Apps y Azure Functions sigue sin poder validarse hasta completar login correcto con sesion real.
- P2: login incorrecto en UI muestra un mensaje generico (`No se pudo iniciar sesion. Intente de nuevo.`), aunque API responde `401 UNAUTHORIZED` controlado.
- P2 heredado: rate limiting/lockout backend no implementado segun TASK-160.

Evidencia redaccionada:
- Dependencias:
  - TASK-163: migracion SQL aplicada y validada en Azure SQL real.
  - TASK-164: API publicada con endpoints de auth propia y sin `404`.
  - TASK-165: Web publicada con integracion de auth propia.
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales invalidas: `401 UNAUTHORIZED`.
  - `POST /api/company-auth/logout` sin sesion: `200`, `Set-Cookie` presente.
  - `POST /api/company-invitations/accept` con token sintetico y password debil: `400 VALIDATION_ERROR`, campo `password`.
  - `POST /api/company-invitations/accept` con token sintetico y password fuerte: `404 INVITATION_NOT_FOUND`.
  - `POST /api/company-invitations/accept` enviando `companyId`: `400 VALIDATION_ERROR`, campo `companyId`.
- Bundles publicados:
  - `/src/customerApi.js` contiene `/api/company-auth/login`.
  - `/src/customerApi.js` contiene `/api/company-auth/logout`.
  - `/src/customerApi.js` contiene `/api/me`.
  - `/src/customerApi.js` contiene `/api/company-invitations/accept`.
  - `/src/customerApi.js` contiene `credentials: "include"` para llamadas de sesion.
  - Slice de accept no contiene `companyId`, `email` ni `externalSubject`.
  - `/src/app.js` contiene formularios/handlers de login y crear acceso.
- UI publicada:
  - `/login`: titulo `Punto Club`, pantalla `ACCESO DE EMPRESA`, formulario `Iniciar sesion`.
  - Login incorrecto: error controlado visible.
  - `/company-invitations/accept?token=[fake-redacted]`: `INVITACION DE EMPRESA`, `Invitacion no disponible`, token no visible en texto.
  - `/`: `Operaciones`, `Mi empresa` y `Reportes` visibles.
- Evidencia visual de Product Owner con invitacion real:
  - Ruta profunda redaccionada: `/company-invitations/accept?token=[redacted]`.
  - Web publicada carga `Punto Club`, no 404.
  - Estado final: `Invitacion valida`.
  - Empresa visible: `QA Task 146 20260608092947`.
  - Correo visible: `pj13eros_business+task146-20260608092947@outlook.com`.
  - Rol visible: `Owner`.
  - Vencimiento visible: `15/06/2026, 09:30 a. m.`.
  - Formulario visible: `Nombre de contacto`, `Password`, `Confirmar password`.
  - Politica visible: `Use 10 a 128 caracteres, con letras y numeros.`
  - CTA visible: `Crear acceso`.
  - La captura expone token en barra de direccion; el token no se reproduce aqui.
- No se reprodujo token real, password real, cookie, token de sesion ni link completo.

Riesgos o pendientes:
- Generar o reenviar una invitacion nueva/fresca porque el token real fue expuesto en captura.
- Entregar link real por canal seguro fuera del repo/handoff.
- Ejecutar E2E completo con password temporal controlado y no documentarlo en claro:
  - invitacion valida; *(cubierto por evidencia visual, pero repetir con token no comprometido si se crea acceso)*;
  - crear password/acceso;
  - link aceptado no reutilizable;
  - login incorrecto controlado;
  - login correcto crea sesion;
  - `/api/me` deriva empresa desde cookie/sesion;
  - panel empresa carga empresa correcta;
  - logout limpia sesion;
  - sesion expirada/invalida controlada;
  - cookie `HttpOnly`/`SameSite=Lax` funciona entre Web/API publicados.

Siguiente recomendado:
- Infra/Product debe rotar o reemitir invitacion segura y entregar el link a QA por canal seguro.
- Reintentar TASK-166 con invitacion fresca para cerrar el flujo end-to-end.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion completo.
- No se pego password real ni temporal.
- No se pego cookie ni token de sesion.
- No se capturo barra de direccion con token visible.
- No se modifico codigo ni Azure.
