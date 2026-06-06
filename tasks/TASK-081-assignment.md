# TASK-081 - Regresion MVP publicada pre-piloto

## Equipo

QA

## Contexto

El flujo cliente + compra + redencion fue aprobado en TASK-071. El historial publicado fue aprobado en TASK-076. La auditoria SQL pre-piloto no encontro P0/P1 en TASK-078.

Antes de pasar a uso real piloto, se requiere una regresion MVP completa en ambiente publicado.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Validar el MVP publicado end-to-end con foco en flujos criticos, negativos principales, historial y responsive, sin P0/P1 abiertos.

## Alcance

- Confirmar que la UI carga y muestra `API real`.
- Confirmar que no aparecen textos `Zona`/`zona`.
- Buscar cliente existente por telefono, nombre y email.
- Buscar cliente inexistente y confirmar foco/mensaje a registro.
- Registrar cliente nuevo.
- Intentar duplicado por telefono/email y confirmar mensaje claro.
- Registrar compra para cliente nuevo.
- Confirmar puntos ganados y saldo.
- Intentar compra sin factura.
- Intentar compra con monto 0.
- Intentar factura duplicada y confirmar que no altera saldo.
- Redimir puntos validos.
- Intentar redimir 0 puntos.
- Intentar redimir mas puntos que el saldo y confirmar que no altera saldo.
- Abrir historial y confirmar compra/redencion/balance.
- Validar cliente sin movimientos e historial vacio.
- Validar desktop y mobile sin overflow horizontal.
- Confirmar que no hay errores criticos en consola.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-081-HANDOFF.md
```

Incluye:

- Resultado aprobado/no aprobado.
- URL probada.
- Checks ejecutados.
- Datos QA creados.
- Hallazgos P0/P1/P2/P3.
- Evidencia resumida de flujo, negativos, historial y responsive.
