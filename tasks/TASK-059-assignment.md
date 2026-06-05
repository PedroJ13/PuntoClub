# TASK-059 - Validar UI publicada con menu lateral de paneles

## Equipo

QA

## Contexto

TASK-058 debe reorganizar la UI para evitar multiples paneles largos apilados y guiar el flujo con menu lateral o tabs en mobile.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar que la UI publicada resuelve el hallazgo UX de PO Test y mantiene el flujo cliente + compra + redencion sin P0/P1.

## Alcance

- Confirmar que existe menu lateral o navegacion equivalente por paneles.
- Confirmar opcion default `Registrar cliente`.
- Confirmar que los paneles largos ya no quedan apilados obligando a buscarlos con scroll.
- Registrar cliente nuevo.
- Intentar registrar cliente duplicado:
  - validar mensaje claro;
  - validar seleccion del cliente existente;
  - validar cambio automatico a `Registrar compra`.
- Registrar compra.
- Desde compra, usar boton/accion para ir a `Redimir puntos`.
- Redimir puntos validos.
- Validar saldo insuficiente.
- Confirmar puntos actualizados.
- Probar desktop/mobile basico.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-058 completada y desplegada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-059-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
