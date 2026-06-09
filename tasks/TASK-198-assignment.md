# TASK-198 - Confirmar deploy Web de UI de logo

Equipo responsable: Web Dev

## Contexto

TASK-195 implemento UI local para logo privado en `Mi empresa`, pero TASK-196 no aprobo porque la Web publicada no contenia `/api/my-company/logo` ni el estado `Logo listo para subir`.

## Objetivo

Confirmar que la UI de logo privado esta publicada en Static Web Apps.

## Alcance

- Confirmar deploy Web posterior al commit que contiene TASK-195.
- Revisar bundle publicado para confirmar:
  - `/api/my-company/logo`;
  - `Logo listo para subir`;
  - upload con `FormData`/multipart;
  - `credentials: "include"` en upload.
- Smoke visual publicado:
  - `Mi empresa` desktop;
  - `Mi empresa` mobile;
  - sin overflow horizontal.
- No usar sesion real, password, cookie, token ni SAS.

## Entregable

Crear o actualizar `tasks/TASK-198-HANDOFF.md` con:

- Resultado.
- Commit/run o evidencia publicada validada.
- Evidencia redaccionada de bundle.
- Smoke visual.
- Pendientes o bloqueos.
