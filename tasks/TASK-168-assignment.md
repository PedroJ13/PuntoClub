# TASK-168 - Reintentar QA E2E auth propia con invitacion fresca

Equipo responsable: QA

## Dependencia

Esperar `tasks/TASK-167-HANDOFF.md` completado y link entregado por canal seguro fuera del repo/handoff.

## Objetivo

Cerrar validacion end-to-end publicada de auth propia MVP usando invitacion fresca/no comprometida:

1. Abrir invitacion valida.
2. Crear password/acceso con password temporal controlado.
3. Confirmar que link aceptado no permite crear otro usuario.
4. Probar login incorrecto.
5. Probar login correcto.
6. Confirmar que `/api/me` deriva empresa desde cookie/sesion.
7. Confirmar que panel empresa carga empresa correcta.
8. Probar logout.
9. Confirmar comportamiento de sesion invalida/expirada si es viable.
10. Validar cookie `HttpOnly`/`SameSite=Lax` entre Web/API publicados.

## Seguridad

- No pegar token de invitacion completo.
- No pegar link completo.
- No pegar password temporal en handoff.
- No pegar cookie ni token de sesion.
- No capturar barra de direccion con token visible.

## Entregable

Crear o actualizar `tasks/TASK-168-HANDOFF.md` con:

- Resultado: aprobado / no aprobado / bloqueado.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Confirmacion de seguridad sin secretos.
