# TASK-062 - Validar copy de puntos e iconos de acciones

## Equipo

QA

## Contexto

TASK-061 debe ajustar visualmente la UI:

- cambiar `Puntos` / `Puntos actuales` por `Pts.`;
- reemplazar botones largos de compra/redencion por iconos claros;
- mantener accesibilidad y flujo funcional.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar que la UI publicada queda mas compacta y clara, sin romper el flujo cliente + compra + redencion.

## Alcance

- Confirmar que la URL publicada refleja TASK-061.
- Confirmar que badges de puntos muestran `Pts.`.
- Confirmar que ya no aparece `Puntos actuales` como label visible largo en tarjetas/paneles.
- Confirmar que acciones principales usan iconos:
  - registrar compra;
  - redimir puntos;
  - ir a redimir puntos desde compra si aplica.
- Confirmar que los iconos tienen accesibilidad basica:
  - `aria-label` o texto equivalente para screen readers.
- Confirmar desktop/mobile:
  - sin overlap de nombre, telefono, email, puntos y acciones;
  - sin overflow horizontal;
  - botones faciles de tocar en mobile.
- Ejecutar flujo minimo:
  - buscar cliente;
  - registrar compra;
  - ir a redimir puntos;
  - redimir puntos o validar que la accion abre el panel correcto.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-061 completada y desplegada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-062-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
