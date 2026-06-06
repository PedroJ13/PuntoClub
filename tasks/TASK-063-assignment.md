# TASK-063 - Rediseñar pantalla web en una sola vista por zonas

## Equipo

Web Dev

## Contexto

Cambio de direccion de diseño indicado por Product/PO:

- Olvidar el menu lateral/tabs.
- Intentar una pantalla web completa, todo en una misma vista.
- El layout debe parecerse al boceto recibido: panel de busqueda, panel de registro, panel de resultados y panel operativo inferior.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Crear una pantalla operativa web de caja donde busqueda, registro, resultados y operacion convivan en una sola vista, con foco guiado segun el estado del cliente.

## Layout esperado

Usar una estructura de 4 zonas principales:

- Zona 1: Buscar cliente.
  - Buscar por telefono, nombre o email.
  - Si la busqueda no encuentra resultado, mover el foco a registrar cliente.
- Zona 2: Registrar cliente.
  - Panel de registro.
  - Al registrar exitosamente, el cliente debe aparecer/seleccionarse como si se hubiera buscado.
  - Si ya existia, ejecutar busqueda automatica en background, mostrar mensaje claro y seleccionar el cliente existente.
- Zona 3: Resultados de busqueda.
  - Puede mostrar uno o varios clientes como lista compacta.
  - Cada cliente debe mostrar nombre, telefono/email, puntos (`Pts.`) y acciones:
    - registrar compra;
    - redimir puntos solo si tiene puntos disponibles.
- Zona 4: Panel operativo inferior.
  - Mismo espacio para dos paneles alternos:
    - registrar compra;
    - redimir puntos.
  - Aparece/cambia segun el boton presionado en resultados.
  - Debe tener boton de registrar/confirmar.
  - Al registrar compra o redencion, el panel desaparece o se limpia y el foco vuelve a buscar.

## Logica esperada

- Default al abrir: foco en buscar.
- Si se busca y no aparece cliente:
  - mover foco a registrar cliente.
  - mostrar mensaje corto que invite a registrar.
- Si se registra cliente nuevo:
  - mostrarlo/seleccionarlo en resultados como si hubiera sido buscado.
  - no perder el contexto.
- Si al registrar ya existe:
  - mostrar mensaje claro;
  - buscar automaticamente en background;
  - seleccionar/mostrar el cliente existente en resultados.
- Desde resultado:
  - accion compra abre panel operativo de compra abajo.
  - accion redimir abre panel operativo de redencion abajo, solo si tiene puntos.
- Despues de registrar compra:
  - actualizar puntos;
  - limpiar/ocultar panel operativo;
  - devolver foco a buscar.
- Despues de redimir:
  - actualizar puntos;
  - limpiar/ocultar panel operativo;
  - devolver foco a buscar.

## UI/Visual

- Mantener estilo sobrio y operativo.
- No usar menu lateral.
- Usar `Pts.` para puntos.
- Usar botones compactos/iconos si ayuda a evitar overflow.
- Evitar que textos o controles se monten.
- Responsive:
  - desktop debe priorizar una sola vista sin scroll innecesario;
  - mobile puede apilar zonas, pero debe conservar orden logico.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.
- No quitar compra ni redencion.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-063-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Evidencia de las 4 zonas.
- Evidencia de foco default en buscar.
- Evidencia de busqueda sin resultado pasando a registro.
- Evidencia de registro nuevo pasando a resultados.
- Evidencia de duplicado buscando/seleccionando existente.
- Evidencia de compra y redencion desde resultados usando panel inferior.
- Evidencia de foco retornando a buscar despues de operar.
- Evidencia desktop/mobile.
