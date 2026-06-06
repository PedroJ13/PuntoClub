# TASK-088 - Analizar senales post-piloto

## Equipo

Pulso

## Contexto

Despues de una primera sesion piloto controlada, Product necesita distinguir entre:

- bloqueos reales;
- mejoras antes de mas uso;
- mejoras post-MVP;
- ruido o preferencias no urgentes.

## Objetivo

Analizar hallazgos de la sesion piloto y proponer siguiente decision de producto/release.

## Entradas esperadas

- Handoff de PO Test o notas del usuario.
- Handoff de QA smoke pre-sesion si existe.
- Cualquier captura/hallazgo de la sesion.

## Alcance

- Clasificar hallazgos por severidad:
  - P0/P1 bloquea piloto;
  - P2 conviene corregir antes de ampliar uso;
  - P3 pulido;
  - post-MVP.
- Identificar patrones:
  - confusion de flujo;
  - lenguaje/copy;
  - velocidad/latencia;
  - datos;
  - operacion/caja real.
- Recomendar:
  - seguir piloto;
  - pausar y corregir;
  - ampliar a otro usuario;
  - abrir tareas tecnicas/producto.

## No tocar

- No implementar cambios.
- No editar backlog salvo que Product / Architect / Release lo pida despues.
- No cambiar Azure.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-088-HANDOFF.md
```

Incluye:

- Resumen de salud del piloto.
- Hallazgos clasificados.
- Recomendacion concreta.
- Tareas sugeridas por equipo si aplica.
