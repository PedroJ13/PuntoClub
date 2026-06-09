# TASK-191 - Handoff Backend API

## Resultado

Completado. API publicada confirmada con el hardening de TASK-189 desplegado.

El rate limiting/lockout de auth propia ya se observa activo en Azure Functions:

- Login invalido repetido llega a `429 TOO_MANY_ATTEMPTS`.
- Accept invitacion con token sintetico/no real repetido llega a `429 TOO_MANY_ATTEMPTS`.
- Regresiones seguras siguen correctas:
  - `/api/me` sin sesion responde `401`.
  - Endpoint operativo con cookie sintetica invalida responde `401`.

## Commit / run publicado validado

Commit validado:

- `fca419d98a75ea4b923ad09f08852a737983ad8d`
- Mensaje: `Implement auth rate limiting`
- Incluye implementacion de TASK-189:
  - `api/src/lib/authRateLimit.js`
  - helpers persistentes en `api/src/lib/repository.js`
  - integracion en `POST /api/company-auth/login`
  - integracion en `POST /api/company-invitations/accept`
  - pruebas `test/auth-rate-limit.test.js`
  - contrato `429 TOO_MANY_ATTEMPTS`

Workflow GitHub Actions:

- Nombre: `Deploy Punto Club API`
- Run: `https://github.com/PedroJ13/PuntoClub/actions/runs/27216489621`
- Estado: `completed`
- Conclusion: `success`
- `head_sha`: `fca419d98a75ea4b923ad09f08852a737983ad8d`
- Creado: `2026-06-09T15:20:26Z`
- Actualizado: `2026-06-09T15:22:42Z`

Job validado:

- `Test and deploy API`: `success`
- Pasos relevantes en verde:
  - `Run tests`
  - `Azure login`
  - `Package API`
  - `Deploy Azure Functions`
  - `Smoke test stable API`

## Validacion publicada

Ambiente:

- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha: `2026-06-09`

### Login invalido repetido

Endpoint:

```text
POST /api/company-auth/login
```

Sujeto:

- Email sintetico nuevo.
- Password sintetico.
- No se uso cuenta real ni password real.
- Valores no impresos.

Resultados:

| Intento | HTTP | Code | Mensaje |
| ---: | ---: | --- | --- |
| 1 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 2 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 3 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 4 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 5 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 6 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |

Resultado: aprobado para Backend/API. Confirma `429 TOO_MANY_ATTEMPTS` publicado.

### Accept invitacion con token sintetico/no real

Endpoint:

```text
POST /api/company-invitations/accept
```

Sujeto:

- Token sintetico con formato valido.
- Display name sintetico.
- Password sintetico.
- No se uso token real ni password real.
- Valores no impresos.

Resultados:

| Intento | HTTP | Code | Mensaje |
| ---: | ---: | --- | --- |
| 1 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 2 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 3 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 4 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 5 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 6 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |

Resultado: aprobado para Backend/API. Confirma `429 TOO_MANY_ATTEMPTS` publicado.

### `/api/me` sin sesion

Request:

```text
GET /api/me
Cookie: <ausente>
```

Respuesta observada:

```text
HTTP 401
Code: UNAUTHORIZED
```

Resultado: esperado.

### Endpoint operativo con cookie sintetica invalida

Request:

```text
GET /api/companies/1/customers
Cookie: puntoclub_company_session=<synthetic-redacted>
```

Respuesta observada:

```text
HTTP 401
Code: UNAUTHORIZED
```

Resultado: esperado.

## Confirmacion especifica de `429`

Confirmado:

- `POST /api/company-auth/login` con mismo email sintetico llega a `429 TOO_MANY_ATTEMPTS` en el intento 6.
- `POST /api/company-invitations/accept` con mismo token sintetico/no real llega a `429 TOO_MANY_ATTEMPTS` en el intento 6.
- El contrato publicado coincide con TASK-189:

```json
{
  "error": {
    "code": "TOO_MANY_ATTEMPTS",
    "message": "Too many attempts. Please try again later."
  }
}
```

## Pendientes o bloqueos

- QA / TASK-192 debe revalidar formalmente publicado con sujetos sinteticos nuevos.
- Si QA requiere evidencia de login correcto de cuenta no bloqueada, debe venir por PO Test/evidencia redaccionada sin password/cookies/tokens.
- El limite por IP sigue diferido hasta que exista proxy confiable/arquitectura aprobada por Infra.

## Seguridad

- No se uso password real.
- No se uso token real de invitacion.
- No se uso cookie real.
- No se imprimieron hashes, cookies, tokens, passwords ni connection strings.
- No se uso `INTERNAL_ADMIN_TOKEN`.
