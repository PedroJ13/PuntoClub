Equipo:
Infra / Azure

Tarea completada:
TASK-120 - Preparar habilitacion Azure para email, auth y logos.

Archivos cambiados:
- `tasks/TASK-120-HANDOFF.md`

Estado:
- Preparacion completada.
- No se crearon recursos.
- No se modificaron recursos Azure.
- No se configuraron secretos.
- No se cambiaron workflows, app settings, firewall, SKU ni servicios productivos.
- No se imprimieron secretos.

Contexto revisado:
- `AGENTS.md`
- `chat-start/INFRA.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASK-120-assignment.md`
- `tasks/TASK-119-HANDOFF.md`
- `tasks/TASK-114-HANDOFF.md`
- `tasks/TASK-116-HANDOFF.md`
- `tasks/TASK-115-HANDOFF.md`
- Documentacion Microsoft Learn de ACS Email, Entra External ID, Static Web Apps auth y Azure Blob Storage.

Estado Azure observado:
- No hay recursos Punto Club propios de Azure Communication Services.
- Existen recursos `puntoevento-*` de Microsoft.Communication en `resource_group_main`; no recomiendo reutilizarlos para Punto Club porque parecen pertenecer a otro producto/proyecto.
- Storage existente:
  - `stpuntoclubfuncbr001`: `StorageV2`, `Standard_LRS`, `brazilsouth`, HTTPS only, TLS 1.2, public blob access disabled.
  - `storagepuntoevento`: `StorageV2`, `Standard_LRS`, `eastus2`, public blob access enabled; no usar para Punto Club.
- Function App actual `func-puntoclub-prod-br-001` no tiene settings de ACS, Entra External ID ni logos.

Recomendacion final de recursos:

1. Email
   - Crear recursos propios de Punto Club:
     - Email Communication Service: `email-puntoclub-prod-001`
     - Azure Communication Services: `acs-puntoclub-prod-001`
   - Dominio:
     - Opcion piloto rapido: Azure Managed Domain.
     - Opcion recomendada para uso real: dominio propio verificado con SPF/DKIM.
   - Uso:
     - Invitaciones de empresa.
     - Notificacion interna a `pj13eros_business@outlook.com`.
   - No usar Outlook/SMTP con credenciales personales.

2. Auth / password
   - Crear/usar Microsoft Entra External ID external tenant para clientes/empresas.
   - Registrar aplicaciones:
     - SPA/SWA client: `puntoclub-web`
     - API audience/scope: `puntoclub-api`
   - Crear user flow de sign-up/sign-in con email/password.
   - La API debe validar JWT contra issuer/audience/JWKS y mapear usuario autenticado a `CompanyUsers` en SQL.
   - El frontend nunca debe ser fuente confiable de `companyId`.

3. Logo upload
   - Recomendacion principal: storage dedicado para logos:
     - Storage account sugerido: `stpuntoclublogosbr001`
     - Region: `brazilsouth`
     - SKU: `Standard_LRS`
     - Public blob access: disabled
     - HTTPS only, TLS 1.2 o superior
     - Container privado: `company-logos`
   - Opcion de menor friccion/costo: crear container privado `company-logos` en `stpuntoclubfuncbr001`.
   - Recomendacion Infra: usar storage dedicado si Product aprueba recurso nuevo; reutilizar `stpuntoclubfuncbr001` solo si se prioriza minimo costo y se acepta mezclar runtime storage con assets de producto.
   - Acceso:
     - Preferir upload via API.
     - Function App con Managed Identity y rol `Storage Blob Data Contributor` sobre el storage/container.
     - No habilitar public blob access.
     - Servir logo via API o SAS corto generado server-side.

App settings / secrets necesarios:

Function App `func-puntoclub-prod-br-001`:
- Email:
  - `ACS_EMAIL_CONNECTION_STRING` o credencial equivalente aprobada.
  - `ACS_EMAIL_SENDER_ADDRESS`
  - `ACS_EMAIL_REPLY_TO` opcional.
  - `INTERNAL_NOTIFICATION_EMAIL=pj13eros_business@outlook.com`
  - `APP_PUBLIC_BASE_URL=https://calm-dune-075dc5c0f.7.azurestaticapps.net`
  - `INVITE_TOKEN_SECRET`
- Auth:
  - `AUTH_PROVIDER=entra_external_id`
  - `AUTH_ISSUER`
  - `AUTH_AUDIENCE`
  - `AUTH_JWKS_URI`
  - `AUTH_TENANT_ID`
  - `AUTH_CLIENT_ID`
  - `AUTH_ALLOWED_CLOCK_SKEW_SECONDS` opcional.
- Logo storage:
  - `LOGO_STORAGE_ACCOUNT=stpuntoclublogosbr001` o `stpuntoclubfuncbr001`
  - `LOGO_CONTAINER=company-logos`
  - `LOGO_MAX_BYTES=1048576` o `2097152`
  - `LOGO_ALLOWED_MIME_TYPES=image/png,image/jpeg,image/webp`
  - `LOGO_SERVE_MODE=api` o `short_sas`
  - `LOGO_STORAGE_CONNECTION_STRING` solo si no se usa Managed Identity; no recomendado como primera opcion.
- Existentes que se mantienen:
  - `SQL_CONNECTION_STRING`
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`
  - `PILOT_COMPANY_ID` mientras conviva empresa piloto unica.

Static Web Apps / frontend:
- No guardar secretos en frontend.
- Public config necesaria:
  - `PUBLIC_API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api`
  - `PUBLIC_AUTH_CLIENT_ID`
  - `PUBLIC_AUTH_AUTHORITY`
  - `PUBLIC_AUTH_REDIRECT_URI`
  - `PUBLIC_AUTH_POST_LOGOUT_REDIRECT_URI`
- Nota importante:
  - El workflow actual sube `app/` sin build. Si se usan app settings de SWA para variables de frontend, Web Dev debe confirmar como se inyectaran en runtime/build. Si no hay build, usar archivo publico de configuracion no secreto o constantes versionadas.

URLs / redirects esperados:
- Frontend publicado:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Redirect URI recomendado para SPA:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
- Post logout redirect:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
- Desarrollo local sugerido:
  - `http://localhost:5173/auth/callback`
  - `http://127.0.0.1:4173/auth/callback`
  - `http://127.0.0.1:4175/auth/callback`
- API base:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Si se decide usar auth administrada de Static Web Apps en vez de MSAL directo:
  - definir proveedor OIDC custom en `staticwebapp.config.json`;
  - usar callback bajo rutas `/.auth/...` segun configuracion SWA;
  - Backend/API aun debe validar autorizacion por empresa server-side.

Pasos para ejecutar una vez aprobado:

Fase A - Aprobaciones previas
1. Product Owner aprueba crear recursos nuevos de email/auth/storage.
2. Product Owner decide dominio de email:
   - Azure Managed Domain para piloto rapido.
   - Dominio propio para uso real.
3. Product Owner confirma sender:
   - ejemplo para piloto: `DoNotReply@<azure-managed-domain>`
   - ejemplo real: `no-reply@<dominio-propio>`
4. Product Owner confirma storage:
   - dedicado `stpuntoclublogosbr001`; o
   - container en `stpuntoclubfuncbr001`.
5. Product Owner confirma limite de logo:
   - 1 MB recomendado para piloto;
   - 2 MB si se necesita mas flexibilidad.

Fase B - ACS Email
1. Crear Email Communication Service propio de Punto Club.
2. Crear dominio:
   - Azure Managed Domain para piloto; o
   - Custom Domain y configurar DNS.
3. Crear Azure Communication Services resource.
4. Conectar el dominio verificado al Communication Services resource.
5. Obtener sender address.
6. Configurar app settings en Function App:
   - `ACS_EMAIL_CONNECTION_STRING`
   - `ACS_EMAIL_SENDER_ADDRESS`
   - `INTERNAL_NOTIFICATION_EMAIL`
   - `APP_PUBLIC_BASE_URL`
7. Verificacion posterior:
   - enviar email de prueba a cuenta controlada;
   - revisar delivery/failure sin imprimir contenido sensible.

Fase C - Entra External ID
1. Crear external tenant para Punto Club.
2. Registrar app SPA `puntoclub-web`.
3. Registrar app/API `puntoclub-api` o definir audience/scope esperado.
4. Crear sign-up/sign-in user flow con email/password.
5. Asociar app al user flow.
6. Configurar redirect URIs publicados y locales.
7. Obtener:
   - issuer;
   - tenant id;
   - client id;
   - JWKS/openid configuration URL;
   - audience/scope.
8. Configurar Function App settings de validacion JWT.
9. Configurar frontend con public auth config.
10. Verificacion posterior:
   - crear usuario de prueba;
   - completar login;
   - confirmar token;
   - API rechaza request sin token y acepta request con token valido solo si existe mapeo SQL.

Fase D - Blob Storage privado
1. Crear storage dedicado o seleccionar `stpuntoclubfuncbr001`.
2. Crear container privado `company-logos`.
3. Confirmar public blob access disabled.
4. Habilitar Managed Identity en Function App si no existe.
5. Asignar rol `Storage Blob Data Contributor` a la identidad de Function App sobre storage/container.
6. Configurar Function App settings:
   - `LOGO_STORAGE_ACCOUNT`
   - `LOGO_CONTAINER`
   - `LOGO_MAX_BYTES`
   - `LOGO_ALLOWED_MIME_TYPES`
   - `LOGO_SERVE_MODE`
7. Verificacion posterior:
   - upload controlado de PNG pequeno desde API;
   - confirmar blob privado;
   - confirmar lectura por API/SAS corto;
   - confirmar que URL directa anonima no funciona.

Fase E - Observabilidad y rollback
1. Agregar logs de:
   - email send success/failure;
   - auth validation failure;
   - logo upload rejected/accepted;
   - storage write failure.
2. Revisar Application Insights.
3. Definir rollback:
   - desactivar endpoints nuevos por feature flag;
   - no borrar usuarios/logos sin tarea explicita;
   - conservar empresa piloto actual.

Comandos/CLI orientativos, no ejecutados:

Email/domain:
```powershell
# Ejecutar solo con aprobacion y validando nombres definitivos.
# Algunos comandos pueden requerir extension de Azure CLI para Communication Services.
az communication email domain create `
  --domain-name AzureManagedDomain `
  --email-service-name email-puntoclub-prod-001 `
  --resource-group resource_group_main `
  --location global `
  --domain-management AzureManaged
```

Storage:
```powershell
az storage account create `
  --name stpuntoclublogosbr001 `
  --resource-group resource_group_main `
  --location brazilsouth `
  --sku Standard_LRS `
  --kind StorageV2 `
  --https-only true `
  --min-tls-version TLS1_2 `
  --allow-blob-public-access false
```

Container:
```powershell
az storage container create `
  --name company-logos `
  --account-name stpuntoclublogosbr001 `
  --auth-mode login `
  --public-access off
```

Managed Identity / role:
```powershell
az functionapp identity assign `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001

az role assignment create `
  --assignee <function-managed-identity-principal-id> `
  --role "Storage Blob Data Contributor" `
  --scope <storage-or-container-scope>
```

App settings:
```powershell
# No pegar valores reales en chats.
az functionapp config appsettings set `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001 `
  --settings `
    ACS_EMAIL_SENDER_ADDRESS="<sender>" `
    INTERNAL_NOTIFICATION_EMAIL="pj13eros_business@outlook.com" `
    APP_PUBLIC_BASE_URL="https://calm-dune-075dc5c0f.7.azurestaticapps.net" `
    AUTH_PROVIDER="entra_external_id" `
    LOGO_CONTAINER="company-logos"
```

Riesgos / costos:
- ACS Email:
  - Costo bajo en piloto; pay-as-you-go por email.
  - Riesgo P2 si se usa Azure Managed Domain para correo real: confianza/entregabilidad menor que dominio propio.
- Entra External ID:
  - Costo bajo para pocos usuarios; validar free tier/MAU vigente antes de activar.
  - Riesgo P1 de configuracion incorrecta de issuer/audience/redirects.
  - Riesgo P0 si la API acepta `companyId` desde frontend sin validar usuario-empresa.
- Blob Storage:
  - Costo muy bajo para logos pequenos.
  - Riesgo P1 si se habilita public access o se aceptan archivos sin validacion.
  - Riesgo P2 si se reutiliza storage de Functions para assets de producto.
- Operacion:
  - Nuevos recursos agregan monitoreo, permisos y secrets.
  - No cambiar flujo piloto actual hasta que auth/mapeo SQL/QA esten listos.

Preguntas concretas para Product Owner:
1. Email: para piloto, acepta Azure Managed Domain o requiere dominio propio desde el inicio?
2. Sender: que nombre/remitente debe ver la empresa en la invitacion?
3. Registro: la solicitud publica solo notifica internamente o debe enviar acuse automatico al solicitante?
4. Aprobacion: quien aprueba una empresa antes de enviar invitacion?
5. Storage: aprueba crear storage dedicado `stpuntoclublogosbr001` o prefiere reutilizar `stpuntoclubfuncbr001`?
6. Logo: limite 1 MB o 2 MB?
7. Logo: se permiten solo PNG/JPEG/WebP y se excluye SVG?
8. Auth: confirma Entra External ID como proveedor de password/acceso?
9. Redirects: se usara solo URL publicada actual o tambien dominio custom futuro?
10. Costos: aprueba nuevos recursos pay-as-you-go de ACS Email, Entra External ID y Storage?

Fuentes consultadas:
- Azure Communication Services Email overview: https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-overview
- Create Email Communication Service: https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/create-email-communication-resource
- Connect verified email domain: https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/connect-email-communication-resource
- Microsoft Entra External ID overview: https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam
- Create external tenant: https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-create-external-tenant-portal
- Plan CIAM solution: https://learn.microsoft.com/en-us/entra/external-id/customers/concept-planning-your-solution
- Static Web Apps auth: https://learn.microsoft.com/azure/static-web-apps/authentication-authorization/
- Static Web Apps custom auth: https://learn.microsoft.com/en-gb/azure/static-web-apps/authentication-custom
- Blob anonymous access: https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure
- Blob containers portal/private access: https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal

Siguiente recomendado:
- Product Owner responde las preguntas de aprobacion.
- Infra ejecuta fase A-D solo despues de aprobacion explicita, en pasos pequenos y verificables.
- Backend/API no implementa envio real de email, auth o upload productivo hasta que existan recursos/settings aprobados.
