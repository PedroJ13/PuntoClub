# TASK-236 - Handoff Infra

Equipo: Infra

Modo de ejecucion: Infra

## Resultado

Completado.

Se creo la regla temporal y acotada de firewall para desbloquear la limpieza SQL de TASK-235.

## Resource group y servidor confirmados

- Resource group: `resource_group_main`
- Resource group location: `eastus2`
- SQL Server: `sqlserver-pj13-brazil`
- SQL Server FQDN: `sqlserver-pj13-brazil.database.windows.net`
- SQL Server location: `brazilsouth`
- Database objetivo: `sql-db-puntoclub`

## Regla creada

- Nombre: `tmp-task235-sql-cleanup-200-229-6-68`
- Start IP: `200.229.6.68`
- End IP: `200.229.6.68`

No se habilitaron rangos amplios y no se modificaron otras reglas.

## Validacion minima

Se valido conexion minima a `sql-db-puntoclub` con el usuario runtime desde `api/local.settings.json`, sin imprimir connection strings ni secretos.

Validacion ejecutada:

- `SELECT DB_NAME()` devolvio `sql-db-puntoclub`.

No se consultaron datos funcionales en TASK-236.

## Comando de retiro para TASK-237

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task235-sql-cleanup-200-229-6-68
```

Verificacion esperada:

```powershell
az sql server firewall-rule list `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --query "[?name=='tmp-task235-sql-cleanup-200-229-6-68']" `
  --output json
```

Resultado esperado despues de retirar:

```json
[]
```

## Riesgos o pendientes

- La regla es temporal y debe retirarse en TASK-237 despues de completar o cancelar TASK-235.
- No queda ningun secreto documentado en este handoff.
