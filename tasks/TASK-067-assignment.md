# TASK-067 - Validar ajuste de layout web por zonas

## Equipo

QA

## Contexto

TASK-066 ajusta la pantalla unica por zonas despues de hallazgos de PO Test:

- eliminar labels `Zona X`;
- mover resultados debajo de busqueda;
- dejar registro a la derecha y mas angosto;
- contemplar resultados multiples;
- preservar compra/redencion en panel operativo inferior.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar en ambiente publicado que el layout ajustado cumple el boceto de PO y que el flujo cliente + compra + redencion sigue sin P0/P1.

## Alcance

- Confirmar que no aparecen textos `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4` ni labels equivalentes.
- Confirmar desktop:
  - `Buscar cliente` arriba izquierda;
  - `Resultados` debajo de busqueda;
  - `Registrar cliente` a la derecha;
  - registro menos ancho que el layout anterior;
  - registro con altura alineada a busqueda + resultados, si el viewport lo permite;
  - panel de compra/redencion abajo.
- Confirmar mobile:
  - sin overflow horizontal;
  - orden logico buscar, resultados, registrar, operacion.
- Buscar cliente existente y validar lista de resultados.
- Validar caso normal de 1 resultado.
- Validar busqueda que pueda devolver 2 o mas resultados si hay datos disponibles; si no hay datos reales suficientes, documentar como no ejecutado y revisar que el componente soporta lista/scroll sin romper.
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

- TASK-066 completada y desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-067-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1, evidencia desktop/mobile y nota explicita sobre resultado multiple.
