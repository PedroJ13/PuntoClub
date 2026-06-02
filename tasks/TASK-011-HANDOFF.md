Equipo:
Infra / Azure

Tarea completada:
Plan operativo para preparar recursos Azure production piloto de Punto Club sin crear recursos reales, sin guardar secretos y sin cambiar codigo, pipeline ni modelo SQL.

Ambiente:
- Local: desarrollo y pruebas de SQL/API antes de publicar.
- Production: unico ambiente cloud inicial para piloto real.
- Staging: diferido. Usar preview environments de Azure Static Web Apps o despliegues temporales solo cuando QA/release lo pida.

Grupo de recursos y region:
- Resource group: `rg-puntoclub-prod-crc-001`.
- Region recomendada: `eastus2` como opcion inicial por disponibilidad amplia de Static Web Apps, Functions, SQL, Storage y Application Insights.
- Alternativa: `southcentralus` si el equipo prefiere cercania operacional a Costa Rica y todos los servicios requeridos estan disponibles en la suscripcion.
- Tags sugeridos: `project=PuntoClub`, `env=prod`, `phase=pilot`, `owner=PedroJ13`, `costCenter=pilot`.

Recursos Azure recomendados:
- Azure Static Web Apps: `swa-puntoclub-prod-001`, plan Free.
- Azure Functions: `func-puntoclub-prod-001`, plan Consumption.
- Storage para Functions: `stpuntoclubprod001`, LRS, usado por runtime de Functions.
- Azure SQL logical server: `sql-puntoclub-prod-001`.
- Azure SQL Database: `sqldb-puntoclub-prod-001`, tier Basic DTU.
- Application Insights: `appi-puntoclub-prod-001`, conectado a Functions.
- Log Analytics Workspace: `log-puntoclub-prod-001`, solo si se centralizan logs; si no, usar Application Insights minimo.
- Blob Storage para logos: diferido. Si se requiere carga propia: storage account `stpuntoclublogosprod001`, contenedor `logos`, acceso privado por defecto.
- Key Vault: diferido para piloto minimo. Incluir como P1 pre-lanzamiento si se agregan mas secretos, rotacion, staging permanente o managed identity obligatoria. Nombre sugerido si se incluye: `kv-puntoclub-prod-001`.

App settings requeridos:
- `AZURE_FUNCTIONS_ENVIRONMENT=Production`.
- `PILOT_COMPANY_ID=<id de empresa piloto>`.
- `SQL_CONNECTION_STRING=<secret value>`.
- `APPINSIGHTS_CONNECTION_STRING=<secret/config value>`.
- `CORS_ALLOWED_ORIGINS=<static web app production URL>` si Functions queda como API separada.
- `WEBSITE_RUN_FROM_PACKAGE=1` si el pipeline publica paquete zip.
- `LOG_LEVEL=Information` o equivalente del stack usado.
- `STORAGE_ACCOUNT_NAME=stpuntoclublogosprod001` solo si se habilita storage de logos.
- `STORAGE_CONTAINER_LOGOS=logos` solo si se habilita storage de logos.
- `STORAGE_CONNECTION_STRING=<secret value>` solo si se usa connection string; preferir identidad administrada cuando Backend/API este listo para usarla.

Configuracion frontend:
- Si Static Web Apps integra la API bajo `/api`, no exponer connection strings ni secretos en frontend.
- Si el frontend necesita base URL explicita: configurar solo URL publica de API, por ejemplo `API_BASE_URL=https://func-puntoclub-prod-001.azurewebsites.net/api`.
- El `companyId` usado por frontend para construir rutas no es autoridad de seguridad; Functions debe validar contra `PILOT_COMPANY_ID`.

Conexion Functions con Azure SQL:
- Camino minimo piloto: guardar `SQL_CONNECTION_STRING` como app setting secreto en Functions.
- Crear un usuario SQL con permisos minimos sobre la base production, no usar credenciales admin del servidor en la app.
- Restringir firewall de SQL a recursos Azure necesarios y a IPs administrativas puntuales para migraciones.
- Camino mas robusto: habilitar managed identity de Functions y acceso a SQL con identidad administrada. Recomendado cuando Backend/API y migraciones definan el flujo exacto.
- No guardar connection strings en repo, docs, frontend, logs ni archivos `.env` compartidos.

Pasos manuales sugeridos:
1. Confirmar suscripcion Azure, region final y convencion de nombres.
2. Crear resource group `rg-puntoclub-prod-crc-001` con tags.
3. Crear Azure SQL server y database Basic DTU.
4. Configurar firewall SQL solo para administracion temporal y servicios Azure necesarios.
5. Crear usuario SQL de aplicacion con permisos minimos cuando SQL DEV entregue script/migraciones.
6. Crear Function App Consumption con storage runtime y Application Insights.
7. Cargar app settings de Functions: `PILOT_COMPANY_ID`, `SQL_CONNECTION_STRING`, observabilidad y CORS.
8. Crear Static Web App Free conectada al repo/pipeline cuando exista codigo deployable.
9. Configurar URL production y CORS si API queda separada.
10. Ejecutar smoke test cuando Backend/API exista: settings de empresa, clientes, compra, redencion y balance.
11. Activar presupuesto/alerta de costo bajo para el resource group.

IaC minima si corresponde:
- Para piloto, aceptable crear recursos manualmente y documentar valores no secretos.
- Si se quiere repetibilidad desde el inicio, preparar Bicep/Terraform minimo solo para resource group, Static Web Apps, Function App, SQL Database, App Insights y storage runtime.
- No incluir secretos en IaC. Usar parametros seguros, Azure Portal, GitHub Actions secrets o Key Vault si se aprueba.
- No cambiar pipeline sin explicar impacto y confirmar.

Costo estimado:
- Static Web Apps Free: USD 0/mes si el piloto cabe en limites Free.
- Functions Consumption: usualmente USD 0/mes para trafico bajo dentro del grant mensual; puede subir con ejecuciones/memoria.
- Azure SQL Basic DTU: aprox. USD 5/mes, segun region e impuestos.
- Application Insights/logs minimos: aprox. USD 0-5/mes con bajo volumen, retencion corta y sin payloads extensos.
- Storage runtime de Functions y logos pequenos: aprox. USD 0-2/mes.
- Key Vault si se incluye: costo bajo por operaciones; para piloto normal suele ser menor a USD 1/mes, pero no es necesario para el minimo.
- Total production piloto esperado sin staging ni Key Vault: aprox. USD 5-12/mes.
- Total con Key Vault, storage de logos y mas logs: aprox. USD 10-20/mes.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md`, `docs/API_CONTRACTS.md`, `tasks/TASK-002-HANDOFF.md` y `tasks/TASK-011.md`.
- Verificado que la propuesta se pueda ejecutar por pasos y cubra frontend, API, DB, secretos, logs, region, nombres y faltantes antes de deploy.
- Revisadas referencias publicas de Microsoft/Azure para confirmar planes Free/Consumption/Basic y riesgos de costos variables.

Resultado:
Plan production piloto listo. No se crearon recursos reales, no se cambiaron archivos de configuracion/pipeline/codigo y no se guardaron secretos.

Riesgos o pendientes:
- Falta confirmar region y suscripcion Azure antes de crear recursos.
- Falta codigo deployable de frontend/API y pipeline definido.
- Falta script SQL/migraciones de TASK-008/TASK-003 antes de poblar production.
- Falta definir si logos seran URL externa o carga propia.
- Falta decidir si acceso piloto se limita con controles de Azure Static Web Apps, proceso operativo o auth posterior.
- Azure SQL Basic puede ser insuficiente si el piloto crece o hay consultas sin indices.
- CORS depende de si API queda integrada en SWA o separada como Function App publica.
- No se debe loguear payloads con datos sensibles, connection strings ni errores SQL completos.

Siguiente recomendado:
Product / Architect / Release debe confirmar region/suscripcion y si Key Vault se difiere oficialmente. Luego Infra puede preparar checklist de creacion real o IaC minima, y Backend/API debe confirmar nombres exactos de app settings antes del primer deploy.
