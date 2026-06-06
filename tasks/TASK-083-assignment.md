# TASK-083 - Validar limpieza de mensaje persistente

## Equipo

QA

## Contexto

TASK-082 corrige el P3 encontrado en TASK-081: mensaje de duplicado persistente al operar compra/redencion.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar en ambiente publicado que el mensaje de duplicado solo aparece cuando corresponde y no queda persistente al cambiar de contexto.

## Alcance

- Intentar registrar duplicado por telefono.
- Confirmar mensaje claro de duplicado.
- Confirmar que selecciona/busca el cliente existente.
- Abrir compra desde ese cliente.
- Confirmar que el mensaje viejo de duplicado no queda visible si ya no aplica.
- Abrir historial.
- Confirmar que el mensaje viejo de duplicado no queda visible.
- Abrir redencion si el cliente tiene puntos.
- Confirmar que el mensaje viejo de duplicado no queda visible.
- Ejecutar smoke corto de compra/redencion/historial.
- Confirmar sin P0/P1 y sin nuevos errores visuales.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-082 completada y desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-083-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1/P2/P3 y evidencia resumida.
