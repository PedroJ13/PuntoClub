Equipo:
Backend/API

Tarea completada:
TASK-020 - Levantar API con conexion real y ejecutar smoke test real.

Estado:
Bloqueada parcialmente. TASK-019 ya aplico schema/seed en Azure SQL, pero no se pudo levantar API contra SQL ni ejecutar smoke test real porque todavia no existe usuario SQL runtime ni `SQL_CONNECTION_STRING` configurado en este entorno.

Archivos cambiados:
- tasks/TASK-020-HANDOFF.md

Verificacion ejecutada:
- Leido `tasks/TASK-020.md`.
- Revisado `tasks/TASK-019.md`.
- Leido `tasks/TASK-019-HANDOFF.md`.
- Confirmado por TASK-019 que `database/schema.sql` y `database/seed.sql` fueron aplicados en `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Confirmado por TASK-019 que la empresa piloto existe:
  - `id = 1`
  - `name = Cafe Central`
  - `points_percentage = 5.00`
  - `status = active`
- Confirmado por TASK-019 que no se encontro/creo usuario SQL de aplicacion.
- Confirmado sin revelar secretos:
  - `SQL_CONNECTION_STRING`: no configurado.
  - `PILOT_COMPANY_ID`: no configurado.
  - `API_BASE_URL`: no configurado.
  - `api/local.settings.json`: no existe.
- Confirmado que Azure Functions Core Tools `func` no esta disponible en PATH.
- Confirmado que `az` y `sqlcmd` existen localmente, pero no se usaron para modificar DB porque falta aprobacion/credencial segura de TASK-019.
- Ejecutado `npm test` en `api/`: 7 pruebas pasaron.

Resultado:
La API no queda entregada a QA como ambiente real todavia. La base SQL ya tiene schema/seed aplicados, pero falta configurar credencial runtime segura y levantar la API. No hay URL local/Azure verificable contra `sqlserver-pj13-brazil/sql-db-puntoclub`.

Comandos seguros disponibles cuando se desbloquee:
```powershell
cd api
npm test
```

Cuando existan variables seguras:
```powershell
cd api
$env:SQL_CONNECTION_STRING="<configurada fuera del repo>"
$env:PILOT_COMPANY_ID="1"
npm start
```

En otra terminal, con la API corriendo:
```powershell
cd api
$env:API_BASE_URL="http://localhost:7071/api"
$env:PILOT_COMPANY_ID="1"
npm run smoke
```

Riesgos o pendientes:
- Crear usuario SQL de aplicacion con permisos minimos y entregar forma segura de configurar `SQL_CONNECTION_STRING` sin revelar el valor.
- Falta instalar Azure Functions Core Tools o levantar la API en Azure.
- No guardar `SQL_CONNECTION_STRING`, passwords ni tokens en archivos del repo.
- No ejecutar `npm run smoke` hasta tener API conectada a SQL real con `PILOT_COMPANY_ID=1`.

Siguiente recomendado:
Crear/configurar `puntoclub_app_user` con password gestionado por canal seguro, otorgar `db_datareader`, `db_datawriter` y `EXECUTE` sobre `dbo.RegisterRedemption`, y reabrir TASK-020 con una sesion que ya tenga `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1` configurados, o con una Azure Function desplegada/configurada, para ejecutar `npm run smoke` y entregar URL QA.
