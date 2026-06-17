# TASK-258 - Validar activacion de membresia a cliente

Equipo responsable: QA

## Contexto

TASK-256 y TASK-257 agregan activacion de membresias a clientes.

El bloque anterior de configuracion de membresias se considera aprobado por decision de Product / Architect / Release.

No hay tarea PO Test para este bloque por ahora.

## Objetivo

Validar en publicado que una empresa puede activar una membresia a un cliente sin romper la operacion existente.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-253-HANDOFF.md`, `tasks/TASK-256-HANDOFF.md` y `tasks/TASK-257-HANDOFF.md`.
- Validar publicado:
  - endpoints nuevos sin sesion responden protegidos;
  - Web contiene flujo de `Activar membresia`;
  - si hay sesion/evidencia segura disponible, activar membresia a cliente con plan activo;
  - consultar membresias del cliente;
  - validar rechazo si cliente ya tiene membresia activa;
  - validar que no se registra uso de beneficios en este bloque;
  - validar que puntos/operacion actual sigue disponible.
- Si no hay credenciales reales, ejecutar negativos seguros y revisar evidencia de Backend/Web sin secretos.

## Entregable

Crear o actualizar `tasks/TASK-258-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Regresion ejecutada.
- Riesgos o pendientes.
