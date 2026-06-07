# TASK-086 - Handoff PO Test

## Estado

Guion de piloto operativo preparado.

## Objetivo

Ejecutar una sesion piloto real/controlada con una empresa o usuario operador para validar si el MVP publicado funciona como flujo operativo de caja: buscar cliente, registrar cliente, bloquear duplicados, registrar compra, redimir puntos y revisar historial.

## Ambiente del piloto

```text
Frontend publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Company ID: 1
Runbook operativo: docs/PILOT_RUNBOOK.md
```

## Checklist de preparacion

Ejecutar 10 a 15 minutos antes de la sesion.

- [ ] Confirmar con Product quien sera el operador de prueba.
- [ ] Confirmar si se usaran datos ficticios o datos acordados con la empresa.
- [ ] Abrir `docs/PILOT_RUNBOOK.md`.
- [ ] Abrir el frontend publicado.
- [ ] Confirmar que carga Punto Club.
- [ ] Confirmar que la UI muestra `API real`.
- [ ] Confirmar que SQL esta `Online`.
- [ ] Confirmar que el endpoint `/api/companies/1/settings` responde `200`.
- [ ] Ejecutar una busqueda simple desde la UI.
- [ ] Confirmar que no hay errores criticos, `500` persistente ni error CORS visible.
- [ ] Tener listo un canal para capturas o notas.
- [ ] Tener listo el formato de hallazgos de este documento.

## Datos recomendados

Usar datos ficticios si no hay aprobacion explicita para usar datos reales de negocio.

```text
Cliente nuevo:
Nombre: Cliente Piloto 086
Telefono: 8888-0860
Email: piloto086@example.com

Factura/comprobante:
PC-086-001

Monto de compra:
10000

Puntos a redimir:
100
```

Notas:

- Si el telefono o factura ya existen, cambiar solo el sufijo numerico y anotarlo.
- No usar informacion sensible o real sin aprobacion previa.
- Mantener la prueba dentro de `Company ID: 1` salvo instruccion distinta de Product / Architect / Release.

## Guion final de sesion piloto

### 1. Apertura

- Explicar al operador que se esta probando el flujo operativo, no su desempeno.
- Pedirle que piense en voz alta mientras usa el sistema.
- Indicar que las dudas, pausas y errores son hallazgos utiles.
- Confirmar que se puede tomar nota o captura de pantalla si aparece un problema.

### 2. Calentamiento tecnico

- Ejecutar el checklist de preparacion.
- Si SQL esta `Paused` o `Resuming`, seguir `docs/PILOT_RUNBOOK.md`.
- Si aparece un `500` persistente, CORS o SQL no llega a `Online`, detener la sesion y reportar como P1/P2 segun corresponda.

### 3. Busqueda de cliente existente

- Pedir al operador buscar un cliente existente.
- Observar si entiende donde buscar.
- Confirmar que la lista muestra informacion suficiente para identificar al cliente.
- Preguntar si el resultado se parece a lo que esperaria usar en caja.

Resultado esperado:

- La busqueda responde sin error critico.
- El operador puede identificar un cliente por nombre, telefono o email.

### 4. Registro de cliente nuevo

- Pedir al operador registrar el cliente de prueba.
- Usar nombre, telefono y email definidos en datos recomendados.
- Observar si encuentra la accion de registro sin ayuda.
- Confirmar que aparece mensaje de exito.

Resultado esperado:

- El cliente se registra correctamente.
- El mensaje de exito es claro.
- El operador entiende que puede continuar con el flujo.

### 5. Busqueda del cliente creado

- Pedir al operador buscar el cliente recien creado por telefono.
- Confirmar que aparece el cliente correcto.
- Validar que los datos visibles permitan reconocerlo.

Resultado esperado:

- El cliente creado aparece en resultados.
- No hay confusion con clientes similares.

### 6. Duplicado

- Pedir al operador intentar registrar otro cliente con el mismo telefono.
- Mantener los demas datos iguales o cambiar el nombre levemente.
- Observar si el mensaje explica el problema.

Resultado esperado:

- El duplicado se bloquea.
- El error es entendible para un usuario operativo.
- El operador sabe como corregir o cancelar.

### 7. Compra

- Pedir al operador registrar una compra para el cliente piloto.
- Usar la factura/comprobante y monto recomendados.
- Observar si el operador entiende que el comprobante debe ser unico.
- Confirmar que la compra queda registrada.

Resultado esperado:

- La compra se registra sin error.
- Los puntos se calculan y se reflejan segun la configuracion vigente.
- El operador entiende el resultado de la accion.

### 8. Redencion

- Pedir al operador redimir una cantidad valida de puntos.
- Usar los puntos recomendados o una cantidad menor al saldo disponible.
- Observar si el saldo disponible esta claro antes de confirmar.
- Confirmar que no permite redimir mas de lo disponible si se prueba ese caso.

Resultado esperado:

- La redencion valida se registra correctamente.
- El saldo se actualiza.
- Una redencion mayor al saldo se bloquea con mensaje claro.

### 9. Historial

- Pedir al operador revisar el historial del cliente.
- Validar si encuentra la compra y la redencion.
- Preguntar si el historial le sirve para explicar el saldo a un cliente final.

Resultado esperado:

- El historial muestra actividad relevante.
- Compra, puntos y redencion son comprensibles.
- El operador puede reconstruir que paso con el cliente.

### 10. Cierre

- Hacer las preguntas de observacion.
- Confirmar si el operador usaria este flujo en una situacion real de caja.
- Registrar hallazgos con severidad sugerida.
- Separar problemas bloqueantes de mejoras de copy o ergonomia.

## Preguntas de observacion

- Que parte del flujo entendio mas facil?
- Donde dudo o necesito ayuda?
- Que texto, boton o accion le confundio?
- El flujo se parece a como atenderia una compra real en caja?
- Que informacion le falto para confiar en el saldo o historial?
- Que paso le parecio lento, repetitivo o riesgoso?
- Que cambiaria antes de usarlo todos los dias?
- Que datos necesita ver para resolver una consulta de un cliente final?
- El mensaje de duplicado le dice claramente que hacer?
- La redencion se siente segura antes de confirmar?

## Formato de reporte de hallazgos

```text
PO Test - Hallazgo
Flujo:
Paso:
Resultado esperado:
Resultado observado:
Severidad sugerida:
Nota/captura:
```

Severidad sugerida:

- P1: bloquea buscar cliente, registrar cliente, registrar compra o redimir.
- P1: permite duplicado evidente o saldo invalido.
- P2: flujo funciona, pero el operador queda confundido o necesita ayuda.
- P2: historial, saldo o puntos no son suficientemente claros para operar.
- P3: detalle visual, copy menor o mejora de comodidad.

## Riesgos y datos que Product debe preparar

- Definir si la sesion usara datos ficticios o datos reales autorizados.
- Confirmar con la empresa piloto que no se ingresaran datos sensibles sin permiso.
- Preparar al menos un cliente existente para busqueda inicial.
- Preparar telefono y factura que no choquen con pruebas anteriores.
- Tener claro el porcentaje de puntos configurado para explicar el calculo.
- Acordar quien tomara notas y quien guiara la sesion.
- Tener ventana de soporte disponible por si API, SQL o CORS fallan.
- No cambiar firewall, SKU, app settings ni datos fuera de la prueba acordada durante la sesion.

## Criterio de cierre

La tarea queda lista cuando Product tiene:

- guion de sesion piloto;
- checklist de preparacion;
- datos recomendados;
- preguntas de observacion;
- formato de reporte;
- riesgos previos a coordinar antes de ejecutar el piloto.
