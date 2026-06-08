# TASK-175 - Revalidar auth propia despues de CORS/cookie/deploy

Equipo responsable: QA

## Dependencias

Esperar:

- `tasks/TASK-172-HANDOFF.md`.
- `tasks/TASK-173-HANDOFF.md`.
- `tasks/TASK-174-HANDOFF.md`.
- Deploy publicado si hubo cambios Backend/Web.

## Objetivo

Revalidar end-to-end auth propia publicada:

1. Invitacion valida con link fresco/no comprometido.
2. Crear acceso con password temporal controlado.
3. Link aceptado no reutilizable.
4. Login invalido controlado.
5. Login correcto crea sesion.
6. `/api/me` devuelve empresa desde cookie/sesion.
7. Panel empresa carga empresa correcta.
8. Logout limpia sesion.
9. Validar comportamiento de cookie/CORS entre Web y API.

## Seguridad

- No pegar token/link completo.
- No pegar password temporal.
- No pegar cookie ni token de sesion.
- No capturar barra de direccion con token visible.

## Entregable

Crear o actualizar `tasks/TASK-175-HANDOFF.md` con resultado aprobado/no aprobado/bloqueado, evidencia redaccionada y P0/P1/P2/P3.
