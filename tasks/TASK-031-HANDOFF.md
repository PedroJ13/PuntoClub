Equipo:
Backend/API

Tarea completada:
TASK-031 - Alinear contrato de IDs y timestamp de redencion.

Archivos cambiados:
- api/package.json
- api/scripts/smoke-test.js
- api/src/lib/repository.js
- api/test/repository-formatters.test.js
- docs/API_CONTRACTS.md
- tasks/TASK-031-HANDOFF.md

Cambios realizados:
- IDs respaldados por SQL `bigint` se serializan consistentemente como string en respuestas API.
- `createdAt` de redencion ahora usa `created_at` real de `dbo.Redemptions` y se devuelve como timestamp UTC completo.
- `npm run smoke` ahora valida que IDs relevantes sean string y que `redemption.createdAt` sea timestamp UTC completo.
- `docs/API_CONTRACTS.md` documenta que IDs `bigint` de respuesta son string y ajusta ejemplos.

Verificacion ejecutada:
- Leido `tasks/TASK-031.md`.
- Leido `tasks/TASK-029-HANDOFF.md`.
- Revisado `docs/API_CONTRACTS.md`.
- Revisado `api/src/lib/repository.js`.
- Ejecutado `npm test`: 9 pruebas pasaron.
- Abierta regla temporal Azure SQL `AllowTask031ValidationTemp` para IP `200.229.6.103`.
- Levantado servidor local Backend/API contra Azure SQL real.
- Ejecutado `npm run smoke`: exitoso con validaciones nuevas.
- Eliminada regla temporal Azure SQL `AllowTask031ValidationTemp`.
- Verificado firewall final: solo queda `AllowAllWindowsAzureIps`.
- Detenido servidor local.

Resultado smoke:
```json
{
  "ok": true,
  "customerId": "13",
  "balanceBefore": {
    "customerId": "13",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "13",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

Riesgos o pendientes:
- Web Dev debe tratar IDs como identificadores opacos string, no como numeros.
- La validacion real local sigue dependiendo de regla temporal por IP.
- `AllowAllWindowsAzureIps` sigue activo como regla heredada.
- Production debe ejecutarse preferiblemente en Azure Functions real con app settings seguros.

Siguiente recomendado:
QA puede revalidar los P2 de TASK-029: `createdAt` de redencion como timestamp UTC completo e IDs `bigint` como string documentado/consistente.
