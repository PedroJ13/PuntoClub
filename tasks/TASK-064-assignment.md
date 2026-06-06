# TASK-064 - Validar pantalla web por zonas

## Equipo

QA

## Contexto

TASK-063 debe reemplazar el menu lateral/tabs por una sola pantalla web con zonas:

1. buscar;
2. registrar;
3. resultados;
4. panel operativo inferior para compra/redencion.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar que la pantalla publicada implementa el nuevo diseño por zonas y mantiene el flujo cliente + compra + redencion sin P0/P1.

## Alcance

- Confirmar que no hay menu lateral/tabs como flujo principal.
- Confirmar las 4 zonas:
  - busqueda;
  - registro;
  - resultados;
  - panel operativo inferior.
- Confirmar foco default en buscar.
- Buscar cliente existente y ver resultado.
- Buscar cliente inexistente y confirmar foco/mensaje hacia registro.
- Registrar cliente nuevo y confirmar que aparece/queda seleccionado en resultados.
- Intentar duplicado y confirmar:
  - mensaje claro;
  - busqueda automatica/seleccion del existente.
- Desde resultado, abrir compra en panel inferior.
- Registrar compra y confirmar:
  - puntos actualizados;
  - panel operativo se limpia/oculta;
  - foco vuelve a buscar.
- Desde resultado, abrir redencion en panel inferior solo si hay puntos.
- Redimir puntos y confirmar:
  - puntos actualizados;
  - panel operativo se limpia/oculta;
  - foco vuelve a buscar.
- Validar saldo insuficiente.
- Validar desktop/mobile sin overlap ni overflow horizontal.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-063 completada y desplegada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-064-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
