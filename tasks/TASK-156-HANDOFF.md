# TASK-156 - Handoff Infra / Azure

## Resumen

Se reviso nuevamente la configuracion de Microsoft Entra External ID para Punto Club.

Resultado: bloqueado por falta de external tenant accesible/confirmado.

Fecha/hora:

- `2026-06-08 12:30 -06:00`

No se hicieron cambios en Azure, Function App, Static Web Apps, pipeline, codigo ni secretos.

## Estado confirmado

Tenant activo de Azure:

- Subscription: `as_main`
- Subscription ID: `ea1a3068-3abc-425a-ad65-53be62bdf0c6`
- Tenant ID activo: `a50d6327-9af1-45f4-ab3e-4a931f70e318`
- Usuario: `pj13eros_business@outlook.com`

Tenant Entra activo:

- Display name: `Default Directory`
- Tenant type: `AAD`
- Dominio inicial: `pj13erosbusinessoutlook.onmicrosoft.com`

Tenants visibles por ARM:

- Solo `Default Directory`
- `tenantType=AAD`
- No se observo external tenant visible/accesible desde esta sesion.

App registrations en el tenant activo:

- `puntoclub-web`: no existe.
- `puntoclub-api`: no existe.

Function App:

- `func-puntoclub-prod-br-001`
- No hay app settings `AUTH_*` configurados.

## Decision Infra

No se crearon app registrations, user flows ni settings de auth.

Motivo:

- El unico tenant visible sigue siendo `Default Directory`.
- Tareas anteriores ya definieron que no se deben crear `puntoclub-web`, `puntoclub-api` ni user flows en `Default Directory`.
- Crear apps ahi produciria `issuer`, `audience`, redirects y metadata incorrectos para External ID/CIAM.

## Valores publicos disponibles

Disponibles:

- Web publicada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Redirect publicado esperado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
- Logout/home esperado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Redirects locales recomendados:
  - `http://localhost:5173/auth/callback`
  - `http://127.0.0.1:4173/auth/callback`
  - `http://127.0.0.1:4175/auth/callback`

No disponibles todavia:

- External tenant name.
- External tenant ID.
- Tenant subdomain CIAM.
- Metadata URL `.well-known/openid-configuration`.
- `issuer`.
- `jwks_uri`.
- `puntoclub-web` client ID.
- `puntoclub-api` client ID.
- Application ID URI.
- Scope completo.
- User flow/policy sign-up/sign-in.

## Pasos exactos para Product Owner

1. Entrar a `https://entra.microsoft.com/`.
2. Abrir el selector de directorio/tenant.
3. Crear o seleccionar un external tenant de clientes para Punto Club.
4. Confirmar que el directorio activo ya no sea `Default Directory`.
5. En el external tenant, crear app registration SPA:
   - Nombre: `puntoclub-web`
   - Platform: `Single-page application`
   - Redirects:
     - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
     - `http://localhost:5173/auth/callback`
     - `http://127.0.0.1:4173/auth/callback`
     - `http://127.0.0.1:4175/auth/callback`
   - Logout/home:
     - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
6. En el mismo external tenant, crear app/API:
   - Nombre: `puntoclub-api`
   - Application ID URI recomendado: `api://<puntoclub-api-client-id>`
   - Scope delegado: `access_as_user`
7. Dar permiso a `puntoclub-web` para llamar `puntoclub-api/access_as_user`.
8. Crear user flow sign-up/sign-in:
   - Metodo: email/password.
   - Asociar `puntoclub-web`.
9. Ejecutar `Run user flow` con una cuenta controlada.
10. Obtener metadata OIDC:
   - `https://<tenant-subdomain>.ciamlogin.com/<tenant-id-or-domain>/v2.0/.well-known/openid-configuration`
11. Confirmar que la metadata responde `200` y que `issuer`/`jwks_uri` usan `ciamlogin.com`.

## Bloque de valores que Product Owner debe devolver

Copiar solo valores publicos/no secretos:

```text
EXTERNAL_TENANT_NAME=
EXTERNAL_TENANT_ID=
TENANT_SUBDOMAIN=
CIAM_BASE_URL=https://<tenant-subdomain>.ciamlogin.com

PUNTOCLUB_WEB_CLIENT_ID=
PUNTOCLUB_API_CLIENT_ID=
PUNTOCLUB_API_APPLICATION_ID_URI=api://<puntoclub-api-client-id>
PUNTOCLUB_API_SCOPE=api://<puntoclub-api-client-id>/access_as_user

OIDC_METADATA_URL=
OIDC_ISSUER=
OIDC_JWKS_URI=

USER_FLOW_NAME=

REDIRECT_URI_PROD=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
POST_LOGOUT_REDIRECT_URI_PROD=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
REDIRECT_URI_LOCAL=http://localhost:5173/auth/callback
REDIRECT_URI_PREVIEW=http://127.0.0.1:4173/auth/callback
REDIRECT_URI_ALT_PREVIEW=http://127.0.0.1:4175/auth/callback
```

No copiar:

- Passwords.
- Client secrets.
- Access tokens.
- Refresh tokens.
- Session cookies.
- Connection strings.
- Capturas que muestren secretos.

## Valores previstos para Backend/API

No configurar todavia. Cuando el external tenant y la metadata esten validados:

```text
AUTH_PROVIDER=entra_external_id
AUTH_TENANT_ID=<external-tenant-id>
AUTH_ISSUER=<issuer desde metadata OIDC>
AUTH_JWKS_URI=<jwks_uri desde metadata OIDC>
AUTH_AUDIENCE=<audience confirmado contra access token real>
AUTH_CLIENT_ID=<puntoclub-web client id>
```

Nota:

- `AUTH_AUDIENCE` debe confirmarse contra el claim `aud` de un access token real para `puntoclub-api`.
- No activar auth estricta hasta que Backend/API implemente y pruebe validacion JWT.

## Valores previstos para Web Dev

No configurar todavia. Cuando el external tenant y las apps esten confirmados:

```text
PUBLIC_AUTH_CLIENT_ID=<puntoclub-web client id>
PUBLIC_AUTH_AUTHORITY=https://<tenant-subdomain>.ciamlogin.com/<tenant-id-or-domain>
PUBLIC_AUTH_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
PUBLIC_AUTH_SCOPES=openid profile email api://<puntoclub-api-client-id>/access_as_user
PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Referencias Microsoft revisadas

- Microsoft Learn: Microsoft Entra External ID en external tenants se usa para experiencias CIAM/customer-facing.
- Microsoft Learn: el external tenant contiene apps, user flows y cuentas de cliente.
- Microsoft Learn: un user flow define sign-up/sign-in y metodos como email/password.
- Microsoft Learn: el test de user flow usa metadata con `ciamlogin.com` y Application ID URI para API.

## Seguridad

- No se imprimieron secretos.
- No se leyeron client secrets.
- No se configuraron secrets.
- No se crearon apps en `Default Directory`.
- No se configuraron app settings `AUTH_*` con valores inferidos.

## Riesgos

- P1: Crear apps en `Default Directory` bloquearia la integracion correcta de External ID.
- P1: Configurar Backend/API con issuer/audience inferidos podria aceptar o rechazar tokens incorrectamente.
- P1: `Crear acceso`, login y password productivos siguen bloqueados hasta completar External ID.
- P2: La metadata OIDC debe validarse desde `.well-known/openid-configuration`; no debe inferirse a mano.

## Siguiente accion requerida

Product Owner debe crear o seleccionar el external tenant de clientes y devolver el bloque de valores publicos.

Con esos valores, Infra puede validar metadata OIDC y entregar a Backend/API y Web Dev los valores finales seguros para TASK-157/TASK-158.
