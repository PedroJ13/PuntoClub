# TASK-043 - Crear y publicar Static Web Apps de Punto Club

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-040 preparo el plan de Azure Static Web Apps, pero no creo el recurso porque requiere confirmacion explicita del usuario.

La API estable ya esta disponible:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

No crear otra base de datos. Usar la existente:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Crear/publicar una URL frontend estable para Punto Club y dejarla conectada a la API estable.

## Alcance

- Confirmar explicitamente con el usuario antes de crear el recurso cloud.
- Crear nueva Static Web App para Punto Club si el usuario confirma.
- Nombre recomendado: `swa-puntoclub-prod-001`.
- Resource group recomendado: `resource_group_main`.
- Region recomendada: `East US 2`.
- Plan recomendado: `Free`.
- Publicar `app/` como sitio estatico.
- Mantener `api_location` vacio; la API vive en Azure Functions separada.
- Confirmar URL/hostname real de Static Web Apps.
- Agregar hostname real a CORS de Azure Functions.
- Mantener temporalmente origenes locales de prueba si siguen siendo utiles.

## No tocar

- No crear otra Azure SQL Database.
- No guardar tokens, SAS, connection strings ni secretos en repo.
- No reutilizar la Static Web App `puntoevento`.
- No cambiar contratos API.
- No implementar nuevas pantallas.

## Handoff esperado

Crear `tasks/TASK-043-HANDOFF.md` con:

- Confirmacion recibida del usuario.
- Metodo usado: GitHub Actions o deploy manual inicial.
- URL frontend publicada.
- CORS agregado en Azure Functions.
- Evidencia de carga de UI.
- Pendientes o bloqueos si faltan permisos, token GitHub, deploy token o credenciales Azure.
