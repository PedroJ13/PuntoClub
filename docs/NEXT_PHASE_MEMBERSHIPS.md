# Siguiente fase - Membresias como tipo de fidelizacion

## Proposito

Documento para Product / Architect / Release.

Punto Club ya tiene fidelizacion por puntos basada en porcentaje de compra. La nueva direccion es agregar fidelizacion por membresias, permitiendo que una empresa use uno o mas tipos de fidelizacion:

- Puntos.
- Membresias.

Este documento propone alcance, modelo conceptual y una recomendacion para implementar el caso real del Product Owner sin encerrar el producto en una solucion demasiado especifica.

## Lectura ejecutiva

La membresia no debe modelarse como muchos puntos ni como muchas membresias internas por cada beneficio diario.

La recomendacion es modelar:

1. Una membresia principal adquirida por el cliente.
2. Beneficios configurables dentro de esa membresia.
3. Reglas de uso por beneficio.
4. Un historial de usos/canje de beneficios.

Asi se soporta el caso del Product Owner:

- Membresia mensual.
- 15% descuento en pasteles.
- 15% descuento en dulces.
- 1 cafe americano gratis por dia.

Sin crear 30 membresias internas para los cafes. El cafe diario se controla como un beneficio con limite de uso por periodo.

## Decision de alcance actual

Estado definido por Product / Architect / Release:

- Prioridad: P2 recomendable, pero avanzando como siguiente bloque funcional luego de empresa/multiempresa.
- MVP de membresias: debe registrar usos de beneficios controlables; no basta con informar beneficios.
- Aviso de vencimiento por correo: diferido. Para MVP se mantiene alerta/consulta interna.
- Una sola membresia activa por cliente/empresa en MVP.
- Renovacion antes de vencimiento: diferida hasta que exista flujo de renovacion.
- Descuentos sin limite: se muestran como disponibles y pueden registrar eventos de uso, sin bloquear por cantidad.

## Estado de avance

Ya completado/publicado tecnicamente:

- Configuracion de planes de membresia.
- Configuracion de beneficios.
- Activacion/consulta de membresia de cliente.
- Registro/consulta de usos de beneficios de membresia.

Observacion pendiente:

- QA aprobo publicacion con observaciones porque falta prueba positiva real con sesion para activacion y uso de beneficios.
- Esa prueba no bloquea la publicacion tecnica, pero si debe hacerse antes de cerrar el flujo como listo para piloto operativo completo.

Bloque en curso despues de registro de usos:

- Exponer eventos de membresias en reportes/auditoria.
- Asegurar que CSV incluya actividad de membresias cuando aplique.
- Validar que activaciones y beneficios usados sean trazables para operacion.

## Cambio de producto

### Registro de empresas

Cuando una empresa solicita acceso, debe poder indicar que tipos de fidelizacion quiere:

- Puntos.
- Membresias.

Puede seleccionar mas de uno.

En el panel interno de aprobacion, el administrador debe poder aprobar los tipos de fidelizacion habilitados para esa empresa.

Ejemplo:

```text
Empresa solicita:
- Puntos
- Membresias

Admin aprueba:
- Puntos: aprobado
- Membresias: aprobado
```

O:

```text
Empresa solicita:
- Puntos
- Membresias

Admin aprueba:
- Puntos: aprobado
- Membresias: pendiente/no aprobado
```

## Cambio de menu

El menu actual debe evolucionar porque `Operaciones` ya no representa un unico flujo.

Propuesta:

- Caja
  - Puntos
  - Membresias
- Mi empresa
  - Configuracion
  - Logo
  - Tipos de fidelizacion habilitados
- Reportes
  - Puntos
  - Membresias
  - Auditoria
- Admin empresas

Alternativa mas simple para MVP:

- Puntos
- Membresias
- Mi empresa
- Reportes
- Admin empresas

Recomendacion UX: usar nombres directos para el empleado. Evitar que `Operaciones` sea un contenedor ambiguo si van a existir varios modulos de fidelizacion.

## Como funcionan las membresias

Una empresa puede crear varias membresias.

Cada membresia tiene:

- nombre
- descripcion
- duracion en dias
- costo
- estado: activa/inactiva
- beneficios incluidos

Cada beneficio puede ser informativo o controlable por el sistema.

### Beneficio informativo

Sirve para comunicar al empleado que debe ofrecer o explicar algo al cliente.

Ejemplo:

- "Incluye asesoria mensual."
- "Incluye prioridad en reservaciones."

El sistema lo muestra, pero no controla consumo.

### Beneficio controlable

El sistema puede validar si el cliente aun puede usarlo.

Ejemplos:

- 15% descuento en pasteles mientras la membresia este activa.
- 1 cafe americano gratis por dia.
- 2 clases gratis por semana.
- 1 servicio de limpieza al mes.

## Modelo conceptual recomendado

### MembershipPlans

Define el producto de membresia que vende la empresa.

Campos sugeridos:

- id
- company_id
- name
- description
- duration_days
- price
- status
- renewal_notice_days
- created_at
- updated_at

### MembershipBenefits

Define que incluye una membresia.

Campos sugeridos:

- id
- company_id
- membership_plan_id
- name
- description
- benefit_type
- applies_to_type
- applies_to_name
- discount_percent
- included_quantity
- usage_limit
- usage_period
- status

Valores sugeridos:

```text
benefit_type:
- informational
- discount
- allowance
- free_item

applies_to_type:
- product
- service
- category
- text

usage_period:
- none
- day
- week
- month
- membership_term
```

### CustomerMemberships

Representa una membresia comprada/activada para un cliente.

Campos sugeridos:

- id
- company_id
- customer_id
- membership_plan_id
- start_date
- end_date
- status
- current_term_price
- last_payment_method
- created_at
- cancelled_at

Estados sugeridos:

- active
- expired
- cancelled

### MembershipTransactions

Registra la venta, renovacion o ajuste economico de una membresia.

No se recomienda guardar solo `price_paid` en `CustomerMemberships`, porque se pierde historial de renovaciones, metodos de pago y reportes diarios.

Campos sugeridos:

- id
- company_id
- customer_id
- customer_membership_id
- membership_plan_id
- transaction_type
- payment_method
- amount
- transaction_date
- note
- created_at
- created_by_label

Valores sugeridos:

```text
transaction_type:
- new_membership
- renewal
- adjustment
- cancellation

payment_method:
- cash
- card
- credit
- transfer
- other
```

Reglas:

- Al activar una membresia nueva, crear `MembershipTransactions.transaction_type = new_membership`.
- Al renovar, crear `MembershipTransactions.transaction_type = renewal`.
- `amount` debe ser mayor o igual que 0 segun regla de negocio.
- `payment_method` debe ser requerido para activacion y renovacion.
- Si se permite credito, definir si significa "pagado con credito" o "pendiente de pago". No mezclar ambos conceptos sin decision.

### MembershipBenefitUsages

Registra el uso/canje de beneficios controlables.

Campos sugeridos:

- id
- company_id
- customer_membership_id
- membership_benefit_id
- customer_id
- used_at
- usage_date
- quantity
- note
- created_by_label

Regla clave:

- Para beneficios con limite por dia, semana o mes, el sistema cuenta usos en el periodo correspondiente.
- No se crean membresias hijas para cada dia.

## Caso Product Owner

### Membresia mensual

Configuracion:

```text
Nombre: Membresia mensual
Duracion: 30 dias
Costo: definido por empresa
Aviso de vencimiento: configurable, por ejemplo 5 dias antes
```

Beneficios:

```text
Beneficio 1:
Tipo: discount
Nombre: 15% descuento en pasteles
Aplica a: categoria Pasteles
Descuento: 15%
Limite de uso: sin limite mientras la membresia este activa

Beneficio 2:
Tipo: discount
Nombre: 15% descuento en dulces
Aplica a: categoria Dulces
Descuento: 15%
Limite de uso: sin limite mientras la membresia este activa

Beneficio 3:
Tipo: free_item
Nombre: 1 cafe americano gratis al dia
Aplica a: producto Cafe americano
Cantidad incluida: 1
Periodo de uso: day
Limite: 1 por dia
```

### Como se valida el cafe diario

Cuando el cliente pide el cafe:

1. Se busca si tiene membresia activa.
2. Se busca el beneficio `Cafe americano gratis`.
3. Se revisa `MembershipBenefitUsages` para ese beneficio, cliente y fecha local.
4. Si ya uso 1 cafe ese dia, se muestra que el beneficio ya fue usado.
5. Si no lo uso, se registra el uso y se permite aplicar el beneficio.

Esto permite:

- No crear 30 mini membresias.
- Evitar multiples cafes gratis el mismo dia.
- Mantener historial de uso.
- Cambiar la regla en el futuro a semanal/mensual sin rehacer todo el modelo.

## Por que no crear 30 membresias internas

No recomendado.

Problemas:

- Duplica registros innecesarios.
- Complica renovaciones.
- Complica cancelaciones.
- Complica reportes.
- Complica cambios de duracion.
- Hace dificil explicar el modelo.

Mejor:

- Una membresia principal.
- Beneficios con reglas.
- Usos registrados en un ledger.

## Flujos principales

### Configuracion de membresias

Empleado/admin de empresa:

1. Entra a Membresias.
2. Crea plan de membresia.
3. Define nombre, duracion y costo.
4. Agrega beneficios.
5. Marca plan como activo.

### Venta/activacion de membresia

Empleado:

1. Busca o registra cliente.
2. Selecciona membresia.
3. Confirma costo, duracion y metodo de pago.
4. Activa membresia para el cliente.
5. Sistema registra transaccion de venta.
6. Sistema muestra fecha de vencimiento y beneficios.

Metodos de pago iniciales:

- Efectivo.
- Tarjeta.
- Credito.
- Transferencia.
- Otro.

### Renovacion de membresia

Empleado:

1. Busca cliente.
2. Sistema muestra membresia vencida o proxima a vencer.
3. Empleado selecciona renovar.
4. Confirma membresia, costo y metodo de pago.
5. Sistema extiende o reinicia vigencia segun regla definida.
6. Sistema registra transaccion de renovacion.

Decision requerida:

- Si el cliente renueva antes de vencer, la nueva vigencia empieza despues de la fecha de vencimiento actual o desde hoy?
- Recomendacion: si esta activa, extender desde `end_date`; si esta vencida, iniciar desde hoy.

### Cliente vuelve con membresia activa

Empleado:

1. Busca cliente.
2. Sistema muestra membresia activa.
3. Sistema muestra beneficios disponibles.
4. Si usa beneficio controlable, empleado registra uso.

### Cliente vuelve con membresia vencida

Empleado:

1. Busca cliente.
2. Sistema muestra membresia vencida.
3. Sistema sugiere renovar.

### Aviso de vencimiento

Sistema:

- Muestra alerta interna cuando faltan N dias.
- Envia correo al cliente si email esta disponible y si el envio de correos esta habilitado.

Para MVP, se puede empezar con alerta interna y dejar email automatico como segunda fase.

### Reporte diario de membresias

Debe existir un reporte por defecto del dia.

Objetivo:

- Que la empresa pueda ver rapidamente actividad diaria de membresias.

Resumen minimo:

- Cantidad de membresias nuevas.
- Cantidad de membresias renovadas.
- Monto total de membresias nuevas.
- Monto total de renovaciones.
- Monto total por metodo de pago.

Ejemplo:

```text
Reporte diario - Membresias
Fecha: 2026-06-13

Membresias nuevas: 8
Monto nuevas: 80,000

Renovaciones: 5
Monto renovaciones: 45,000

Monto por metodo de pago:
- Efectivo: 50,000
- Tarjeta: 60,000
- Credito: 15,000
- Transferencia: 0
- Otro: 0
```

Detalle sugerido:

- hora
- cliente
- membresia
- tipo: nueva/renovacion
- metodo de pago
- monto
- usuario/empleado si se registra

## Alcance recomendado

### Round 1 - Diseno funcional y modelo

Objetivo:

- Alinear UX, SQL, API y Product antes de implementar.

Incluye:

- Definir si membresias es `P1 pre-lanzamiento` o `P2 recomendable`.
- Definir modelo SQL.
- Definir contratos API.
- Definir pantallas y flujo operativo.
- Definir vocabulario: membresia, beneficio, uso de beneficio.

Estado:

- Completado mediante tareas de UX, SQL/Data y Backend/API de definicion inicial.

### Round 2 - Configuracion de membresias

Objetivo:

- Empresa puede crear planes y beneficios.

Incluye:

- CRUD simple de planes.
- CRUD simple de beneficios.
- Activar/inactivar plan.

Estado:

- Implementado y publicado.
- Validado tecnicamente por QA.

### Round 3 - Activar membresia a cliente

Objetivo:

- Cliente puede comprar/activar una membresia.

Incluye:

- Buscar/crear cliente.
- Seleccionar membresia.
- Activar por N dias.
- Registrar metodo de pago.
- Registrar transaccion de membresia nueva.
- Ver estado activa/vencida.

Estado:

- Implementado y publicado para activacion/consulta.
- La parte de transaccion economica/metodo de pago queda pendiente si se requiere cierre financiero de membresias.
- Falta prueba positiva real con sesion.

### Round 4 - Usar beneficios

Objetivo:

- Empleado puede consultar beneficios y registrar usos controlables.

Incluye:

- Mostrar beneficios informativos.
- Validar beneficio diario/semanal/mensual.
- Registrar uso.
- Mostrar beneficio ya usado.

Estado:

- Implementado y publicado.
- El API controla pertenencia al plan activo, estado del beneficio y limites por periodo.
- Falta prueba positiva real con sesion.

### Round 5 - Reportes y auditoria de membresias

Objetivo:

- Que la operacion pueda revisar actividad de membresias publicada.

Incluye:

- Eventos de activacion de membresia en reportes/auditoria.
- Eventos de uso de beneficio en reportes/auditoria.
- Textos legibles en Web:
  - `Membresia activada`
  - `Beneficio usado`
- CSV con actividad de membresias cuando aplique.

Tareas asociadas:

- `tasks/TASK-265-assignment.md`: API reportes/auditoria para eventos de membresias.
- `tasks/TASK-266-assignment.md`: Web reportes para eventos de membresias.
- `tasks/TASK-267-assignment.md`: QA reportes de membresias.

### Round 6 - Avisos internos y vencimientos

Objetivo:

- Operacion puede dar seguimiento.

Incluye:

- Alertas internas de vencimiento.
- Reporte de membresias activas/vencidas.
- Reporte diario por defecto de membresias nuevas/renovadas.
- Email de vencimiento queda diferido salvo decision explicita.

### Round 7 - Renovacion y transacciones economicas

Objetivo:

- Cerrar el ciclo comercial de membresias, no solo activarlas.

Incluye:

- Renovar membresia vencida o proxima a vencer.
- Definir regla de renovacion antes de vencimiento.
- Registrar metodo de pago.
- Registrar transaccion de membresia nueva/renovacion.
- Reporte diario con montos por metodo de pago.

## Decisiones necesarias

- La membresia dura N dias exactos o mes calendario?
- Que pasa si el cliente renueva antes de vencer?
  - Extiende desde fecha de vencimiento actual?
  - Reinicia desde hoy?
- Se permite mas de una membresia activa por cliente?
- Los beneficios son solo informativos en MVP o tambien se registran usos?
- Se registran pagos reales o solo activacion manual?
- Que metodos de pago se permitiran inicialmente?
- `Credito` significa forma de pago aceptada o saldo pendiente por cobrar?
- El reporte diario se calcula por fecha local de la empresa o UTC?
- Se permitiran membresias gratis/promocionales con monto 0?
- El uso de beneficios requiere factura/recibo?
- El aviso por correo entra en MVP o queda P2?
- La empresa puede editar una membresia ya vendida o solo crear nueva version?

## Recomendacion de MVP

Para una primera version robusta:

- Permitir multiples tipos de fidelizacion por empresa: puntos y membresias.
- Permitir configurar planes de membresia.
- Permitir configurar beneficios.
- Soportar beneficios informativos, descuentos y 1 uso por periodo.
- Activar membresia para cliente.
- Registrar metodo de pago al crear o renovar.
- Registrar transacciones de membresia para reporte diario.
- Ver membresia activa/vencida en la busqueda de cliente.
- Registrar uso de beneficios controlables.
- Incluir reporte diario default de membresias.
- Para email de vencimiento, empezar con alerta interna y diferir envio automatico si complica Infra/API.

## Recomendacion para Product / Architect / Release

- Tema: Agregar membresias como segundo tipo de fidelizacion.
- Motivo: El producto deja de ser solo puntos y empieza a soportar programas de fidelizacion mas ricos por empresa.
- Prioridad sugerida: P1 pre-lanzamiento si el caso del PO es real/proximo; P2 recomendable si primero se cerrara feedback visual/PO pendiente.
- Equipo sugerido: Product / Architect / Release primero; luego Diseno/UX, SQL DEV/Data, Backend/API, Web Dev y QA.
- Documento/tarea sugerida: Usar este documento para crear tareas de Round 1: modelo, UX y contratos antes de implementar.
- Riesgo si no se hace: Se puede implementar el caso del cafe diario de forma rigida, dificil de extender y costosa de mantener.

## Resumen de decision tecnica recomendada

No usar mini membresias internas.

Usar:

- `MembershipPlans`
- `MembershipBenefits`
- `CustomerMemberships`
- `MembershipTransactions`
- `MembershipBenefitUsages`

El beneficio de cafe diario se resuelve con:

```text
benefit_type = free_item
usage_period = day
usage_limit = 1
```

Esto permite proyectar el modelo a otros casos:

- 2 clases por semana.
- 1 servicio mensual.
- descuento ilimitado mientras la membresia este activa.
- beneficios solo informativos.
- combos de beneficios por plan.
