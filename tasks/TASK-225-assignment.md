# TASK-225 - Ajustar API de registro de empresa, logo y correos

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

Despues de TASK-223 y TASK-224, Backend/API debe soportar el flujo refinado de empresa:

- solicitud publica con logo opcional;
- emails con mejor formato/texto;
- aprobacion que conserve o transfiera el logo a la empresa;
- sin exponer tokens, hashes ni secretos.

## Objetivo

Ajustar contratos/API y plantillas de email para soportar el flujo visual definido y el logo de empresa desde registro.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS.md`, `tasks/TASK-223-HANDOFF.md` y `tasks/TASK-224-HANDOFF.md`.
- Revisar endpoints actuales de:
  - solicitud publica de empresa;
  - aprobacion/rechazo/reenvio interno;
  - logo privado de empresa;
  - envio de correos.
- Implementar soporte backend para logo opcional en solicitud si TASK-224 lo habilita/recomienda.
- Al aprobar empresa, asegurar que el logo asociado quede disponible para la empresa aprobada.
- Mejorar asunto/cuerpo visual/texto de:
  - correo al solicitante confirmando recepcion;
  - correo interno al administrador;
  - correo de invitacion si corresponde tocarlo por consistencia.
- Mantener version texto segura para clientes de correo simples.
- No exponer link/token de invitacion en logs ni respuestas no autorizadas.

## Entregable

Crear o actualizar `tasks/TASK-225-HANDOFF.md` con:

- Cambios realizados.
- Endpoints/contratos afectados.
- Emails ajustados.
- Pruebas ejecutadas.
- Riesgos o pendientes para Web Dev/QA.
