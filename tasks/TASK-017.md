# TASK-017 - Ejecutar API contra Azure SQL existente y entregar ambiente QA

## Estado

Asignada a Backend API.

## Contexto

Backend/API ya creo la base API en TASK-009. Falta probarla contra la Azure SQL existente `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Objetivo

Dejar un ambiente API verificable contra SQL real para que QA pueda ejecutar TASK-013.

## Alcance

- Instalar dependencias de `api/`.
- Configurar variables local/Azure de forma segura:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
- Aplicar o coordinar ejecucion de:
  - `database/schema.sql`
  - `database/seed.sql`
- Levantar API local o Azure.
- Entregar URL/comandos de prueba sin secretos.
- Confirmar endpoints de clientes, compras, saldo y redenciones contra SQL.

## No tocar

- No guardar secretos en archivos.
- No cambiar frontend.
- No crear otra DB.

## Dependencias

- TASK-016 debe entregar la forma segura de conexion o datos necesarios no secretos.

## Handoff esperado

Crear `tasks/TASK-017-HANDOFF.md`.
