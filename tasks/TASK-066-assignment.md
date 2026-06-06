# TASK-066 - Ajustar layout web por zonas segun PO Test

## Equipo

Web Dev

## Contexto

PO Test aprobo la direccion general de pantalla unica por zonas, pero encontro detalles visuales y de layout que deben ajustarse antes de seguir probando el flujo.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Ajustar la pantalla web para que busqueda y resultados queden en la columna izquierda, registro quede a la derecha con menor ancho, y el panel operativo siga abajo como espacio compartido para compra/redencion.

## Cambios requeridos

- Eliminar las palabras/titulos `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4` o equivalentes de cada panel.
- Mantener nombres funcionales visibles:
  - `Buscar cliente`;
  - `Registrar cliente`;
  - `Resultados`;
  - `Operacion` o titulo contextual de compra/redencion cuando aplique.
- Reorganizar desktop asi:
  - columna izquierda:
    - arriba busqueda;
    - debajo resultados de busqueda;
  - columna derecha:
    - registro de cliente;
  - panel inferior:
    - operacion de compra/redencion, ocupando el ancho util.
- El panel de `Registrar cliente` debe ser menos ancho que antes.
- La altura visual del panel de `Registrar cliente` debe alinearse con la suma de `Buscar cliente` + `Resultados`, cuando el viewport lo permita.
- El panel `Resultados` debe estar debajo de `Buscar cliente`, a la izquierda de `Registrar cliente`.
- En resultados:
  - asumir que 99% de casos sera un cliente;
  - aun asi soportar 2 o mas clientes sin romper layout;
  - mostrar lista compacta con scroll interno o distribucion estable si hay varios;
  - evitar que tarjetas/botones se monten entre si;
  - mantener `Pts.` para puntos.

## Logica a preservar

- Al abrir, foco en buscar.
- Si no aparece cliente, mover foco/mensaje a registrar.
- Al registrar cliente nuevo, mostrarlo/seleccionarlo en resultados.
- Si ya existe, mostrar mensaje claro, buscar/seleccionar existente.
- Desde resultado:
  - compra abre panel operativo inferior;
  - redimir abre panel operativo inferior solo si tiene puntos.
- Al registrar compra o redencion:
  - actualizar puntos;
  - limpiar/ocultar panel operativo;
  - devolver foco a buscar.

## Responsive

- Desktop debe aproximarse al boceto:
  - busqueda arriba izquierda;
  - resultados abajo izquierda;
  - registro a la derecha;
  - operacion abajo.
- Mobile puede apilar, pero el orden debe ser:
  - buscar;
  - resultados;
  - registrar;
  - operacion.
- No debe haber overflow horizontal.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.
- No quitar compra ni redencion.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-066-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Evidencia de que ya no aparecen labels `Zona X`.
- Evidencia desktop del layout:
  - busqueda arriba izquierda;
  - resultados abajo izquierda;
  - registro derecha menos ancho;
  - operacion abajo.
- Evidencia de resultados con 1 cliente.
- Evidencia o simulacion razonable de resultados con 2 o mas clientes.
- Evidencia mobile sin overflow horizontal.
- Evidencia de que compra/redencion y foco a buscar siguen funcionando.
