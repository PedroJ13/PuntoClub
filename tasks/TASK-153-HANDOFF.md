Equipo: QA

Tarea validada: TASK-153 - Revisar evidencia redaccionada de invitacion real

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- Fecha QA: 2026-06-08
- Round: 2

Resultado: no aprobado / evidencia insuficiente

Checks ejecutados:
- Lectura de `tasks/TASK-153-assignment.md`.
- Lectura de `tasks/TASK-152-HANDOFF.md`.
- Lectura de `tasks/TASK-151-HANDOFF.md`.
- Revision de seguridad de la evidencia disponible:
  - no hay link completo en `TASK-152-HANDOFF.md`;
  - no hay token en `TASK-152-HANDOFF.md`;
  - no hay captura con barra de direccion en `TASK-152-HANDOFF.md`.
- Smoke HTTP publicado:
  - `/`
  - `/company-invitations/accept`

Hallazgos:
- La evidencia de TASK-152 esta correctamente redaccionada: no expone token ni link completo.
- La evidencia disponible muestra que el link real llego a abrir la web publicada, carga `Punto Club`, no cae en 404 y entra a la pantalla `INVITACION DE EMPRESA`.
- La evidencia no basta para aprobar porque el ultimo estado observado sigue siendo `Validando invitacion...`.
- Falta el dato exacto requerido para aprobar: estado final de la pantalla despues de validar el token real.
- No hay evidencia redaccionada de invitacion valida con empresa/correo/rol/vencimiento renderizados por la app.
- No hay evidencia redaccionada de que `Crear acceso` este deshabilitado o claramente bloqueado por Entra/login pendiente en la pantalla publicada.
- No se pidio ni uso `INTERNAL_ADMIN_TOKEN`, respetando el alcance.

P0/P1:
- Sin P0/P1 de producto confirmados con la evidencia disponible.
- No se puede aprobar la invitacion real hasta tener evidencia final posterior a `Validando invitacion...`.

P2/P3:
- P2: si la pantalla queda indefinidamente en `Validando invitacion...`, Web/API debe revisar la llamada `GET /api/company-invitations/validate` para el token real sin exponerlo.

Evidencia:
- `TASK-152-HANDOFF.md` reporta evidencia redaccionada disponible:
  - Empresa: `QA Task 146 20260608092947`.
  - Correo invitado: `pj13eros_business+task146-20260608092947@outlook.com`.
  - Rol: `owner`.
  - Estado de invitacion en correo: `pending`.
  - Vence: `2026-06-15T15:30:01.000Z`.
  - CTA visible en correo: `Crear acceso`.
- Pantalla publicada con link real abierto, segun TASK-152/TASK-151:
  - Web carga `Punto Club`.
  - Ruta profunda redaccionada: `/company-invitations/accept?token=[redacted]`.
  - No aparece `Azure Static Web Apps - 404: Not found`.
  - Pantalla: `INVITACION DE EMPRESA`.
  - Estado observado: `Validando invitacion...`.
- Smoke publicado ejecutado por QA:
  - `/`: `200`, titulo `Punto Club`, sin `404`.
  - `/company-invitations/accept`: `200`, titulo `Punto Club`, sin `404`.
- No se pego link completo con token, token raw, capturas ni secretos.

Riesgos o pendientes:
- Product Owner debe abrir el ultimo link vigente y esperar resultado final, no solo la pantalla de carga.
- Compartir evidencia redaccionada sin barra de direccion ni token indicando uno de estos estados:
  - invitacion valida;
  - invitacion no disponible;
  - invitacion expirada;
  - error de servicio;
  - carga indefinida tras espera razonable.
- Si el resultado es invitacion valida, la evidencia debe mostrar empresa, correo, rol, vencimiento y el CTA `Crear acceso` deshabilitado o bloqueado claramente por Entra/login pendiente.

Siguiente recomendado:
- Reintentar PO Test/QA con evidencia final redaccionada.
- Si sigue en `Validando invitacion...` por mas de una espera razonable, abrir tarea para Web/API enfocada en la llamada de validacion de invitacion publicada sin exponer el token.
