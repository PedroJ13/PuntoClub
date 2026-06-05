# TASK-058 - Reorganizar UI por menu lateral de paneles

## Equipo

Web Dev

## Contexto

PO Test encontro que hay varios paneles visibles y algunos quedan fuera de pantalla. El usuario debe ir a buscarlos con scroll, lo cual hace lento el flujo operativo.

La necesidad es transformar la pantalla en una experiencia por paneles con un menu lateral izquierdo.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Hacer que el flujo de caja sea guiado y compacto: un menu lateral permite cambiar entre registrar cliente, registrar compra y redimir puntos sin tener varios formularios largos apilados.

## Alcance

- Agregar menu lateral izquierdo con opciones/paneles:
  - `Registrar cliente`;
  - `Registrar compra`;
  - `Redimir puntos`.
- La opcion default al abrir debe ser `Registrar cliente`.
- Mantener busqueda/lista de cliente accesible para seleccionar cliente existente.
- Evitar que compra y redencion queden como paneles largos apilados debajo del registro.
- Mostrar solo el panel activo o, si se mantiene contexto, que el panel activo sea evidente y no obligue a buscarlo con scroll.
- Si se intenta registrar un cliente y no existe:
  - registrarlo;
  - quedarse en registro o mostrar confirmacion clara de cliente registrado;
  - no forzar compra automaticamente salvo que el flujo lo haga de forma clara.
- Si se intenta registrar un cliente y ya existe:
  - mostrar mensaje claro;
  - seleccionar el cliente existente;
  - cambiar automaticamente al panel `Registrar compra`.
- En el panel `Registrar compra`:
  - mostrar cliente seleccionado y puntos actuales;
  - permitir registrar compra;
  - incluir boton/accion clara para ir a `Redimir puntos` del mismo cliente.
- En el panel `Redimir puntos`:
  - mostrar el mismo cliente seleccionado y puntos actuales;
  - permitir redimir;
  - mantener errores de saldo insuficiente y validaciones.
- Mantener responsive desktop/mobile. En mobile, el menu puede convertirse en tabs/segmented control superior si funciona mejor.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.
- No quitar flujo de compra ni redencion ya aprobado.

## Consideraciones de UX

- El flujo operativo principal es caja:
  1. registrar o buscar cliente;
  2. registrar compra;
  3. opcionalmente redimir puntos.
- El cambio de panel debe sentirse inmediato y obvio.
- El usuario no debe tener que scrollear para encontrar compra o redencion despues de seleccionar cliente.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-058-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Evidencia de menu lateral/panel activo.
- Evidencia de default en `Registrar cliente`.
- Evidencia de duplicado pasando a `Registrar compra`.
- Evidencia de boton desde compra hacia `Redimir puntos`.
- Evidencia responsive desktop/mobile.
- Confirmacion de que compra y redencion siguen funcionando.
