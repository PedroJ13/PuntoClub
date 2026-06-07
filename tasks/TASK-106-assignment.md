# TASK-106 - Revisar responses 5xx recientes en Application Insights

## Equipo

Backend API

## Contexto

Infra / Azure detecto en TASK-098 que Application Insights muestra `6` responses con `resultCode >= 500` en las ultimas 24h, sin exceptions registradas. Antes de ampliar piloto conviene clasificar si fueron pruebas controladas, calentamiento/deploy o fallo real.

## Objetivo

Revisar los 5xx recientes del API y recomendar accion solo si hay indicio de fallo real.

## Alcance

- Consultar Application Insights o logs disponibles sin imprimir secretos ni payloads sensibles.
- Identificar:
  - rango horario;
  - endpoint/ruta si esta disponible;
  - tipo de fallo agregado;
  - correlacion con deploy/pruebas/smoke si aplica.
- Clasificar:
  - prueba/controlado;
  - calentamiento/SQL paused;
  - deploy/transitorio;
  - fallo real que requiere tarea.
- Si se detecta fallo real, proponer tarea pequena.

## No tocar

- No cambiar codigo.
- No cambiar Azure.
- No instalar extensiones nuevas.
- No imprimir tokens, connection strings, headers ni datos de negocio.

## Dependencias

- Si falta permiso de lectura en Azure/Application Insights, avisar al usuario.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-106-HANDOFF.md
```

Incluye clasificacion, evidencia resumida y recomendacion.
