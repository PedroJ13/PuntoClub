Equipo: QA
Tarea completada: TASK-029 - Revalidar SQL/API real con ambiente repetible
Archivos cambiados:
- tasks/TASK-029-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-029.md.
- Leido tasks/TASK-028-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/QA_TEST_PLAN.md.
- Leido docs/API_CONTRACTS.md.
- Leido api/scripts/smoke-test.js.
- Confirmado sin exponer secretos que api/local.settings.json existe y contiene:
  - SQL_CONNECTION_STRING configurado.
  - PILOT_COMPANY_ID=1.
  - FUNCTIONS_WORKER_RUNTIME=node.
- Confirmada IP publica para QA: 200.229.6.103.
- Creada regla temporal Azure SQL `AllowTask029ValidationTemp` para 200.229.6.103.
- Levantado servidor local API con `npm run serve:local`.
- Ejecutado `npm test`; fallo dentro del sandbox por `spawn EPERM` y paso fuera del sandbox con permiso elevado.
- Ejecutado `npm run smoke`.
- Ejecutado checklist QA API real contra `http://localhost:7071/api`.
- Eliminada regla temporal Azure SQL `AllowTask029ValidationTemp`.
- Confirmado firewall final: solo queda `AllowAllWindowsAzureIps`.
- Detenido servidor local al terminar.

Resultado:
- Aprobado con observaciones.
- Los endpoints reales contra Azure SQL existente quedaron validados para el alcance de TASK-029.
- No quedan P0/P1 abiertos en clientes, compras, saldo, redencion, duplicados ni errores HTTP contratados validados.
- No se aprueba UI completa porque esta tarea no la cubre.

Checks ejecutados:
- `npm test`: 7/7 tests pasados fuera del sandbox.
- `npm run smoke`: exitoso.
- Crear cliente: `201`.
- Cliente duplicado por telefono: `409 DUPLICATE_CUSTOMER`.
- Cliente duplicado por email: `409 DUPLICATE_CUSTOMER`.
- Payload cliente invalido: `400 VALIDATION_ERROR`.
- Registrar compra: `201`, `pointsEarned = 1250`.
- Factura duplicada: `409 DUPLICATE_INVOICE`.
- Compra con cliente inexistente: `404 CUSTOMER_NOT_FOUND`.
- Consultar saldo despues de compra: `pointsEarned = 1250`, `pointsRedeemed = 0`, `pointsBalance = 1250`.
- Redencion valida de 500 puntos: `201`, `balanceAfter = 750`.
- Consultar saldo despues de redencion: `pointsEarned = 1250`, `pointsRedeemed = 500`, `pointsBalance = 750`.
- Redencion mayor al saldo: `409 INSUFFICIENT_POINTS`.
- Payload redencion invalido: `400 VALIDATION_ERROR`.
- Saldo de cliente inexistente: `404 CUSTOMER_NOT_FOUND`.
- Empresa incorrecta: `404 COMPANY_NOT_FOUND`.
- Historial despues de compra/redencion: `200`, 2 items, balance consistente.

Hallazgos:
- P2: La respuesta de redencion devuelve `createdAt` como fecha `2026-06-02`, no como timestamp UTC completo como sugiere el contrato de API.
- P2: Los ids `customerId`, `purchaseId` y otros BigInt llegan como string en algunas respuestas; no bloquea MVP, pero conviene decidir si el contrato acepta string para BigInt o si se normalizara.
- P2: La validacion repetible local depende de crear/cerrar una regla temporal de firewall por IP local; para QA compartible se recomienda Azure Functions con app settings seguros.
- P3: `AllowAllWindowsAzureIps` sigue activa como regla heredada y debe revisarse antes de endurecer production.

P0/P1:
- Ninguno abierto para el alcance de TASK-029.

P2/P3:
- P2: `createdAt` de redencion no cumple estrictamente el formato timestamp UTC del contrato.
- P2: ids BigInt serializados como string deben aceptarse/documentarse o normalizarse.
- P2: ambiente local repetible depende de firewall temporal.
- P3: revisar `AllowAllWindowsAzureIps` antes de production endurecida.

Evidencia:
- Smoke ejecutado en QA:
  - `ok = true`.
  - `customerId = 4`.
  - `balanceBefore.pointsBalance = 50`.
  - `balanceAfter.pointsBalance = 49`.
  - `activityItems = 2`.
- Checklist QA ejecutado con cliente `id = 5`:
  - compra `id = 5`.
  - factura `QA-029-1780436267875`.
  - compra de 25000.00 genero 1250 puntos.
  - saldo antes de redencion: 1250.
  - redencion de 500 puntos aplicada.
  - saldo despues de redencion: 750.
  - historial con compra y redencion, balance consistente.
- Todos los checks del script QA devolvieron `ok = true`.
- Regla temporal `AllowTask029ValidationTemp` eliminada.
- Firewall final verificado: `AllowAllWindowsAzureIps`.
- Servidor local detenido al terminar.
- No se imprimieron secretos.

Riesgos o pendientes:
- Backend/API debe decidir si ajusta `createdAt` de redenciones a timestamp UTC completo.
- Product/Backend debe decidir si ids BigInt como string son contrato aceptado.
- Para validacion entre equipos, conviene desplegar Azure Functions real y evitar depender de la maquina local + firewall temporal.
- Mantener limpieza obligatoria de reglas temporales en futuras pruebas locales.

Siguiente recomendado:
- Product / Architect / Release puede marcar TASK-029 como aprobado con observaciones y habilitar TASK-030 para revalidar UI contra API real.
- Backend/API puede abrir tarea menor para alinear `createdAt` de redenciones y documentar/normalizar ids BigInt.
