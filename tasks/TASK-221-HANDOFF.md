# TASK-221 - Handoff Infra

Equipo: Infra

Modo de ejecucion: Infra

## Resultado

Completado.

Se creo una regla temporal y acotada de firewall en Azure SQL para permitir que SQL DEV / Data retome TASK-220 desde la IP indicada.

No se imprimieron secretos, connection strings, passwords, tokens ni datos de negocio.

## Resource group confirmado

- Resource group: `resource_group_main`
- SQL Server: `sqlserver-pj13-brazil`
- Base objetivo: `sql-db-puntoclub`
- Region: `brazilsouth`
- Public network access del servidor: `Enabled`

## Regla creada

- Nombre: `tmp-task221-sql-cleanup-200-229-6-68`
- Start IP: `200.229.6.68`
- End IP: `200.229.6.68`

La regla queda acotada a una sola IP.

## Comandos/pasos usados

Confirmacion de cuenta activa Azure:

```powershell
az account show --query "{name:name, tenantId:tenantId, user:user.name}" -o table
```

Confirmacion de servidor y resource group:

```powershell
az sql server list --query "[?name=='sqlserver-pj13-brazil'].{name:name, resourceGroup:resourceGroup, location:location, publicNetworkAccess:publicNetworkAccess}" -o table
```

Creacion de regla temporal:

```powershell
az sql server firewall-rule create `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task221-sql-cleanup-200-229-6-68 `
  --start-ip-address 200.229.6.68 `
  --end-ip-address 200.229.6.68 `
  --query "{name:name,startIpAddress:startIpAddress,endIpAddress:endIpAddress}" `
  -o table
```

Verificacion de regla:

```powershell
az sql server firewall-rule show `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task221-sql-cleanup-200-229-6-68 `
  --query "{name:name,startIpAddress:startIpAddress,endIpAddress:endIpAddress}" `
  -o table
```

Validacion minima posterior:

- Se ejecuto una conexion minima con `sqlcmd` usando la configuracion local existente.
- La consulta `SELECT DB_NAME()` devolvio `sql-db-puntoclub`.
- No se consultaron tablas de negocio ni se imprimieron credenciales.

## Comando para retirar la regla

Ejecutar cuando TASK-220 termine:

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task221-sql-cleanup-200-229-6-68
```

Verificacion posterior al retiro:

```powershell
az sql server firewall-rule list `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --query "[?name=='tmp-task221-sql-cleanup-200-229-6-68'].{name:name,startIpAddress:startIpAddress,endIpAddress:endIpAddress}" `
  -o table
```

La salida esperada despues del retiro debe quedar vacia para esa regla.

## Riesgos o pendientes

- Pendiente que SQL DEV / Data retome TASK-220, ejecute conteos antes/despues y haga la limpieza controlada.
- La regla debe retirarse al terminar TASK-220 para no mantener acceso temporal innecesario.
- No se modificaron configuraciones globales de seguridad ni se habilito acceso publico amplio adicional.
