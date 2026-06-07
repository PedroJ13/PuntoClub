# TASK-111 - Decidir entrada a multiempresa controlado

## Equipo

Product / Architect / Release

## Contexto

La fase actual es Opcion A: configuracion de empresa piloto. Despues de validarla, Product / Architect / Release debe decidir si se avanza a Opcion B: multiempresa controlado.

## Objetivo

Decidir si la siguiente fase sera multiempresa controlado, mantener empresa piloto unica o pasar a otra prioridad operativa.

## Alcance

- Leer handoffs TASK-107 a TASK-110.
- Confirmar si configuracion de empresa quedo aprobada.
- Revisar riesgos para multiempresa:
  - aislamiento de datos;
  - fuente confiable de `companyId`;
  - auth/acceso temporal;
  - QA de dos empresas.
- Decidir:
  - seguir con Opcion B;
  - mantener Opcion A y piloto unico;
  - diferir multiempresa.
- Actualizar `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md` y `docs/DECISION_LOG.md` si cambia la decision.

## No tocar

- No implementar codigo.
- No crear empresas reales.
- No cambiar auth.
- No cambiar Azure.

## Dependencias

- TASK-110 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-111-HANDOFF.md
```

Incluye decision, motivo, riesgos, siguiente fase recomendada y tareas propuestas si aplica.
