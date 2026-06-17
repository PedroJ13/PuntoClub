# TASK-310 - Publicar frontend consolidado de UX/copy/iconos

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev / Release
Round: 47
Depende de: TASK-307, TASK-309
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Publicar en Azure Static Web Apps la version consolidada del frontend que contiene los cambios de UX/copy/iconos de TASK-304, TASK-305 y TASK-307.

## Contexto

QA no aprobo TASK-306 ni TASK-309 porque la Web publicada sigue mostrando textos legacy y no contiene `data-icon` en acciones principales.

TASK-307 indica que los assets locales quedaron corregidos, pero no se pudo confirmar ni completar la publicacion desde ese entorno.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-304-HANDOFF.md`
- `tasks/TASK-305-HANDOFF.md`
- `tasks/TASK-307-HANDOFF.md`
- `tasks/TASK-309-HANDOFF.md`

## Alcance

1. Confirmar que el estado local del frontend contiene los cambios finales:
   - labels `Password` / `Confirmar password` reemplazados;
   - CTA principal de login alineado;
   - `Confirmar compra`, `Confirmar canje`, `Confirmar uso` reemplazados;
   - `Mock local` / `API real` removidos u ocultos/alineados para experiencia publicada;
   - `data-icon` o solucion equivalente en acciones principales.
2. Confirmar que esos cambios estan versionados o listos para publicacion.
3. Publicar frontend usando el flujo existente del proyecto.
4. Validar assets publicados con cache buster contra:
   - `/index.html`;
   - `/src/app.js`;
   - `/src/customerApi.js`;
   - `/styles.css`.
5. Si el deploy falla por permisos, token, GitHub Actions o Azure, documentar el bloqueo exacto y que necesita el usuario.

## Criterios de aceptacion

- La URL publicada contiene los cambios finales de copy/iconos.
- No quedan textos legacy criticos detectados por TASK-309 en assets publicados.
- `data-icon` o equivalente esta presente en acciones principales publicadas.
- No se reintroduce `window.confirm`, `localStorage` ni `sessionStorage`.
- No se modifica API/SQL en esta tarea.

## Handoff esperado

Crear o actualizar `tasks/TASK-310-HANDOFF.md` con:

- Resultado: publicado, bloqueado o no aprobado localmente.
- Metodo de publicacion usado.
- Evidencia de assets publicados.
- Checks ejecutados.
- Si queda bloqueado, pasos concretos para desbloquear.
