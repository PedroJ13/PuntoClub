# PO Test - Flujo Clientes

## Estado

Listo para prueba de Product Owner en ambiente publicado.

Web Dev / QA aprobo el flujo publicado en TASK-046, sin P0/P1.

## Flujo a probar

Clientes - buscar/listar y registrar cliente.

## Alcance

- Buscar clientes existentes.
- Registrar un cliente nuevo.
- Buscar el cliente recien creado.
- Intentar registrar duplicado.
- Ver validaciones de campos requeridos.

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
- No hay P0/P1 abiertos en TASK-046.

## Checklist PO

- [ ] Abrir la UI.
- [ ] Confirmar que la pantalla carga sin error critico.
- [ ] Confirmar que indica fuente `API real`.
- [ ] Buscar un cliente existente.
- [ ] Confirmar que la lista muestra nombre, telefono y email.
- [ ] Registrar un cliente nuevo con nombre, telefono y email.
- [ ] Confirmar mensaje de registro exitoso.
- [ ] Buscar por telefono el cliente creado.
- [ ] Intentar registrar otro cliente con el mismo telefono.
- [ ] Confirmar que aparece error de duplicado entendible.
- [ ] Intentar registrar cliente sin nombre.
- [ ] Intentar registrar cliente sin telefono.
- [ ] Confirmar que los errores de campos son claros.
- [ ] Probar en desktop.
- [ ] Probar en mobile o ventana estrecha.

## Resultado esperado

- El cliente nuevo se registra correctamente.
- La busqueda encuentra clientes reales.
- El duplicado se bloquea con mensaje claro.
- Los campos requeridos muestran errores claros.
- La UI no se rompe visualmente en desktop ni mobile.

## Fuera de alcance

- Compras.
- Redenciones.
- Saldo.
- Historial.
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
- P1: permite duplicado evidente.
- P2: mensaje confuso pero hay workaround.
- P3: detalle visual o copy menor.
