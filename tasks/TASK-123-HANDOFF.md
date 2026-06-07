Equipo:
Diseno / UX

Tarea completada:
TASK-123 - Definir copy de registro, invitacion y correos de empresa.

Archivos cambiados:
- `tasks/TASK-123-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-123-assignment.md`.
- Lectura de `AGENTS.md`, `chat-start/DISENO_UX.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Revision de contexto de flujo en `tasks/TASK-113-HANDOFF.md` y decision de arquitectura en `tasks/TASK-119-HANDOFF.md`.
- Revision puntual de contratos/estados en `tasks/TASK-116-HANDOFF.md`, `tasks/TASK-120-HANDOFF.md` y `tasks/TASK-121-HANDOFF.md`.
- No se ejecuto app local, API ni envio de email porque el alcance es copy/documentacion.

Resultado:
Completado. Este handoff define copy UI por estado, plantillas base de email de invitacion, notificacion interna, acuse opcional y reglas de tono/error para que Backend/API y Web Dev implementen sin inventar mensajes.

## Principios de tono

- Claro, breve y operativo.
- Evitar jerga tecnica: no mencionar ACS, Entra, Blob Storage, JWT, token, hash, SQL ni nombres de endpoints al usuario final.
- No prometer activacion inmediata. El flujo aprobado es multiempresa controlado.
- En estados sensibles, no revelar si un correo existe en exceso; usar mensajes que ayuden sin exponer datos.
- El correo de la empresa es el usuario de acceso.
- Las invitaciones expiran en 7 dias, segun decision de TASK-119.
- Usar placeholders seguros en plantillas: nunca incluir tokens en docs, logs o handoffs.

## Copy UI por estado

### Formulario de solicitud de empresa

Titulo:
```text
Registrar empresa
```

Texto de apoyo:
```text
Complete los datos de la empresa. Revisaremos la solicitud y enviaremos una invitacion al correo indicado para crear el acceso.
```

Campos recomendados:
- Nombre de empresa.
- Correo de empresa.
- Direccion.
- Telefono de empresa.
- Nombre de contacto.
- Correo de contacto.
- Telefono de contacto.
- Logo, opcional si la implementacion ya lo permite.

Ayudas de campo:
```text
Correo de empresa
Este correo sera el usuario principal para entrar a Punto Club.
```

```text
Direccion
Use la direccion principal de la empresa.
```

```text
Logo
Puede continuar sin logo y subirlo despues.
```

Accion primaria:
```text
Enviar solicitud
```

Accion secundaria:
```text
Limpiar
```

Validacion general:
```text
Revise los campos marcados antes de enviar la solicitud.
```

Validaciones por campo:
```text
Ingrese el nombre de la empresa.
```

```text
Ingrese un correo de empresa valido.
```

```text
Ingrese la direccion de la empresa.
```

```text
Ingrese un correo de contacto valido.
```

### Solicitud recibida

Titulo:
```text
Solicitud recibida
```

Mensaje:
```text
Recibimos la solicitud de [companyName]. Revisaremos los datos y enviaremos la invitacion al correo [companyEmail] cuando quede aprobada.
```

Detalle opcional:
```text
Tambien notificamos internamente al equipo de Punto Club para dar seguimiento.
```

CTA:
```text
Volver a inicio
```

### Empresa existente

Caso empresa activa:
```text
Ya existe una empresa registrada con ese correo. Inicie sesion o contacte al equipo de Punto Club si necesita recuperar el acceso.
```

CTA primario:
```text
Iniciar sesion
```

CTA secundario:
```text
Contactar soporte
```

Caso solicitud pendiente:
```text
Ya hay una solicitud pendiente para ese correo. Revisaremos la solicitud y enviaremos la invitacion cuando quede aprobada.
```

Caso invitacion pendiente:
```text
Ya hay una invitacion pendiente para ese correo. Revise la bandeja de entrada o solicite un reenvio si Product lo habilita.
```

### Invitacion enviada

Titulo:
```text
Invitacion enviada
```

Mensaje:
```text
Enviamos la invitacion a [companyEmail]. La empresa debe abrir el correo y crear su acceso antes de que expire.
```

Detalle:
```text
La invitacion vence en 7 dias.
```

Estado interno opcional:
```text
Notificacion interna enviada a pj13eros_business@outlook.com.
```

### Invitacion expirada o invalida

Titulo:
```text
Invitacion no disponible
```

Mensaje:
```text
Esta invitacion expiro, ya fue usada o no es valida. Solicite una nueva invitacion para crear el acceso.
```

CTA:
```text
Solicitar nueva invitacion
```

Error si no se permite autoservicio:
```text
Contacte al equipo de Punto Club para recibir una nueva invitacion.
```

### Invitacion aceptada / acceso creado

Titulo:
```text
Acceso creado
```

Mensaje:
```text
El acceso de [companyEmail] quedo creado. Ya puede entrar a Punto Club con ese correo.
```

CTA:
```text
Entrar al panel
```

Nota si la empresa aun requiere activacion/mapeo:
```text
Si aun no puede ver sus operaciones, el equipo de Punto Club debe completar la activacion de la empresa.
```

### Invitacion rechazada o revocada

Titulo:
```text
Invitacion no disponible
```

Mensaje:
```text
Esta invitacion ya no esta disponible. Contacte al equipo de Punto Club para revisar el acceso de la empresa.
```

### Logo pendiente/subido

Logo pendiente:
```text
Logo pendiente. Puede continuar sin logo y subirlo despues desde Mi empresa.
```

Logo subido:
```text
Logo subido correctamente.
```

Logo invalido:
```text
El logo debe ser una imagen PNG, JPG o WebP dentro del limite permitido.
```

### Errores genericos

Error de envio de solicitud:
```text
No se pudo enviar la solicitud. Intente de nuevo.
```

Error de invitacion:
```text
No se pudo enviar la invitacion. Intente de nuevo.
```

Error de acceso:
```text
No se pudo completar el acceso. Intente de nuevo.
```

Rate limit:
```text
Hay demasiados intentos recientes. Espere unos minutos e intente de nuevo.
```

Servicio no disponible:
```text
El servicio no esta disponible en este momento. Intente mas tarde.
```

## Plantilla email de invitacion a empresa

Uso:
- Enviar al correo de empresa o usuario invitado.
- No incluir token visible en texto fuera del CTA/link.
- No registrar el link completo en logs.

Asunto:
```text
Invitacion para activar Punto Club
```

Preheader:
```text
Cree el acceso de su empresa antes de que la invitacion expire.
```

Cuerpo texto simple:
```text
Hola,

Su empresa [companyName] fue invitada a usar Punto Club.

Para crear el acceso, abra el siguiente enlace:
[inviteLink]

Este correo sera su usuario de acceso:
[companyEmail]

La invitacion vence el [expiresAt]. Si vence o usted no solicito este acceso, contacte al equipo de Punto Club.

Gracias,
Equipo Punto Club
```

CTA recomendado:
```text
Crear acceso
```

Version HTML base, si Web/Backend la necesita:
```html
<h1>Active el acceso de su empresa</h1>
<p>Su empresa <strong>[companyName]</strong> fue invitada a usar Punto Club.</p>
<p>Use este correo como usuario de acceso: <strong>[companyEmail]</strong></p>
<p><a href="[inviteLink]">Crear acceso</a></p>
<p>La invitacion vence el [expiresAt].</p>
<p>Si vence o usted no solicito este acceso, contacte al equipo de Punto Club.</p>
<p>Gracias,<br />Equipo Punto Club</p>
```

Nota de expiracion:
```text
Esta invitacion vence en 7 dias.
```

## Plantilla email de notificacion interna

Destino:
```text
pj13eros_business@outlook.com
```

Asunto para solicitud nueva:
```text
Nueva solicitud de empresa en Punto Club: [companyName]
```

Cuerpo texto simple:
```text
Se recibio una nueva solicitud de empresa en Punto Club.

Empresa:
- Nombre: [companyName]
- Correo de empresa: [companyEmail]
- Telefono de empresa: [companyPhone]
- Direccion: [companyAddress]

Contacto:
- Nombre: [contactName]
- Correo: [contactEmail]
- Telefono: [contactPhone]

Estado:
- Solicitud: pending
- Fecha de solicitud: [createdAt]

Accion esperada:
Revise la solicitud. Si corresponde, apruebe la empresa y envie la invitacion de acceso.
```

Asunto para invitacion enviada:
```text
Invitacion enviada en Punto Club: [companyName]
```

Cuerpo texto simple:
```text
Se envio una invitacion de acceso en Punto Club.

Empresa:
- Nombre: [companyName]
- Correo invitado: [inviteEmail]
- Rol: [role]

Invitacion:
- Estado: pending
- Fecha de envio: [createdAt]
- Vence: [expiresAt]

Accion esperada:
Dar seguimiento si la empresa no acepta la invitacion antes del vencimiento.
```

Notas internas:
- No incluir `inviteLink` completo en la notificacion interna salvo decision explicita.
- No incluir tokens, JWT, secrets, connection strings ni SAS.
- Si se necesita correlacion tecnica, usar `registrationRequestId` o `invitationId`.

## Acuse opcional al solicitante

Enviar solo si Product Owner lo aprueba.

Asunto:
```text
Recibimos su solicitud para Punto Club
```

Preheader:
```text
El equipo de Punto Club revisara los datos de su empresa.
```

Cuerpo texto simple:
```text
Hola [contactName],

Recibimos la solicitud de [companyName] para usar Punto Club.

Revisaremos los datos y, si corresponde, enviaremos una invitacion al correo de empresa:
[companyEmail]

Este mensaje confirma la recepcion de la solicitud. Todavia no crea acceso operativo.

Gracias,
Equipo Punto Club
```

CTA:
```text
Sin CTA
```

Recomendacion UX:
- Para piloto controlado, el acuse reduce incertidumbre del solicitante.
- Si Product quiere minimo envio de correos al inicio, omitir acuse y dejar solo mensaje UI de solicitud recibida.

## Mapeo recomendado de estados a copy

| Estado tecnico | Copy visible |
| --- | --- |
| `CompanyRegistrationRequests.pending` | `Solicitud recibida` |
| `CompanyRegistrationRequests.approved` | `Solicitud aprobada` |
| `CompanyRegistrationRequests.rejected` | `Solicitud no aprobada` |
| `CompanyRegistrationRequests.cancelled` | `Solicitud cancelada` |
| `CompanyInvitations.pending` | `Invitacion enviada` |
| `CompanyInvitations.accepted` | `Acceso creado` |
| `CompanyInvitations.revoked` | `Invitacion no disponible` |
| `CompanyInvitations.expired` | `Invitacion expirada` |
| `Companies.pending_activation` | `Empresa pendiente de activacion` |
| `Companies.active` | `Empresa activa` |
| `Companies.inactive` | `Empresa inactiva` |

## Recomendaciones para Backend/API

- Centralizar mensajes por codigo de error para evitar variaciones entre endpoints.
- No devolver detalles tecnicos al usuario final.
- En emails, usar placeholders y render server-side.
- No loggear links completos de invitacion.
- Enviar expiracion en formato legible para la zona horaria definida por Product.
- Mantener `reply-to` controlado por Infra/Product, no usar correos personales como remitente.

## Recomendaciones para Web Dev

- Mantener mensajes cortos en UI; mover detalles largos a texto de ayuda o estado secundario.
- En mobile, no mostrar bloques largos de confirmacion antes del CTA principal.
- Usar el mismo label `Crear acceso` en email y pantalla de invitacion.
- Usar `Iniciar sesion` solo cuando la cuenta ya exista o el acceso este creado.
- No mostrar links de invitacion completos en pantalla.

## Dudas para Product / Architect / Release

1. Confirmar nombre visible del remitente, por ejemplo `Punto Club`.
2. Confirmar si se enviara acuse automatico al solicitante.
3. Confirmar si la solicitud rechazada se comunica por email o solo internamente.
4. Confirmar canal de soporte que debe mostrarse en mensajes: correo, WhatsApp o ninguno por ahora.
5. Confirmar formato de fecha/hora para expiracion en emails.
6. Confirmar si el CTA de invitacion debe decir `Crear acceso` o `Activar cuenta`.
7. Confirmar si el contacto interno debe recibir tambien notificacion cuando una invitacion sea aceptada.

Riesgos o pendientes:
- ACS Email, Entra External ID y storage aun no estan creados/configurados.
- La migracion SQL de registro/invitaciones fue preparada pero no aplicada.
- Estos textos no sustituyen validaciones server-side ni decisiones de autorizacion.

Siguiente recomendado:
Product / Architect / Release debe aprobar tono, remitente, acuse opcional y canal de soporte antes de que Backend/API o Web Dev implementen estos mensajes.
