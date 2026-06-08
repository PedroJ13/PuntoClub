# TASK-139 - Acompanar configuracion manual de Entra External ID

Equipo responsable: Infra / Azure

## Contexto

TASK-135 preparo una guia manual para Microsoft Entra External ID.
TASK-130 confirmo que la sesion actual esta en `Default Directory`, por lo que no se deben crear app registrations ahi sin confirmar el external tenant correcto.

## Objetivo

Acompanar la configuracion manual de Entra External ID y entregar valores publicos seguros para que Backend/API y Web Dev puedan preparar login/invitacion sin secretos.

## Alcance

1. Usar como base `tasks/TASK-135-HANDOFF.md`.
2. Confirmar con el Product Owner si existe o se debe crear un external tenant de clientes para Punto Club.
3. No crear apps en `Default Directory`.
4. Si el Product Owner completa los pasos en portal, recopilar solo valores publicos:
   - external tenant name
   - external tenant ID
   - tenant subdomain
   - `puntoclub-web` client ID
   - `puntoclub-api` client ID
   - Application ID URI
   - scope completo
   - issuer
   - jwks_uri
   - metadata URL
   - redirect URIs configurados
   - user flow name
5. Validar que la metadata OIDC responde 200 y usa `ciamlogin.com`.

## Fuera de alcance

- No copiar passwords, client secrets, tokens, refresh tokens, cookies ni capturas con secretos.
- No activar auth estricta en Backend/API todavia.
- No implementar login en Web Dev.

## Bloqueo esperado

Si el Product Owner aun no puede crear o seleccionar el external tenant, dejar la tarea como bloqueada en el handoff con el paso exacto donde se detuvo.

## Entrega

Actualizar `tasks/TASK-139-HANDOFF.md`.
