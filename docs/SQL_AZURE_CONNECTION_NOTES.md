# Conexion a Azure SQL - notas operativas

Estas notas documentan como SQL DEV se conecta a Azure SQL para validaciones y migraciones, sin guardar ni imprimir secretos.

## Base objetivo

- Server: `sqlserver-pj13-brazil`
- Database: `sql-db-puntoclub`
- FQDN: `sqlserver-pj13-brazil.database.windows.net`
- Resource group: `resource_group_main`

## Credenciales locales

Se usan archivos locales ignorados por git:

- `api/local.settings.json`
  - contiene `SQL_CONNECTION_STRING` del usuario runtime.
  - sirve para lecturas, smoke tests y validaciones normales.
  - no tiene permisos de migracion como `ALTER TABLE` o `CREATE TABLE`.

- `local-secrets/sql_admin.ps1`
  - carga variables de entorno admin locales:
    - `ADMIN_USERNAME`
    - `ADMIN_PASSWORD`
  - se usa solo para aplicar migraciones aprobadas.
  - no se imprime su contenido.

## Cliente usado

El camino mas confiable ha sido Node con el paquete `mssql` instalado en `api/node_modules`.

Patron runtime:

```powershell
cd api
node -e "<script que lee local.settings.json y usa SQL_CONNECTION_STRING>"
```

Patron admin:

```powershell
cd api
. ..\local-secrets\sql_admin.ps1
node -e "<script que lee ADMIN_USERNAME / ADMIN_PASSWORD desde env>"
```

No se deben escribir connection strings ni passwords en archivos nuevos, logs, handoffs o commits.

## Firewall temporal

Cuando Azure SQL bloquea la IP local, se crea una regla temporal estrecha por IP y se retira al terminar.

Ejemplo:

```powershell
az sql server firewall-rule create `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task###-sql-migration-<ip-normalizada> `
  --start-ip-address <IP_LOCAL> `
  --end-ip-address <IP_LOCAL>
```

Retiro obligatorio:

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task###-sql-migration-<ip-normalizada>
```

Verificacion:

```powershell
az sql server firewall-rule list `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --query "[?name=='tmp-task###-sql-migration-<ip-normalizada>']" `
  --output json
```

Resultado esperado despues de retirar:

```json
[]
```

## Aplicar migraciones

Las migraciones SQL del repo usan lotes separados por `GO`. El cliente Node `mssql` no entiende `GO` directamente, asi que el script operativo:

1. Lee el archivo `.sql`.
2. Divide por lineas `GO`.
3. Ejecuta cada batch con `pool.request().batch(...)`.
4. Reporta `batch X/Y ok`.

No se insertan seeds productivos salvo que la tarea lo pida explicitamente.

## Flujo recomendado

1. Leer asignacion y handoffs relevantes.
2. Revisar la migracion local.
3. Ejecutar prevalidaciones con usuario runtime si alcanza.
4. Si hay bloqueo de firewall, crear regla temporal estrecha.
5. Aplicar con admin solo si la tarea lo autoriza.
6. Validar tablas, columnas, constraints, indices y conteos.
7. Retirar regla temporal.
8. Verificar que la regla temporal devolvio `[]`.
9. Crear handoff con resultado, evidencia y riesgos.

## Uso minimo por costo

Azure SQL en este proyecto usa una cuota gratuita mensual limitada. No debe despertarse ni mantenerse activa para pruebas que puedan hacerse con mock, tests locales o API local.

Leer tambien `docs/AZURE_SQL_COST_GUARDRAILS.md` antes de ejecutar pruebas contra Azure real.

Regla practica:

- migracion aprobada: si puede usar Azure SQL;
- smoke final corto: si puede usar Azure SQL;
- desarrollo UI, copy, responsive o QA repetitivo: no usar Azure SQL;
- reproduccion de bug solo en Azure: usar Azure SQL con ventana corta y cerrar conexiones.

## Reglas de seguridad

- No imprimir secrets.
- No guardar connection strings.
- No pegar tokens, cookies, passwords ni hashes sensibles en handoffs.
- No dejar reglas temporales abiertas.
- No usar el usuario runtime para migraciones.
- No aplicar SQL si la tarea solo pide propuesta/revision.
