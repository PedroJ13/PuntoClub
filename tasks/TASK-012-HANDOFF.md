Equipo: QA
Tarea completada: TASK-012 - Validar SQL/API base
Archivos cambiados:
- tasks/TASK-012-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/QA_TEST_PLAN.md.
- Leido docs/API_CONTRACTS.md.
- Leido docs/DATA_MODEL.md.
- Leido tasks/TASK-012.md.
- Revisado tasks/TASK-008-HANDOFF.md.
- Revisado database/schema.sql.
- Revisado database/seed.sql.
- Confirmado que tasks/TASK-009-HANDOFF.md no existe.
- Busqueda de artefactos API ejecutable sin resultados para host.json, package.json, function.json, *.js, *.ts, *.py, *.csproj o *.fsproj.

Resultado:
- No aprobado.
- No se pudo ejecutar checklist API/SQL contra endpoints porque no hay estructura API ni ambiente local/Azure disponible en el repo.
- La base SQL tiene cobertura estatica para constraints criticos: cliente por empresa, factura unica por empresa, saldo por vista, redencion por procedimiento y seed de empresa piloto.
- No se puede confirmar que la base este lista para integracion Web Dev porque falta la primera API contra SQL o su handoff de Backend/API.

Hallazgos:
- P1: API base no disponible para validar crear cliente, duplicados, compras, saldo ni errores HTTP.
- P1: No hay evidencia de ejecucion de database/schema.sql y database/seed.sql contra una base local o Azure SQL.
- P2: SQL cubre estaticamente factura duplicada y cliente duplicado, pero QA no pudo comprobar ejecucion real ni mapeo de errores API.
- P2: Redencion tiene procedimiento dbo.RegisterRedemption en schema.sql, pero no hay endpoint confirmado para validarla.

P0/P1:
- P1: Sin API ejecutable, el flujo SQL/API base no puede aprobarse.
- P1: Sin base ejecutada, no hay evidencia operativa de saldo, duplicados o separacion por empresa.

P2/P3:
- P2: Validacion SQL solo estatica hasta que Infra/Backend provean base y conexion segura.
- P2: Redenciones dependen de endpoint API y mapeo de errores.

Evidencia:
- tasks/TASK-009-HANDOFF.md: no existe.
- rg de artefactos API ejecutable: sin resultados.
- database/schema.sql contiene:
  - UX_Purchases_company_invoice.
  - UX_Customers_company_phone.
  - UX_Customers_company_email.
  - dbo.CustomerPointBalances.
  - dbo.RegisterRedemption.
- database/seed.sql prepara companyId 1, Cafe Central, points_percentage 5.00, status active.

Riesgos o pendientes:
- Backend/API debe implementar endpoints y mapear errores a contratos:
  - 409 DUPLICATE_CUSTOMER.
  - 409 DUPLICATE_INVOICE.
  - 409 INSUFFICIENT_POINTS.
  - 404 COMPANY_NOT_FOUND.
  - 404 CUSTOMER_NOT_FOUND.
  - 400 VALIDATION_ERROR.
- Infra/Backend debe proveer ambiente local o Azure con SQL ejecutado y configuracion segura de PILOT_COMPANY_ID = 1.
- QA debe repetir TASK-012 cuando existan endpoints y base ejecutable.
- No aprobar integracion Web Dev contra API hasta cerrar P1.

Siguiente recomendado:
- Backend/API debe completar TASK-009 y entregar tasks/TASK-009-HANDOFF.md con comandos/URL de prueba.
- Infra o Backend debe confirmar ejecucion de schema.sql y seed.sql en una base accesible para QA sin exponer secretos.
- Luego QA ejecuta el checklist parcial con los datos de docs/QA_TEST_PLAN.md y actualiza este handoff o crea una nueva validacion.
