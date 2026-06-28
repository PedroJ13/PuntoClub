# TASK-479 - Trazabilidad de paquete minimo Azure SQL backup/restore

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra Azure / SQL DEV
Estado: Completed retroactively
Prioridad: P1 trazabilidad operativa
Depende de: Decision Product Owner de aplicar solo paquete minimo sin costo esperado relevante

## Objetivo

Documentar como tarea del proyecto el paquete minimo ya aplicado para proteccion de Azure SQL, backups, alertas y locks, de forma que el cambio quede trazable en `tasks/` con handoff asociado.

## Contexto

El trabajo ya fue ejecutado antes de crear esta tarea para atender una necesidad operativa de proteccion minima de la Azure SQL Database productiva.

El detalle completo quedo documentado en:

- `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`

Ese documento declara diagnostico inicial, cambios aplicados, cambios no aplicados por costo o decision, estado actual, riesgos pendientes, siguiente recomendado, uso cloud/SQL y confirmacion de que no se tocaron datos de negocio ni se expusieron secretos.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/AZURE_SQL_COST_GUARDRAILS.md`
- `docs/AZURE_SQL_BACKUP_RESTORE_MIN_PACKAGE_2026-06-25.md`

## Alcance

1. Registrar la tarea retroactiva para trazabilidad.
2. Confirmar en handoff que el paquete aplicado incluye:
   - PITR / short-term retention subido a 14 dias.
   - Action group minimo `ag-puntoclub-sql-min`.
   - Locks `CanNotDelete` en SQL Server y Azure SQL Database.
   - Alertas minimas de Activity Log para delete/write/firewall/locks/resource health.
3. Confirmar en handoff que no se aplico:
   - LTR.
   - Backup redundancy geo-redundante.
   - Restore temporal.
   - SQL Auditing / diagnostic settings con costo recurrente.
   - BACPAC/export.
4. Registrar riesgos pendientes P1/P2/P3 y siguiente recomendado.

## Fuera de alcance

- No ejecutar nuevos cambios en Azure.
- No despertar Azure SQL para nuevas consultas.
- No crear restore temporal.
- No activar LTR.
- No cambiar backup redundancy.
- No tocar datos de negocio.
- No exponer secretos.
- No publicar Web/API.

## Criterios de aceptacion

- Existe `tasks/TASK-479-assignment.md`.
- Existe `tasks/TASK-479-HANDOFF.md`.
- El handoff referencia el documento de evidencia.
- El handoff declara uso cloud/SQL, decisiones no aplicadas, riesgos y siguiente recomendado.
- Queda claro que la tarea es retroactiva y no implica nuevos cambios tecnicos.

## Uso de cloud / SQL / servicios externos

Permitido solo como referencia documental del trabajo ya aplicado.

No se autoriza uso adicional de Azure, SQL, restores, diagnostics, LTR, export o cambios de datos como parte de esta tarea de trazabilidad.

## Handoff esperado

Crear o actualizar `tasks/TASK-479-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

