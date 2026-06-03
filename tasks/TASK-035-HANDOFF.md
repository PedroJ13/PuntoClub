Equipo:
Infra / Azure

Tarea completada:
Configuracion de CORS en Azure Functions para permitir que el frontend local consuma la API estable sin usar wildcard permanente.

Ambiente:
- Function App: `func-puntoclub-prod-br-001`
- Resource group: `resource_group_main`
- API base: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Frontend local permitido:
  - `http://127.0.0.1:4173`
  - `http://127.0.0.1:4175`

Cambio/config ejecutado:
- Se agregaron origenes CORS permitidos en Azure Functions:
  - `http://127.0.0.1:4173`
  - `http://127.0.0.1:4175`
- `supportCredentials`: `false`
- No se configuro wildcard `*`.
- No se creo Static Web Apps.
- No se cambiaron contratos API.
- No se guardaron secretos.

Configuracion efectiva:

```json
{
  "allowedOrigins": [
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4175"
  ],
  "supportCredentials": false
}
```

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `tasks/TASK-032-HANDOFF.md`, `tasks/TASK-034-HANDOFF.md` y `tasks/TASK-035.md`.
- Consultado CORS actual antes del cambio.
- Configurado CORS en Azure Functions con `az functionapp cors add`.
- Validado `OPTIONS`, `GET` y `POST` desde `Origin: http://127.0.0.1:4173`.
- Validado `OPTIONS`, `GET` y `POST` desde `Origin: http://127.0.0.1:4175`.
- Validado origen negativo `http://127.0.0.1:9999`: la API responde server-side, pero no devuelve `Access-Control-Allow-Origin`.

Resultado verificacion `4173`:

```text
OPTIONS_STATUS=204
OPTIONS_ACAO=http://127.0.0.1:4173
OPTIONS_ACAM=POST
GET_STATUS=200
GET_ACAO=http://127.0.0.1:4173
POST_STATUS=201
POST_ACAO=http://127.0.0.1:4173
```

Resultado verificacion `4175`:

```text
OPTIONS_STATUS=204
OPTIONS_ACAO=http://127.0.0.1:4175
OPTIONS_ACAM=POST
GET_STATUS=200
GET_ACAO=http://127.0.0.1:4175
POST_STATUS=201
POST_ACAO=http://127.0.0.1:4175
```

Resultado origen no permitido:

```text
NEGATIVE_STATUS=200
NEGATIVE_ACAO=null
```

Datos creados durante validacion:
- Se crearon clientes de prueba via `POST /api/companies/1/customers` para confirmar CORS en navegador/API estable.
- Cliente observado en validacion `4173`: `Task 035 CORS ...`, id `19`.

Resultado:
La API estable ya devuelve headers CORS para los dos origenes locales usados por Web Dev. La UI local deberia poder consumir la API estable desde `127.0.0.1:4173` y `127.0.0.1:4175`.

Riesgos o pendientes:
- CORS local es una excepcion de prueba. Antes de production publica, reemplazar por el origen real de Static Web Apps o same-origin.
- Si Web Dev usa otro puerto local, CORS volvera a bloquear hasta agregar ese origen.
- `GET /api/companies/1/settings` sigue fuera de las funciones indexadas reportadas en TASK-032; esto no fue cambiado por Infra.
- La regla SQL `AllowAllWindowsAzureIps` sigue siendo riesgo heredado y no se modifico en esta tarea.

Siguiente recomendado:
Web Dev debe repetir TASK-034 contra `https://func-puntoclub-prod-br-001.azurewebsites.net` desde `http://127.0.0.1:4173` o `http://127.0.0.1:4175`. QA puede validar en navegador que buscar/listar, registrar, duplicado y errores de campo ya no quedan bloqueados por CORS.
