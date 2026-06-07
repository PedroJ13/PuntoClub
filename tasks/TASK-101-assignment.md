# TASK-101 - Validar auditoria operativa publicada

## Equipo

QA

## Contexto

La fase nueva agrega trazabilidad operativa minima. QA debe validar que no rompe el flujo publicado y que los eventos quedan visibles/consultables segun lo implementado.

## Objetivo

Validar en ambiente publicado que la auditoria registra operaciones criticas y que Caja/Reporte siguen funcionando.

## Alcance

- Confirmar frontend publicado con `API real`.
- Ejecutar o reutilizar datos minimos:
  - crear cliente;
  - registrar compra;
  - registrar redencion.
- Confirmar que eventos de auditoria existen para las operaciones implementadas.
- Confirmar que errores/rechazos auditados se comportan como espera Backend/API.
- Confirmar que Caja sigue operativa.
- Confirmar que Reporte operativo sigue operativa.
- Si hay UI de auditoria, validar:
  - eventos visibles;
  - rango/ultimos N;
  - estado vacio/error;
  - desktop/mobile sin overflow.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar secretos.
- Crear solo datos minimos de QA y documentarlos.

## Dependencias

- TASK-099 completada y desplegada.
- TASK-100 completada y desplegada si hay UI de auditoria.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-101-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, eventos esperados/observados, datos QA creados, hallazgos P0/P1/P2/P3 y evidencia resumida.
