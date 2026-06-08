# TASK-148 - Handoff Infra / Azure

## Resumen

Se revisaron señales de Azure/App Insights y se reenvio la invitacion real `invitationId=1` por ACS Email al mailbox controlado.

Estado: completado con reenvio.

Fecha/hora:

- `2026-06-08 09:54 -06:00`

## Invitacion

Datos no sensibles:

- `requestId`: `8`
- `companyId`: `2`
- `invitationId`: `1`
- `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
- `invitationStatus`: `pending`
- `invitationExpiresAt`: `2026-06-15T15:30:01Z`

## Revision ACS / Function App

Se revisaron recursos Azure disponibles:

- ACS Communication Service: `acs-puntoclub-prod-001`
- ACS Email Service: `email-puntoclub-prod-001`
- Function App: `func-puntoclub-prod-br-001`
- App Insights: `func-puntoclub-prod-br-001`

Limitacion encontrada:

- No hay evidencia de delivery final de mailbox disponible desde esta tarea.
- La CLI pidio instalar la extension `application-insights`; no se instalo porque la tarea no autorizaba instalar herramientas nuevas.
- Se uso REST de App Insights con token en memoria para consultar requests/excepciones/trazas sin imprimir secretos.

Resultado de logs:

- No se observaron excepciones relacionadas con el resend en la ventana revisada.
- No se observaron warnings `Company invitation email was not sent` en la ventana revisada.
- App Insights registro `resendCompanyInvitation` con `200`.

## Reenvio realizado

Se llamo el endpoint interno:

- `POST /api/company-invitations/1/resend`

Seguridad:

- `INTERNAL_ADMIN_TOKEN` se leyo desde Azure Functions solo en memoria.
- No se imprimio `INTERNAL_ADMIN_TOKEN`.
- No se imprimio link completo.
- No se imprimio token raw ni hash.
- La respuesta del endpoint no contenia token ni link.

Resultados:

- Primer intento:
  - El cliente local hizo timeout a los `60s`.
  - App Insights posteriormente lo registro como `resendCompanyInvitation` `200`.
- Segundo intento:
  - Respuesta local: `200`.
  - App Insights: `resendCompanyInvitation` `200`.
  - `resentAt`: `2026-06-08T15:53:46.99Z`
  - `responseContainsTokenOrLink=false`

Importante:

- El segundo resend rota el token y deja vigente el link del ultimo correo enviado.
- Si llega mas de un correo de invitacion, QA/Product Owner debe usar el correo mas reciente.

## Entrega del link

El link completo no se pego en este handoff ni en el chat.

Canal seguro usado:

- ACS Email reenvio la invitacion al mailbox controlado `pj13eros_business+task146-20260608092947@outlook.com`.

Accion para QA/Product Owner:

- Revisar el mailbox controlado.
- Usar el ultimo correo recibido con asunto de invitacion de Punto Club.
- Pasar el link completo a QA solo por canal seguro fuera del repo/handoff.

## Validaciones adicionales

App Insights ultimas 24h mostro:

- `approveCompanyRegistrationRequest` con `200`: `1`.
- `validateCompanyInvitation` con `200`: `3`.
- `resendCompanyInvitation` con `200`: `2` en la ventana posterior al reenvio.

No se ejecuto `accept` ni login/password; sigue fuera de alcance hasta Entra External ID.

## No se hizo

- No se genero nueva solicitud QA.
- No se creo nueva invitacion distinta.
- No se aprobo/rechazo otra solicitud.
- No se cambio codigo.
- No se cambio pipeline.
- No se configuro Entra External ID.
- No se pego link completo con token.
- No se pego `INTERNAL_ADMIN_TOKEN`.
- No se pegaron token raw, hash, screenshots ni payloads sensibles.

## Riesgos / notas

- P1: QA sigue dependiendo de recibir el link fuera del repo. El ultimo correo reenviado es el vigente.
- P1: Si se comparte el link por canal inseguro, debe revocarse/rotarse la invitacion.
- P2: No hay confirmacion de entrega final de mailbox desde Azure en esta tarea; solo confirmacion de resend API `200` y ausencia de errores visibles en App Insights.
- P2: El flujo de crear acceso/login real sigue bloqueado hasta Entra External ID.

## Siguiente paso recomendado

Ejecutar TASK-149 con el link del ultimo correo recibido en `pj13eros_business+task146-20260608092947@outlook.com`, entregado por canal seguro fuera del repo.
