Equipo: Product / Architect / Release
Modo de ejecucion: Migracion de datos / Preparacion
Tarea: TASK-480 - Definir escenarios y contrato de migracion de datos legacy
Resultado: completada

Archivos cambiados:
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `tasks/TASK-480-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-480-assignment.md`.
- Lectura de `docs/DATA_MODEL.md` para alinear clientes, compras, redenciones y saldo calculado.
- Lectura de `docs/API_CONTRACTS.md` para convenciones de fechas, montos, puntos y errores.
- Lectura de `docs/AZURE_SQL_COST_GUARDRAILS.md` para mantener el enfoque local-first y no despertar Azure SQL.
- Revision documental de que el nuevo plan cubre escenarios, campos requeridos/opcionales, reglas de validacion, trazabilidad y criterios de aceptacion/rechazo.

Evidencia:
- El plan cubre escenarios de clientes solamente, saldo inicial compactado, historico completo, historico parcial con ajuste y archivos mixtos/separados.
- El plan define plantillas sugeridas para:
  - clientes;
  - movimientos;
  - cliente + saldo compactado.
- El plan define trazabilidad por `import_batch_id`, `source_system`, `source_file`, `source_row_number`, `legacy_customer_id`, `legacy_transaction_id` y `source_hash`.
- El plan declara que ningun dato real debe cargarse sin dry-run, reporte y aprobacion explicita del Product Owner.
- El plan separa staging/reporte de aplicacion real a tablas operativas.

Uso cloud/SQL:
- No. No se uso Azure, Azure SQL, API real, servicios externos ni datos reales.
- La tarea fue documental y local.

Riesgos o pendientes:
- P1: aun no existe staging SQL ni scripts de validacion; queda para TASK-481.
- P1: aun no existe herramienta local de carga/dry-run para Excel/CSV; queda para TASK-482.
- P2: aun falta confirmar formato real del proveedor legacy.
- P2: falta decision Product Owner sobre importar historico completo vs saldo inicial compactado.
- P2: falta decidir reglas finales para ajustes negativos y clientes sin telefono/correo.

Siguiente recomendado:
- Ejecutar TASK-481 para preparar staging SQL y scripts seguros.
- Ejecutar TASK-482 despues de TASK-481 para preparar herramienta local de carga Excel/CSV con dry-run.
- No usar Azure SQL ni datos reales hasta que exista dry-run local aprobado por QA.

Movimiento de tablero sugerido:
- Mover TASK-480 a Needs Review / Done.

