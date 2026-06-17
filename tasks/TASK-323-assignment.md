# TASK-323 - Ordenar cambios pendientes y hacer push para deploy automatico

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / Git
Round: 59
Depende de: TASK-322
Estado: Assigned
Prioridad: P1 release

## Objetivo

Ordenar los cambios pendientes del repo, commitear solo lo necesario y hacer `git push origin main` para disparar GitHub Actions sin depender de `gh`.

## Contexto

El repo tiene cambios pendientes y archivos no versionados de varias tareas. Antes de hacer push hay que separar cuidadosamente:

- cambios reales de API/Web/docs/tareas;
- scripts utiles;
- archivos temporales que no deben subir.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/WORKFLOW_CODEX.md`
- `tasks/TASK-322-HANDOFF.md`

## Alcance

1. Revisar `git status --short`.
2. Identificar archivos que deben entrar al commit:
   - cambios de workflow necesarios;
   - cambios API/Web ya aprobados;
   - tareas/handoffs recientes necesarios para trazabilidad;
   - scripts utiles si Product los aprobo.
3. Excluir archivos temporales y logs:
   - `.tmp/`;
   - `.tmp-task306/`;
   - `.tmp-task309/`;
   - `scripts/logs/*.log`;
   - cualquier secreto/local settings.
4. Ejecutar checks razonables segun archivos tocados:
   - `node --check app/src/app.js` si app cambio;
   - `node --check app/src/customerApi.js` si app cambio;
   - `node --check api/src/lib/notifier.js` si API cambio;
   - tests relevantes si aplica y el entorno lo permite.
5. Hacer commit con mensaje claro.
6. Hacer `git push origin main`.
7. Confirmar que el push disparo workflows esperados por path:
   - frontend si hubo cambios `app/**`;
   - API si hubo cambios `api/**` o workflow API.

## Criterios de aceptacion

- Commit/push completado en `main`.
- No se suben logs, temporales, secretos ni connection strings.
- Se documentan los commits creados.
- Se documentan workflows esperados/disparados.
- Si push falla, queda causa clara.

## Handoff esperado

Crear o actualizar `tasks/TASK-323-HANDOFF.md` con:

- Resultado.
- Commit SHA(s).
- Archivos incluidos/excluidos.
- Checks ejecutados.
- Estado de push.
- Workflows disparados o razon por la que no dispararon.
