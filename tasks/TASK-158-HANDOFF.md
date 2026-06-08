# TASK-158 - Handoff Web Dev

## Resultado

Bloqueado por dependencias pendientes.

Se revisaron `tasks/TASK-156-HANDOFF.md` y `tasks/TASK-157-HANDOFF.md`. Ambos confirman que la integracion productiva de Microsoft Entra External ID no esta lista:

- TASK-156: no existe external tenant accesible/confirmado, no existen `puntoclub-web` ni `puntoclub-api`, y no hay valores publicos finales para Web/API.
- TASK-157: Backend/API no implemento validacion JWT ni `POST /api/company-invitations/accept` porque faltan issuer, audience, metadata, client IDs, scope y user flow.

Por seguridad, Web Dev no activo el CTA `Crear acceso` ni implemento login inferido contra `Default Directory`.

## Cambios realizados

No se hicieron cambios de codigo en esta tarea.

La pantalla actual de invitacion se mantiene en estado seguro:

- `/company-invitations/accept?token=...` valida la invitacion.
- Si la invitacion es valida, muestra datos no sensibles.
- `Crear acceso` sigue deshabilitado.
- La UI indica: `La creacion de acceso se habilitara cuando el login este listo.`
- No se muestra ni se guarda el token de invitacion en UI/storage.

## Rutas / pantallas afectadas

Revisadas, sin cambios:

- `/company-invitations/accept?token=...`
- `Operaciones`
- `Mi empresa`
- `Reportes`

## Variables publicas requeridas

Pendientes desde TASK-156 para poder implementar Web sin secretos:

```text
PUBLIC_AUTH_CLIENT_ID=<puntoclub-web client id>
PUBLIC_AUTH_AUTHORITY=https://<tenant-subdomain>.ciamlogin.com/<tenant-id-or-domain>
PUBLIC_AUTH_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
PUBLIC_AUTH_SCOPES=openid profile email api://<puntoclub-api-client-id>/access_as_user
PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

Tambien debe existir contrato Backend funcional para:

- `POST /api/company-invitations/accept` con JWT valido.
- `GET /api/me` con resolucion de `CompanyUsers`.

## Pruebas locales ejecutadas

- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- `Get-Content app/staticwebapp.config.json -Raw | ConvertFrom-Json`: OK.

No se ejecuto smoke de login porque no hay tenant CIAM, client ID, authority, scopes ni endpoint backend autenticado.

## Validacion publicada

No ejecutada. La validacion publicada de `Crear acceso` requiere que Product Owner / Infra completen Entra External ID y que Backend/API implemente JWT + accept.

## Riesgos

- P1: Activar MSAL o login con valores inferidos de `Default Directory` puede emitir tokens con issuer/audience incorrectos.
- P1: Llamar `POST /api/company-invitations/accept` antes de que Backend valide JWT podria asociar usuarios a empresas de forma insegura.
- P1: Guardar token de invitacion en storage o mostrarlo en UI/logs violaria el modelo de seguridad aprobado.

## Siguiente accion requerida

Product Owner / Infra debe completar External ID en un external tenant de clientes y entregar los valores publicos seguros definidos en TASK-156.

Luego Backend/API debe completar TASK-157 con validacion JWT y endpoints autenticados. Despues de eso Web Dev puede retomar TASK-158 para activar `Crear acceso`.
