Equipo: Web Dev

Tarea completada: TASK-005 - Proponer pantallas MVP

Archivos cambiados:
- `tasks/TASK-005-HANDOFF.md`

Verificacion ejecutada:
- Leido `codex-project-templates/WEB_DEV.md`.
- Leido `AGENTS.md`.
- Leido `tasks/TASK-005.md`.
- Leido `docs/README.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `docs/MVP_CRITERIA.md`.
- Leido `docs/API_CONTRACTS.md`.
- Leido `docs/DATA_MODEL.md`.
- Leido `docs/BACKLOG.md`.
- Validado contra alcance: no se implemento UI, no se cambiaron contratos API, no se cambio SQL.

Resultado:

## Propuesta de pantallas MVP

### 1. Dashboard operativo

Primera pantalla interna para una empresa piloto ya seleccionada/autenticada.

Objetivo:
- Dar acceso rapido a operaciones diarias: buscar cliente, registrar cliente, registrar compra, redimir puntos.
- Mostrar estado minimo de la empresa y configuracion de puntos.

Contenido MVP:
- Header con nombre de empresa y estado operativo.
- Acciones primarias:
  - Buscar cliente.
  - Registrar cliente.
  - Registrar compra.
  - Redimir puntos.
- Resumen simple:
  - Porcentaje actual de puntos por compra.
  - Indicador de empresa activa/inactiva si API lo expone.
- Panel de ultimas operaciones solo si API futura lo permite; no bloquear MVP si no existe.

Estados:
- Loading: skeleton corto para configuracion de empresa.
- Empty: si no hay datos operativos adicionales, mantener acciones principales visibles.
- Error: mensaje claro si no se puede cargar configuracion de empresa.
- Confirmacion: no aplica como estado principal; las confirmaciones ocurren en formularios.

Dependencias API:
- `GET /api/companies/{companyId}/settings`.
- Pendiente: fuente confiable de `companyId` y auth fase 1.

### 2. Busqueda/listado de clientes

Pantalla central para caja/operacion diaria.

Objetivo:
- Encontrar rapido un cliente por telefono, nombre o email.
- Entrar a detalle del cliente o iniciar registro si no existe.

Contenido MVP:
- Campo de busqueda destacado.
- Lista de resultados con nombre, telefono, email.
- Acciones por fila:
  - Ver detalle.
  - Registrar compra.
  - Redimir puntos.
- Accion para crear cliente cuando no hay resultado.

Estados:
- Loading: indicador dentro del listado mientras consulta.
- Empty inicial: invitar a buscar por telefono, nombre o email.
- Empty con busqueda: "No encontramos clientes con esa busqueda" y accion "Registrar cliente".
- Error: mostrar mensaje de error y permitir reintentar.
- Confirmacion: no aplica.

Dependencias API:
- `GET /api/companies/{companyId}/customers?search={text}`.
- Pendiente: paginacion si el piloto supera volumen basico.

### 3. Detalle de cliente con saldo e historial

Pantalla de consulta y operacion sobre un cliente.

Objetivo:
- Ver identidad, saldo disponible y actividad reciente.
- Iniciar compra o redencion con contexto correcto.

Contenido MVP:
- Datos del cliente: nombre, telefono, email.
- Saldo destacado: puntos disponibles.
- Totales simples: puntos ganados, puntos redimidos.
- Historial combinado de compras y redenciones, ordenado descendente.
- Acciones:
  - Registrar compra.
  - Redimir puntos.

Estados:
- Loading: skeleton para saldo e historial.
- Empty: historial vacio con saldo 0 y CTA "Registrar compra".
- Error: separar error de saldo/historial de error de identidad si la API lo permite.
- Confirmacion: despues de compra/redencion exitosa, refrescar saldo e historial.

Dependencias API:
- `GET /api/companies/{companyId}/customers/{customerId}/balance`.
- `GET /api/companies/{companyId}/customers/{customerId}/activity`.
- Falta contrato especifico para obtener datos de un cliente por `customerId` si se entra directo por URL; alternativa MVP: pasar cliente desde listado y usar activity/balance.

### 4. Registrar cliente

Formulario simple para crear cliente dentro de empresa.

Objetivo:
- Crear clientes sin friccion y evitar duplicados por telefono/email.

Campos:
- Nombre, requerido.
- Telefono, requerido.
- Email, opcional.

Estados:
- Loading/submitting: deshabilitar submit y evitar doble envio.
- Empty: formulario limpio.
- Error validacion: mostrar errores por campo desde `VALIDATION_ERROR.details`.
- Error duplicado: `DUPLICATE_CUSTOMER`, sugerir buscar cliente existente.
- Confirmacion: cliente creado, opcion de ir al detalle o registrar compra.

Dependencias API:
- `POST /api/companies/{companyId}/customers`.
- `GET /api/companies/{companyId}/customers?search={text}` para resolver duplicados despues del error.

### 5. Registrar compra

Formulario operativo asociado a cliente.

Objetivo:
- Registrar venta real y permitir que API calcule puntos.

Campos:
- Cliente seleccionado.
- Numero de factura, requerido.
- Fecha de compra, requerida.
- Monto, requerido, mayor que 0.

Comportamiento:
- El frontend no envia puntos ganados.
- Despues de guardar, muestra puntos calculados por API.
- Desde detalle de cliente, cliente viene preseleccionado.
- Desde dashboard, primero se debe buscar/seleccionar cliente.

Estados:
- Loading/submitting: bloquear doble envio.
- Empty: formulario listo con fecha actual por defecto si Product lo aprueba.
- Error validacion: monto, fecha o factura invalidos.
- Error duplicado: `DUPLICATE_INVOICE`, indicar que esa factura ya existe.
- Confirmacion: compra registrada, puntos ganados y enlace al detalle actualizado.

Dependencias API:
- `POST /api/companies/{companyId}/purchases`.
- `GET /api/companies/{companyId}/customers?search={text}` si el cliente no viene preseleccionado.
- Pendiente: confirmar regla final de redondeo de puntos.

### 6. Redimir puntos

Formulario operativo asociado a cliente.

Objetivo:
- Registrar canje sin permitir saldo negativo.

Campos:
- Cliente seleccionado.
- Saldo disponible visible.
- Fecha de redencion, requerida.
- Puntos a redimir, requerido, entero mayor que 0.
- Nota, opcional.

Comportamiento:
- Mostrar saldo antes de redimir.
- Validacion frontend basica: no permitir valor mayor al saldo visible, pero confiar en API como fuente final.
- Despues de guardar, mostrar saldo actualizado desde respuesta/API.

Estados:
- Loading: cargar saldo antes de habilitar formulario.
- Empty: si saldo 0, deshabilitar redencion y sugerir registrar compra.
- Error validacion: puntos invalidos o nota muy larga.
- Error saldo insuficiente: `INSUFFICIENT_POINTS`, refrescar saldo.
- Confirmacion: redencion registrada y saldo posterior.

Dependencias API:
- `GET /api/companies/{companyId}/customers/{customerId}/balance`.
- `POST /api/companies/{companyId}/redemptions`.

### 7. Configuracion de empresa

Pantalla interna simple de ajustes operativos.

Objetivo:
- Ver y editar datos basicos de empresa y porcentaje de puntos.

Campos:
- Nombre.
- Email.
- Telefono.
- Logo URL.
- Porcentaje de puntos por compra.
- Estado visible solo lectura si API lo devuelve.

Estados:
- Loading: skeleton de formulario.
- Empty: no esperado si company existe; tratar como error.
- Error: empresa no encontrada/no operativa.
- Error validacion: campos invalidos y porcentaje fuera de rango.
- Confirmacion: configuracion actualizada.

Dependencias API:
- `GET /api/companies/{companyId}/settings`.
- `PATCH /api/companies/{companyId}/settings`.
- Pendiente: estrategia de logos de empresa.

## Flujo recomendado MVP

1. Operador entra al dashboard.
2. Busca cliente por telefono/nombre/email.
3. Si existe, abre detalle.
4. Si no existe, registra cliente.
5. Desde detalle registra compra o redime puntos.
6. Luego vuelve al detalle con saldo e historial actualizados.
7. Configuracion de empresa queda como pantalla secundaria para administrador/operador autorizado.

## Navegacion MVP sugerida

- `/` o `/dashboard`
- `/customers`
- `/customers/new`
- `/customers/:customerId`
- `/purchases/new?customerId=...`
- `/redemptions/new?customerId=...`
- `/settings`

## Priorizacion frontend

P0:
- Busqueda/listado de clientes.
- Registrar cliente.
- Detalle con saldo e historial.
- Registrar compra.
- Redimir puntos.

P1:
- Dashboard simple.
- Configuracion de empresa.

P2:
- Ultimas operaciones globales.
- Reportes simples.
- Exportacion CSV.

Riesgos o pendientes:
- Auth fase 1 y fuente confiable de `companyId` siguen pendientes; el frontend no debe confiar en companyId editable por usuario.
- Falta contrato `GET customer by id` para entradas directas al detalle si no se trae el cliente desde listado.
- Paginacion para clientes e historial esta pendiente si el piloto crece.
- Regla final de redondeo de puntos debe confirmarse antes de mostrar previews o copy definitivo.
- Tratamiento visible de empresa inactiva esta pendiente de decision.
- Estrategia de logos de empresa esta en backlog P1.
- UX debe evitar que el dashboard se vuelva una landing; la prioridad es flujo operativo de caja.

Siguiente recomendado:
- Product / Architect / Release debe revisar esta propuesta junto con TASK-004 y decidir:
  - auth/companyId fase 1,
  - si se agrega `GET /api/companies/{companyId}/customers/{customerId}`,
  - regla final de redondeo,
  - si configuracion de empresa entra como P0 o P1.
- Luego asignar una tarea Web Dev pequena para implementar primero busqueda/listado + registrar cliente, usando estados loading/empty/error desde el inicio.
