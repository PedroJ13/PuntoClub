# TASK-249 - Validar configuracion de membresias publicada

Equipo responsable: QA

## Contexto

TASK-246 a TASK-248 agregan el primer bloque implementado de membresias:

- esquema SQL;
- API de configuracion de planes/beneficios;
- UI para configurar planes/beneficios.

No incluye activar membresia a cliente ni registrar usos.

## Objetivo

Validar que la configuracion de membresias funciona publicada sin romper la operacion actual.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-246-HANDOFF.md`, `tasks/TASK-247-HANDOFF.md` y `tasks/TASK-248-HANDOFF.md`.
- Validar publicado:
  - endpoints de planes y beneficios protegidos sin sesion;
  - listar/crear/editar plan con sesion/evidencia segura si esta disponible;
  - listar/crear/editar beneficios;
  - validaciones de payload;
  - menu `Membresias` aparece solo cuando la empresa tiene membresias habilitadas;
  - `Admin empresas` sigue fuera del menu normal;
  - `Puntos`/operacion actual sigue navegable.
- Si QA no tiene credenciales reales, ejecutar negativos seguros y revisar evidencia PO/Web/Backend sin secretos.

## Entregable

Crear o actualizar `tasks/TASK-249-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Regresion ejecutada.
- Riesgos o pendientes.
