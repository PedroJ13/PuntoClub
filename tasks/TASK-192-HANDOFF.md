# TASK-192 - Handoff QA

Equipo: QA

Tarea validada: TASK-192 - Revalidar rate limiting auth propia publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-09

## Resultado

Aprobado.

QA revalido que el rate limiting/lockout de auth propia ya esta activo en la API publicada. El comportamiento observado coincide con el contrato de TASK-189/TASK-191: despues de 5 fallos, el intento 6 responde `429 TOO_MANY_ATTEMPTS`.

## Checks ejecutados

### Dependencia revisada

Se reviso `tasks/TASK-191-HANDOFF.md`.

Resumen relevante:

- Deploy API confirmado para commit `fca419d98a75ea4b923ad09f08852a737983ad8d`.
- Workflow `Deploy Punto Club API` completado con `success`.
- Backend/API observo `429 TOO_MANY_ATTEMPTS` publicado en login invalido y accept con token sintetico.

### Login con credenciales invalidas sinteticas

Endpoint:

```text
POST /api/company-auth/login
```

Payload seguro:

- Email sintetico nuevo en dominio reservado.
- Password sintetico.
- No se uso cuenta real ni password real.

Resultado observado:

| Intento | HTTP | Code | Mensaje |
| ---: | ---: | --- | --- |
| 1 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 2 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 3 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 4 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 5 | 401 | `UNAUTHORIZED` | `Invalid email or password.` |
| 6 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |
| 7 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |

Resultado QA: aprobado.

El mensaje de los intentos fallidos es generico y no revela si el email existe.

### Accept invitacion con token sintetico/no real

Endpoint:

```text
POST /api/company-invitations/accept
```

Payload seguro:

- Token sintetico nuevo con formato valido.
- Display name sintetico.
- Password sintetico.
- No se uso token real ni password real.

Resultado observado:

| Intento | HTTP | Code | Mensaje |
| ---: | ---: | --- | --- |
| 1 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 2 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 3 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 4 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 5 | 404 | `INVITATION_NOT_FOUND` | `Company invitation was not found.` |
| 6 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |
| 7 | 429 | `TOO_MANY_ATTEMPTS` | `Too many attempts. Please try again later.` |

Resultado QA: aprobado.

No se uso ni expuso invitacion real.

### Regresion segura

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `GET /api/companies/1/customers` con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## Hallazgos

No se encontraron hallazgos nuevos para el alcance de TASK-192.

## P0/P1

Ninguno abierto.

## P2/P3

Ninguno nuevo.

Nota: QA no ejecuto login correcto con cuenta real por seguridad. La operacion autenticada real ya habia sido aprobada en TASK-186 con evidencia redaccionada de PO Test; si Product/Release requiere una evidencia posterior al hardening, debe venir como evidencia PO redaccionada sin password, cookie ni token.

## Evidencia redaccionada

- Login invalido con sujeto sintetico nuevo:
  - intentos 1-5: `401 UNAUTHORIZED`;
  - intentos 6-7: `429 TOO_MANY_ATTEMPTS`.

- Accept con token sintetico nuevo:
  - intentos 1-5: `404 INVITATION_NOT_FOUND`;
  - intentos 6-7: `429 TOO_MANY_ATTEMPTS`.

- `/api/me` sin sesion:
  - `401 UNAUTHORIZED`.

- Endpoint operativo con cookie sintetica invalida:
  - `401 UNAUTHORIZED`.

## Riesgos o pendientes

- El limite por IP sigue diferido por decision de Infra/Azure en TASK-188 hasta contar con proxy confiable.
- Si se desea demostrar login exitoso post-hardening, pedir evidencia PO redaccionada; QA no debe manejar password real.

## Siguiente recomendado

Product / Architect / Release puede cerrar el hardening de auth propia como aprobado en publicado y mantener el limite por IP como mejora futura condicionada a cambios de arquitectura.

## Seguridad

- No se uso password real.
- No se uso email real de cuenta operativa.
- No se uso token real de invitacion.
- No se uso cookie real.
- No se imprimieron hashes, cookies, tokens, passwords ni secretos.
