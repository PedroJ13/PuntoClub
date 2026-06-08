# TASK-144 - Revalidar invitacion publicada despues del fallback

Equipo responsable: QA

## Contexto

TASK-142 no aprobo por P1: la ruta publicada `/company-invitations/accept` devolvia 404 de Azure Static Web Apps.
TASK-143 debe corregir fallback/rewrite para rutas profundas.

## Objetivo

Revalidar en ambiente publicado que la pantalla publica de invitacion carga correctamente y que el flujo operativo existente sigue sin regresion.

## Dependencias

- Esperar TASK-143 completada.
- Esperar deploy publicado del frontend.

## Alcance

1. Abrir:
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-invitations/accept`
   - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-invitations/accept?token=[token-sintacticamente-valido-no-real]`
2. Confirmar que ya no aparece `Azure Static Web Apps - 404: Not found`.
3. Confirmar que la app muestra estado controlado sin token y con token invalido.
4. Confirmar que no muestra el token completo en pantalla.
5. Validar que rutas normales de la app siguen funcionando:
   - `/`
   - `/index.html`
6. Ejecutar smoke rapido de Operaciones o documentar si se omite por alcance.

## Opcional controlado

Si Product/Infra entregan `INTERNAL_ADMIN_TOKEN` y un link real por canal seguro fuera del repo:

- aprobar una solicitud QA;
- validar que la pantalla con link real muestra invitacion valida;
- no pegar token admin ni link completo con token en el handoff.

## Entrega

Actualizar `tasks/TASK-144-HANDOFF.md` con aprobado/no aprobado y hallazgos P0/P1/P2/P3.
