# TASK-065 - Revalidar pantalla web por zonas despues del deploy

## Equipo

QA

## Contexto

TASK-063 rediseño la pantalla localmente en una sola vista por zonas. TASK-064 no aprobo porque la URL publicada todavia servia la UI anterior con menu/tabs.

Esta tarea repite QA despues de commitear y desplegar TASK-063 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que la pantalla publicada ya implementa el diseño por zonas y mantiene el flujo cliente + compra + redencion sin P0/P1.

## Alcance

- Confirmar que ya no hay menu lateral/tabs como flujo principal.
- Confirmar las 4 zonas:
  - `Buscar cliente`;
  - `Registrar cliente`;
  - `Resultados`;
  - `Operacion`.
- Confirmar foco default en buscar.
- Buscar cliente existente y ver resultado.
- Buscar cliente inexistente y confirmar foco/mensaje hacia registro.
- Registrar cliente nuevo y confirmar que aparece/queda seleccionado en resultados.
- Intentar duplicado y confirmar busqueda/seleccion del existente.
- Desde resultado, abrir compra en panel inferior.
- Registrar compra y confirmar puntos actualizados, panel limpio/oculto y foco a buscar.
- Desde resultado, abrir redencion en panel inferior si hay puntos.
- Redimir puntos y confirmar puntos actualizados, panel limpio/oculto y foco a buscar.
- Validar saldo insuficiente.
- Validar desktop/mobile sin overlap ni overflow horizontal.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-063 desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-065-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
