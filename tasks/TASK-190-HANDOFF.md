# TASK-190 - Handoff QA

Equipo: QA

Tarea validada: TASK-190 - Validar rate limiting auth propia publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-09

## Resultado

No aprobado.

El rate limiting/lockout de auth propia no se observa activo en la API publicada. Los endpoints responden de forma controlada, pero no llegan al contrato esperado `429 TOO_MANY_ATTEMPTS` despues de intentos repetidos con sujetos sinteticos.

Nota de dependencia: `tasks/TASK-189-HANDOFF.md` indica que la implementacion quedo completada en codigo local y con `Pendiente deploy API para validar publicado`. La evidencia publicada de QA es consistente con que el cambio aun no esta desplegado o no esta aplicandose en produccion.

## Checks ejecutados

### Dependencias revisadas

- `tasks/TASK-187-HANDOFF.md`:
  - SQL `dbo.AuthAttemptLimits` aplicado y validado en Azure SQL.
  - Sin secretos ni subjects raw persistidos.

- `tasks/TASK-188-HANDOFF.md`:
  - Infra no aprueba bloqueo fuerte por IP en la arquitectura actual.
  - Control principal esperado: email normalizado para login y token/invitacion para accept.

- `tasks/TASK-189-HANDOFF.md`:
  - Contrato esperado:
    - ventana 15 minutos;
    - maximo 5 fallos;
    - bloqueo 15 minutos;
    - respuesta `429 TOO_MANY_ATTEMPTS`.
  - Estado declarado: implementado localmente, pendiente deploy API.

### Login con credenciales invalidas sinteticas

Endpoint:

```text
POST /api/company-auth/login
```

Payload seguro:

- Email sintetico unico en dominio reservado.
- Password sintetico.
- No se uso cuenta real ni password real.

Resultado observado:

- Intentos 1 a 7: `401 UNAUTHORIZED`.
- Mensaje: `Invalid email or password.`
- No se observo `429 TOO_MANY_ATTEMPTS`.

Resultado QA: no aprobado.

El mensaje no revela si el email existe, lo cual es correcto, pero el limite no se activa segun el contrato esperado.

### Login con email malformado

Endpoint:

```text
POST /api/company-auth/login
```

Resultado observado:

- `400 VALIDATION_ERROR`.
- Error de validacion de email.

Resultado QA: aprobado para validacion basica negativa.

### Accept invitacion con token sintetico/no real

Endpoint:

```text
POST /api/company-invitations/accept
```

Payload seguro:

- Token sintetico con formato valido, no real.
- Display name sintetico.
- Password sintetico.

Resultado observado:

- Intentos 1 a 7: `404 INVITATION_NOT_FOUND`.
- No se observo `429 TOO_MANY_ATTEMPTS`.

Resultado QA: no aprobado.

### Accept invitacion con token malformado

Endpoint:

```text
POST /api/company-invitations/accept
```

Resultado observado:

- `400 VALIDATION_ERROR`.
- Error de validacion de token.

Resultado QA: aprobado para validacion basica negativa.

### Regresion segura

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `GET /api/companies/1/customers` con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

Operacion autenticada real previa:

- TASK-186 aprobo operacion autenticada publicada con evidencia redaccionada de PO Test.
- En TASK-190 no se recibio nueva evidencia segura de login correcto posterior al hardening.

## Hallazgos

### P1 - Rate limiting publicado no se activa en login

Despues de 7 intentos fallidos con el mismo email sintetico, el endpoint siguio respondiendo `401 UNAUTHORIZED` en lugar de `429 TOO_MANY_ATTEMPTS`.

Impacto: el objetivo principal de TASK-190 no queda validado en publicado.

### P1 - Rate limiting publicado no se activa en accept de invitacion

Despues de 7 intentos fallidos con el mismo token sintetico de formato valido, el endpoint siguio respondiendo `404 INVITATION_NOT_FOUND` en lugar de `429 TOO_MANY_ATTEMPTS`.

Impacto: el hardening por token/invitacion no queda validado en publicado.

## P0/P1

- P1: Login invalido repetido no llega a `429 TOO_MANY_ATTEMPTS`.
- P1: Accept de invitacion con token sintetico repetido no llega a `429 TOO_MANY_ATTEMPTS`.

## P2/P3

- P2: Falta evidencia segura de login correcto de cuenta no bloqueada despues del hardening publicado. La tarea permite dejarlo como evidencia PO requerida si QA/PO no provee credenciales/evidencia segura.

## Evidencia redaccionada

- Login con email/password sinteticos:
  - intentos 1-7: `401 UNAUTHORIZED`;
  - no se observo `429`.

- Login con email malformado:
  - `400 VALIDATION_ERROR`.

- Accept con token sintetico de formato valido:
  - intentos 1-7: `404 INVITATION_NOT_FOUND`;
  - no se observo `429`.

- Accept con token malformado:
  - `400 VALIDATION_ERROR`.

- `/api/me` sin sesion:
  - `401 UNAUTHORIZED`.

- Endpoint operativo con cookie sintetica invalida:
  - `401 UNAUTHORIZED`.

## Riesgos o pendientes

- Backend/API debe confirmar deploy publicado de TASK-189 o corregir por que la API publicada no incrementa/bloquea sujetos en `dbo.AuthAttemptLimits`.
- Revalidar despues de deploy/fix con sujetos sinteticos nuevos para evitar arrastrar ventanas previas.
- PO Test puede aportar evidencia redaccionada de login correcto de cuenta no bloqueada despues de que el rate limiting este publicado.

## Siguiente recomendado

Backend/API o Infra debe confirmar que TASK-189 fue desplegada en Azure Functions. Despues, QA debe reintentar TASK-190 con email y token sinteticos nuevos hasta observar `429 TOO_MANY_ATTEMPTS` en login y accept.

## Seguridad

- No se uso password real.
- No se uso email real de cuenta operativa.
- No se uso token real de invitacion.
- No se uso cookie real.
- No se imprimieron hashes, cookies, tokens, passwords ni secretos.
