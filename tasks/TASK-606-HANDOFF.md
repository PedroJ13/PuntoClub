Equipo: SQL DEV
Tarea completada: TASK-606 - Consultar trazabilidad de correo welcome de cliente registrado hoy

Archivos cambiados:
- `tasks/TASK-606-HANDOFF.md`

SQL agregado o modificado:
- Ninguno.
- Solo se ejecutaron consultas `SELECT` read-only contra Azure SQL.

Ventana consultada:
- Fecha local solicitada: 2026-06-30, America/Costa_Rica.
- Ventana UTC usada para `created_at`: `2026-06-30T06:00:00.000Z` a `2026-07-01T06:00:00.000Z`.

Verificacion ejecutada:
- Se consultaron `dbo.Customers`, `dbo.OperationalEmailEvents`, `dbo.OperationalEmailMessages` y `dbo.OperationalEmailAttempts`.
- Se filtro por clientes registrados hoy y eventos `event_type = 'welcome'`.
- Se revisaron estado final, `recipient_email`, `provider_message_id`, errores y attempts.
- Se uso `SQL_CONNECTION_STRING` de Azure Functions solo en memoria del proceso; no se imprimio ni se guardo.

Resultado:
- Clientes registrados hoy encontrados: 5.
- Los 5 clientes tienen evento welcome asociado.
- Los 5 eventos welcome estan en estado final `sent`.
- No se observaron `last_error` ni `attempt_error_message` en los registros consultados.

Detalle del cliente registrado mas reciente:
- `customer_id`: `131`
- `company_id`: `8`
- `customer_name`: `stiven caballero`
- `customer_created_at`: `2026-07-01T00:47:02.000Z`
- `event_id`: `18`
- `event_type`: `welcome`
- `idempotency_key`: `welcome:customer:131`
- `event_status`: `sent`
- `event_created_at`: `2026-07-01T00:47:03.000Z`
- `event_updated_at`: `2026-07-01T00:47:08.000Z`
- `message_id`: `18`
- `recipient_email`: `jhonnycaballero283@gmail.com`
- `subject`: `Bienvenido a Aurisbel Pasteleria`
- `message_status`: `sent`
- `provider`: `acs-email`
- `provider_message_id`: `18e8cf19-f215-4fe9-9f61-a08d0f1b0d0f`
- `last_error`: `null`
- `sent_at`: `2026-07-01T00:47:08.000Z`
- `attempt_id`: `18`
- `attempt_number`: `1`
- `attempt_status`: `sent`
- `attempt_provider_message_id`: `18e8cf19-f215-4fe9-9f61-a08d0f1b0d0f`
- `attempt_error_message`: `null`
- `attempted_at`: `2026-07-01T00:47:08.000Z`

Resumen de eventos welcome de hoy:
- `customer_id=131`, `company_id=8`, `event_id=18`, `message_id=18`, `recipient_email=jhonnycaballero283@gmail.com`, `status=sent`, `provider_message_id=18e8cf19-f215-4fe9-9f61-a08d0f1b0d0f`, `error=null`.
- `customer_id=130`, `company_id=6`, `event_id=15`, `message_id=15`, `recipient_email=qa-1782856155644@puntoclub.test`, `status=sent`, `provider_message_id=597d10bc-32ac-46ff-8209-2d3e4863f939`, `error=null`.
- `customer_id=129`, `company_id=6`, `event_id=12`, `message_id=12`, `recipient_email=qa-1782844844853@puntoclub.test`, `status=sent`, `provider_message_id=328ba53a-b402-4ec3-9d96-a7cf06b73189`, `error=null`.
- `customer_id=128`, `company_id=6`, `event_id=9`, `message_id=9`, `recipient_email=qa-1782832267425@puntoclub.test`, `status=sent`, `provider_message_id=f12b397b-c71b-4ae4-a174-cc79c26f180c`, `error=null`.
- `customer_id=127`, `company_id=6`, `event_id=6`, `message_id=6`, `recipient_email=qa-1782825073050@puntoclub.test`, `status=sent`, `provider_message_id=fdef8e8b-64b8-4425-9efa-3d2a2f438b72`, `error=null`.

Uso Azure SQL:
- Si.
- Motivo: la tarea pidio diagnostico real de trazabilidad en Azure SQL.
- Alcance: consultas read-only acotadas a clientes/eventos welcome creados en la ventana del 2026-06-30 local.

Firewall y locks:
- La primera conexion fue rechazada por firewall para la IP local `200.229.6.68`.
- Se creo regla temporal estrecha `tmp-task606-email-trace-200-229-6-68`.
- Al finalizar, el retiro fue bloqueado por el lock `puntoclub-sqlserver-cannotdelete`.
- Se retiro temporalmente solo ese lock del SQL Server, se elimino la regla temporal y se restauro el lock `CanNotDelete` con la misma nota.
- Verificacion final:
  - regla temporal: `0`
  - lock SQL Server `puntoclub-sqlserver-cannotdelete`: presente
  - lock SQL DB `puntoclub-sqldb-cannotdelete`: presente

Riesgos o pendientes:
- La trazabilidad SQL confirma envio aceptado por ACS (`sent`) y `provider_message_id`, pero no confirma lectura/entrega final en el mailbox del destinatario.
- Si el PO no recibio el correo, el siguiente diagnostico debe ser Infra/ACS deliverability o revision de bandeja spam/rebotes con el `provider_message_id` indicado.

Siguiente recomendado:
- Para el cliente mas reciente (`customer_id=131`), usar `provider_message_id=18e8cf19-f215-4fe9-9f61-a08d0f1b0d0f` en una tarea Infra/ACS si se necesita validar entrega o rebote del proveedor.
