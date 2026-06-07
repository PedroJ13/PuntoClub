# TASK-098 - Revisar observabilidad operativa Azure para piloto

## Equipo

Infra / Azure

## Contexto

El flujo operativo base y el reporte basico estan aprobados publicados. Antes de ampliar el piloto conviene confirmar que hay visibilidad minima de errores y disponibilidad sin cambiar arquitectura mayor.

## Objetivo

Revisar la observabilidad actual de Azure Functions, Static Web Apps y Azure SQL para el piloto controlado.

## Alcance

- Confirmar si Azure Functions tiene logs consultables suficientes.
- Confirmar si hay Application Insights o alternativa habilitada.
- Revisar que errores API queden visibles sin imprimir secretos.
- Revisar opciones de diagnostico minimo para Static Web Apps.
- Revisar visibilidad basica de Azure SQL:
  - estado online/paused;
  - errores de conexion;
  - metricas utiles para piloto.
- Recomendar solo cambios pequenos si hacen falta.

## No tocar

- No cambiar SKU.
- No cambiar firewall.
- No crear recursos costosos.
- No imprimir secretos.
- No aplicar cambios sin aprobacion explicita.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-098-HANDOFF.md
```

Incluye estado actual, brechas, recomendaciones P0/P1/P2/P3 y si algo requiere apoyo del usuario.
