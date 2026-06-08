# TASK-167 - Reemitir invitacion fresca para QA auth propia

Equipo responsable: Infra / Azure

## Contexto

TASK-166 confirmo que SQL, API y Web publicados ya estan listos para auth propia MVP, pero QA no pudo aprobar E2E porque la invitacion real disponible quedo comprometida al exponerse el token en una captura.

## Objetivo

Rotar/reemitir una invitacion fresca para QA sin exponer token, link completo ni secretos, de modo que QA pueda ejecutar el flujo real:

- invitacion valida;
- crear password/acceso;
- login;
- `/api/me`;
- logout.

## Alcance

- Usar mecanismo existente de resend/rotacion si aplica.
- Preferir no crear empresas/invitaciones duplicadas salvo que sea necesario y quede documentado.
- No pegar token raw.
- No pegar URL completa con token.
- No imprimir `INTERNAL_ADMIN_TOKEN`.
- No modificar codigo.
- No cambiar SQL.

## Entregable

Crear o actualizar `tasks/TASK-167-HANDOFF.md` con:

- Resultado.
- Invitacion/mailbox usado, sin link ni token.
- Confirmacion de que el token anterior expuesto quedo rotado o reemplazado.
- Evidencia segura de envio/reenvio.
- Pendientes o bloqueos.
