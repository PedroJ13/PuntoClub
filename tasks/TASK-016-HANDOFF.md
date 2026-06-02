Equipo:
Infra / Azure

Tarea completada:
Inventario de Azure SQL existente `sqlserver-pj13-brazil/sql-db-puntoclub` y plan seguro para configurar conexion de Backend/API sin guardar secretos en el repo.

Inventario Azure SQL:
- Subscription name: `as_main`.
- Subscription id: `ea1a3068-3abc-425a-ad65-53be62bdf0c6`.
- Tenant: `Default Directory`.
- Usuario Azure CLI autenticado: `pj13eros_business@outlook.com`.
- Resource group: `resource_group_main`.
- Server name: `sqlserver-pj13-brazil`.
- Server FQDN: `sqlserver-pj13-brazil.database.windows.net`.
- Database name: `sql-db-puntoclub`.
- Region: `brazilsouth`.
- Server version/kind: SQL Server `12.0`, Azure SQL v12.
- Server state: `Ready`.
- Database status actual: `Paused`.
- Tier/SKU actual: `GeneralPurpose`, `GP_S_Gen5_2`, serverless, 2 vCores.
- Min capacity: `0.5`.
- Auto-pause delay: `60` minutos.
- Free limit: habilitado, con comportamiento `AutoPause`.
- Max size: `34359738368` bytes, aprox. 32 GiB.
- Backup storage redundancy: `Local`.
- Default secondary location: `southcentralus`.
- Minimal TLS version: `1.2`.
- Public network access: `Enabled`.
- Private endpoints: ninguno.
- Firewall actual: regla `AllowAllWindowsAzureIps`, `0.0.0.0` a `0.0.0.0`.

Confirmacion:
- No crear otra Azure SQL Database.
- Usar la DB existente `sqlserver-pj13-brazil/sql-db-puntoclub`.
- `PILOT_COMPANY_ID=1` confirmado por `database/seed.sql`, que inserta/actualiza la empresa piloto con `id = 1`.

Estado de networking y riesgo:
- La DB usa acceso publico habilitado.
- La regla `AllowAllWindowsAzureIps` permite conexiones desde servicios Azure, lo cual simplifica Azure Functions pero es una regla amplia.
- Recomendacion piloto minimo: mantener temporalmente si desbloquea API, pero documentarlo como riesgo aceptado.
- Recomendacion posterior: restringir acceso con reglas mas especificas o evaluar Private Endpoint/managed identity cuando el piloto crezca.

Estrategia segura de secretos:
- No guardar `SQL_CONNECTION_STRING`, passwords ni tokens en archivos del repo.
- No poner connection strings en `local.settings.sample.json`.
- Para local: usar `api/local.settings.json` real ignorado por git o variables de entorno del usuario. Confirmar que no se commitee.
- Para Azure Functions: configurar `SQL_CONNECTION_STRING` como Application setting desde Azure Portal, GitHub Actions secret o CLI seguro.
- Para production: usar `PILOT_COMPANY_ID=1` como app setting.

Conexion recomendada:
- Migracion/schema/seed: usar una credencial temporal o admin/operator solo para ejecutar `database/schema.sql` y `database/seed.sql`.
- Runtime API: crear un usuario SQL de aplicacion con permisos minimos y usarlo en `SQL_CONNECTION_STRING`.
- No usar credenciales admin del servidor como connection string de la API.
- Identidad administrada: diferida para piloto minimo. Es mejor a futuro, pero requiere configurar Microsoft Entra auth para SQL, usuario externo en DB y cambios/validacion de libreria de conexion.

Permisos minimos sugeridos para usuario de aplicacion:
- `db_datareader`.
- `db_datawriter`.
- `EXECUTE` sobre procedimientos requeridos, especialmente `dbo.RegisterRedemption` si existe en `schema.sql`.
- Evitar `db_owner` para runtime.

App settings para Backend/API:
- `SQL_CONNECTION_STRING=<secret>`
- `PILOT_COMPANY_ID=1`
- `FUNCTIONS_WORKER_RUNTIME=node`
- `AzureWebJobsStorage=<secret/runtime storage setting>` cuando se despliegue en Azure Functions.

Formato seguro de connection string:
```text
Server=tcp:sqlserver-pj13-brazil.database.windows.net,1433;Initial Catalog=sql-db-puntoclub;Persist Security Info=False;User ID=<app-user>;Password=<secret>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

Pasos para aplicar `database/schema.sql` y `database/seed.sql`:
1. Confirmar que el usuario aprueba ejecutar cambios en la DB production piloto.
2. Confirmar IP/local/network permitido para quien ejecutara la migracion, o ejecutar desde un entorno Azure permitido por firewall.
3. Abrir Azure Data Studio, SSMS o `sqlcmd`.
4. Conectar a:
   - Server: `sqlserver-pj13-brazil.database.windows.net`
   - Database: `sql-db-puntoclub`
   - Auth: credencial operator/admin temporal, no la credencial runtime de la API.
5. Ejecutar primero `database/schema.sql`.
6. Ejecutar despues `database/seed.sql`.
7. Ejecutar validacion:

```sql
SELECT id, name, points_percentage, status
FROM dbo.Companies
WHERE id = 1;
```

8. Resultado esperado:
   - `id = 1`
   - `name = Cafe Central`
   - `points_percentage = 5.00`
   - `status = active`
9. Crear usuario SQL de aplicacion con permisos minimos.
10. Configurar `SQL_CONNECTION_STRING` con ese usuario en el ambiente donde corra la API.
11. Ejecutar smoke test de Backend/API contra `PILOT_COMPANY_ID=1`.

Comandos de referencia, no ejecutados:
```powershell
az account show --output json

az sql db show `
  --server sqlserver-pj13-brazil `
  --name sql-db-puntoclub `
  --resource-group resource_group_main `
  --output json

az sql server firewall-rule list `
  --server sqlserver-pj13-brazil `
  --resource-group resource_group_main `
  --output json
```

Ejemplo `sqlcmd` de referencia, no ejecutado:
```powershell
sqlcmd -S "tcp:sqlserver-pj13-brazil.database.windows.net,1433" -d "sql-db-puntoclub" -U "<operator-user>" -P "<prompt-or-secret>" -i "database/schema.sql"
sqlcmd -S "tcp:sqlserver-pj13-brazil.database.windows.net,1433" -d "sql-db-puntoclub" -U "<operator-user>" -P "<prompt-or-secret>" -i "database/seed.sql"
```

Nota: preferir herramientas que pidan password interactivamente o un mecanismo seguro aprobado. No pegar secretos en scripts, docs ni terminal compartida si quedan en historial.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md`, `tasks/TASK-016.md`, `database/schema.sql`, `database/seed.sql` y `api/local.settings.sample.json`.
- Ejecutado inventario Azure CLI de solo lectura:
  - `az account show`
  - `az sql server list`
  - `az sql db show`
  - `az sql server firewall-rule list`
- Confirmado que `api/src/lib/db.js` usa `SQL_CONNECTION_STRING`.
- Confirmado que `api/src/lib/http.js` usa `PILOT_COMPANY_ID`.
- No se crearon recursos, no se modifico Azure, no se ejecutaron scripts SQL y no se guardaron secretos.

Resultado:
La base existente esta identificada y lista para que Backend/API prepare conexion contra `sqlserver-pj13-brazil/sql-db-puntoclub`. El siguiente desbloqueo requiere aprobacion explicita para aplicar `schema.sql` y `seed.sql` en la DB production piloto.

Riesgos o pendientes:
- La DB esta `Paused`; la primera conexion puede tardar mientras Azure la reanuda.
- El tier actual no es Basic DTU sino General Purpose serverless con free limit; costo real debe monitorearse porque puede diferir del plan minimo original.
- `AllowAllWindowsAzureIps` es practico pero amplio.
- Falta crear usuario SQL de aplicacion con permisos minimos.
- Falta configurar `SQL_CONNECTION_STRING` real en el ambiente Backend/API.
- Falta confirmar quien ejecuta schema/seed y con que credencial operator/admin.
- Falta smoke test API real despues de aplicar schema/seed.

Siguiente recomendado:
Pedir confirmacion explicita para aplicar `database/schema.sql` y `database/seed.sql` en `sql-db-puntoclub`, luego crear usuario runtime minimo y entregar a Backend/API solo el nombre de setting requerido, nunca el secreto.
