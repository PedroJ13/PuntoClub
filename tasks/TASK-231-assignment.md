# TASK-231 - Confirmar deploy Web de ajustes visuales empresa/admin/logo

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

TASK-229 no aprobo porque la Web publicada todavia no refleja TASK-226/TASK-227/TASK-228.

El bundle publicado no contiene:

- ruta/logica publica `/company-registration`;
- estado post-exito mejorado;
- logo opcional en registro;
- admin separado;
- token interno colapsado;
- drawer de detalle;
- modal de confirmacion in-app;
- identidad visual de empresa activa.

## Objetivo

Confirmar que los cambios Web de TASK-226/TASK-227/TASK-228 quedan publicados en Static Web Apps.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-226-HANDOFF.md`, `tasks/TASK-227-HANDOFF.md`, `tasks/TASK-228-HANDOFF.md`, `tasks/TASK-229-HANDOFF.md` y `tasks/TASK-230-HANDOFF.md`.
- Confirmar estado del repo/deploy Web.
- Publicar o disparar el deploy Web si los cambios no estan publicados y el flujo del proyecto lo permite.
- Validar en Web publicada:
  - `/company-registration` muestra registro publico directamente;
  - estado post-exito mejorado existe en bundle;
  - admin separado/token colapsado/drawer/modal in-app existen en bundle;
  - no queda `window.confirm` para aprobacion de empresa;
  - logo/fallback de empresa activa existe en bundle;
  - no se usa `localStorage` ni `sessionStorage` para tokens.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-231-HANDOFF.md` con:

- Resultado.
- Commit/deploy/Web version si aplica.
- Checks publicados ejecutados.
- Rutas/pantallas verificadas.
- Riesgos o pendientes para QA.
