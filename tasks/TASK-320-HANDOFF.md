# TASK-320 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra / Azure + SQL validacion
Round: 56
Estado: Bloqueado (bloqueo de acceso operativo sin desbloqueo SQL)

## Uso DB cloud
Si, motivo: validar `dbo.Companies` para confirmar compañía piloto real del smoke y relanzar API con `PILOT_COMPANY_ID` válido. Alcance: lectura SQL puntual + ajuste de configuración de pilot.

## Resultado

- IP pública detectada: `200.229.6.68`.
- Bloqueo SQL confirmado al conectar directo por app:
  - `ELOGIN - Client with IP address '200.229.6.68' is not allowed to access the server...`
- Regla de firewall temporal no pudo crearse desde esta sesión.
 - Causa principal:
  - `az login --use-device-code` no terminó en esta sesión (timeout sin completar autenticación).
  - `az account show` indica que no hay cuenta activa.
  - Proxy institucional activo por entorno (`HTTP_PROXY=http://127.0.0.1:9`, `HTTPS_PROXY=http://127.0.0.1:9`, `ALL_PROXY=http://127.0.0.1:9`, `GIT_HTTP_PROXY=http://127.0.0.1:9`, `GIT_HTTPS_PROXY=http://127.0.0.1:9`).
 - Conexión admin (`sql_admin.ps1`) no alcanza sin apertura previa de firewall.

### Consulta objetivo

No pudo ejecutarse:
```sql
SELECT id, name, status
FROM dbo.Companies
ORDER BY id;
```
Respuesta del intento de ejecución:
`ConnectionError ELOGIN: Cannot open server 'sqlserver-pj13-brazil' requested by the login. Client with IP address '200.229.6.68' is not allowed to access the server.`

### API smoke

- `GET /companies/3/settings` devolvió `404 COMPANY_NOT_FOUND` (estado previo de piloto no localizado en API publicada).

### Deploy

- `Deploy Punto Club API` no relanzado en esta ronda por falta de confirmación de `company_id` activo.

## Recomendación / Acción requerida

Abrir acceso de Azure SQL para `200.229.6.68` de forma temporal al server `sqlserver-pj13-brazil` (o ruta equivalente válida), luego:

1. Ejecutar la consulta de `dbo.Companies`.
2. Definir `PILOT_COMPANY_ID` de compañía activa y actualizar appsetting de workflow.
3. Relanzar `Deploy Punto Club API` y revalidar smoke.

Regla temporal sugerida: `tmp-task320-sql-airtable`.

## Acciones ejecutadas en esta ronda

- Intento de desbloqueo SQL por app (Node + `mssql`) con conexión estándar y admin runtime.
- Intento de autenticación Azure CLI con `az login --use-device-code`.
- Consulta pública del smoke endpoint publicada (`/api/companies/3/settings`) para verificar estado de `PILOT_COMPANY_ID`.
