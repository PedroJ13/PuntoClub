# TASK-322 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / GitHub Actions
Round: 58
Estado: Completado

## Resultado

- Validado formalmente que el deploy de frontend y API **no depende** de GitHub CLI (`gh`) para el flujo normal.
- Confirmado el flujo esperado:
  1. `git add/commit`
  2. `git push origin main`
  3. GitHub Actions ejecuta workflow según rama y rutas.

## Checklist frontend

Workflow: `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`

- Trigger:
  - `push` a `main`
  - filtro por `paths`: `app/**` y `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
  - `workflow_dispatch`
- Acción de deploy:
  - `uses: Azure/static-web-apps-deploy@v1`
- Secret requerido:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`
- Configuración de rutas:
  - `app_location: app`
  - `api_location: ""`
  - `output_location: ""`

Conclusión: el pipeline frontend está listo para publish automático por push a `main`.

## Checklist API

Workflow: `.github/workflows/azure-functions-api.yml`

- Trigger:
  - `push` a `main`
  - filtro por `paths`: `api/**` y `.github/workflows/azure-functions-api.yml`
  - `workflow_dispatch`
- Autenticación:
  - `azure/login@v2` con OIDC
  - permisos `id-token: write`, `contents: read`
- Configuración de deploy:
  - `AZURE_FUNCTIONAPP_NAME`, `AZURE_RESOURCE_GROUP`, `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
  - `PILOT_COMPANY_ID: 6` vigente en `env` del workflow
- Smoke:
  - `npm run smoke` al final del workflow

Conclusión: API también publica sin requisito de `gh` local.

## Dependencia de `gh` (local)

- En ambos workflows de deploy no aparece invocación de `gh`.
- Hay scripts/automaciones puntuales con `gh` (no parte del flujo normal de CI/CD), útiles para inspección o relanzado manual.
## Faltantes/configuración no verificable desde código

- La existencia del secret SWA y secretos de Azure App Settings no se puede validar 100% desde archivos; requiere confirmación en GitHub UI/Portal.

## Flujo recomendado de deploy sin `gh`

1. `git status`
2. `git add` selectivo
3. `git commit -m "<mensaje claro>"`
4. `git push origin main`
5. Validar que GitHub Actions dispare:
   - Frontend si cambió `app/**` o workflow de SWA.
   - API si cambió `api/**` o workflow API.
