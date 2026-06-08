# TASK-169 - Diagnosticar fallo publicado en Crear acceso auth propia

Equipo responsable: Backend API

## Contexto

Product Owner probo la invitacion fresca publicada. La pantalla muestra `Invitacion valida` y el formulario real de `Crear acceso`, pero al enviar nombre + password aparece el mensaje generico:

`No se pudo crear el acceso. Intente de nuevo.`

No se compartio token, password ni URL completa. No pedir ni registrar esos valores.

## Objetivo

Diagnosticar y corregir el fallo publicado de `POST /api/company-invitations/accept` en el flujo real de Crear acceso.

## Hipotesis a revisar

- Error API/SQL en `acceptCompanyInvitationWithPassword`.
- Constraint SQL en `CompanyUsers` o `CompanySessions`.
- CORS/credentials desde Static Web Apps hacia Azure Functions.
- Respuesta bloqueada por navegador por falta de `Access-Control-Allow-Credentials`.
- Cookie cross-site con `SameSite=Lax` / dominio distinto.
- Token de invitacion rotado/aceptado/expirado durante la prueba.

## Alcance

- Revisar App Insights alrededor del intento del Product Owner, sin exponer token/password.
- Revisar logs de `acceptCompanyInvitation` y dependencias SQL.
- Si es bug de codigo, implementar fix minimo.
- Si es CORS/cookie strategy, documentar claramente el ajuste requerido y coordinar con Web/Infra si hace falta.
- Ejecutar pruebas.
- No pedir token ni password al Product Owner.
- No imprimir `INTERNAL_ADMIN_TOKEN`, token raw, password, cookie ni URL completa.

## Entregable

Crear o actualizar `tasks/TASK-169-HANDOFF.md` con:

- Resultado.
- Causa raiz o diagnostico mas probable.
- Cambios realizados o bloqueo.
- Pruebas ejecutadas.
- Pendientes para Web/Infra/QA si aplica.
- Confirmacion de seguridad sin secretos.
