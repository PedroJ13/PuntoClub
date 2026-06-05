# TASK-060 - Revalidar UI publicada con menu lateral de paneles despues del deploy

## Equipo

QA

## Contexto

TASK-058 reorganizo la UI localmente con menu/paneles. TASK-059 no aprobo porque la URL publicada todavia no reflejaba esos cambios.

Esta tarea repite QA despues de que los cambios de TASK-058 hayan sido commiteados y desplegados en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que la UI publicada resuelve el hallazgo UX de paneles fuera de pantalla y mantiene el flujo cliente + compra + redencion.

## Alcance

- Confirmar que existe menu lateral o tabs equivalentes en mobile.
- Confirmar default `Registrar cliente`.
- Confirmar que solo un panel operativo queda activo/visible.
- Confirmar que el usuario no debe buscar compra/redencion con scroll entre paneles apilados.
- Registrar cliente nuevo y confirmar que se mantiene en registro con confirmacion clara.
- Intentar cliente duplicado y confirmar:
  - mensaje claro;
  - seleccion del cliente existente;
  - cambio automatico a `Registrar compra`.
- Registrar compra.
- Desde compra, usar `Ir a redimir puntos`.
- Redimir puntos.
- Validar desktop/mobile.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-058 desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-060-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
