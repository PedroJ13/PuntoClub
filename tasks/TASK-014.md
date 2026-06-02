# TASK-014 - Preparar creacion real de recursos Azure

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-011 dejo plan production piloto sin crear recursos reales. Falta confirmar suscripcion, region final y si el equipo quiere creacion manual o IaC minima.

## Objetivo

Preparar una guia ejecutable para crear los recursos Azure reales del piloto, sin ejecutar la creacion todavia.

## Alcance

- Confirmar region propuesta o listar decision pendiente.
- Preparar checklist de creacion real.
- Preparar nombres definitivos de recursos.
- Preparar app settings requeridos sin valores secretos.
- Indicar comandos Azure CLI o pasos Portal si corresponde.
- Aclarar que Key Vault y storage de logos estan diferidos salvo nueva decision.

## No tocar

- No crear recursos reales sin confirmacion explicita.
- No guardar secretos.
- No cambiar codigo ni pipeline.

## Handoff esperado

Crear `tasks/TASK-014-HANDOFF.md`.
