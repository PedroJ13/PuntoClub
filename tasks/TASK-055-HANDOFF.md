Equipo:
Infra / Azure

Tarea completada:
Preparacion de workflow formal y seguro para deploy repetible de `api/` a Azure Functions usando GitHub Actions + Azure OIDC.

Opcion usada/recomendada:
- Usada: GitHub Actions + Azure OIDC/federated credentials + `azure/login`.
- Motivo: evita publish profiles, passwords y secrets de deploy de larga vida.
- No se uso publish profile.
- No se guardaron tokens, SAS, passwords ni connection strings en repo.

Identidad Azure creada:
- App registration / Service Principal: `punto-club-api-github-actions`
- Client ID:
  - `84308cf7-053b-46b1-beef-b8245e851271`
- Tenant ID:
  - `a50d6327-9af1-45f4-ab3e-4a931f70e318`
- Subscription ID:
  - `ea1a3068-3abc-425a-ad65-53be62bdf0c6`
- Service Principal object ID:
  - `8fdbf604-0ea5-4efd-a4d6-188e5844726c`

Federated credential configurada:
```text
name: github-main
issuer: https://token.actions.githubusercontent.com
subject: repo:PedroJ13/PuntoClub:ref:refs/heads/main
audience: api://AzureADTokenExchange
```

Permiso Azure asignado:
- Role: `Website Contributor`
- Scope:
  - `/subscriptions/ea1a3068-3abc-425a-ad65-53be62bdf0c6/resourceGroups/resource_group_main/providers/Microsoft.Web/sites/func-puntoclub-prod-br-001`
- Alcance limitado a la Function App, no a toda la suscripcion.

Archivo creado:
- `.github/workflows/azure-functions-api.yml`

Workflow preparado:
- Nombre: `Deploy Punto Club API`
- Triggers:
  - push a `main` con cambios en `api/**`
  - cambios en `.github/workflows/azure-functions-api.yml`
  - `workflow_dispatch`
- Permisos GitHub:
  - `id-token: write`
  - `contents: read`
- Pasos:
  - checkout
  - setup Node 22
  - `npm ci`
  - `npm test`
  - `azure/login@v2` con OIDC
  - `Azure/functions-action@v1`
  - smoke test contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Secrets/permisos requeridos:
- No requiere GitHub Secret para Azure si OIDC queda funcionando.
- El workflow contiene IDs no secretos:
  - client id
  - tenant id
  - subscription id
- Requiere que GitHub Actions este habilitado en `PedroJ13/PuntoClub`.
- Requiere que el workflow sea commiteado y pusheado a `main`.
- Requiere que Azure acepte el token OIDC emitido para `repo:PedroJ13/PuntoClub:ref:refs/heads/main`.

Verificacion ejecutada:
- Verificado que no existia workflow API previo.
- Verificado que no existia app registration previa `punto-club-api-github-actions`.
- Creada app registration/service principal.
- Creada federated credential.
- Asignado rol `Website Contributor` sobre la Function App.
- Confirmada federated credential con `az ad app federated-credential list`.
- Confirmado rol en scope exacto de la Function App con `az role assignment list`.
- Ejecutado `npm test` fuera de sandbox:

```text
tests: 9
pass: 9
fail: 0
```

Deploy/smoke:
- No se ejecuto deploy desde GitHub Actions todavia.
- Motivo: el workflow esta creado localmente, pero aun no fue commiteado/pusheado a `main`.
- No se rompio la API estable.

Archivos creados/cambiados:
- `.github/workflows/azure-functions-api.yml`
- `tasks/TASK-055-HANDOFF.md`

Riesgos o pendientes:
- Primer run puede fallar si `Azure/functions-action@v1` no puede desplegar con OIDC/RBAC en este tipo de Function App. Si eso ocurre, ajustar workflow a deploy por paquete/blob o usar publish profile como alternativa.
- `Website Contributor` esta acotado a la Function App, pero si el action necesita tocar Storage/paquete run-from-package podria requerir permiso adicional o una estrategia de deploy distinta.
- El workflow aun no renueva explicitamente `WEBSITE_RUN_FROM_PACKAGE` por blob privado; intenta deploy formal via Azure Functions action.
- La API actual sigue mitigada por TASK-054 con SAS hasta `2027-06-05T21:31Z`.

Accion exacta requerida del usuario:
1. Revisar y aprobar commit/push de:
   - `.github/workflows/azure-functions-api.yml`
   - `tasks/TASK-055-HANDOFF.md`
2. Commitear y pushear a `main`.
3. Observar el run `Deploy Punto Club API`.
4. Si el run pasa, la deuda de deploy repetible queda cerrada.
5. Si falla en deploy, entregar logs del run a Infra para ajustar permisos/estrategia.

Resultado:
Ruta OIDC preparada sin secretos de larga vida. Queda pendiente ejecutar el primer workflow desde GitHub para confirmar que `Azure/functions-action@v1` funciona con esta Function App y permisos RBAC.
