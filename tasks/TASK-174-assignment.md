# TASK-174 - Confirmar deploy Web del ajuste accept sin credentials

Equipo responsable: Web Dev

## Contexto

TASK-170 quito localmente `credentials: "include"` de `acceptCompanyInvitation`, pero TASK-171 confirmo que el bundle publicado todavia tenia el codigo anterior.

## Objetivo

Confirmar que Static Web Apps publicada ya contiene el ajuste de TASK-170 despues del commit/deploy.

## Checks requeridos

- Revisar `/src/customerApi.js` publicado.
- Confirmar que `acceptCompanyInvitation` ya no contiene `credentials: "include"`.
- Confirmar que `loginCompany`, `logoutCompany` y `getCurrentCompanyUser` mantienen `credentials: "include"`.
- Smoke visual basico de `/company-invitations/accept?token=[fake-redacted]` sin exponer token real.

## Seguridad

- No usar token real.
- No usar password real.
- No pegar URL completa con token.

## Entregable

Crear o actualizar `tasks/TASK-174-HANDOFF.md` con resultado y evidencia redaccionada.
