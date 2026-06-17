# TASK-262 - API para registrar uso de beneficios de membresia

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 11
Depende de: TASK-246, TASK-251, TASK-259, TASK-261
Estado: Assigned

## Objetivo

Implementar y publicar el API operativo para registrar usos de beneficios de membresia por cliente.

## Contexto

El MVP de membresias debe registrar usos de beneficios controlables. La tabla `MembershipBenefitUsages` ya fue creada en TASK-246, pero QA confirmo en TASK-261 que el endpoint de uso de beneficios sigue fuera de alcance y responde `404`.

## Alcance

1. Revisar handoffs de TASK-246, TASK-251, TASK-259 y TASK-261.
2. Implementar endpoint para registrar uso de beneficio:
   - `POST /api/customers/{customerId}/membership-benefit-usages`
3. Implementar consulta de usos del cliente:
   - `GET /api/customers/{customerId}/membership-benefit-usages?from=YYYY-MM-DD&to=YYYY-MM-DD`
4. Validar que el cliente tenga membresia activa.
5. Validar que el beneficio pertenezca al plan activo del cliente y este activo.
6. Registrar auditoria operacional si el patron existente lo permite.
7. Publicar API en Azure Functions.

## Reglas funcionales MVP

- No permitir uso si el cliente no tiene membresia activa.
- No permitir uso de beneficio inactivo.
- No permitir uso de beneficio que no pertenezca al plan activo del cliente.
- El registro debe guardar fecha, beneficio, cliente, membresia, nota opcional y usuario/empresa segun contexto disponible.
- Para beneficios tipo descuento ilimitado, se puede registrar cada uso como evento sin bloquear por cantidad.
- Para beneficios controlables, respetar campos de limite si ya existen en el modelo; si la regla no esta lista, dejarlo documentado como pendiente y no inventar reglas complejas.

## Validaciones minimas

- Pruebas automatizadas pasan.
- Sin sesion valida, endpoints responden `401`, no `404`.
- Con datos validos, registra uso.
- Con cliente sin membresia activa, devuelve error controlado.
- Con beneficio invalido/inactivo, devuelve error controlado.

## Fuera de alcance

- Redisenar UI.
- Crear nuevos tipos de membresia.
- Facturacion o pagos.
- Avisos por correo de vencimiento.

## Handoff esperado

Actualizar `tasks/TASK-262-HANDOFF.md` con:

- Resultado.
- Endpoints implementados/publicados.
- Evidencia de pruebas.
- Evidencia de validacion publicada.
- Reglas implementadas y reglas diferidas.
