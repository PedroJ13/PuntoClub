# TASK-319 - Handoff

Equipo: Ejecucion Tecnica  
Modo de ejecucion: SQL / Infra  
Round: 55  
Estado: Bloqueado (requiere acceso operativo Azure SQL)

## Uso DB cloud

Si: **No para cambios de lógica**.  
Motivo: diagnóstico y validación de origen de datos del piloto (confirmar compañía activa + posibilidad de crear/retornar compañía piloto mínima).
Alcance: verificación de conectividad SQL y consulta de estado funcional del `smoke` contra API publicada.

## Objetivo de la tarea

- Confirmar qué `company_id` existe y está `active` en `dbo.Companies` en Azure SQL.
- Si no hay compañía activa, crear/restaurar piloto mínimo.
- Ajustar `PILOT_COMPANY_ID` si aplica.
- Reintentar `Deploy Punto Club API`.

## Resultado

No se pudo completar el objetivo completo por bloqueo de infraestructura externa:

1. **Conexión directa a Azure SQL bloqueada por firewall de IP**
   - Comando intentado (desde `api/`):
   - `SELECT ... FROM dbo.Companies`
   - Error: `ELOGIN - Client with IP address '200.229.6.68' is not allowed to access the server...`
   - Esto confirma que **no podemos leer `dbo.Companies` desde este entorno** para confirmar IDs activos.

2. **Sin acceso a Azure CLI autenticado para operar SQL/infra**
   - `az account show` requiere login.
   - `az login --use-device-code` no pudo completar (proxy y autenticación pendientes; no se pudo cerrar sesión interactivamente).
   - También existe bloqueo de escritura de sesión por configuración de Azure CLI en entorno restringido (si no se usa `AZURE_CONFIG_DIR` y proxy corregido).

3. **Validación funcional vía API publicada**
   - Se probó `GET /companies/{id}/settings` para `id 1..500` contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
   - **Ningún id retornó `200`**; todos devolvieron `404 COMPANY_NOT_FOUND`.
   - Esto es consistente con ausencia de `companyId` activa visible para el API o compañía no activa en los ids consultados.

## Estado `PILOT_COMPANY_ID`

- En workflow `Deploy Punto Club API` ya está configurado como `PILOT_COMPANY_ID=3`.
- Sin conexión a SQL no se pudo validar/ajustar a una compañía activa real.
- Sin ese dato operativo, no se consideró crear/actualizar piloto desde este paso.

## Deploy

- No se pudo re-lanzar `Deploy Punto Club API` desde este entorno:
  - no hay capacidad de autenticación de GitHub/Azure efectiva con las restricciones actuales.

## Siguiente acción mínima (desbloqueo)

- Abrir acceso de infraestructura desde Azure (IP reportada) al server `sqlserver-pj13-brazil` o habilitar una máquina con acceso permitido.
- Ejecutar consulta directa:
  - `SELECT id, name, status FROM dbo.Companies;`
- Confirmar `company_id` activo y actualizar `PILOT_COMPANY_ID` en workflow/Settings.
- Si no hay activo, crear/restaurar compañía piloto mínima en SQL y correr nuevamente deploy + smoke.

