# TASK-186 - QA cierra operacion autenticada publicada

Equipo responsable: QA

## Contexto

TASK-181 quedo no aprobado/bloqueado porque API/Web publicados no reflejaban TASK-179/TASK-180 y no habia sesion real disponible para QA.

Esta tarea debe ejecutarse despues de:

- TASK-183: API publicada con contexto por sesion confirmado.
- TASK-184: Web publicada con credentials en operaciones confirmado.
- TASK-185: PO Test aporta evidencia redaccionada de operacion autenticada.

## Objetivo

Cerrar validacion publicada de operacion con empresa autenticada, sin exponer secretos.

## Alcance

- Revisar handoffs TASK-183, TASK-184 y TASK-185.
- Validar checks seguros publicados sin secretos:
  - `/api/me` sin sesion -> `401`;
  - cookie sintetica invalida en endpoint operativo -> `401`;
  - path con `companyId` no piloto sin sesion -> `404`.
- Revisar que Web publicada envia `credentials: "include"` en operaciones privadas.
- Revisar evidencia PO Test de:
  - sesion con empresa/correo correcto;
  - cliente;
  - compra;
  - redencion si aplica;
  - reporte/auditoria;
  - logout.
- No pedir ni pegar password/cookie/token.

## Entregable

Crear o actualizar `tasks/TASK-186-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
