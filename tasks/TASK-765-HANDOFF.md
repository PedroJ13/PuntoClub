Equipo: QA
Modo de ejecucion: Datos / Validacion dry-run
Tarea completada: TASK-765 - Validar dry-run de limpieza de campanas promocionales

Archivos cambiados:
- `tasks/TASK-765-HANDOFF.md`

Evidencia revisada:
- `tasks/TASK-763-HANDOFF.md`
- `tasks/TASK-764-HANDOFF.md`
- `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`
- `tmp/task764/task764-identification-readonly-redacted.json`
- `tmp/task764/task764-dry-run-evidence.json`
- `tmp/task764/task764-post-dry-run-rollback-validation.json`

Ambiente:
- Azure SQL real: `sqlserver-pj13-brazil.database.windows.net` / `sql-db-puntoclub`
- `company_id = 8`
- Solo dry-run / lectura.
- No se ejecuto apply.
- No se enviaron correos reales.

Validacion ejecutada:
- Se confirmo que el script corre con `@DryRun = 1`.
- Se confirmo que el dry-run hizo rollback.
- Se confirmo que la campana conservada seria:
  - `campaign_id = 19`;
  - `Nuevo - Nueva Bebida`;
  - `status = sent`;
  - imagen activa `D750ABD9-206B-456F-9345-8C42A03271C8`;
  - recipient enviado por ACS.
- Se confirmo que el script eliminaria solo metadata promocional de campanas no conservadas:
  - `19` campanas;
  - `6` imagenes metadata;
  - `0` recipients.
- Se confirmo que no eliminaria:
  - clientes;
  - puntos;
  - compras;
  - canjes;
  - membresias;
  - preferencias promocionales;
  - eventos de baja;
  - blobs fisicos.
- Se confirmo que no hay eventos de baja bloqueantes para las campanas a eliminar:
  - `blocking_unsubscribe_events = 0`.
- Se confirmo post-rollback que no hubo cambios persistentes:
  - campañas actuales: `20`;
  - imagenes actuales: `7`;
  - recipients actuales: `1`;
  - `campaign_id = 19` sigue existiendo.

Resultado QA:
- Dry-run tecnico: aprobado.
- Apply: no aprobado todavia.

P0/P1:
- P1 para decision de apply: la tarea menciona que la campana a conservar esta asociada a envio reciente a `pj13eros@hotmail.com`, pero la evidencia SQL actual no confirma ese correo.
- El script conserva la campana correcta por ID/nombre/asunto/imagen/envio ACS reciente, pero no por correo exacto.

P2/P3:
- Ninguno adicional.

Uso Azure SQL:
- Si.
- Motivo: validar evidencia dry-run real de limpieza de datos promocionales.
- Alcance: revision de resultados ya generados por TASK-764; no se hizo apply.

Riesgos o pendientes:
- Product debe confirmar si `campaign_id = 19` es la campana a conservar aunque el recipient SQL no coincida con `pj13eros@hotmail.com`.
- Si el correo exacto es obligatorio, SQL DEV debe ajustar `@ExpectedRecentRecipientEmail` y repetir dry-run; con la evidencia actual ese guard probablemente bloquearia.

Siguiente recomendado:
- No aplicar limpieza aun.
- Confirmar con Product Owner si se conserva `campaign_id = 19` por ID/nombre/asunto/imagen/envio ACS reciente, o si se debe buscar otra evidencia externa de ACS/UI para el correo `pj13eros@hotmail.com`.
