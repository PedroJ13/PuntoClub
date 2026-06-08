# TASK-171 - Revalidar Crear acceso despues del diagnostico

Equipo responsable: QA

## Dependencias

Esperar:

- `tasks/TASK-169-HANDOFF.md`.
- `tasks/TASK-170-HANDOFF.md` si Web Dev tuvo que ajustar algo.
- Deploy publicado si hubo cambios.

## Objetivo

Revalidar el flujo publicado desde invitacion fresca/no comprometida:

1. Invitacion valida.
2. Crear acceso con password temporal controlado.
3. Login correcto.
4. `/api/me` con sesion.
5. Panel empresa correcto.
6. Logout.

## Seguridad

- No pegar token, link completo, password, cookie ni token de sesion.
- No capturar barra de direccion con token visible.

## Entregable

Crear o actualizar `tasks/TASK-171-HANDOFF.md` con resultado aprobado/no aprobado/bloqueado, evidencia redaccionada y P0/P1/P2/P3.
