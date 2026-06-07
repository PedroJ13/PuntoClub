Equipo:
Diseno / UX

Tarea completada:
TASK-113 - Disenar navegacion lateral y flujo empresa/invitacion.

Archivos cambiados:
- `docs/TASK_BOARD.md`
- `tasks/TASK-113-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-113-assignment.md`.
- Revision del tablero en `docs/TASK_BOARD.md`.
- Revision puntual de UI actual en `app/index.html`, `app/src/app.js`, `tasks/TASK-104-HANDOFF.md` y `tasks/TASK-109-HANDOFF.md`.
- No se ejecuto app local ni API porque el alcance es UX/documentacion y no implementacion.

Resultado:
Completado. La propuesta define menu lateral, distribucion de paneles existentes, flujo de registro/invitacion de empresa, estados, mensajes, campos y requisitos responsive.

## Propuesta de IA/menu

La app debe volver a una navegacion lateral persistente en desktop con tres secciones principales:

1. `Operaciones`
   - Buscar cliente.
   - Registrar cliente.
   - Resultados de busqueda.
   - Operacion del cliente seleccionado: historial, registrar compra, redimir puntos.

2. `Mi empresa`
   - Perfil de empresa.
   - Configuracion operativa.
   - Logo.
   - Acceso e invitacion.
   - Estado de registro/invitacion.

3. `Reportes`
   - Reporte de actividad.
   - Auditoria operativa.

La navegacion lateral debe usar labels estables, no nombres internos ni referencias a zonas. Recomendacion de orden:

```text
Operaciones
Mi empresa
Reportes
```

En desktop, el menu lateral queda fijo a la izquierda y el contenido activo ocupa el resto. En mobile, el menu debe convertirse en barra superior compacta, drawer o selector de seccion, evitando que el operador tenga que recorrer todos los paneles verticalmente para llegar a reportes o empresa.

## Mapeo de paneles existentes

Mover o agrupar los paneles actuales asi:

| Panel actual | Nueva seccion | Nota UX |
| --- | --- | --- |
| `Buscar cliente` | `Operaciones` | Debe ser el primer bloque de la seccion. |
| `Registrar cliente` | `Operaciones` | Puede mostrarse debajo de busqueda o como subseccion visible cuando no hay resultados. |
| `Resultados` | `Operaciones` | Debe mantener acciones por cliente: compra, canje, historial. |
| `Operacion` | `Operaciones` | Debe conservar estado vacio claro cuando no hay cliente seleccionado. |
| `Empresa piloto` | `Mi empresa` | Renombrar a `Mi empresa` o `Perfil de empresa`; evitar "piloto" en UI de empresa real. |
| Configuracion de empresa | `Mi empresa` | Mantener campos actuales y agregar direccion/logo subido/acceso cuando API lo soporte. |
| `Reporte de actividad` | `Reportes` | Mantener filtros por fecha, tipo y export CSV. |
| `Auditoria operativa` | `Reportes` | Mantener filtros por fecha y limite; no cargar automaticamente. |

Friccion actual que resuelve: la pantalla unica mezcla operacion diaria, configuracion y supervision. El menu lateral reduce scroll, separa tareas de caja de tareas administrativas y evita que reportes/auditoria parezcan parte del flujo de registrar compra.

Severidad UX: P1 porque el Product Owner pidio recuperar navegacion lateral para separar areas antes de avanzar multiempresa.

## Flujo paso a paso: empresa nueva e invitacion

### A. Solicitud o creacion de empresa

1. Usuario interno o futuro solicitante entra a `Mi empresa`.
2. Si no hay empresa activa, mostrar estado inicial:
   - Titulo: `Registrar empresa`
   - Mensaje: `Complete los datos de la empresa para preparar la invitacion de acceso.`
3. Usuario completa datos minimos.
4. Al enviar, el sistema debe:
   - crear o registrar la solicitud de empresa;
   - mostrar estado claro de solicitud/invitacion;
   - preparar envio de invitacion al correo de la empresa;
   - notificar internamente a `pj13eros_business@outlook.com`.

### B. Estado de solicitud/invitacion

Despues de crear la solicitud, `Mi empresa` debe mostrar un resumen persistente:

```text
Solicitud recibida
Enviaremos una invitacion a [correo@empresa.com] para crear la contrasena de acceso.
```

Datos visibles:
- Nombre de empresa.
- Correo de acceso.
- Estado: `Solicitud recibida`, `Invitacion enviada`, `Invitacion expirada`, `Activa`.
- Fecha de solicitud.
- Fecha de envio de invitacion si existe.

### C. Empresa recibe invite y crea password

1. La empresa recibe correo de invitacion.
2. Abre enlace de invitacion.
3. Pantalla dedicada: `Crear contrasena`
4. La pantalla debe mostrar:
   - correo como usuario, no editable;
   - nombre de empresa;
   - campos de password y confirmacion;
   - accion principal `Crear acceso`.
5. Al completar:
   - mostrar confirmacion;
   - permitir ir a login/panel;
   - marcar invitacion como usada.

### D. Empresa entra al panel

1. En login, la empresa usa su correo como usuario.
2. Despues de entrar, llega a `Operaciones` por defecto si la empresa esta activa.
3. Puede ir a `Mi empresa` para revisar nombre, logo, direccion, correo y configuracion.
4. Puede ir a `Reportes` para actividad y auditoria.

## Campos por pantalla

### `Mi empresa` - Registro inicial

Campos recomendados:
- Nombre comercial, requerido.
- Correo de acceso, requerido.
- Direccion, requerido o recomendado segun decision de Product.
- Logo, opcional al inicio.
- Nombre de contacto, recomendado.
- Telefono, recomendado.

Accion primaria:
- `Crear solicitud`

Accion secundaria:
- `Limpiar`

Nota UX:
- No pedir password en esta pantalla si el flujo final sera invitacion por correo.
- El correo debe explicarse como usuario de acceso futuro.

### `Mi empresa` - Perfil/configuracion

Campos:
- Nombre comercial.
- Correo de acceso.
- Direccion.
- Telefono.
- Logo subido.
- Porcentaje de puntos.
- Estado de empresa.

Accion primaria:
- `Guardar cambios`

Estados visibles:
- Estado de empresa.
- Logo.
- Ultima actualizacion.

### `Crear contrasena`

Campos:
- Correo, solo lectura.
- Password.
- Confirmar password.

Accion primaria:
- `Crear acceso`

Mensajes de ayuda:
- `Este correo sera su usuario para entrar a Punto Club.`
- `Use una contrasena segura para proteger los datos de clientes y puntos.`

### `Reportes`

Mantener:
- Fecha desde.
- Fecha hasta.
- Tipo: todas, compras, redenciones.
- Consultar.
- Exportar CSV.

### `Auditoria operativa`

Mantener:
- Fecha desde.
- Fecha hasta.
- Limite.
- Consultar auditoria.

## Estados y mensajes recomendados

### Empresa ya existente

Cuando el correo o nombre identifique una empresa existente:

```text
Ya existe una empresa con ese correo. Revise los datos o solicite reenviar la invitacion.
```

Acciones posibles:
- `Reenviar invitacion`, solo si la empresa existe pero aun no esta activa.
- `Ir a iniciar sesion`, si ya tiene password.

### Invitacion enviada

```text
Invitacion enviada a [correo@empresa.com].
La empresa debe abrir el correo y crear su contrasena para entrar al panel.
```

Si tambien se notifica internamente:

```text
Notificacion interna enviada a pj13eros_business@outlook.com.
```

### Invitacion expirada o invalida

```text
Esta invitacion expiro o ya fue usada. Solicite una nueva invitacion para crear el acceso.
```

Accion:
- `Solicitar nueva invitacion`

### Logo pendiente

```text
Logo pendiente. Puede continuar sin logo y subirlo despues.
```

### Logo subido

```text
Logo subido correctamente.
```

Mostrar una vista previa pequena o enlace seguro al archivo, segun defina Infra/Web Dev.

### Password creado

```text
Acceso creado. Ya puede entrar con [correo@empresa.com].
```

Accion:
- `Entrar al panel`

### Error generico operativo

```text
No se pudo completar la accion. Intente de nuevo.
```

Evitar mostrar detalles tecnicos de API, storage, auth o correo en la UI final.

## Requisitos responsive desktop/mobile

Desktop:
- Menu lateral visible y persistente.
- Contenido con una sola seccion activa a la vez.
- `Operaciones` puede usar layout de dos columnas si hay espacio: busqueda/registro a la izquierda, cliente seleccionado/operacion a la derecha.
- `Reportes` y `Auditoria` deben conservar tablas con scroll interno horizontal, no romper el ancho de pagina.

Mobile:
- Navegacion lateral debe colapsar a drawer, barra superior o selector de seccion.
- Cada seccion debe mostrarse como una pagina/panel activo, no como todas las tarjetas una debajo de otra.
- Acciones principales deben quedar cerca del formulario que afectan.
- Tablas de reportes/auditoria deben tener scroll interno y columnas legibles.
- No debe haber overflow horizontal del documento.

## Recomendaciones concretas para Web Dev

- Implementar una navegacion por estado de seccion activa: `operations`, `company`, `reports`.
- Mantener el flujo operativo actual dentro de `Operaciones`; no separar compra/canje en rutas distintas todavia.
- Renombrar `Empresa piloto` a `Mi empresa` o `Perfil de empresa`.
- En `Reportes`, agrupar `Reporte de actividad` y `Auditoria operativa` como subpaneles o tabs internos simples.
- No cargar reportes/auditoria automaticamente al entrar a `Reportes`; conservar consulta manual.
- Preparar copy y contenedores para estados de invitacion aunque Backend/API lo implemente despues.

## Que debe decidir Product / Architect / Release

- Si el registro de empresa lo inicia un usuario externo, un administrador interno o ambos.
- Si `direccion` es requerida en fase 1 o solo recomendada.
- Si el correo `pj13eros_business@outlook.com` recibe todas las solicitudes, solo errores o solo aprobaciones pendientes.
- Si la invitacion requiere aprobacion interna antes de enviarse.
- Si la empresa queda `Activa` automaticamente al crear password o requiere revision manual.
- Politica de expiracion de invitacion.
- Nombre final del producto/superficie: mantener `Punto Club` y usar `Mi empresa` como area administrativa.

## Riesgos o pendientes

- Auth, email, storage y SQL siguen fuera de alcance de esta tarea; TASK-114/TASK-115 deben definir limites tecnicos.
- Backend/API TASK-116 debe convertir este flujo UX en contratos sin exponer detalles tecnicos al usuario final.
- Web Dev TASK-117 depende de aprobacion de este handoff para reorganizar la UI.
- Si se implementa el menu lateral antes de resolver auth/invitaciones, debe quedar claro que `Mi empresa` puede seguir operando en modo empresa piloto temporal.

Siguiente recomendado:
Product / Architect / Release debe revisar este handoff junto con TASK-114 y TASK-115 antes de liberar TASK-116 y TASK-117.
