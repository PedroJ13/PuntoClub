# QA Test Plan

## Estado

Checklist ejecutable inicial preparado por QA para cierre MVP.

## Objetivo

Validar que una empresa piloto pueda registrar clientes, compras, puntos y redenciones de forma confiable, con foco en integridad de datos y operacion basica.

## Datos de prueba minimos

### Empresa piloto

- `companyId`: 1
- Nombre: Cafe Central
- Estado: active
- Porcentaje de puntos: 5.00

### Clientes

- Cliente A:
  - Nombre: Maria Soto
  - Telefono: +50688887777
  - Email: maria@example.com
- Cliente B:
  - Nombre: Carlos Mora
  - Telefono: +50677776666
  - Email: carlos@example.com

### Compras

- Compra A1:
  - Cliente: Maria Soto
  - Factura: FAC-1001
  - Fecha: 2026-06-02
  - Monto: 25000.00
  - Puntos esperados con 5%: 1250
- Compra A2:
  - Cliente: Maria Soto
  - Factura: FAC-1002
  - Fecha: 2026-06-02
  - Monto: 10000.00
  - Puntos esperados con 5%: 500

### Redenciones

- Redencion valida:
  - Cliente: Maria Soto
  - Fecha: 2026-06-02
  - Puntos: 500
  - Saldo esperado despues de Compra A1: 750
- Redencion invalida:
  - Cliente: Maria Soto
  - Fecha: 2026-06-02
  - Puntos: 999999
  - Resultado esperado: rechazada por saldo insuficiente

## Checklist MVP

### 1. Registrar cliente

- [ ] Happy path: crear Cliente A con nombre, telefono y email validos.
- [ ] Confirmar que la respuesta o pantalla muestra el cliente creado con sus datos correctos.
- [ ] Consultar/buscar Cliente A y confirmar que aparece solo dentro de la empresa piloto.
- [ ] Caso negativo: intentar crear otro cliente con el mismo telefono dentro de la misma empresa.
- [ ] Caso negativo: intentar crear otro cliente con el mismo email dentro de la misma empresa.
- [ ] Caso negativo: intentar crear cliente sin nombre.
- [ ] Caso negativo: intentar crear cliente sin telefono.
- [ ] Caso negativo: intentar crear cliente con email invalido.

Severidad esperada:

- P1 si no se puede crear un cliente valido.
- P1 si se permite duplicar telefono o email dentro de la misma empresa.
- P2 si el error existe pero el mensaje no es claro para la persona usuaria.

Requiere API/SQL listos:

- API `POST /api/companies/{companyId}/customers`.
- Validacion de duplicados por empresa.
- SQL con unicidad de telefono/email por empresa.

### 2. Registrar cliente y compra en el mismo flujo

- [ ] Happy path: crear Cliente B y registrar una compra asociada en el mismo flujo operativo.
- [ ] Confirmar que la compra queda asociada al cliente correcto.
- [ ] Confirmar que los puntos ganados se calculan desde el porcentaje de la empresa.
- [ ] Confirmar que el saldo del cliente se actualiza despues de registrar la compra.
- [ ] Caso negativo: intentar completar el flujo con monto de compra 0.
- [ ] Caso negativo: intentar completar el flujo sin numero de factura.

Severidad esperada:

- P1 si el flujo no permite registrar cliente y compra cuando la pantalla lo ofrezca como operacion principal.
- P0 si la compra se registra con cliente incorrecto, empresa incorrecta o saldo incorrecto grave.
- P1 si se acepta monto 0 o factura vacia.

Requiere API/SQL listos:

- API de clientes y compras.
- Calculo server-side de puntos.
- Persistencia de cliente y compra.

### 3. Registrar compra para cliente existente

- [ ] Happy path: registrar Compra A1 para Cliente A.
- [ ] Confirmar factura, fecha, monto y puntos ganados.
- [ ] Confirmar que el frontend no permite editar/enviar manualmente `pointsEarned`.
- [ ] Confirmar que los puntos se calculan con la configuracion de la empresa.
- [ ] Caso negativo: intentar registrar compra con cliente inexistente.
- [ ] Caso negativo: intentar registrar compra con monto negativo.
- [ ] Caso negativo: intentar registrar compra sin fecha.

Severidad esperada:

- P1 si no se puede registrar una compra valida.
- P0 si los puntos ganados se calculan mal de forma que altera saldo real.
- P1 si se permite compra con cliente inexistente o monto no positivo.

Requiere API/SQL listos:

- API `POST /api/companies/{companyId}/purchases`.
- Validacion de pertenencia cliente-empresa.
- Regla de redondeo de puntos confirmada o documentada como pendiente.

### 4. Impedir factura duplicada

- [ ] Precondicion: Compra A1 registrada con factura FAC-1001.
- [ ] Caso negativo: intentar registrar otra compra con factura FAC-1001 dentro de la misma empresa.
- [ ] Confirmar que la compra duplicada no queda registrada.
- [ ] Confirmar que el saldo no cambia despues del intento duplicado.
- [ ] Confirmar error esperado: `409 DUPLICATE_INVOICE` en API o mensaje equivalente en UI.
- [ ] Confirmar que una factura distinta, FAC-1002, si puede registrarse.

Severidad esperada:

- P0 si una factura duplicada modifica saldo o duplica puntos.
- P1 si se permite factura duplicada aunque el saldo parezca correcto.
- P2 si se rechaza correctamente pero el mensaje no permite entender el problema.

Requiere API/SQL listos:

- Indice unico `UX_Purchases_company_invoice`.
- API debe responder `409 DUPLICATE_INVOICE`.

### 5. Consultar saldo

- [ ] Precondicion: Cliente A tiene Compra A1 registrada.
- [ ] Consultar saldo de Cliente A.
- [ ] Confirmar `pointsEarned = 1250`, `pointsRedeemed = 0`, `pointsBalance = 1250`.
- [ ] Registrar redencion valida de 500 puntos.
- [ ] Consultar saldo nuevamente.
- [ ] Confirmar `pointsEarned = 1250`, `pointsRedeemed = 500`, `pointsBalance = 750`.
- [ ] Caso negativo: consultar saldo de cliente inexistente.

Severidad esperada:

- P0 si el saldo mostrado no coincide con compras menos redenciones.
- P1 si no se puede consultar saldo de un cliente existente.
- P1 si se muestra saldo de cliente de otra empresa.

Requiere API/SQL listos:

- API `GET /api/companies/{companyId}/customers/{customerId}/balance`.
- Vista o consulta `dbo.CustomerPointBalances`.
- Separacion de datos por empresa.

### 6. Redimir puntos

- [ ] Precondicion: Cliente A tiene saldo disponible de 1250 puntos.
- [ ] Happy path: registrar redencion valida de 500 puntos.
- [ ] Confirmar que la redencion se guarda con fecha, puntos y nota.
- [ ] Confirmar que el saldo baja a 750 puntos.
- [ ] Confirmar que la redencion aparece en historial.
- [ ] Caso negativo: intentar redimir 0 puntos.
- [ ] Caso negativo: intentar redimir puntos negativos.
- [ ] Caso negativo: intentar redimir para cliente inexistente.

Severidad esperada:

- P1 si no se puede registrar una redencion valida.
- P0 si una redencion valida no descuenta saldo correctamente.
- P1 si se aceptan puntos 0, negativos o cliente inexistente.

Requiere API/SQL listos:

- API `POST /api/companies/{companyId}/redemptions`.
- Validacion de saldo y cliente-empresa.
- Transaccion o procedimiento equivalente a `dbo.RegisterRedemption`.

### 7. Impedir redencion mayor al saldo

- [ ] Precondicion: Cliente A tiene saldo conocido.
- [ ] Caso negativo: intentar redimir mas puntos que el saldo disponible.
- [ ] Confirmar que la redencion no queda registrada.
- [ ] Confirmar que el saldo no cambia.
- [ ] Confirmar error esperado: `409 INSUFFICIENT_POINTS` en API o mensaje equivalente en UI.
- [ ] Repetir el intento despues de consultar saldo para descartar errores de estado visual.

Severidad esperada:

- P0 si se permite saldo negativo o redencion mayor al saldo.
- P1 si se bloquea el flujo completo de redencion por error.
- P2 si el rechazo funciona pero el mensaje no explica saldo insuficiente.

Requiere API/SQL listos:

- Validacion consistente de saldo.
- `dbo.CustomerPointBalances`.
- `dbo.RegisterRedemption` o transaccion equivalente para evitar inconsistencias.

### 8. Buscar cliente

- [ ] Buscar Cliente A por telefono completo.
- [ ] Buscar Cliente A por nombre parcial.
- [ ] Buscar Cliente A por email completo.
- [ ] Confirmar que los resultados muestran nombre, telefono y email correctos.
- [ ] Confirmar que seleccionar un resultado permite consultar saldo o registrar compra/redencion.
- [ ] Caso negativo: buscar texto sin coincidencias.
- [ ] Caso negativo: buscar con espacios antes/despues del texto.

Severidad esperada:

- P1 si no se puede encontrar un cliente existente por ningun criterio.
- P2 si falla solo un criterio de busqueda pero existe workaround.
- P2 si los resultados son ambiguos o no permiten seleccionar correctamente.

Requiere API/SQL listos:

- API `GET /api/companies/{companyId}/customers?search={text}`.
- Busqueda por nombre, telefono o email.
- Separacion de resultados por empresa.

### 9. Revisar historial

- [ ] Precondicion: Cliente A tiene al menos una compra y una redencion.
- [ ] Abrir historial resumido de Cliente A.
- [ ] Confirmar que muestra compras con fecha, factura, monto y puntos positivos.
- [ ] Confirmar que muestra redenciones con fecha, nota y puntos negativos.
- [ ] Confirmar que el balance del historial coincide con el saldo consultado.
- [ ] Confirmar orden descendente por fecha y creacion/id cuando aplique.
- [ ] Caso negativo: revisar historial de cliente sin movimientos.
- [ ] Caso negativo: revisar historial de cliente inexistente.

Severidad esperada:

- P1 si no se puede ver historial de un cliente con movimientos.
- P0 si el historial mezcla datos de otra empresa o cliente.
- P1 si el historial contradice el saldo.
- P2 si el orden es confuso pero los datos son correctos.

Requiere API/SQL listos:

- API `GET /api/companies/{companyId}/customers/{customerId}/activity`.
- Consulta combinada de compras y redenciones.
- Separacion por empresa y cliente.

## Pruebas transversales

### Integridad multiempresa

- [ ] Intentar consultar cliente de otra empresa usando `companyId` distinto.
- [ ] Intentar registrar compra/redencion para cliente que no pertenece a la empresa del path.
- [ ] Confirmar que no se exponen datos entre empresas.

Severidad esperada:

- P0 si se exponen o modifican datos de otra empresa.

Requiere API/SQL listos:

- Validacion server-side de `companyId`.
- FK o validacion compuesta empresa-cliente.

### Responsive y operacion basica

- [ ] Ejecutar registrar cliente en desktop.
- [ ] Ejecutar registrar compra en desktop.
- [ ] Ejecutar consultar saldo e historial en desktop.
- [ ] Ejecutar buscar cliente en mobile.
- [ ] Ejecutar redencion en mobile.
- [ ] Confirmar que formularios, botones, errores y tablas/listas no se cortan ni se traslapan.

Severidad esperada:

- P1 si un flujo principal no puede completarse en un viewport necesario para piloto.
- P2 si hay degradacion visual con workaround.
- P3 si es solo pulido menor.

Requiere API/SQL listos:

- No para revision visual estatica.
- Si para ejecutar flujos completos end-to-end.

## Criterios de aprobacion QA

- No queda ningun P0/P1 abierto en flujos criticos MVP.
- Facturas duplicadas no alteran compras ni saldos.
- Redenciones mayores al saldo no alteran historial ni saldo.
- Saldo mostrado coincide con compras menos redenciones.
- Busqueda e historial respetan separacion por empresa.
- Los casos negativos muestran errores comprensibles o al menos accionables.

## Pendientes que QA no puede cerrar sin decision/implementacion

- Auth fase 1 y fuente confiable de `companyId`.
- Tratamiento visible de empresa inactiva en UI, aunque API debe responder no disponible/no encontrada.
- API implementada.
- SQL implementado con restricciones, vistas/procedimientos y seeds de prueba.
