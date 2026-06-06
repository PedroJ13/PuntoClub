# TASK-074 - Checklist operativo Azure pre-piloto

## Equipo

Infra / Azure

## Contexto

El flujo principal ya esta publicado y aprobado por QA. Antes de uso real piloto se necesita confirmar que la operacion minima en Azure esta entendible y repetible.

Recursos conocidos:

```text
Frontend: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Static Web App: swa-puntoclub-prod-001
API: https://func-puntoclub-prod-br-001.azurewebsites.net/api
Azure SQL: sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Preparar checklist operativo pre-piloto para saber como monitorear, diagnosticar y recuperar los servicios basicos sin tocar secretos.

## Alcance

- Confirmar estado de recursos:
  - Static Web Apps;
  - Function App;
  - Azure SQL Database.
- Confirmar que los deploys repetibles existen:
  - frontend por GitHub Actions;
  - API por GitHub Actions.
- Confirmar donde revisar logs:
  - Static Web Apps deploy logs;
  - GitHub Actions frontend;
  - GitHub Actions API;
  - Function App logs/Log stream o Application Insights si existe.
- Confirmar si Application Insights esta habilitado para Function App.
- Confirmar estado basico de CORS:
  - frontend publicado permitido;
  - origenes locales necesarios para dev si aplican.
- Confirmar riesgo de secretos:
  - no imprimir valores;
  - solo listar nombres/configuracion no sensible si hace falta.
- Preparar runbook corto para:
  - deploy frontend fallido;
  - deploy API fallido;
  - API 500;
  - UI no carga;
  - SQL no responde/firewall.

## No tocar

- No crear recursos nuevos sin pedir aprobacion.
- No cambiar firewall sin pedir aprobacion.
- No rotar secretos sin pedir aprobacion.
- No imprimir connection strings, tokens ni deployment tokens.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-074-HANDOFF.md
```

Incluye:

- Estado de cada recurso.
- Links o rutas donde revisar logs.
- Si Application Insights existe o falta.
- Riesgos operativos P0/P1/P2.
- Runbook corto recomendado.
- Cualquier accion que requiera apoyo del usuario.
