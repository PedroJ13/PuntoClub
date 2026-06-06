# TASK-061 - Ajustar copy de puntos e iconos de acciones

## Equipo

Web Dev

## Contexto

PO Test encontro problemas visuales en tarjetas y paneles:

- El badge `Puntos actuales` ocupa demasiado espacio y puede verse torcido/cortado.
- En tarjetas de cliente, los botones `Registrar compra` y `Redimir puntos` son largos y hacen que el contenido se apriete.
- Se solicita cambiar los nombres de botones por iconos que representen sus acciones.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Pulir la UI para que las tarjetas sean mas compactas y las acciones se entiendan por iconos, sin romper accesibilidad ni el flujo aprobado.

## Alcance

- Cambiar todo label visible de puntos tipo:
  - `Puntos`
  - `Puntos actuales`
  por:
  - `Pts.`
- Mantener el numero de puntos grande y legible.
- Reemplazar los botones largos de acciones por botones con iconos:
  - registrar compra;
  - redimir puntos;
  - ir a redimir puntos desde compra, si aplica.
- Los iconos pueden ser lineales blancos sobre boton verde para accion primaria.
- Evitar dependencias pesadas si no existen; usar SVG inline simple o una estrategia local consistente.
- Agregar texto accesible:
  - `aria-label`;
  - `title` si ayuda.
- En desktop y mobile, asegurar que:
  - nombre, telefono, email, puntos y acciones no se monten;
  - las acciones no rompan la tarjeta;
  - el menu/paneles de TASK-060 se conserva.
- Mantener el flujo:
  - registrar cliente;
  - duplicado pasa a compra;
  - compra funciona;
  - boton/accion hacia redencion funciona;
  - redencion funciona.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.
- No cambiar reglas de negocio.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-061-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Evidencia de `Pts.` en tarjeta/lista y paneles.
- Evidencia de iconos en acciones principales.
- Evidencia de accesibilidad basica (`aria-label`/title).
- Evidencia desktop/mobile sin overlap.
- Confirmacion de que compra y redencion siguen funcionando.
