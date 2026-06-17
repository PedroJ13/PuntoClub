# TASK-313 - Subir cambios UX/copy/iconos al repo y disparar deploy

Equipo: Ejecucion Tecnica
Modo de ejecucion: Release / Git / Deploy
Round: 49
Depende de: TASK-310, TASK-311, TASK-312
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Cortar el ciclo de validacion donde local esta actualizado pero Azure sigue mostrando version vieja: subir al repo los cambios consolidados de UX/copy/iconos/correos y disparar los deploys correspondientes.

## Contexto

Product / Architect / Release reviso el repo local y detecto que hay cambios sin commit/push en `main`, incluyendo:

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `api/src/lib/notifier.js`
- tareas/handoffs recientes

El ultimo commit local observado fue:

- `713d7f5 Publish authenticated company panel fix`

QA (`TASK-306`, `TASK-309`, `TASK-312`) vio version publicada vieja o no pudo validar Azure, por lo que no conviene seguir creando tareas de QA hasta confirmar repo/deploy.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/WORKFLOW_CODEX.md`
- `tasks/TASK-307-HANDOFF.md`
- `tasks/TASK-309-HANDOFF.md`
- `tasks/TASK-310-HANDOFF.md`
- `tasks/TASK-311-HANDOFF.md`
- `tasks/TASK-312-HANDOFF.md`

## Alcance

1. Revisar `git status` y separar cambios relevantes de UX/copy/iconos/correos y tareas/handoffs.
2. No revertir cambios de otros equipos.
3. Excluir basura temporal si existe, por ejemplo:
   - `.tmp/`
   - `.tmp-task306/`
   - `.tmp-task309/`
   - cualquier archivo temporal local que no deba ir al repo.
4. Confirmar que los cambios necesarios estan listos:
   - copy UI final;
   - iconos/`data-icon` o solucion equivalente;
   - CSS de polish;
   - correos en `api/src/lib/notifier.js`;
   - assignments/handoffs recientes que deban quedar versionados.
5. Ejecutar checks razonables antes de subir:
   - `node --check app/src/app.js`
   - `node --check app/src/customerApi.js`
   - `node --check api/src/lib/notifier.js`
   - tests relevantes si son rapidos y el entorno lo permite.
6. Hacer commit con mensaje claro, por ejemplo:
   - `Polish UX copy and icons`
7. Hacer push a `main`.
8. Verificar que se disparan o ejecutar manualmente los workflows existentes:
   - frontend Static Web Apps;
   - API Azure Functions si el cambio de `api/src/lib/notifier.js` requiere deploy.
9. Confirmar resultado de workflows o documentar bloqueo exacto.

## Criterios de aceptacion

- Los cambios consolidados quedan en GitHub/main.
- El workflow de frontend se dispara o se ejecuta manualmente.
- El workflow de API se dispara o se ejecuta manualmente si aplica.
- No se suben secretos, tokens ni archivos temporales.
- No se incluyen carpetas `.tmp*`.
- El handoff indica commit SHA, push, workflows y estado final.

## Handoff esperado

Crear o actualizar `tasks/TASK-313-HANDOFF.md` con:

- Resultado: completado, parcialmente completado o bloqueado.
- Commit SHA creado.
- Archivos/categorias incluidos.
- Archivos temporales excluidos.
- Checks ejecutados.
- Estado de push.
- Estado de workflows frontend/API.
- Si algo fallo, pasos concretos para resolverlo.
