Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-771 - Cerrar limpieza final de campanas promocionales

Resultado:
- Se procesaron los handoffs `TASK-763` a `TASK-770`.
- El bloque de limpieza final de campanas promocionales queda cerrado.
- Se corrigio el criterio de recipient esperado: `fatima2210@gmail.com` reemplaza a `pj13eros@hotmail.com`.
- SQL DEV aplico la limpieza con `@DryRun = 0`.
- QA publicada aprobo que solo queda la campana `Nuevo - Nueva Bebida`.
- No se enviaron correos reales.
- No se cambiaron API, Web, ACS, sender ni flags.

Handoffs procesados:
- `tasks/TASK-763-HANDOFF.md`
- `tasks/TASK-764-HANDOFF.md`
- `tasks/TASK-765-HANDOFF.md`
- `tasks/TASK-766-HANDOFF.md`
- `tasks/TASK-767-HANDOFF.md`
- `tasks/TASK-768-HANDOFF.md`
- `tasks/TASK-769-HANDOFF.md`
- `tasks/TASK-770-HANDOFF.md`

Secuencia de control:
- `TASK-763`: definio limpieza dejando una sola campana visible como `Nuevo - Nueva Bebida`.
- `TASK-764`: preparo script operativo con dry-run y guardrails.
- `TASK-765`: aprobo dry-run tecnico, pero bloqueo apply por discrepancia del correo inicial.
- `TASK-766`: intento apply controlado, pero se detuvo correctamente por la discrepancia `pj13eros@hotmail.com`.
- `TASK-767`: quedo bloqueada/no ejecutable porque TASK-766 no aplico cambios.
- `TASK-768`: corrigio el criterio final a `fatima2210@gmail.com`.
- `TASK-769`: ejecuto apply con `@ExpectedRecentRecipientEmail = N'fatima2210@gmail.com'`.
- `TASK-770`: aprobo QA publicada post-limpieza.

Campana conservada:
- `company_id = 8`
- `campaign_id = 19`
- `name = Nuevo`
- `subject = Nueva Bebida`
- `status = sent`
- Imagen activa:
  - `D750ABD9-206B-456F-9345-8C42A03271C8`
- Recipient esperado:
  - `fatima2210@gmail.com`
- Provider:
  - `acs-email`

Resultado SQL:
- Eliminado:
  - `19` campanas promocionales de prueba;
  - `6` filas de metadata de imagen de campanas eliminadas;
  - `0` recipients de campanas eliminadas.
- Post-commit para `company_id = 8`:
  - `PromotionalCampaigns = 1`;
  - `PromotionalCampaignImages = 1`;
  - `PromotionalCampaignRecipients = 1`.
- No hubo eventos de baja bloqueantes:
  - `blocking_unsubscribe_events = 0`.

Datos explicitamente no tocados:
- Clientes.
- Puntos y saldos.
- Compras.
- Canjes.
- Membresias.
- Preferencias promocionales / bajas.
- Eventos de baja.
- API, Web, ACS, sender y flags.

QA publicada:
- Resultado: aprobado.
- Ambiente: `https://puntoclubcr.com/app?cb=task770`.
- Confirmado:
  - solo queda visible `Nuevo - Nueva Bebida`;
  - no aparecen campanas de prueba eliminadas;
  - preview muestra asunto `Nueva Bebida`;
  - imagen publica carga desde `/api/public/promotional-campaign-images/D750ABD9-206B-456F-9345-8C42A03271C8`;
  - imagen renderiza completa en navegador;
  - estado de envio queda `0 seleccionados de 5`;
  - no se ejecuto envio.

Uso Azure SQL:
- Si.
- Motivo: dry-run, apply transaccional y validacion post-commit de limpieza real.
- TASK-766 uso Azure SQL solo para preflight/dry-run y quedo bloqueada sin commit.
- TASK-769 aplico el cambio con el criterio corregido.
- TASK-770 uso Web publicada y evidencia SQL post-commit; QA no ejecuto SQL directo.

Firewall / locks:
- TASK-764, TASK-766 y TASK-769 usaron reglas temporales estrechas.
- Las reglas temporales fueron retiradas.
- El lock del SQL Server fue retirado temporalmente solo para eliminar reglas y luego restaurado como `CanNotDelete`.

Fuera de alcance:
- Los blobs fisicos de imagenes antiguas en storage no fueron eliminados.
- Si Product desea limpieza de blobs fisicos, abrir tarea Infra separada con inventario y dry-run.

Riesgos o pendientes:
- El script y handoffs deben quedar versionados en Git mediante `TASK-772`.
- No hacer rollback desde memoria; cualquier rollback requiere tarea explicita y evidencia de `tmp/` segura/no redaccionada si aplica.

Siguiente recomendado:
- Ejecutar `TASK-772` para commitear:
  - `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`;
  - handoffs `TASK-763` a `TASK-771`.
