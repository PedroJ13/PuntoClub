# TASK-155 - Handoff Infra / Azure

## Resumen

Se roto/reemitio la invitacion `invitationId=1` usando el mecanismo existente de resend.

Resultado: completado.

Fecha/hora:

- `2026-06-08 12:15 -06:00`

## Accion realizada

Endpoint interno usado:

- `POST /api/company-invitations/1/resend`

Resultado final:

- `statusCode=200`
- `invitationId=1`
- `invitationStatus=pending`
- `email=pj13eros_business+task146-20260608092947@outlook.com`
- `expiresAt=2026-06-15T15:30:01Z`
- `resentAt=2026-06-08T18:14:26.834Z`
- `responseContainsTokenOrLink=false`

Interpretacion:

- El token expuesto en la captura deja de ser el token vigente.
- El nuevo link fue enviado por ACS al correo asociado de la invitacion.
- Si llega mas de un correo de invitacion, debe usarse el correo mas reciente posterior a `2026-06-08T18:14:26.834Z`.

## Mailbox destino

Mailbox usado:

- `pj13eros_business+task146-20260608092947@outlook.com`

Motivo:

- Se uso el mecanismo existente de resend/rotacion sobre la invitacion vigente.
- Ese mecanismo mantiene el correo asociado a la invitacion.
- No se creo invitacion nueva al mailbox base para evitar duplicar invitaciones y cambiar estado operativo sin confirmacion adicional.

## Validaciones

App Insights:

- `resendCompanyInvitation`
- `resultCode=200`
- `success=True`
- `duration=15191.3439 ms`
- timestamp observado: `2026-06-08T18:14:11.6451816Z`

Excepciones/trazas:

- No se observaron excepciones en App Insights en la ventana `2026-06-08T18:12:00Z` a `2026-06-08T18:18:00Z`.
- No se observaron warnings de email/invitacion en esa ventana.

ACS:

- Se consultaron metricas agregadas `ApiRequests` y `DeliveryStatusUpdate`.
- En la ventana inmediata del resend exitoso no hubo conteos positivos visibles todavia en las series consultadas.
- La confirmacion fuerte de esta tarea es el `200` del endpoint publicado y la ausencia de errores visibles en App Insights.

## Incidente durante la tarea

Primer intento de resend:

- Resultado local: `500 Internal Server Error`.
- App Insights registro `resendCompanyInvitation` con `resultCode=500` y duracion aproximada de `30022 ms`.
- No se observaron excepciones/trazas utiles asociadas.
- No se asumio exito de ese intento.

Segundo intento:

- Resultado local: `200`.
- Este segundo intento es el resultado considerado vigente.

## Seguridad

- `INTERNAL_ADMIN_TOKEN` se leyo desde Azure Functions solo en memoria.
- No se imprimio `INTERNAL_ADMIN_TOKEN`.
- No se pego link completo.
- No se pego token raw.
- No se pego token hash.
- No se imprimio URL completa de invitacion.
- No se guardo ningun secreto en repo, handoff, consola compartida ni commits.

## No se hizo

- No se cambio codigo.
- No se cambio pipeline.
- No se crearon recursos Azure nuevos.
- No se configuro Entra External ID.
- No se creo una invitacion nueva.
- No se cambio el mailbox de la invitacion.
- No se abrio firewall SQL.

## Pendientes

- Product Owner debe usar solo el correo mas reciente posterior a `2026-06-08T18:14:26.834Z`.
- Cualquier captura futura debe ocultar la barra de direccion completa y no mostrar token.
- QA puede validar con evidencia redaccionada, sin reproducir token ni link completo.
- El flujo `Crear acceso` / login / password productivo sigue bloqueado hasta Entra External ID.

## Riesgos

- P1: Si el nuevo link tambien se expone en captura o chat, debe rotarse nuevamente.
- P1: Si el correo mas reciente no llega al mailbox asociado, se requerira decision de Product/Release para crear una invitacion nueva a mailbox base confirmado.
- P2: ACS metricas agregadas pueden demorar o no mostrar detalle por destinatario; no se debe usar el handoff para inferir contenido del email.
