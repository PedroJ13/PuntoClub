# TASK-205 - Confirmar deploy API del panel interno de empresas

Equipo responsable: Backend API

## Contexto

TASK-201 completo en codigo local el endpoint interno faltante `GET /api/company-registration-requests`. QA TASK-204 no aprobo el panel publicado porque ese endpoint aun responde `404` en Azure Functions.

El panel interno usa proteccion temporal con `x-puntoclub-admin-token`. No introducir Entra External ID ni cambiar auth de empresa.

## Objetivo

Confirmar que la API publicada contiene los cambios de TASK-201 y que el endpoint de listado interno esta activo y protegido.

## Alcance

- Confirmar deploy publicado de los cambios de TASK-201.
- Validar en publicado:
  - `GET /api/company-registration-requests?status=pending&limit=25` sin token responde `403 FORBIDDEN`.
  - El mismo endpoint con token sintetico invalido responde `403 FORBIDDEN`.
- Confirmar que approve/reject/resend siguen protegidos y no exponen token raw/hash/link.
- No usar ni registrar el valor real de `x-puntoclub-admin-token`.
- No implementar funcionalidad nueva salvo fix minimo si el deploy revela un problema del endpoint.

## Entregable

Crear o actualizar `tasks/TASK-205-HANDOFF.md` con:

- Resultado.
- Commit/deploy validado si aplica.
- Checks publicados ejecutados.
- P0/P1/P2/P3 o bloqueos.
- Confirmacion de que no se expusieron secretos.
