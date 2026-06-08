# TASK-130 - Handoff Infra / Azure

## Resumen

Se reviso la configuracion disponible para Microsoft Entra External ID de Punto Club y no se crearon recursos de identidad.

Motivo: la sesion Azure actual apunta al tenant `a50d6327-9af1-45f4-ab3e-4a931f70e318`, display name `Default Directory`, `tenantType=AAD`, con dominio inicial `pj13erosbusinessoutlook.onmicrosoft.com`. Ese contexto no evidencia ser el tenant externo de clientes de Punto Club. Crear `puntoclub-web`, `puntoclub-api` o user flows ahi dejaria Web/API apuntando a una autoridad incorrecta.

## Estado

- External tenant para clientes: pendiente/manual.
- App SPA/SWA `puntoclub-web`: no creada.
- App/API `puntoclub-api`: no creada.
- User flow sign-up/sign-in email/password: no creado.
- Redirect URIs: no configurados en Entra porque no hay app confirmada.
- Function App auth settings: no configurados porque no hay valores confirmados.

## Validaciones realizadas

- Se leyeron metadatos de Azure de la suscripcion activa:
  - Subscription: `as_main`
  - Subscription ID: `ea1a3068-3abc-425a-ad65-53be62bdf0c6`
  - Tenant ID activo: `a50d6327-9af1-45f4-ab3e-4a931f70e318`
  - Usuario: `pj13eros_business@outlook.com`
- Se leyeron metadatos no sensibles del tenant Entra actual:
  - Display name: `Default Directory`
  - Tenant type: `AAD`
  - Dominio inicial: `pj13erosbusinessoutlook.onmicrosoft.com`
- Se verifico que no existen app registrations con nombre exacto:
  - `puntoclub-web`
  - `puntoclub-api`
- Se verificaron solo los nombres de app settings actuales de `func-puntoclub-prod-br-001`.
- No se imprimieron secretos, tokens, connection strings ni passwords.

## App settings

No se configuraron app settings nuevos de auth.

Settings de auth que deben configurarse solo cuando el tenant externo y las apps esten confirmados:

- `AUTH_PROVIDER=entra_external_id`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_JWKS_URI`
- `AUTH_TENANT_ID`
- `AUTH_CLIENT_ID`

Settings existentes observados por nombre en la Function App:

- `PILOT_COMPANY_ID`
- `APPLICATIONINSIGHTS_CONNECTION_STRING`
- `FUNCTIONS_WORKER_RUNTIME`
- `SQL_CONNECTION_STRING`
- `AzureWebJobsStorage`
- `ACS_EMAIL_CONNECTION_STRING`
- `ACS_EMAIL_SENDER_ADDRESS`
- `ACS_EMAIL_SENDER_DISPLAY_NAME`
- `INTERNAL_NOTIFICATION_EMAIL`
- `APP_PUBLIC_BASE_URL`
- `INVITE_TOKEN_SECRET`
- `LOGO_STORAGE_ACCOUNT`
- `LOGO_CONTAINER`
- `LOGO_MAX_BYTES`
- `LOGO_ALLOWED_MIME_TYPES`
- `LOGO_SERVE_MODE`

## Pasos manuales pendientes

Product Owner o Infra con permisos de identidad debe:

1. Entrar a Microsoft Entra admin center y crear o seleccionar el external tenant de clientes para Punto Club.
2. Cambiar el directorio activo al external tenant antes de crear apps. Este paso es critico porque las app registrations no se pueden mover entre tenants despues de creadas.
3. Crear la app registration SPA/SWA:
   - Nombre: `puntoclub-web`
   - Tipo: Single Page Application
   - Redirect URIs:
     - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
     - `http://localhost:5173/auth/callback`
     - `http://127.0.0.1:4173/auth/callback`
     - `http://127.0.0.1:4175/auth/callback`
   - Post logout/home recomendado:
     - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
4. Crear la app/API:
   - Nombre: `puntoclub-api`
   - Application ID URI recomendado: `api://<puntoclub-api-client-id>`
   - Scope delegado recomendado: `access_as_user`
5. Autorizar `puntoclub-web` para solicitar el scope de `puntoclub-api`.
6. Crear user flow sign-up/sign-in con email/password.
7. Asociar `puntoclub-web` al user flow.
8. Ejecutar prueba de user flow con una cuenta controlada distinta al admin del tenant.
9. Obtener la metadata OIDC publica y confirmar que responde 200:
   - `https://<tenant-subdomain>.ciamlogin.com/<tenant-id>/v2.0/.well-known/openid-configuration`
10. Copiar los valores seguros necesarios al handoff de Backend/Web:
    - Tenant ID del external tenant.
    - Tenant subdomain.
    - `puntoclub-web` Application/Client ID.
    - `puntoclub-api` Application/Client ID o audience final.
    - Issuer exacto devuelto por la metadata OIDC.
    - JWKS URI exacto devuelto por la metadata OIDC.
    - Authority/base URL para MSAL.

## Config publica para Web Dev

Pendiente de valores reales. Cuando el tenant este creado, Web Dev deberia recibir:

- `PUBLIC_AUTH_CLIENT_ID=<puntoclub-web-client-id>`
- `PUBLIC_AUTH_AUTHORITY=https://<tenant-subdomain>.ciamlogin.com/<tenant-id-or-domain>`
- `PUBLIC_AUTH_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
- `PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI=https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
- `PUBLIC_AUTH_SCOPES=openid profile email api://<puntoclub-api-client-id>/access_as_user`
- `PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api`

## Referencias revisadas

- Microsoft Learn: External ID requiere un external tenant antes de configurar sign-in para clientes.
- Microsoft Learn: las app registrations se crean dentro del tenant seleccionado y no se pueden mover entre tenants.
- Microsoft Learn: una aplicacion debe estar registrada en el external tenant y asociada al user flow para activar sign-up/sign-in.
- Microsoft Learn: para proteger una API se exponen scopes con forma `resourceURI/scopeName`, con `api://<clientId>` como URI recomendado por defecto.

## Riesgos

- P1: Auth multiempresa sigue bloqueada hasta crear y validar el external tenant real.
- P1: No configurar Backend/API con issuer de `login.microsoftonline.com` si se usara Entra External ID de clientes; debe validarse contra la metadata OIDC del tenant CIAM.
- P1: No crear apps en `Default Directory` salvo decision explicita de arquitectura; seria dificil de corregir porque las apps no se mueven entre tenants.
- P1: No activar endpoints internos de aprobacion sin auth real o feature flag controlado.
- P2: La URL exacta de issuer/JWKS debe copiarse desde `.well-known/openid-configuration`, no inferirse a mano.

## Impacto de no cambiar configuracion

No hubo cambios en cloud ni pipeline para identidad. La Function App conserva su estado actual y Backend/Web pueden seguir trabajando contra feature flags o auth pendiente, pero no tienen todavia valores reales para implementar login productivo.
