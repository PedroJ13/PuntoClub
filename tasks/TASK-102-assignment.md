# TASK-102 - Aplicar migracion SQL de auditoria operativa

## Equipo

SQL DEV

## Contexto

TASK-097 diseno la tabla `dbo.OperationalAuditEvents` y TASK-099 agrego la migracion:

```text
database/migrations/20260606_operational_audit_events.sql
```

QA TASK-101 no aprobo porque la auditoria no es validable publicada. Antes de que Backend/API pueda persistir eventos reales, la tabla debe existir en Azure SQL.

Base de datos existente:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Aplicar la migracion SQL no destructiva de auditoria operativa en Azure SQL existente y validar que la tabla/indices/constraints quedaron creados.

## Alcance

- Revisar la migracion antes de aplicarla.
- Confirmar que no borra ni altera datos existentes.
- Aplicar `database/migrations/20260606_operational_audit_events.sql` en Azure SQL.
- Validar:
  - tabla `dbo.OperationalAuditEvents`;
  - PK;
  - FKs;
  - checks;
  - indices recomendados.
- No hacer backfill; la auditoria inicia desde la aplicacion de la migracion.

## No tocar

- No cambiar datos de clientes/compras/redenciones.
- No crear otra base de datos.
- No cambiar firewall permanente sin aprobacion.
- No imprimir secretos.

## Dependencias

- Si falta acceso SQL/firewall/credenciales, avisar al usuario y documentar bloqueo.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-102-HANDOFF.md
```

Incluye estado aplicada/no aplicada, evidencia de validacion, cualquier regla temporal usada y confirmacion de retiro si aplica.
