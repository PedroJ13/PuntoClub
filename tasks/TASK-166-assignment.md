# TASK-166 - Revalidar auth propia publicada end-to-end

Equipo responsable: QA

## Dependencias

Esperar:

- `tasks/TASK-163-HANDOFF.md` aplicado.
- `tasks/TASK-164-HANDOFF.md` aprobado o completado.
- `tasks/TASK-165-HANDOFF.md` aprobado o completado.

## Objetivo

Reintentar validacion publicada de auth propia MVP:

1. Invitacion valida.
2. Crear password/acceso.
3. Link aceptado no reutilizable.
4. Login incorrecto controlado.
5. Login correcto crea sesion.
6. `/api/me` deriva empresa desde cookie/sesion.
7. Panel empresa carga empresa correcta.
8. Logout limpia sesion.
9. Regresion rapida de Operaciones/Mi empresa/Reportes.
10. Validar si cookie `HttpOnly`/`SameSite=Lax` funciona entre Static Web Apps y Azure Functions.

## Seguridad

- No pegar token de invitacion completo.
- No pegar password real.
- No pegar cookie ni token de sesion.
- No capturar barra de direccion con token visible.

## Entregable

Crear o actualizar `tasks/TASK-166-HANDOFF.md` con:

- Resultado: aprobado / no aprobado / bloqueado.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Confirmacion de seguridad sin secretos.
