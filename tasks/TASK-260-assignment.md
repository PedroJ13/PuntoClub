# TASK-260 - Publicar Web de activacion de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 9
Depende de: TASK-257, TASK-258, TASK-259
Estado: Assigned

## Objetivo

Publicar en Azure Static Web Apps la UI de activacion y consulta de membresias de cliente ya implementada localmente en TASK-257.

## Contexto

QA reporto en TASK-258 que el sitio publicado aun no contiene los marcadores/flujo visual de TASK-257.

Marcadores esperados en el bundle publicado:

- `membership-activation-title`
- `membership-customer-memberships-title`
- `createCustomerMembership`
- `listCustomerMemberships`
- `listMembershipExpirationAlerts`
- `CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP`

## Alcance

1. Revisar handoffs de TASK-257, TASK-258 y TASK-259.
2. Confirmar que el codigo Web contiene la UI de activacion de membresias.
3. Ejecutar build/pruebas disponibles.
4. Publicar Web en Azure Static Web Apps.
5. Validar que el bundle publicado contiene los marcadores esperados.
6. Validar que no se reintroduzcan `localStorage`, `sessionStorage` ni `window.confirm`.

## Validaciones minimas

- Build Web pasa.
- Sitio publicado carga.
- Bundle publicado contiene los marcadores de membresias indicados.
- No hay `localStorage`, `sessionStorage` ni `window.confirm` en el bundle publicado.

## Fuera de alcance

- Redisenar pantallas.
- Cambiar reglas de membresias.
- Prueba PO completa.

## Handoff esperado

Actualizar `tasks/TASK-260-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de build.
- Evidencia de marcadores publicados.
- Riesgos o notas para QA.
