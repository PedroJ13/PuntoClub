Equipo:
Diseno / UX

Tarea completada:
TASK-202 - Definir UX minima para panel interno de empresas.

Archivos cambiados:
- `tasks/TASK-202-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-202-assignment.md`.
- Lectura de `chat-start/DISENO_UX.md`, `AGENTS.md` y `docs/MVP_RELEASE_STATUS.md`.
- Lectura de `tasks/TASK-201-assignment.md` para alinear dependencia con contratos internos.
- No se ejecuto app local ni API porque el alcance es UX/documentacion y no implementacion.

Resultado:
Completado. Este handoff define flujo, estructura minima, copy, estados de UI, reglas de seguridad UX y dependencias para Web Dev.

## Resumen UX

El panel interno debe resolver una friccion operativa concreta: revisar solicitudes de empresa, aprobar/rechazar y reenviar invitaciones sin depender de pasos tecnicos manuales.

Severidad UX: P1. Sin este panel, el flujo multiempresa controlado existe tecnicamente, pero la operacion diaria de alta de empresas queda poco trazable y demasiado manual.

Principio de diseno:
- Funcional, sobrio y consistente con Punto Club actual.
- No es un admin SaaS completo.
- No prometer login admin final; usar lenguaje de acceso temporal.
- No exponer secretos, tokens, hashes, cookies, passwords ni links completos.

## Estructura de pantalla propuesta

Nombre de seccion:
```text
Administracion interna
```

Subtitulo:
```text
Revise solicitudes de empresa, apruebe o rechace y gestione invitaciones pendientes.
```

Bloques:

1. Acceso interno temporal.
2. Resumen operativo.
3. Lista de solicitudes.
4. Detalle de solicitud.
5. Invitacion asociada.
6. Confirmaciones y errores.

## Flujo propuesto

### 1. Ingresar token interno temporal

Al abrir el panel, mostrar primero un bloque de acceso:

Titulo:
```text
Acceso interno temporal
```

Texto de apoyo:
```text
Ingrese el token interno para revisar solicitudes de empresa. Este acceso es temporal y no reemplaza un login administrativo final.
```

Campo:
```text
Token interno
```

Placeholder:
```text
Pegue el token interno
```

Ayuda:
```text
El token solo se usa durante esta sesion del navegador.
```

Accion primaria:
```text
Entrar
```

Accion secundaria:
```text
Limpiar token
```

Comportamiento UX:
- El campo debe ser tipo password.
- No guardar el token en `localStorage`.
- Permitido mantenerlo solo en memoria mientras la pestana esta abierta.
- Si el usuario recarga, pedir token de nuevo.
- Despues de entrar, mostrar un estado visible pero no sensible:

```text
Acceso interno activo en esta pestana.
```

### 2. Listar solicitudes pendientes/recientes

Una vez validado el token o despues de una primera consulta exitosa, mostrar lista.

Titulo:
```text
Solicitudes de empresa
```

Filtros minimos:
- Estado: `Pendientes`, `Recientes`, `Todas`.
- Busqueda: nombre, correo de empresa o contacto.
- Boton: `Actualizar`.

Columnas recomendadas desktop:
- Empresa.
- Correo de empresa.
- Contacto.
- Estado.
- Fecha.
- Invitacion.
- Accion.

Formato de item:
```text
[companyName]
[companyEmail]
Contacto: [contactName] - [contactEmail]
Estado: Pendiente
Solicitud: [createdAt]
```

Accion de fila:
```text
Ver detalle
```

Estado de carga:
```text
Cargando solicitudes...
```

Estado vacio pendiente:
```text
No hay solicitudes pendientes.
```

Estado vacio busqueda:
```text
No encontramos solicitudes con esos datos.
```

Error de carga:
```text
No se pudieron cargar las solicitudes. Revise el token interno e intente de nuevo.
```

### 3. Ver detalle de solicitud

Al seleccionar una solicitud, abrir panel de detalle en la misma pantalla. En desktop puede ser panel lateral o columna derecha; en mobile debe ocupar la vista activa debajo de la lista.

Titulo:
```text
Detalle de solicitud
```

Campos visibles:
- Nombre de empresa.
- Correo de empresa.
- Direccion.
- Telefono de empresa.
- Nombre de contacto.
- Correo de contacto.
- Telefono de contacto.
- Estado de solicitud.
- Fecha de solicitud.
- Fecha de ultima actualizacion si existe.

No mostrar:
- token raw;
- token hash;
- link completo de invitacion;
- password/cookie/sesion;
- secretos o headers internos.

Estado pendiente:
```text
Esta solicitud esta pendiente de revision.
```

Estado aprobada:
```text
Esta solicitud ya fue aprobada.
```

Estado rechazada:
```text
Esta solicitud fue rechazada.
```

Estado ya procesada:
```text
Esta solicitud ya fue procesada. Actualice la lista para ver el estado mas reciente.
```

### 4. Aprobar solicitud

Accion primaria disponible solo para solicitudes pendientes:
```text
Aprobar y enviar invitacion
```

Confirmacion antes de aprobar:
```text
Va a aprobar la solicitud de [companyName] y enviar una invitacion al correo [companyEmail].
```

Botones:
```text
Confirmar aprobacion
Cancelar
```

Estado ejecutando:
```text
Aprobando solicitud...
```

Exito:
```text
Solicitud aprobada. La invitacion fue enviada a [companyEmail].
```

Exito si la API separa aprobacion de invitacion:
```text
Solicitud aprobada. Revise la invitacion asociada para confirmar el envio.
```

Error:
```text
No se pudo aprobar la solicitud. Actualice e intente de nuevo.
```

Error solicitud ya procesada:
```text
La solicitud ya fue procesada por otro flujo. Actualice la lista.
```

### 5. Rechazar solicitud con motivo

Accion secundaria/destructiva:
```text
Rechazar solicitud
```

Confirmacion:
```text
Indique el motivo del rechazo. Este motivo quedara como referencia interna.
```

Campo:
```text
Motivo del rechazo
```

Placeholder:
```text
Ej. Datos incompletos, correo no corresponde o empresa fuera del piloto.
```

Validacion:
```text
Ingrese un motivo para rechazar la solicitud.
```

Botones:
```text
Confirmar rechazo
Cancelar
```

Estado ejecutando:
```text
Rechazando solicitud...
```

Exito:
```text
Solicitud rechazada.
```

Error:
```text
No se pudo rechazar la solicitud. Actualice e intente de nuevo.
```

Nota UX:
- No enviar email de rechazo automaticamente salvo decision explicita de Product / Architect / Release.
- Si se envia email en el futuro, debe tener copy aprobado por Diseno / UX.

### 6. Ver invitacion asociada

Bloque en detalle:

Titulo:
```text
Invitacion
```

Campos visibles:
- Estado.
- Correo invitado.
- Rol.
- Fecha de envio.
- Fecha de expiracion.
- Fecha de aceptacion si existe.
- Ultimo reenvio si existe.

Estados:

Pendiente:
```text
Invitacion pendiente
```

Aceptada:
```text
Invitacion aceptada
```

Expirada:
```text
Invitacion expirada
```

Revocada/no disponible:
```text
Invitacion no disponible
```

Sin invitacion:
```text
Esta solicitud aun no tiene invitacion asociada.
```

Regla importante:
```text
No mostrar link completo de invitacion.
```

Si se necesita feedback operativo, mostrar solo:
```text
Link generado y enviado por correo.
```

### 7. Reenviar invitacion pendiente

Accion disponible solo cuando la invitacion esta pendiente o expirada y Backend/API lo permita:
```text
Reenviar invitacion
```

Confirmacion:
```text
Se reenviara la invitacion al correo [companyEmail]. No se mostrara el link en pantalla.
```

Botones:
```text
Reenviar
Cancelar
```

Estado ejecutando:
```text
Reenviando invitacion...
```

Exito:
```text
Invitacion reenviada a [companyEmail].
```

Error:
```text
No se pudo reenviar la invitacion. Intente de nuevo.
```

Si la invitacion ya fue aceptada:
```text
La invitacion ya fue aceptada. No es necesario reenviarla.
```

Si la invitacion no existe:
```text
No hay una invitacion pendiente para reenviar.
```

## Estados de UI

### Sin token

```text
Ingrese el token interno para cargar solicitudes.
```

### Token invalido o ausente

```text
Token interno invalido o vencido. Ingreselo de nuevo.
```

### Token activo

```text
Acceso interno activo en esta pestana.
```

### Cargando

```text
Cargando...
```

### Guardando accion

```text
Procesando accion...
```

### Lista vacia

```text
No hay solicitudes para revisar.
```

### Error generico

```text
No se pudo completar la accion. Intente de nuevo.
```

### Error de red/API

```text
No se pudo conectar con el servicio. Intente de nuevo.
```

### Error de permisos

```text
No tiene acceso para realizar esta accion con el token actual.
```

## Reglas de seguridad UX

- No guardar `x-puntoclub-admin-token` en `localStorage`, `sessionStorage` ni archivo.
- No imprimir el token en pantalla despues de ingresarlo.
- No enviar el token por query string.
- No incluir token en errores, logs visibles ni handoffs.
- No mostrar links completos de invitacion.
- No mostrar token raw ni token hash.
- No mostrar cookies, passwords, session ids ni secretos.
- No permitir copiar link de invitacion desde el panel interno.
- Si hay un boton de copiar en el futuro, debe copiar solo datos no sensibles, como `invitationId`.
- Al hacer logout/limpiar token, borrar el token en memoria y ocultar solicitudes cargadas.
- Cualquier error tecnico debe traducirse a copy operativo no sensible.

## Responsive

Desktop:
- Menu lateral actual se conserva.
- Panel interno puede usar dos columnas: lista a la izquierda, detalle a la derecha.
- Acciones de aprobar/rechazar deben estar cerca del estado de la solicitud.
- Confirmaciones destructivas deben abrir modal o panel de confirmacion claro.

Mobile:
- Mostrar una sola vista activa: lista o detalle.
- Desde detalle, incluir accion `Volver a solicitudes`.
- Botones de aprobar/rechazar deben ocupar ancho disponible y no quedar fuera de vista.
- Tablas deben convertirse en tarjetas; evitar overflow horizontal.

## Dependencias para Web Dev

Web Dev puede implementar cuando TASK-201 confirme:
- Endpoint para listar solicitudes pendientes/recientes.
- Endpoint para ver detalle de solicitud.
- Endpoint para aprobar solicitud.
- Endpoint para rechazar solicitud con motivo.
- Endpoint o campo de respuesta para ver invitacion asociada sin link/token.
- Endpoint para reenviar invitacion pendiente.
- Codigos de error para:
  - sin token;
  - token invalido;
  - solicitud ya procesada;
  - invitacion pendiente;
  - invitacion aceptada;
  - invitacion expirada;
  - invitacion no disponible.

Suposicion UX hasta que TASK-201 cierre:
- Web Dev debe tratar `x-puntoclub-admin-token` como input temporal manual.
- El panel interno puede vivir en una ruta/seccion interna no destacada publicamente.
- Si no existe endpoint de detalle separado, la lista debe traer datos suficientes para poblar el detalle minimo.

## Recomendaciones para Web Dev

- No bloquear la implementacion esperando estilos finales; priorizar claridad operativa.
- Reutilizar patrones visuales actuales de Punto Club: paneles simples, mensajes visibles y acciones claras.
- Separar visualmente acciones normales de acciones destructivas.
- Mantener estados despues de acciones: al aprobar/rechazar, actualizar detalle y lista.
- No hacer auto-refresh agresivo; usar boton `Actualizar`.
- Confirmar antes de aprobar, rechazar o reenviar.

## Dudas para Product / Architect / Release

1. Confirmar si el panel interno debe estar visible en el menu lateral o accederse por URL interna no promocionada.
2. Confirmar si se debe enviar email al solicitante cuando una solicitud se rechaza.
3. Confirmar si el motivo de rechazo es solo interno o visible para la empresa.
4. Confirmar si reenviar invitacion debe resetear fecha de expiracion.
5. Confirmar si solicitudes aprobadas/rechazadas deben mostrarse por defecto o solo bajo filtro `Recientes`.
6. Confirmar si se requiere auditoria visible en el panel para aprobacion, rechazo y reenvio.

Riesgos o pendientes:
- La proteccion con `x-puntoclub-admin-token` es temporal; no debe presentarse como login admin final.
- Si el token se comparte por canales inseguros, el panel puede operar acciones sensibles.
- Si la UI muestra links completos de invitacion, se repite el riesgo ya mitigado en tareas previas de token expuesto.
- Si Web Dev implementa antes de TASK-201, podria faltar contrato para detalle, invitacion o reenvio.

Siguiente recomendado:
Web Dev debe esperar el handoff de TASK-201 o confirmar sus endpoints antes de implementar TASK-203.
