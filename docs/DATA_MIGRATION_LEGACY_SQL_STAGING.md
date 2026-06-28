# Staging SQL para importacion legacy

## Objetivo

Preparar una zona SQL segura para recibir datos legacy desde Excel/CSV sin tocar tablas operativas directamente.

La estrategia separa:

1. staging y reporte;
2. aplicacion controlada posterior, solo con aprobacion explicita.

## Scripts

- `database/tools/20260626_legacy_import_staging.sql`
  - crea tablas de staging;
  - crea tabla de mensajes de validacion;
  - crea indices y vista resumen;
  - no carga datos reales;
  - no inserta en `Customers`, `Purchases` ni `Redemptions`.
- `database/tools/legacy_import_validate_staging.sql`
  - valida un batch ya cargado en staging;
  - escribe errores/warnings en `LegacyImportValidationMessages`;
  - actualiza el estado del batch a `validated` o `rejected`;
  - no toca tablas operativas.
- `database/tools/legacy_import_batch_report.sql`
  - reporte read-only por batch.
- `database/tools/legacy_import_invalidate_batch.sql`
  - invalidacion logica de batch no aplicado;
  - conserva evidencia;
  - no borra datos productivos.

## Tablas propuestas

- `dbo.LegacyImportBatches`
- `dbo.LegacyImportCustomerRows`
- `dbo.LegacyImportMovementRows`
- `dbo.LegacyImportValidationMessages`
- `dbo.LegacyImportBatchSummary`

## Trazabilidad

Cada batch y fila conserva:

- `import_batch_id`
- `source_system`
- `source_file`
- `source_row_number`
- `legacy_customer_id`
- `legacy_transaction_id`
- `source_hash`
- `import_status`
- payload raw opcional en JSON

## Flujo local recomendado

1. Crear staging en un ambiente local/controlado.
2. Cargar filas raw desde herramienta local de dry-run.
3. Ejecutar `legacy_import_validate_staging.sql` con `@import_batch_id`.
4. Revisar `LegacyImportValidationMessages`.
5. Ejecutar `legacy_import_batch_report.sql`.
6. Corregir archivo/mapeo si hay errores.
7. Pedir aprobacion Product Owner si solo quedan warnings aceptables.
8. Ejecutar aplicacion a tablas operativas en una tarea posterior, no desde estos scripts.

## Reversa / invalidacion

Antes de aplicar a tablas operativas:

- usar `legacy_import_invalidate_batch.sql`;
- el batch queda `invalidated`;
- filas quedan `rejected`;
- mensajes de validacion conservan evidencia.

Despues de aplicar a tablas operativas:

- no borrar datos directamente;
- preparar plan de compensacion aprobado;
- usar PITR/backup solo bajo procedimiento de Infra/SQL aprobado.

## Limites

- No guardar archivos reales con datos personales en el repo.
- No ejecutar en Azure SQL productiva sin aprobacion.
- No usar estos scripts para aplicar cambios productivos.
- La herramienta de carga Excel/CSV queda para una tarea posterior.
