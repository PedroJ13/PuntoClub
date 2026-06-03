Equipo: QA
Tarea completada: TASK-041 - Validar API estable despues de redeploy
Archivos cambiados:
- tasks/TASK-041-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-041.md.
- Leido tasks/TASK-039-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Leido docs/API_CONTRACTS.md.
- Leido api/scripts/smoke-test.js.
- Leido api/src/functions/companies.js.
- Ejecutado `npm test` en api/.
- Ejecutado `npm run smoke` contra URL estable Azure Functions.
- Ejecutado checklist QA post-redeploy contra:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Resultado:
- Aprobado con observaciones.
- La API estable sigue sin P0/P1 despues del redeploy.
- `GET /api/companies/1/settings` ya responde `200` y devuelve la empresa piloto activa.
- No hay regresion en crear cliente, duplicado, compra, saldo ni redencion.
- No se valida UI completa porque esta tarea no la cubre.

Checks ejecutados:
- `npm test`: 9/9 tests pasados.
- `npm run smoke`: exitoso contra Azure Functions.
- `GET /api/companies/1/settings`: `200`.
- `GET /api/companies/999/settings`: `404 COMPANY_NOT_FOUND`.
- Crear cliente: `201`.
- Cliente duplicado: `409 DUPLICATE_CUSTOMER`.
- Registrar compra: `201`, `pointsEarned = 1250`.
- Factura duplicada: `409 DUPLICATE_INVOICE`.
- Saldo despues de compra: `pointsEarned = 1250`, `pointsRedeemed = 0`, `pointsBalance = 1250`.
- Redencion valida de 500 puntos: `201`, `balanceAfter = 750`.
- Saldo despues de redencion: `pointsEarned = 1250`, `pointsRedeemed = 500`, `pointsBalance = 750`.
- Redencion mayor al saldo: `409 INSUFFICIENT_POINTS`.
- Cliente inexistente: `404 CUSTOMER_NOT_FOUND`.

Hallazgos:
- P0/P1: ninguno para el alcance de TASK-041.
- P2: `WEBSITE_RUN_FROM_PACKAGE` sigue usando SAS privado con expiracion; requiere seguimiento/pipeline formal.
- P3: `AllowAllWindowsAzureIps` sigue activo como regla SQL heredada amplia.

P0/P1:
- Ninguno abierto.

P2/P3:
- P2: seguimiento operativo del SAS privado usado por `WEBSITE_RUN_FROM_PACKAGE`.
- P3: revisar `AllowAllWindowsAzureIps` antes de endurecer production.

Evidencia:
- Smoke:
  - `ok = true`.
  - `customerId = 27`.
  - `balanceBefore.pointsBalance = 50`.
  - `balanceAfter.pointsBalance = 49`.
  - `activityItems = 2`.
- Settings:
  - `id = "1"`.
  - `name = "Cafe Central"`.
  - `pointsPercentage = 5`.
  - `status = "active"`.
  - `updatedAt = "2026-06-02T19:16:06Z"`.
- Checklist QA:
  - Cliente creado: `id = 28`.
  - Compra creada: `id = 16`, factura `QA-041-1780522881715`.
  - Compra de `25000.00` genero `1250` puntos.
  - Redencion creada: `id = 14`.
  - `createdAt` de redencion: `2026-06-03T21:41:26Z`.
  - Saldo final: `750`.
- Errores contratados confirmados:
  - `DUPLICATE_CUSTOMER`.
  - `DUPLICATE_INVOICE`.
  - `INSUFFICIENT_POINTS`.
  - `CUSTOMER_NOT_FOUND`.
  - `COMPANY_NOT_FOUND`.
- No se imprimieron secretos.
- No se abrieron reglas temporales de firewall.

Riesgos o pendientes:
- Infra/Backend debe preparar pipeline o renovacion controlada del paquete desplegado antes de que venza el SAS privado.
- Revisar regla SQL `AllowAllWindowsAzureIps` en endurecimiento production.

Siguiente recomendado:
- Product / Architect / Release puede marcar TASK-041 como aprobado con observaciones.
- Continuar con validacion de frontend publicado cuando TASK-040/TASK-042 entreguen origen estable.
