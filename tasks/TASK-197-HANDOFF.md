# TASK-197 - Handoff Backend/API

## Resultado

Aprobado para Backend/API.

La API privada de logo de empresa esta desplegada en Azure Functions. Los endpoints publicados `/api/my-company/logo` ya no responden `404`; sin sesion responden `401`, que es el comportamiento esperado para confirmar que el endpoint esta activo y protegido.

## Commit/run publicado validado

Commit publicado en `main`:

- SHA: `64ca70791caae502e92e0a4f854c8027e331df18`
- Titulo: `Add private company logo upload`
- Fecha GitHub: `2026-06-09T10:36:04-06:00`
- URL: `https://github.com/PedroJ13/PuntoClub/commit/64ca70791caae502e92e0a4f854c8027e331df18`

Workflow API:

- Nombre: `Deploy Punto Club API`
- Run ID: `27221017207`
- Display title: `Add private company logo upload`
- Head SHA: `64ca70791caae502e92e0a4f854c8027e331df18`
- Status: `completed`
- Conclusion: `success`
- Created: `2026-06-09T16:36:14Z`
- Updated: `2026-06-09T16:38:16Z`
- URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/27221017207`

Nota: el conector GitHub no devolvio runs asociados al commit, por lo que se consulto GitHub Actions via REST publico. `gh` no esta instalado localmente.

## Validacion publicada sin sesion

Ambiente:

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Checks ejecutados sin cookie real, sin password real, sin SAS, sin account key y sin connection string:

```text
GET  /api/my-company/logo -> 401
POST /api/my-company/logo -> 401
GET  /api/me              -> 401
```

Respuesta redaccionada:

```json
{"method":"GET","path":"/api/my-company/logo","statusCode":401}
{"method":"POST","path":"/api/my-company/logo","statusCode":401}
{"method":"GET","path":"/api/me","statusCode":401}
```

La primera ejecucion desde sandbox fallo por proxy local de red (`127.0.0.1:9`). Se repitio fuera del sandbox para validar la Function App publicada.

## Confirmacion de endpoints activos

Confirmado:

- `GET /api/my-company/logo` esta activo y protegido por sesion.
- `POST /api/my-company/logo` esta activo y protegido por sesion.
- `/api/me` mantiene el comportamiento esperado `401` sin sesion.

No se subio logo real autenticado y no se uso ninguna credencial real.

## Pendientes / bloqueos

- Backend/API no tiene bloqueo para TASK-197.
- La validacion funcional real de upload/refresh/logout-login requiere sesion real o evidencia PO redaccionada y queda para TASK-199/TASK-200.
- Web publicada debe confirmarse por Web Dev en TASK-198.
