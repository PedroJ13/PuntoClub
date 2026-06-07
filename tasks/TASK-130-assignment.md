# TASK-130 - Configurar Microsoft Entra External ID para Punto Club

## Equipo

Infra / Azure

## Prioridad

P1

## Contexto

TASK-127 creo ACS Email y Blob Storage privado, pero dejo Microsoft Entra External ID pendiente/manual. Sin Entra External ID no se puede completar acceso/password real ni mapear usuarios a empresas.

## Objetivo

Configurar Microsoft Entra External ID para el piloto multiempresa de Punto Club, o documentar exactamente que paso requiere intervencion manual del Product Owner.

## Alcance

- Crear/configurar tenant externo si los permisos lo permiten.
- Crear app SPA/SWA `puntoclub-web`.
- Crear app/API audience/scope `puntoclub-api` o equivalente.
- Crear user flow sign-up/sign-in con email/password.
- Configurar redirects:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/auth/callback`
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
  - URLs locales recomendadas por TASK-127.
- Obtener valores publicos necesarios:
  - issuer;
  - audience/client id;
  - JWKS/openid configuration URL;
  - tenant id.
- Configurar Function App settings de auth solo si se tienen valores confirmados, sin imprimir secretos.
- Documentar public config para Web Dev.

## Fuera de alcance

- Implementar login en Web.
- Implementar middleware API.
- Crear usuarios reales de empresas externas.
- Imprimir secretos.

## Entregable

Crear `tasks/TASK-130-HANDOFF.md` con:

- Que quedo configurado.
- Valores publicos seguros.
- App settings configurados por nombre.
- Cualquier paso manual pendiente.
- Riesgos.

## Validacion esperada

Backend/API y Web Dev deben poder implementar auth/login usando el handoff, o saber exactamente que bloqueo manual queda.
