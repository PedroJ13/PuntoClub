# TASK-129 - Implementar endpoints base de solicitudes de empresa

## Equipo

Backend API

## Prioridad

P1

## Contexto

TASK-124 actualizo contratos finales y TASK-125 preparo validadores/formatters/errores internos. El siguiente paso Backend/API es implementar la primera pieza funcional: solicitudes de empresa y aprobacion/rechazo, sin activar todavia invitaciones reales ni login multiempresa completo.

## Objetivo

Implementar endpoints base para solicitud de empresa y revision interna, usando el contrato final.

## Alcance

- Implementar, si la arquitectura actual lo permite:
  - `POST /api/company-registration-requests`
  - `POST /api/company-registration-requests/{requestId}/approve`
  - `POST /api/company-registration-requests/{requestId}/reject`
- Usar validadores ya preparados.
- Usar SQL real si TASK-128 ya aplico migracion; si no, dejar implementacion con tests unitarios/repository mock y documentar bloqueo de integracion.
- Para esta tarea:
  - no enviar email real si TASK-127 no dejo ACS listo;
  - usar notifier noop/mock controlado;
  - no crear invitaciones reales.
- Auditar eventos si la tabla/constraint lo permite:
  - `company.registration.submitted`
  - `company.registration.approved`
  - `company.registration.rejected`
- Mantener endpoints operativos existentes intactos.
- Agregar pruebas unitarias.

## Fuera de alcance

- Invitaciones.
- Accept invite.
- Entra External ID real.
- Logo upload.
- Frontend.
- Aplicar migracion SQL.

## Entregable

Crear `tasks/TASK-129-HANDOFF.md` con:

- Archivos modificados.
- Endpoints implementados o parte bloqueada.
- Pruebas ejecutadas.
- Dependencias pendientes para integracion real.

## Validacion esperada

Debe existir una base Backend verificable para crear solicitudes de empresa sin activar aun el flujo completo de acceso multiempresa.
