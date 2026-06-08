# TASK-151 - Reintentar validacion de invitacion real con link confirmado

Equipo responsable: QA

## Contexto

TASK-149 quedo bloqueada por falta de link real.
TASK-150 debe coordinar un mailbox confirmado y entregar el link completo por canal seguro fuera del repo.

## Objetivo

Validar la invitacion real publicada usando un link confirmado, sin exponer tokens.

## Dependencias

- Esperar TASK-150.
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
7. Smoke breve de `/`.

## Reglas

- No pegar link completo con token en handoff.
- No pegar capturas que muestren token.
- No pedir ni usar `INTERNAL_ADMIN_TOKEN`.
- No validar login/password real.

## Entrega

Actualizar `tasks/TASK-151-HANDOFF.md` con aprobado/no aprobado y hallazgos P0/P1/P2/P3.
