# TASK-150 - Handoff Infra / Azure

## Resumen

Se diagnostico la entregabilidad ACS de la invitacion QA real y se confirmo que ACS registro envio y delivery agregado exitoso en la ventana de reenvio de TASK-148.

Estado: bloqueado por coordinacion de mailbox/link seguro.

Fecha/hora:

- `2026-06-08 11:13 -06:00`

Re-ejecucion:

- `2026-06-08 11:39 -06:00`
- La asignacion `tasks/TASK-150-assignment.md` fue releida y no cambio.
- No se recibio un mailbox directo nuevo confirmado por Product Owner.
- No se hizo resend adicional ni se creo una invitacion nueva, para evitar rotar el link o generar invitaciones pendientes sin destino confirmado.

## Invitacion revisada

Datos no sensibles:

- `requestId`: `8`
- `companyId`: `2`
- `invitationId`: `1`
- `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
- `invitationStatus`: `pending`
- `invitationExpiresAt`: `2026-06-15T15:30:01Z`

## Diagnostico ACS

Recursos revisados:

- ACS Communication Service: `acs-puntoclub-prod-001`
- ACS Email Service: `email-puntoclub-prod-001`
- Function App: `func-puntoclub-prod-br-001`
- App Insights: `func-puntoclub-prod-br-001`

Diagnostic settings:

- `acs-puntoclub-prod-001`: no tiene diagnostic settings configurados.
- `email-puntoclub-prod-001`: el recurso `Microsoft.Communication/EmailServices` no soporta diagnostic settings via `az monitor diagnostic-settings`.

Metricas ACS disponibles:

- `ApiRequests`
- `DeliveryStatusUpdate`
- `UserEngagement`

Ventana revisada:

- `2026-06-08T15:45:00Z` a `2026-06-08T16:20:00Z`, alrededor del resend de TASK-148.

Resultados agregados:

- `ApiRequests`:
  - `SendMail`
  - `StatusCode=202`
  - `StatusCodeClass=2xx`
  - Conteos visibles en `2026-06-08T15:53:00Z` y `2026-06-08T15:54:00Z`.
- `DeliveryStatusUpdate`:
  - `MessageStatus=Delivered`
  - `Result=Success`
  - `IsHardBounce=False`
  - Conteos visibles en `2026-06-08T15:55:00Z` y `2026-06-08T15:56:00Z`.
- Dimension de bounce disponible:
  - `MessageStatus=Bounced`
  - `Result=Failure`
  - `SmtpStatusCode=501`
  - `EnhancedSmtpStatusCode=5.1.5`
  - En la ventana consultada no tuvo conteos positivos visibles para el resend.

Interpretacion:

- ACS acepto solicitudes de envio (`SendMail 202`).
- ACS registro delivery agregado exitoso (`Delivered/Success`) pocos minutos despues.
- No se observo rechazo/throttling/bounce positivo relacionado con el resend en la ventana consultada.
- Aun asi, la metrica no entrega el link ni prueba que QA tenga acceso al mailbox o al canal seguro.

## App Insights / Function App

Senales ya documentadas por TASK-148 y confirmadas en esta ronda:

- `resendCompanyInvitation` tuvo respuestas `200`.
- No se observaron excepciones visibles relacionadas con resend/email.
- No se observaron warnings `Company invitation email was not sent`.

Limitaciones:

- La CLI intento solicitar extension `application-insights`; no se instalo ninguna herramienta nueva.
- Se uso REST de App Insights con token en memoria cuando hizo falta.
- No se imprimieron payloads, tokens ni links.

## Coordinacion de mailbox

No se recibio en este turno una confirmacion explicita de Product Owner para un mailbox directo nuevo.

Recomendacion operativa:

- Usar un mailbox real directo que Product Owner pueda revisar en vivo.
- Evitar alias `+tag` hasta confirmar que el proveedor/mailbox lo muestra de forma confiable.
- Correo candidato si Product Owner lo confirma por canal seguro:
  - `pj13eros_business@outlook.com`

No se envio una nueva invitacion ni se hizo resend adicional porque el alcance pide correo destino confirmado antes de generar o reenviar una invitacion QA usable.

## Link seguro

No se pego link completo en este handoff ni en el chat.

Estado:

- No confirmado como entregado a QA.
- QA sigue bloqueado hasta recibir el link completo por canal seguro fuera del repo/handoff.

Importante:

- Si Product Owner logra abrir el ultimo correo enviado a `pj13eros_business+task146-20260608092947@outlook.com`, debe usar el correo mas reciente, porque TASK-148 hizo dos resend y el ultimo link es el vigente.
- Si no aparece ese correo, usar mailbox directo confirmado y crear una invitacion QA nueva o reenviar una invitacion nueva a ese correo.

## No se hizo

- No se instalo ninguna extension/herramienta nueva.
- No se creo nueva solicitud QA.
- No se creo nueva invitacion.
- No se reenvio nuevamente `invitationId=1`.
- No se cambio codigo.
- No se cambio pipeline.
- No se configuro Entra External ID.
- No se pego link completo con token.
- No se pego `INTERNAL_ADMIN_TOKEN`.
- No se pegaron token raw, token hash, screenshots ni payloads sensibles.

## Riesgos / notas

- P1: El bloqueo actual no parece ser ACS/API; ACS muestra delivery agregado exitoso. El bloqueo es acceso/canal seguro del link para QA.
- P1: Crear una invitacion a un correo no confirmado puede repetir el bloqueo y dejar mas invitaciones pendientes.
- P1: Si el link se comparte por canal inseguro, debe rotarse/revocarse.
- P2: Sin logs detallados por destinatario habilitados, el diagnostico se basa en metricas agregadas de ACS y App Insights.
- P2: El flujo de crear acceso/login real sigue bloqueado hasta Entra External ID.

## Siguiente accion requerida

Product Owner debe confirmar un mailbox directo y revisable para QA.

Despues de esa confirmacion, Infra puede:

1. Crear una invitacion QA nueva para `companyId=2` y el mailbox confirmado, o generar una nueva solicitud/invitacion si Product / Release prefiere flujo completo.
2. Entregar el link completo solo por canal seguro fuera del repo/handoff.
3. Actualizar un nuevo handoff con datos no sensibles para desbloquear TASK-151.
