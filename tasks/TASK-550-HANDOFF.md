Equipo: SQL DEV
Modo de ejecucion: Comunicaciones / Correos operativos
Tarea completada: TASK-550 - Aplicar migracion SQL de correos operativos en Azure SQL

Resultado:
- Se aplico en Azure SQL la migracion:
  - `database/migrations/20260629_operational_emails.sql`
- Base objetivo:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`
- No se crearon recursos nuevos.
- No se imprimieron ni guardaron secretos.

SQL aplicado:
- `dbo.CompanyOperationalEmailSettings`
- `dbo.OperationalEmailEvents`
- `dbo.OperationalEmailMessages`
- `dbo.OperationalEmailAttempts`
- Indices:
  - `UX_OperationalEmailEvents_company_idempotency`
  - `IX_OperationalEmailEvents_company_created`
  - `IX_OperationalEmailMessages_event`
  - `IX_OperationalEmailAttempts_message`

Verificacion ejecutada:
- Conexion a Azure SQL con token AAD de Azure CLI.
- Ejecucion de 8 batches SQL: `batch 1/8 ok` a `batch 8/8 ok`.
- Validacion read-only de objetos creados:
  - Tablas encontradas:
    - `CompanyOperationalEmailSettings`
    - `OperationalEmailAttempts`
    - `OperationalEmailEvents`
    - `OperationalEmailMessages`
  - Indices encontrados:
    - `IX_OperationalEmailAttempts_message`
    - `IX_OperationalEmailEvents_company_created`
    - `IX_OperationalEmailMessages_event`
    - `UX_OperationalEmailEvents_company_idempotency`

Uso Azure SQL:
- Si.
- Motivo: aplicar migracion aprobada de correos operativos.
- Alcance: ventana corta de conexion, aplicacion DDL y validacion de metadatos.

Firewall temporal:
- Se creo regla temporal estrecha para la IP local:
  - `tmp-task550-operational-emails-200-229-6-68`
- Al intentar eliminarla, Azure devolvio `ScopeLocked` porque el servidor SQL tiene un lock que bloquea operaciones delete.
- Para no dejar abierta la IP local, la regla se actualizo a:
  - start IP: `192.0.2.1`
  - end IP: `192.0.2.1`
- Pendiente: Infra debe retirar la regla cuando gestione temporalmente el lock del servidor.

Riesgos o pendientes:
- Pendiente limpieza final de la regla temporal neutralizada por lock de Azure.
- Backend/API de TASK-547 aun requiere publicacion para usar estas tablas en ambiente publicado.
- Web de TASK-548 aun requiere publicacion para que el panel use la configuracion real publicada.

Siguiente recomendado:
- Infra: retirar lock temporalmente, borrar `tmp-task550-operational-emails-200-229-6-68`, restaurar lock.
- Backend/API: publicar cambios de correos operativos.
- Web Dev: publicar configuracion real de correos operativos.
