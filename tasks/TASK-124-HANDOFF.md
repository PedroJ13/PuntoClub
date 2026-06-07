Equipo:
Backend API

Tarea completada:
TASK-124 - Actualizar contratos finales multiempresa controlado.

Archivos cambiados:
- docs/API_CONTRACTS.md
- tasks/TASK-124-HANDOFF.md

No se cambio:
- Codigo API.
- Validadores.
- Frontend.
- Migraciones SQL.
- Recursos Azure.
- Secretos/configuracion.

Verificacion ejecutada:
- Leido `AGENTS.md`.
- Leido `chat-start/BACKEND_API.md`.
- Leido `docs/README.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-124-assignment.md`.
- Leido `tasks/TASK-122-HANDOFF.md`.
- Leido `tasks/TASK-123-HANDOFF.md`.
- Leido `docs/API_CONTRACTS.md`.
- Revisado diff de `docs/API_CONTRACTS.md`.
- No se ejecuto `func start` ni `npm test` porque el alcance fue solo documentacion/contratos, sin codigo.

## Documentos actualizados

`docs/API_CONTRACTS.md`:
- Se agrego una seccion nueva `Multiempresa controlado`.
- Se ampliaron errores comunes con codigos esperados para multiempresa:
  - `COMPANY_ALREADY_EXISTS`
  - `REGISTRATION_ALREADY_PENDING`
  - `INVITATION_ALREADY_PENDING`
  - `INVITATION_ALREADY_ACCEPTED`
  - `INVITATION_EXPIRED`
  - `COMPANY_USER_ALREADY_EXISTS`
  - `UPLOAD_TOO_LARGE`
  - `UNSUPPORTED_MEDIA_TYPE`
  - `RATE_LIMITED`

## Resumen de cambios contractuales

Contratos finales agregados:
- `POST /api/company-registration-requests`
- `POST /api/company-registration-requests/{requestId}/approve`
- `POST /api/company-registration-requests/{requestId}/reject`
- `POST /api/company-invitations`
- `POST /api/company-invitations/{invitationId}/resend`
- `GET /api/company-invitations/validate?token=...`
- `POST /api/company-invitations/accept`
- `GET /api/me`
- `GET /api/my-company`
- `PATCH /api/my-company`
- `POST /api/my-company/logo`
- `GET /api/my-company/logo`

Ajustes incorporados desde TASK-122:
- `companyAddress` es requerido en registro de empresa.
- Emails se normalizan server-side con `trim` y lowercase.
- No hay password local.
- `external_subject` viene del JWT validado de Entra External ID, no del frontend.
- `POST /api/company-invitations/accept` no acepta `password` ni `externalSubject` en body.
- Logo se maneja por Blob Storage privado.
- `PATCH /api/my-company` no acepta `logoUrl`, `logoBlobPath`, `email`, `status` ni `companyId`.
- `GET /api/my-company` no expone `logo_blob_path`; expone `logoUrl` controlado por API/SAS corto.
- Se agrego contrato explicito para aprobar/rechazar solicitudes antes de invitar.
- Se documentaron eventos de auditoria permitidos por la migracion SQL.
- Se documento que `company.invitation.resent` no debe auditarse hasta que exista migracion para ese evento.

Compatibilidad:
- La seccion nueva no reemplaza automaticamente el modo empresa piloto.
- Los contratos MVP actuales con `PILOT_COMPANY_ID` quedan intactos.
- Se documenta que multiempresa productivo requiere migracion SQL aplicada, Entra External ID, ACS Email y Blob Storage privado aprobados/configurados.

## Dudas o decisiones pendientes

- Confirmar mecanismo concreto de admin interno para `approve`, `reject` y creacion/reenvio de invitaciones.
- Confirmar si aceptar invitacion owner activa automaticamente `Companies.status = active`; el contrato lo permite, pero debe quedar confirmado por Product / Architect / Release antes de codificar.
- Confirmar valor default de `pointsPercentage` al aprobar solicitud si no se envia en `approve`.
- Confirmar si `GET /api/my-company/logo` servira bytes por API o redirigira a SAS corto (`LOGO_SERVE_MODE=api|short_sas`).
- Confirmar si en reenvio de invitacion se mantendra expiracion original o se renovara con nueva expiracion.
- Confirmar si se agregara migracion futura para auditar `company.invitation.resent`; por ahora queda fuera del contrato auditado.
- Confirmar claim estable de Entra External ID que Backend/API usara como `external_subject`.

## Riesgos

- Implementar `accept` sin JWT real permitiria vincular usuarios no confiables.
- Implementar reenvio auditado con `company.invitation.resent` fallaria contra la migracion actual.
- Si Web sigue enviando `requestedLogoUrl` o no envia `companyAddress`, fallara validacion del contrato final.
- Activar multiempresa operativo sin mapeo `CompanyUsers -> company_id` puede mezclar datos entre empresas.

## Siguiente recomendado

Crear tareas Backend/API pequenas y verificables:
1. Validadores/formatters/errors multiempresa.
2. Repositorio de registration requests + approve/reject.
3. Invitaciones con token hash y email adapter mock.
4. Auth middleware Entra con tests mock + `/api/me`.
5. Accept invitation con JWT validado.
6. `/api/my-company`.
7. Logo upload con storage adapter.
8. ACS Email real cuando Infra configure recursos/settings.
