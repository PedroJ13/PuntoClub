Equipo:
Infra / Azure

Tarea completada:
TASK-114 - Evaluar email, auth y subida de logo para empresas.

Archivos cambiados:
- `tasks/TASK-114-HANDOFF.md`
- `docs/TASK_BOARD.md`

Estado:
- Evaluacion completada.
- No se crearon recursos Azure.
- No se cambiaron app settings, workflows, firewall, SKU ni servicios productivos.
- No se imprimieron secretos.

Contexto revisado:
- `tasks/TASK-114-assignment.md`
- `chat-start/INFRA.md`
- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-111-HANDOFF.md`
- `tasks/TASK-107-HANDOFF.md`
- Documentacion Microsoft Learn/Azure sobre:
  - Azure Communication Services Email.
  - Microsoft Entra External ID.
  - Azure Static Web Apps auth.
  - Azure Blob Storage y acceso anonimo.

Estado Azure observado:
- Function App actual:
  - `func-puntoclub-prod-br-001`
  - No tiene app settings de email, auth multiempresa ni storage de logos.
  - App settings presentes sin valores impresos: `APPLICATIONINSIGHTS_CONNECTION_STRING`, `AzureWebJobsStorage`, `FUNCTIONS_EXTENSION_VERSION`, `FUNCTIONS_WORKER_RUNTIME`, `PILOT_COMPANY_ID`, `SCM_DO_BUILD_DURING_DEPLOYMENT`, `SQL_CONNECTION_STRING`, `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`, `WEBSITE_CONTENTSHARE`.
- Storage accounts en `resource_group_main`:
  - `stpuntoclubfuncbr001`: `StorageV2`, `Standard_LRS`, `brazilsouth`, HTTPS only, TLS 1.2, `allowBlobPublicAccess=false`.
  - `storagepuntoevento`: `StorageV2`, `Standard_LRS`, `eastus2`, HTTPS only, TLS 1.2, `allowBlobPublicAccess=true`; parece ajeno/legacy y no recomiendo usarlo para Punto Club.

Recomendacion principal:

1. Email transaccional: Azure Communication Services Email.
   - Usar Azure Communication Services Email para:
     - Invitacion a la empresa.
     - Notificacion interna a `pj13eros_business@outlook.com`.
   - Para piloto:
     - Si no hay dominio propio listo, se puede iniciar con dominio administrado por Azure para pruebas controladas.
     - Para uso real, preferir dominio propio verificado con SPF/DKIM.
   - Motivo:
     - Servicio transaccional Azure, pay-as-you-go, con SDKs y trazabilidad de envio.
     - Evita usar credenciales personales de Outlook/SMTP.
   - Riesgos:
     - Requiere recurso Azure Communication Services + Email Communication Services.
     - Requiere configurar remitente/dominio.
     - Entregabilidad depende de dominio, reputacion y contenido.
   - Costo cualitativo:
     - Bajo para bajo volumen; pay-as-you-go por email.

2. Auth/acceso/password: Microsoft Entra External ID.
   - Usar Microsoft Entra External ID como CIAM para usuarios de empresas.
   - Las empresas usan email como usuario y crean/recuperan password en flujo administrado por Microsoft.
   - La API debe validar JWT server-side y mapear usuario autenticado a empresa/rol en SQL.
   - Motivo:
     - Evita implementar almacenamiento/verificacion de passwords propios.
     - Soporta self-service sign-up/sign-in, password reset, email/password y otras identidades.
     - Escala mejor si luego hay varias empresas y usuarios por empresa.
   - Riesgos:
     - Mayor configuracion inicial que auth propio.
     - Requiere definir tenant externo, app registration, user flows, redirect URIs y validacion de claims.
     - Requiere cambios coordinados en API, Web y SQL.
   - Costo cualitativo:
     - Bajo para piloto si se mantiene dentro del free tier de MAU; confirmar pricing vigente antes de activar.

3. Logo upload: Azure Blob Storage privado.
   - Usar Azure Blob Storage con contenedor privado.
   - No habilitar public blob access para el storage account.
   - Recomendacion de implementacion:
     - Backend/API recibe el archivo, valida y sube a Blob Storage.
     - Guardar en SQL solo `logo_blob_path` o URL controlada, no confiar en URL enviada por frontend.
     - Servir logo por endpoint API o SAS de lectura corto generado server-side.
   - Validaciones minimas:
     - Tipos permitidos: `image/png`, `image/jpeg`, `image/webp`.
     - Evitar SVG en piloto por riesgo XSS/content-sniffing si se sirve mal.
     - Tamano maximo recomendado: 1 MB o 2 MB.
     - Generar nombre server-side: `companies/{companyId}/logo/{uuid}.{ext}`.
     - Setear `Content-Type` correcto y `Cache-Control` controlado.
   - Storage recomendado:
     - Opcion limpia: crear storage account dedicado para assets/logos de Punto Club en `brazilsouth`, `Standard_LRS`, HTTPS only, TLS 1.2, public access disabled.
     - Opcion minima de costo: reutilizar `stpuntoclubfuncbr001` con un contenedor privado `company-logos`, pero mezcla runtime storage de Functions con assets de producto. Aceptable solo para piloto muy controlado.
   - Costo cualitativo:
     - Muy bajo para logos pequenos; pago por GB almacenado, operaciones y egreso.

Alternativas consideradas:

1. Azure Static Web Apps built-in auth/invitations.
   - Pros:
     - Encaja con frontend actual en SWA.
     - Menos backend propio para proteger rutas simples.
   - Contras:
     - No resuelve tan limpiamente el flujo de empresa que se registra, recibe invite, crea password con email y queda vinculada a una empresa en SQL.
     - La autorizacion real por empresa seguiria teniendo que vivir en API.
     - Menos flexible que External ID para CIAM/multiempresa.
   - Uso recomendado:
     - Solo como puente temporal si Product acepta login simple y limitado.

2. Auth propio con tabla de usuarios, password hash y tokens.
   - Pros:
     - Control total de UX y flujo de invitacion.
     - Menor dependencia de configuracion Entra.
   - Contras:
     - Alto riesgo de seguridad: hashing, reset password, lockout, MFA, sesiones, rotacion, auditoria.
     - No recomendable para piloto real con passwords si hay alternativa administrada.
   - Uso recomendado:
     - No recomendado salvo restriccion fuerte contra Entra External ID.

3. Azure AD B2C.
   - Pros:
     - Conocido para CIAM historico.
   - Contras:
     - Para nueva arquitectura, Microsoft esta empujando Entra External ID como camino actual.
   - Uso recomendado:
     - No usar para nuevo proyecto salvo razon especifica.

4. Microsoft Graph / Outlook / SMTP para email.
   - Pros:
     - Podria usar cuenta existente o tenant M365 si ya existe.
   - Contras:
     - Riesgo de credenciales, consentimiento, limites, entregabilidad y dependencia de mailbox.
     - No es tan claro como servicio transaccional para invites.
   - Uso recomendado:
     - No recomendado como base del producto.

5. Logos por URL externa.
   - Pros:
     - Cero infraestructura nueva.
   - Contras:
     - Mala UX para empresas.
     - Riesgo de hotlinking, links rotos y contenido externo no controlado.
   - Uso recomendado:
     - Solo fallback temporal si Product decide no implementar upload.

Variables/secrets necesarios:

Email:
- `ACS_EMAIL_CONNECTION_STRING` o configuracion equivalente de ACS.
- `ACS_EMAIL_SENDER_ADDRESS`.
- `INTERNAL_NOTIFICATION_EMAIL=pj13eros_business@outlook.com`.
- `APP_PUBLIC_BASE_URL` para construir links de invitacion.
- `INVITE_TOKEN_SECRET` si el token de invitacion lo firma la API.
- Opcional: `ACS_EMAIL_DOMAIN`, `ACS_EMAIL_REPLY_TO`.

Auth:
- `AUTH_PROVIDER=entra_external_id`.
- `AUTH_ISSUER`.
- `AUTH_AUDIENCE` o `AUTH_CLIENT_ID`.
- `AUTH_JWKS_URI`.
- `AUTH_TENANT_ID` / external tenant id.
- `AUTH_CLIENT_SECRET` solo si se usa flujo que lo requiera.
- Config de Static Web Apps para auth/rutas si Web decide proteger desde SWA.

Logo storage:
- `LOGO_STORAGE_ACCOUNT`.
- `LOGO_CONTAINER=company-logos`.
- `LOGO_MAX_BYTES`.
- `LOGO_ALLOWED_MIME_TYPES`.
- Si se usa Managed Identity:
  - habilitar identidad administrada en Function App;
  - asignar rol minimo sobre el contenedor/storage, por ejemplo Blob Data Contributor para escritura.
- Si no se usa Managed Identity:
  - `LOGO_STORAGE_CONNECTION_STRING` o SAS de servicio; menos recomendado por manejo de secretos.

SQL/modelo a coordinar con SQL DEV:
- Empresas:
  - `logo_url` ya existe para URL.
  - Para Blob privado conviene decidir si guardar URL publica, blob path o ambos.
- Usuarios/invitaciones:
  - SQL DEV debe definir tablas para empresa, invitacion, usuario externo, estado y mapeo auth subject/email -> company.

Pasos de despliegue sugeridos:

Fase 0 - Decision Product / Architect / Release:
- Confirmar proveedor de email: Azure Communication Services Email.
- Confirmar auth: Entra External ID o alternativa.
- Confirmar storage de logos: Blob Storage privado.
- Confirmar si se permite crear recursos nuevos.
- Confirmar dominio de email: Azure-managed para piloto o dominio propio.

Fase 1 - Infra:
- Crear/configurar ACS Email y dominio/remitente.
- Crear/configurar Entra External ID external tenant, app registration, user flow y redirect URIs.
- Crear storage dedicado o contenedor privado para logos.
- Configurar secrets/app settings en Function App/SWA sin imprimir valores.
- Definir monitoreo minimo: logs de email send failures, auth failures y upload failures.

Fase 2 - SQL DEV:
- Modelo de companies/users/invitations.
- Constraints de unicidad por email/empresa.
- Campos para estado de invitacion, expiracion, accepted_at, revoked_at.
- Campo para `auth_subject`/external user id.
- Ajustar logo storage path si aplica.

Fase 3 - Backend/API:
- Endpoints de registro empresa e invitacion.
- Envio de email por ACS.
- Validacion JWT de Entra External ID.
- Autorizacion por company claim/mapeo SQL.
- Upload de logo con validacion server-side.
- Auditoria de registro/invite/login/upload si Product lo requiere.

Fase 4 - Web Dev:
- Flujo de registro/invitacion/password.
- Login/logout.
- UI de carga/preview de logo.
- Menu lateral segun UX.

Fase 5 - QA:
- Matriz multiempresa: aislamiento, invitaciones, password reset, permisos, logo upload, reporte, caja y auditoria.

Decisiones que requieren aprobacion del Product Owner antes de implementar:
- Crear recursos ACS Email.
- Usar dominio Azure-managed o dominio propio.
- Crear/usar Microsoft Entra External ID external tenant.
- Definir si usuarios de empresa pueden auto-registrarse libremente o quedan en estado pendiente hasta aprobacion interna.
- Definir si la notificacion interna a `pj13eros_business@outlook.com` es solo informativa o requiere aprobacion manual.
- Crear storage dedicado para logos o reutilizar `stpuntoclubfuncbr001`.
- Permitir logos publicos o privados con endpoint/SAS.
- Limite de tamano/tipos de archivo.
- Politica de expiracion de invitaciones.

Recomendacion concreta para TASK-119:
- Aprobar como arquitectura objetivo:
  - ACS Email para invites/notificacion interna.
  - Entra External ID para email/password y recuperacion de password.
  - Blob Storage privado para logos.
- Para piloto controlado:
  - usar dominio administrado de ACS solo si Product acepta remitente no final;
  - usar storage dedicado si se permite recurso nuevo, o contenedor privado en `stpuntoclubfuncbr001` si se prioriza costo/minima friccion;
  - no implementar auth propio con passwords.

Riesgos:
- P1: Implementar password propio aumenta riesgo de seguridad y soporte.
- P1: Permitir upload directo/publico sin validacion server-side puede introducir archivos maliciosos o contenido incorrecto.
- P1: Registrar empresas sin aprobacion interna puede abrir acceso operativo no controlado.
- P2: ACS con dominio Azure-managed puede verse menos profesional y afectar confianza/entregabilidad.
- P2: Reutilizar storage de Functions para logos mezcla responsabilidades operativas.
- P2: Sin mapeo robusto `auth subject -> company`, existe riesgo de mezclar empresas.
- P3: Costos siguen bajos en piloto, pero se agregan nuevas superficies de monitoreo y soporte.

Fuentes consultadas:
- Azure Communication Services Email overview: https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-overview
- Azure Communication Services Email pricing: https://learn.microsoft.com/en-us/azure/communication-services/concepts/email-pricing
- Microsoft Entra External ID customer CIAM overview: https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam
- Microsoft Entra External ID pricing: https://learn.microsoft.com/en-ie/entra/external-id/external-identities-pricing
- Azure Static Web Apps authentication: https://learn.microsoft.com/azure/static-web-apps/authentication-authorization/
- Azure Blob anonymous access guidance: https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure
- Azure Blob Storage cost planning: https://learn.microsoft.com/en-us/azure/storage/common/storage-plan-manage-costs

Siguiente recomendado:
- Product / Architect / Release debe usar este handoff junto con TASK-113 y TASK-115 para TASK-119.
- No liberar Backend/API TASK-116 para implementacion hasta confirmar email/auth/storage y modelo SQL.
