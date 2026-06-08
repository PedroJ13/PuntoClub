# TASK-165 - Confirmar deploy publicado de Web auth propia

Equipo responsable: Web Dev

## Dependencia

Esperar que Product / Architect / Release haya subido a `main` los cambios de TASK-161.

## Contexto

TASK-161 implemento Crear acceso/login localmente, pero TASK-162 encontro que el frontend publicado no tenia referencias a `company-auth/login` ni `/api/me`.

## Objetivo

Confirmar que la Web publicada contiene la integracion de auth propia:

- `/company-invitations/accept?token=...` muestra formulario de Crear acceso cuando la invitacion es valida.
- `/login` muestra pantalla real de login.
- `customerApi.js` publicado contiene llamadas a `company-auth/login`, `company-auth/logout`, `/api/me` y accept con password.
- La UI usa `credentials: "include"` para llamadas de sesion.

## Alcance

- Verificar deploy de Static Web Apps posterior al commit con TASK-161.
- Smoke publicado sin usar token real visible ni password real.
- No pegar URL completa con token.
- No pegar passwords ni cookies.

## Entregable

Crear o actualizar `tasks/TASK-165-HANDOFF.md` con:

- Resultado.
- Evidencia redaccionada.
- Riesgos o bloqueos.
