Equipo:
Infra / Azure

Tarea completada:
TASK-127 - Crear recursos Azure aprobados para multiempresa piloto.

Archivos cambiados:
- `tasks/TASK-127-HANDOFF.md`

Estado:
- Completado parcialmente con recursos Azure base creados/configurados.
- ACS Email creado y vinculado.
- Storage privado de logos creado.
- Managed Identity de Function App habilitada y autorizada para storage de logos.
- App settings base de email/logos configurados por nombre, sin imprimir valores.
- Microsoft Entra External ID queda pendiente/manual porque requiere configuracion de tenant/app/user flow en Portal o tarea dedicada con permisos de identidad.

No se hizo:
- No se implemento Backend/API.
- No se implemento Frontend.
- No se aplico SQL.
- No se enviaron invitaciones reales a empresas externas.
- No se imprimieron connection strings, secrets, tokens ni valores sensibles.

Contexto revisado:
- `AGENTS.md`
- `chat-start/INFRA.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-127-assignment.md`
- `tasks/TASK-126-HANDOFF.md`
- Documentacion Azure/Microsoft Learn para ACS Email, Entra External ID y Blob Storage.

Recursos creados/configurados:

## ACS Email

- Email Communication Service:
  - Nombre: `email-puntoclub-prod-001`
  - Tipo: `Microsoft.Communication/EmailServices`
  - Location: `global`
  - Data location: `unitedstates`
  - Provisioning: `Succeeded`

- Azure Managed Domain:
  - Recurso: `email-puntoclub-prod-001/AzureManagedDomain`
  - Tipo: `Microsoft.Communication/EmailServices/Domains`
  - Domain management: `AzureManaged`
  - Provisioning: `Succeeded`
  - Sender domain: `f498d337-b16d-4f08-a895-611680362680.azurecomm.net`
  - Verificaciones:
    - Domain: `Verified`
    - SPF: `Verified`
    - DKIM: `Verified`
    - DKIM2: `Verified`
    - DMARC: `Verified`

- Azure Communication Services:
  - Nombre: `acs-puntoclub-prod-001`
  - Tipo: `Microsoft.Communication/CommunicationServices`
  - Location: `global`
  - Data location: `unitedstates`
  - Host: `acs-puntoclub-prod-001.unitedstates.communication.azure.com`
  - Linked domain:
    - `email-puntoclub-prod-001/AzureManagedDomain`
  - Provisioning: `Succeeded`

Valores publicos seguros:
- Sender address inicial configurado:
  - `DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net`
- Display name configurado:
  - `Punto Club`
- Notificacion interna configurada:
  - `pj13eros_business@outlook.com`

Notas:
- La connection string de ACS se configuro en Function App, pero no se imprimio.
- No se envio email de prueba desde esta tarea para evitar notificaciones no solicitadas. Backend/API puede hacer prueba controlada cuando implemente integracion.

## Blob Storage logos

- Storage account:
  - Nombre: `stpuntoclublogosbr001`
  - Tipo: `StorageV2`
  - SKU: `Standard_LRS`
  - Region: `brazilsouth`
  - HTTPS only: `true`
  - Minimum TLS: `TLS1_2`
  - Public blob access: `false`

- Container:
  - Nombre: `company-logos`
  - Public access: `off` / `null`
  - Lease state: `available`
  - Immutability policy: `false`

- Function App Managed Identity:
  - Function App: `func-puntoclub-prod-br-001`
  - Identity type: `SystemAssigned`
  - Principal ID: `33a788be-2637-4b8c-a780-16c47d72d8b4`

- Role assignment:
  - Principal: `33a788be-2637-4b8c-a780-16c47d72d8b4`
  - Role: `Storage Blob Data Contributor`
  - Scope: `/subscriptions/ea1a3068-3abc-425a-ad65-53be62bdf0c6/resourceGroups/resource_group_main/providers/Microsoft.Storage/storageAccounts/stpuntoclublogosbr001`

## App settings configurados

Function App:
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

Valores no sensibles configurados:
- `ACS_EMAIL_SENDER_ADDRESS=DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net`
- `ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club`
- `INTERNAL_NOTIFICATION_EMAIL=pj13eros_business@outlook.com`
- `APP_PUBLIC_BASE_URL=https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- `LOGO_STORAGE_ACCOUNT=stpuntoclublogosbr001`
- `LOGO_CONTAINER=company-logos`
- `LOGO_MAX_BYTES=1048576`
- `LOGO_ALLOWED_MIME_TYPES=image/png,image/jpeg,image/webp`
- `LOGO_SERVE_MODE=api`

Valores sensibles configurados sin imprimir:
- `ACS_EMAIL_CONNECTION_STRING`
- `INVITE_TOKEN_SECRET`

App settings existentes preservados:
- `APPLICATIONINSIGHTS_CONNECTION_STRING`
- `AzureWebJobsStorage`
- `FUNCTIONS_EXTENSION_VERSION`
- `FUNCTIONS_WORKER_RUNTIME`
- `PILOT_COMPANY_ID`
- `SCM_DO_BUILD_DURING_DEPLOYMENT`
- `SQL_CONNECTION_STRING`
- `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`
- `WEBSITE_CONTENTSHARE`

## Entra External ID

Estado:
- Pendiente/manual.

Motivo:
- La creacion/configuracion de Microsoft Entra External ID implica tenant externo, app registrations, user flow, redirect URIs y permisos de identidad que conviene hacer en Portal o en una tarea dedicada con permisos claros de Entra.
- No se crearon apps ni user flows en esta tarea para evitar configurar identidad incompleta o en el tenant equivocado.

Configuracion pendiente:
- External tenant para Punto Club.
- App SPA/SWA: `puntoclub-web`.
- API/audience: `puntoclub-api`.
- User flow sign-up/sign-in con email/password.
- Redirects:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
  - `http://localhost:5173/auth/callback`
  - `http://127.0.0.1:4173/auth/callback`
  - `http://127.0.0.1:4175/auth/callback`
- Valores a configurar despues en Function App:
  - `AUTH_PROVIDER=entra_external_id`
  - `AUTH_ISSUER`
  - `AUTH_AUDIENCE`
  - `AUTH_JWKS_URI`
  - `AUTH_TENANT_ID`
  - `AUTH_CLIENT_ID`
- Valores publicos a coordinar con Web:
  - `PUBLIC_AUTH_CLIENT_ID`
  - `PUBLIC_AUTH_AUTHORITY`
  - `PUBLIC_AUTH_REDIRECT_URI`
  - `PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI`

Pruebas/verificaciones realizadas:
- Inventario previo de recursos `Microsoft.Communication` para evitar reutilizar `puntoevento-*`.
- Verificacion de que `stpuntoclublogosbr001` no existia antes.
- Creacion de storage dedicado `stpuntoclublogosbr001`.
- Creacion de container privado `company-logos`.
- Verificacion de `allowBlobPublicAccess=false`.
- Verificacion de container privado con `publicAccess=null`.
- Habilitacion/verificacion de Managed Identity en `func-puntoclub-prod-br-001`.
- Asignacion/verificacion de rol `Storage Blob Data Contributor`.
- Creacion/verificacion de:
  - `email-puntoclub-prod-001`
  - `email-puntoclub-prod-001/AzureManagedDomain`
  - `acs-puntoclub-prod-001`
- Verificacion de dominio Azure Managed en `Succeeded` y DNS auth `Verified`.
- Configuracion/verificacion de app settings por nombre, sin valores.

Riesgos:
- P1: Entra External ID pendiente; endpoints reales de acceso/password no deben ir a produccion hasta configurar y validar auth.
- P1: Backend/API debe validar MIME/tamano de logos server-side; storage privado por si solo no evita archivos invalidos.
- P1: No usar `companyId` del frontend como autoridad; debe venir de JWT + mapeo SQL.
- P1: No loggear token de invitacion ni links completos con token.
- P2: Azure Managed Domain es aceptado para piloto, pero se recomienda dominio propio antes de uso comercial mas amplio.
- P2: No se envio email de prueba; integracion real debe validar envio controlado y errores ACS.
- P2: Role assignment se dio a nivel storage account; si se requiere alcance minimo estricto, se puede bajar a scope de container en tarea separada.

Pasos siguientes:
1. Product/Infra configura Entra External ID en Portal o tarea dedicada.
2. SQL DEV aplica migracion TASK-128 cuando corresponda.
3. Backend/API TASK-129 puede usar:
   - ACS settings existentes para email cuando implemente envio.
   - Blob settings existentes para logo upload.
   - Entra settings solo cuando se complete la configuracion manual.
4. QA debe validar que:
   - no hay public blob access;
   - email de prueba llega a cuenta controlada;
   - API rechaza upload invalido;
   - auth rechaza tokens invalidos y mapea empresa correctamente.
