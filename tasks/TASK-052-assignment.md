# TASK-052 - Revisar riesgos operativos pre-piloto

## Equipo

Infra / Azure

## Contexto

El frontend publicado y la API estable ya permiten flujo cliente + compra, y redencion entra como siguiente paso. Antes de ampliar uso piloto, conviene revisar riesgos operativos ya identificados.

Recursos conocidos:

```text
Static Web App: swa-puntoclub-prod-001
Frontend: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Function App: func-puntoclub-prod-br-001
Azure SQL: sqlserver-pj13-brazil/sql-db-puntoclub
Repo: PedroJ13/PuntoClub
```

## Objetivo

Preparar una revision operativa corta para reducir riesgos antes de uso piloto real.

## Alcance

- Revisar estado del workflow de Static Web Apps.
- Confirmar que el GitHub Secret de deploy existe sin imprimir su valor.
- Revisar riesgo de `WEBSITE_RUN_FROM_PACKAGE` con SAS privado/expiracion en Azure Functions.
- Proponer ruta para deploy repetible de API sin exponer secretos.
- Revisar regla SQL `AllowAllWindowsAzureIps` y recomendar si debe mantenerse temporalmente o endurecerse.
- Confirmar CORS actual:
  - frontend publicado;
  - origenes locales necesarios;
  - sin wildcard.
- Revisar costo/plan basico de recursos actuales si esta disponible.

## No tocar

- No eliminar reglas de firewall sin confirmacion explicita.
- No rotar secretos sin confirmacion explicita.
- No crear recursos nuevos.
- No imprimir tokens, SAS, connection strings ni passwords.
- No cambiar el deploy productivo salvo que sea una verificacion no invasiva.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-052-HANDOFF.md
```

Incluye:

- Estado operativo actual.
- Riesgos P0/P1/P2/P3.
- Recomendacion concreta para API deploy repetible.
- Recomendacion concreta para firewall SQL.
- Confirmacion de CORS.
- Cualquier apoyo requerido del usuario.
