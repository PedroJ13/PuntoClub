# TASK-076 - Revalidar historial publicado despues del deploy

## Equipo

QA

## Contexto

TASK-073 implemento localmente historial resumido de cliente en la UI.

TASK-075 no aprobo porque la URL publicada todavia no tenia el cambio: no aparecia accion `Historial`, panel `#history-panel`, ni referencias a `activity`.

Esta tarea repite QA despues de commitear y desplegar TASK-073 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que la UI publicada ya contiene historial resumido y que coincide con compra, redencion y saldo.

## Alcance

- Confirmar que la pantalla sigue sin textos `Zona`/`zona`.
- Confirmar que el frontend publicado contiene accion `Historial`.
- Confirmar que existe panel o vista de historial.
- Buscar cliente existente con movimientos.
- Abrir historial desde el resultado/cliente seleccionado.
- Confirmar que muestra:
  - puntos ganados;
  - puntos redimidos;
  - puntos actuales;
  - compras con fecha, factura, monto y puntos positivos;
  - redenciones con fecha, nota y puntos negativos.
- Registrar compra para ese cliente.
- Confirmar que historial se actualiza y el saldo coincide.
- Redimir puntos.
- Confirmar que historial se actualiza y el saldo coincide.
- Probar cliente sin movimientos o recien creado:
  - debe mostrar estado vacio claro;
  - no debe romper pantalla.
- Validar desktop y mobile sin overflow horizontal.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- Commit/deploy de TASK-073 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-076-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida de historial.
