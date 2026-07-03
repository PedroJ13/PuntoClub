Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada
Tarea completada: TASK-757 - Preparar script seguro para limpiar destinatarios/envios promocionales de prueba

Archivos cambiados:
- `database/operations/20260702_task757_clean_promotional_test_sends.sql`
- `tasks/TASK-757-HANDOFF.md`

SQL agregado o modificado:
- Se agrego un script operativo versionado para limpieza controlada de marcas de envio promocional de pruebas.
- El script trabaja solo sobre:
  - `dbo.PromotionalCampaignRecipients`
  - `dbo.PromotionalCampaigns`
- El script no modifica:
  - `dbo.Customers`
  - puntos, compras, canjes, membresias o beneficios
  - `dbo.CustomerPromotionalEmailPreferences`
  - `dbo.PromotionalUnsubscribeEvents`
  - `dbo.PromotionalCampaignImages`
  - campanas/plantillas como registros

Controles incluidos:
- `@DryRun = 1` por defecto.
- Para aplicar requiere cambiar:
  - `@DryRun = 0`
  - `@ConfirmTask = N'TASK-757-APPLY'`
- Filtros opcionales:
  - `@CompanyId`
  - `@CampaignId`
  - `@SelectedFromUtc`
  - `@SelectedToUtc`
- `SET XACT_ABORT ON`.
- Transaccion explicita.
- `ROLLBACK` automatico en dry-run.
- `COMMIT` solo en modo apply confirmado.
- Detiene la ejecucion si los recipients seleccionados estan referenciados por `dbo.PromotionalUnsubscribeEvents`.

Evidencia previa incluida en el script:
- Parametros de ejecucion.
- Conteos por empresa, campana, estado de campana y estado de recipient.
- Detalle exportable de recipients seleccionados para limpieza.
- Snapshot de campanas afectadas con conteos por estado antes de limpiar.

Limpieza preparada:
- `DELETE` controlado de filas seleccionadas en `dbo.PromotionalCampaignRecipients`.
- `UPDATE` controlado de `dbo.PromotionalCampaigns` afectadas:
  - `status = 'draft'`
  - `confirmed_at = NULL`
  - `sent_at = NULL`
  - `updated_at = SYSUTCDATETIME()`
- El update aplica solo a campanas afectadas con estado `ready`, `sending`, `sent` o `failed`.

Validacion posterior incluida:
- Conteo de recipients seleccionados que aun queden despues del delete.
- Snapshot posterior de campanas afectadas.
- Error controlado si algun recipient seleccionado sigue existiendo dentro de la transaccion.

Rollback plan:
- Antes de aplicar, guardar/exportar los result sets de evidencia.
- Si se requiere reversar despues de commit:
  - reconstruir recipients desde el detalle exportado;
  - restaurar estado/timestamps de campanas desde el snapshot previo;
  - hacerlo solo con aprobacion explicita de Product/SQL DEV.
- Si se ejecuta en dry-run, el propio script hace rollback automaticamente.

Verificacion ejecutada:
- Revision estatica del script.
- `rg` de guardrails clave:
  - `@DryRun`
  - `@ConfirmTask`
  - `PromotionalUnsubscribeEvents`
  - `DELETE recipients`
  - `UPDATE campaigns`
  - `ROLLBACK`
  - `COMMIT`
- `git diff --check -- database/operations/20260702_task757_clean_promotional_test_sends.sql`

Resultado:
- Script preparado localmente.
- No se ejecuto contra Azure SQL.
- No se modificaron datos reales.
- No se enviaron correos reales.

Uso Azure SQL:
- No.
- Motivo: la tarea era preparar el script seguro; TASK-756 indica no ejecutar contra Azure SQL sin aprobacion posterior.

Riesgos o pendientes:
- Antes de aplicar en Azure SQL, SQL DEV/Infra debe leer `docs/AZURE_SQL_COST_GUARDRAILS.md` y coordinar ventana corta.
- Revisar manualmente todos los SELECT previos antes de cambiar `@DryRun = 0`.
- Si aparecen referencias en `PromotionalUnsubscribeEvents`, el script se detiene y requiere decision separada.
- Si los conteos muestran datos dudosos/no relacionados con pruebas, no aplicar limpieza global.

Siguiente recomendado:
- Crear tarea separada para ejecutar el script en modo dry-run contra Azure SQL y revisar evidencia.
- Solo despues de aprobar evidencia, ejecutar en modo apply controlado.
