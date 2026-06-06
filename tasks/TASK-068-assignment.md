# TASK-068 - Revalidar layout ajustado despues del deploy

## Equipo

QA

## Contexto

TASK-066 implemento el ajuste de layout solicitado por PO Test:

- eliminar labels visibles `Zona X`;
- dejar `Buscar cliente` arriba izquierda;
- dejar `Resultados` debajo de busqueda;
- dejar `Registrar cliente` a la derecha con menor ancho;
- mantener panel operativo inferior para compra/redencion;
- soportar resultados multiples sin romper layout.

TASK-067 no aprobo porque la URL publicada todavia servia la version anterior, con labels `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4`.

Esta tarea repite QA despues de commitear y desplegar TASK-066 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que la pantalla publicada ya refleja TASK-066 y que el flujo cliente + compra + redencion sigue sin P0/P1.

## Alcance

- Confirmar que no aparecen textos `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4` ni labels equivalentes.
- Confirmar desktop:
  - `Buscar cliente` arriba izquierda;
  - `Resultados` debajo de busqueda;
  - `Registrar cliente` a la derecha;
  - registro menos ancho que el layout anterior;
  - registro alineado en altura a busqueda + resultados cuando el viewport lo permite;
  - panel de compra/redencion abajo.
- Confirmar mobile:
  - sin overflow horizontal;
  - orden logico buscar, resultados, registrar, operacion.
- Buscar cliente existente y validar lista de resultados.
- Validar caso normal de 1 resultado.
- Validar busqueda con 2 o mas resultados si hay datos disponibles; si no hay datos suficientes, documentar como no ejecutado y revisar estructura/scroll del componente.
- Confirmar que cada resultado muestra datos principales, `Pts.` y acciones.
- Confirmar que compra abre panel operativo inferior.
- Registrar compra y confirmar puntos actualizados, panel limpio/oculto y foco a buscar.
- Confirmar que redencion abre panel operativo inferior solo si hay puntos.
- Redimir puntos y confirmar puntos actualizados, panel limpio/oculto y foco a buscar.
- Confirmar que busqueda sin resultado mueve foco/mensaje hacia registro.
- Confirmar duplicado con mensaje claro y seleccion del existente.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- Commit/deploy de TASK-066 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-068-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1, evidencia desktop/mobile y nota explicita sobre resultado multiple.
