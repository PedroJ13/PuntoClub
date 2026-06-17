# TASK-256 - Implementar API para activar membresia a cliente

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

Product / Architect / Release da por aprobada la configuracion positiva de membresias:

- TASK-253 quedo aprobada con observacion.
- Product Owner confirma que la revision funcional fue satisfactoria.
- No se asignan tareas a PO Test por ahora.

Siguiente bloque funcional: activar una membresia a un cliente.

Esta tarea no incluye registrar usos de beneficios todavia.

## Objetivo

Implementar endpoints para activar y consultar membresias de un cliente.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-245-HANDOFF.md`, `tasks/TASK-250-HANDOFF.md`, `tasks/TASK-251-HANDOFF.md` y `tasks/TASK-253-HANDOFF.md`.
- Implementar endpoints:
  - `POST /api/customers/{customerId}/memberships`;
  - `GET /api/customers/{customerId}/memberships?status=active|expired|cancelled|all`;
  - si ya es simple con el contrato existente, `GET /api/memberships/expiration-alerts?withinDays=5&status=active`.
- Resolver empresa desde sesion, no desde `companyId` del cliente.
- Validar:
  - cliente pertenece a empresa de sesion;
  - plan pertenece a empresa de sesion;
  - plan esta activo;
  - `startDate` valido;
  - `pricePaid >= 0`;
  - MVP rechaza si el cliente ya tiene membresia activa.
- Calcular `endDate` con `durationDays`.
- Calcular `expirationAlert` basico:
  - `none`;
  - `expires_today`;
  - `expiring_soon`;
  - `expired`.
- Auditar best-effort:
  - `customer.membership.activated`.
- Mantener tests existentes pasando y agregar tests enfocados.
- No implementar aun `membership-benefits` ni registro de usos.
- No enviar correos de vencimiento.
- No exponer datos de otras empresas ni secretos.

## Entregable

Crear o actualizar `tasks/TASK-256-HANDOFF.md` con:

- Resultado.
- Endpoints implementados.
- Validaciones/errores.
- Tests ejecutados.
- Riesgos o pendientes para Web Dev/QA.
