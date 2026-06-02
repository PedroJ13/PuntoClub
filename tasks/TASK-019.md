# TASK-019 - Aplicar schema y seed en Azure SQL existente

## Estado

Asignada a Infra / Azure.

## Contexto

La Azure SQL Database existente ya fue inventariada en TASK-016:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

Backend/API y QA siguen bloqueados hasta que `database/schema.sql` y `database/seed.sql` se ejecuten en esa DB y exista una forma segura de conectar la API.

## Objetivo

Aplicar schema y seed en la DB existente, sin crear otra DB y sin guardar secretos en el repo.

## Alcance

- Pedir confirmacion explicita antes de modificar la DB.
- Ejecutar `database/schema.sql`.
- Ejecutar `database/seed.sql`.
- Validar empresa piloto:

```sql
SELECT id, name, points_percentage, status
FROM dbo.Companies
WHERE id = 1;
```

- Crear o confirmar usuario SQL de aplicacion con permisos minimos:
  - `db_datareader`
  - `db_datawriter`
  - `EXECUTE` sobre `dbo.RegisterRedemption`
- Indicar como queda configurado `SQL_CONNECTION_STRING` sin revelar su valor.

## No tocar

- No crear otra Azure SQL Database.
- No guardar passwords, connection strings ni tokens.
- No usar credenciales admin como runtime de la API.
- No cambiar codigo.

## Handoff esperado

Crear `tasks/TASK-019-HANDOFF.md`.
