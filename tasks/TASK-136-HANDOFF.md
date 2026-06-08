Equipo:
Web Dev

Tarea completada:
TASK-136 - Crear UI de solicitud de empresa.

Archivos modificados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-136-HANDOFF.md`

Cambios realizados:
- Agregue en `Mi empresa` el formulario `Registrar empresa` con los campos del contrato final: nombre, correo, direccion y telefono de empresa; nombre, correo y telefono de contacto.
- Integre el submit con `POST /api/company-registration-requests` mediante `createCompanyRegistrationRequest`.
- Agregue soporte mock local para validar solicitud creada, empresa existente y solicitud pendiente sin tocar API real.
- Aplique el copy de `tasks/TASK-123-HANDOFF.md` para texto de apoyo, ayudas, acciones, validaciones, solicitud recibida y errores esperados.
- Mantengo fuera de UI login, accept invite, password y upload real de logo.

Estados cubiertos:
- Solicitud enviada: muestra `Solicitud recibida` y mensaje con empresa/correo.
- Validaciones: muestra `Revise los campos marcados antes de enviar la solicitud.` y errores por campo.
- Empresa existente: mapea `COMPANY_ALREADY_EXISTS`.
- Solicitud existente: mapea `REGISTRATION_ALREADY_PENDING`.
- Invitacion pendiente: mapea `INVITATION_ALREADY_PENDING` por compatibilidad de contrato.
- Rate limit: mapea `RATE_LIMITED`.
- Servicio no disponible: mapea `SERVICE_UNAVAILABLE`.
- Error generico: muestra `No se pudo enviar la solicitud. Intente de nuevo.`

Validacion local:
- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- `rg -n "[^\\x00-\\x7F]" app/index.html app/src/app.js app/src/customerApi.js app/styles.css tasks/TASK-136-HANDOFF.md`: sin resultados.
- Smoke local en `http://127.0.0.1:4185/index.html` con `app-config.js` interceptado en mock:
  - Formulario visible en `Mi empresa` con titulo `Registrar empresa`.
  - Submit vacio muestra validacion general y errores de nombre, correo de empresa, direccion y correo de contacto.
  - Solicitud nueva muestra `Solicitud recibida` y mensaje con empresa/correo.
  - Correo de empresa existente muestra copy de `COMPANY_ALREADY_EXISTS`.
  - Reenvio con el mismo correo mock muestra copy de `REGISTRATION_ALREADY_PENDING`.
  - Navegacion a `Operaciones` y `Reportes` sigue funcionando.
  - Sin overflow horizontal en desktop y viewport movil 390x844.

Validacion publicada:
- No ejecutada en esta tarea para evitar crear solicitudes reales adicionales desde la UI publicada.
- Se toma como antecedente que QA aprobo el endpoint publicado en TASK-133.

Riesgos / pendientes:
- La UI publica dependera de que el deploy incluya este cambio y que CORS permita el origen publicado.
- El flujo sigue sin login, invitaciones y logo upload real por alcance explicito.
- El mensaje de empresa existente menciona iniciar sesion, pero el login todavia no esta implementado; se conserva por ser copy aprobado en TASK-123.
