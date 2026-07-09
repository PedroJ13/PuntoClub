# TASK-898 - Handoff

Nombre del Equipo: Infra
Modo: Git / Staging branch setup
Fecha: 2026-07-09

## Estado

Completada en Git/workflows. Bloqueada para ejecucion exitosa de pipelines por configuracion externa pendiente.

Se creo la rama remota `staging` desde `origin/main` y se ajustaron los workflows staging para escuchar `push` a `staging` manteniendo `workflow_dispatch`.

## Cambios realizados

Rama remota:

```txt
staging creada desde origin/main
```

Workflows staging ajustados:

```txt
.github/workflows/azure-functions-api-staging.yml
.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml
```

Triggers staging:

```txt
push:
  branches:
    - staging
workflow_dispatch:
```

Con paths acotados:

```txt
API staging:
- api/**
- .github/workflows/azure-functions-api-staging.yml

Web staging:
- app/**
- .github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml
```

## Verificacion

Rama remota:

```txt
git ls-remote --heads origin staging
Resultado: staging existe
```

Commit publicado en staging:

```txt
f5dc7cbd999a9f80dcb14347cda40181ffb87aab
```

Formato YAML:

```txt
npx prettier --check .github/workflows/azure-functions-api-staging.yml .github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml
Resultado: All matched files use Prettier code style!
```

Confirmacion de triggers:

```txt
Workflows productivos:
- azure-functions-api.yml escucha push a main
- azure-static-web-apps-swa-puntoclub-prod-001.yml escucha push a main

Workflows staging:
- azure-functions-api-staging.yml escucha push a staging
- azure-static-web-apps-swa-puntoclub-stg-001.yml escucha push a staging
```

Runs disparados por push a `staging`:

```txt
Deploy Punto Club API staging
Run: 29055231141
Resultado: failure
Causa: Azure OIDC no tiene federated credential para subject repo:PedroJ13/PuntoClub:ref:refs/heads/staging.

Deploy Punto Club frontend staging
Run: 29055231074
Resultado: failure
Causa: GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001 no esta disponible para el workflow.
```

## Pendiente para destrabar ejecucion

Requiere aprobacion explicita del Product Owner/Infra para:

1. Crear una federated credential OIDC nueva en la app registration usada por GitHub Actions:

```txt
name: github-staging
issuer: https://token.actions.githubusercontent.com
subject: repo:PedroJ13/PuntoClub:ref:refs/heads/staging
audience: api://AzureADTokenExchange
```

2. Crear/confirmar el GitHub secret staging:

```txt
AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001
```

No se aplicaron estos dos cambios porque expanden configuracion persistente de confianza/secrets y requieren aprobacion explicita separada.

## Restricciones respetadas

- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambio DNS.
- No se cambiaron flags productivos.
- No se enviaron correos reales.

## Uso Azure SQL

No se uso Azure SQL.
