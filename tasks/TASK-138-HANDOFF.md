# TASK-138 HANDOFF - QA

## Resultado

Aprobado.

La UI publicada muestra `Registrar empresa` dentro de `Mi empresa`, valida campos requeridos sin enviar datos incompletos y permite crear una solicitud controlada con mensaje `Solicitud recibida`. Los endpoints internos sin token responden `403` y el flujo operativo existente sigue funcionando. No encontre P0/P1 abiertos.

## Ambiente probado

- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba: `2026-06-07`
- Empresa piloto para regresion operativa: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## UI publicada

Fuente publicada:

- `index.html` contiene `Registrar empresa` y `company-registration-form`.
- `src/app.js` contiene logica de registro de empresa y `Solicitud recibida`.
- `src/customerApi.js` contiene `company-registration-requests`.

Navegacion:

- App abre con `API real`.
- `Mi empresa` visible en el menu.
- En `Mi empresa` aparece formulario `Registrar empresa`.

Campos visibles:

- `Nombre de empresa`
- `Correo de empresa`
- `Direccion`
- `Telefono de empresa`
- `Nombre de contacto`
- `Correo de contacto`
- `Telefono de contacto`
- Botones `Limpiar` y `Enviar solicitud`

Responsive:

- Desktop `1366x900`: sin overflow horizontal.
- Mobile `390x900`: sin overflow horizontal.
- Formulario `Registrar empresa` visible en mobile; ancho aproximado `336px`.

## Validaciones UI

Submit vacio:

- No se enviaron datos incompletos.
- La UI mostro validacion general `Revise los campos marcados...`.
- Se observaron errores/indicadores para:
  - nombre de empresa;
  - correo de empresa;
  - direccion;
  - correo de contacto.

## Solicitud QA creada

Solicitud confirmada desde UI:

- Empresa: `QA UI Registro TASK-138 retry 486476`
- Correo empresa: `qa-ui-reg-retry-486476@example.com`
- Direccion: `San Jose QA UI TASK-138 retry 486476`
- Telefono empresa: `+5067486476`
- Contacto: `QA UI Contact retry 486476`
- Correo contacto: `qa-ui-contact-retry-486476@example.com`
- Telefono contacto: `+5068486476`

Resultado UI:

- Mensaje visible: `Solicitud recibida`.
- Texto visible:
  - `Recibimos la solicitud de QA UI Registro TASK-138 retry 486476.`
  - `...enviaremos la invitacion al correo qa-ui-reg-retry-486476@example.com cuando quede aprobada.`
  - `Tambien notificamos internamente al equipo de Punto Club para dar seguimiento.`

Nota operativa:

- El submit mostro `Enviando...` durante aproximadamente 12 segundos antes de confirmar.
- No se valido recepcion real de correos, invitaciones, login, logo upload ni Entra External ID porque estan fuera de alcance.

## Seguridad interna sin token

Endpoints probados sin `x-puntoclub-admin-token`:

- `POST /api/company-registration-requests/1/approve` -> `403`
- `POST /api/company-registration-requests/1/reject` -> `403`
- `POST /api/company-invitations` -> `403`
- `POST /api/company-invitations/1/resend` -> `403`

Resultado:

- Los endpoints internos no quedan abiertos sin token.
- No se uso token admin real.
- No se pegaron secretos en el handoff.

## Invitacion invalida

Endpoint:

```text
GET /api/company-invitations/validate?token=valor-invalido
```

Resultado:

- `400 Bad Request`

Conclusion:

- La ruta publica de validacion rechaza token invalido de forma controlada.

## Regresion flujo operativo existente

Datos QA operativos creados:

- Cliente:
  - `Task 138 Cliente 719246`
  - telefono `+5069719246`
  - email `task138-719246@example.com`
- Compra:
  - factura `T138-P-719246`
  - fecha `2026-06-07`
  - monto `1000`
- Redencion:
  - puntos `10`
  - nota `TASK-138 canje 719246`

Validado en UI:

- Cliente creado y visible.
- Compra registrada.
- Canje registrado.
- Balance/historial visible tras canje.
- Reporte operativo carga y muestra factura `T138-P-719246`.
- Auditoria operativa carga y muestra eventos del cliente/factura.

## Hallazgos

### P0/P1

Ninguno.

### P2

Ninguno.

### P3

- El submit de `Registrar empresa` puede tardar alrededor de 12 segundos mostrando `Enviando...` antes de confirmar. No bloquea el flujo, pero conviene vigilarlo si ACS/email agrega latencia perceptible.

## Datos QA creados

Confirmados:

- Solicitud de empresa `QA UI Registro TASK-138 retry 486476`.
- Cliente operativo `Task 138 Cliente 719246`.
- Compra `T138-P-719246`.
- Redencion `TASK-138 canje 719246`.

Nota:

- Hubo un primer intento UI con datos `QA UI Registro TASK-138 719246` que se abandono antes de observar confirmacion porque el submit seguia en `Enviando...`; la solicitud confirmada y usada como evidencia es la de `retry 486476`.

## No probado por alcance

- Crear empresa real aprobada.
- Enviar o aceptar invitaciones reales.
- Login/password.
- Upload real de logo.
- Entra External ID.
- Uso de token admin real.

## Siguiente recomendado

Product / Architect / Release puede continuar con las siguientes tareas de invitaciones/acceso/logo sabiendo que la UI publica de solicitud y la proteccion interna sin token funcionan.
