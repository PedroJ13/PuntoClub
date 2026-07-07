Equipo: SQL DEV
Modo de ejecucion: Datos / Diagnostico logo empresa
Tarea no completada: TASK-829 - Verificar estado real del logo de Aurisbel

Resultado:
- No fue posible consultar el estado real del logo de Aurisbel en Azure SQL desde este entorno.
- Se intento una conexion read-only corta usando `SQL_CONNECTION_STRING` de Azure Functions solo en memoria del proceso.
- No se imprimio ni guardo ningun secreto.
- La conexion fue bloqueada por firewall de Azure SQL antes de ejecutar la consulta.
- No se modificaron datos.
- No se borro ningun blob.
- No se cambio SQL.
- No se tocaron clientes ni campanas.

Bloqueo:
- Azure SQL rechazo la IP cliente `200.229.6.68`.
- Error reportado por el cliente SQL:
  - `Client with IP address '200.229.6.68' is not allowed to access the server.`

Consulta prevista:
- Buscar empresas Aurisbel por nombre/correo y revisar:
  - `id`;
  - `name`;
  - `status`;
  - `logo_blob_path`;
  - `logo_content_type`;
  - `logo_updated_at`.

Evidencia segura:
- `api/local.settings.json`: no existe en este workspace.
- Variable local `SQL_CONNECTION_STRING`: no configurada.
- App setting de Azure Functions: se leyo solo en memoria, sin imprimir valor.
- Azure SQL no devolvio filas porque la conexion fue bloqueada por firewall.

Uso Azure SQL:
- Intentado.
- Motivo: la tarea exige diagnostico de metadata real.
- Alcance: intento de conexion read-only a `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Resultado: bloqueado por firewall antes de ejecutar SELECT.

Riesgos o pendientes:
- Infra/SQL DEV debe habilitar una ventana corta de acceso para `200.229.6.68` o ejecutar la consulta desde un ambiente permitido.
- Si SQL confirma `logo_blob_path`, coordinar con Infra para validar existencia fisica del blob en `stpuntoclublogosbr001/company-logos`.
