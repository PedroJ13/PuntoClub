# TASK-488 - Preparar insumos para primer dry-run real legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Preparacion
Estado: Ready
Prioridad: P1 desbloqueo dry-run real
Depende de: TASK-487

## Objetivo

Preparar y confirmar los insumos minimos para reintentar TASK-487 con un CSV real legacy, sin exponer datos personales ni cargar nada a Azure SQL.

## Contexto

TASK-487 quedo bloqueada porque no existia archivo CSV real en la ruta segura preferida y faltaban confirmaciones obligatorias:

- empresa destino;
- `source_system`;
- escenario de migracion;
- ruta local segura del CSV fuera del repo;
- confirmacion de que el archivo no contiene secretos, passwords, tarjetas, documentos sensibles no necesarios ni datos de otra empresa.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/DATA_MIGRATION_FIRST_REAL_DRY_RUN.md`
- `tasks/TASK-486-HANDOFF.md`
- `tasks/TASK-487-HANDOFF.md`

## Alcance

1. Confirmar la empresa destino del primer dry-run.
2. Confirmar el nombre del sistema legacy para `source_system`.
3. Confirmar el escenario:
   - `customers_only`;
   - `compact_balance`;
   - `full_history`;
   - `partial_history_with_reconciliation`;
   - `mixed_files`.
4. Colocar el archivo CSV real fuera del repo en una ruta segura, preferiblemente:

```text
C:\Work\SecureInputs\PuntoClub\legacy\<empresa>\<batch>\
```

5. Confirmar que el archivo:
   - esta en CSV;
   - tiene encabezados;
   - corresponde solo a la empresa destino;
   - no contiene passwords, tarjetas, documentos sensibles no necesarios ni datos de otra empresa.
6. Preparar el mensaje/instruccion para reenviar TASK-487 con esos parametros.

## Fuera de alcance

- No ejecutar el dry-run.
- No abrir ni inspeccionar filas reales en esta tarea si no es estrictamente necesario.
- No copiar archivos reales al repo.
- No usar Azure SQL.
- No usar API real.
- No cargar staging.
- No publicar Web/API.

## Criterios de aceptacion

- La empresa destino queda confirmada.
- `source_system` queda confirmado.
- El escenario queda confirmado.
- La ruta segura del CSV queda confirmada sin exponer datos personales.
- Queda declarada la confirmacion de seguridad del archivo.
- TASK-487 queda lista para reintento.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, API real ni servicios externos.

Solo preparacion de insumos y confirmaciones.

## Handoff esperado

Crear o actualizar `tasks/TASK-488-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Empresa destino:
Source system:
Escenario:
Ruta segura confirmada:
Confirmacion de seguridad del archivo:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

