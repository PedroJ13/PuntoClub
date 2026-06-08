# TASK-173 - Handoff Infra / Azure

## Resumen

Se habilito CORS credentials en la Function App publicada con origen acotado a Static Web Apps.

Resultado: completado.

Fecha/hora:

- `2026-06-08 16:34 -06:00`

## Ambiente

- Function App: `func-puntoclub-prod-br-001`
- Resource group: `resource_group_main`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Origen publicado permitido: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Cambio aplicado

Comando ejecutado:

```powershell
az functionapp cors credentials `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001 `
  --enable true
```

Estado CORS posterior:

```json
{
  "allowedOrigins": [
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4175",
    "https://calm-dune-075dc5c0f.7.azurestaticapps.net"
  ],
  "supportCredentials": true
}
```

Impacto:

- Azure Functions ahora puede devolver `Access-Control-Allow-Credentials: true` para los origenes permitidos.
- Esto permite que navegador acepte llamadas con cookies/sesion desde la SWA publicada hacia la API publicada.
- No se agregaron origenes nuevos.
- No se uso wildcard `*`.
- No se cambio codigo, SQL, pipeline, secretos ni servicios nuevos.
- No hay impacto de costo esperado.

## Estado previo observado

Antes del cambio:

```json
{
  "allowedOrigins": [
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4175",
    "https://calm-dune-075dc5c0f.7.azurestaticapps.net"
  ],
  "supportCredentials": false
}
```

Preflights publicados antes del cambio:

- Respondian `204`.
- Incluian `Access-Control-Allow-Origin` correcto.
- No incluian `Access-Control-Allow-Credentials`.

## Validacion publicada posterior

Origen usado:

```text
Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

### `OPTIONS /api/company-auth/login`

Request:

```text
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

Respuesta observada:

```text
HTTP 204
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
```

### `OPTIONS /api/me`

Request:

```text
Access-Control-Request-Method: GET
Access-Control-Request-Headers: content-type
```

Respuesta observada:

```text
HTTP 204
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: content-type
```

### `OPTIONS /api/company-invitations/accept`

Request:

```text
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

Respuesta observada:

```text
HTTP 204
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
```

## Seguridad

- No se imprimieron secretos.
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pegaron tokens de invitacion, links completos, passwords, cookies ni tokens de sesion.
- No se amplio CORS a wildcard.
- La configuracion queda acotada a los origenes ya permitidos.

## Pendientes

- Backend/API debe desplegar el fix de TASK-172 si aun no esta publicado.
- Web Dev debe confirmar deploy del ajuste TASK-170/TASK-174 para `acceptCompanyInvitation`.
- QA debe revalidar TASK-175:
  - `Crear acceso`;
  - login correcto;
  - cookie de sesion cross-site;
  - `/api/me`;
  - logout.

## Riesgos

- P1: si se agrega `*` a CORS en el futuro con credentials habilitado, se rompe la postura segura y puede fallar navegador.
- P1: si Backend/API aun no esta desplegado con cookie `SameSite=None; Secure`, login cross-site puede seguir fallando aunque CORS ya este correcto.
- P2: `http://127.0.0.1:4173` y `http://127.0.0.1:4175` siguen como origenes locales permitidos para validaciones; retirarlos requeriria una decision separada porque puede afectar QA/local preview.
