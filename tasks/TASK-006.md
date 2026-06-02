# TASK-006 - Preparar checklist QA MVP

## Estado

Asignada a QA.

## Contexto

Punto Club fase 1 sera uso real piloto. QA debe validar integridad de puntos, facturas y redenciones, no solo apariencia.

## Objetivo

Convertir `docs/QA_TEST_PLAN.md` en checklist ejecutable para cerrar MVP.

## Alcance

- Preparar checklist para:
  - registrar cliente
  - registrar compra
  - impedir factura duplicada
  - consultar saldo
  - redimir puntos
  - impedir redencion mayor al saldo
  - buscar cliente
  - revisar historial
- Definir datos de prueba minimos.
- Definir severidad esperada para fallos.
- Identificar pruebas que requieren API/SQL listos.

## No tocar

- No implementar tests automaticos salvo tarea explicita.
- No cambiar codigo.
- No cambiar alcance MVP.

## Verificacion

- Checklist debe distinguir happy path y casos negativos.
- Checklist debe poder ejecutarse por una persona no tecnica cuando haya app disponible.

## Handoff esperado

Crear `tasks/TASK-006-HANDOFF.md`.
