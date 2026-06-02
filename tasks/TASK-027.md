# TASK-027 - Definir acceso estable para API contra Azure SQL

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-023 creo/configuro `puntoclub_app_user` y `api/local.settings.json` local ignorado por git. TASK-024 logro un smoke test real una vez tras crear una regla temporal de firewall. TASK-025 y TASK-026 fallaron despues con `500 INTERNAL_ERROR`, y Web Dev confirmo que Azure SQL bloquea la IP local actual.

## Objetivo

Definir una ruta repetible para que Backend/API y QA puedan conectarse a `sqlserver-pj13-brazil/sql-db-puntoclub` sin exponer secretos.

## Opciones aceptables

- Crear una regla temporal de firewall para la IP local de validacion y documentar como abrir/cerrar.
- Desplegar o preparar una Azure Function con app settings seguros para que la conexion venga desde Azure.
- Proponer una alternativa mas controlada si aplica.

## Alcance

- Confirmar IP de validacion si se usa firewall temporal.
- Definir duracion y limpieza de la regla.
- No imprimir ni guardar `SQL_CONNECTION_STRING`.
- Confirmar que `api/local.settings.json` y `local-secrets/` siguen ignorados.
- Entregar pasos concretos para TASK-028.

## No tocar

- No crear otra DB.
- No guardar secretos.
- No dejar reglas amplias adicionales sin documentar riesgo.
- No cambiar codigo.

## Apoyo requerido

Si la opcion elegida requiere aprobar una regla firewall o un despliegue Azure, pedir confirmacion explicita al usuario.

## Handoff esperado

Crear `tasks/TASK-027-HANDOFF.md`.
