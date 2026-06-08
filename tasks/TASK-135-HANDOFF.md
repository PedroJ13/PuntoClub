# TASK-135 - Handoff Infra / Azure

## Resumen

Se preparo una guia manual para configurar Microsoft Entra External ID de Punto Club y entregar valores publicos seguros a Backend/API y Web Dev.

No se hicieron cambios en Azure, Function App, Static Web Apps, pipeline ni secretos. Esta tarea es una guia operativa porque TASK-130 confirmo que la sesion actual esta en `Default Directory` (`tenantType=AAD`) y no conviene crear apps ahi sin confirmar el external tenant correcto.

## Regla critica

No usar `Default Directory` para `puntoclub-web`, `puntoclub-api` ni user flows salvo decision explicita de Product / Architect / Release.

Las app registrations quedan atadas al tenant donde se crean y no se deben crear en el directorio equivocado. Antes de crear cualquier app, el portal debe mostrar el external tenant de clientes de Punto Club.

## Prerrequisitos

- Acceso a [Microsoft Entra admin center](https://entra.microsoft.com/).
- Permisos para crear o administrar external tenants.
- Permisos de app registration en el external tenant.
- Tener a mano estas URLs de Punto Club:
  - Web publicada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
  - Callback publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
  - API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

## Paso 1 - Crear o seleccionar external tenant

1. Entrar a `https://entra.microsoft.com/`.
2. Ir a `Entra ID` > `Overview` > `Manage tenants`.
3. Si no existe un tenant externo para Punto Club:
   - Seleccionar `Create`.
   - Elegir tenant tipo `External`.
   - Usar un nombre reconocible, por ejemplo `Punto Club External`.
   - Usar un subdominio reconocible, por ejemplo `puntoclub` si esta disponible.
4. Si ya existe:
   - Usar el selector de directorios del portal.
   - Cambiar al external tenant correcto.
5. Confirmar que el portal ya no muestra `Default Directory` como directorio activo.

Datos a copiar:

- Nombre del external tenant.
- Directory/Tenant ID.
- Tenant primary domain o subdomain.
- Dominio CIAM esperado: `https://<tenant-subdomain>.ciamlogin.com`.

## Paso 2 - Crear app SPA `puntoclub-web`

1. Dentro del external tenant, ir a `Entra ID` > `App registrations`.
2. Seleccionar `New registration`.
3. Nombre: `puntoclub-web`.
4. Supported account types: usar el valor recomendado por el portal para el external tenant/customer apps.
5. Redirect URI:
   - Platform: `Single-page application (SPA)`.
   - URI inicial: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`.
6. Crear la app.
7. En `Authentication`, agregar tambien estos redirect URIs:
   - `http://localhost:5173/auth/callback`
   - `http://127.0.0.1:4173/auth/callback`
   - `http://127.0.0.1:4175/auth/callback`
8. Si el portal permite logout URL o front-channel logout URL, usar:
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
9. Guardar cambios.

Datos a copiar:

- `puntoclub-web` Application/Client ID.
- Redirect URIs configurados.

No copiar:

- Client secrets. La SPA no debe usar secretos.

## Paso 3 - Crear app/API `puntoclub-api`

1. En el mismo external tenant, ir a `Entra ID` > `App registrations`.
2. Seleccionar `New registration`.
3. Nombre: `puntoclub-api`.
4. Crear la app.
5. Abrir `Expose an API`.
6. Configurar Application ID URI. Recomendado:
   - `api://<puntoclub-api-client-id>`
7. Crear scope delegado:
   - Scope name: `access_as_user`
   - Who can consent: usar admin consent si el portal lo requiere para external tenants.
   - Admin consent display name: `Access Punto Club API`
   - Admin consent description: `Allows Punto Club web app to call Punto Club API as the signed-in user.`
   - State: `Enabled`
8. Guardar cambios.

Datos a copiar:

- `puntoclub-api` Application/Client ID.
- Application ID URI final.
- Scope completo:
  - `api://<puntoclub-api-client-id>/access_as_user`

## Paso 4 - Autorizar `puntoclub-web` para llamar `puntoclub-api`

1. Abrir app registration `puntoclub-web`.
2. Ir a `API permissions`.
3. Seleccionar `Add a permission`.
4. Elegir `My APIs`.
5. Seleccionar `puntoclub-api`.
6. Elegir delegated permission:
   - `access_as_user`
7. Agregar permiso.
8. Si el portal lo solicita, conceder admin consent.

Dato a confirmar:

- `puntoclub-web` tiene permiso delegado a `puntoclub-api/access_as_user`.

## Paso 5 - Crear user flow sign-up/sign-in

1. En el external tenant, ir a `Entra ID` > `External Identities` > `User flows`.
2. Crear un nuevo user flow de tipo sign-up/sign-in.
3. Nombre recomendado:
   - `PuntoClub_SignUpSignIn`
4. Sign-in method:
   - `Email with password`
5. Habilitar password reset si el portal lo ofrece en el flujo.
6. Atributos minimos recomendados:
   - Email address.
   - Given name.
   - Surname.
7. Claims minimos recomendados para token:
   - Email.
   - Given name.
   - Surname.
   - Object ID / Subject.
8. Crear el user flow.

Dato a copiar:

- Nombre exacto del user flow.

## Paso 6 - Asociar app al user flow

1. Abrir el user flow `PuntoClub_SignUpSignIn`.
2. Ir a `Applications`.
3. Agregar `puntoclub-web`.
4. Confirmar que la app queda listada en el user flow.

Dato a confirmar:

- `puntoclub-web` esta asociado al user flow.

## Paso 7 - Probar user flow en portal

1. Abrir el user flow.
2. Seleccionar `Run user flow`.
3. Application: `puntoclub-web`.
4. Reply URL: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`.
5. Ejecutar prueba con una cuenta controlada que no sea la cuenta admin del tenant.
6. Confirmar que el flujo muestra registro/login con email/password.

No crear usuarios reales de empresas externas en esta prueba. Usar una cuenta de prueba controlada.

## Paso 8 - Obtener metadata OIDC

Construir esta URL con los valores del external tenant:

```text
https://<tenant-subdomain>.ciamlogin.com/<tenant-id>/v2.0/.well-known/openid-configuration
```

Ejemplo de forma, no valor real:

```text
https://puntoclub.ciamlogin.com/00000000-0000-0000-0000-000000000000/v2.0/.well-known/openid-configuration
```

Abrir la URL en el navegador. Debe responder JSON.

Valores a copiar desde el JSON:

- `issuer`
- `jwks_uri`
- `authorization_endpoint`
- `token_endpoint`

Validacion esperada:

- La URL responde 200.
- `issuer` usa `ciamlogin.com`.
- `jwks_uri` usa el mismo tenant externo.
- No aparece `login.microsoftonline.com` como issuer principal para esta configuracion de clientes.

## Paso 9 - Valores publicos para Backend/API

Entregar a Backend/API o Infra estos valores:

```text
AUTH_PROVIDER=entra_external_id
AUTH_TENANT_ID=<external-tenant-id>
AUTH_ISSUER=<issuer desde openid-configuration>
AUTH_JWKS_URI=<jwks_uri desde openid-configuration>
AUTH_AUDIENCE=<puntoclub-api Application ID URI o client ID acordado>
AUTH_CLIENT_ID=<puntoclub-web Application/Client ID>
```

Nota para Backend/API:

- `AUTH_AUDIENCE` debe coincidir con el claim `aud` esperado en access tokens reales.
- Si MSAL emite access tokens para `api://<puntoclub-api-client-id>`, usar ese audience.
- Confirmar con una prueba de token antes de activar proteccion estricta.

## Paso 10 - Valores publicos para Web Dev

Entregar a Web Dev:

```text
PUBLIC_AUTH_CLIENT_ID=<puntoclub-web Application/Client ID>
PUBLIC_AUTH_AUTHORITY=https://<tenant-subdomain>.ciamlogin.com/<tenant-id>
PUBLIC_AUTH_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback
PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/
PUBLIC_AUTH_SCOPES=openid profile email api://<puntoclub-api-client-id>/access_as_user
PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

Tambien entregar para local:

```text
LOCAL_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
LOCAL_PREVIEW_AUTH_REDIRECT_URI=http://127.0.0.1:4173/auth/callback
LOCAL_ALT_PREVIEW_AUTH_REDIRECT_URI=http://127.0.0.1:4175/auth/callback
```

## Checklist de entrega segura

Copiar y pegar solo estos valores:

- External tenant name.
- External tenant ID.
- Tenant subdomain.
- `puntoclub-web` client ID.
- `puntoclub-api` client ID.
- Application ID URI.
- Scope completo.
- `issuer`.
- `jwks_uri`.
- Metadata URL `.well-known/openid-configuration`.
- Redirect URIs configurados.
- User flow name.

No copiar ni guardar:

- Passwords.
- Client secrets.
- Tokens.
- Refresh tokens.
- Session cookies.
- Connection strings.
- Capturas que muestren secretos.

## Bloqueos si algo no aparece

- Si el portal solo muestra `Default Directory`, detenerse y no crear apps.
- Si no aparece opcion `External` al crear tenant, falta permiso o tipo de cuenta adecuado.
- Si no se puede crear app registration, falta rol de Application Developer o permiso equivalente.
- Si no aparece `External Identities > User flows`, probablemente no estas en el external tenant correcto.
- Si `.well-known/openid-configuration` no responde 200, no configurar Backend/API todavia.
- Si el `issuer` no usa el tenant externo esperado, no configurar Backend/API todavia.

## Riesgos

- P1: Crear apps en `Default Directory` dejaria valores incorrectos y bloquearia auth real.
- P1: Activar endpoints internos con tokens no validados puede exponer aprobacion/rechazo de empresas.
- P1: Copiar tokens o secretos en handoffs viola la regla de seguridad del proyecto.
- P2: El audience exacto debe validarse con un token real antes de cerrar Backend/API.
- P2: Los redirects locales deben retirarse o revisarse antes de endurecimiento productivo mas amplio.

## Referencias Microsoft revisadas

- Microsoft Learn: Microsoft Entra External ID in external tenants.
- Microsoft Learn: Create an external tenant.
- Microsoft Learn: Register an application.
- Microsoft Learn: Create and test sign-up/sign-in user flows.
- Microsoft Learn: Add an application to a user flow.
- Microsoft Learn: Expose an API scope.
