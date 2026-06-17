# TASK-318 - Handoff

Equipo: Ejecucion Tecnica  
Modo de ejecucion: Backend/API + SQL validacion  
Round: 54  
Estado: Bloqueado (requiere confirmación de datos base)  

## Uso DB cloud

No, por cambio de configuración; **siempre** se evitó lectura/escritura SQL desde cloud persistente en código (sólo diagnóstico controlado del endpoint publicado y validación remota de smoke).  
Motivo: el flujo sigue fallando por ausencia de empresa piloto activa, no por latencia de conexión.
Alcance: validación remota del endpoint smoke (sin exponer secretos) y ajuste de workflow/appsettings.

## Resultado

- Aplicada la corrección de configuración del workflow (`.github/workflows/azure-functions-api.yml`) para que el smoke test use `PILOT_COMPANY_ID=3` de forma consistente al deploy.
- Se intentó reintento operativo de smoke contra API publicada con `PILOT_COMPANY_ID=3` y `API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- El endpoint sigue respondiendo:
  - `GET /companies/3/settings expected 200, got 404: {"error":{"code":"COMPANY_NOT_FOUND","message":"Company was not found."}}`

## Evidencia técnica

- `api/scripts/smoke-test.js` ya usa `process.env.PILOT_COMPANY_ID || '1'` y se valida con env del workflow.
- `api/src/lib/http.js` mantiene validación anti-divergencia:
  - si no hay token, `pathCompanyId` debe ser igual a `PILOT_COMPANY_ID`.
- Se cambió en workflow:
  - `env.PILOT_COMPANY_ID=3`.
  - nuevo paso de deploy para publicar `PILOT_COMPANY_ID` en app settings.
  - `Smoke test stable API` corre con `API_BASE_URL` y `PILOT_COMPANY_ID` explícitos.
- Consulta remota pública para descubrimiento:
  - se probaron `1..30` contra `/companies/{id}/settings` y cada id respondió `404 COMPANY_NOT_FOUND`.

## Empresa de smoke usada

- Configurada en workflow: `3` (mismo ID indicado como piloto en tareas previas de SQL cleanup).
- Estado final observado en API publicada: **NO encontrada como activa** (404).

## Pendiente de bloqueo

Se requiere confirmar en SQL de ejecución real de `sql-db-puntoclub`:
- qué `company_id` está activo en `dbo.Companies`.
- o recrear/restaurar empresa piloto activa si no existe.

Con el estado actual, el deploy del API sigue fallando en smoke por dato de piloto, no por la lógica de workflow.

