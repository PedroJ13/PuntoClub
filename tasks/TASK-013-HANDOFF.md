Equipo: QA
Tarea completada: TASK-013 - Revalidar SQL/API base despues de Backend/API
Archivos cambiados:
- tasks/TASK-013-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/QA_TEST_PLAN.md.
- Leido docs/API_CONTRACTS.md.
- Leido tasks/TASK-013.md.
- Leido tasks/TASK-009-HANDOFF.md.
- Revisada estructura API en api/.
- Ejecutado `npm test` en api/.
- Confirmado que api/local.settings.json no existe.
- Confirmado sin exponer secretos que `SQL_CONNECTION_STRING` no esta configurado en el entorno.
- Confirmado que `PILOT_COMPANY_ID` no esta configurado en el entorno.

Resultado:
- No aprobado.
- La API base ya existe y las pruebas unitarias pasan.
- No se pudo ejecutar validacion end-to-end SQL/API porque no hay ambiente local o Azure con SQL accesible desde QA.
- No se puede confirmar que la base este lista para integracion Web Dev hasta probar endpoints reales contra SQL.

Checks ejecutados:
- `npm test` en api/: 7 tests pasaron.
- Validaciones unitarias cubiertas:
  - mapeo de factura duplicada a `409 DUPLICATE_INVOICE`.
  - mapeo de cliente duplicado a `409 DUPLICATE_CUSTOMER`.
  - mapeo de saldo insuficiente en redencion a `409 INSUFFICIENT_POINTS`.
  - calculo server-side de puntos.
  - rechazo de `pointsEarned` enviado por frontend.
  - normalizacion de email opcional.
  - redencion requiere puntos enteros positivos.

Checks no ejecutados por falta de ambiente:
- Crear cliente contra endpoint real.
- Validar cliente duplicado contra SQL.
- Registrar compra contra endpoint real.
- Validar factura duplicada contra SQL.
- Consultar saldo real.
- Validar redencion real.
- Confirmar `404 COMPANY_NOT_FOUND` con `companyId` distinto a `PILOT_COMPANY_ID`.
- Confirmar `404 CUSTOMER_NOT_FOUND` contra SQL.
- Confirmar `400 VALIDATION_ERROR` desde endpoints reales.

Hallazgos:
- P1: No existe ambiente API/SQL ejecutable para QA; falta `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID` configurados sin exponer secretos.
- P1: No hay evidencia QA de que `database/schema.sql` y `database/seed.sql` esten ejecutados en una base accesible.
- P1: No se pudieron validar saldos, duplicados ni separacion por empresa contra persistencia real.
- P2: `createRedemption` depende de recuperar el ultimo movimiento compatible despues de ejecutar `dbo.RegisterRedemption`; el propio handoff de Backend/API reconoce que no garantiza id exacto si se requiere precision.
- P2: La respuesta de redencion construye `createdAt` desde la fecha de actividad, no desde timestamp de creacion; revisar contra contrato cuando se ejecute endpoint real.

P0/P1:
- P1: Sin ambiente SQL/API real, TASK-013 no puede aprobarse.
- P1: Sin validacion real de saldo, duplicados y companyId, no aprobar integracion Web Dev contra API.

P2/P3:
- P2: Riesgo de respuesta imprecisa en redenciones hasta que SQL/API devuelva el registro insertado de forma deterministica.
- P2: Contrato de `createdAt` en redenciones debe verificarse/corregirse cuando exista prueba real.

Evidencia:
- `tasks/TASK-009-HANDOFF.md` existe y declara endpoints API implementados.
- `api/package.json` define `npm test` como `node --test`.
- `npm test`: 7/7 tests pasados.
- `api/local.settings.sample.json` incluye `SQL_CONNECTION_STRING` vacio y `PILOT_COMPANY_ID` esperado como `1`.
- `api/local.settings.json`: no existe.
- Variables de entorno revisadas por presencia booleana:
  - `SQL_CONNECTION_STRING set: False`
  - `PILOT_COMPANY_ID set: False`

Riesgos o pendientes:
- Infra/Backend debe proveer ambiente DEV local o Azure con SQL ejecutado.
- No compartir connection strings en docs ni handoffs.
- Backend/API debe entregar URL local/Azure y comandos seguros para QA.
- QA debe repetir checklist parcial cuando haya ambiente:
  - crear cliente.
  - duplicado cliente.
  - registrar compra.
  - duplicado factura.
  - consultar saldo.
  - redencion valida e insuficiente si endpoint existe.
  - errores HTTP requeridos por TASK-013.

Siguiente recomendado:
- Infra/Backend debe configurar `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1` en un ambiente de prueba, ejecutar `database/schema.sql` y `database/seed.sql`, y entregar a QA una URL/comandos de prueba sin secretos.
- Luego QA reejecuta TASK-013 con endpoints reales antes de liberar integracion Web Dev.
