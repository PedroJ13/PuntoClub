# TASK-173 - Habilitar CORS credentials en Azure Functions

Equipo responsable: Infra / Azure

## Contexto

TASK-169 confirmo que el preflight CORS publicado permite origen/metodo/header, pero no devuelve `Access-Control-Allow-Credentials`. Login, logout y `/api/me` usan `credentials: "include"` para sesion server-side.

## Objetivo

Habilitar CORS credentials en la Function App publicada con origen acotado a Static Web Apps, sin wildcard.

## Accion esperada

Configurar credentials en CORS para:

- Function App: `func-puntoclub-prod-br-001`
- Resource group: `resource_group_main`
- Origen permitido: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Comando esperado, si aplica:

```powershell
az functionapp cors credentials `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001 `
  --enable true
```

## Validacion requerida

Preflight publicado debe incluir:

```text
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
```

Validar al menos:

- `OPTIONS /api/company-auth/login`
- `OPTIONS /api/me`
- `OPTIONS /api/company-invitations/accept`

## Seguridad

- No imprimir secretos.
- No usar `*` con credentials.
- No cambiar CORS a origenes amplios sin aprobacion.

## Entregable

Crear o actualizar `tasks/TASK-173-HANDOFF.md` con resultado, comandos/validaciones seguras y pendientes.
