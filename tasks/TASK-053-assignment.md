# TASK-053 - Revalidar flujo publicado cliente + compra + redencion despues del deploy

## Equipo

QA

## Contexto

TASK-050 implemento redencion/canje localmente. TASK-051 no aprobo porque la URL publicada todavia no reflejaba esos cambios.

Esta tarea repite QA despues de commitear y desplegar TASK-050 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Confirmar que el flujo publicado ya permite cliente + compra + redencion sin P0/P1.

## Alcance

- Confirmar que el frontend publicado refleja TASK-050.
- Confirmar que el JS publicado contiene:
  - `redemption-form`;
  - `data-action="redemption"`;
  - `Redimir puntos`;
  - `createRedemption`.
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
- Confirmar que compra sigue funcionando.
- Probar desktop/mobile basico.

## No tocar

- No implementar cambios.
- No crear recursos Azure.
- No cambiar secretos.
- No probar fuera del flujo normal de QA.

## Dependencias

- Commit/deploy de TASK-050 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-053-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, evidencia de redencion, hallazgos P0/P1 si aparecen y si queda listo para PO Test.
