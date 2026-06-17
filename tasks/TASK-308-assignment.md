# TASK-308 - Confirmar publicacion de copy de correos

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 45
Depende de: TASK-303, TASK-306
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Confirmar que el copy de correos server-side aplicado en `TASK-303` esta publicado en Azure Functions o publicar el cambio si aun no lo esta.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-303-HANDOFF.md`
- `tasks/TASK-306-HANDOFF.md`

## Alcance

1. Verificar si `api/src/lib/notifier.js` con copy actualizado esta desplegado.
2. Si no esta desplegado, publicar API siguiendo el flujo existente del proyecto.
3. Validar sin exponer tokens ni links reales:
   - plantillas cargan con tildes/copy nuevo;
   - notificacion interna no incluye token ni link completo;
   - no hay logs con secretos.
4. No enviar correos reales salvo que el flujo de validacion existente lo requiera y sea seguro.

## Criterios de aceptacion

- Backend/API publicado contiene copy actualizado de correos.
- No hay exposicion de tokens, secretos ni links reales con token.
- Tests relevantes pasan o se documenta por que no se pudieron ejecutar.
- QA puede validar con evidencia segura.

## Handoff esperado

Crear o actualizar `tasks/TASK-308-HANDOFF.md` con:

- Resultado.
- Evidencia de deploy/publicacion.
- Tests ejecutados.
- Riesgos o notas para QA.
