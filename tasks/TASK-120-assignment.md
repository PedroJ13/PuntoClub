# TASK-120 - Preparar habilitacion Azure para email, auth y logos

## Equipo

Infra / Azure

## Prioridad

P1

## Round

Round 4

## Depende de

`TASK-119`

## Contexto

Product / Architect / Release decidio avanzar a multiempresa controlado. La arquitectura objetivo aprobada es:

- Azure Communication Services Email para invitaciones y notificacion interna.
- Microsoft Entra External ID para acceso/password.
- Azure Blob Storage privado para logos.

No se deben crear recursos ni guardar secretos sin aprobacion explicita del Product Owner.

## Objetivo

Preparar la habilitacion Infra/Azure para email, auth y logo upload, dejando claros pasos, recursos, decisiones, costos y secretos necesarios.

## Alcance

- Definir recursos Azure requeridos:
  - ACS Email.
  - Entra External ID / app registrations / redirect URIs.
  - Blob Storage privado para logos.
- Indicar si conviene storage dedicado o contenedor privado en storage existente.
- Definir app settings necesarios para Function App y Static Web Apps.
- Definir URLs/redirects esperados para ambiente publicado.
- Definir pasos de configuracion en Azure Portal o Azure CLI.
- Identificar decisiones que requieren al usuario:
  - dominio de email administrado vs dominio propio;
  - crear recursos nuevos;
  - nombre de remitente;
  - storage dedicado vs reutilizado;
  - aprobacion de costos.
- No imprimir secretos.
- No crear ni modificar recursos sin aprobacion explicita.

## Fuera de alcance

- Implementar backend.
- Implementar frontend.
- Aplicar SQL.
- Crear recursos sin aprobacion.

## Entregable

Crear `tasks/TASK-120-HANDOFF.md` con:

- Recomendacion final de recursos.
- Lista de app settings/secrets por ambiente.
- Pasos para ejecutar una vez aprobado.
- Riesgos/costos.
- Preguntas concretas para el Product Owner si son necesarias.

## Validacion esperada

El handoff debe permitir pedir aprobacion al usuario con pasos claros, uno por uno, antes de tocar Azure.
