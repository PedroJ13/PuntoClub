Equipo: QA

Tarea validada: TASK-147 - Validar invitacion real publicada con link seguro

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- Fecha QA: 2026-06-08

Resultado: no aprobado / bloqueado por dependencia externa

Checks ejecutados:
- Lectura de `tasks/TASK-146-HANDOFF.md`.
- Confirmacion de que TASK-146 genero una invitacion real no sensible:
  - `requestId`: `8`
  - `companyId`: `2`
  - `invitationId`: `1`
  - `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
  - `invitationRole`: `owner`
  - `invitationStatus`: `pending`
- Smoke HTTP publicado:
  - `/`
  - `/company-invitations/accept`

Hallazgos:
- Bloqueo QA: no se recibio el link real de invitacion por canal seguro en este turno. Sin ese link no se puede validar que una invitacion real muestre estado valido, empresa, correo, rol y vencimiento.
- TASK-146 deja explicitamente pendiente confirmar recepcion del correo y entregar el link completo a QA por canal seguro fuera del repo.
- No se uso ni se pidio `INTERNAL_ADMIN_TOKEN`, respetando el alcance de TASK-147.

P0/P1:
- Sin P0/P1 de producto confirmados en esta ejecucion.
- La tarea no puede aprobarse porque falta la dependencia principal: link real seguro.

P2/P3:
- Sin P2/P3 nuevos.

Evidencia:
- `TASK-146-HANDOFF.md` documenta invitacion real pendiente con datos no sensibles:
  - `invitationId = 1`
  - `invitationEmail = pj13eros_business+task146-20260608092947@outlook.com`
  - `role = owner`
  - `status = pending`
  - `expiresAt = 06/15/2026 15:30:01`
- Smoke publicado:
  - `/`: `200`, titulo `Punto Club`, sin `404`.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin `404`.
- No se pego link completo con token, token raw, capturas ni secretos.

Riesgos o pendientes:
- Confirmar recepcion del correo real en `pj13eros_business+task146-20260608092947@outlook.com`.
- Entregar a QA el link completo por canal seguro fuera del repo.
- Reintentar TASK-147 antes del vencimiento documentado de la invitacion.
- Validar entonces:
  - pagina `Punto Club`, no 404;
  - estado valido;
  - empresa, correo, rol y vencimiento no sensibles;
  - token completo no visible;
  - `Crear acceso` deshabilitado o bloqueado claramente por Entra/login fuera de alcance.

Siguiente recomendado:
- Product/Infra debe entregar el link real por canal seguro o confirmar si el correo no llego para revisar ACS/logs operativos sin exponer secretos.
