# TASK-321 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra / Azure
Round: 57
Estado: En curso / bloqueado por autenticacion de plataforma

## Uso DB cloud
Si, motivo: desbloquear y validar smoke de piloto en Azure SQL para `PILOT_COMPANY_ID` y continuidad del deploy API.
Alcance: validacion de `dbo.Companies`, actualización de `PILOT_COMPANY_ID` y relanzado de workflow.

## Resultado

- IP objetivo confirmada y usada: `200.229.6.68`.
- Regla solicitada: `tmp-task321-sql-smoke-200-229-6-68`.
- Regla temporal ya creada externamente (estado esperado para esta ronda): `tmp-task321-sql-smoke-200-229-6-68` con IP `200.229.6.68`.
- Consulta ejecutada contra Azure SQL:
  - `SELECT id, name, status FROM dbo.Companies ORDER BY id;`
  - Resultado: `[{"id":"6","name":"DEMO 1","status":"active"}]`
  - `PILOT` activo confirmado: `company_id = 6` (`DEMO 1`).
- `PILOT_COMPANY_ID` quedó ajustado en workflow a `6`:
  - `/.github/workflows/azure-functions-api.yml`
- Relanzado de `Deploy Punto Club API`:
  - No ejecutado en esta sesión por falta de credenciales válidas.
  - `az account show` → `Please run 'az login' to setup account`.
  - `POST /repos/.../actions/workflows/azure-functions-api.yml/dispatches` sin token válido → `HTTP 401 Requires authentication`.

## Regla firewall

- Estado actual: pendiente de retiro manual, sigue abierta mientras no se tenga sesión Azure válida para ejecutar la eliminación.
- No se logró retirar desde esta sesión por falta de autenticación.
- Comando de retiro (una vez autenticados):
  - `az sql server firewall-rule delete --resource-group resource_group_main --server sqlserver-pj13-brazil --name tmp-task321-sql-smoke-200-229-6-68`

## `PILOT_COMPANY_ID`

- Confirmado activo: `6` (de `dbo.Companies`).
- Persistente en workflow: `PILOT_COMPANY_ID=6`.

## Deploy API

- No re-lanzado por bloqueo de autenticación de GitHub/Azure.
- Siguiente acción recomendada:
  1. autenticar Azure y/o GitHub,
  2. reintentar workflow `Deploy Punto Club API`,
  3. verificar smoke `GET /companies/6/settings` post-deploy.
- Nota del entorno: validación directa de `GET /companies/6/settings` desde esta sesión no concluye (egreso HTTP queda forzado a `127.0.0.1:9` en el sandbox), por lo que se sugiere validar desde red normal de operador.

## Evidencia adicional

- Resultado SQL: `"id":"6","name":"DEMO 1","status":"active"`.
- Error de GitHub dispatch: `HTTP 401 Requires authentication`.
