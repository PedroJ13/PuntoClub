Equipo: SQL DEV
Modo de ejecucion: SQL Azure / Migracion aprobada
Tarea completada: TASK-783 - Aplicar migracion SQL de cumpleanos y tipos de campana

Archivos cambiados:
- `tasks/TASK-783-HANDOFF.md`

SQL aplicado:
- Se aplico en Azure SQL la migracion:
  - `database/migrations/20260705_birthdays_campaign_type.sql`
- Base objetivo:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`

Resultado:
- Migracion aplicada correctamente.
- No se borraron datos.
- No se tocaron clientes, puntos, compras, canjes, membresias, ACS, sender ni flags.
- No se imprimieron ni guardaron secretos.

Ejecucion:
- Conexion usada:
  - token AAD de Azure CLI para `https://database.windows.net/`;
  - Node + `mssql`;
  - sin connection string ni password en archivos/logs.
- Ejecucion de batches separados por `GO`:
  - `batch 1/11 ok`
  - `batch 2/11 ok`
  - `batch 3/11 ok`
  - `batch 4/11 ok`
  - `batch 5/11 ok`
  - `batch 6/11 ok`
  - `batch 7/11 ok`
  - `batch 8/11 ok`
  - `batch 9/11 ok`
  - `batch 10/11 ok`
  - `batch 11/11 ok`

Validacion ejecutada:
- Base conectada:
  - `sql-db-puntoclub`
- Columnas en `dbo.Customers`:
  - `birth_date` tipo `date`, nullable;
  - `birth_month` tipo `int`, computed;
  - `birth_day` tipo `int`, computed.
- Columna en `dbo.PromotionalCampaigns`:
  - `campaign_type` tipo `varchar`, not nullable.
- Constraints / trigger:
  - `CK_PromotionalCampaigns_campaign_type`;
  - `DF_PromotionalCampaigns_campaign_type`;
  - `TR_Customers_birth_date_not_future`.
- Indices:
  - `IX_Customers_company_birth_month_day` con filtro;
  - `IX_PromotionalCampaigns_company_type_status_created`.
- Tipos actuales de campanas:
  - `comun`: `2`.
- Tipos invalidos:
  - `0`.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task783-birthdays-200-229-6-68`
  - IP: `200.229.6.68`
- La regla temporal se retiro al finalizar.
- Verificacion final de regla temporal:
  - `[]`
- Para retirar la regla fue necesario quitar temporalmente el lock del SQL Server:
  - `puntoclub-sqlserver-cannotdelete`
- El lock fue restaurado con la misma nota.
- Locks verificados al cierre:
  - `puntoclub-sqlserver-cannotdelete`
  - `puntoclub-sqldb-cannotdelete`

Uso Azure SQL:
- Si.
- Motivo: aplicar migracion SQL aprobada.
- Alcance: DDL idempotente y validacion read-only de metadatos en ventana corta.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- Backend/API y Web deben publicarse en tareas separadas para usar los nuevos campos en ambiente publicado.
- QA debe validar despues del release que campanas comunes siguen funcionando y que campanas de cumpleaños filtran destinatarios segun fecha de nacimiento.
