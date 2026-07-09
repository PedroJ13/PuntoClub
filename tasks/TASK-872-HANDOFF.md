# TASK-872 - Handoff

Nombre del Equipo: Infra
Modo: Staging / Azure planning
Fecha: 2026-07-09

## Estado

Completada como propuesta. No se crearon recursos y no se cambio Azure, DNS, secrets, SQL, Storage ni codigo.

## Documento base leido

- `docs/STAGING_ENVIRONMENT_PHASE1.md`

Decision base: staging phase 1 duplica Static Web App y Azure Function App, separa app settings, pero temporalmente mantiene Azure SQL productiva.

## Inventario produccion actual

Static Web App:

```txt
Name: swa-puntoclub-prod-001
Resource group: resource_group_main
Location: East US 2
SKU: Free
Default hostname: calm-dune-075dc5c0f.7.azurestaticapps.net
Custom domains:
- puntoclubcr.com
- www.puntoclubcr.com
Repository: https://github.com/PedroJ13/PuntoClub
Branch: main
```

Function App:

```txt
Name: func-puntoclub-prod-br-001
Resource group: resource_group_main
Location: Brazil South
Kind: functionapp,linux
Runtime: Node|22
Plan: BrazilSouthLinuxDynamicPlan
HTTPS only: true
Identity: SystemAssigned
AlwaysOn: false
FTPS: FtpsOnly
Minimum TLS: 1.2
Default hostname: func-puntoclub-prod-br-001.azurewebsites.net
Custom API domain observado: api.puntoclubcr.com
```

CORS productivo actual:

```txt
Allowed origins:
- https://puntoclubcr.com
- https://www.puntoclubcr.com
supportCredentials: true
```

SQL productiva:

```txt
sqlserver-pj13-brazil/sql-db-puntoclub
Region: Brazil South
```

Recursos relacionados observados:

```txt
Storage Functions: stpuntoclubfuncbr001
Storage logos/assets: stpuntoclublogosbr001
ACS Email: email-puntoclub-prod-001
ACS Communication Service: acs-puntoclub-prod-001
Function App plan: BrazilSouthLinuxDynamicPlan
```

## Recursos staging phase 1 propuestos

Recomendacion de nombres:

```txt
Resource group recomendado: resource_group_main (fase 1 simple) o rg-puntoclub-staging-br-001 (fase 1 mas aislada)
Static Web App: swa-puntoclub-stg-001
Function App: func-puntoclub-stg-br-001
Storage Function staging: stpuntoclubstgfuncbr001
Application Insights staging: ai-puntoclub-stg-br-001
Log Analytics staging opcional: law-puntoclub-stg-br-001
```

Region recomendada:

```txt
Static Web App: East US 2
Function App: Brazil South
Storage Function: Brazil South
Application Insights: Brazil South si esta disponible; si no, region compatible cercana
```

Motivo:

- Mantener la Web staging cerca del patron productivo actual.
- Mantener API staging en Brazil South cerca de Azure SQL productiva para evitar latencia extra mientras phase 1 apunta temporalmente a SQL productiva.

## SKU / plan recomendado

Static Web App:

```txt
Plan recomendado phase 1: Free
Motivo: staging interno, bajo trafico, SSL incluido, custom domain disponible.
```

Function App:

```txt
Plan recomendado phase 1: Consumption Linux o reutilizar un plan serverless equivalente en Brazil South si Azure lo permite.
Runtime: Node 22
AlwaysOn: false
Managed identity: SystemAssigned
```

Nota Azure: Microsoft Learn indica que para nuevas Function Apps serverless se recomienda Flex Consumption; el plan actual productivo es Consumption Linux. Para phase 1 se puede mantener equivalente al runtime productivo si esta disponible, o usar Flex Consumption si Azure lo exige para nuevos recursos en la region.

## Costo mensual estimado

Estimacion conservadora para trafico bajo de QA/PO:

```txt
Static Web App Free: USD 0 si no excede cuotas del plan.
Function App Consumption/Flex: normalmente USD 0 a pocos USD/mes si queda dentro de grants mensuales o trafico muy bajo.
Storage Function staging: centavos a pocos USD/mes segun logs/paquetes.
Application Insights/Log Analytics: USD 0 a pocos USD/mes si se limita retencion/ingesta; puede crecer si se habilita logging verboso.
Custom domain staging: sin costo Azure directo esperado por certificado administrado; DNS en Cloudflare sin costo si la zona actual lo permite.
SQL: sin costo adicional en phase 1 porque no se duplica DB.
ACS Email: sin costo si staging mantiene correos deshabilitados.
```

Rango practico phase 1:

```txt
USD 0 - 10/mes para uso bajo, sin SQL duplicada, sin email real y sin logs intensivos.
```

Fuentes oficiales:

- Azure Static Web Apps pricing indica plan Free y cuotas; el Standard es por hora y con SLA.
- Azure Functions pricing indica grants mensuales en Consumption/Flex y cobro por ejecuciones/GB-s.
- Azure Functions Scale and Hosting indica que Consumption Linux es legacy/retiring y que Flex Consumption es recomendado para nuevas apps serverless.

## URLs / dominios

Opcion inicial sin DNS:

```txt
Web staging: https://<default-hostname>.azurestaticapps.net
API staging: https://func-puntoclub-stg-br-001.azurewebsites.net/api
```

Opcion con DNS posterior:

```txt
Web staging: https://staging.puntoclubcr.com
API staging: https://api-staging.puntoclubcr.com/api
```

Recomendacion:

1. Crear primero con URLs temporales de Azure.
2. Validar CORS/cookies con URLs temporales.
3. Solo despues decidir DNS `staging.puntoclubcr.com` y `api-staging.puntoclubcr.com`.

## Settings a duplicar o cambiar

Duplicar como secretos distintos o valores redaccionados:

```txt
AzureWebJobsStorage
APPLICATIONINSIGHTS_CONNECTION_STRING
SQL_CONNECTION_STRING
ACS_EMAIL_CONNECTION_STRING
INVITE_TOKEN_SECRET
INTERNAL_ADMIN_TOKEN
WEBSITE_CONTENTAZUREFILECONNECTIONSTRING
WEBSITE_CONTENTSHARE
```

Cambiar para staging:

```txt
APP_PUBLIC_BASE_URL=https://<web-staging-url>
PUBLIC_API_BASE_URL=https://<api-staging-url>/api
PILOT_COMPANY_ID=<empresa QA autorizada, no empresa real operativa si se puede evitar>
COMPANY_SESSION_COOKIE_NAME=puntoclub_staging_company_session
COMPANY_SESSION_COOKIE_SECURE=true
COMPANY_SESSION_COOKIE_SAMESITE=none
PROMOTIONAL_EMAIL_SEND_ENABLED=false
COMPANY_REGISTRATION_REVIEW_ENABLED=false o true solo si se usa token staging
COMPANY_INVITATION_MANAGEMENT_ENABLED=false por defecto
COMPANY_PASSWORD_RESET_ENABLED=false por defecto, salvo prueba controlada
```

Settings de ACS recomendados para staging phase 1:

```txt
ACS_EMAIL_CONNECTION_STRING=
ACS_EMAIL_SENDER_ADDRESS=
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
PROMOTIONAL_EMAIL_SENDER_ADDRESS=
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Staging
INTERNAL_NOTIFICATION_EMAIL=<mailbox interno QA si Product lo aprueba>
```

Motivo: que cualquier flujo de correo quede `not_configured`/bloqueado salvo tarea explicita. Si se necesita probar templates, hacerlo con mocks o mailbox controlado.

Storage/logo:

```txt
LOGO_STORAGE_ACCOUNT=stpuntoclublogosbr001 solo si se acepta compartir storage
LOGO_CONTAINER=company-logos-staging recomendado si se crea contenedor separado
LOGO_SERVE_MODE=<igual a prod, pero con datos QA>
```

Recomendacion Infra: no compartir contenedor productivo de logos/assets si staging puede subir archivos.

## CORS y cookies

Function App staging debe permitir solo Web staging:

```txt
allowedOrigins:
- https://<web-staging-default>.azurestaticapps.net
- https://staging.puntoclubcr.com si se crea DNS
supportCredentials: true
```

No usar wildcard con credentials.

Cookies:

- La API no fija `Domain`, por lo que la cookie queda host-only del API staging.
- Con Web staging y API staging en hosts diferentes, se requiere `credentials: include`, `SameSite=None` y `Secure`.
- Usar nombre distinto de cookie para no interferir con produccion.

## Flags para bloquear correos/campanas reales

Requeridos:

```txt
PROMOTIONAL_EMAIL_SEND_ENABLED=false
ACS_EMAIL_CONNECTION_STRING vacio o connection string de un ACS staging no productivo
COMPANY_PASSWORD_RESET_ENABLED=false salvo prueba controlada
COMPANY_INVITATION_MANAGEMENT_ENABLED=false salvo prueba controlada
COMPANY_REGISTRATION_REVIEW_ENABLED=false salvo prueba controlada
```

Adicional recomendado:

- Crear tarea Backend posterior para un `ENVIRONMENT_NAME=staging` o `EMAIL_SEND_MODE=disabled/test-only` si se quiere una garantia mas clara que depender de settings vacios.
- Usar `INTERNAL_ADMIN_TOKEN` distinto al productivo.

## Riesgos de usar SQL productiva temporalmente

Riesgos P0/P1:

- Staging puede crear clientes, compras, canjes, membresias, campanas o sesiones en datos reales.
- Staging puede disparar correos operativos si ACS queda configurado y los eventos estan activos.
- Pruebas de QA pueden contaminar reportes, historial, KPIs y auditoria.
- Si staging ejecuta una version de API no publicada aun, podria escribir con logica experimental sobre SQL productiva.
- No sirve para validar migraciones SQL de forma segura.
- Pruebas de carga desde staging afectan SQL productiva.

Guardrails minimos:

- Usar solo empresa QA autorizada.
- No ejecutar `npm run smoke` contra staging si apunta a SQL productiva sin autorizacion; ese smoke crea datos.
- Bloquear correos/campanas reales.
- No probar migraciones desde staging.
- No hacer limpiezas desde staging.
- Documentar cada prueba que escriba datos.

## Propuesta de flujo phase 1

1. Crear recursos staging con URLs temporales.
2. Configurar app settings staging redaccionados y separados.
3. Configurar CORS staging con `supportCredentials=true`.
4. Publicar API staging desde rama/commit aprobado.
5. Publicar Web staging apuntando a API staging.
6. Smoke seguro:
   - `GET /api/me` sin cookie debe responder `401`.
   - Home Web staging responde.
   - Rutas profundas renderizan.
7. Solo con decision PO, ejecutar login/pruebas con usuario QA y datos controlados.
8. Mantener phase 2 como prioridad para SQL staging antes de migraciones o QA destructiva.

## Fuentes

- Azure Static Web Apps pricing:
  - https://azure.microsoft.com/en-us/pricing/details/app-service/static/
- Azure Static Web Apps hosting plans:
  - https://learn.microsoft.com/en-us/azure/static-web-apps/plans
- Azure Functions pricing:
  - https://azure.microsoft.com/en-us/pricing/details/functions/
- Azure Functions scale and hosting:
  - https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale

## Restricciones respetadas

- No se crearon recursos.
- No se cambio Azure.
- No se cambio DNS.
- No se leyeron ni expusieron valores secretos.
- No se cambio SQL.
- No se cambio Storage.
- No se cambio codigo.
- No se enviaron correos.

## Uso Azure SQL

No se uso Azure SQL.

## Siguiente paso recomendado

Product / Architect / Release debe decidir:

- si staging phase 1 usa URLs temporales o subdominios;
- si se crea resource group separado;
- si Function App nueva usa Flex Consumption o se intenta mantener Consumption equivalente;
- empresa/usuario QA autorizados mientras SQL staging no exista;
- fecha objetivo para phase 2 con SQL staging separada.
