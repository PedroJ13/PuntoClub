Equipo: SQL DEV
Modo de ejecucion: Datos / Diagnostico logo empresa
Tarea completada: TASK-835 - Verificar metadata SQL del logo despues de subida

Resultado:
- Se consulto Azure SQL en modo read-only para validar metadata real del logo de Aurisbel despues de subida.
- La empresa encontrada fue:
  - `id`: `8`;
  - `name`: `Aurisbel Pastelería`;
  - `status`: `active`;
  - dominio de correo: `gmail.com`.
- SQL confirma que la metadata del logo esta persistida:
  - `logo_blob_path`: presente;
  - `logo_content_type`: `image/png`;
  - `logo_updated_at`: `2026-07-07T19:48:02.000Z`;
  - `updated_at`: `2026-07-07T19:48:02.000Z`.
- El problema de perdida al refrescar no parece ser falta de persistencia SQL.
- La causa compatible con la evidencia es la corregida en TASK-834: el endpoint de settings no devolvia la metadata privada del logo.
- No se modificaron datos.
- No se borraron blobs.
- No se tocaron clientes ni campanas.

Evidencia redaccionada:
- `hasLogoBlobPath`: `true`.
- `logoBlobPath`: `companies/8/logo/8c760f81-b89d-4968-9351-053a3736e6fa.png`.
- `logoContentType`: `image/png`.
- `logoUpdatedAt`: `2026-07-07T19:48:02.000Z`.

Azure SQL / Firewall:
- Se creo regla temporal:
  - `tmp-task835-logo-metadata-200-229-6-68`;
  - IP: `200.229.6.68`.
- La consulta se ejecuto correctamente.
- Al retirar la regla, el lock del SQL Server bloqueo el delete.
- Se retiro temporalmente el lock:
  - `puntoclub-sqlserver-cannotdelete`;
  - nivel original: `CanNotDelete`;
  - nota original: `PuntoClub proteccion minima: evitar borrado accidental del SQL Server productivo`.
- Se elimino la regla temporal.
- Se restauro el lock con el mismo nombre, nivel y nota.
- Verificacion final:
  - regla temporal: `[]`;
  - lock `puntoclub-sqlserver-cannotdelete`: presente con `CanNotDelete`.

Uso Azure SQL:
- Si.
- Motivo: la tarea exigia validar metadata real despues de subida.
- Alcance: SELECT read-only sobre `dbo.Companies` filtrando Aurisbel por nombre/correo.

Riesgos o pendientes:
- No se valido blob fisico en Storage; si QA ve imagen rota despues de publicar TASK-834, coordinar con Infra para validar que el blob exista en `stpuntoclublogosbr001/company-logos`.
- Publicar TASK-834/TASK-836 y validar que `GET /companies/{companyId}/settings` devuelva `logoUrl`, `logoContentType` y `logoUpdatedAt` para Aurisbel.
