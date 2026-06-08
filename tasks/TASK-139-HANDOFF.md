# TASK-139 - Handoff Infra / Azure

## Resumen

Se reviso TASK-139 usando como base `tasks/TASK-135-HANDOFF.md` y `tasks/TASK-130-HANDOFF.md`.

Estado: bloqueada por intervencion manual del Product Owner.

Motivo: no se recibio confirmacion de que exista un external tenant de clientes para Punto Club ni valores publicos del portal de Microsoft Entra. Sin ese tenant confirmado, no se deben crear app registrations ni configurar auth en Backend/API o Web.

No se hicieron cambios en Azure, Function App, Static Web Apps, pipeline ni secretos.

## Paso exacto donde se detuvo

TASK-139 se detiene en el paso 2 de la guia TASK-135:

1. Product Owner debe entrar a `https://entra.microsoft.com/`.
2. Debe crear o seleccionar el external tenant de clientes de Punto Club.
3. Debe confirmar que el directorio activo ya no es `Default Directory`.
4. Solo despues debe crear `puntoclub-web`, `puntoclub-api` y el user flow.

Regla critica:

- No crear `puntoclub-web`, `puntoclub-api` ni user flows en `Default Directory` salvo decision explicita de Product / Architect / Release.

## Valores pendientes de recibir

Product Owner debe copiar solo estos valores publicos:

- External tenant name.
- External tenant ID.
- Tenant subdomain.
- `puntoclub-web` Application/Client ID.
- `puntoclub-api` Application/Client ID.
- Application ID URI.
- Scope completo.
- Metadata URL `.well-known/openid-configuration`.
- `issuer`.
- `jwks_uri`.
- Redirect URIs configurados.
- User flow name.

No copiar ni enviar:

- Passwords.
- Client secrets.
- Access tokens.
- Refresh tokens.
- Session cookies.
- Connection strings.
- Capturas con secretos.

## Formato recomendado para entregar valores

Cuando el Product Owner complete la configuracion manual, puede entregar este bloque con valores reales no secretos:

```text
EXTERNAL_TENANT_NAME=
EXTERNAL_TENANT_ID=
TENANT_SUBDOMAIN=
CIAM_BASE_URL=https://<tenant-subdomain>.ciamlogin.com

PUNTOCLUB_WEB_CLIENT_ID=
PUNTOCLUB_API_CLIENT_ID=
PUNTOCLUB_API_APPLICATION_ID_URI=api://<puntoclub-api-client-id>
PUNTOCLUB_API_SCOPE=api://<puntoclub-api-client-id>/access_as_user

OIDC_METADATA_URL=https://<tenant-subdomain>.ciamlogin.com/<tenant-id>/v2.0/.well-known/openid-configuration
OIDC_ISSUER=
OIDC_JWKS_URI=

USER_FLOW_NAME=

REDIRECT_URI_PROD=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
POST_LOGOUT_REDIRECT_URI_PROD=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
REDIRECT_URI_LOCAL=http://localhost:5173/auth/callback
REDIRECT_URI_PREVIEW=http://127.0.0.1:4173/auth/callback
REDIRECT_URI_ALT_PREVIEW=http://127.0.0.1:4175/auth/callback
```

## Validacion OIDC requerida

Cuando se reciba `OIDC_METADATA_URL`, Infra debe validar:

- La URL responde HTTP `200`.
- El JSON incluye `issuer`.
- El JSON incluye `jwks_uri`.
- `issuer` usa `ciamlogin.com`.
- `jwks_uri` pertenece al mismo tenant/subdominio.
- La metadata no apunta a `Default Directory`.

Comando de validacion sugerido, sin secretos:

```powershell
$metadata = Invoke-RestMethod -Uri '<OIDC_METADATA_URL>' -Method GET
$metadata.issuer
$metadata.jwks_uri
```

## Valores que se prepararan para Backend/API

No configurar todavia. Cuando la metadata este validada, estos seran los app settings esperados:

```text
AUTH_PROVIDER=entra_external_id
AUTH_TENANT_ID=<external-tenant-id>
AUTH_ISSUER=<issuer desde metadata OIDC>
AUTH_JWKS_URI=<jwks_uri desde metadata OIDC>
AUTH_AUDIENCE=<audience confirmado con access token real>
AUTH_CLIENT_ID=<puntoclub-web client id>
```

Nota:

- `AUTH_AUDIENCE` debe confirmarse contra el claim `aud` de un access token real emitido para `puntoclub-api`.
- No activar auth estricta hasta que Backend/API implemente y pruebe validacion de JWT.

## Valores que se prepararan para Web Dev

No configurar todavia. Cuando el tenant/apps/user flow esten confirmados, Web Dev puede usar:

```text
PUBLIC_AUTH_CLIENT_ID=<puntoclub-web client id>
PUBLIC_AUTH_AUTHORITY=https://<tenant-subdomain>.ciamlogin.com/<tenant-id>
PUBLIC_AUTH_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
PUBLIC_AUTH_SCOPES=openid profile email api://<puntoclub-api-client-id>/access_as_user
PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Referencias Microsoft revisadas

- Microsoft Learn: los escenarios CIAM usan external tenants separados para apps orientadas a clientes.
- Microsoft Learn: el external tenant es donde se registran apps, se crean user flows y se administran usuarios de cliente.
- Microsoft Learn: para crear el external tenant se debe usar Microsoft Entra admin center, elegir tenant tipo `External`, y luego cambiar al directorio externo.
- Microsoft Learn: el tenant name, tenant ID y primary domain se obtienen desde el overview del external tenant.

## Riesgos

- P1: Crear apps en `Default Directory` dejaria `issuer`, `audience` y user flows incorrectos.
- P1: Configurar Backend/API con metadata no validada puede aceptar o rechazar tokens de forma incorrecta.
- P1: Copiar tokens, secrets o cookies en handoffs compromete la seguridad del piloto.
- P2: El audience exacto debe validarse con token real antes de activar proteccion JWT.
- P2: Los redirects locales son utiles para desarrollo, pero deben revisarse antes de un endurecimiento productivo mas amplio.

## Siguiente accion

Product Owner debe completar la configuracion manual en el portal siguiendo `tasks/TASK-135-HANDOFF.md` y devolver solo el bloque de valores publicos de este handoff.

Con esos valores, Infra puede validar `.well-known/openid-configuration` y preparar un siguiente handoff para Backend/API y Web Dev.
