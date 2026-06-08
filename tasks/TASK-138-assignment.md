# TASK-138 - Validar UI publicada de solicitud de empresa y seguridad interna

Equipo responsable: QA

## Contexto

Web Dev completo TASK-136 con la UI de `Registrar empresa` dentro de `Mi empresa`.
Backend/API completo TASK-134 con proteccion temporal para endpoints internos.
Infra/Azure debe completar TASK-137 para activar app settings de autorizacion temporal.

## Objetivo

Validar en ambiente publicado que el registro de empresa funciona como solicitud controlada y que los endpoints internos no quedan abiertos.

## Alcance

1. Abrir frontend publicado:
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
2. Entrar a `Mi empresa`.
3. Validar que existe el formulario `Registrar empresa`.
4. Validar campos requeridos y mensajes de error sin enviar datos incompletos.
5. Crear una solicitud QA controlada con nombre/correo claramente identificables como QA.
6. Confirmar mensaje de `Solicitud recibida`.
7. Validar que el flujo operativo existente sigue funcionando:
   - buscar cliente
   - registrar compra
   - redimir puntos
   - reportes/auditoria si aplica smoke rapido
8. Validar seguridad interna sin token:
   - approve request debe responder 403
   - reject request debe responder 403
   - create invitation debe responder 403
   - resend invitation debe responder 403
9. Validar `GET /api/company-invitations/validate?token=valor-invalido` con token invalido.

## Reglas

- No usar token admin real salvo que Infra/Product lo entregue por canal seguro fuera del repo.
- No pegar secretos en handoff.
- Si el deploy publicado aun no tiene TASK-136/TASK-134, marcar no aprobado por deploy pendiente.
- Si se crean datos QA reales, identificarlos en el handoff.

## Entrega

Actualizar `tasks/TASK-138-HANDOFF.md` con resultado aprobado/no aprobado, hallazgos P0/P1/P2/P3 y datos QA creados.
