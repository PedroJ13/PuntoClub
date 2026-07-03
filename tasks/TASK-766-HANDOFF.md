Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada apply
Tarea completada: TASK-766 - Ejecutar limpieza de campanas promocionales con dry_run 0

Estado:
- Bloqueada / no aplicada.

Archivos cambiados:
- `tasks/TASK-766-HANDOFF.md`

Evidencia local generada:
- `tmp/task766/task766-preflight-dry-run-evidence.json`

SQL agregado o modificado:
- No se agrego ni modifico SQL.
- Script objetivo revisado:
  - `database/operations/20260703_task764_clean_promotional_campaigns_keep_nueva_bebida.sql`

Verificacion ejecutada:
- Lectura de `tasks/TASK-764-HANDOFF.md`.
- Lectura del script operativo de TASK-764.
- Lectura de guardrails de Azure SQL.
- Preflight/dry-run fresco contra Azure SQL antes de aplicar.
- Revision de conteos, dependencias y campana conservada.

Resultado del preflight:
- Campana a conservar:
  - `campaign_id = 19`;
  - `company_id = 8`;
  - `name = Nuevo`;
  - `subject = Nueva Bebida`;
  - `status = sent`;
  - imagen activa `D750ABD9-206B-456F-9345-8C42A03271C8`;
  - `recipient_count = 1`;
  - `sent_recipient_count = 1`;
  - `acs_recipient_count = 1`.
- El script eliminaria:
  - `19` campanas;
  - `6` filas de metadata de imagen;
  - `0` recipients.
- Bloqueos por `PromotionalUnsubscribeEvents`:
  - `0`.
- Tablas no objetivo solo leidas:
  - `CustomerPromotionalEmailPreferences`: `2`;
  - `PromotionalUnsubscribeEvents`: `2`;
  - `Customers`: `10`;
  - `Purchases`: `11`;
  - `Redemptions`: `1`;
  - `CustomerMemberships`: `0`.

Apply:
- No ejecutado.
- Motivo: el control de riesgo rechazo ejecutar el `@DryRun = 0` porque la evidencia registrada aun muestra una discrepancia material sobre el correo del envio reciente asociado a la campana conservada.
- La evidencia SQL previa indica que la campana `campaign_id = 19` tiene envio ACS reciente, pero no confirma el correo `pj13eros@hotmail.com`.
- No hubo `COMMIT`.
- No se borraron campanas.
- No se borraron imagenes.
- No se tocaron clientes, puntos, compras, canjes, membresias, preferencias de baja ni eventos de baja.
- No se enviaron correos reales.

Uso Azure SQL:
- Si.
- Motivo: preflight/dry-run real previo al apply.
- Alcance: dry-run transaccional con rollback; no apply.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task766-campaign-cleanup-apply-200-229-6-68`
  - IP: `200.229.6.68`
- Se retiro temporalmente el lock `puntoclub-sqlserver-cannotdelete` para eliminar la regla.
- Verificacion final de regla temporal: `[]`.
- Se restauro el lock del servidor con nivel `CanNotDelete` y nota original.

Riesgos o pendientes:
- Para aplicar se requiere confirmacion explicita posterior del Product Owner aceptando conservar `campaign_id = 19` aunque SQL no confirme `pj13eros@hotmail.com`, o nueva evidencia que resuelva la discrepancia.
- Alternativa segura: ajustar el script para exigir `@ExpectedRecentRecipientEmail = N'pj13eros@hotmail.com'` y repetir dry-run; con la evidencia actual probablemente bloquearia.

Siguiente recomendado:
- Product / Architect / Release debe decidir si:
  - acepta `campaign_id = 19` por ID/nombre/asunto/imagen/envio ACS reciente pese a la discrepancia del correo, o
  - pide diagnostico adicional para ubicar el envio a `pj13eros@hotmail.com`.
