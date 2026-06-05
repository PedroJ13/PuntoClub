# TASK-055 - Preparar workflow formal de deploy API

## Equipo

Infra / Azure

## Contexto

TASK-054 mitigo el riesgo inmediato de expiracion del paquete de API renovando `WEBSITE_RUN_FROM_PACKAGE`.

Estado actual:

```text
Function App: func-puntoclub-prod-br-001
API estable: https://func-puntoclub-prod-br-001.azurewebsites.net/api
SAS actual expira: 2027-06-05T21:31Z
```

La deuda pendiente es que el deploy de API aun no es repetible formalmente desde GitHub Actions.

## Objetivo

Preparar un workflow seguro y repetible para desplegar `api/` a Azure Functions desde GitHub.

## Alcance

- Recomendar e intentar configurar la ruta preferida:
  - GitHub Actions + Azure OIDC/federated credentials + `azure/login`.
- Si OIDC no se puede completar por permisos:
  - documentar exactamente el apoyo requerido;
  - dejar alternativa con publish profile/GitHub Secret si aplica.
- El workflow debe contemplar:
  - trigger por cambios en `api/**`;
  - `workflow_dispatch`;
  - instalar dependencias;
  - correr `npm test`;
  - empaquetar/publicar API sin `local.settings.json`, `local-secrets/`, logs ni secretos;
  - smoke test contra la API estable despues del deploy.
- No romper la API estable.

## No tocar

- No imprimir tokens, SAS, passwords, publish profiles ni connection strings.
- No guardar secretos en repo.
- No borrar paquete actual.
- No cambiar firewall SQL sin confirmacion explicita.
- No crear recursos nuevos sin confirmacion si implican costo o permisos amplios.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-055-HANDOFF.md
```

Incluye:

- Opcion usada o recomendada.
- Archivos creados/cambiados.
- Secrets/permisos requeridos.
- Si se ejecuto deploy, evidencia de `npm test` y smoke test.
- Si quedo bloqueado, accion exacta requerida del usuario.
