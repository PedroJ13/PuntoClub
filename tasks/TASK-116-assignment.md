# TASK-116 - Definir contratos API para registro e invitacion de empresas

## Equipo

Backend API

## Prioridad

P1

## Round

Round 2

## Depende de

`TASK-113`, `TASK-114`, `TASK-115`

## Contexto

Esta tarea queda bloqueada hasta tener:

- Flujo UX de navegacion/registro/invitacion.
- Decision/recomendacion de email, auth y logo upload.
- Modelo SQL propuesto para empresas/invitaciones/usuarios.

## Objetivo

Definir contratos API para registro de empresa, invitacion, creacion de password/acceso y carga/configuracion de empresa, sin implementar codigo.

## Alcance

- Proponer endpoints, request/response y errores para:
  - Registrar empresa.
  - Enviar invite a empresa.
  - Notificar a Product Owner.
  - Validar invite.
  - Crear password o vincular identidad externa.
  - Consultar/actualizar Mi empresa.
  - Preparar logo upload segun decision Infra.
- Definir reglas de seguridad server-side:
  - Fuente confiable de `companyId`.
  - Aislamiento de empresas.
  - Tokens/expiracion.
  - Rate limit o mitigaciones basicas.
- Definir eventos de auditoria.
- Indicar compatibilidad con empresa piloto actual.

## Fuera de alcance

- Implementar endpoints.
- Aplicar SQL.
- Configurar proveedores.

## Entregable

Crear `tasks/TASK-116-HANDOFF.md` con contratos propuestos y decisiones pendientes.
