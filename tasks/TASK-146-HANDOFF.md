# TASK-146 - Handoff Infra / Azure

## Resumen

Se ejecuto una aprobacion controlada de solicitud QA contra la API publicada para generar una invitacion real owner, sin exponer `INTERNAL_ADMIN_TOKEN`, token raw de invitacion, token hash ni link completo.

Ambiente:

- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Function App: `func-puntoclub-prod-br-001`
- Resource group: `resource_group_main`
- Fecha: `2026-06-08`

## Resultado

Completado.

La API publicada contiene TASK-140: la aprobacion devolvio solicitud aprobada, empresa creada e invitacion no sensible.

## Solicitud QA controlada

Datos no sensibles:

- `requestId`: `8`
- `requestStatus`: `approved`
- `companyId`: `2`
- `companyStatus`: `pending_activation`
- `invitationId`: `1`
- `invitationCompanyId`: `2`
- `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
- `invitationRole`: `owner`
- `invitationStatus`: `pending`
- `invitationExpiresAt`: `06/15/2026 15:30:01`

## Verificaciones

- `COMPANY_REGISTRATION_REVIEW_ENABLED=true` confirmado por app setting no secreto.
- `INTERNAL_ADMIN_TOKEN` presente en app settings y usado solo en memoria.
- `POST /api/company-registration-requests/{requestId}/approve` ejecutado con header `x-puntoclub-admin-token`.
- La respuesta incluyo:
  - solicitud aprobada;
  - empresa creada;
  - invitacion no sensible con `id`, `companyId`, `email`, `role`, `status`, `expiresAt`.
- La respuesta NO incluyo:
  - token raw;
  - token hash;
  - link completo con token;
  - secretos.

Validacion automatica local sobre la respuesta:

- `responseContainsSensitiveMaterial=false`

## Manejo de secretos

- No se imprimio `INTERNAL_ADMIN_TOKEN`.
- No se guardo ningun secreto en archivos.
- No se pego link completo de invitacion.
- No se pego token raw ni hash.
- No se roto `INTERNAL_ADMIN_TOKEN`, porque estaba disponible en app settings y la prueba se pudo ejecutar sin exponerlo.

## Correo real / link para QA

Se uso un mailbox controlado:

- `pj13eros_business+task146-20260608092947@outlook.com`

Pendiente fuera del repo:

- Confirmar recepcion del correo en ese mailbox.
- Entregar link completo de invitacion a QA por canal seguro si se recibe.

No se incluye el link en este handoff por seguridad.

## Fuera de alcance respetado

- No se implemento ni valido login/password real.
- No se creo app Entra.
- No se valido `POST /api/company-invitations/accept`.
- No se expuso ningun secreto o token en repo/handoff.

## Riesgos / notas

- La invitacion real queda pendiente hasta que QA reciba el link por canal seguro y valide la pantalla publicada.
- El flujo de aceptacion/login sigue bloqueado hasta Entra External ID.
- Si el correo no llega, revisar ACS Email/logs operativos sin imprimir payloads sensibles ni tokens.
