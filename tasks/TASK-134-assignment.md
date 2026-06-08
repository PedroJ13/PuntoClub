# TASK-134 - Proteger endpoints internos de empresa con autorizacion temporal

## Equipo

Backend API

## Prioridad

P1

## Contexto

TASK-129 implemento approve/reject detras de feature flag. TASK-132 implemento invitaciones internas tambien detras de feature flag. Entra External ID sigue pendiente segun TASK-130, por lo que aun no hay auth/admin real.

No se deben activar endpoints internos de aprobacion/invitacion con solo feature flag.

## Objetivo

Agregar una proteccion temporal para endpoints internos de revision/invitacion mientras Entra External ID queda listo.

## Alcance

- Proponer e implementar un mecanismo temporal simple, por ejemplo:
  - header `x-puntoclub-admin-token`;
  - app setting `INTERNAL_ADMIN_TOKEN`;
  - rechazo `403` si falta o no coincide.
- Aplicarlo a:
  - approve/reject de solicitudes de empresa;
  - crear/reenviar invitaciones internas.
- Mantener feature flags existentes.
- No imprimir token ni valores sensibles.
- Agregar pruebas unitarias:
  - sin flag -> `403`;
  - con flag sin token -> `403`;
  - con token incorrecto -> `403`;
  - con token correcto -> permite avanzar al handler.
- Documentar que es temporal hasta Entra/admin real.

## Fuera de alcance

- Entra External ID real.
- UI admin.
- Login.
- Accept invite.
- Crear secretos en Azure.

## Entregable

Crear `tasks/TASK-134-HANDOFF.md` con:

- Archivos modificados.
- Mecanismo implementado.
- App setting requerido por nombre, sin valor.
- Pruebas ejecutadas.
- Riesgos.

## Validacion esperada

Infra / Azure podra configurar el secreto temporal y QA podra validar endpoints internos sin abrirlos publicamente.
