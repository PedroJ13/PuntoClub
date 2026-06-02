Equipo:
Infra / Azure

Tarea completada:
Creacion/configuracion de usuario SQL runtime `puntoclub_app_user` con permisos minimos y configuracion local segura de `SQL_CONNECTION_STRING`.

Contexto:
- DB existente: `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Resource group: `resource_group_main`.
- Region: `brazilsouth`.
- `database/schema.sql` y `database/seed.sql` ya habian sido aplicados en TASK-019.
- El usuario proporciono credenciales admin mediante archivo local no versionado:
  - `local-secrets/sql_admin.ps1`
  - Variables leidas: `ADMIN_USERNAME` / `ADMIN_PASSWORD` como variables de entorno.

Cambios ejecutados:
- Se agrego `.gitignore` raiz con `local-secrets/` para evitar versionar secretos locales.
- Se creo temporalmente la regla de firewall `AllowCodexTask023Temp` para la IP local `200.229.6.103`.
- Se creo o actualizo el usuario SQL contenido `puntoclub_app_user`.
- Se genero password runtime aleatorio en memoria.
- Se otorgaron permisos minimos:
  - `db_datareader`
  - `db_datawriter`
  - `EXECUTE` sobre `dbo.RegisterRedemption`
- Se creo `api/local.settings.json` local con:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
  - `FUNCTIONS_WORKER_RUNTIME=node`
  - `AzureWebJobsStorage=UseDevelopmentStorage=true`
- Se elimino la regla temporal de firewall `AllowCodexTask023Temp`.

Archivos cambiados:
- `.gitignore`: agregado para ignorar `local-secrets/`.
- `api/local.settings.json`: creado localmente, ignorado por `api/.gitignore`; contiene secreto y no debe versionarse.
- `tasks/TASK-023-HANDOFF.md`: este handoff.

Verificacion ejecutada:
- Validado que `local-secrets/` queda ignorado por git.
- Validado que `api/local.settings.json` queda ignorado por git.
- Probada conexion con el usuario runtime `puntoclub_app_user`.
- Confirmados permisos del usuario runtime:

```text
runtime_user = puntoclub_app_user
is_datareader = 1
is_datawriter = 1
can_execute_redemption = 1
```

- Verificado firewall final: la regla temporal `AllowCodexTask023Temp` fue retirada.
- Estado final observado de firewall: solo queda `AllowAllWindowsAzureIps`.
- No se imprimio password ni connection string.
- No se guardaron secretos en archivos versionados.
- No se creo otra DB.
- No se cambio codigo.

Resultado:
Backend/API ya tiene una configuracion local segura para conectarse a Azure SQL mediante `api/local.settings.json`. El runtime SQL usa `puntoclub_app_user`, no credenciales admin.

SQL_CONNECTION_STRING:
- Configurado localmente en `api/local.settings.json`.
- No se revela su valor en este handoff.
- Para Azure Functions production, debe copiarse/configurarse como Application setting secreto `SQL_CONNECTION_STRING`, no en repo.

PILOT_COMPANY_ID:
- Confirmado y configurado localmente: `PILOT_COMPANY_ID=1`.

Riesgos o pendientes:
- `api/local.settings.json` contiene secreto local; mantenerlo fuera de git.
- `local-secrets/` contiene credenciales admin; mantenerlo fuera de git y considerar rotacion si se compartio indebidamente.
- La regla `AllowAllWindowsAzureIps` sigue activa; es util para Azure Functions, pero amplia.
- Falta configurar `SQL_CONNECTION_STRING` como secreto en Azure Functions cuando exista Function App production.
- Falta smoke test Backend/API completo contra Azure SQL con `puntoclub_app_user`.

Siguiente recomendado:
Backend/API debe ejecutar la API local usando `api/local.settings.json` y validar endpoints contra Azure SQL. Si el smoke test pasa, Infra puede configurar el mismo secreto en Azure Functions production cuando el recurso exista.
