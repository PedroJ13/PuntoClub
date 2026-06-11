# TASK-208 - Handoff QA

Equipo: QA

Tarea validada: TASK-208 - Revalidar panel interno de empresas publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-09

## Resultado

Aprobado con pendiente diferido.

QA valida que el panel interno de empresas esta publicado, que los endpoints internos estan protegidos sin token o con token sintetico invalido, y que la Web publicada contiene el panel sin persistir el token en `localStorage`/`sessionStorage`.

El flujo positivo con token interno real queda diferido por decision Product Owner, segun TASK-208 y release status. No se bloquea esta tarea por esa ausencia.

## Checks ejecutados

### Dependencias revisadas

- `tasks/TASK-205-HANDOFF.md`:
  - API publicada contiene `GET /api/company-registration-requests`.
  - Endpoint de listado protegido con `403` sin token/token sintetico.

- `tasks/TASK-206-HANDOFF.md`:
  - Web publicada contiene `Admin empresas`.
  - Token admin se envia como header `x-puntoclub-admin-token`.
  - No usa `localStorage` ni `sessionStorage`.

- `tasks/TASK-207-HANDOFF.md`:
  - No existe handoff local.
  - TASK-207 queda diferida por decision Product Owner segun assignment/release.

### API interna sin token o con token sintetico invalido

#### Listado interno

Endpoint:

```text
GET /api/company-registration-requests?status=pending&limit=25
```

Resultados:

- Sin token: `403 FORBIDDEN`.
- Token sintetico invalido: `403 FORBIDDEN`.

Resultado QA: aprobado.

#### Aprobar solicitud

Endpoint:

```text
POST /api/company-registration-requests/1/approve
```

Resultados:

- Sin token: `403 FORBIDDEN`.
- Token sintetico invalido: `403 FORBIDDEN`.

Resultado QA: aprobado.

#### Rechazar solicitud

Endpoint:

```text
POST /api/company-registration-requests/1/reject
```

Resultados:

- Sin token: `403 FORBIDDEN`.
- Token sintetico invalido: `403 FORBIDDEN`.

Resultado QA: aprobado.

#### Reenviar invitacion

Endpoint:

```text
POST /api/company-invitations/1/resend
```

Resultados:

- Sin token: `403 FORBIDDEN`.
- Token sintetico invalido: `403 FORBIDDEN`.

Resultado QA: aprobado.

### Web publicada

Se revisaron recursos publicados:

- `/`
- `/src/app.js`
- `/src/customerApi.js`

Resultado:

- HTML publicado contiene `Admin empresas`.
- HTML publicado contiene `Acceso interno temporal`.
- HTML publicado contiene input de token interno.
- Bundle publicado contiene funciones de administracion:
  - `listCompanyRegistrationRequests`;
  - `approveCompanyRegistrationRequest`;
  - `rejectCompanyRegistrationRequest`;
  - `resendCompanyInvitation`.
- Bundle publicado contiene `x-puntoclub-admin-token`.
- Bundle publicado contiene helper de headers admin.
- Bundle publicado no contiene `localStorage`.
- Bundle publicado no contiene `sessionStorage`.
- Bundle publicado no contiene `invitationLink`.
- Bundle publicado no contiene `invitationUrl`.
- Bundle publicado no contiene `token_hash`.
- Bundle publicado no contiene textos `raw token` / `token raw`.
- En la rebanada inspeccionada del helper admin no se observo envio por query string (`searchParams`, `adminToken=`, `token=`).

Resultado QA: aprobado.

### Regresion basica segura

- Solicitud publica de empresa con payload invalido:
  - `POST /api/company-registration-requests`
  - Observado: `400 VALIDATION_ERROR`.
  - Resultado: aprobado como check negativo seguro.

- Invitacion/crear acceso con token sintetico no real:
  - `GET /api/company-invitations/validate?token=<synthetic-redacted>`
  - Observado: `200` con `valid=false`, `reason=invalid`.
  - Resultado: aprobado.

- Login/me sin sesion:
  - `GET /api/me`
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Operacion autenticada protegida:
  - Endpoint operativo con cookie sintetica invalida.
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `Mi empresa` / logo protegido:
  - `GET /api/my-company/logo` sin sesion.
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## No ejecutado

No se ejecuto flujo positivo con token interno real porque esta tarea indica no usarlo salvo entrega expresa por canal seguro.

Queda diferido:

- Listar solicitudes con token real.
- Aprobar solicitud de prueba.
- Rechazar solicitud de prueba o validar estado si no hay solicitud disponible.
- Reenviar invitacion pendiente si aplica.

## Hallazgos

No se encontraron hallazgos P0/P1 para el alcance de TASK-208.

## P0/P1

Ninguno abierto.

## P2/P3

- P2 diferido: prueba positiva completa con token interno real queda pendiente para una validacion posterior con canal seguro y sin registrar el valor del token.

## Evidencia redaccionada

- `GET /api/company-registration-requests?status=pending&limit=25`:
  - sin token: `403 FORBIDDEN`;
  - token sintetico invalido: `403 FORBIDDEN`.

- `POST /api/company-registration-requests/1/approve`:
  - sin token: `403 FORBIDDEN`;
  - token sintetico invalido: `403 FORBIDDEN`.

- `POST /api/company-registration-requests/1/reject`:
  - sin token: `403 FORBIDDEN`;
  - token sintetico invalido: `403 FORBIDDEN`.

- `POST /api/company-invitations/1/resend`:
  - sin token: `403 FORBIDDEN`;
  - token sintetico invalido: `403 FORBIDDEN`.

- Web publicada:
  - contiene `Admin empresas`;
  - contiene `Acceso interno temporal`;
  - contiene funciones admin;
  - contiene `x-puntoclub-admin-token`;
  - no contiene `localStorage`/`sessionStorage`;
  - no contiene `invitationLink`/`invitationUrl`;
  - no contiene `token_hash` ni textos de token raw.

- Regresiones:
  - solicitud publica invalida: `400 VALIDATION_ERROR`;
  - invitacion con token sintetico: `valid=false`;
  - `/api/me` sin sesion: `401`;
  - operacion con cookie sintetica invalida: `401`;
  - logo sin sesion: `401`.

## Riesgos o pendientes

- El panel sigue usando token interno temporal; auth admin final queda diferida.
- La prueba operativa real de listar/aprobar/rechazar/reenviar debe hacerse luego con token real por canal seguro, sin pegar el valor en chat, logs ni handoffs.
- Mantener regla de no mostrar links completos de invitacion ni tokens de invitacion en el panel.

## Siguiente recomendado

Product / Architect / Release puede procesar TASK-208 como cierre QA de publicacion, negativos y seguridad basica del panel interno. Programar una prueba completa posterior con token interno real por canal seguro para cubrir el P2 diferido.

## Seguridad

- No se uso token interno real.
- No se uso token de invitacion real.
- No se uso cookie real.
- No se uso password real.
- No se uso connection string.
- No se imprimieron secretos.
- El token usado para prueba negativa fue sintetico e invalido.
