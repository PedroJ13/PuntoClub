# TASK-479 - Handoff

## Resultado

Completado retroactivamente para trazabilidad.

Se registro como tarea del proyecto el paquete minimo de proteccion Azure SQL backup/restore aplicado el 2026-06-25 y documentado en `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`.

## Decision para Proyecto

El paquete minimo queda aceptado como baseline actual de proteccion operativa de Azure SQL:

- PITR / short-term retention: 14 dias.
- LTR: apagado.
- Backup redundancy: Local.
- Restore temporal: no ejecutado.
- Proteccion adicional: locks `CanNotDelete` y alertas minimas de Activity Log.

No se requiere accion tecnica inmediata dentro de esta tarea. Los pendientes deben abrirse como tareas nuevas solo si Product Owner acepta costo temporal o recurrente.

## P0/P1

P1 pendientes conocidos:

- No hay prueba real de restore ejecutada/documentada.
- Backup redundancy sigue en `Local` por decision explicita.

No se reportan P0 nuevos en esta tarea documental.

## Pendientes accionables

P2:

- LTR sigue apagado.
- No hay SQL Auditing ni diagnostic settings.
- Firewall conserva regla amplia `AllowAllWindowsAzureIps`.

P3:

- Falta runbook formal de disaster recovery con RTO/RPO.
- Falta decidir si se hara BACPAC antes de migraciones grandes o cierres de mes.

## Evidencia resumida

Documento de evidencia:

- `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`

Cambios aplicados segun el documento:

- PITR subido de 7 a 14 dias.
- Action group minimo creado: `ag-puntoclub-sql-min`.
- Locks `CanNotDelete` creados:
  - `puntoclub-sqlserver-cannotdelete`
  - `puntoclub-sqldb-cannotdelete`
- Alertas minimas creadas:
  - `ala-puntoclub-sqlserver-delete`
  - `ala-puntoclub-sqldb-delete`
  - `ala-puntoclub-sqldb-write`
  - `ala-puntoclub-sql-firewall-write`
  - `ala-puntoclub-sql-firewall-delete`
  - `ala-puntoclub-sql-lock-write`
  - `ala-puntoclub-sql-lock-delete`
  - `ala-puntoclub-sqldb-resource-health`

Cambios no aplicados por costo o decision:

- No se cambio backup redundancy a geo-redundante.
- No se activo LTR.
- No se creo restore temporal.
- No se activo SQL Auditing ni diagnostic settings con destinos de costo recurrente.
- No se creo BACPAC/export.

## Archivos / commits

Archivos creados por esta tarea de trazabilidad:

- `tasks/TASK-479-assignment.md`
- `tasks/TASK-479-HANDOFF.md`

Archivo de evidencia preexistente:

- `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`

Commit: pendiente si Product Owner decide commitear esta trazabilidad.

## Detalle tecnico

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra Azure / SQL DEV
Tarea: TASK-479 - Trazabilidad de paquete minimo Azure SQL backup/restore
Resultado: completado retroactivamente para mantener trazabilidad de cambios ya aplicados.

Verificacion ejecutada:

- Lectura de `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`.
- Confirmacion documental de que el paquete aplicado no toco datos de negocio y no expuso secretos.
- Confirmacion documental de que LTR sigue apagado, backup redundancy sigue en `Local`, no hubo restore temporal y la proteccion actual se basa en PITR de 14 dias + locks + alertas minimas.

Uso cloud/SQL:

- Esta tarea de trazabilidad no ejecuto comandos cloud ni SQL.
- El trabajo documentado si uso Azure control-plane.
- El trabajo documentado no uso ni modifico datos de negocio.

Riesgos o pendientes:

- Mantener como riesgo P1 la ausencia de restore probado.
- Mantener como riesgo P1 la redundancia local ante incidente regional.
- Evaluar LTR/auditing/diagnostics solo si se acepta costo recurrente bajo.

Siguiente recomendado:

- Si se acepta costo temporal: crear tarea de restore controlado a DB nueva, validar metadata/tablas criticas sin exponer datos de negocio y borrar la DB restaurada al final.
- Si se acepta costo recurrente bajo: evaluar LTR mensual 3 a 6 meses, SQL Auditing basico y diagnostic settings con retencion controlada.

Movimiento de tablero sugerido:

- Marcar TASK-479 como Done / Accepted, porque es trazabilidad documental de un trabajo ya realizado y evidenciado.

