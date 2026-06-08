Equipo: QA

Tarea validada: TASK-142 - Validar flujo publicado solicitud aprobada e invitacion

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08

Resultado: no aprobado

Checks ejecutados:
- Solicitud QA de empresa desde UI publicada en panel `Mi empresa`.
- Caso negativo de formulario vacio en UI publicada.
- `POST /api/company-registration-requests/1/approve` sin `x-puntoclub-admin-token`.
- `GET /api/company-invitations/validate` sin token.
- `GET /api/company-invitations/validate?token=[token-formato-valido-no-existente]`.
- Navegacion directa publicada a `/company-invitations/accept`.
- Navegacion directa publicada a `/company-invitations/accept?token=[token-formato-valido-no-existente]`.
- Smoke operativo publicado: crear cliente, registrar compra, rechazar factura duplicada, registrar redencion, rechazar redencion mayor al saldo y consultar saldo.

Hallazgos:
- P1: La ruta directa publicada de invitacion no esta disponible. `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-invitations/accept` y la misma ruta con query `?token=...` responden `Azure Static Web Apps - 404: Not found`. Esto bloquea el link real que recibiria una empresa aprobada por correo, aunque la UI haya sido implementada localmente en TASK-141.
- Limitacion de alcance: no se recibio `INTERNAL_ADMIN_TOKEN` ni link real de invitacion por canal seguro, por lo que no se ejecuto la aprobacion real de la solicitud QA ni la validacion de estado valido de una invitacion real.

P0/P1:
- P1 abierto: deep link publicado de invitacion devuelve 404 y bloquea el flujo objetivo de invitacion.
- No se detectaron P0.

P2/P3:
- P3: El submit exitoso de solicitud de empresa desde UI publicada tomo aproximadamente 18.3s. Es funcional, pero conviene monitorear latencia percibida en el flujo publico.

Evidencia:
- UI solicitud empresa:
  - Datos QA: `QA TASK142 UI 1780929560467`, correo `qa-task142-ui-1780929560467@example.com`.
  - Resultado visible: `Solicitud recibida`.
  - Mensaje visible indica que se revisaran los datos y se enviara invitacion al correo cuando quede aprobada.
  - Tiempo observado: ~18.3s.
- UI formulario vacio:
  - Mensaje general: `Revise los campos marcados antes de enviar la solicitud.`
  - Campos marcados: nombre empresa, correo empresa, direccion empresa, correo contacto.
- API seguridad:
  - `POST /api/company-registration-requests/1/approve` sin token: `403 FORBIDDEN`, `Internal admin authorization failed.`
  - `GET /api/company-invitations/validate` sin token: `400 VALIDATION_ERROR`.
  - `GET /api/company-invitations/validate?token=[redacted]` con token sintacticamente valido pero inexistente: `200`, `{ "valid": false, "reason": "invalid" }`.
- UI invitacion publicada:
  - `/company-invitations/accept`: titulo `Azure Static Web Apps - 404: Not found`, texto `404: Not Found`.
  - `/company-invitations/accept?token=[redacted]`: mismo `404: Not Found`.
- Smoke operativo:
  - Cliente QA creado: id `90`, `201`.
  - Compra QA: `201`, `pointsEarned = 1000`.
  - Factura duplicada: `409 DUPLICATE_INVOICE`.
  - Redencion QA: `201`, `pointsRedeemed = 100`.
  - Redencion mayor al saldo: `409 INSUFFICIENT_POINTS`.
  - Saldo final: `pointsEarned = 1000`, `pointsRedeemed = 100`, `pointsBalance = 900`.

Riesgos o pendientes:
- Configurar fallback/rewrite de Azure Static Web Apps para que `/company-invitations/accept` sirva `index.html` y la app pueda validar el token.
- Reintentar TASK-142 con `INTERNAL_ADMIN_TOKEN` y link real entregados por canal seguro, sin documentar secretos ni URLs completas con token.
- Validar que la respuesta real de aprobacion incluya `company` e `invitation` no sensible y no incluya token raw, hash ni links completos.
- Validar email real solo si QA tiene acceso seguro al mailbox o evidencia redaccionada.

Siguiente recomendado:
- Infra/Web debe corregir el fallback publicado de Static Web Apps para rutas profundas.
- Luego QA debe repetir aprobacion controlada e invitacion real con credenciales seguras.
