# TASK-110 - Validar configuracion de empresa publicada

## Equipo

QA

## Contexto

Esta fase usa Opcion A: configuracion de empresa piloto. QA debe validar que la configuracion publicada permite editar datos operativos sin romper Caja, Reporte ni Auditoria.

## Objetivo

Validar en ambiente publicado la lectura/edicion de configuracion de empresa piloto.

## Alcance

- Confirmar frontend publicado con `API real`.
- Confirmar pantalla `Empresa` o `Configuracion`.
- Confirmar lectura de settings.
- Editar datos minimos de QA de forma reversible o documentada:
  - porcentaje de puntos;
  - email/telefono/nombre si aplica.
- Confirmar validaciones:
  - porcentaje `0` o negativo;
  - porcentaje mayor a `100`;
  - email invalido;
  - URL de logo invalida si aplica.
- Confirmar que un cambio de porcentaje afecta compras futuras solamente.
- Confirmar que historicos no se recalculan.
- Confirmar auditoria de cambio si fue implementada.
- Regresion:
  - Caja;
  - Reporte;
  - Auditoria.
- Desktop/mobile sin overflow horizontal.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar secretos.
- No crear empresa nueva.

## Dependencias

- TASK-108 completada y desplegada.
- TASK-109 completada y desplegada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-110-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, datos cambiados, restauracion si aplica, hallazgos P0/P1/P2/P3 y evidencia resumida.
