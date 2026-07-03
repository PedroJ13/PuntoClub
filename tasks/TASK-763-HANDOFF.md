Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Limpieza datos promocionales
Tarea completada: TASK-763 - Definir limpieza de campanas promocionales dejando solo Nueva Bebida

Archivos cambiados:
- `tasks/TASK-763-HANDOFF.md`

Decision:
- Se autoriza preparar una limpieza controlada de campanas promocionales de prueba para dejar una sola campana visible como `Nuevo - Nueva Bebida`.
- No se autoriza apply todavia desde esta tarea.
- La limpieza debe ejecutarse primero en dry-run y pasar QA antes de cualquier `COMMIT`.

Campana candidata a conservar:
- `company_id = 8`
- `campaign_id = 19`
- `name = Nuevo`
- `subject = Nueva Bebida`
- `status = sent`
- `active_image_public_id = D750ABD9-206B-456F-9345-8C42A03271C8`
- `active_image_file_name = Matcha fresa.jpeg`
- Senal de envio reciente:
  - `sent_at = 2026-07-03T03:27:35Z`
  - `provider = acs-email`
  - existe `provider_message_id`

Nota de discrepancia:
- La tarea menciona asociacion con envio reciente a `pj13eros@hotmail.com`.
- La consulta read-only posterior encontro el recipient reciente de `campaign_id = 19` redaccionado como `fa***@gmail.com`, no `pj13eros@hotmail.com`.
- Por seguridad, la campana a conservar se identifica por ID, nombre/asunto, imagen activa y envio ACS reciente. Si el correo `pj13eros@hotmail.com` es criterio obligatorio, debe confirmarse antes del apply.

Alcance permitido para SQL DEV:
- Preparar script operativo con `@DryRun = 1` por defecto.
- Mostrar evidencia previa:
  - campana a conservar;
  - campanas a eliminar;
  - imagenes afectadas;
  - recipients afectados;
  - eventos de baja que bloquearian apply si existieran;
  - conteos de tablas no objetivo.
- En apply futuro, borrar solo dependencias seguras de campanas eliminadas:
  - `dbo.PromotionalCampaignRecipients`;
  - `dbo.PromotionalCampaignImages`;
  - `dbo.PromotionalCampaigns`.

Fuera de alcance / prohibido:
- No borrar ni modificar clientes.
- No tocar puntos, compras, canjes, membresias, beneficios o ledgers.
- No modificar `dbo.CustomerPromotionalEmailPreferences`.
- No borrar ni modificar `dbo.PromotionalUnsubscribeEvents`.
- No borrar blobs fisicos de imagen desde storage en esta limpieza SQL.
- No enviar correos reales.
- No cambiar API, Web, ACS, sender ni flags.

Controles requeridos:
- `@DryRun = 1` por defecto.
- Confirmacion textual obligatoria para apply futuro.
- Guardas para validar que la campana a conservar existe y coincide con:
  - `company_id`;
  - `campaign_id`;
  - `name`;
  - `subject`;
  - imagen activa esperada.
- Detener apply si alguna campana a eliminar tiene referencias en `PromotionalUnsubscribeEvents`.
- Validacion posterior dentro de transaccion.
- Rollback automatico en dry-run.

Uso Azure SQL:
- Si.
- Motivo: lectura read-only corta para identificar campana candidata y riesgos antes de definir limpieza.

Riesgos o pendientes:
- La discrepancia del correo objetivo debe ser considerada por QA/Product antes de aplicar.
- Si se desea limpiar tambien blobs fisicos en storage, requiere tarea Infra separada; esta decision solo cubre metadata SQL.

Siguiente recomendado:
- Ejecutar TASK-764 para crear script seguro y dry-run.
- Ejecutar TASK-765 para revisar evidencia dry-run antes de decidir apply.
