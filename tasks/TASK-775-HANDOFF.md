Equipo: Backend/API
Modo de ejecucion: API / Cumpleanos
Tarea completada: TASK-775 - Implementar contratos API locales para cumpleanos y tipos de campana

Archivos cambiados:
- `api/src/functions/customers.js`
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `api/test/validators.test.js`
- `tasks/TASK-775-HANDOFF.md`

Ambiente:
- Local.
- No se uso Azure SQL.
- No se enviaron correos reales.

Implementacion:
- `Customers` ahora soporta `birthDate` nullable y `profileIncomplete`.
- `POST /api/companies/{companyId}/customers` acepta `birthDate`.
- Nuevo `PATCH /api/companies/{companyId}/customers/{customerId}` para actualizar datos editables del cliente, incluyendo fecha de nacimiento.
- Nuevo `GET /api/companies/{companyId}/customers/birthdays/today` con resumen de cumpleaneros del dia.
- Campanas promocionales ahora aceptan/devuelven `campaignType` con valores `comun` y `cumpleanos`.
- Crear, actualizar, listar, obtener, previsualizar y enviar campanas conservan el tipo.
- La seleccion/envio de campanas `cumpleanos` filtra destinatarios a clientes que cumplen anos hoy, tienen email valido y no tienen baja promocional.
- `listPromotionalRecipients` acepta `birthdayOnly=true` para alimentar la UI.

Verificacion ejecutada:
- `node --check api/src/lib/validators.js`
- `node --check api/src/lib/repository.js`
- `node --check api/src/functions/customers.js`
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js`
- `npx prettier --check ...`

Resultado:
- Checks de sintaxis aprobados.
- Tests relevantes aprobados: 56/56.
- Prettier aprobado.

Uso Azure SQL:
- No.
- Motivo: implementacion local de contratos; migracion no aplicada por esta tarea.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- Para probar contra base real se requiere aplicar primero la migracion de TASK-774 en una tarea SQL aprobada.
- No se habilito ni ejecuto envio real de correos.
