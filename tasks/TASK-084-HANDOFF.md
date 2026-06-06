Equipo:
Infra / Azure

Tarea completada:
TASK-084 - Preparar runbook de calentamiento SQL para piloto.

Archivos cambiados:
- `tasks/TASK-084-HANDOFF.md`

Verificacion ejecutada:
- Se leyo `tasks/TASK-084-assignment.md`.
- Se leyo contexto minimo Infra:
  - `codex-project-templates/INFRA.md`
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `tasks/TASK-080-HANDOFF.md`
- Se reviso el contrato/codigo de API para confirmar endpoint liviano:
  - `GET /api/companies/{companyId}/settings`
  - Es preferible para calentamiento porque consulta API/SQL sin escribir datos y sin listar clientes.

Resultado:
- Se preparo runbook operativo corto para calentar/verificar frontend, API y Azure SQL antes de sesiones reales de piloto.
- No se cambio firewall.
- No se cambio SKU/tier SQL.
- No se cambiaron app settings.
- No se crearon recursos.
- No se imprimieron secretos.

Runbook propuesto:

1. Ventana de ejecucion
   - Ejecutar 10 a 15 minutos antes de una sesion real de piloto.
   - Ejecutar tambien si el sistema estuvo varias horas sin uso y se espera atencion de usuarios.
   - Responsable sugerido: Infra, Release o persona operativa designada.

2. Abrir frontend publicado
   - URL:
     - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
   - Criterio de exito:
     - La pagina carga.
     - Se ve la UI de Punto Club.
     - No aparece error visible de carga inicial.
   - Si falla:
     - Revisar GitHub Actions frontend:
       - `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
     - Revisar Azure Portal:
       - Static Web Apps > `swa-puntoclub-prod-001` > Deployment history / Environments.

3. Confirmar estado SQL antes o durante calentamiento
   - Comando no sensible:
     ```powershell
     az sql db show `
       --resource-group resource_group_main `
       --server sqlserver-pj13-brazil `
       --name sql-db-puntoclub `
       --query "{name:name,status:status,currentServiceObjectiveName:currentServiceObjectiveName,autoPauseDelay:autoPauseDelay}" `
       --output json
     ```
   - Criterio de exito:
     - `status` termina en `Online`.
   - Si devuelve `Paused`:
     - Es esperado con SQL serverless.
     - Continuar con el paso de API liviana para disparar reanudacion.
     - Esperar 1 a 3 minutos y reintentar.
   - Si devuelve `Resuming`:
     - Esperar 1 a 3 minutos.
     - Reintentar el comando.
     - No cambiar SKU ni firewall durante esta espera.

4. Llamar endpoint liviano de API
   - Endpoint recomendado:
     - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings`
   - Comando no sensible:
     ```powershell
     Invoke-WebRequest `
       -Uri "https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings" `
       -UseBasicParsing `
       -TimeoutSec 30
     ```
   - Variante compacta para ver solo estado HTTP:
     ```powershell
     try {
       $r = Invoke-WebRequest -Uri "https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings" -UseBasicParsing -TimeoutSec 30
       [pscustomobject]@{ status = [int]$r.StatusCode; ok = $r.StatusCode -eq 200 }
     } catch {
       [pscustomobject]@{ status = $_.Exception.Response.StatusCode.value__; error = $_.Exception.Message }
     }
     ```
   - Criterio de exito:
     - HTTP `200`.
     - No hay `500`.
     - Si se revisa body, debe ser JSON de settings de empresa piloto; no copiarlo a chats si contiene datos de negocio.
   - Si falla por timeout o 500:
     - Esperar 1 a 3 minutos si SQL estaba `Paused` o `Resuming`.
     - Reintentar una vez.
     - Pasar a diagnostico si persiste.

5. Confirmar que SQL quedo responsive
   - Repetir:
     ```powershell
     az sql db show `
       --resource-group resource_group_main `
       --server sqlserver-pj13-brazil `
       --name sql-db-puntoclub `
       --query "{name:name,status:status}" `
       --output json
     ```
   - Criterio de exito:
     - `status` es `Online`.
     - Endpoint `/settings` responde `200`.

6. Prueba funcional minima desde UI
   - En el frontend publicado, realizar una busqueda simple desde el flujo normal.
   - Preferir una busqueda controlada que no cree datos.
   - Criterio de exito:
     - La UI no muestra error de API.
     - No hay errores CORS visibles.
     - No hay `500` en la respuesta de API.
   - Nota:
     - No ejecutar registros, compras ni redenciones solo para calentamiento salvo que QA/Product lo pidan, porque esas acciones crean datos reales.

7. Si hay falla, revisar logs
   - Azure Portal:
     - Function App > `func-puntoclub-prod-br-001` > Log stream.
     - Function App > Application Insights > Failures / Performance / Logs.
     - SQL Database > `sql-db-puntoclub` > Overview / Metrics / Activity log.
   - CLI util para stream:
     ```powershell
     az webapp log tail `
       --resource-group resource_group_main `
       --name func-puntoclub-prod-br-001
     ```
   - GitHub Actions API deploy:
     - `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-functions-api.yml`

Criterio de exito general:
- Frontend publicado carga.
- SQL llega a `Online`.
- API `/api/companies/1/settings` responde `200`.
- Una busqueda simple desde UI no muestra error.
- No hay respuestas `500`.
- No hay error CORS en navegador.
- No hay fallo nuevo relevante en Application Insights durante la verificacion.

Criterio de escalamiento:
- P1: API devuelve `500` persistente despues de 2 intentos separados por 1 a 3 minutos.
- P1: SQL permanece `Paused`/`Resuming` o no llega a `Online` despues de varios minutos.
- P1: Endpoint `/settings` no responde pero Function App aparece `Running`.
- P1: Error de conectividad SQL en Application Insights o Log stream.
- P2: Frontend carga pero muestra error de API/CORS.
- P2: Frontend no refleja ultimo deploy esperado.

Acciones si hay escalamiento:
- No cambiar firewall, SKU ni app settings en caliente sin aprobacion.
- Capturar:
  - hora local;
  - URL afectada;
  - status HTTP;
  - captura del error UI si aplica;
  - correlation/id de Application Insights si existe.
- Avisar a Product / Architect / Release con el hallazgo y severidad.
- Infra revisa Azure SQL, Function App, Application Insights y despliegues.
- Backend/API entra si logs muestran excepcion de codigo o consulta SQL.
- Web Dev entra si el problema es CORS/UI/configuracion frontend.

Comandos/URLs no sensibles:
- Frontend:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API settings:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings`
- Estado SQL:
  ```powershell
  az sql db show --resource-group resource_group_main --server sqlserver-pj13-brazil --name sql-db-puntoclub --query "{name:name,status:status}" --output json
  ```
- Function App logs:
  ```powershell
  az webapp log tail --resource-group resource_group_main --name func-puntoclub-prod-br-001
  ```
- GitHub Actions frontend:
  - `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- GitHub Actions API:
  - `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-functions-api.yml`

Riesgos cubiertos:
- SQL serverless en `Paused`/`Resuming` antes de uso real.
- Primer request lento o timeout por reanudacion de SQL.
- Confundir pausa esperada con caida completa.
- Detectar temprano API `500`.
- Detectar temprano problema de frontend/API/CORS.
- Evitar acciones de escritura que creen datos reales durante calentamiento.

Riesgos no cubiertos:
- Caida regional de Azure o GitHub.
- Cambio real de firewall, SKU, app settings o secretos.
- Errores de logica de negocio que solo aparecen al registrar compras/redenciones.
- Problemas de rendimiento bajo carga real.
- Seguridad de `AllowAllWindowsAzureIps`; queda aceptada temporalmente por decision de TASK-080/Product.
- Ausencia de staging formal; el runbook opera contra production piloto.

Recomendacion para Product / Architect / Release antes del piloto:
- Nombrar responsable operativo de ejecutar el runbook antes de cada sesion real.
- Definir horario de calentamiento, idealmente 10 a 15 minutos antes del uso.
- Mantener este runbook como criterio de "ambiente listo" para el piloto controlado.
- No cambiar firewall/SKU antes del piloto salvo tarea separada con aprobacion explicita.
- Si el calentamiento falla mas de una vez, pausar la sesion piloto y escalar antes de que usuarios reales operen.
