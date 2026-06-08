# TASK-174 - Handoff Web Dev

## Resultado

Deploy Web confirmado.

Static Web Apps publicada ya contiene el ajuste de TASK-170: `acceptCompanyInvitation` no envia `credentials: "include"`.

Ambiente validado:

- Web publicada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Evidencia redaccionada

Bundle publicado revisado:

- Ruta: `/src/customerApi.js`
- `bundleLength`: `36846`
- `acceptCompanyInvitation`: encontrado.
- `acceptCompanyInvitation` contiene `credentials: "include"`: `false`.
- `loginCompany` mantiene `credentials: "include"`: `true`.
- `logoutCompany` mantiene `credentials: "include"`: `true`.
- `getCurrentCompanyUser` mantiene `credentials: "include"`: `true`.

Smoke visual publicado con token falso/redactado:

- Ruta validada: `/company-invitations/accept?token=<redacted-fake-token>`.
- `path`: `/company-invitations/accept`.
- Pantalla publica de invitacion visible: `true`.
- App privada oculta: `true`.
- Estado de invitacion valida visible: `false`.
- Estado de invitacion no disponible visible: `true`.
- Mensaje visible: `Invitacion no disponible`.
- Error tecnico visible: vacio.
- Token falso visible en pantalla: `false`.
- Overflow horizontal: `false`.

## Seguridad

- No se uso token real.
- No se uso password real.
- No se inspeccionaron ni pegaron cookies reales.
- No se pego URL completa con token real.
- El token usado en smoke fue sintetico y redactado.

## Riesgos / pendientes

- QA debe reintentar el flujo con invitacion fresca por canal seguro.
- Login/logout/me siguen dependiendo de CORS con credentials para sesion; si Azure Functions no devuelve `Access-Control-Allow-Credentials: true` en esos endpoints, la sesion podria requerir ajuste de Infra.
