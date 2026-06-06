# TASK-086 - Preparar guion de piloto operativo

## Equipo

PO Test

## Contexto

El MVP publicado esta listo para piloto controlado:

- flujo cliente + compra + redencion aprobado;
- historial aprobado;
- regresion MVP publicada aprobada;
- auditoria SQL limpia;
- runbook operativo disponible en `docs/PILOT_RUNBOOK.md`.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Preparar un guion corto para ejecutar una sesion piloto real/controlada con una empresa o usuario operador, capturando hallazgos de producto y operacion.

## Alcance

- Definir pasos de la sesion piloto:
  - calentamiento previo con `docs/PILOT_RUNBOOK.md`;
  - busqueda de cliente;
  - registro de cliente;
  - duplicado;
  - compra;
  - redencion;
  - historial;
  - cierre con preguntas.
- Definir datos recomendados:
  - cliente de prueba;
  - factura/comprobante;
  - monto;
  - puntos a redimir.
- Definir preguntas de observacion:
  - que entendio facil;
  - donde dudo;
  - que texto/accion confundio;
  - si el flujo se parece a caja real;
  - que falta para usarlo todos los dias.
- Definir formato de hallazgos:
  - flujo;
  - paso;
  - esperado;
  - observado;
  - severidad sugerida;
  - nota/captura.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar datos fuera de la prueba acordada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-086-HANDOFF.md
```

Incluye:

- Guion final.
- Checklist de preparacion.
- Preguntas de observacion.
- Formato de reporte.
- Riesgos o datos que Product debe preparar antes de la sesion.
