# TASK-132 - Handoff Backend/API

## Resumen

Se implemento la base de invitaciones internas con token raw de un solo uso operativo para email y persistencia exclusiva de `token_hash`.

No se implemento accept/login real. Los endpoints internos quedan protegidos por feature flag hasta tener auth/admin real.

## Archivos modificados

- `api/src/functions/companyInvitations.js`
- `api/src/lib/companyInvitations.js`
- `api/src/lib/notifier.js`
- `api/src/lib/repository.js`
- `api/test/company-invitations.test.js`
- `api/package.json`

## Endpoints implementados

### `POST /api/company-invitations`

- Requiere `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`.
- Valida payload con `validateCompanyInvitationPayload`.
- Genera token raw con `crypto.randomBytes(32).toString('base64url')`.
- Hashea token con SHA-256 y guarda solo `token_hash varbinary(32)`.
- Crea invitacion en `dbo.CompanyInvitations`.
- Expiracion default: 7 dias, configurable con `COMPANY_INVITATION_EXPIRES_DAYS` entre 1 y 30.
- Envia email de invitacion por ACS si esta configurado.
- Envia notificacion interna sin incluir link ni token.
- Audita best-effort `company.invitation.created`.
- No devuelve token raw ni hash en respuesta.

### `GET /api/company-invitations/validate?token=...`

- Publico para que la futura pantalla de acceso pueda validar token.
- Valida formato de token.
- Hashea token recibido y busca por `token_hash`.
- Responde `200` con:
  - `valid=true` si esta pendiente y no expiro;
  - `valid=false` con `reason` `invalid`, `expired`, `accepted` o `revoked`.
- No expone token raw, hash ni datos sensibles innecesarios.

### `POST /api/company-invitations/{invitationId}/resend`

- Requiere `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`.
- Solo permite invitaciones `pending` no expiradas.
- Genera un token raw nuevo, reemplaza `token_hash` y reenvia email.
- Mantiene `expires_at` original porque la migracion actual no incluye `resent_count`, `last_sent_at` ni renovacion explicita.
- No audita `company.invitation.resent`, segun fuera de alcance.

## Email / seguridad

- El link completo solo se incluye en el email al invitado.
- La notificacion interna no incluye token ni link completo.
- No se loggea token raw, hash, connection string, JWT, SAS ni payload completo.
- Si ACS no esta configurado o falta `APP_PUBLIC_BASE_URL`, el envio queda `skipped` y el endpoint no falla por email.

## Pruebas ejecutadas

- `npm test` desde `api/`.
- Primer intento en sandbox fallo por `spawn EPERM`.
- Reintento elevado completo correctamente.
- Resultado: 61 tests pasan.
- `node -e "require('./src/functions/companyInvitations')"` desde `api/`.
- `node -e "require('./src/functions/companyRegistrationRequests')"` desde `api/`.
- Ambos cargan sin errores; `@azure/functions` emitio warnings esperados de test mode fuera del runtime.

## Limitaciones pendientes para accept/login

- No existe `POST /api/company-invitations/accept` en esta tarea.
- No se crean `CompanyUsers`.
- No se valida JWT de Entra External ID.
- No se activa login Web ni mapeo real de usuario a empresa.
- Resend invalida el link anterior al reemplazar `token_hash`; esto es intencional porque no se guarda token raw y no hay columnas de tracking de reenvio.
- El link usa `APP_PUBLIC_BASE_URL` con path `/company-invitations/accept?token=...`; Web Dev podra ajustar/crear esa ruta cuando implemente la pantalla real.
