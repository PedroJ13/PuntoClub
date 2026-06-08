# TASK-141 - Crear pantalla publica de invitacion y validacion de token

Equipo responsable: Web Dev

## Contexto

TASK-132 expone `GET /api/company-invitations/validate?token=...`.
Los emails de invitacion usan el path publico `/company-invitations/accept?token=...`.
Entra External ID sigue pendiente, por lo que no se debe prometer creacion final de password en esta tarea.

## Objetivo

Crear una pantalla publica para links de invitacion que valide el token y muestre estados claros, sin implementar login/password real.

## Alcance

1. Detectar ruta o query de invitacion:
   - `/company-invitations/accept?token=...`
   - compatible con Static Web Apps y navegacion directa.
2. Llamar a `GET /api/company-invitations/validate?token=...`.
3. Mostrar estados:
   - cargando;
   - invitacion valida;
   - token invalido;
   - token expirado;
   - invitacion aceptada;
   - invitacion revocada;
   - error de servicio.
4. Si la invitacion es valida, mostrar datos no sensibles devueltos por API y una accion `Crear acceso` deshabilitada o mensaje claro de que la creacion de acceso se habilitara cuando el login este listo.
5. Mantener Operaciones/Mi empresa/Reportes sin regresion.
6. Agregar soporte mock local para estados principales.

## Fuera de alcance

- No implementar MSAL/Entra login.
- No pedir password local.
- No llamar `POST /api/company-invitations/accept`.
- No guardar tokens en localStorage/sessionStorage.
- No mostrar token completo en pantalla.

## Validacion esperada

- `node --check app/src/app.js`.
- `node --check app/src/customerApi.js`.
- Smoke local con token valido mock, invalido y expirado.
- Verificar desktop/mobile sin overflow horizontal.

## Entrega

Actualizar `tasks/TASK-141-HANDOFF.md`.
