# TASK-007 - Decidir auth fase 1 y fuente confiable de companyId

## Estado

Asignada a Product / Architect / Release.

## Contexto

Los handoffs TASK-004, TASK-005 y TASK-006 coinciden en que auth fase 1 y la fuente confiable de `companyId` bloquean la implementacion end-to-end.

## Objetivo

Definir una decision MVP para autenticar/autorizar la empresa piloto sin construir todavia el flujo SaaS completo.

## Alcance

- Decidir como entra un operador de la empresa piloto.
- Decidir si `companyId` viene de:
  - configuracion server-side
  - sesion/auth
  - ruta validada
  - otro mecanismo temporal
- Definir si el path `/api/companies/{companyId}` se mantiene en MVP o se encapsula despues.
- Definir riesgo aceptado para piloto.
- Actualizar `docs/DECISION_LOG.md`, `docs/API_CONTRACTS.md` y `docs/ARCHITECTURE.md`.

## No tocar

- No implementar auth.
- No crear usuarios reales.
- No guardar secretos.
- No cambiar contratos mas alla de aclarar la fuente de empresa.

## Verificacion

- La decision debe desbloquear Backend/API y Web Dev.
- La decision debe evitar que el frontend pueda operar otra empresa arbitrariamente.
- La decision debe ser suficientemente simple para piloto.

## Handoff esperado

Actualizar docs y dejar recomendacion para TASK-009/TASK-010.
