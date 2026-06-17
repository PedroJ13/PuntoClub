# TASK-264 - QA del registro de uso de beneficios de membresia

Equipo: QA
Round: 12
Depende de: TASK-262, TASK-263
Estado: Assigned

## Objetivo

Validar en Azure que una empresa puede registrar usos de beneficios de membresia para un cliente con membresia activa.

## Contexto

TASK-261 aprobo la publicacion de activacion/consulta de membresias, pero confirmo que el registro de uso de beneficios seguia fuera de alcance. Esta tarea valida el cierre de esa parte operativa.

## Alcance

1. Leer handoffs de TASK-262 y TASK-263.
2. Validar API publicada:
   - `POST /api/customers/{customerId}/membership-benefit-usages`
   - `GET /api/customers/{customerId}/membership-benefit-usages?from=YYYY-MM-DD&to=YYYY-MM-DD`
3. Validar que sin sesion los endpoints respondan `401`, no `404`.
4. Con sesion real o evidencia segura disponible, validar flujo positivo:
   - cliente con membresia activa,
   - beneficio activo,
   - registrar uso,
   - ver historial reciente.
5. Validar errores controlados:
   - cliente sin membresia activa,
   - beneficio inactivo/invalido,
   - beneficio que no pertenece al plan activo.

## Validaciones minimas

- API publicada no responde 404 para endpoints nuevos.
- UI publicada muestra flujo de uso de beneficios cuando corresponde.
- No hay regresion visible en Operaciones, Mi empresa, Reportes, Login ni Admin empresas.
- No hay `window.confirm`, `localStorage` ni `sessionStorage` publicados.

## Handoff esperado

Actualizar `tasks/TASK-264-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia API.
- Evidencia Web.
- Evidencia de prueba positiva o bloqueo parcial.
- Hallazgos P1/P2/P3 si existen.
