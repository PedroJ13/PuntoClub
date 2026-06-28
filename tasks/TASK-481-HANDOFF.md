Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL DEV
Tarea: TASK-481 - Preparar staging SQL y scripts seguros para importacion legacy

Resultado:
Completada localmente. Se preparo una zona SQL de staging para importacion legacy y scripts auxiliares de validacion, reporte e invalidacion logica de batches. Los scripts no cargan datos reales, no aplican migracion final y no modifican tablas operativas como `Customers`, `Purchases` o `Redemptions`.

Archivos cambiados:
- `database/tools/20260626_legacy_import_staging.sql`
- `database/tools/legacy_import_validate_staging.sql`
- `database/tools/legacy_import_batch_report.sql`
- `database/tools/legacy_import_invalidate_batch.sql`
- `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- `tasks/TASK-481-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-480-HANDOFF.md` para confirmar dependencia.
- Lectura de `docs/DATA_MIGRATION_LEGACY_PLAN.md`, `docs/DATA_MODEL.md` y `docs/AZURE_SQL_COST_GUARDRAILS.md`.
- Revision de migraciones existentes para seguir estilo idempotente con `IF OBJECT_ID... IS NULL`.
- `git diff --check` sobre scripts y documentacion: OK.
- Barrido de seguridad para confirmar ausencia de `INSERT`, `UPDATE`, `DELETE` o `MERGE` contra tablas operativas principales: sin coincidencias.
- Barrido de patrones destructivos (`DROP TABLE`, `TRUNCATE TABLE`, `ALTER TABLE dbo.Customers/Purchases/Redemptions/Companies`, deletes productivos): sin coincidencias.

Evidencia:
- Staging propuesto:
  - `dbo.LegacyImportBatches`
  - `dbo.LegacyImportCustomerRows`
  - `dbo.LegacyImportMovementRows`
  - `dbo.LegacyImportValidationMessages`
  - `dbo.LegacyImportBatchSummary`
- Trazabilidad incluida:
  - `import_batch_id`
  - `source_system`
  - `source_file`
  - `source_row_number`
  - `legacy_customer_id`
  - `legacy_transaction_id`
  - `source_hash`
  - `import_status`
  - `raw_payload` opcional en JSON
- Validaciones cubiertas:
  - clientes sin identificador de match;
  - duplicados internos por `legacy_customer_id`;
  - telefono/email repetidos como warning;
  - movimientos sin cliente;
  - fechas invalidas;
  - fechas futuras como warning;
  - tipos de movimiento desconocidos;
  - puntos no enteros;
  - puntos negativos no permitidos salvo ajuste negativo explicito;
  - `legacy_transaction_id` repetido;
  - movimientos que no encuentran cliente en staging.
- Reversa logica:
  - `legacy_import_invalidate_batch.sql` invalida batches no aplicados, marca filas como `rejected` y conserva evidencia sin borrar datos productivos.

Uso cloud/SQL:
- Azure SQL: No.
- Azure cloud: No.
- SQL local real: No.
- Datos reales: No.
- Red/servicios externos: No.

Riesgos o pendientes:
- No se ejecuto contra un motor SQL real; la validacion fue estatica/local por alcance y por prohibicion de usar Azure SQL productiva.
- La herramienta que carga Excel/CSV hacia estas tablas queda pendiente para TASK-482.
- La aplicacion desde staging hacia tablas operativas queda fuera de alcance y debe ser una tarea posterior con aprobacion explicita.
- Quedan decisiones Product Owner pendientes desde TASK-480: historico completo vs saldo inicial, ajustes negativos y manejo de clientes sin telefono/correo.

Siguiente recomendado:
Ejecutar TASK-482 para preparar herramienta local de carga Excel/CSV con dry-run sobre el staging, usando datos sinteticos primero.

Movimiento de tablero sugerido:
Mover TASK-481 a Needs Review / Done tecnico y mantener bloqueada cualquier importacion real hasta QA local y aprobacion Product Owner.
