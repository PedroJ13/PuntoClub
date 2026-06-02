# Punto Club API

Azure Functions Node API for the Punto Club MVP.

## Required settings

Do not commit real secrets.

```text
SQL_CONNECTION_STRING=<secret>
PILOT_COMPANY_ID=1
FUNCTIONS_WORKER_RUNTIME=node
```

For local development, put real values in `local.settings.json` or set process environment variables outside the repo.

## Install and test

```powershell
cd api
npm install
npm test
```

## Run locally

Requires Azure Functions Core Tools.

```powershell
cd api
npm start
```

Default local base URL:

```text
http://localhost:7071/api
```

## Smoke test

After schema and seed are applied to SQL and the API is running:

```powershell
cd api
$env:API_BASE_URL="http://localhost:7071/api"
$env:PILOT_COMPANY_ID="1"
npm run smoke
```

For an Azure URL, set `API_BASE_URL` to the deployed `/api` base URL.

## Apply SQL manually

Use an operator/admin credential, not the runtime API user. Do not store passwords in the repo.

```powershell
sqlcmd -S "tcp:sqlserver-pj13-brazil.database.windows.net,1433" -d "sql-db-puntoclub" -U "<operator-user>" -P "<prompt-or-secret>" -i "..\database\schema.sql"
sqlcmd -S "tcp:sqlserver-pj13-brazil.database.windows.net,1433" -d "sql-db-puntoclub" -U "<operator-user>" -P "<prompt-or-secret>" -i "..\database\seed.sql"
```

Then validate:

```sql
SELECT id, name, points_percentage, status
FROM dbo.Companies
WHERE id = 1;
```
