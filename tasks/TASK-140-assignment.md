# TASK-140 - Conectar aprobacion de solicitud con invitacion owner

Equipo responsable: Backend API

## Contexto

TASK-129 implemento aprobacion de solicitudes y crea empresa en `pending_activation`.
TASK-132 implemento invitaciones internas con token hash y email real por ACS.
TASK-134 agrego autorizacion temporal con `x-puntoclub-admin-token`.
TASK-137 activo los app settings internos en Azure Functions.
TASK-138 aprobo UI publicada de solicitud de empresa y seguridad interna sin token.

Entra External ID sigue bloqueado/manual, por lo que no se debe implementar accept/login/password real todavia.

## Objetivo

Al aprobar una solicitud de empresa, crear y enviar automaticamente una invitacion owner para el correo principal de la empresa, sin exponer token raw en la respuesta ni logs.

## Alcance

1. Extender `POST /api/company-registration-requests/{requestId}/approve`.
2. Mantener requisitos actuales:
   - `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
   - header `x-puntoclub-admin-token`
3. Cuando la aprobacion cree la empresa:
   - crear invitacion `owner` para `companyEmail` de la solicitud;
   - usar la misma politica de token hash de TASK-132;
   - enviar email por ACS usando el template/copy existente;
   - no devolver token raw ni hash en respuesta;
   - incluir en la respuesta datos no sensibles de la invitacion, por ejemplo `invitation.id`, `status`, `email`, `expiresAt`.
4. Si ya existe una invitacion pendiente para esa empresa/email, manejarlo de forma idempotente o con error controlado segun el patron actual.
5. Mantener transaccion/consistencia: evitar empresa aprobada sin rastro de intento de invitacion, o documentar claramente si el email es best-effort.
6. Agregar/actualizar pruebas unitarias.

## Fuera de alcance

- No implementar `POST /api/company-invitations/accept`.
- No crear `CompanyUsers`.
- No validar JWT de Entra.
- No cambiar UI.
- No exponer token en response, logs, handoff ni tests.

## Validacion esperada

- `npm test` desde `api/`.
- Prueba de aprobacion crea empresa e invitacion owner.
- Prueba confirma que sin token admin sigue respondiendo 403.
- Prueba confirma que la respuesta no incluye token raw ni hash.
- Carga de funciones sin errores.

## Entrega

Actualizar `tasks/TASK-140-HANDOFF.md`.
