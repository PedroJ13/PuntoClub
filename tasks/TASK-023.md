# TASK-023 - Crear usuario SQL runtime y configurar secreto de conexion

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-019 aplico `database/schema.sql` y `database/seed.sql` en `sqlserver-pj13-brazil/sql-db-puntoclub`. Backend/API sigue bloqueado porque no existe usuario SQL runtime ni `SQL_CONNECTION_STRING` configurado.

## Objetivo

Crear o configurar un usuario SQL de aplicacion con permisos minimos y dejar listo el secreto de conexion sin guardarlo en el repo.

## Alcance

- Acordar canal seguro con el usuario para generar/guardar password.
- Crear usuario runtime, sugerido: `puntoclub_app_user`.
- Otorgar permisos minimos:
  - `db_datareader`
  - `db_datawriter`
  - `EXECUTE` sobre `dbo.RegisterRedemption`
- Configurar `SQL_CONNECTION_STRING` en el ambiente que usara Backend/API:
  - variable local segura, o
  - `api/local.settings.json` ignorado por git, o
  - Azure Functions Application setting.
- Confirmar `PILOT_COMPANY_ID=1`.

## No tocar

- No guardar passwords, connection strings ni tokens en archivos versionados.
- No usar credenciales admin como runtime de la API.
- No crear otra DB.
- No cambiar codigo.

## Apoyo requerido

El usuario debe ayudar a definir o ingresar el password por canal seguro, o confirmar una ruta alternativa como identidad administrada.

## Handoff esperado

Crear `tasks/TASK-023-HANDOFF.md`.
