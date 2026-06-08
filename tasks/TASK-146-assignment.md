# TASK-146 - Ejecutar aprobacion controlada y generar invitacion real

Equipo responsable: Infra / Azure

## Contexto

TASK-140 conecto aprobacion de solicitud con creacion de invitacion owner.
TASK-145 aprobo que `/company-invitations/accept` ya renderiza la app publicada.
Para validar una invitacion real se requiere usar `x-puntoclub-admin-token` por canal seguro.

## Objetivo

Ejecutar una aprobacion controlada de solicitud QA para generar una invitacion real, sin exponer secretos, token admin, token de invitacion ni link completo en handoffs.

## Alcance

1. Confirmar que el API publicado contiene TASK-140.
2. Identificar una solicitud QA pendiente o crear una nueva solicitud QA controlada.
3. Usar `INTERNAL_ADMIN_TOKEN` de forma segura:
   - Si el token generado en TASK-137 no esta disponible por canal seguro, rotarlo en Azure Functions y documentar solo que fue rotado, nunca el valor.
4. Llamar `POST /api/company-registration-requests/{requestId}/approve` con header `x-puntoclub-admin-token`.
5. Confirmar que la respuesta incluye:
   - solicitud aprobada;
   - empresa creada;
   - invitacion no sensible (`id`, `companyId`, `email`, `role`, `status`, `expiresAt`).
6. Confirmar que la respuesta NO incluye:
   - token raw;
   - token hash;
   - link completo con token;
   - secretos.
7. Si se recibe correo real de invitacion en un mailbox controlado, entregar el link a QA por canal seguro fuera del repo. No pegarlo en handoff.

## Fuera de alcance

- No implementar ni validar login/password real.
- No pegar `INTERNAL_ADMIN_TOKEN`.
- No pegar links completos de invitacion.
- No crear apps Entra.

## Entrega

Actualizar `tasks/TASK-146-HANDOFF.md` con resultado, IDs no sensibles y cualquier bloqueo.
