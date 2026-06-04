# TASK-049 - Revalidar flujo publicado clientes + registrar compra despues del deploy

## Equipo

QA

## Contexto

TASK-047 implemento localmente los ajustes pedidos por PO Test:

- no buscar/listar clientes automaticamente al abrir;
- mostrar puntos acumulados en cada cliente;
- boton `Registrar compra` en cada cliente;
- panel de compra para cliente seleccionado;
- despues de crear cliente, permitir registrar compra;
- si el cliente ya existe, mostrar mensaje y abrir compra del cliente existente.

TASK-048 fallo porque la URL publicada todavia servia la UI anterior. Esta tarea repite QA despues de que los cambios de TASK-047 hayan sido commiteados y desplegados por Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Confirmar que el flujo publicado ya refleja TASK-047 y queda listo para PO Test del flujo cliente + compra.

## Alcance

- Confirmar que al abrir la pagina no carga/busca clientes automaticamente.
- Confirmar que el JS publicado ya no ejecuta `loadCustomers("")` al iniciar.
- Buscar cliente existente.
- Confirmar que cada tarjeta muestra puntos acumulados.
- Confirmar boton `Registrar compra`.
- Registrar compra para cliente existente.
- Confirmar que los puntos se actualizan despues de la compra.
- Crear cliente nuevo.
- Confirmar que despues de crearlo se abre/permite registrar compra para ese cliente.
- Intentar crear cliente duplicado.
- Confirmar mensaje claro y apertura de compra del cliente existente cuando sea posible.
- Validar errores de compra:
  - factura requerida;
  - monto requerido/mayor que cero;
  - factura duplicada si es facil reproducir sin ensuciar demasiado.
- Probar desktop/mobile basico.

## No tocar

- No implementar cambios.
- No crear recursos Azure.
- No cambiar secretos.
- No probar redenciones salvo que aparezcan por accidente.

## Dependencias

- Commit/deploy de TASK-047 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-049-HANDOFF.md
```

Incluye:

- Resultado aprobado/no aprobado.
- URL probada.
- Checks ejecutados.
- Evidencia de que el frontend publicado refleja TASK-047.
- Hallazgos P0/P1 con pasos reproducibles.
- Observaciones P2/P3 si aparecen.
- Si queda listo para PO Test, indicarlo explicitamente.
