Equipo:
Infra / Azure

Tarea completada:
Aplicacion de `database/schema.sql` y `database/seed.sql` en Azure SQL existente `sqlserver-pj13-brazil/sql-db-puntoclub`, sin crear otra DB, sin cambiar codigo y sin guardar secretos en el repo.

Confirmacion recibida:
El usuario confirmo explicitamente:

```text
Confirmo aplicar schema y seed en sqlserver-pj13-brazil/sql-db-puntoclub
```

Ambiente:
- Subscription: `as_main`.
- Resource group: `resource_group_main`.
- Server: `sqlserver-pj13-brazil`.
- Database: `sql-db-puntoclub`.
- FQDN: `sqlserver-pj13-brazil.database.windows.net`.
- Region: `brazilsouth`.

Cambios ejecutados:
- Se creo temporalmente la regla de firewall `AllowCodexTask019Temp` para la IP local `200.229.6.103`.
- Se aplico `database/schema.sql`.
- Se aplico `database/seed.sql`.
- Se valido la empresa piloto.
- Se consulto si existia usuario SQL de aplicacion.
- Se elimino la regla temporal de firewall `AllowCodexTask019Temp`.

Validacion ejecutada:

```sql
SELECT id, name, points_percentage, status
FROM dbo.Companies
WHERE id = 1;
```

Resultado de validacion:

```text
id = 1
name = Cafe Central
points_percentage = 5.00
status = active
```

Usuario SQL de aplicacion:
- No se encontro usuario SQL de aplicacion existente en `sys.database_principals`.
- No se creo un usuario runtime nuevo porque no hay aun canal seguro acordado para generar/entregar/guardar su password ni Function App/App Setting final donde configurarlo.
- Decision segura: no inventar ni revelar password en terminal, docs o repo.

Permisos minimos requeridos para el usuario runtime:
- `db_datareader`.
- `db_datawriter`.
- `EXECUTE` sobre `dbo.RegisterRedemption`.
- No usar `db_owner`.
- No usar credenciales admin como runtime de la API.

SQL_CONNECTION_STRING:
- No se configuro valor real todavia.
- Debe quedar como secreto/app setting, no en archivos:
  - Local: `api/local.settings.json` ignorado por git o variable de entorno local.
  - Azure Functions: Application setting `SQL_CONNECTION_STRING`.
- Formato esperado sin revelar secreto:

```text
Server=tcp:sqlserver-pj13-brazil.database.windows.net,1433;Initial Catalog=sql-db-puntoclub;Persist Security Info=False;User ID=<app-user>;Password=<secret>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

PILOT_COMPANY_ID:
- Confirmado: `PILOT_COMPANY_ID=1`.
- `database/seed.sql` inserta/actualiza la empresa piloto con `id = 1`.

Firewall / networking final:
- La regla temporal `AllowCodexTask019Temp` fue eliminada.
- Estado final observado: solo queda `AllowAllWindowsAzureIps` (`0.0.0.0` a `0.0.0.0`).
- Riesgo: `AllowAllWindowsAzureIps` es amplio; facilita Azure Functions, pero debe revisarse antes de endurecer production.

Comandos/acciones ejecutadas:
- Prueba inicial `sqlcmd -G`: fallo por autenticacion integrada de Windows sin UPN resoluble.
- Conexion efectiva: token Azure CLI en memoria con `System.Data.SqlClient.AccessToken`.
- Azure CLI usado:
  - `az account get-access-token`
  - `az sql server firewall-rule create`
  - `az sql server firewall-rule delete`
  - `az sql server firewall-rule list`
- No se guardaron tokens ni connection strings.

Resultado:
Schema y seed quedaron aplicados en la Azure SQL existente. La empresa piloto esta activa con `id = 1`. Backend/API ya puede avanzar cuando se cree/configure un usuario SQL runtime minimo y se cargue `SQL_CONNECTION_STRING` como secreto.

Riesgos o pendientes:
- Pendiente bloqueante para API real: crear usuario SQL de aplicacion con password gestionado por canal seguro o migrar a identidad administrada.
- Pendiente: configurar `SQL_CONNECTION_STRING` en el ambiente que ejecute la API.
- Pendiente: ejecutar smoke test Backend/API contra Azure SQL.
- Riesgo: la DB puede auto-pausarse; primera conexion puede tardar.
- Riesgo: `AllowAllWindowsAzureIps` debe tratarse como decision temporal o riesgo aceptado.

Siguiente recomendado:
Definir canal seguro para crear el usuario runtime. Recomendacion minima: crear `puntoclub_app_user` con password ingresado por el usuario en Azure Portal/Azure Data Studio, otorgar `db_datareader`, `db_datawriter` y `EXECUTE` sobre `dbo.RegisterRedemption`, y configurar `SQL_CONNECTION_STRING` solo como secreto de entorno.
