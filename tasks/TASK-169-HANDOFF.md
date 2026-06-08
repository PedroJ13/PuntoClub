# TASK-169 - Handoff Backend API

## Resultado

Diagnostico completado. No se aplico cambio de codigo.

La causa mas probable del fallo publicado en `Crear acceso` es CORS/credentials en Azure Functions:

- La Web publicada llama `POST /api/company-invitations/accept` con `credentials: "include"`.
- El preflight CORS publicado responde `204` y permite el origen/metodo/header.
- Pero no devuelve `Access-Control-Allow-Credentials`.
- Con `credentials: "include"`, el navegador bloquea la llamada si falta `Access-Control-Allow-Credentials: true`.
- La UI cae en el mensaje generico `No se pudo crear el acceso. Intente de nuevo.`

## Evidencia segura

Ambiente:

- Web publicada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Function App / App Insights: `func-puntoclub-prod-br-001`

### App Insights

Consulta segura de `acceptCompanyInvitation` en las ultimas 48h:

| Result code | Count | Min timestamp UTC | Max timestamp UTC |
| --- | ---: | --- | --- |
| `400` | 6 | `2026-06-08T21:44:36Z` | `2026-06-08T22:21:07Z` |
| `404` | 1 | `2026-06-08T21:56:41Z` | `2026-06-08T21:56:41Z` |

No se observaron:

- `500` en `acceptCompanyInvitation`.
- Excepciones asociadas a esas operaciones.
- Dependencias SQL fallidas asociadas a esas operaciones.
- `201` exitoso de aceptacion.

Interpretacion:

- No hay evidencia de fallo SQL/constraint en `CompanyUsers` o `CompanySessions`.
- No hay evidencia de excepcion backend para el intento real.
- Si el Product Owner hizo submit desde navegador y el navegador bloqueo CORS, la operacion no necesariamente aparece como request completa en App Insights.

### Preflight CORS publicado

Request seguro ejecutado:

```text
OPTIONS https://func-puntoclub-prod-br-001.azurewebsites.net/api/company-invitations/accept
Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

Respuesta observada:

```text
HTTP 204
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Credentials: <ausente>
```

## Impacto identificado

El endpoint `POST /api/company-invitations/accept` no necesita cookie para aceptar la invitacion, pero Web lo llama con `credentials: "include"` siguiendo la estrategia de sesion para auth propia.

Con la configuracion actual:

- Browser + `credentials: "include"` + CORS sin `Access-Control-Allow-Credentials` bloquea la llamada.
- Scripts server-side pueden seguir viendo respuestas controladas, por eso QA negativo pasa y el fallo aparece solo en navegador.

## Cambios realizados

No se modifico codigo.

No se modifico Azure porque el ajuste persistente de CORS credentials en produccion requiere aprobacion/ejecucion de Infra. Se intento confirmar/aplicar el comando de Azure CLI, pero la accion fue rechazada por control de riesgo al ser un cambio persistente de configuracion productiva.

## Ajuste requerido para Infra / Azure

Habilitar credentials en CORS de la Function App, manteniendo origenes permitidos acotados.

Comando sugerido:

```powershell
az functionapp cors credentials `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001 `
  --enable true
```

Despues validar:

```text
OPTIONS /api/company-invitations/accept
Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

Debe incluir:

```text
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

No usar wildcard (`*`) con credentials.

## Alternativa Web

Si Infra no habilita credentials todavia, Web podria quitar `credentials: "include"` solo en `POST /api/company-invitations/accept`, porque ese endpoint no requiere cookie previa. Aun asi, login, `/api/me` y logout seguiran necesitando strategy de cookies/credentials para sesion.

## Pruebas ejecutadas

- Lectura de `tasks/TASK-169-assignment.md`.
- Lectura de `AGENTS.md`, `chat-start/BACKEND_API.md`, `docs/MVP_RELEASE_STATUS.md`.
- Lectura de handoffs relacionados: TASK-161, TASK-165, TASK-166.
- Revision de codigo:
  - `api/src/functions/companyInvitations.js`.
  - `api/src/lib/repository.js`.
  - `api/src/lib/errors.js`.
  - `app/src/app.js`.
  - `app/src/customerApi.js`.
- Consulta App Insights segura sin payloads.
- Preflight CORS publicado desde origen real.

No se corrio `npm test` porque no hubo cambios de codigo.

## Pendientes

- Infra / Azure: habilitar `Access-Control-Allow-Credentials` en CORS de Function App o confirmar otra estrategia.
- Web Dev / TASK-170: si se decide no habilitar credentials global todavia, ajustar `POST /api/company-invitations/accept` para no usar `credentials: "include"` y mantener credentials solo para login/me/logout.
- QA / TASK-171: revalidar `Crear acceso` con invitacion fresca despues del ajuste.

## Confirmacion de seguridad

- No se pidio token al Product Owner.
- No se uso ni imprimio token raw de invitacion.
- No se uso ni imprimio password.
- No se uso ni imprimio cookie ni token de sesion.
- No se uso ni imprimio `INTERNAL_ADMIN_TOKEN`.
- No se pego URL completa con token.
- Las consultas a App Insights no recuperaron payloads.
