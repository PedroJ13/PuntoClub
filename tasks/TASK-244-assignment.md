# TASK-244 - Proponer modelo SQL de membresias MVP

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

## Contexto

Product / Architect / Release decide iniciar Round 1 de membresias.

Decision de alcance:

- Prioridad: `P2 recomendable`, preparado ahora como siguiente bloque funcional.
- MVP de membresias: registra usos de beneficios controlables.
- Aviso de vencimiento por correo: diferido; solo se modela soporte para alerta interna o fecha de vencimiento.

No aplicar migracion todavia salvo que Product / Architect / Release lo pida despues. Esta tarea es de propuesta/modelo.

## Objetivo

Definir el modelo SQL minimo y extensible para membresias, beneficios, membresias activadas por cliente y usos de beneficios.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MODEL.md`, `docs/NEXT_PHASE_MEMBERSHIPS.md` y `tasks/TASK-243-HANDOFF.md`.
- Proponer tablas/campos/constraints/indices para:
  - `MembershipPlans`;
  - `MembershipBenefits`;
  - `CustomerMemberships`;
  - `MembershipBenefitUsages`.
- Considerar separacion por `company_id` en todas las tablas.
- Considerar integridad con `Customers`.
- Considerar estados:
  - plan activo/inactivo;
  - membresia activa/vencida/cancelada;
  - beneficio activo/inactivo.
- Considerar reglas:
  - beneficios informativos;
  - descuentos sin limite de uso;
  - beneficio gratis/allowance con limite por dia/semana/mes/termino.
- Definir como consultar uso diario para el caso `1 cafe americano gratis por dia`.
- Definir estrategia para fechas:
  - `start_date`;
  - `end_date`;
  - `usage_date`;
  - UTC vs fecha local operativa.
- Definir auditoria minima recomendada.
- No borrar ni modificar datos existentes.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-244-HANDOFF.md` con:

- Modelo propuesto.
- SQL/migracion propuesta sin aplicar.
- Indices recomendados.
- Reglas de integridad.
- Consultas clave de validacion de beneficio disponible/usado.
- Riesgos o pendientes para Backend/API.
