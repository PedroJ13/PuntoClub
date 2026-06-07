# TASK-100 - Agregar consulta operativa de auditoria

## Equipo

Web Dev

## Contexto

Despues de que Backend/API implemente auditoria operativa minima, el equipo necesita una forma sencilla de revisar eventos recientes durante el piloto. Esto no es rediseño visual; es una herramienta operativa basica.

## Objetivo

Agregar una vista simple de auditoria o actividad tecnica si el endpoint queda disponible.

## Alcance

- Agregar acceso simple a `Auditoria` o `Eventos` sin romper Caja ni Reporte.
- Mostrar eventos recientes por rango o ultimos N:
  - fecha/hora;
  - tipo de evento;
  - cliente si aplica;
  - entidad;
  - resumen legible.
- Manejar estado vacio y error.
- Mantener diseno funcional actual; no hacer cambio de colores/branding.
- Debe funcionar desktop/mobile sin overflow horizontal.

## No tocar

- No cambiar API.
- No cambiar SQL.
- No implementar auth.
- No hacer rediseño visual general.

## Dependencias

- TASK-099 completada y endpoint/contrato disponible, si Backend decide exponer consulta.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-100-HANDOFF.md
```

Incluye cambios, evidencia local/publicada si aplica, estados vacio/error y pruebas responsive.
