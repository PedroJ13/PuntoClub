# Siguiente fase - Flujo Cliente Primero

## Proposito

Documento para Product / Architect / Release.

La evolucion de Punto Club hacia puntos + membresias requiere ajustar la experiencia operativa para que el empleado no piense primero en el modulo, sino en el cliente que tiene enfrente.

La recomendacion es mover el flujo principal a:

```text
Cliente primero -> accion despues
```

## Lectura ejecutiva

Para puntos y membresias, el sistema necesita identificar primero al cliente:

- Si el cliente existe, se selecciona.
- Si no existe, se registra rapidamente.
- Luego se muestran sus puntos, membresias, alertas y acciones disponibles.

Desde esa ficha operativa se decide:

- registrar compra/puntos;
- activar membresia;
- renovar membresia;
- aplicar beneficio;
- ver historial.

Esto evita duplicar busquedas por modulo y mejora la experiencia para el empleado y el cliente final.

## Problema actual a resolver

Si el menu separa demasiado pronto entre `Puntos` y `Membresias`, el empleado debe decidir antes de identificar al cliente.

Eso genera friccion:

- puede buscar el mismo cliente en mas de un lugar;
- puede registrar primero una accion sin ver alertas importantes;
- puede no saber si el cliente ya tiene membresia activa;
- puede prometer un beneficio ya usado o vencido;
- puede no ver saldo de puntos y membresias en una sola vista.

## Principio UX recomendado

La pantalla de caja debe responder a esta pregunta:

```text
Tengo un cliente enfrente. Que puedo hacer con el?
```

No a esta:

```text
En que modulo tecnico entro primero?
```

## Menu recomendado

### Opcion recomendada

```text
Caja / Atender cliente
Mi empresa
Reportes
Admin empresas
```

Dentro de `Caja / Atender cliente`, las acciones se adaptan a los tipos de fidelizacion habilitados para la empresa.

### Acciones dentro de Atender cliente

Si la empresa tiene puntos:

- Registrar compra / puntos.
- Ver saldo de puntos.
- Ver historial de puntos.

Si la empresa tiene membresias:

- Activar membresia.
- Renovar membresia.
- Aplicar beneficio.
- Ver membresias activas/vencidas.
- Ver historial de membresias.

Si la empresa tiene ambos:

- Mostrar ambas secciones dentro de la ficha del cliente.

## Pantalla principal propuesta

Nombre sugerido:

```text
Atender cliente
```

Estructura:

```text
[ Buscar cliente por telefono, nombre o email ]

Resultados / Sin resultados

Si no existe:
[ Registrar cliente nuevo ]

Si hay cliente seleccionado:

Cliente
- Nombre
- Telefono
- Email

Resumen
- Puntos disponibles
- Membresias activas
- Alertas

Acciones rapidas
- Registrar compra / puntos
- Activar membresia
- Renovar membresia
- Aplicar beneficio
- Ver historial
```

## Flujo base

```text
1. Buscar cliente.
2. Seleccionar cliente existente o registrar cliente nuevo.
3. Mostrar ficha operativa del cliente.
4. Mostrar acciones disponibles segun fidelizaciones habilitadas.
5. Ejecutar accion.
6. Mostrar resultado y estado actualizado.
```

## Flujo de puntos

```text
Buscar cliente
-> Cliente existe o se registra
-> Registrar compra
-> Ingresar factura, fecha y monto
-> Sistema calcula puntos segun configuracion de empresa
-> Confirmar
-> Mostrar nuevo saldo
```

Reglas:

- La configuracion de puntos vive en `Mi empresa`.
- El empleado no debe configurar porcentaje desde caja.
- La compra debe mantener factura unica por empresa.

## Flujo de membresia nueva

```text
Buscar cliente
-> Cliente existe o se registra
-> Activar membresia
-> Mostrar membresias disponibles
-> Seleccionar membresia
-> Mostrar duracion, costo y beneficios
-> Seleccionar metodo de pago
-> Confirmar activacion
-> Mostrar fecha de vencimiento y beneficios
```

Datos visibles al seleccionar membresia:

- nombre;
- duracion;
- costo;
- beneficios incluidos;
- aviso de vencimiento si aplica.

## Flujo de cliente con membresia activa

Al seleccionar cliente, mostrar inmediatamente:

```text
Membresia: Membresia Mensual
Estado: Activa
Vence: YYYY-MM-DD
Beneficios:
- 15% descuento en pasteles
- 15% descuento en dulces
- Cafe americano gratis hoy: disponible / ya usado
```

Acciones:

- Aplicar beneficio.
- Renovar membresia.
- Ver historial.

## Flujo de aplicar beneficio

```text
Buscar cliente
-> Ver membresia activa
-> Aplicar beneficio
-> Seleccionar beneficio
-> Sistema valida disponibilidad
-> Confirmar uso
-> Sistema registra uso
-> Mostrar estado actualizado
```

Ejemplo cafe diario:

Disponible:

```text
Cafe americano gratis
Estado: Disponible hoy
[ Aplicar beneficio ]
```

Ya usado:

```text
Cafe americano gratis
Estado: Ya usado hoy
Proximo disponible: manana
```

## Flujo de renovar membresia

```text
Buscar cliente
-> Ver membresia activa/vencida
-> Renovar membresia
-> Confirmar costo y metodo de pago
-> Sistema extiende o reinicia vigencia
-> Sistema registra transaccion como renovacion
-> Mostrar nueva fecha de vencimiento
```

Regla recomendada:

- Si la membresia esta activa, renovar desde la fecha de vencimiento actual.
- Si esta vencida, renovar desde hoy.

## Flujo de cliente no registrado

Si la busqueda no encuentra cliente:

```text
Sin resultados.
Registrar cliente nuevo.
```

Despues de registrar:

- El sistema debe dejar al cliente seleccionado.
- Debe mostrar acciones disponibles inmediatamente.
- No obligar al empleado a buscarlo otra vez.

## Alertas en ficha del cliente

Alertas recomendadas:

- Membresia vencida.
- Membresia vence pronto.
- Beneficio diario ya usado.
- Cliente sin email, si se quiere enviar avisos.
- Cliente tiene puntos disponibles.

## Configuracion fuera de caja

La empresa debe tener preconfigurado:

### Puntos

- porcentaje de puntos por compra.

### Membresias

- planes de membresia;
- duracion;
- costo;
- beneficios;
- limites de uso;
- aviso de vencimiento;
- metodos de pago permitidos si aplica.

Esto vive en:

```text
Mi empresa
```

No en `Caja / Atender cliente`.

## Reportes relacionados

El flujo debe preparar informacion para reportes:

- compras/puntos del dia;
- membresias nuevas del dia;
- renovaciones del dia;
- montos por metodo de pago;
- usos de beneficios;
- membresias por vencer;
- membresias vencidas.

## Recomendacion de implementacion por rounds

### Round 1 - UX funcional

Objetivo:

- Definir pantalla `Atender cliente` y flujos de cliente primero.

Equipo sugerido:

- Product / Architect / Release.
- Diseno / UX.

Resultado esperado:

- Wireflow o especificacion textual clara.
- Estados de pantalla.
- Copy principal.
- Criterios de QA.

### Round 2 - Ajuste Web sin membresias funcionales completas

Objetivo:

- Reorganizar la pantalla actual para que el cliente sea el centro.

Incluye:

- busqueda/registro de cliente;
- ficha del cliente;
- puntos actuales;
- accion registrar compra;
- placeholders o seccion preparada para membresias si aun no hay API.

Equipo sugerido:

- Web Dev.
- QA.

### Round 3 - Contratos y modelo para acciones de membresia

Objetivo:

- Preparar datos/API para activar, renovar y aplicar beneficios.

Equipo sugerido:

- SQL DEV / Data.
- Backend/API.
- Product / Architect / Release.

### Round 4 - Membresias en Atender cliente

Objetivo:

- Integrar membresias reales al flujo.

Incluye:

- mostrar membresias del cliente;
- activar membresia;
- renovar;
- aplicar beneficio;
- registrar uso.

Equipo sugerido:

- Backend/API.
- Web Dev.
- QA.

### Round 5 - Reportes y avisos

Objetivo:

- Completar seguimiento operativo.

Incluye:

- reporte diario default de membresias;
- montos por metodo de pago;
- alertas de vencimiento;
- email si se decide incluir.

Equipo sugerido:

- Backend/API.
- Web Dev.
- Infra si hay email.
- QA.

## Decisiones necesarias antes de implementar

- El menu principal usara `Caja / Atender cliente` o solo `Caja`?
- Se mantiene `Puntos` como accion dentro de caja o como submenu?
- Se mostraran membresias aunque la empresa no tenga ese tipo de fidelizacion habilitado?
- Se permitira registrar cliente sin email?
- Que pasa si cliente tiene varias membresias activas?
- Se permite activar membresia y registrar compra/puntos en la misma atencion?
- El pago de membresia requiere factura o solo registro operativo?
- El metodo de pago es obligatorio para activar/renovar?

## Recomendacion para Product / Architect / Release

- Tema: Redisenar flujo operativo hacia cliente primero.
- Motivo: Puntos y membresias dependen de identificar al cliente; separar primero por modulo aumenta friccion y puede ocultar alertas importantes.
- Prioridad sugerida: P1 si membresias entra en la proxima fase; P2 si primero se completara otra validacion visual.
- Equipo sugerido: Product / Architect / Release + Diseno / UX primero; luego Web Dev, Backend/API, SQL DEV y QA.
- Documento/tarea sugerida: Crear tarea inicial para Diseno / UX: especificar pantalla `Atender cliente` y estados principales.
- Riesgo si no se hace: La UI puede crecer por modulos separados y volverse incomoda para caja, especialmente cuando una empresa tenga puntos y membresias habilitados al mismo tiempo.
