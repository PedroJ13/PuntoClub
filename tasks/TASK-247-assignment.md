# TASK-247 - Implementar API de configuracion de planes y beneficios

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

TASK-245 definio contratos API de membresias. Para evitar un bloque demasiado grande, esta tarea implementa solo configuracion de planes y beneficios.

No incluye activar membresia a cliente ni registrar usos todavia.

Depende de TASK-246.

## Objetivo

Implementar endpoints backend para configurar planes de membresia y beneficios dentro de la empresa autenticada.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS.md`, `tasks/TASK-245-HANDOFF.md` y `tasks/TASK-246-HANDOFF.md`.
- Implementar endpoints:
  - `GET /api/membership-plans?status=active|inactive|all`;
  - `POST /api/membership-plans`;
  - `PATCH /api/membership-plans/{planId}`;
  - `POST /api/membership-plans/{planId}/activate`;
  - `POST /api/membership-plans/{planId}/deactivate`;
  - `GET /api/membership-plans/{planId}/benefits?status=active|inactive|all`;
  - `POST /api/membership-plans/{planId}/benefits`;
  - `PATCH /api/membership-benefits/{benefitId}`.
- Resolver empresa desde sesion, no desde `companyId` del cliente.
- Validar roles segun patron existente:
  - owner/admin para crear/editar planes y beneficios.
- Validar pertenencia por empresa para plan/beneficio.
- Serializar IDs bigint como string.
- Agregar auditoria best-effort para:
  - `membership.plan.created`;
  - `membership.plan.updated`;
  - `membership.benefit.created`;
  - `membership.benefit.updated`.
- Mantener tests existentes pasando y agregar tests enfocados.
- No exponer datos de otras empresas ni secretos.

## Entregable

Crear o actualizar `tasks/TASK-247-HANDOFF.md` con:

- Resultado.
- Endpoints implementados.
- Validaciones/errores.
- Tests ejecutados.
- Riesgos o pendientes para Web Dev/QA.
