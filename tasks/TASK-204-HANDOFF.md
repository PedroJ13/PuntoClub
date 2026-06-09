# TASK-204 - Handoff QA

Equipo: QA

Tarea validada: TASK-204 - Validar panel interno de empresas publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-09

## Resultado

No aprobado / bloqueado por cambios no publicados.

El panel interno de administracion de empresas no se observa publicado:

- `GET /api/company-registration-requests?status=pending&limit=25` responde `404`, tanto sin token como con token sintetico invalido.
- La Web publicada no contiene la seccion `Admin empresas`.
- El bundle publicado no contiene las funciones admin esperadas:
  - `listCompanyRegistrationRequests`;
  - `approveCompanyRegistrationRequest`;
  - `rejectCompanyRegistrationRequest`;
  - `resendCompanyInvitation`.
- El bundle publicado no contiene el header `x-puntoclub-admin-token`.

Los endpoints internos existentes de aprobar/rechazar/reenviar siguen protegidos con `403` sin token, pero no se puede validar el flujo del panel publicado porque falta el endpoint de listado y la UI publicada.

## Checks ejecutados

### Dependencias revisadas

- `tasks/TASK-201-HANDOFF.md`:
  - Backend/API agrego en codigo local `GET /api/company-registration-requests` protegido por `x-puntoclub-admin-token`.
  - Pendiente commit/deploy API para validacion publicada.

- `tasks/TASK-202-HANDOFF.md`:
  - UX minima definida para `Administracion interna` / `Admin empresas`.
  - Token interno temporal solo en memoria, no `localStorage`/`sessionStorage`.
  - No mostrar links completos ni tokens de invitacion.

- `tasks/TASK-203-HANDOFF.md`:
  - Web Dev implemento panel en codigo local.
  - Pendiente validar publicado con token real por canal seguro.
  - Declara que el endpoint nuevo de TASK-201 queda pendiente de deploy API si aun no fue publicado.

### Seguridad API sin token o con token invalido

#### Listado de solicitudes

Endpoint:

```text
GET /api/company-registration-requests?status=pending&limit=25
```

Resultados:

- Sin token: `404`.
- Token sintetico invalido: `404`.

Resultado QA: no aprobado. El endpoint nuevo de listado no parece estar publicado. Si estuviera publicado y protegido, se esperaria `403 FORBIDDEN` sin token o con token invalido.

#### Aprobar solicitud

Endpoint:

```text
POST /api/company-registration-requests/1/approve
```

Resultados:

- Sin token: `403 FORBIDDEN`.
- Token sintetico invalido: `403 FORBIDDEN`.

Resultado QA: aprobado para seguridad del endpoint existente.

#### Rechazar solicitud

Endpoint:

```text
POST /api/company-registration-requests/1/reject
```

Resultado:

- Sin token: `403 FORBIDDEN`.

Resultado QA: aprobado para seguridad del endpoint existente.

#### Reenviar invitacion

Endpoint:

```text
POST /api/company-invitations/1/resend
```

Resultado:

- Sin token: `403 FORBIDDEN`.

Resultado QA: aprobado para seguridad del endpoint existente.

### Web publicada

Se revisaron recursos publicados:

- `/`
- `/src/app.js`
- `/src/customerApi.js`

Resultado:

- No contiene `Admin empresas`.
- No contiene `Acceso interno temporal`.
- No contiene UI/input detectable de token interno.
- No contiene `listCompanyRegistrationRequests`.
- No contiene `approveCompanyRegistrationRequest`.
- No contiene `rejectCompanyRegistrationRequest`.
- No contiene `resendCompanyInvitation`.
- No contiene `x-puntoclub-admin-token`.
- No contiene `localStorage` ni `sessionStorage`.
- No contiene `invitationUrl` ni `invitationLink`.

Resultado QA: no aprobado. La UI del panel interno no esta publicada.

### Regresion basica segura

- Solicitud publica de empresa con payload invalido:
  - `POST /api/company-registration-requests`
  - Observado: `400 VALIDATION_ERROR`.
  - Resultado: aprobado como check negativo seguro.

- Invitacion/crear acceso con token sintetico no real:
  - `GET /api/company-invitations/validate?token=<synthetic-redacted>`
  - Observado: `200` con `valid=false`, `reason=invalid`.
  - Resultado: aprobado como check negativo seguro.

- Auth:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Operacion autenticada:
  - Endpoint operativo con cookie sintetica invalida: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `Mi empresa` / logo:
  - `GET /api/my-company/logo` sin sesion: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## No ejecutado

No se pudo ejecutar por falta de endpoint/UI publicados y porque QA no debe manejar el token interno real:

- Listar solicitudes con token real.
- Aprobar solicitud de prueba.
- Rechazar solicitud de prueba.
- Reenviar invitacion pendiente.
- Confirmar desde UI publicada que el token queda solo en memoria.
- Confirmar desde UI publicada que no se muestran link completo de invitacion ni token de invitacion.

## Hallazgos

### P1 - Endpoint de listado interno no publicado

`GET /api/company-registration-requests?status=pending&limit=25` responde `404`. Este endpoint es necesario para cargar el panel interno.

Impacto: el panel no puede listar solicitudes publicadas.

### P1 - UI del panel interno no publicada

La Web publicada no contiene la seccion `Admin empresas` ni las funciones admin de TASK-203.

Impacto: no se puede operar el flujo interno desde la Web publicada.

## P0/P1

- P1: Endpoint de listado interno no publicado.
- P1: UI de panel interno no publicada.

## P2/P3

Ninguno nuevo.

## Evidencia redaccionada

- `GET /api/company-registration-requests?status=pending&limit=25` sin token: `404`.
- `GET /api/company-registration-requests?status=pending&limit=25` con token sintetico invalido: `404`.
- `POST /api/company-registration-requests/1/approve` sin token/invalido: `403 FORBIDDEN`.
- `POST /api/company-registration-requests/1/reject` sin token: `403 FORBIDDEN`.
- `POST /api/company-invitations/1/resend` sin token: `403 FORBIDDEN`.
- Bundle Web publicado no contiene `Admin empresas`, funciones admin ni `x-puntoclub-admin-token`.
- Bundle Web publicado no contiene `localStorage` ni `sessionStorage`.
- Regresiones seguras:
  - solicitud publica invalida: `400 VALIDATION_ERROR`;
  - invitacion con token sintetico: `valid=false`;
  - `/api/me` sin sesion: `401`;
  - operacion con cookie sintetica invalida: `401`;
  - logo sin sesion: `401`.

## Riesgos o pendientes

- Backend/API debe publicar el endpoint nuevo `GET /api/company-registration-requests`.
- Web Dev debe publicar la UI de `Admin empresas`.
- Para cerrar el flujo real, QA necesita evidencia segura o ejecucion controlada con token interno real sin registrar el valor:
  - listar solicitudes;
  - aprobar solicitud de prueba;
  - rechazar solicitud de prueba o validar estado alterno;
  - reenviar invitacion pendiente si aplica.
- Mantener el token interno temporal fuera de `localStorage`, `sessionStorage`, query strings, logs visibles y handoffs.

## Siguiente recomendado

Confirmar deploy API de TASK-201 y deploy Web de TASK-203. Despues reintentar TASK-204 con checks publicados y, si QA no debe manejar el token real, pedir evidencia redaccionada del flujo operativo interno sin exponer token, links de invitacion, cookies, passwords ni connection strings.

## Seguridad

- No se uso token interno real.
- No se uso token de invitacion real.
- No se uso cookie real.
- No se uso password real.
- No se uso connection string.
- No se imprimieron secretos.
- El token usado para prueba negativa fue sintetico e invalido.
