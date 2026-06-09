# TASK-183 - Handoff Backend API

## Resultado

Completado. API publicada confirmada con el cambio de TASK-179 desplegado.

La regla critica queda validada en ambiente publicado: una cookie sintetica invalida en endpoint operativo ya responde `401 UNAUTHORIZED`, no cae al fallback piloto y no devuelve datos.

## Commit / run publicado validado

Commit validado:

- `37855f84ad722a16ce795707ec6ff3f3adddccbf`
- Mensaje: `Use authenticated company context for operations`
- Incluye:
  - `getCompanyId(request)` async con lectura de sesion;
  - uso de `companyId` derivado de sesion cuando hay cookie valida;
  - fallback a `PILOT_COMPANY_ID` solo cuando no hay sesion;
  - rechazo de cookie invalida/expirada/revocada con `401`;
  - actualizacion de endpoints operativos a `await getCompanyId(request)`;
  - prueba `test/company-context.test.js`.

Workflow GitHub Actions:

- Nombre: `Deploy Punto Club API`
- Run: `https://github.com/PedroJ13/PuntoClub/actions/runs/27211191662`
- Estado: `completed`
- Conclusion: `success`
- `head_sha`: `37855f84ad722a16ce795707ec6ff3f3adddccbf`
- Creado: `2026-06-09T13:56:01Z`
- Actualizado: `2026-06-09T13:58:06Z`

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

### `/api/me` sin sesion

Request:

```text
GET /api/me
Cookie: <ausente>
```

Respuesta observada:

```text
HTTP 401
{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

Resultado: esperado.

### Empresa no piloto sin sesion

Request:

```text
GET /api/companies/999/customers
Cookie: <ausente>
```

Respuesta observada:

```text
HTTP 404
{"error":{"code":"COMPANY_NOT_FOUND","message":"Company was not found."}}
```

Resultado: esperado. El fallback sin sesion sigue acotado a `PILOT_COMPANY_ID`.

### Cookie sintetica invalida en endpoint operativo

Request:

```text
GET /api/companies/1/customers
Cookie: puntoclub_company_session=<synthetic-redacted>
```

Respuesta observada:

```text
HTTP 401
{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

Resultado: esperado y confirma la correccion del hallazgo de TASK-181.

Antes, QA observo que esta variante respondia `200` con items. Ahora la API publicada no hace fallback silencioso cuando hay cookie invalida.

## Confirmacion especifica

Confirmado:

- Cookie ausente + companyId no piloto: `404 COMPANY_NOT_FOUND`.
- Cookie sintetica invalida + companyId piloto: `401 UNAUTHORIZED`.
- La cookie sintetica invalida no autoriza operacion y no devuelve datos de clientes.

## Pendientes o bloqueos

- Web Dev / TASK-184 debe confirmar que la Web publicada envia `credentials: "include"` en operaciones privadas.
- PO Test / TASK-185 debe validar operacion real con sesion de empresa sin compartir password/cookies/tokens.
- QA / TASK-186 debe cerrar la validacion E2E publicada cuando TASK-184 y TASK-185 esten listos.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token real de invitacion.
- No se imprimieron cookies, tokens, connection strings ni `INTERNAL_ADMIN_TOKEN`.
- La cookie documentada es sintetica y el valor fue redactado.
