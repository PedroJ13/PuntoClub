# TASK-178 - Reemitir invitacion auth propia a mailbox directo

Equipo responsable: Infra / Azure

## Contexto

Product Owner no ve el correo de acceso enviado previamente. El ultimo resend documentado uso el mailbox con alias:

- `pj13eros_business+task146-20260608092947@outlook.com`

Para destrabar la validacion E2E de auth propia MVP, se necesita una invitacion fresca enviada a un mailbox directo confirmado por Product Owner.

## Objetivo

Reemitir o crear una invitacion fresca para la empresa QA/controlada y enviarla a:

- `pj13eros_business@outlook.com`

La invitacion debe permitir validar:

- invitacion valida;
- crear acceso/password;
- login;
- `/api/me`;
- panel de empresa correcto;
- logout.

## Alcance

- Usar el mecanismo existente de resend/rotacion o creacion controlada de invitacion.
- Preferir no crear empresas duplicadas salvo que sea necesario y quede documentado.
- Si se crea una invitacion nueva, mantener empresa/control de QA claro en el handoff.
- Confirmar que el correo se envio al mailbox directo.
- No pegar token raw.
- No pegar URL completa con token.
- No imprimir `INTERNAL_ADMIN_TOKEN`.
- No imprimir cookies, passwords, hashes ni connection strings.
- No modificar codigo.
- No cambiar SQL salvo que sea estrictamente necesario para reemitir/crear la invitacion y quede documentado.

## Entregable

Crear o actualizar `tasks/TASK-178-HANDOFF.md` con:

- Resultado.
- Mailbox usado, sin link ni token.
- Si se reemitio o se creo invitacion nueva.
- Evidencia segura de envio/reenvio.
- Hora aproximada del envio en UTC.
- Si el Product Owner debe buscar un asunto/remitente especifico.
- Pendientes o bloqueos.
