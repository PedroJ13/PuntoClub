# TASK-315 - Reintentar deploy API despues de reactivar Azure SQL

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / Backend/API
Round: 51
Depende de: TASK-314
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Reintentar el workflow `Deploy Punto Club API` despues de que la base Azure SQL `sqlserver-pj13-brazil/sql-db-puntoclub` vuelva a estar disponible.

## Contexto

`TASK-314` confirmo que el fallo del smoke API no era bug de codigo: la base Azure SQL estaba pausada por cuota mensual gratuita de junio 2026.

El usuario indica que la DB probablemente ya se puede usar.

Workflow fallido previo:

- `Deploy Punto Club API`
- Run: `https://github.com/PedroJ13/PuntoClub/actions/runs/27649949163`
- Error previo: `GET /companies/1/settings expected 200, got 500`

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-313-HANDOFF.md`
- `tasks/TASK-314-HANDOFF.md`
- `.github/workflows/azure-functions-api.yml`
- `api/scripts/smoke-test.js`

## Alcance

1. Confirmar que la DB responde nuevamente sin exponer secretos:
   - validar `GET /companies/1/settings` contra API publicada; o
   - validar el smoke completo si el workflow lo permite.
2. Reintentar el workflow `Deploy Punto Club API` con `workflow_dispatch` o el metodo normal del proyecto.
3. Confirmar que el paso `Smoke test stable API` pase completo.
4. Si vuelve a fallar:
   - capturar endpoint exacto;
   - status code;
   - mensaje redaccionado;
   - clasificar si es SQL, API, config o transitorio.
5. No cambiar codigo salvo que aparezca un bug real nuevo y sea imprescindible; si pasa eso, documentar antes de corregir.

## Criterios de aceptacion

- Workflow `Deploy Punto Club API` termina en success.
- Smoke API publicado pasa completo.
- No se exponen connection strings, tokens ni secretos.
- Si falla, el bloqueo queda claro y accionable.

## Handoff esperado

Crear o actualizar `tasks/TASK-315-HANDOFF.md` con:

- Resultado: completado o bloqueado.
- Workflow run URL.
- Resultado de smoke API.
- Evidencia resumida de `GET /companies/1/settings`.
- Si falla, causa probable y siguiente paso.
