# TASK-008 - Preparar SQL ejecutable con seed minimo

## Estado

Asignada a SQL DEV.

## Contexto

TASK-003 creo `database/schema.sql` con modelo inicial, restricciones, vista y procedimiento. QA definio datos minimos de prueba.

## Objetivo

Dejar lista una base SQL ejecutable para desarrollo/piloto con seed minimo sin secretos.

## Alcance

- Revisar `database/schema.sql`.
- Agregar o crear script separado para seed minimo:
  - empresa piloto active
  - porcentaje 5.00
  - clientes QA opcionales si corresponde
- Confirmar que el script puede ejecutarse en Azure SQL en orden.
- Agregar notas de ejecucion sin connection strings.
- Definir si seed debe vivir en `database/seed.sql` o comentario documentado.

## No tocar

- No guardar connection strings.
- No cambiar contratos API.
- No implementar API.
- No crear recursos Azure.

## Verificacion

- Validar orden de ejecucion.
- Validar que constraints no bloquean seed valido.
- Validar que datos QA coinciden con `docs/QA_TEST_PLAN.md`.

## Handoff esperado

Crear `tasks/TASK-008-HANDOFF.md`.
