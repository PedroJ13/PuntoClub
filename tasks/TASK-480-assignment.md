# TASK-480 - Definir escenarios y contrato de migracion de datos legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Migracion de datos / Preparacion
Estado: Ready
Prioridad: P1 preparacion migracion
Depende de: Solicitud Product Owner de preparar carga desde Excel/CSV legacy

## Objetivo

Definir el contrato funcional y operativo para recibir datos de un sistema legacy en Excel o CSV, contemplando escenarios con historico completo, datos compactados por cliente o combinacion de ambos.

## Contexto

Se espera una migracion de datos desde un sistema viejo hacia Punto Club. Aun no se sabe si los datos llegaran:

- en una sola transaccion compactada por cliente;
- como historico completo de movimientos por cliente;
- como archivos separados de clientes, saldos y movimientos;
- con datos incompletos o inconsistentes.

Antes de crear scripts definitivos, Proyecto debe dejar claro el criterio de interpretacion, validacion, trazabilidad y aprobacion.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS.md`
- `docs/AZURE_SQL_COST_GUARDRAILS.md`

## Alcance

1. Crear un documento nuevo en `docs/` para el plan de migracion legacy.
2. Definir escenarios soportados:
   - clientes solamente;
   - clientes + saldo inicial compactado;
   - clientes + historico completo de movimientos;
   - clientes + historico parcial + saldo de ajuste;
   - archivos mixtos o separados.
3. Definir campos minimos requeridos para clientes:
   - identificador legacy si existe;
   - nombre;
   - telefono;
   - correo;
   - estado;
   - fecha de alta si existe.
4. Definir campos minimos para movimientos:
   - identificador legacy de movimiento si existe;
   - identificador legacy de cliente o dato de match;
   - fecha;
   - tipo;
   - monto;
   - puntos;
   - descripcion/referencia.
5. Definir reglas de negocio para:
   - duplicados;
   - clientes sin telefono/correo;
   - acentos y mayusculas;
   - fechas y zona horaria;
   - montos negativos;
   - puntos redimidos vs acumulados;
   - saldo inicial cuando no hay historico.
6. Definir estrategia de trazabilidad:
   - `source_system`;
   - `source_file`;
   - `source_row_number`;
   - `legacy_customer_id`;
   - `legacy_transaction_id`;
   - `import_batch_id`.
7. Definir plantillas esperadas para Excel/CSV y ejemplos de encabezados.
8. Definir criterios para que un archivo real pueda pasar a importacion controlada.

## Fuera de alcance

- No crear scripts SQL.
- No crear codigo de importacion.
- No tocar Azure SQL.
- No cargar datos reales.
- No transformar archivos reales de clientes.
- No publicar Web/API.

## Criterios de aceptacion

- Existe un documento `docs/DATA_MIGRATION_LEGACY_PLAN.md` o equivalente.
- El documento cubre al menos 3 escenarios de llegada de datos.
- El documento define campos requeridos/opcionales y reglas de validacion.
- El documento define trazabilidad por archivo, fila, cliente legacy, transaccion legacy y batch.
- El documento declara que ningun dato real debe cargarse sin dry-run y aprobacion del Product Owner.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, servicios externos ni datos reales.

Esta tarea es documental y local.

## Handoff esperado

Crear o actualizar `tasks/TASK-480-HANDOFF.md` con:

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

