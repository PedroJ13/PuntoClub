# TASK-085 - Revalidar limpieza P3 despues del deploy

## Equipo

QA

## Contexto

TASK-082 corrigio localmente el P3 de mensaje persistente de duplicado.

TASK-083 no aprobo porque la URL publicada todavia mostraba el comportamiento anterior, por lo que el cambio no estaba desplegado.

Esta tarea repite QA despues de commitear y desplegar TASK-082 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que el mensaje de duplicado ya no queda persistente al cambiar de contexto hacia compra, historial o redencion.

## Alcance

- Intentar registrar duplicado por telefono o email.
- Confirmar que el mensaje de duplicado aparece cuando corresponde.
- Confirmar que el cliente existente queda seleccionado/buscado.
- Abrir compra y confirmar que el mensaje viejo desaparece.
- Registrar compra y confirmar que el mensaje viejo sigue oculto.
- Abrir historial y confirmar que el mensaje viejo no aparece.
- Abrir redencion y confirmar que el mensaje viejo no aparece.
- Registrar redencion y confirmar que el mensaje viejo sigue oculto.
- Confirmar que no hay P0/P1 ni regresiones visuales.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- Commit/deploy de TASK-082 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-085-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1/P2/P3 y evidencia resumida.
