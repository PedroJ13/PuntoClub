Equipo: QA
Tarea completada: TASK-033 - Validar API estable
Archivos cambiados:
- tasks/TASK-033-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-033.md.
- Leido tasks/TASK-031-HANDOFF.md.
- Leido tasks/TASK-032-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/API_CONTRACTS.md.
- Leido api/scripts/smoke-test.js.
- Ejecutado `npm test` en api/.
- Ejecutado `npm run smoke` contra URL estable Azure Functions.
- Ejecutado checklist QA de endpoints principales contra:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Ejecutada comprobacion puntual de `GET /api/companies/1/settings`.

Resultado:
- Aprobado con observaciones.
- API estable en Azure Functions valida para los endpoints principales del alcance TASK-033.
- No quedan P0/P1 abiertos para crear cliente, duplicado, compra, saldo ni redencion.
- No se aprueba UI completa porque esta tarea no la cubre.

Checks ejecutados:
- `npm test`: 9/9 tests pasados.
- `npm run smoke`: exitoso contra URL estable.
- Crear cliente: `201`.
- Cliente duplicado: `409 DUPLICATE_CUSTOMER`.
- Payload cliente invalido: `400 VALIDATION_ERROR`.
- Registrar compra: `201`.
- Factura duplicada: `409 DUPLICATE_INVOICE`.
- Consultar saldo despues de compra: `200`, saldo `1250`.
- Registrar redencion real de 500 puntos: `201`.
- Consultar saldo despues de redencion: `200`, saldo `750`.
- Redencion mayor al saldo: `409 INSUFFICIENT_POINTS`.
- Cliente inexistente: `404 CUSTOMER_NOT_FOUND`.
- Empresa incorrecta: `404 COMPANY_NOT_FOUND`.
- `GET /api/companies/1/settings`: `404`.

Hallazgos:
- P2: `GET /api/companies/1/settings` no esta disponible en Azure Functions; TASK-032 ya lo reporto como funcion no implementada/indexada. No bloquea TASK-033 porque no esta dentro del alcance principal, pero debe resolverse si sigue siendo parte del contrato MVP.
- P2: El despliegue estable usa `WEBSITE_RUN_FROM_PACKAGE` con SAS privado; Infra debe renovar/reemplazar por pipeline formal antes de vencimiento.
- P3: `AllowAllWindowsAzureIps` sigue activo como regla heredada amplia.

P0/P1:
- Ninguno abierto para el alcance de TASK-033.

P2/P3:
- P2: `GET /settings` no disponible aunque existe en contrato.
- P2: despliegue manual con SAS privado requiere seguimiento operativo.
- P3: revisar `AllowAllWindowsAzureIps` antes de endurecer production.

Evidencia:
- Smoke estable:
  - `ok = true`.
  - `customerId = 15`.
  - `balanceBefore.pointsBalance = 50`.
  - `balanceAfter.pointsBalance = 49`.
  - `activityItems = 2`.
- Checklist QA ejecutado con cliente `id = 16`:
  - compra `id = 11`.
  - redencion `id = 10`.
  - factura `QA-033-1780457570717`.
  - compra de `25000.00` genero `1250` puntos.
  - saldo antes de redencion: `1250`.
  - redencion de `500` puntos dejo saldo `750`.
  - `createdAt` de redencion: `2026-06-03T03:32:54Z`.
  - IDs principales devueltos como string, alineados con TASK-031.
- Errores contratados confirmados:
  - `DUPLICATE_CUSTOMER`.
  - `DUPLICATE_INVOICE`.
  - `INSUFFICIENT_POINTS`.
  - `CUSTOMER_NOT_FOUND`.
  - `COMPANY_NOT_FOUND`.
  - `VALIDATION_ERROR`.
- No se imprimieron secretos.
- No se abrieron reglas temporales de firewall para esta validacion.

Riesgos o pendientes:
- Backend/API debe decidir si implementa o retira del contrato la ruta `GET /companies/{companyId}/settings`.
- Infra debe dar seguimiento al paquete desplegado con SAS privado y preparar pipeline o mecanismo formal de redeploy.
- Web Dev debe tratar IDs como string/opacos.

Siguiente recomendado:
- Product / Architect / Release puede marcar TASK-033 como aprobado con observaciones y habilitar TASK-034 para validar UI contra API estable.
- Abrir tarea menor Backend/API si `GET /settings` sigue siendo requisito MVP.
