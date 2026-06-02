# TASK-016 - Inventariar Azure SQL existente y preparar conexion segura

## Estado

Asignada a Infra / Azure.

## Contexto

El usuario ya creo una Azure SQL Database para Punto Club:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

No se debe crear otra DB.

## Objetivo

Inventariar la base existente y preparar la conexion segura para que Backend/API pueda ejecutar `database/schema.sql` y `database/seed.sql` sin guardar secretos en el repo.

## Alcance

- Confirmar datos no secretos:
  - subscription
  - resource group
  - server name: `sqlserver-pj13-brazil`
  - database name: `sql-db-puntoclub`
  - region
  - tier
  - firewall/networking actual
- Definir forma segura de configurar `SQL_CONNECTION_STRING`.
- Definir si se usara usuario SQL de aplicacion o identidad administrada.
- Confirmar `PILOT_COMPANY_ID=1`.
- Entregar pasos para aplicar `database/schema.sql` y `database/seed.sql`.

## No tocar

- No crear otra Azure SQL Database.
- No guardar connection strings, passwords ni tokens.
- No cambiar codigo.
- No ejecutar cambios en production sin confirmacion explicita.

## Handoff esperado

Crear `tasks/TASK-016-HANDOFF.md`.
