# TASK-126 - Preparar decision de aprobaciones Azure para multiempresa

## Equipo

Product / Architect / Release

## Prioridad

P1

## Contexto

Infra / Azure completo TASK-120 y dejo preguntas concretas antes de crear recursos:

- Dominio/remitente de email.
- ACS Email.
- Entra External ID.
- Storage dedicado o reutilizado.
- Limite y tipos de logo.
- Aprobacion de costos.

No se deben crear recursos Azure sin aprobacion explicita del Product Owner.

## Objetivo

Preparar una decision clara para pedir aprobacion al Product Owner paso a paso.

## Alcance

- Procesar `tasks/TASK-120-HANDOFF.md` y `tasks/TASK-123-HANDOFF.md`.
- Proponer valores recomendados para:
  - remitente visible;
  - dominio Azure-managed vs dominio propio;
  - envio de acuse al solicitante;
  - storage dedicado vs reutilizado;
  - limite de logo;
  - tipos permitidos;
  - CTA principal;
  - canal de soporte temporal.
- Crear `tasks/TASK-126-HANDOFF.md` con la decision propuesta y preguntas finales al Product Owner.

## Fuera de alcance

- Crear recursos Azure.
- Configurar secretos.
- Implementar codigo.

## Entregable

Crear `tasks/TASK-126-HANDOFF.md`.

## Validacion esperada

El usuario debe poder responder aprobaciones concretas antes de enviar Infra / Azure a crear recursos.
