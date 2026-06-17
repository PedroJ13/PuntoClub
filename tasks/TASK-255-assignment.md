# TASK-255 - Cerrar QA de configuracion positiva de membresias

Equipo responsable: QA

## Contexto

TASK-253 aprobo la publicacion tecnica de membresias con negativos seguros, pero dejo P2 pendiente de prueba positiva con sesion real.

TASK-254 debe aportar evidencia PO redaccionada sin secretos.

## Objetivo

Cerrar QA de configuracion de membresias usando evidencia PO segura y checks publicados adicionales sin secretos.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-253-HANDOFF.md` y `tasks/TASK-254-HANDOFF.md`.
- Confirmar que la evidencia PO cubre:
  - menu `Membresias` visible para empresa habilitada;
  - `Admin empresas` no visible en menu normal;
  - crear/listar plan;
  - crear/listar beneficios;
  - al menos un beneficio tipo descuento;
  - al menos un beneficio controlable diario tipo cafe gratis.
- Confirmar que la evidencia no contiene:
  - passwords;
  - cookies;
  - tokens;
  - links tokenizados;
  - hashes;
  - SAS/blob paths internos.
- Repetir checks seguros sin sesion si hace falta:
  - endpoints de membresias sin sesion `401`;
  - `/api/me` sin sesion `401`.

## Entregable

Crear o actualizar `tasks/TASK-255-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Riesgos o pendientes.
