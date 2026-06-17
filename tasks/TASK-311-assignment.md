# TASK-311 - Confirmar o publicar Backend/API con copy de correos

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API / Release
Round: 47
Depende de: TASK-303, TASK-308, TASK-309
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Confirmar que Azure Functions tiene publicado el copy de correos actualizado en TASK-303 o publicar Backend/API si aun no esta sincronizado.

## Contexto

TASK-308 confirmo copy local en `api/src/lib/notifier.js`, pero no pudo validar runtime publicado por bloqueo de conexion desde el entorno.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-303-HANDOFF.md`
- `tasks/TASK-308-HANDOFF.md`
- `tasks/TASK-309-HANDOFF.md`

## Alcance

1. Confirmar si el cambio de `api/src/lib/notifier.js` esta publicado.
2. Si no esta publicado, ejecutar el flujo normal de deploy API del proyecto.
3. Validar sin exponer secretos:
   - plantillas actualizadas en codigo publicado o build desplegado;
   - no logs con token/link completo;
   - tests relevantes pasan o se documenta bloqueo.
4. No generar correos reales salvo que sea parte segura del flujo de validacion y no exponga tokens en handoff.

## Criterios de aceptacion

- Backend/API publicado contiene copy actualizado de correos.
- No se exponen tokens, secretos ni links reales con token.
- Si no se puede validar publicado, el bloqueo queda claro y accionable.

## Handoff esperado

Crear o actualizar `tasks/TASK-311-HANDOFF.md` con:

- Resultado.
- Evidencia de publicacion o bloqueo.
- Tests ejecutados.
- Riesgos o notas para QA.
