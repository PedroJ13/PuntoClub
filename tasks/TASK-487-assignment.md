# TASK-487 - Ejecutar primer dry-run real legacy con CSV

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Pending archivo real CSV y confirmacion Product Owner
Prioridad: P1 dry-run real controlado
Depende de: TASK-486

## Objetivo

Ejecutar el primer dry-run real de migracion legacy usando archivo CSV provisto fuera del repo, sin Azure SQL, sin API real y sin aplicar datos productivos.

## Contexto

TASK-486 definio que el primer dry-run real se hara con CSV. Si el proveedor entrega Excel, debe convertirse a CSV antes de esta tarea o abrirse una tarea separada para parser `.xlsx`.

Esta tarea no importa datos a Punto Club. Solo genera reporte local y evidencia redaccionada para que Product / Architect / Release decida el siguiente paso.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- `docs/DATA_MIGRATION_FIRST_REAL_DRY_RUN.md`
- `docs/TOOLS.md`
- `tools/migration/README.md`
- `tasks/TASK-486-HANDOFF.md`

## Precondiciones

Antes de ejecutar:

1. Product Owner confirma empresa destino.
2. Product Owner confirma `source_system`.
3. Product Owner confirma escenario:
   - `customers_only`;
   - `compact_balance`;
   - `full_history`;
   - `partial_history_with_reconciliation`;
   - `mixed_files`.
4. El archivo real esta convertido a CSV.
5. El archivo real esta fuera del repo.
6. El responsable confirma que no contiene datos de otra empresa ni secretos.

## Alcance

1. Ejecutar `npm run migration:dry-run` contra el CSV real desde ruta segura.
2. Generar outputs en ruta segura fuera del repo o ruta ignorada temporal.
3. Revisar `summary.md`, `summary.json` y `validation-messages.jsonl`.
4. Preparar handoff redaccionado con:
   - conteos;
   - errores por tipo;
   - warnings por tipo;
   - decision sugerida;
   - limitaciones.
5. Confirmar que no quedaron archivos reales ni outputs con PII en el repo.

## Fuera de alcance

- No abrir parser `.xlsx`.
- No usar Azure SQL.
- No cargar staging SQL real.
- No insertar/actualizar `Customers`, `Purchases`, `Redemptions` ni otras tablas operativas.
- No crear endpoints API.
- No publicar Web/API.
- No commitear archivos reales ni outputs con PII.

## Criterios de aceptacion

- El dry-run corre o falla de forma controlada.
- El handoff no expone PII.
- El handoff indica si el batch esta apto, requiere limpieza o requiere decision.
- No quedan archivos reales en el repo.
- No se uso Azure SQL ni API real.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, API real ni servicios externos.

Solo dry-run local sobre CSV real en ruta segura.

## Handoff esperado

Crear o actualizar `tasks/TASK-487-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Empresa destino:
Source system:
Escenario:
Archivos procesados:
Resumen redaccionado:
Errores/warnings:
Verificacion de seguridad:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

