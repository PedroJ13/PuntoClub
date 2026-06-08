# TASK-177 - Reintentar E2E auth propia final

Equipo responsable: QA

## Dependencias

Esperar:

- `tasks/TASK-173-HANDOFF.md` completado.
- `tasks/TASK-174-HANDOFF.md` completado.
- `tasks/TASK-176-HANDOFF.md` completado.

## Objetivo

Cerrar E2E auth propia publicada con link fresco/no comprometido o con evidencia redaccionada del Product Owner:

1. Invitacion valida.
2. Crear acceso con password temporal controlado.
3. Link aceptado no reutilizable.
4. Login invalido controlado.
5. Login correcto crea sesion.
6. `/api/me` devuelve empresa desde cookie/sesion.
7. Panel empresa carga empresa correcta.
8. Logout limpia sesion.
9. Cookie/CORS cross-site funciona en navegador publicado.

## Seguridad

- No pegar token/link completo.
- No pegar password temporal.
- No pegar cookie ni token de sesion.
- No capturar barra de direccion con token visible.

## Entregable

Crear o actualizar `tasks/TASK-177-HANDOFF.md` con resultado aprobado/no aprobado/bloqueado, evidencia redaccionada y P0/P1/P2/P3.
