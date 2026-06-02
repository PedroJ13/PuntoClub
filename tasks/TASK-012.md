# TASK-012 - Validar SQL/API base

## Estado

Asignada a QA.

## Contexto

QA ya preparo checklist MVP en TASK-006. Esta tarea debe ejecutarse cuando SQL/API tengan una primera base disponible.

## Objetivo

Validar la primera integracion SQL/API para clientes, compras, saldos y errores criticos.

## Alcance

- Ejecutar checklist parcial de API/SQL:
  - crear cliente
  - impedir cliente duplicado
  - registrar compra
  - impedir factura duplicada
  - consultar saldo
  - validar redencion si endpoint existe
- Clasificar hallazgos P0/P1/P2/P3.
- Confirmar si la base esta lista para integracion Web Dev.

## No tocar

- No cambiar codigo salvo tarea explicita.
- No aprobar release completo.
- No validar UI si aun no existe.

## Verificacion

- Usar datos de `docs/QA_TEST_PLAN.md`.
- Reportar comandos, ambiente o evidencia usada.
- No aprobar si hay P0/P1 en saldo, duplicados o separacion por empresa.

## Handoff esperado

Crear `tasks/TASK-012-HANDOFF.md`.
