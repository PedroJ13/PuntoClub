# TASK-125 - Preparar implementacion base Backend multiempresa sin providers reales

## Equipo

Backend API

## Prioridad

P1

## Contexto

TASK-122 propuso iniciar Backend/API por piezas que no requieren recursos Azure reales:

1. Validadores.
2. Formatters.
3. Mapeo de errores SQL.
4. Adapters/mock para email/auth/storage.

Esto prepara la implementacion sin enviar correos reales, sin validar Entra real y sin subir logos reales.

## Objetivo

Implementar base interna Backend/API para multiempresa controlado sin exponer flujo productivo ni depender de Azure resources reales.

## Alcance

- Implementar validadores/formatters si el codigo existente tiene patron claro para ello.
- Cubrir:
  - payload de registro con `companyAddress` requerido;
  - normalizacion de emails;
  - roles `owner`, `admin`, `staff`;
  - estados de solicitudes/invitaciones/usuarios;
  - formatter de solicitud, invitacion, usuario y `my-company`;
  - mapeo de errores SQL de unicidad;
  - validacion de logo por MIME/tamano en capa pura si existe sitio natural.
- Agregar pruebas unitarias enfocadas.
- No exponer endpoints reales si no existe contrato actualizado de TASK-124.
- No enviar correo real.
- No usar Entra real.
- No subir a Blob real.
- No aplicar migracion SQL.

## Fuera de alcance

- Endpoints productivos de registro/invitacion.
- ACS Email real.
- Entra External ID real.
- Blob Storage real.
- Cambios de frontend.

## Entregable

Crear `tasks/TASK-125-HANDOFF.md` con:

- Archivos modificados.
- Pruebas ejecutadas.
- Que quedo preparado.
- Que sigue bloqueado por Azure/SQL/contratos.

## Validacion esperada

Debe poder revisarse como base segura sin activar multiempresa productivo.
