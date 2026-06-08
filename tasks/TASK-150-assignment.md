# TASK-150 - Diagnosticar entregabilidad ACS y coordinar mailbox confirmado

Equipo responsable: Infra / Azure

## Contexto

TASK-148 reenvio la invitacion real `invitationId=1` y App Insights registro `resendCompanyInvitation` con `200`.
TASK-149 no pudo aprobar porque QA no recibio el link real por canal seguro.

El problema actual no es la ruta publicada ni la API base; es confirmar recepcion del correo/link o preparar una alternativa operativa segura.

## Objetivo

Diagnosticar la entregabilidad de ACS Email y coordinar un mailbox confirmado por Product Owner para recibir una invitacion QA real, sin exponer tokens ni links en repo/handoff.

## Alcance

1. Revisar señales disponibles de ACS Email, Function App y App Insights sin instalar herramientas nuevas salvo aprobacion explicita.
2. Confirmar si hay evidencia de:
   - request aceptado;
   - errores de ACS;
   - warnings de email no enviado;
   - throttling o rechazo.
3. Coordinar con Product Owner un correo destino confirmado. Recomendacion:
   - usar un mailbox real directo que el Product Owner pueda revisar;
   - evitar alias `+tag` si hay duda de entrega.
4. Si Product Owner confirma correo destino:
   - reenviar invitacion existente si corresponde, o
   - crear solicitud/invitacion QA nueva si es mas limpio.
5. Entregar el link completo solo por canal seguro fuera del repo/handoff.
6. Documentar solo datos no sensibles.

## Fuera de alcance

- No pegar link completo con token.
- No pegar `INTERNAL_ADMIN_TOKEN`.
- No pegar token raw, token hash, capturas con token ni payloads sensibles.
- No instalar extensiones/herramientas nuevas sin aprobacion.
- No implementar login/password.
- No configurar Entra.

## Entrega

Actualizar `tasks/TASK-150-HANDOFF.md` con resultado, correo destino redaccionado si hace falta, estado de entrega y si el link fue entregado por canal seguro.
