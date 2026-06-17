# TASK-222 - Handoff Infra

Equipo: Infra

Modo de ejecucion: Infra

## Resultado

Completado.

Se retiro la regla temporal de firewall usada para desbloquear TASK-220.

No se imprimieron secretos, connection strings, passwords, tokens ni datos de negocio. No se modificaron otras reglas de firewall.

## Regla retirada

- SQL Server: `sqlserver-pj13-brazil`
- Resource group: `resource_group_main`
- Regla: `tmp-task221-sql-cleanup-200-229-6-68`
- IP que permitia: `200.229.6.68`

## Comandos/pasos usados

Retiro de regla:

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task221-sql-cleanup-200-229-6-68
```

Verificacion posterior:

```powershell
az sql server firewall-rule list `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --query "[?name=='tmp-task221-sql-cleanup-200-229-6-68'].{name:name,startIpAddress:startIpAddress,endIpAddress:endIpAddress}" `
  -o table
```

Resultado de verificacion: salida vacia para esa regla; ya no existe en el SQL Server.

## Dependencia confirmada

Se confirmo que `tasks/TASK-220-HANDOFF.md` quedo en estado `Completado` antes de retirar la regla.

## Riesgos o pendientes

- No quedan pendientes de Infra para la regla temporal de TASK-221/TASK-222.
- Si SQL DEV necesita volver a conectarse directamente desde esta IP, se requerira una nueva tarea/autorizacion para crear otra regla temporal.
