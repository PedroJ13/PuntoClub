# TASK-137 - Configurar app settings de autorizacion temporal interna

Equipo responsable: Infra / Azure

## Contexto

Backend/API completo TASK-134 y agrego proteccion temporal para endpoints internos de empresa e invitaciones usando:

- Header: `x-puntoclub-admin-token`
- App setting: `INTERNAL_ADMIN_TOKEN`
- Feature flags:
  - `COMPANY_REGISTRATION_REVIEW_ENABLED`
  - `COMPANY_INVITATION_MANAGEMENT_ENABLED`

No imprimir ni guardar el token en el repo, handoff, capturas ni logs compartidos.

## Objetivo

Configurar en Azure Functions los app settings necesarios para que los endpoints internos queden protegidos por token y puedan probarse de forma controlada.

## Alcance

1. Confirmar que el deploy publicado ya contiene los cambios de TASK-134 antes de activar flags.
2. Configurar un valor fuerte para `INTERNAL_ADMIN_TOKEN` como app setting de `func-puntoclub-prod-br-001`.
3. Configurar:
   - `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
   - `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`
4. Verificar solo nombres de settings presentes o estado funcional, nunca valores secretos.
5. Confirmar que la app sigue respondiendo en endpoints publicos existentes.

## Fuera de alcance

- No crear Entra External ID en esta tarea.
- No guardar secretos en archivos.
- No exponer el token al frontend.
- No aprobar/rechazar empresas reales salvo prueba controlada y documentada.

## Validacion esperada

- Endpoints publicos siguen respondiendo.
- Endpoints internos sin header responden 403.
- Handoff documenta settings configurados por nombre, hora aproximada, validaciones y cualquier bloqueo.

## Entrega

Actualizar `tasks/TASK-137-HANDOFF.md`.
