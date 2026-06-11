# TASK-211 - Confirmar deploy Web del fix post-login

Equipo responsable: Web Dev

## Contexto

TASK-209 corrigio localmente la transicion despues de login exitoso agregando `showMainApp()`. TASK-210 no aprobo publicado porque el bundle Web aun no contenia ese fix.

## Objetivo

Confirmar que la Static Web App publicada ya contiene el fix de TASK-209 y que la UI puede salir de `/login` hacia el panel operativo cuando hay sesion activa.

## Alcance

- Confirmar deploy publicado del cambio de TASK-209.
- Validar que el bundle publicado contiene:
  - `showMainApp`;
  - llamada despues de login exitoso;
  - llamada cuando `/api/me` devuelve sesion activa en `/login`;
  - reemplazo de ruta `/login` por `/` al mostrar panel principal.
- Si es posible sin secretos, validar manualmente con sesion existente o mock local.
- No registrar passwords, cookies, tokens ni secretos.

## Entregable

Crear o actualizar `tasks/TASK-211-HANDOFF.md` con:

- Resultado.
- Commit/deploy validado.
- Checks publicados ejecutados.
- Pendientes para QA.
