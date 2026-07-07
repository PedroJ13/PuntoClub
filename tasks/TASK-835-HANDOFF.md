Equipo: SQL DEV
Modo de ejecucion: Datos / Diagnostico logo empresa
Tarea no completada: TASK-835 - Verificar metadata SQL del logo despues de subida

Resultado:
- No fue posible consultar metadata SQL real de Aurisbel desde este entorno.
- Se intento una conexion read-only corta a Azure SQL usando `SQL_CONNECTION_STRING` de Azure Functions solo en memoria del proceso.
- No se imprimio ni guardo ningun secreto.
- Azure SQL bloqueo la conexion por firewall antes de ejecutar el SELECT.
- No se modificaron datos.
- No se borraron blobs.
- No se tocaron clientes ni campanas.

Bloqueo:
- Azure SQL rechazo la IP cliente `200.229.6.68`.
- Error reportado:
  - `Client with IP address '200.229.6.68' is not allowed to access the server.`

Consulta prevista:
- Buscar empresa Aurisbel por nombre/correo y revisar:
  - `logo_blob_path`;
  - `logo_content_type`;
  - `logo_updated_at`;
  - `updated_at`;
  - `status`.

Evidencia segura:
- `api/local.settings.json`: no existe en este workspace.
- Variable local `SQL_CONNECTION_STRING`: no configurada.
- App setting de Azure Functions: leido solo en memoria, sin imprimir valor.
- Azure SQL no devolvio filas porque la conexion fue bloqueada por firewall.

Uso Azure SQL:
- Intentado.
- Motivo: la tarea exige validar metadata real despues de subida.
- Alcance: intento read-only contra `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Resultado: bloqueado por firewall antes de ejecutar SELECT.

Riesgos o pendientes:
- Infra/SQL DEV debe habilitar una ventana corta de acceso para `200.229.6.68` o ejecutar la consulta desde un ambiente permitido.
- Despues de la publicacion de TASK-834, repetir la subida controlada y validar que `GET /companies/{companyId}/settings` devuelve `logoUrl`, `logoContentType` y `logoUpdatedAt`.
