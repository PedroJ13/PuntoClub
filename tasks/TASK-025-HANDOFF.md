Equipo: QA
Tarea completada: TASK-025 - Revalidar SQL/API real despues de smoke test
Archivos cambiados:
- tasks/TASK-025-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-025.md.
- Leido tasks/TASK-024-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/QA_TEST_PLAN.md.
- Leido docs/API_CONTRACTS.md.
- Leido api/scripts/smoke-test.js.
- Confirmado sin exponer secretos que api/local.settings.json existe y contiene:
  - SQL_CONNECTION_STRING configurado.
  - PILOT_COMPANY_ID=1.
  - FUNCTIONS_WORKER_RUNTIME=node.
- Levantado servidor local con `npm run serve:local` usando la configuracion local disponible.
- Ejecutado GET real a `http://localhost:7071/api/companies/1/customers`.
- Ejecutado GET real a `http://localhost:7071/api/companies/999/customers`.
- Ejecutado `npm run smoke`.
- Detenido el servidor local al terminar.

Resultado:
- No aprobado.
- Aunque TASK-024 reporto smoke exitoso previamente, en esta pasada QA el ambiente real local no pudo ejecutar el checklist porque las operaciones que requieren SQL devuelven `500 INTERNAL_ERROR`.
- Solo se confirmo el error contratado `404 COMPANY_NOT_FOUND` para `companyId` incorrecto, porque ese caso se resuelve antes de consultar SQL.
- No se puede aprobar la base SQL/API real hasta que el smoke vuelva a pasar en la sesion QA o exista una URL Azure/API estable para ejecutar las pruebas.

Checks ejecutados:
- API local arriba:
  - `npm run serve:local`.
  - Servidor escuchando en `http://localhost:7071/api`.
- `GET /api/companies/1/customers`:
  - Resultado: `500 INTERNAL_ERROR`.
- `GET /api/companies/999/customers`:
  - Resultado: `404 COMPANY_NOT_FOUND`.
- `npm run smoke`:
  - Resultado: fallo en `POST /companies/1/customers`.
  - Esperado: `201`.
  - Recibido: `500 INTERNAL_ERROR`.

Checks no ejecutados o no completados por bloqueo:
- Crear cliente.
- Validar cliente duplicado.
- Registrar compra.
- Validar factura duplicada.
- Consultar saldo.
- Validar redencion real.
- Confirmar `409 DUPLICATE_CUSTOMER`.
- Confirmar `409 DUPLICATE_INVOICE`.
- Confirmar `409 INSUFFICIENT_POINTS`.
- Confirmar `404 CUSTOMER_NOT_FOUND`.
- Confirmar `400 VALIDATION_ERROR`.

Hallazgos:
- P1: Operaciones reales contra SQL fallan con `500 INTERNAL_ERROR`; bloquea crear cliente y, por cascada, compras, saldo, redenciones y duplicados.
- P1: Smoke test real no pasa en la sesion QA actual.
- P2: `404 COMPANY_NOT_FOUND` para `companyId` incorrecto si esta alineado al contrato.
- P2: La causa probable es ambiente/conectividad SQL local, consistente con el antecedente de TASK-024 donde el primer smoke fallo por firewall Azure SQL; QA no modifico firewall ni Azure.

P0/P1:
- P1: No se puede validar integridad de puntos, duplicados, saldos ni redenciones contra Azure SQL en esta pasada.
- P1: No aprobar integracion Web Dev ni cierre de SQL/API real mientras el smoke falle con 500.

P2/P3:
- P2: El ambiente local depende de acceso de red/firewall hacia Azure SQL; puede no ser repetible sin regla temporal o API desplegada.
- P2: Falta una URL Azure/API estable para QA que no dependa de levantar servidor local en esta maquina.

Evidencia:
- TASK-024-HANDOFF reporta smoke exitoso anterior:
  - customerId 1.
  - balanceBefore 50.
  - balanceAfter 49.
- Pasada QA actual:
  - `GET /api/companies/1/customers` devuelve:
    - `{"error":{"code":"INTERNAL_ERROR","message":"Unexpected API error."}}`
  - `GET /api/companies/999/customers` devuelve:
    - `{"error":{"code":"COMPANY_NOT_FOUND","message":"Company was not found."}}`
  - `npm run smoke` devuelve:
    - `POST /companies/1/customers expected 201, got 500`.
- Servidor local fue detenido despues de la prueba.
- No se imprimieron secretos.

Riesgos o pendientes:
- Revisar conectividad SQL/firewall para la sesion QA actual.
- Evitar depender de reglas temporales locales para una validacion repetible.
- Entregar a QA una API desplegada o un procedimiento claro para habilitar temporalmente la IP local sin exponer secretos.
- Agregar trazabilidad segura de errores internos para distinguir firewall, login SQL, DB pausada u otro fallo sin exponer detalles sensibles al cliente.

Siguiente recomendado:
- Backend/API o Infra debe revalidar `npm run smoke` en una sesion disponible para QA o entregar URL Azure Functions configurada contra `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Cuando el smoke pase nuevamente en ambiente QA, repetir TASK-025 y completar los casos negativos contratados.
