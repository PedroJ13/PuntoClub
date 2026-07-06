Equipo: SQL DEV
Modo de ejecucion: Modelo de datos / Cumpleanos
Tarea completada: TASK-774 - Preparar migracion SQL para fecha de nacimiento y tipo de campana

Archivos cambiados:
- `database/migrations/20260705_birthdays_campaign_type.sql`
- `tasks/TASK-774-HANDOFF.md`

Ambiente:
- Local workspace.
- No se aplico migracion en Azure SQL.

Implementacion:
- Se preparo migracion versionada para agregar `dbo.Customers.birth_date` nullable.
- Se agregaron columnas calculadas persistidas `birth_month` y `birth_day`.
- Se agrego indice filtrado `IX_Customers_company_birth_month_day` para busqueda eficiente por empresa, mes y dia.
- Se agrego trigger `TR_Customers_birth_date_not_future` para impedir fechas futuras.
- Se preparo `dbo.PromotionalCampaigns.campaign_type` con default `comun`.
- Se agrego constraint `CK_PromotionalCampaigns_campaign_type` para valores `comun` y `cumpleanos`.
- Se agrego indice `IX_PromotionalCampaigns_company_type_status_created`.

Verificacion ejecutada:
- Revision estatica del script SQL preparado.

Resultado:
- Migracion lista para decision posterior de release/aplicacion.
- Las campanas existentes quedarian con `campaign_type = 'comun'` por `DEFAULT ... WITH VALUES`.

Uso Azure SQL:
- No.
- Motivo: la tarea pidio preparar migracion, no aplicarla.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- La validacion de fecha futura se implementa con trigger porque SQL Server no permite una restriccion `CHECK` confiable con fecha actual dinamica.
- Requiere tarea posterior explicita para aplicar en Azure SQL.
