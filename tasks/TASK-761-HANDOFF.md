Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-761 - Cerrar bloque de limpieza promocional de pruebas

Resultado:
- Se procesaron los handoffs `TASK-756` a `TASK-760`.
- El bloque de limpieza promocional de pruebas queda cerrado.
- SQL DEV aplico la limpieza controlada con `@DryRun = 0` y `@ConfirmTask = N'TASK-757-APPLY'`.
- QA aprobo la validacion post-limpieza en Web publicada.
- No se enviaron correos reales.
- No se cambiaron flags, API, Web, ACS ni sender.

Handoffs procesados:
- `tasks/TASK-756-HANDOFF.md`
- `tasks/TASK-757-HANDOFF.md`
- `tasks/TASK-758-HANDOFF.md`
- `tasks/TASK-759-HANDOFF.md`
- `tasks/TASK-760-HANDOFF.md`

Secuencia de control:
- `TASK-756`: definio alcance de limpieza, prohibiciones y guardrails.
- `TASK-757`: preparo script seguro en `database/operations/20260702_task757_clean_promotional_test_sends.sql`.
- `TASK-758`: quedo bloqueada antes del apply porque la limpieza aun no habia sido ejecutada.
- `TASK-759`: ejecuto el apply real en Azure SQL con dry-run previo y evidencia redaccionada.
- `TASK-760`: revalido post-limpieza en Web publicada y Azure SQL read-only.

Resultado de datos:
- Antes del apply:
  - 6 filas seleccionadas en `dbo.PromotionalCampaignRecipients`.
  - 6 campanas afectadas, todas de `company_id = 8`.
- Cambios aplicados:
  - 6 filas eliminadas de `dbo.PromotionalCampaignRecipients`.
  - Las 6 campanas afectadas quedaron en `draft`.
  - `confirmed_at` y `sent_at` quedaron en `NULL`.
- Despues del apply:
  - `dbo.PromotionalCampaignRecipients`: `0` filas totales.
  - Campanas afectadas: 6 en `draft`, con `recipient_count = 0`.

Datos explicitamente no tocados:
- `dbo.Customers`
- puntos y saldos;
- compras;
- canjes;
- membresias;
- beneficios y ledgers;
- `dbo.CustomerPromotionalEmailPreferences`;
- `dbo.PromotionalUnsubscribeEvents`;
- `dbo.PromotionalCampaignImages`;
- campanas/plantillas como registros.

QA post-limpieza:
- Resultado: aprobado.
- Ambiente: `https://puntoclubcr.com/app?cb=task760`.
- Sesion real/controlada: Aurisbel Pasteleria (`company_id = 8`).
- Validado:
  - `dbo.PromotionalCampaignRecipients` quedo en `0` antes y despues de la prueba UI;
  - clientes elegibles disponibles para seleccion promocional;
  - `Seleccionar elegibles` llevo la UI a `5 seleccionados de 5`;
  - no aparecio bloqueo por `ya enviado` / `ya incluido`;
  - seleccion limpiada al cierre;
  - no se hizo click en `Enviar campana`;
  - no se crearon nuevos recipients ni envios durante QA.

Uso Azure SQL:
- Si.
- Motivo: limpieza real autorizada y validacion post-limpieza.
- Alcance:
  - TASK-759: dry-run previo, apply transaccional y validacion post-commit.
  - TASK-760: SELECTs read-only y validacion UI publicada.

Firewall / locks:
- TASK-759:
  - regla temporal `tmp-task759-promo-cleanup-200-229-6-68` creada y retirada;
  - fue necesario retirar temporalmente el lock del SQL Server para eliminar la regla;
  - lock del servidor restaurado como `CanNotDelete`;
  - lock de la base no se retiro.
- TASK-760:
  - regla temporal `tmp-task760-qa-readonly-200-229-6-68` creada y retirada;
  - fue necesario retirar temporalmente el lock del SQL Server para eliminar la regla;
  - lock del servidor restaurado como `CanNotDelete`.
- Verificacion final reportada en ambos handoffs: reglas temporales retiradas (`[]`).

Evidencia:
- Evidencia redaccionada local en `tmp/task759/` y `tmp/task760/`.
- No se debe commitear evidencia local de `tmp/` salvo decision explicita separada.
- Script operativo versionado:
  - `database/operations/20260702_task757_clean_promotional_test_sends.sql`

Riesgos o pendientes:
- Si se requiere rollback, no hacerlo desde memoria: abrir tarea explicita y usar evidencia/snapshot autorizado.
- Si se requiere prueba de envio real posterior, abrir tarea separada con destinatarios controlados y autorizacion explicita del Product Owner.
- Queda pendiente higiene Git de este bloque en `TASK-762`.

Siguiente recomendado:
- Ejecutar `TASK-762` para commitear script operativo y handoffs `TASK-756` a `TASK-761`, excluyendo `debug.log`, `tmp/` y handoffs antiguos no relacionados.
