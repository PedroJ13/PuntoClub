# TASK-259 - Publicar API de activacion de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 9
Depende de: TASK-256, TASK-258
Estado: Assigned

## Objetivo

Publicar en Azure Functions los endpoints de activacion y consulta de membresias de cliente ya implementados localmente en TASK-256.

## Contexto

QA reporto en TASK-258 que el API publicado aun responde 404 para los endpoints nuevos, aunque localmente TASK-256 quedo implementada y validada.

Endpoints esperados publicados:

- `POST /api/customers/{customerId}/memberships`
- `GET /api/customers/{customerId}/memberships?status=active|expired|cancelled|all`
- `GET /api/memberships/expiration-alerts?withinDays=5&status=active`

## Alcance

1. Revisar handoffs de TASK-256 y TASK-258.
2. Confirmar que la rama/codigo local contiene los endpoints de TASK-256.
3. Ejecutar pruebas automatizadas existentes.
4. Publicar API en Azure Functions.
5. Validar contra API publicada que los endpoints ya no responden 404.
6. Validar que sin sesion valida los endpoints sigan protegidos.

## Validaciones minimas

- `GET /api/me` sin sesion devuelve 401.
- `POST /api/customers/1/memberships` sin sesion no devuelve 404.
- `GET /api/customers/1/memberships?status=all` sin sesion no devuelve 404.
- `GET /api/memberships/expiration-alerts?withinDays=5&status=active` sin sesion no devuelve 404.
- Pruebas automatizadas pasan.

## Fuera de alcance

- Cambios de UX.
- Cambios de modelo SQL.
- Crear membresias reales desde navegador.

## Handoff esperado

Actualizar `tasks/TASK-259-HANDOFF.md` con:

- Resultado.
- Commit o referencia publicada si aplica.
- Evidencia de pruebas locales.
- Evidencia de endpoints publicados.
- Cualquier riesgo o bloqueo.
