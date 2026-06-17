# TASK-261 - QA publicado de activacion de membresias

Equipo: QA
Round: 10
Depende de: TASK-259, TASK-260
Estado: Assigned

## Objetivo

Validar en Azure que el flujo de activacion de membresias quedo publicado y disponible para prueba funcional.

## Contexto

TASK-258 fallo porque API y Web publicados no tenian todavia lo implementado localmente en TASK-256 y TASK-257. Esta tarea valida la publicacion corregida.

## Alcance

1. Leer handoffs de TASK-258, TASK-259 y TASK-260.
2. Validar endpoints publicados:
   - `POST /api/customers/{customerId}/memberships`
   - `GET /api/customers/{customerId}/memberships?status=active|expired|cancelled|all`
   - `GET /api/memberships/expiration-alerts?withinDays=5&status=active`
3. Validar que sin sesion los endpoints esten protegidos y no respondan 404.
4. Validar que Web publicado contiene UI de activacion de membresia.
5. Si hay sesion real disponible, ejecutar prueba positiva:
   - crear/usar cliente,
   - activar membresia,
   - ver membresia activa en ficha del cliente,
   - verificar que no permita segunda membresia activa.

## Validaciones minimas

- API publicada no devuelve 404 para endpoints de membresias de cliente.
- UI publicada muestra controles de activacion/consulta de membresias.
- No hay regresion visible en login, operaciones, Mi empresa ni Reportes.
- Si no se puede probar positivo por falta de credenciales o datos, dejarlo explicitamente como bloqueo parcial.

## Handoff esperado

Actualizar `tasks/TASK-261-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia de API publicada.
- Evidencia de Web publicada.
- Evidencia de prueba positiva o bloqueo parcial.
- Hallazgos P1/P2/P3 si existen.
