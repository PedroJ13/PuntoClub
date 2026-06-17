# TASK-253 - Revalidar configuracion de membresias publicada

Equipo responsable: QA

## Contexto

TASK-249 no aprobo porque SQL/API/Web publicados aun no tenian membresias.

TASK-250, TASK-251 y TASK-252 deben aplicar migracion y publicar API/Web.

## Objetivo

Revalidar configuracion de membresias publicada.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-249-HANDOFF.md`, `tasks/TASK-250-HANDOFF.md`, `tasks/TASK-251-HANDOFF.md` y `tasks/TASK-252-HANDOFF.md`.
- Validar publicado:
  - endpoints de membresias ya no responden `404`;
  - endpoints protegidos sin sesion responden `401/403`;
  - Web publicada contiene seccion `Membresias`;
  - `Membresias` aparece solo si empresa tiene `loyaltyMembershipsEnabled = true`;
  - crear/listar/editar plan con sesion/evidencia segura si disponible;
  - crear/listar/editar beneficios si disponible;
  - `Admin empresas` sigue fuera del menu normal;
  - operacion de puntos no se rompe.
- Si QA no tiene credenciales reales, ejecutar negativos seguros y revisar evidencia PO/Backend/Web sin secretos.

## Entregable

Crear o actualizar `tasks/TASK-253-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Regresion ejecutada.
- Riesgos o pendientes.
