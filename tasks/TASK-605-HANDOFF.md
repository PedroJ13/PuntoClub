Equipo: Infra
Modo de ejecucion: Azure Monitor / Alertas SQL
Tarea completada: TASK-605 - Reducir ruido de alertas Azure SQL dejando foco en deletes

Resultado:
- Se deshabilito la alerta ruidosa `ala-puntoclub-sqldb-write`.
- Se mantuvieron activas las alertas criticas de borrado:
  - `ala-puntoclub-sqlserver-delete`
  - `ala-puntoclub-sqldb-delete`
- Se revisaron y se mantuvieron activas las alertas de firewall, locks y resource-health porque cubren cambios operativos sensibles y no eran el ruido especifico reportado.
- No se tocaron datos SQL.
- No se tocaron backups.
- No se tocaron locks.
- No se tocaron secrets.

Ambiente:
- Azure resource group: `resource_group_main`
- SQL Server: `sqlserver-pj13-brazil`
- SQL Database: `sql-db-puntoclub`
- Tipo de recurso modificado: `Microsoft.Insights/activityLogAlerts`

Cambio aplicado:
- `ala-puntoclub-sqldb-write`
  - Operacion monitoreada: `Microsoft.Sql/servers/databases/write`
  - Estado anterior observado: `enabled=true`
  - Estado final: `enabled=false`

Alertas confirmadas activas despues del cambio:
- `ala-puntoclub-sqlserver-delete`: `enabled=true`
  - Operacion: `Microsoft.Sql/servers/delete`
- `ala-puntoclub-sqldb-delete`: `enabled=true`
  - Operacion: `Microsoft.Sql/servers/databases/delete`
- `ala-puntoclub-sql-firewall-write`: `enabled=true`
  - Operacion: `Microsoft.Sql/servers/firewallRules/write`
- `ala-puntoclub-sql-firewall-delete`: `enabled=true`
  - Operacion: `Microsoft.Sql/servers/firewallRules/delete`
- `ala-puntoclub-sql-lock-write`: `enabled=true`
  - Operacion: `Microsoft.Authorization/locks/write`
- `ala-puntoclub-sql-lock-delete`: `enabled=true`
  - Operacion: `Microsoft.Authorization/locks/delete`
- `ala-puntoclub-sqldb-resource-health`: `enabled=true`
  - Categoria: `ResourceHealth`

Verificacion ejecutada:
- Inventario de Activity Log Alerts del resource group.
- Intento inicial con `az monitor activity-log alert update` no aplico por error de validacion de scope del CLI:
  - `ScopeIsInvalid`
- Cambio efectivo aplicado con Azure Resource Manager:
  - `az resource update --ids .../activityLogAlerts/ala-puntoclub-sqldb-write --set properties.enabled=false`
- Verificacion final con listado de alertas `ala-puntoclub-*` confirmo:
  - `ala-puntoclub-sqldb-write`: `enabled=false`
  - deletes SQL Server/SQL Database: `enabled=true`
  - firewall/lock/resource-health: `enabled=true`

Uso Azure SQL:
- No.
- Motivo: la tarea solo modifico configuracion de Azure Monitor Activity Log Alerts; no se abrio conexion a la base de datos ni se ejecuto consulta SQL.

Rollback:
- Para reactivar la alerta de writes si Product/Infra decide volver a observar cambios de configuracion de DB:

```powershell
az resource update `
  --ids /subscriptions/ea1a3068-3abc-425a-ad65-53be62bdf0c6/resourceGroups/resource_group_main/providers/Microsoft.Insights/activityLogAlerts/ala-puntoclub-sqldb-write `
  --set properties.enabled=true
```

Riesgos o pendientes:
- Cambios administrativos normales sobre la configuracion de la SQL Database ya no generaran alerta por `ala-puntoclub-sqldb-write`.
- Las alertas de delete, firewall, locks y resource-health quedan como cobertura operativa activa.
- Si el ruido continua, revisar action group/destinatarios o frecuencia de alertas en una tarea separada.
