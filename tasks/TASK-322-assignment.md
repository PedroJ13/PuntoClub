# TASK-322 - Revisar modelo de deploy sin GitHub CLI

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / GitHub Actions
Round: 58
Depende de: TASK-321
Estado: Assigned
Prioridad: P1 release

## Objetivo

Confirmar formalmente que Punto Club puede desplegar frontend y API sin depender de GitHub CLI local (`gh`), usando `git push` + GitHub Actions.

## Contexto

Product / Architect / Release reviso el documento externo:

- `C:\Users\pj13e\Digital Products\codex-git-workflow\AZURE_STATIC_WEB_APPS_DEPLOY_SIN_GH.md`

Conclusion preliminar:

- Static Web Apps ya tiene workflow GitHub Actions.
- API tambien tiene workflow GitHub Actions.
- `gh` no debe ser requisito para deploy normal; puede ser util solo para relanzar/ver runs manualmente.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/WORKFLOW_CODEX.md`
- `C:\Users\pj13e\Digital Products\codex-git-workflow\AZURE_STATIC_WEB_APPS_DEPLOY_SIN_GH.md`
- `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- `.github/workflows/azure-functions-api.yml`
- `tasks/TASK-321-HANDOFF.md`

## Alcance

1. Revisar workflow frontend:
   - trigger por `push` a `main` con `app/**`;
   - secret SWA esperado;
   - rutas `app_location`, `api_location`, `output_location`.
2. Revisar workflow API:
   - trigger por `push` a `main` con `api/**`;
   - OIDC/Azure login;
   - `PILOT_COMPANY_ID` vigente;
   - smoke test.
3. Confirmar si falta algun secret/config para deploy automatico.
4. No instalar `gh`.
5. No cambiar configuracion salvo que haya un error obvio y minimo; si se requiere cambio, documentar antes en handoff.
6. Definir el flujo recomendado de deploy normal:
   - `git status`;
   - `git add` selectivo;
   - `git commit`;
   - `git push origin main`;
   - revisar GitHub Actions desde web.

## Criterios de aceptacion

- Queda claro si el proyecto puede desplegar sin `gh`.
- Queda claro que falta, si falta algo.
- Queda documentado que `gh` no es requisito para SWA/API deploy normal.
- No se cambian secretos ni se exponen tokens.

## Handoff esperado

Crear o actualizar `tasks/TASK-322-HANDOFF.md` con:

- Resultado.
- Checklist de frontend.
- Checklist de API.
- Config faltante si aplica.
- Flujo recomendado para deploy sin `gh`.
