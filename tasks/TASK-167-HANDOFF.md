# TASK-167 - Handoff Infra / Azure

## Resumen

Se reemitio una invitacion fresca para QA usando el mecanismo existente de resend/rotacion.

Resultado: completado.

Fecha/hora:

- `2026-06-08 16:13 -06:00`

## Accion realizada

Endpoint interno usado:

- `POST /api/company-invitations/1/resend`

Impacto:

- Se roto/reemplazo el link vigente de la invitacion `invitationId=1`.
- El token previamente expuesto en captura queda reemplazado por el ultimo resend exitoso.
- No se crearon empresas nuevas.
- No se crearon invitaciones duplicadas.
- No se cambio codigo, SQL, pipeline ni configuracion cloud.

## Invitacion/mailbox usado

Datos no sensibles:

- `invitationId`: `1`
- `invitationStatus`: `pending`
- `email`: `pj13eros_business+task146-20260608092947@outlook.com`
- `expiresAt`: `2026-06-15T15:30:01Z`
- `resentAt`: `2026-06-08T22:13:46.829Z`
- `responseContainsTokenOrLink`: `false`

Nota:

- El endpoint publicado no devolvio token raw ni link completo.
- Si existen varios correos de invitacion en el mailbox, QA/Product Owner debe usar solo el correo mas reciente posterior a `2026-06-08T22:13:46.829Z`.

## Evidencia segura

API publicada:

- `POST /api/company-invitations/1/resend`
- Resultado local: `200`
- Respuesta sanitizada:
  - `status=pending`
  - `email=pj13eros_business+task146-20260608092947@outlook.com`
  - `expiresAt=2026-06-15T15:30:01Z`
  - `resentAt=2026-06-08T22:13:46.829Z`
  - `responseContainsTokenOrLink=false`

App Insights:

- Function: `resendCompanyInvitation`
- Timestamp observado: `2026-06-08T22:13:27.4623245Z`
- `resultCode=200`
- `success=True`
- `duration=19378.657 ms`

App Insights trazas/excepciones:

- Ventana revisada: `2026-06-08T22:10:00Z` a `2026-06-08T22:18:00Z`.
- No se observaron excepciones.
- La unica traza clasificada fue inicializacion/mapeo de rutas de Azure Functions, no un error de resend/email.

ACS Email metricas agregadas:

- Recurso: `acs-puntoclub-prod-001`
- Ventana revisada: `2026-06-08T22:12:00Z` a `2026-06-08T22:30:00Z`.
- `ApiRequests` con `Operation=SendMail` y `StatusCodeClass=2xx`:
  - Conteo `2` en `2026-06-08T22:14:00Z`.
- `DeliveryStatusUpdate` con `Result=Success`:
  - Conteo `2` en `2026-06-08T22:16:00Z`.
- `DeliveryStatusUpdate` con `MessageStatus=Bounced`:
  - Conteo `0` en la ventana revisada.

Interpretacion:

- La API publicada acepto el resend.
- ACS registro solicitudes `SendMail` exitosas y delivery success agregado pocos minutos despues.
- No hay evidencia visible de bounce en la ventana revisada.

## Seguridad

- `INTERNAL_ADMIN_TOKEN` se leyo desde Azure Functions solo en memoria.
- No se imprimio `INTERNAL_ADMIN_TOKEN`.
- No se pego token raw.
- No se pego token hash.
- No se pego link completo.
- No se guardo ningun secreto en repo, consola compartida ni handoff.
- No se instalaron extensiones nuevas; la extension `application-insights` fue solicitada por Azure CLI y no se instalo.

## Pendientes para QA

- QA debe usar el ultimo correo recibido en el mailbox indicado, posterior a `2026-06-08T22:13:46.829Z`.
- No capturar la barra de direccion completa ni compartir links con token.
- Reintentar TASK-168 con la invitacion fresca:
  - invitacion valida;
  - crear password/acceso;
  - login;
  - `/api/me`;
  - logout.

## Riesgos

- P1: si el nuevo link se expone en captura, chat o handoff, debe rotarse nuevamente.
- P1: si QA/Product Owner no puede acceder al mailbox asociado, se requerira decision de Product/Release para generar una invitacion nueva a un mailbox directo confirmado.
- P2: las metricas ACS son agregadas; no deben usarse para inferir contenido del correo ni link.
