# TASK-149 - Reintentar validacion de invitacion real con link seguro

Equipo responsable: QA

## Contexto

TASK-147 quedo bloqueada porque no se recibio el link real.
TASK-148 debe confirmar entrega o reenviar la invitacion y entregar el link completo por canal seguro fuera del repo.

## Objetivo

Validar una invitacion real publicada usando el link seguro recibido, sin exponer tokens.

## Dependencias

- Esperar TASK-148.
- Recibir link real por canal seguro fuera del repo.

## Alcance

1. Abrir el link real de invitacion.
2. Confirmar que carga `Punto Club`, no 404.
3. Confirmar estado valido de invitacion.
4. Confirmar datos no sensibles:
   - empresa;
   - correo;
   - rol;
   - vencimiento.
5. Confirmar que el token completo no aparece en texto visible.
6. Confirmar que `Crear acceso` sigue deshabilitado o bloqueado claramente por Entra/login fuera de alcance.
7. Smoke breve de `/` o documentar si se omite.

## Reglas

- No pegar link completo con token en handoff.
- No pegar capturas que muestren token.
- No pedir ni usar `INTERNAL_ADMIN_TOKEN`.
- No validar login/password real.

## Entrega

Actualizar `tasks/TASK-149-HANDOFF.md` con aprobado/no aprobado y hallazgos P0/P1/P2/P3.
