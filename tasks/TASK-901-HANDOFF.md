# TASK-901 - Handoff

Nombre del Equipo: Infra
Modo: GitHub Actions / Staging credentials
Fecha: 2026-07-09

## Estado

Completada.

Se corrigieron los bloqueos de credenciales detectados en TASK-898/TASK-899 y se valido que los workflows staging ya pueden ejecutar.

## Cambios aplicados

### Azure OIDC

Se creo federated credential en la app registration usada por GitHub Actions.

```txt
name: github-staging
issuer: https://token.actions.githubusercontent.com
subject: repo:PedroJ13/PuntoClub:ref:refs/heads/staging
audience: api://AzureADTokenExchange
```

Se confirmo que quedan existentes:

```txt
github-main    -> repo:PedroJ13/PuntoClub:ref:refs/heads/main
github-staging -> repo:PedroJ13/PuntoClub:ref:refs/heads/staging
```

### GitHub Secret

Se creo/actualizo el secret sin exponer su valor:

```txt
AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001
```

Origen del valor:

```txt
swa-puntoclub-stg-001 deployment token
```

### RBAC minimo staging

Despues de resolver OIDC, el workflow API staging fallo por falta de RBAC sobre la Function App staging.

Con aprobacion explicita posterior del Product Owner, se asigno:

```txt
Principal: GitHub Actions service principal 8fdbf604-0ea5-4efd-a4d6-188e5844726c
Role: Website Contributor
Scope: /subscriptions/ea1a3068-3abc-425a-ad65-53be62bdf0c6/resourceGroups/resource_group_main/providers/Microsoft.Web/sites/func-puntoclub-stg-br-001
```

No se asignaron permisos sobre produccion, SQL, DNS ni resource group completo.

### Ajuste de workflow API staging

Se agrego en:

```txt
.github/workflows/azure-functions-api-staging.yml
```

un paso previo al zip deploy para limpiar:

```txt
WEBSITE_RUN_FROM_PACKAGE
```

Motivo: el deploy staging fallaba con 409 indicando deployment en curso o `WEBSITE_RUN_FROM_PACKAGE` activo. El workflow productivo ya tenia el mismo patron de limpieza.

Commit publicado en `staging`:

```txt
ede821daf6a3760e651ca2b63b08f7fe67ccfba1
```

## Verificacion

Workflow Web staging:

```txt
Run: 29056716045
Workflow: Deploy Punto Club frontend staging
Branch: staging
Conclusion: success
URL: https://github.com/PedroJ13/PuntoClub/actions/runs/29056716045
```

Workflow API staging:

```txt
Run: 29057245298
Workflow: Deploy Punto Club API staging
Branch: staging
Conclusion: success
URL: https://github.com/PedroJ13/PuntoClub/actions/runs/29057245298
```

Pasos API staging confirmados en success:

```txt
Run tests
Azure login
Set staging safety settings
Clear run-from-package setting
Deploy Azure Functions staging
Smoke API staging without writes
```

## Restricciones respetadas

- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambio DNS.
- No se cambiaron flags productivos.
- No se enviaron correos reales.
- No se expusieron tokens, passwords ni deployment tokens.

## Uso Azure SQL

No se consulto ni modifico Azure SQL.

