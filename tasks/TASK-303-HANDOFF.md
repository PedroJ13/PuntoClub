# TASK-303 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Completed
Fecha: 2026-06-16

## Resultado

Se aplico copy server-side de correos segun `tasks/TASK-302-HANDOFF.md`.

No se cambiaron contratos publicos.
No se agregaron logs con tokens.
No se expusieron links reales ni secretos en el handoff.

## Correos tocados

- Solicitud recibida por empresa.
- Notificacion interna de nueva solicitud.
- Invitacion a empresa aprobada.
- Notificacion interna de invitacion enviada.

No se implemento correo de `Acceso creado` porque no existe actualmente un flujo server-side que envie ese correo.
No se tocaron correos de membresia porque no existen correos server-side de membresias en el codigo actual.

## Archivos tocados

- `api/src/lib/notifier.js`

## Cambios realizados

- Se agregaron tildes y tono mas natural en plantillas de correo.
- Se alinearon asuntos y cuerpos con TASK-302.
- Se mejoro la estructura de los correos internos con bloques de `Empresa`, `Contacto` y `Accion esperada`.
- Se mantuvo el link con token solo en el correo del invitado.
- La notificacion interna de invitacion no contiene token ni link completo.

## Tests ejecutados

Primero fallo dentro del sandbox:

- `node --test test/company-registration.test.js test/company-invitations.test.js`: fallo con `spawn EPERM`.

Reintento autorizado fuera del sandbox:

- `node --test test/company-registration.test.js test/company-invitations.test.js`: OK, 23 tests pasan.

## Riesgos o notas para QA

- Los correos ahora contienen Unicode/tildes; validar render en ACS/mailbox real en la siguiente prueba de correo.
- Si QA valida asuntos exactos, considerar que la notificacion interna de invitacion ahora usa `Invitación enviada en Punto Club: {empresa}`.
- No se hizo envio real de correo; solo validacion de plantillas y adapter inyectado.
