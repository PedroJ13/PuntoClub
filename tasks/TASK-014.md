# TASK-014 - Preparar creacion real de recursos Azure

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-011 dejo plan production piloto sin crear recursos reales. El usuario ya creo una Azure SQL Database para Punto Club, por lo que Infra / Azure no debe crear otra DB.

## Objetivo

Preparar una guia ejecutable para crear los recursos Azure reales del piloto, sin ejecutar la creacion todavia.

## Alcance

- Confirmar region propuesta o listar decision pendiente.
- Inventariar la Azure SQL Database existente:
  - subscription/resource group si el usuario lo comparte
  - server name
  - database name
  - region
  - tier
  - firewall/configuracion necesaria
- Preparar checklist de creacion real.
- Preparar nombres definitivos de recursos.
- Preparar app settings requeridos sin valores secretos.
- Indicar comandos Azure CLI o pasos Portal si corresponde.
- Aclarar que Key Vault y storage de logos estan diferidos salvo nueva decision.

## No tocar

- No crear recursos reales sin confirmacion explicita.
- No crear otra Azure SQL Database.
- No guardar secretos.
- No cambiar codigo ni pipeline.

## Handoff esperado

Crear `tasks/TASK-014-HANDOFF.md`.
