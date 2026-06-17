# TASK-314 - Diagnosticar fallo smoke API en settings publicado

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 50
Depende de: TASK-313
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Resolver o diagnosticar con precision el fallo del workflow `Deploy Punto Club API` en el smoke test publicado.

## Contexto

Despues de subir los cambios de UX/copy/iconos/correos al repo, el workflow de frontend quedo OK, pero el workflow de API fallo en el paso `Smoke test stable API`.

Error reportado por GitHub Actions:

```text
Run npm run smoke

> punto-club-api@0.1.0 smoke
> node scripts/smoke-test.js

GET /companies/1/settings expected 200, got 500: {"error":{"code":"INTERNAL_ERROR","message":"Unexpected API error."}}
Error: Process completed with exit code 1.
```

Workflow fallido:

- `Deploy Punto Club API`
- Run: `https://github.com/PedroJ13/PuntoClub/actions/runs/27649949163`

Smoke test afectado:

- `api/scripts/smoke-test.js`
- Primer endpoint: `GET /companies/1/settings`
- `PILOT_COMPANY_ID` default: `1`
- `API_BASE_URL`: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-313-HANDOFF.md`
- `.github/workflows/azure-functions-api.yml`
- `api/scripts/smoke-test.js`
- codigo del endpoint de settings y repositorio relacionado.

## Alcance

1. Revisar logs del workflow y, si es posible, logs de Azure Functions/App Insights para el 500 de `/companies/1/settings`.
2. Determinar causa probable:
   - cambio de codigo;
   - deploy incompleto;
   - app setting faltante;
   - SQL connection/runtime;
   - empresa piloto `companyId=1` ausente/inactiva;
   - error de consulta/formateo;
   - transitorio de cold start/conectividad.
3. Validar localmente si aplica con `func start` desde `api/` o tests unitarios.
4. Si la causa es codigo, corregir de forma acotada.
5. Si la causa es configuracion/infra/SQL, no inventar workaround: documentar bloqueo exacto y que requiere Infra/usuario.
6. Reintentar workflow o indicar paso exacto para reintentar cuando este resuelto.

## Criterios de aceptacion

- Se identifica causa del 500 en `/companies/1/settings`.
- Si es codigo, queda corregido y testeado.
- Si es ambiente/configuracion, queda una nota accionable clara.
- No se relaja el smoke test sin justificarlo.
- No se oculta el fallo con reintentos artificiales si hay bug real.
- No se exponen connection strings, tokens ni secretos en handoff.

## Handoff esperado

Crear o actualizar `tasks/TASK-314-HANDOFF.md` con:

- Resultado: corregido, bloqueado o transitorio confirmado.
- Causa raiz o hipotesis mas probable con evidencia.
- Archivos tocados, si aplica.
- Tests/checks ejecutados.
- Estado de workflow/reintento.
- Si requiere Infra/SQL/usuario, indicar exactamente que pedir.
