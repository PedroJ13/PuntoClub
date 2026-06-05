# TASK-051 - Validar flujo publicado cliente + compra + redencion

## Equipo

QA

## Contexto

TASK-050 debe agregar redencion/canje de puntos al frontend. Esta tarea valida el flujo completo publicado despues del deploy.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Confirmar que el flujo publicado permite buscar/crear cliente, registrar compra, redimir puntos y mantener saldo correcto sin P0/P1.

## Alcance

- Confirmar que el frontend publicado refleja TASK-050.
- Buscar cliente existente.
- Confirmar puntos visibles.
- Registrar compra para sumar puntos.
- Redimir puntos validos.
- Confirmar saldo actualizado despues de redimir.
- Intentar redimir mas puntos que el saldo.
- Confirmar error claro de saldo insuficiente.
- Validar errores de redencion:
  - puntos requeridos;
  - puntos `0` o negativos;
  - fecha requerida si la UI permite vaciarla.
- Confirmar que el flujo de compra de TASK-049 no regresa.
- Probar desktop/mobile basico.

## No tocar

- No implementar cambios.
- No crear recursos Azure.
- No cambiar secretos.
- No hacer pruebas destructivas fuera del flujo normal.

## Dependencias

- TASK-050 completada y desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-051-HANDOFF.md
```

Incluye:

- Resultado aprobado/no aprobado.
- URL probada.
- Checks ejecutados.
- Hallazgos P0/P1 con pasos reproducibles.
- Observaciones P2/P3 si aparecen.
- Si queda listo para PO Test, indicarlo explicitamente.
