# TASK-223 - Handoff Diseno/UX

Equipo: Diseno/UX

Modo de ejecucion: Diseno/UX

## Resultado

Completado.

Se definio propuesta UX/copy concreta para refinar el flujo publico de registro de empresa, emails, panel interno `Admin empresas`, aprobacion y uso de logo.

## Decisiones UX

### Pagina publica de registro de empresa

- `/company-registration` debe renderizar una experiencia publica autocontenida, sin menu lateral operativo ni estado de empresa activa.
- La pantalla debe enfocarse en una sola accion: enviar solicitud de empresa.
- El formulario debe incluir datos de empresa, datos de contacto y logo opcional.
- El logo se trata como identidad visual inicial, no como requisito para solicitar acceso.
- El formulario debe indicar tipos permitidos sin ruido tecnico: PNG, JPG o WebP.

### Estado posterior a solicitud enviada

- Despues de enviar correctamente, el formulario desaparece.
- Se muestra un estado de confirmacion con resumen seguro:
  - nombre de empresa;
  - correo de empresa;
  - correo de contacto;
  - estado `En revision`.
- No mostrar links internos, tokens, IDs tecnicos ni informacion de aprobacion.
- Accion secundaria permitida: `Enviar otra solicitud`, visible pero discreta.

### Correos

- Correo al solicitante: tono claro, confirma recepcion y explica siguiente paso.
- Correo interno: orientado a accion, con resumen de solicitud y llamada a revisar en `Admin empresas`.
- Invitacion: mantener foco en activar acceso, con advertencia de vigencia y seguridad.
- Todos los correos deben tener version HTML simple y version texto plano.
- No incluir tokens en logs ni respuestas no autorizadas; el link de invitacion solo va en el correo de invitacion.

### Panel `Admin empresas`

- `Admin empresas` debe sentirse como modulo interno separado de la operacion normal.
- La pantalla puede seguir dentro de la app, pero debe tener encabezado propio: `Admin empresas`.
- Debe evitar mezclar acciones operativas de clientes/compras con revision interna.
- Despues de validar token, el panel de acceso se colapsa a una franja compacta.
- La franja muestra: `Acceso interno activo` y accion `Cambiar token`.
- No guardar token en `localStorage` ni `sessionStorage`.

### Card resumen de solicitud

- Cada card debe mostrar:
  - nombre de empresa;
  - correo de empresa;
  - contacto;
  - fecha de solicitud;
  - estado;
  - indicador de logo si existe;
  - acciones `Ver detalle` y `Aprobar`.
- `Aprobar` aparece en la card solo para solicitudes `pending`.
- `Ver detalle` abre drawer lateral derecho.

### Drawer lateral de detalle

- El detalle de solicitud abre en panel lateral derecho, no reemplaza toda la pagina.
- El drawer debe incluir:
  - datos completos de empresa;
  - datos completos de contacto;
  - preview de logo si existe;
  - nota de revision;
  - acciones `Aprobar`, `Rechazar` y `Cerrar`.
- En mobile, el drawer puede ocupar pantalla completa como panel modal.

### Modal de confirmacion de aprobacion

- No usar `window.confirm`.
- Usar modal dentro de la app.
- El modal debe mostrar nombre de empresa, correo y puntos iniciales.
- Botones: `Cancelar` y `Aprobar empresa`.
- Si la aprobacion genera invitacion, el modal debe aclarar que se enviara invitacion por correo, sin mostrar link/token.

### Logo en registro y operacion

- El registro publico debe permitir logo opcional.
- Al aprobar, el logo solicitado debe quedar asociado a la empresa creada si Backend/API lo puede transferir.
- La operacion de empresa debe mostrar logo en un lugar persistente:
  - recomendado: cabecera superior junto a `Empresa activa`;
  - fallback: iniciales o monograma con nombre de empresa.
- En responsive, el logo no debe competir con acciones principales de caja; debe mantenerse pequeno y estable.

## Copy propuesto

### Registro publico

Titulo:

```text
Solicitar acceso para mi empresa
```

Texto de apoyo:

```text
Envianos los datos de tu empresa. Revisaremos la solicitud y, si todo esta correcto, enviaremos una invitacion para crear el acceso.
```

Logo:

```text
Logo de la empresa
```

Ayuda de logo:

```text
Opcional. PNG, JPG o WebP.
```

Boton:

```text
Enviar solicitud
```

### Solicitud recibida

Titulo:

```text
Solicitud recibida
```

Mensaje:

```text
Gracias. Revisaremos la informacion y enviaremos la invitacion al correo de contacto cuando la empresa sea aprobada.
```

Estado:

```text
Estado: En revision
```

Accion secundaria:

```text
Enviar otra solicitud
```

### Correo al solicitante

Asunto:

```text
Recibimos tu solicitud en Punto Club
```

HTML/texto base:

```text
Hola,

Recibimos la solicitud para {companyName}.

Nuestro equipo revisara la informacion. Si la solicitud es aprobada, enviaremos una invitacion al correo de contacto para crear el acceso de la empresa.

Gracias por elegir Punto Club.
```

### Correo interno

Asunto:

```text
Nueva solicitud de empresa: {companyName}
```

Texto base:

```text
Hay una nueva solicitud de empresa pendiente de revision.

Empresa: {companyName}
Correo empresa: {companyEmail}
Contacto: {contactName}
Correo contacto: {contactEmail}
Logo: {logoStatus}

Revisala desde Admin empresas.
```

`logoStatus` debe ser `Adjunto` o `No incluido`.

### Modal aprobar

Titulo:

```text
Aprobar empresa
```

Mensaje:

```text
Se creara la empresa {companyName} y se enviara una invitacion al correo de contacto. No se mostrara el link de invitacion en pantalla.
```

Botones:

```text
Cancelar
Aprobar empresa
```

### Token interno activo

```text
Acceso interno activo
```

```text
Cambiar token
```

## Estados esperados

- Registro publico:
  - inicial;
  - enviando;
  - error de validacion;
  - conflicto por empresa existente/solicitud pendiente;
  - solicitud recibida.
- Logo:
  - sin archivo;
  - archivo seleccionado con nombre/preview;
  - tipo no permitido;
  - archivo muy grande;
  - subiendo/enviando;
  - enviado correctamente.
- Admin:
  - token pendiente;
  - token valido;
  - token invalido;
  - cargando solicitudes;
  - lista vacia;
  - lista con cards;
  - drawer abierto;
  - modal aprobar;
  - aprobando;
  - aprobado;
  - error controlado.

## Recomendaciones por pantalla

### `/company-registration`

- Debe inicializar como pagina publica aunque exista sesion previa.
- No debe llamar a `showMainApp` ni renderizar menu operativo.
- Debe ocultar formulario despues de `201`.
- Debe mantener solo resumen seguro de la solicitud.

### `Admin empresas`

- Agregar encabezado visual separado.
- Mantener token en memoria.
- Colapsar panel de token despues de validacion.
- Agregar boton `Aprobar` en cards pending.
- Mover detalle a drawer.
- Reemplazar confirmacion nativa con modal in-app.

### Operacion autenticada

- Mostrar identidad visual de empresa en cabecera: logo o fallback con iniciales.
- Refrescar logo/fallback despues de login, logout y cambios en `Mi empresa`.

## Dependencias para Backend/API o Web Dev

Backend/API:

- Confirmar si `CompanyRegistrationRequests` ya tiene `requested_logo_blob_path` y `requested_logo_content_type`.
- Permitir logo opcional en solicitud publica, idealmente `multipart/form-data`.
- Al aprobar, copiar/transferir referencia de logo desde solicitud a `Companies.logo_blob_path`, `logo_content_type`, `logo_updated_at`.
- Devolver indicador seguro de logo en listado interno: por ejemplo `requestedLogo: { available: true, contentType: "image/png" }`.
- No exponer blob path, SAS largo, token ni hash.
- Mejorar emails con HTML simple y texto plano.

Web Dev:

- Crear ruta publica autocontenida para `/company-registration`.
- Agregar control de logo opcional.
- Ocultar formulario despues de exito.
- Separar visualmente Admin empresas.
- Implementar drawer y modal in-app.
- Mostrar logo/fallback de empresa activa.

## Riesgos o pendientes

- Si Backend/API no soporta aun logo en solicitud, Web debe ocultar el upload o dejarlo deshabilitado hasta TASK-225.
- Si la aprobacion crea empresa pero falla transferencia de logo, debe aprobarse la empresa y reportar error controlado; no bloquear toda la operacion salvo decision tecnica contraria.
- El logo de solicitud no debe hacerse publico ni servirse sin autorizacion hasta que Backend/API defina una ruta segura.
