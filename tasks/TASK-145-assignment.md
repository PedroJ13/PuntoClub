# TASK-145 - Revalidar fallback publicado despues del deploy de config SWA

Equipo responsable: QA

## Contexto

TASK-143 agrego `app/staticwebapp.config.json` y valido localmente el fallback de Azure Static Web Apps.
TASK-144 no aprobo porque el ambiente publicado seguia devolviendo 404 para `/company-invitations/accept`.

Product / Architect / Release va a subir el commit que incluye `app/staticwebapp.config.json`. El workflow frontend despliega cambios bajo `app/**`, por lo que esta tarea debe ejecutarse despues de que el deploy de Static Web Apps termine.

## Objetivo

Confirmar que el frontend publicado ya sirve la app para rutas profundas de invitacion.

## Dependencias

- Esperar commit/push que incluya `app/staticwebapp.config.json`.
- Esperar que termine el workflow `Deploy Punto Club frontend`.

## Alcance

1. Abrir:
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-invitations/accept`
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-invitations/accept?token=[token-sintacticamente-valido-no-real]`
2. Confirmar que ya no aparece `Azure Static Web Apps - 404: Not found`.
3. Confirmar que la app renderiza estado controlado:
   - sin token;
   - token invalido.
4. Confirmar que el token completo no se muestra en pantalla.
5. Confirmar rutas normales:
   - `/`
   - `/index.html`
6. Ejecutar smoke operativo breve o documentar si se omite.

## Fuera de alcance

- No usar `INTERNAL_ADMIN_TOKEN` salvo entrega segura fuera del repo.
- No pegar tokens ni links completos con token en el handoff.
- No validar login/password real.

## Entrega

Actualizar `tasks/TASK-145-HANDOFF.md` con aprobado/no aprobado y hallazgos P0/P1/P2/P3.
