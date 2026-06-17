# TASK-227 - Mejorar panel Admin empresas

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner encontro fricciones en el panel `Admin empresas`:

- aparece mezclado con la app operativa;
- el panel de token sigue ocupando espacio despues de validar acceso;
- aprobar solo esta comodo desde detalle;
- el detalle ocupa la pagina completa;
- la confirmacion usa modal nativo del navegador.

## Objetivo

Mejorar la experiencia del panel interno de administracion de empresas sin cambiar su seguridad temporal.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-223-HANDOFF.md` y `tasks/TASK-225-HANDOFF.md`.
- Separar visualmente `Admin empresas` de la operacion normal.
- Despues de token valido:
  - colapsar el panel de acceso interno;
  - mantener una forma clara de limpiar/cambiar token.
- En cada card/resumen de solicitud pendiente:
  - mostrar boton de aprobar si aplica;
  - mantener ver detalle.
- Mostrar detalle como panel lateral derecho/drawer.
- Mantener accion de aprobar tambien dentro del detalle.
- Reemplazar `window.confirm` o confirmacion nativa por confirmacion dentro de la app.
- Mantener busqueda/filtros y no exponer token interno ni links de invitacion.

## Entregable

Crear o actualizar `tasks/TASK-227-HANDOFF.md` con:

- Cambios realizados.
- Estados de admin validados.
- Confirmacion in-app implementada.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA.
