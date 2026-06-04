# TASK-045 - Completar GitHub Secret y deploy de Static Web Apps

## Equipo

Infra / Azure

## Contexto

TASK-043 creo la Static Web App `swa-puntoclub-prod-001`, configuro CORS en Azure Functions y preparo el workflow GitHub Actions.

La URL existe, pero todavia muestra la pagina default de Azure Static Web Apps:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

El flujo publicado esta bloqueado porque falta configurar el secret de GitHub y ejecutar el workflow que publica `app/`.

## Objetivo

Publicar la UI real de Punto Club en Static Web Apps usando GitHub Actions.

## Alcance

- Revisar el workflow preparado:
  - `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- Obtener el deployment token de `swa-puntoclub-prod-001` sin imprimirlo.
- Crear/actualizar el repository secret de GitHub:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`
- Asegurar que el workflow quede commiteado y subido a `main`.
- Ejecutar o esperar el workflow de deploy.
- Confirmar que la URL publica carga la UI real de Punto Club, no la pagina default.

## No tocar

- No guardar deployment token, SAS, connection strings ni secretos en archivos.
- No crear otra Static Web App.
- No crear otra Azure SQL Database.
- No cambiar contratos API.
- No implementar nuevas pantallas.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-045-HANDOFF.md
```

Incluye:

- URL publicada.
- Nombre del workflow/run si aplica.
- Confirmacion de que la UI real carga.
- Confirmacion de que `app-config.js` esta disponible.
- Si falla, indicar si falta permiso Azure, permiso GitHub, `gh`, token, secret o acceso al repo.
