# TASK-228 - Mostrar identidad visual de empresa en operacion

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner quiere que el logo de la empresa ayude a identificar visualmente con que empresa se esta operando.

El logo puede venir de `Mi empresa` o del registro inicial si las tareas previas lo habilitan.

## Objetivo

Mostrar la identidad visual de la empresa activa dentro de la experiencia operativa, sin afectar el flujo de clientes/compras/redenciones.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-223-HANDOFF.md`, `tasks/TASK-225-HANDOFF.md` y `tasks/TASK-226-HANDOFF.md`.
- Mostrar logo de empresa activa en un lugar visible definido por UX:
  - encabezado;
  - menu lateral;
  - o bloque de operacion.
- Si no hay logo, mostrar fallback limpio con nombre/iniciales de empresa.
- Confirmar que el logo no rompe responsive desktop/mobile.
- Confirmar que logout/login refresca identidad visual correctamente.
- No cargar logos de empresas ajenas.

## Entregable

Crear o actualizar `tasks/TASK-228-HANDOFF.md` con:

- Cambios realizados.
- Ubicacion del logo/fallback.
- Validaciones ejecutadas.
- Riesgos o pendientes para QA.
