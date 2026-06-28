# TASK-481 - Preparar staging SQL y scripts seguros para importacion legacy

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL DEV
Estado: Pending TASK-480
Prioridad: P1 preparacion migracion
Depende de: TASK-480

## Objetivo

Preparar el modelo SQL de staging y scripts locales para validar/importar datos legacy desde Excel/CSV sin tocar datos productivos directamente y con capacidad de dry-run, auditoria y rollback logico.

## Contexto

La migracion debe ser controlada. Los datos legacy pueden venir compactados por cliente o con historico de movimientos. SQL DEV debe proponer una zona de staging que permita revisar errores antes de insertar/actualizar tablas operativas.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MODEL.md`
- `docs/AZURE_SQL_COST_GUARDRAILS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `tasks/TASK-480-HANDOFF.md`

## Alcance

1. Crear scripts SQL en `database/migrations/` o `database/tools/` para staging de importacion legacy.
2. Proponer tablas o estructura de staging para:
   - batches de importacion;
   - filas crudas de clientes;
   - filas crudas de movimientos;
   - errores/warnings de validacion;
   - resumen por batch.
3. Diseñar campos de trazabilidad:
   - `import_batch_id`;
   - `source_system`;
   - `source_file`;
   - `source_row_number`;
   - `legacy_customer_id`;
   - `legacy_transaction_id`;
   - hash o clave idempotente cuando aplique.
4. Crear scripts de validacion SQL para detectar:
   - duplicados internos;
   - clientes sin identificador de match;
   - movimientos sin cliente;
   - fechas invalidas;
   - tipos de movimiento desconocidos;
   - saldos/puntos negativos no permitidos;
   - referencias legacy repetidas.
5. Crear plan de aplicacion en dos fases:
   - staging + reporte;
   - aplicacion controlada posterior, solo con aprobacion.
6. Documentar como revertir o invalidar un batch sin borrar datos productivos.

## Fuera de alcance

- No aplicar scripts en Azure SQL productiva.
- No cargar datos reales.
- No crear endpoints API.
- No crear UI.
- No ejecutar migracion final.
- No borrar datos.

## Criterios de aceptacion

- Existen scripts SQL de staging y validacion.
- Los scripts son idempotentes o declaran claramente precondiciones.
- Los scripts no modifican tablas productivas sin una fase posterior explicita.
- Existe documentacion de ejecucion local/dry-run.
- Existe estrategia para identificar duplicados y evitar doble importacion.

## Uso de cloud / SQL / servicios externos

No usar Azure SQL productiva.

Permitido: revisar archivos SQL locales y, si existe ambiente local/mock, validar sintaxis local sin datos reales.

## Handoff esperado

Crear o actualizar `tasks/TASK-481-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

