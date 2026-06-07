# TASK-104 - Alinear y desplegar UI de auditoria operativa

## Equipo

Web Dev

## Contexto

TASK-100 preparo UI de auditoria en local, pero TASK-101 no aprobo porque la UI no estaba publicada y el endpoint `/audit/events` respondia `404`.

Backend/API debe completar TASK-103 con contrato final.

## Objetivo

Alinear la UI de auditoria con el contrato publicado y dejarla lista para deploy/revalidacion.

## Alcance

- Confirmar ruta final de Backend/API.
- Ajustar `getAuditEvents` si el contrato difiere de lo preparado en TASK-100.
- Confirmar que la UI no carga auditoria automaticamente al abrir.
- Confirmar:
  - estado inicial;
  - consulta con eventos;
  - estado vacio;
  - error de validacion/API;
  - desktop/mobile sin overflow.
- No hacer cambios visuales generales.

## No tocar

- No cambiar API.
- No cambiar SQL.
- No cambiar colores/branding general.
- No implementar auth.

## Dependencias

- TASK-103 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-104-HANDOFF.md
```

Incluye cambios, evidencia local/publicada si aplica, ruta final consumida y pruebas responsive.
