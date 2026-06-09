# TASK-205 - Handoff Backend/API

## Resultado

Aprobado para Backend/API.

La API publicada ya contiene los cambios de TASK-201. El endpoint interno de listado de solicitudes `GET /api/company-registration-requests` esta activo y protegido; ya no responde `404` como en TASK-204.

## Commit/deploy validado

Commit publicado en `main`:

- SHA: `d9d2f7f1d943e68b6b6cc5ac170a75199c6a96b4`
- Titulo: `Add internal company admin panel`
- URL: `https://github.com/PedroJ13/PuntoClub/commit/d9d2f7f1d943e68b6b6cc5ac170a75199c6a96b4`

Workflow API:

- Nombre: `Deploy Punto Club API`
- Run ID: `27228275003`
- Head SHA: `d9d2f7f1d943e68b6b6cc5ac170a75199c6a96b4`
- Status: `completed`
- Conclusion: `success`
- Created: `2026-06-09T18:48:04Z`
- Updated: `2026-06-09T18:50:00Z`
- URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/27228275003`

## Checks publicados ejecutados

Ambiente:

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Se ejecuto sin token real y con un token sintetico invalido.

```text
GET  /api/company-registration-requests?status=pending&limit=25  sin token          -> 403
GET  /api/company-registration-requests?status=pending&limit=25  token sintetico   -> 403
POST /api/company-registration-requests/1/approve                sin token          -> 403
POST /api/company-registration-requests/1/approve                token sintetico   -> 403
POST /api/company-registration-requests/1/reject                 sin token          -> 403
POST /api/company-registration-requests/1/reject                 token sintetico   -> 403
POST /api/company-invitations/1/resend                           sin token          -> 403
POST /api/company-invitations/1/resend                           token sintetico   -> 403
```

Respuesta redaccionada observada:

```json
{"statusCode":403,"body":""}
```

## Confirmaciones

- `GET /api/company-registration-requests?status=pending&limit=25` esta publicado y protegido.
- Approve/reject/resend siguen protegidos con `403` sin token o con token invalido.
- Las respuestas negativas no exponen token raw, token hash, link de invitacion, cookies, passwords ni secretos.
- No se uso ni registro el valor real de `x-puntoclub-admin-token`.
- No se introdujo Entra External ID ni se cambio la auth principal de empresa.

## P0/P1/P2/P3

- P0: ninguno.
- P1: ninguno para Backend/API.
- P2: auth admin final sigue diferida; se mantiene proteccion temporal por `x-puntoclub-admin-token`.
- P3: ninguno.

## Bloqueos / pendientes

- Web Dev debe confirmar publicacion del panel en TASK-206.
- Flujo positivo con token real debe validarse por PO Test/QA sin exponer el token ni links de invitacion.
