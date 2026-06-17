# TASK-243 - Definir UX funcional de membresias MVP

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Diseno/UX

## Contexto

Product / Architect / Release reviso `docs/NEXT_PHASE_MEMBERSHIPS.md` y decide iniciar Round 1 de membresias como segundo tipo de fidelizacion.

Decision de alcance:

- Prioridad: `P2 recomendable` antes de lanzarlo a produccion amplia, pero se prepara ahora como siguiente bloque funcional porque el caso del Product Owner es real/proximo.
- MVP de membresias: debe registrar usos de beneficios controlables, no solo informar beneficios.
- Aviso de vencimiento por correo: queda diferido. Para MVP inicial solo se define alerta/estado interno de vencimiento o proximidad de vencimiento.

No implementar UI todavia. Esta tarea es de definicion funcional UX.

## Objetivo

Definir el flujo y pantallas MVP de membresias para que SQL/Data y Backend/API puedan modelar contratos sin ambiguedad.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/NEXT_PHASE_MEMBERSHIPS.md` y documentos UX previos solo si hacen falta.
- Definir UX para:
  - tipos de fidelizacion habilitados por empresa: puntos, membresias o ambos;
  - menu/navegacion cuando membresias esta habilitado;
  - configuracion de planes de membresia;
  - configuracion de beneficios;
  - activacion de membresia a un cliente;
  - visualizacion de membresia activa/vencida al buscar cliente;
  - registro de uso de beneficio controlable;
  - alerta interna de vencimiento/proximo vencimiento.
- Definir vocabulario exacto:
  - membresia;
  - plan;
  - beneficio;
  - uso de beneficio;
  - activa/vencida/cancelada.
- Cubrir caso PO:
  - membresia mensual;
  - 15% descuento en pasteles;
  - 15% descuento en dulces;
  - 1 cafe americano gratis por dia.
- No disenar email automatico de vencimiento como parte del MVP; solo dejarlo como futura mejora.

## Entregable

Crear o actualizar `tasks/TASK-243-HANDOFF.md` con:

- Decisiones UX.
- Flujo MVP recomendado.
- Pantallas/secciones necesarias.
- Copy base.
- Estados vacios/carga/error.
- Reglas UX para beneficio ya usado, beneficio disponible y membresia vencida.
- Dependencias para SQL/Data y Backend/API.
- Riesgos o pendientes.
