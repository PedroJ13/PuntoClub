# TASK-119 - Decidir arquitectura de registro multiempresa e invitaciones

## Equipo

Product / Architect / Release

## Prioridad

P1

## Round

Round 3

## Depende de

`TASK-113`, `TASK-114`, `TASK-115`, `TASK-116`

## Contexto

Product Owner pidio avanzar hacia registro de empresa con invitacion por correo, creacion de password y panel propio. Esto reabre la decision de multiempresa que habia quedado diferida en TASK-111.

## Objetivo

Tomar decision de arquitectura y alcance antes de implementar registro multiempresa real.

## Alcance

- Procesar handoffs de UX, Infra, SQL y Backend/API.
- Decidir si se implementa:
  - Registro de empresa controlado.
  - Registro autoservicio parcial.
  - SaaS multiempresa mas completo.
- Decidir proveedor/estrategia de email.
- Decidir auth/password.
- Decidir storage/logo upload.
- Definir siguiente set de tareas de implementacion si corresponde.
- Actualizar `docs/DECISION_LOG.md`, `docs/MVP_RELEASE_STATUS.md` y `docs/TASK_BOARD.md`.

## Fuera de alcance

- Implementar codigo.
- Crear recursos Azure.
- Aplicar migraciones.

## Entregable

Crear `tasks/TASK-119-HANDOFF.md` con decision, impacto, riesgos aceptados y tareas siguientes.
