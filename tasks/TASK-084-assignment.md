# TASK-084 - Preparar runbook de calentamiento SQL para piloto

## Equipo

Infra / Azure

## Contexto

TASK-080 recomendo, para piloto pequeno/controlado, mantener el estado actual de Azure SQL serverless y operar con runbook de calentamiento antes de horarios de uso real.

Decision Product / Architect / Release:

- No cambiar firewall SQL ni SKU antes del piloto controlado sin una ventana separada.
- Mantener `AllowAllWindowsAzureIps` por ahora para no romper API.
- Mantener SQL serverless por ahora para controlar costo.
- Preparar runbook operativo para reducir sorpresa por `Paused`/`Resuming`.

## Objetivo

Crear un runbook corto y accionable de calentamiento/verificacion SQL/API antes de sesiones de piloto real.

## Alcance

- Definir pasos para ejecutar antes del uso real:
  - abrir frontend;
  - llamar endpoint liviano de API;
  - confirmar SQL online/responsive;
  - confirmar Application Insights/logs si falla.
- Incluir comandos o rutas Azure Portal utiles sin secretos.
- Incluir que hacer si SQL esta `Paused` o `Resuming`.
- Incluir criterio de exito:
  - frontend carga;
  - API responde;
  - una busqueda simple o settings responde;
  - no hay errores 500.
- Incluir criterio de escalamiento:
  - API 500 persistente;
  - SQL no pasa a Online;
  - CORS/error frontend.

## No tocar

- No cambiar firewall.
- No cambiar SKU/tier SQL.
- No cambiar app settings.
- No imprimir secretos.
- No crear recursos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-084-HANDOFF.md
```

Incluye:

- Runbook propuesto.
- Comandos/URLs no sensibles.
- Riesgos cubiertos.
- Riesgos no cubiertos.
- Recomendacion para Product / Architect / Release antes del piloto.
