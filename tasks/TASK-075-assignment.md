# TASK-075 - Validar historial publicado de cliente

## Equipo

QA

## Contexto

TASK-073 agrega historial resumido de compras/redenciones en la UI. El backend ya tiene endpoint `/activity`; esta tarea valida el flujo publicado despues del deploy de TASK-073.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar que una persona pueda consultar historial resumido de un cliente en la UI publicada y que ese historial coincida con compra, redencion y saldo.

## Alcance

- Confirmar que la pantalla sigue sin textos `Zona`/`zona`.
- Buscar cliente existente con movimientos.
- Abrir historial desde el resultado/cliente seleccionado.
- Confirmar que muestra:
  - saldo/balance;
  - compras con fecha, factura, monto y puntos positivos;
  - redenciones con fecha, nota y puntos negativos;
  - orden entendible, preferiblemente mas reciente primero.
- Registrar compra para ese cliente.
- Confirmar que historial se actualiza y el saldo coincide.
- Redimir puntos.
- Confirmar que historial se actualiza y el saldo coincide.
- Probar cliente sin movimientos o recien creado:
  - debe mostrar estado vacio claro;
  - no debe romper la pantalla.
- Validar desktop y mobile sin overflow horizontal.
- Confirmar errores comprensibles si `/activity` falla o cliente no existe, si se puede simular sin tocar datos reales.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-073 completada y desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-075-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida de historial.
