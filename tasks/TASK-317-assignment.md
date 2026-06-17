# TASK-317 - Relanzar workflow API y registrar resultado

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / GitHub Actions
Round: 53
Depende de: TASK-314, TASK-315, TASK-316
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Relanzar manualmente el workflow `Deploy Punto Club API` y dejar evidencia clara del resultado, incluso si vuelve a fallar.

## Contexto

- `TASK-314` confirmo que el smoke API fallaba porque Azure SQL estaba pausada por cuota mensual gratuita.
- El usuario indica que la DB ya deberia poder usarse.
- `TASK-315-HANDOFF.md` no existe, por lo que QA (`TASK-316`) quedo bloqueado sin evidencia de workflow API en success o failure reciente.
- Se requiere ejecutar el workflow de nuevo y registrar formalmente el resultado.

Workflow objetivo:

- Repo: `PedroJ13/PuntoClub`
- Workflow: `Deploy Punto Club API`
- Archivo: `.github/workflows/azure-functions-api.yml`
- Metodo: `workflow_dispatch` o rerun manual desde GitHub Actions.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-314-HANDOFF.md`
- `tasks/TASK-316-HANDOFF.md`
- `.github/workflows/azure-functions-api.yml`
- `api/scripts/smoke-test.js`

## Alcance

1. Relanzar manualmente el workflow `Deploy Punto Club API`.
2. Esperar a que termine el run.
3. Registrar:
   - URL del workflow run;
   - commit ejecutado;
   - estado final del workflow;
   - si fallo, paso exacto y error principal;
   - si paso, confirmacion de smoke test.
4. Si falla por `GET /companies/1/settings` u otro endpoint:
   - copiar status code y mensaje redaccionado;
   - clasificar si parece DB/SQL, API, deploy, config o transitorio.
5. Crear `tasks/TASK-317-HANDOFF.md` siempre, pase o falle.
6. Si el workflow queda en success, indicar que QA puede ejecutar `TASK-316` o una nueva revalidacion final.

## Criterios de aceptacion

- Existe `tasks/TASK-317-HANDOFF.md`.
- El handoff tiene URL del run y estado final.
- Si fallo, el bloqueo queda accionable.
- Si paso, se indica claramente que API deploy/smoke esta verde.
- No se cambian archivos de codigo en esta tarea salvo que sea absolutamente necesario y se documente.
- No se exponen secretos, tokens ni connection strings.

## Handoff esperado

Crear o actualizar `tasks/TASK-317-HANDOFF.md` con:

- Resultado: success, failure o bloqueado.
- Workflow run URL.
- Commit SHA ejecutado.
- Resultado de smoke API.
- Siguiente paso recomendado.
