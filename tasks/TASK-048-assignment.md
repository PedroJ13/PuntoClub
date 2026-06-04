# TASK-048 - Validar flujo publicado clientes + registrar compra

## Equipo

QA

## Contexto

TASK-047 debe ajustar el frontend publicado segun hallazgos de PO Test.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Validar que el flujo publicado permita pasar de buscar/crear cliente a registrar compra sin friccion y sin regresiones P0/P1.

## Alcance

- Confirmar que al abrir la pagina no carga/busca clientes automaticamente.
- Buscar cliente existente.
- Confirmar que la tarjeta muestra puntos acumulados.
- Confirmar boton `Registrar compra` en cliente.
- Registrar compra para cliente existente.
- Confirmar que los puntos se actualizan despues de la compra.
- Crear cliente nuevo.
- Confirmar que despues de crearlo se puede registrar compra de ese cliente sin volver a buscar.
- Intentar crear un cliente duplicado.
- Confirmar mensaje claro de duplicado.
- Confirmar que el flujo lleva al registro de compra del cliente existente cuando sea posible.
- Validar errores de compra:
  - factura requerida.
  - monto requerido/mayor que cero.
  - factura duplicada si es facil reproducir sin ensuciar demasiado.
- Probar desktop/mobile basico.

## No tocar

- No implementar cambios.
- No crear recursos Azure.
- No cambiar datos sensibles.
- No probar redenciones salvo que aparezcan por accidente.

## Dependencias

- TASK-047 completada y publicada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-048-HANDOFF.md
```

Incluye:

- Resultado aprobado/no aprobado.
- URL probada.
- Checks ejecutados.
- Hallazgos P0/P1 con pasos reproducibles.
- Observaciones P2/P3 si aparecen.
- Si queda listo para PO Test, indicarlo explicitamente.
