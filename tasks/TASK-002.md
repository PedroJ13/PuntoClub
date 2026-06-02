# TASK-002 - Proponer recursos Azure y costo minimo

## Estado

Asignada a Infra.

## Contexto

Punto Club fase 1 sera uso real piloto. La arquitectura inicial recomendada usa Azure Static Web Apps, Azure Functions y Azure SQL Database minima.

## Objetivo

Proponer los recursos Azure minimos para operar el piloto de Punto Club con bajo costo y sin exponer secretos.

## Alcance

- Proponer recursos Azure para:
  - frontend
  - API
  - SQL Database
  - secretos/configuracion
  - logs minimos
  - storage para logos si aplica
- Recomendar ambiente inicial:
  - local
  - production
  - staging opcional
- Estimar costo minimo mensual aproximado.
- Identificar variables de entorno requeridas.
- Recomendar como manejar connection strings y secretos.

## No tocar

- No implementar infraestructura.
- No cambiar codigo.
- No decidir modelo SQL.
- No guardar secretos en archivos.

## Verificacion

- Revisar que la propuesta cubra deploy, API, DB y secretos.
- Confirmar que el costo sea razonable para piloto.
- Listar riesgos o decisiones pendientes.

## Handoff esperado

Crear `tasks/TASK-002-HANDOFF.md` con:

```text
Equipo:
Tarea completada:
Recursos recomendados:
Costo estimado:
Variables/secretos:
Verificacion ejecutada:
Resultado:
Riesgos o pendientes:
Siguiente recomendado:
```
