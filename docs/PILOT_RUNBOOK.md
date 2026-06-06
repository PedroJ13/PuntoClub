# Pilot Runbook

## Objetivo

Verificar y calentar el ambiente antes de una sesion real de piloto.

## Ambiente

```text
Frontend: https://calm-dune-075dc5c0f.7.azurestaticapps.net
API: https://func-puntoclub-prod-br-001.azurewebsites.net/api
SQL: sqlserver-pj13-brazil/sql-db-puntoclub
Company ID: 1
```

## Cuando ejecutarlo

- 10 a 15 minutos antes de una sesion real de piloto.
- Cuando el sistema lleve varias horas sin uso.
- Antes de una prueba importante con usuarios reales.

## Checklist rapido

1. Abrir frontend publicado.
2. Confirmar que carga Punto Club.
3. Confirmar que la UI muestra `API real`.
4. Consultar estado de SQL.
5. Llamar endpoint liviano de API.
6. Ejecutar una busqueda simple desde la UI.
7. Escalar si hay errores `500`, CORS o SQL no pasa a `Online`.

## Comandos

Estado SQL:

```powershell
az sql db show `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name sql-db-puntoclub `
  --query "{name:name,status:status,currentServiceObjectiveName:currentServiceObjectiveName,autoPauseDelay:autoPauseDelay}" `
  --output json
```

Endpoint liviano:

```powershell
Invoke-WebRequest `
  -Uri "https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings" `
  -UseBasicParsing `
  -TimeoutSec 30
```

Solo estado HTTP:

```powershell
try {
  $r = Invoke-WebRequest -Uri "https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings" -UseBasicParsing -TimeoutSec 30
  [pscustomobject]@{ status = [int]$r.StatusCode; ok = $r.StatusCode -eq 200 }
} catch {
  [pscustomobject]@{ status = $_.Exception.Response.StatusCode.value__; error = $_.Exception.Message }
}
```

Log stream API:

```powershell
az webapp log tail `
  --resource-group resource_group_main `
  --name func-puntoclub-prod-br-001
```

## Criterio de exito

- Frontend carga.
- SQL llega a `Online`.
- API `/api/companies/1/settings` responde `200`.
- Una busqueda simple desde UI no muestra error.
- No hay respuestas `500`.
- No hay error CORS visible en navegador.

## Si SQL esta Paused o Resuming

- Es esperado con Azure SQL serverless.
- Ejecutar el endpoint liviano para disparar reanudacion.
- Esperar 1 a 3 minutos.
- Reintentar.
- No cambiar SKU, firewall ni app settings durante esta espera.

## Escalar

Escalar como P1 si:

- API devuelve `500` persistente despues de 2 intentos.
- SQL no llega a `Online` despues de varios minutos.
- Endpoint `/settings` no responde aunque Function App esta `Running`.
- Logs muestran conectividad SQL fallando.

Escalar como P2 si:

- Frontend carga pero muestra error de API/CORS.
- Frontend no refleja el ultimo deploy esperado.

## No hacer durante calentamiento

- No registrar clientes, compras ni redenciones salvo que QA/Product lo pidan.
- No cambiar firewall.
- No cambiar tier/SKU SQL.
- No imprimir secretos.
- No copiar datos de negocio del body de API a chats.
