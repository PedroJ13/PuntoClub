# TASK-163 - Aplicar migracion SQL de auth propia en Azure SQL

Equipo responsable: SQL DEV

## Contexto

TASK-159 preparo `database/migrations/20260608_company_local_auth_sessions.sql` para soportar auth propia MVP con password hash y sesiones server-side. TASK-162 no aprobo porque la migracion no esta aplicada en Azure SQL.

## Objetivo

Aplicar la migracion en Azure SQL real `sqlserver-pj13-brazil/sql-db-puntoclub` con prevalidaciones y validacion posterior.

## Alcance

- Leer `tasks/TASK-159-HANDOFF.md`.
- Ejecutar prevalidaciones sugeridas.
- Aplicar `database/migrations/20260608_company_local_auth_sessions.sql` si no hay bloqueos.
- Validar que `CompanyUsers` soporte `local_password` y que `CompanySessions` exista.
- Si requiere firewall temporal, coordinar con Infra / Azure o dejar bloqueo claro.

## Seguridad

- No imprimir passwords, tokens, connection strings ni secretos.
- No insertar credenciales reales.
- No dejar reglas temporales de firewall abiertas sin documentarlo.

## Entregable

Crear o actualizar `tasks/TASK-163-HANDOFF.md` con:

- Resultado.
- Prevalidaciones ejecutadas.
- Migracion aplicada o bloqueo.
- Validacion posterior.
- Riesgos o pendientes.
