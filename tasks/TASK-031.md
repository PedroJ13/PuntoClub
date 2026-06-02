# TASK-031 - Alinear contrato de IDs y timestamp de redencion

## Estado

Asignada a Backend/API.

## Contexto

QA TASK-029 aprobo API real con observaciones P2:

- `createdAt` de redencion no cumple estrictamente timestamp UTC completo.
- IDs SQL `bigint` llegan como string en algunas respuestas.

Product / Architect / Release decidio aceptar ids bigint como string en API.

## Objetivo

Alinear API y docs con esa decision, y corregir timestamp de redencion si aplica.

## Alcance

- Confirmar que ids bigint se devuelven consistentemente como string o documentar donde aplica.
- Corregir `createdAt` de redencion para que sea timestamp UTC completo cuando el contrato lo requiera.
- Actualizar pruebas unitarias o smoke si corresponde.
- No romper clientes existentes.

## No tocar

- No cambiar modelo SQL salvo necesidad justificada.
- No cambiar UI.
- No guardar secretos.

## Handoff esperado

Crear `tasks/TASK-031-HANDOFF.md`.
