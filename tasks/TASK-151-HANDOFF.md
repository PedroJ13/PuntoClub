Equipo: QA

Tarea validada: TASK-151 - Reintentar validacion de invitacion real con link confirmado

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- Fecha QA: 2026-06-08
- Round: 2

Resultado: no aprobado / bloqueado por falta de link confirmado disponible para QA

Checks ejecutados:
- Lectura de `tasks/TASK-151-assignment.md`.
- Lectura de `tasks/TASK-150-HANDOFF.md`.
- Busqueda de referencias a link confirmado en `tasks/`, `docs/`, `chat-start/` y `AGENTS.md`.
- Revision de capturas compartidas por Product Owner/QA con contenido visible de notificacion interna, acuse de solicitud y correo de invitacion.
- Revision de captura compartida con el link real abierto en navegador publicado.
- Smoke HTTP publicado:
  - `/`
  - `/company-invitations/accept`

Hallazgos:
- TASK-150 no desbloqueo TASK-151. El handoff de Infra/Azure concluye que ACS muestra envio y delivery agregado exitoso, pero el link real no fue confirmado como entregado a QA.
- Las capturas compartidas confirman que el correo/invitacion fue recibido o visualizado con datos no sensibles esperados y que existe un CTA `Crear acceso`.
- La captura adicional corresponde al acuse de recepcion de solicitud, no a la invitacion usable; explicita que `Todavia no crea acceso operativo`.
- La captura de notificacion interna confirma que Punto Club recibio la solicitud y la dejo `pending`; tampoco contiene link usable de invitacion.
- La captura del CTA no expone el `href` real ni permite a esta sesion de QA abrir el link publicado con token.
- La captura del link real abierto confirma que la ruta publicada carga `Punto Club`, muestra `API real`, no muestra 404 y entra a la pantalla `INVITACION DE EMPRESA`.
- En la captura del link real la pantalla permanece en `Validando invitacion...`; no hay evidencia todavia del estado valido ni de los datos renderizados por la app.
- La captura del navegador expone el token en la barra de direccion; se trata como secreto y no se reproduce en este handoff.
- Sin evidencia del resultado final de validacion no se puede aprobar estado valido, empresa, correo, rol, vencimiento ni el estado del CTA `Crear acceso`.
- No se pidio ni uso `INTERNAL_ADMIN_TOKEN`, respetando el alcance.

P0/P1:
- Sin P0/P1 de producto confirmados en esta ejecucion.
- Bloqueo operativo heredado de TASK-150: la validacion real no puede aprobarse hasta recibir link confirmado por canal seguro.

P2/P3:
- P2 heredado de TASK-150: el diagnostico de entrega se basa en metricas agregadas de ACS/App Insights, no en confirmacion directa del mailbox o link abierto por QA.

Evidencia:
- `TASK-150-HANDOFF.md` documenta datos no sensibles:
  - `invitationId = 1`
  - `invitationEmail = pj13eros_business+task146-20260608092947@outlook.com`
  - `status = pending`
  - `expiresAt = 2026-06-15T15:30:01Z`
  - ACS `SendMail` con `StatusCode=202`
  - ACS `DeliveryStatusUpdate` con `Delivered/Success`
  - `resendCompanyInvitation` con `200`
  - link no confirmado como entregado a QA
- Captura compartida del correo muestra:
  - Una captura de notificacion interna muestra: `Se recibio una nueva solicitud de empresa en Punto Club`, empresa `QA Task 146 20260608092947`, correo de empresa, datos de contacto, `Solicitud = pending`, `Fecha de solicitud = 2026-06-08T15:29:49.000Z` y accion esperada de revisar/aprobar/enviar invitacion.
  - Una captura de acuse muestra: `Recibimos la solicitud de QA Task 146 20260608092947`, correo de empresa `pj13eros_business+task146-20260608092947@outlook.com` y texto `Todavia no crea acceso operativo`.
  - `Nombre = QA Task 146 20260608092947`
  - `Correo invitado = pj13eros_business+task146-20260608092947@outlook.com`
  - `Rol = owner`
  - `Estado = pending`
  - `Fecha de envio = 2026-06-08T15:30:01.000Z`
  - `Vence = 2026-06-15T15:30:01.000Z`
  - Una segunda captura muestra el mensaje `Active el acceso de su empresa`, la empresa, el correo invitado, el CTA `Crear acceso` y vencimiento `2026-06-15T15:30:01.000Z`.
  - No se observa token en las capturas.
  - No se observa ni se puede copiar el `href` real del CTA desde las capturas.
- Captura con link real abierto:
  - Web publicada carga `Punto Club`.
  - Ruta `/company-invitations/accept?token=[redacted]`.
  - No aparece `Azure Static Web Apps - 404: Not found`.
  - Vista muestra `INVITACION DE EMPRESA`, `Active el acceso de su empresa` y `Validando invitacion...`.
  - El token completo aparece en la barra del navegador de la captura y queda redaccionado/no reproducido.
- Smoke publicado:
  - `/`: `200`, titulo `Punto Club`, sin `404`.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin `404`.
- No se pego link completo con token, token raw, capturas ni secretos.

Riesgos o pendientes:
- Product Owner debe esperar el resultado final de la pantalla abierta con el link real y compartir evidencia redaccionada donde no se vea el token en la barra.
- Si se usa una nueva invitacion, Infra/Azure debe generar o reenviar solo despues de confirmar el mailbox destino.
- Reintentar TASK-151 o actualizar esta validacion cuando la pantalla deje de mostrar `Validando invitacion...`, antes del vencimiento de la invitacion vigente o de la nueva invitacion.
- Validar entonces:
  - pagina `Punto Club`, no 404;
  - estado valido de invitacion;
  - empresa, correo, rol y vencimiento no sensibles;
  - token completo no visible;
  - `Crear acceso` deshabilitado o bloqueado claramente por Entra/login fuera de alcance;
  - smoke breve de `/`.

Siguiente recomendado:
- Product Owner debe esperar si la pantalla cambia de `Validando invitacion...` a invitacion valida/no disponible/error y compartir una captura redaccionada sin barra de direccion ni token.
- Si queda indefinidamente en `Validando invitacion...`, Web/API debe revisar la llamada `GET /api/company-invitations/validate` para ese token sin exponerlo.
