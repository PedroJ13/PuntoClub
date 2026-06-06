# PO Test - Flujo Clientes + Compra + Redencion

## Estado

Listo para prueba de Product Owner en ambiente publicado.

QA aprobo la regresion MVP publicada en TASK-081, sin P0/P1. QA tambien aprobo la correccion final de copy/estado en TASK-085, sin P0/P1/P2/P3.

## Flujo a probar

Clientes - buscar/listar, registrar cliente, registrar compra, redimir puntos y revisar historial.

## Alcance

- Buscar clientes existentes.
- Confirmar puntos acumulados visibles.
- Revisar historial resumido de compras y redenciones.
- Registrar compra para cliente existente.
- Redimir puntos para cliente existente con saldo.
- Registrar un cliente nuevo.
- Registrar compra para el cliente recien creado.
- Redimir parte de los puntos del cliente recien creado.
- Intentar registrar duplicado.
- Confirmar que el duplicado abre el registro de compra del cliente existente.
- Ver validaciones de campos requeridos.
- Ver validaciones de compra.
- Ver validaciones de redencion.
- Ver error de saldo insuficiente.

## Ambiente

URL publica:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

La API estable ya esta disponible en Azure Functions.

Valores esperados:

```text
Frontend local: http://127.0.0.1:4173
Frontend local alternativo: http://127.0.0.1:4175
Frontend publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
API local: http://localhost:7071/api
API estable: https://func-puntoclub-prod-br-001.azurewebsites.net/api
Company ID: 1
```

## Antes de probar

Confirmar con Product / Architect / Release o Backend/API que:

- La URL publicada carga Punto Club, no la pagina default de Azure Static Web Apps.
- El indicador muestra `API real`.
- No hay P0/P1 abiertos en TASK-081.
- No hay P2/P3 abiertos conocidos despues de TASK-085.

## Checklist PO

- [ ] Abrir la UI.
- [ ] Confirmar que la pantalla carga sin error critico.
- [ ] Confirmar que indica fuente `API real`.
- [ ] Confirmar que no carga clientes automaticamente al abrir.
- [ ] Confirmar que la pantalla muestra los paneles `Buscar cliente`, `Registrar cliente`, `Resultados` y `Operacion`.
- [ ] Confirmar que no aparece ningun texto `Zona` o `zona`.
- [ ] Confirmar que no hay menu/tabs como flujo principal.
- [ ] Confirmar que el foco inicial esta en buscar.
- [ ] Buscar un cliente existente.
- [ ] Confirmar que resultados muestra nombre, telefono/email, `Pts.` y acciones.
- [ ] Abrir `Historial` desde un resultado.
- [ ] Confirmar que historial muestra ganados, redimidos, actuales y movimientos.
- [ ] Usar `Compra` desde un resultado.
- [ ] Registrar compra con factura, fecha y monto.
- [ ] Confirmar mensaje de compra registrada, puntos actualizados y foco de vuelta a buscar.
- [ ] Usar `Redimir` desde un resultado con puntos.
- [ ] Redimir una cantidad menor o igual al saldo.
- [ ] Confirmar mensaje de canje registrado, puntos actualizados y foco de vuelta a buscar.
- [ ] Intentar redimir mas puntos que el saldo.
- [ ] Confirmar mensaje claro de saldo insuficiente.
- [ ] Buscar un cliente inexistente.
- [ ] Confirmar que pasa foco/mensaje hacia registro.
- [ ] Confirmar que el mensaje sin resultados no menciona zonas.
- [ ] Registrar un cliente nuevo con nombre, telefono y email.
- [ ] Confirmar que despues de registrar cliente aparece/queda seleccionado en resultados.
- [ ] Registrar compra para ese cliente nuevo.
- [ ] Redimir parte de los puntos del cliente nuevo.
- [ ] Intentar registrar otro cliente con el mismo telefono.
- [ ] Confirmar que aparece mensaje de duplicado entendible.
- [ ] Confirmar que el duplicado busca/selecciona el cliente existente.
- [ ] Confirmar que el mensaje de duplicado no queda persistente al abrir compra, historial o redencion.
- [ ] Intentar registrar cliente sin nombre.
- [ ] Intentar registrar cliente sin telefono.
- [ ] Confirmar que los errores de campos son claros.
- [ ] Intentar compra sin factura.
- [ ] Intentar compra con monto `0`.
- [ ] Confirmar que los errores de compra son claros.
- [ ] Intentar redencion sin puntos.
- [ ] Intentar redencion con puntos `0`.
- [ ] Confirmar que los errores de redencion son claros.
- [ ] Confirmar historial final con compra y redencion.
- [ ] Probar en desktop.
- [ ] Probar en mobile o ventana estrecha.

## Resultado esperado

- El cliente nuevo se registra correctamente.
- La busqueda encuentra clientes reales.
- Los puntos acumulados son visibles.
- Una compra se registra correctamente para cliente existente.
- Una compra se registra correctamente despues de crear cliente.
- Una redencion se registra correctamente para cliente con saldo.
- El historial muestra compra y redencion del cliente.
- El saldo se descuenta correctamente despues de redimir.
- Saldo insuficiente se bloquea con mensaje claro.
- La pantalla por zonas evita buscar formularios apilados con scroll.
- El duplicado muestra mensaje claro y permite continuar hacia compra del existente cuando aplica.
- Los campos requeridos muestran errores claros.
- Los errores de compra muestran mensajes claros.
- Los errores de redencion muestran mensajes claros.
- La UI no se rompe visualmente en desktop ni mobile.

## Fuera de alcance

- Login/auth real.
- Cambios de configuracion Azure.

## Ambiente alternativo local

Si la URL publicada tuviera una interrupcion temporal, se puede repetir el flujo en UI local contra API estable usando `http://127.0.0.1:4175`, siempre que CORS siga permitido para ese origen.

## Como reportar hallazgos

Usar este formato:

```text
PO Test - Hallazgo
Flujo:
Paso:
Resultado esperado:
Resultado observado:
Severidad sugerida:
Captura o nota:
```

Severidad sugerida:

- P1: no permite buscar o registrar cliente.
- P1: no permite registrar compra para cliente existente o nuevo.
- P1: no permite redimir puntos con saldo suficiente.
- P1: permite duplicado evidente.
- P1: puntos no se actualizan despues de compra.
- P1: puntos no se descuentan despues de redencion.
- P1: permite redimir mas puntos que el saldo.
- P2: mensaje confuso pero hay workaround.
- P3: detalle visual o copy menor.
