Equipo:
Infra / Azure

Tarea completada:
Propuesta de recursos Azure minimos para operar el piloto de Punto Club con bajo costo y sin exponer secretos.

Recursos recomendados:
- Frontend: Azure Static Web Apps Free para el piloto inicial. Usar GitHub como fuente de despliegue cuando exista codigo de frontend. Pasar a Standard solo si se requiere SLA, ambientes empresariales o controles avanzados.
- API: Azure Functions en Consumption plan. Mantiene costo bajo para trafico intermitente y encaja con endpoints pequenos del MVP.
- SQL Database: Azure SQL Database Single Database en DTU Basic como punto de entrada minimo para piloto real. Mantener una sola base production al inicio; no definir modelo SQL desde Infra.
- Secretos/configuracion: App settings de Azure Static Web Apps / Azure Functions para configuracion no secreta y connection strings. Para piloto, no guardar secretos en repo ni frontend. Si aparecen mas secretos o rotacion frecuente, agregar Azure Key Vault como P1 pre-lanzamiento.
- Logs minimos: Application Insights conectado a Functions con retencion baja y alertas simples. Static Web Apps con logs operativos basicos. Revisar muestreo para evitar costo accidental.
- Storage para logos: diferir si los logos pueden usar URL externa validada. Si se requiere carga propia, Azure Storage Account GPv2 con Blob Storage Hot, LRS, contenedor privado o acceso por URLs firmadas/SAS; no hacer contenedor publico por defecto.

Costo estimado:
- Azure Static Web Apps Free: USD 0/mes para piloto si entra en limites del plan.
- Azure Functions Consumption: USD 0/mes si el piloto queda dentro del grant mensual usual de Consumption; costo bajo si excede.
- Azure SQL Database Basic DTU: aprox. USD 5/mes, dependiente de region e impuestos.
- Application Insights / Azure Monitor: aprox. USD 0-5/mes si el volumen de logs es bajo y se controla retencion/muestreo.
- Blob Storage Hot LRS para logos: aprox. USD 0-1/mes para volumen pequeno de imagenes; operaciones y egreso podrian sumar centavos.
- Total minimo esperado: aprox. USD 5-12/mes para production piloto sin staging permanente. Con Key Vault, storage activo y mas logs, estimar USD 10-20/mes.

Variables/secretos:
- API_BASE_URL o equivalente para que frontend apunte a Functions, si no se usa integracion nativa de SWA.
- AZURE_FUNCTIONS_ENVIRONMENT=Production.
- SQL_CONNECTION_STRING como secreto en Function App / Static Web Apps API settings, nunca en repo.
- SQL_SERVER_NAME, SQL_DATABASE_NAME y SQL_USER solo si el stack los necesita separados; preferir connection string completa en secreto.
- SQL_PASSWORD como secreto, nunca en archivo.
- CORS_ALLOWED_ORIGINS si la API queda separada de Static Web Apps.
- STORAGE_ACCOUNT_NAME solo si se habilita Blob Storage.
- STORAGE_CONTAINER_LOGOS solo si se habilita Blob Storage.
- STORAGE_CONNECTION_STRING o identidad administrada + permisos RBAC si se habilita Blob Storage; preferir identidad administrada cuando el diseno este listo.
- APPINSIGHTS_CONNECTION_STRING para observabilidad de Functions.

Verificacion ejecutada:
- Revisado `chat-start/INFRA.md`, `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md` y `tasks/TASK-002.md`.
- Verificado que la propuesta cubre deploy/frontend, API, base de datos, secretos/configuracion, logs minimos y storage opcional para logos.
- Contrastado costo minimo con planes Azure de bajo costo: Static Web Apps Free, Functions Consumption, SQL Database Basic DTU, Application Insights con bajo volumen y Blob Storage Hot LRS pequeno.

Resultado:
Recomendacion Infra: iniciar con local + production. No crear staging permanente todavia. Usar staging solo como entorno temporal o preview de Static Web Apps hasta que haya flujo QA/release que lo justifique.

Riesgos o pendientes:
- Azure SQL Basic puede quedarse corto si hay muchas transacciones, reportes o consultas sin indices; SQL DEV debe definir modelo, indices y estrategia de migraciones antes de produccion real.
- Auth fase 1 sigue pendiente en arquitectura; impacta secretos, CORS, permisos y posible costo.
- Storage de logos debe decidirse despues de UX/API: URL externa es mas barato y simple; carga propia requiere reglas de acceso, validacion de tipos/tamanos y borrado.
- Key Vault no es obligatorio para el piloto minimo, pero conviene si se manejan varios secretos, rotacion o mas de un ambiente.
- Application Insights puede crecer en costo si se loguean payloads o datos sensibles; se debe evitar PII/secrets y configurar retencion/muestreo.

Siguiente recomendado:
SQL DEV debe cerrar TASK-003 con modelo inicial. Luego Backend/API puede definir contratos y decidir si Functions usara connection string directa como secreto o identidad administrada con permisos especificos.
