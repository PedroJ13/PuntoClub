# TASK-898 - Handoff

Nombre del Equipo: Infra
Modo: Git / Staging branch setup
Fecha: 2026-07-09

## Estado

Completada.

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

## Restricciones respetadas

- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambio DNS.
- No se cambiaron flags productivos.
- No se enviaron correos reales.

## Uso Azure SQL

No se uso Azure SQL.

