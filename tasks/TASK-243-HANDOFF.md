# TASK-243 - Handoff Diseno/UX

Equipo: Diseno / UX

Modo de ejecucion: Diseno/UX

## Resultado

Completado.

Se define la UX funcional MVP de membresias como segundo tipo de fidelizacion, sin implementar UI todavia.

## Decisiones UX

### Tipos de fidelizacion por empresa

Una empresa puede tener habilitado:

- `Puntos`
- `Membresias`
- `Puntos y membresias`

Para MVP, la empresa no debe ver opciones operativas de membresias si `Membresias` no esta habilitado. La habilitacion debe venir de configuracion aprobada de empresa, no de una preferencia local del navegador.

### Navegacion MVP

Menu recomendado para Round 2+:

- `Puntos`
- `Membresias`
- `Mi empresa`
- `Reportes`

`Admin empresas` sigue fuera del menu normal de empresa autenticada y permanece como ruta interna separada.

Dentro de `Membresias`, usar pestanas o sub-secciones:

- `Planes`
- `Activar membresia`
- `Beneficios del cliente`

Para reducir ambiguedad, evitar que `Operaciones` sea el contenedor principal cuando conviven puntos y membresias.

### Configuracion de planes

La pantalla `Membresias > Planes` permite a owner/admin:

- listar planes;
- crear plan;
- editar nombre, descripcion, duracion, precio y aviso interno de vencimiento;
- activar/inactivar plan;
- gestionar beneficios del plan.

Campos MVP:

- Nombre del plan.
- Descripcion.
- Duracion en dias.
- Precio.
- Dias para alerta interna de vencimiento.
- Estado: activo/inactivo.

### Configuracion de beneficios

Cada plan contiene beneficios. La UI debe distinguir:

- beneficio informativo;
- descuento;
- item/servicio gratis o incluido con limite de uso.

Campos MVP:

- Nombre.
- Descripcion.
- Tipo de beneficio.
- Aplica a: categoria, producto, servicio o texto libre.
- Porcentaje de descuento, si aplica.
- Cantidad incluida, si aplica.
- Limite de uso.
- Periodo de uso: sin limite, dia, semana, mes, termino de membresia.
- Estado: activo/inactivo.

### Activacion de membresia a cliente

Flujo recomendado:

1. Buscar o registrar cliente.
2. Abrir `Activar membresia`.
3. Seleccionar plan activo.
4. Confirmar fecha de inicio, fecha de vencimiento calculada y precio.
5. Activar membresia.
6. Mostrar resumen de membresia y beneficios.

Para MVP, la activacion puede ser manual. No se requiere integracion de pago real.

### Cliente con membresia

Al buscar cliente, si membresias esta habilitado, la ficha del cliente debe mostrar:

- membresia activa, si existe;
- fecha de vencimiento;
- estado de alerta si esta proxima a vencer;
- beneficios disponibles;
- beneficios ya usados en el periodo actual;
- membresias vencidas o canceladas en resumen secundario.

### Uso de beneficio controlable

Flujo recomendado:

1. Empleado busca cliente.
2. Sistema muestra membresia activa.
3. Empleado selecciona beneficio controlable.
4. Sistema muestra disponibilidad.
5. Empleado confirma `Registrar uso`.
6. Sistema registra uso y actualiza estado del beneficio.

No registrar usos para beneficios puramente informativos. Para descuentos sin limite, el sistema puede mostrar el beneficio como disponible mientras la membresia este activa; el registro de uso solo es necesario si Product decide auditar cada descuento aplicado.

### Alerta interna de vencimiento

MVP no envia correo automatico.

La UI debe mostrar alerta interna:

- `Vence hoy`
- `Vence en N dias`
- `Vencida`

El umbral sale del plan, por ejemplo `renewal_notice_days = 5`.

## Vocabulario exacto

- `Membresia`: producto de fidelizacion que un cliente activa por un periodo.
- `Plan`: plantilla/configuracion de una membresia vendida por la empresa.
- `Beneficio`: ventaja incluida en un plan.
- `Uso de beneficio`: registro operativo de que un cliente consumio un beneficio controlable.
- `Activa`: membresia vigente y usable.
- `Vencida`: membresia cuyo `end_date` ya paso.
- `Cancelada`: membresia detenida manualmente antes de vencer.

## Caso Product Owner

Plan:

- Nombre: `Membresia mensual`
- Duracion: `30 dias`
- Precio: definido por empresa.
- Aviso interno: recomendado `5 dias antes`.

Beneficios:

1. `15% descuento en pasteles`
   - Tipo: descuento.
   - Aplica a: categoria `Pasteles`.
   - Uso: sin limite mientras la membresia este activa.

2. `15% descuento en dulces`
   - Tipo: descuento.
   - Aplica a: categoria `Dulces`.
   - Uso: sin limite mientras la membresia este activa.

3. `1 cafe americano gratis por dia`
   - Tipo: item gratis.
   - Aplica a: producto `Cafe americano`.
   - Cantidad incluida: `1`.
   - Limite: `1`.
   - Periodo: `dia`.
   - Requiere registro de uso.

## Copy base

Menu:

```text
Membresias
```

Titulo configuracion:

```text
Planes de membresia
```

Ayuda de plan:

```text
Configure las membresias que puede activar para sus clientes.
```

Activacion:

```text
Activar membresia
```

Confirmacion:

```text
Membresia activada.
```

Beneficio disponible:

```text
Disponible para usar.
```

Beneficio ya usado:

```text
Ya usado en este periodo.
```

Membresia vencida:

```text
Membresia vencida. Active una nueva membresia para usar beneficios.
```

Alerta:

```text
La membresia vence en {days} dias.
```

## Estados esperados

- Vacio sin planes: `Aun no hay planes de membresia. Cree el primer plan para activar membresias a clientes.`
- Vacio sin membresia del cliente: `Este cliente no tiene membresia activa.`
- Carga: `Cargando membresias...`
- Error generico: `No se pudo cargar la informacion de membresias.`
- Plan inactivo al activar: `Este plan esta inactivo. Active el plan o seleccione otro.`
- Beneficio informativo: visible, sin boton de uso.
- Beneficio disponible: boton `Registrar uso` habilitado.
- Beneficio ya usado en periodo: boton deshabilitado y mostrar fecha/periodo.
- Membresia vencida: beneficios no usables; mostrar opcion de nueva activacion.
- Membresia cancelada: beneficios no usables; mostrar estado historico.

## Reglas UX

- Si la membresia esta vencida o cancelada, no permitir registrar usos.
- Si el beneficio es informativo, no mostrar accion de registro de uso.
- Si el beneficio es descuento sin limite, mostrar como disponible mientras la membresia este activa.
- Si el beneficio tiene limite por periodo, mostrar consumo actual: `0/1 usado hoy`, `1/1 usado hoy`, etc.
- Para el cafe diario, una vez registrado el uso del dia, mostrar `Ya usado hoy`.
- Si el cliente tiene mas de una membresia activa en el futuro, la UI debe agrupar beneficios por membresia. Para MVP se recomienda permitir solo una membresia activa por cliente para reducir ambiguedad.

## Dependencias para SQL/Data

- Modelar planes, beneficios, membresias de cliente y usos de beneficios.
- Guardar `company_id` en todas las tablas.
- Soportar estados activo/inactivo para planes/beneficios.
- Soportar estados `active`, `expired`, `cancelled` para membresias de cliente.
- Soportar periodos de uso: `none`, `day`, `week`, `month`, `membership_term`.
- Usar fecha operativa local para `usage_date` y timestamp UTC para auditoria.
- Definir constraints para cantidad/limite positivos cuando apliquen.

## Dependencias para Backend/API

- Resolver empresa desde sesion, no desde `companyId` editable.
- Exponer disponibilidad de beneficios ya calculada para la UI.
- Registrar uso de beneficio en operacion transaccional.
- Rechazar beneficio ya usado en el periodo con error claro.
- Exponer alerta interna de vencimiento.
- No implementar correo automatico de vencimiento en MVP.

## Riesgos o pendientes

- Decision pendiente: permitir una o varias membresias activas por cliente. Recomendacion UX MVP: una activa por cliente.
- Decision pendiente: renovacion antes de vencer extiende desde `end_date` actual o reinicia desde hoy. Recomendacion UX MVP: nueva activacion inicia en fecha elegida; renovacion puede diferirse.
- Decision pendiente: si descuentos ilimitados deben registrarse como usos. Recomendacion MVP: no registrar obligatoriamente; solo controlar beneficios con limite.
- QA necesitara casos con membresia activa, vencida, beneficio disponible y beneficio ya usado.
