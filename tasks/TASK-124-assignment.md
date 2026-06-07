# TASK-124 - Actualizar contratos finales multiempresa controlado

## Equipo

Backend API

## Prioridad

P1

## Contexto

TASK-122 reviso la migracion SQL contra los contratos API y detecto ajustes necesarios antes de implementar endpoints reales:

- `companyAddress` es requerido.
- El logo se maneja por Blob Storage privado, no URL externa editable.
- No habra password local.
- `external_subject` debe derivarse de JWT validado de Entra External ID.
- Falta contrato explicito para aprobar/rechazar solicitudes de empresa.

## Objetivo

Actualizar la documentacion de contratos API para multiempresa controlado, sin implementar codigo.

## Alcance

- Actualizar `docs/API_CONTRACTS.md` o crear una seccion clara si el documento ya existe.
- Incorporar contratos finales para:
  - `POST /api/company-registration-requests`
  - `POST /api/company-registration-requests/{requestId}/approve`
  - `POST /api/company-registration-requests/{requestId}/reject`
  - endpoints de invitacion y aceptacion sin password local
  - `/api/me`
  - `/api/my-company`
  - logo upload privado
- Reflejar:
  - `companyAddress` requerido;
  - email normalizado;
  - `external_subject` desde JWT;
  - logo por blob path/API, no URL externa editable;
  - eventos de auditoria permitidos por la migracion;
  - errores esperados por constraints SQL.
- No cambiar codigo.
- No aplicar SQL.
- No crear recursos Azure.

## Fuera de alcance

- Implementar endpoints.
- Implementar validadores.
- Cambiar frontend.
- Configurar auth/email/storage.

## Entregable

Crear `tasks/TASK-124-HANDOFF.md` con:

- Documentos actualizados.
- Resumen de cambios contractuales.
- Dudas o decisiones pendientes.

## Validacion esperada

El contrato final debe quedar listo para crear tareas de implementacion Backend/API pequeñas y verificables.
