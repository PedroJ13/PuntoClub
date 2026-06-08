Equipo: QA

Tarea validada: TASK-149 - Reintentar validacion de invitacion real con link seguro

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- Fecha QA: 2026-06-08
- Round: 2

Resultado: no aprobado / bloqueado por falta de link seguro disponible para QA

Checks ejecutados:
- Lectura de `tasks/TASK-149-assignment.md`.
- Lectura de `tasks/TASK-148-HANDOFF.md`.
- Confirmacion de que TASK-148 completo el reenvio de invitacion:
  - `invitationId`: `1`
  - `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
  - `invitationStatus`: `pending`
  - `invitationExpiresAt`: `2026-06-15T15:30:01Z`
  - `resendCompanyInvitation`: `200`
  - `resentAt`: `2026-06-08T15:53:46.99Z`
- Smoke HTTP publicado:
  - `/`
  - `/company-invitations/accept`

Hallazgos:
- TASK-148 ya esta completada y confirma que la invitacion fue reenviada al mailbox controlado.
- Bloqueo QA persistente: el link completo del ultimo correo no fue entregado a esta sesion de QA por canal seguro. Sin ese link no se puede abrir una invitacion real ni validar estado valido, empresa, correo, rol, vencimiento o CTA `Crear acceso`.
- El ultimo correo reenviado es el vigente porque TASK-148 indica que el segundo resend roto el token.
- No se pidio ni uso `INTERNAL_ADMIN_TOKEN`, respetando el alcance.

P0/P1:
- Sin P0/P1 de producto confirmados en esta ejecucion.
- La tarea no puede aprobarse porque falta la dependencia operativa principal: link real seguro disponible para QA.

P2/P3:
- P2 heredado de TASK-148: Azure/App Insights confirma resend `200`, pero no hay confirmacion de entrega final de mailbox desde Azure.

Evidencia:
- `TASK-148-HANDOFF.md` documenta datos no sensibles:
  - `invitationId = 1`
  - `email destino = pj13eros_business+task146-20260608092947@outlook.com`
  - `status = pending`
  - `expiresAt = 2026-06-15T15:30:01Z`
  - `resendCompanyInvitation = 200`
  - `responseContainsTokenOrLink = false`
- Smoke publicado:
  - `/`: `200`, titulo `Punto Club`, sin `404`.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin `404`.
- No se pego link completo con token, token raw, capturas ni secretos.

Riesgos o pendientes:
- Revisar el mailbox controlado `pj13eros_business+task146-20260608092947@outlook.com`.
- Usar el ultimo correo recibido, porque el reenvio mas reciente roto el token y deja vigente solo el ultimo link.
- Entregar el link completo a QA por canal seguro fuera del repo/handoff.
- Reintentar TASK-149 antes del vencimiento de la invitacion.
- Cuando se reciba el link seguro, validar:
  - pagina `Punto Club`, no 404;
  - estado valido de invitacion;
  - empresa, correo, rol y vencimiento no sensibles;
  - token completo no visible;
  - `Crear acceso` deshabilitado o bloqueado claramente por Entra/login fuera de alcance;
  - smoke breve de `/`.

Siguiente recomendado:
- Product Owner o Infra / Azure debe entregar a QA el link del ultimo correo reenviado mediante canal seguro fuera del repo.
