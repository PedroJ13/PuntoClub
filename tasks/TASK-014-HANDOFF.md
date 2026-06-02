Equipo:
Infra / Azure

Tarea completada:
Guia ejecutable para crear los recursos Azure reales del piloto production de Punto Club, sin ejecutar creacion, sin guardar secretos y sin cambiar codigo ni pipeline.

Decision de region:
- Region propuesta: `eastus2`.
- Estado: pendiente de confirmacion final por Product / Architect / Release o usuario.
- Motivo: buena disponibilidad general para Static Web Apps, Functions, SQL, Storage y observabilidad.
- Nota importante: el release status indica que el usuario ya creo una Azure SQL Database. No crear otra DB. Antes de ejecutar esta guia se debe inventariar la DB existente y ajustar nombres/region para usarla.

Nombres definitivos propuestos:
- Resource group: `rg-puntoclub-prod-crc-001`.
- Static Web App: `swa-puntoclub-prod-001`.
- Function App: `func-puntoclub-prod-001`.
- Storage runtime Functions: `stpuntoclubprod001`.
- Application Insights: `appi-puntoclub-prod-001`.
- Log Analytics Workspace opcional: `log-puntoclub-prod-001`.
- Azure SQL server/database: usar los recursos existentes creados por el usuario. Si todavia no hay nombre documentado, registrar:
  - SQL server existente: `<existing-sql-server-name>`.
  - SQL database existente: `<existing-sql-database-name>`.
- Blob Storage logos: diferido. Si se aprueba luego:
  - Storage account: `stpuntoclublogosprod001`.
  - Container: `logos`.
- Key Vault: diferido salvo nueva decision. Si se aprueba luego: `kv-puntoclub-prod-001`.

Tags recomendados:
- `project=PuntoClub`
- `env=prod`
- `phase=pilot`
- `owner=PedroJ13`
- `costCenter=pilot`

Checklist previo obligatorio:
1. Confirmar Azure subscription activa.
2. Confirmar region final.
3. Inventariar Azure SQL Database existente: server, database, region, tier, firewall, admin actual y metodo de acceso.
4. Confirmar si la DB existente esta en la misma region elegida para Functions o aceptar latencia/costo operativo menor.
5. Confirmar runtime Backend/API antes de crear Function App: Node, .NET, Python u otro.
6. Confirmar ruta de build frontend antes de crear Static Web Apps o pipeline.
7. Confirmar `PILOT_COMPANY_ID` real despues de ejecutar seed SQL.
8. Confirmar politica de acceso piloto: control operativo, invitacion/manual o proteccion de Static Web Apps.

App settings requeridos sin valores secretos:
- `AZURE_FUNCTIONS_ENVIRONMENT=Production`
- `PILOT_COMPANY_ID=<pilot-company-id-from-seed>`
- `SQL_CONNECTION_STRING=<secret: azure sql app user connection string>`
- `APPINSIGHTS_CONNECTION_STRING=<from Application Insights>`
- `CORS_ALLOWED_ORIGINS=<static web app production URL>` si API queda separada.
- `LOG_LEVEL=Information`
- `WEBSITE_RUN_FROM_PACKAGE=1` si el deploy usa paquete.
- `STORAGE_ACCOUNT_NAME=stpuntoclublogosprod001` solo si se habilita storage de logos.
- `STORAGE_CONTAINER_LOGOS=logos` solo si se habilita storage de logos.
- `STORAGE_CONNECTION_STRING=<secret>` solo si se habilita storage de logos sin managed identity.

Secretos y connection strings:
- No guardar connection strings, passwords, tokens ni llaves en archivos del repo.
- Para piloto minimo: configurar `SQL_CONNECTION_STRING` directamente como app setting secreto de Azure Functions.
- Crear usuario SQL de aplicacion con permisos minimos; no usar credenciales admin en la Function App.
- Key Vault queda diferido porque agrega recurso y operacion adicional. Incluirlo si se decide rotacion de secretos, staging permanente o managed identity desde el inicio.
- Si se incluye Key Vault, Functions debe leer secretos con managed identity y permisos RBAC/Access Policy minimos.

Storage de logos:
- Diferido salvo nueva decision.
- Para MVP minimo, preferir `logoUrl` externa validada por API.
- Si se aprueba carga propia, crear Blob Storage privado; no usar contenedor publico por defecto.

Pasos Portal sugeridos:
1. Abrir Azure Portal y seleccionar subscription final.
2. Validar o crear resource group `rg-puntoclub-prod-crc-001` en region confirmada.
3. Inventariar la Azure SQL Database existente y mover/documentar su asociacion al resource group si aplica.
4. Crear Application Insights `appi-puntoclub-prod-001`.
5. Crear Storage Account `stpuntoclubprod001` para runtime de Functions.
6. Crear Function App `func-puntoclub-prod-001` en Consumption, enlazada a storage runtime y Application Insights.
7. Configurar app settings de Functions con valores reales desde Portal, sin escribirlos en archivos.
8. Configurar firewall de Azure SQL para permitir acceso operativo necesario y conexion desde Azure services si se usa ese camino.
9. Crear usuario SQL de aplicacion con permisos minimos cuando SQL DEV entregue schema/migraciones.
10. Crear Static Web App `swa-puntoclub-prod-001` Free cuando Web Dev/Backend tengan estructura de app lista.
11. Configurar CORS solo si Functions queda fuera de la integracion `/api` de Static Web Apps.
12. Crear presupuesto/alerta de costo para el resource group.

Comandos Azure CLI de referencia, no ejecutar todavia:

```powershell
az account show
az account set --subscription "<subscription-id-or-name>"

az group create `
  --name "rg-puntoclub-prod-crc-001" `
  --location "eastus2" `
  --tags project=PuntoClub env=prod phase=pilot owner=PedroJ13 costCenter=pilot

az sql server list --output table
az sql db list --server "<existing-sql-server-name>" --resource-group "<existing-sql-resource-group>" --output table

az monitor app-insights component create `
  --app "appi-puntoclub-prod-001" `
  --location "eastus2" `
  --resource-group "rg-puntoclub-prod-crc-001" `
  --application-type web

az storage account create `
  --name "stpuntoclubprod001" `
  --resource-group "rg-puntoclub-prod-crc-001" `
  --location "eastus2" `
  --sku Standard_LRS `
  --kind StorageV2

az functionapp create `
  --name "func-puntoclub-prod-001" `
  --resource-group "rg-puntoclub-prod-crc-001" `
  --storage-account "stpuntoclubprod001" `
  --consumption-plan-location "eastus2" `
  --functions-version 4 `
  --runtime "<runtime-to-confirm>"

az functionapp config appsettings set `
  --name "func-puntoclub-prod-001" `
  --resource-group "rg-puntoclub-prod-crc-001" `
  --settings AZURE_FUNCTIONS_ENVIRONMENT=Production PILOT_COMPANY_ID="<set-in-portal-or-secure-shell>" LOG_LEVEL=Information
```

Notas sobre CLI:
- No incluir `SQL_CONNECTION_STRING` en comandos pegados a terminal compartida si queda en historial. Preferir Portal, GitHub Actions secrets o un mecanismo seguro aprobado.
- El runtime exacto de `az functionapp create` depende de TASK-009.
- Static Web Apps CLI/Portal depende de la estructura real del frontend y del repo/pipeline, por eso queda como paso posterior.

Costos esperados:
- Static Web Apps Free: USD 0/mes si el piloto cabe en limites del plan.
- Functions Consumption: costo bajo, usualmente USD 0/mes con trafico piloto bajo dentro del grant mensual.
- Azure SQL existente: validar tier actual; si es Basic DTU, aprox. USD 5/mes.
- Application Insights/logs: aprox. USD 0-5/mes con retencion/muestreo bajo.
- Storage runtime Functions: aprox. USD 0-2/mes para uso bajo.
- Key Vault y storage logos: USD 0 si se difieren.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md`, `tasks/TASK-011-HANDOFF.md` y `tasks/TASK-014.md`.
- Confirmado que la guia no crea recursos reales ni incluye secretos.
- Ajustada la guia a la nota actual de release: ya existe una Azure SQL Database y debe inventariarse/usar esa base, no crear otra.
- Confirmado que Key Vault y storage de logos quedan diferidos salvo decision nueva.

Resultado:
Guia lista para que Product / Architect / Release o el usuario confirmen subscription, region y modo de creacion. Infra puede ejecutar despues solo con confirmacion explicita.

Riesgos o pendientes:
- Bloqueante: falta inventariar la Azure SQL Database existente.
- Bloqueante: falta confirmar subscription y region final.
- Pendiente: runtime real de Azure Functions segun implementacion Backend/API.
- Pendiente: estructura real del frontend/pipeline para Static Web Apps.
- Pendiente: `PILOT_COMPANY_ID` real depende de seed/migracion SQL.
- Riesgo: usar credenciales admin SQL en app aumentaria impacto de filtracion; crear usuario minimo antes de deploy.
- Riesgo: habilitar `Allow Azure services` en SQL es simple pero amplio; revisar alternativa mas restrictiva cuando exista arquitectura final de red.

Siguiente recomendado:
Inventariar la Azure SQL Database existente y registrar server, database, region, tier y resource group. Luego confirmar `eastus2` o region real y preparar ejecucion manual/CLI con aprobacion explicita.
