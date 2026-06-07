# TASK-132 - Implementar invitaciones internas con token hash

## Equipo

Backend API

## Prioridad

P1

## Contexto

SQL ya tiene `CompanyInvitations`, ACS Email esta configurado, y Backend implemento solicitudes/aprobacion base. Aun no hay Entra External ID listo para aceptar invitaciones con login real.

## Objetivo

Implementar la base de invitaciones internas con token hash y envio de email, sin implementar todavia accept/login real.

## Alcance

- Implementar:
  - `POST /api/company-invitations`
  - `GET /api/company-invitations/validate?token=...`
  - `POST /api/company-invitations/{invitationId}/resend` si no requiere nueva migracion.
- Generar token raw solo para link de email.
- Guardar solo `token_hash`.
- No loggear token raw ni link completo.
- Usar ACS Email para enviar invitacion si esta configurado.
- Mantener endpoints internos protegidos por feature flag hasta tener auth/admin real.
- Tratar expiracion por `expires_at`.
- Agregar pruebas unitarias.

## Fuera de alcance

- `POST /api/company-invitations/accept`.
- Crear `CompanyUsers` desde JWT.
- Login Web.
- Entra External ID real.
- Auditoria de `company.invitation.resent` porque la migracion actual no incluye ese evento.

## Entregable

Crear `tasks/TASK-132-HANDOFF.md` con:

- Archivos modificados.
- Endpoints implementados.
- Pruebas ejecutadas.
- Limitaciones pendientes para accept/login.

## Validacion esperada

Debe quedar posible crear/validar invitaciones controladas sin activar acceso multiempresa completo.
