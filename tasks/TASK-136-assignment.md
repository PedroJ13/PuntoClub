# TASK-136 - Crear UI de solicitud de empresa

## Equipo

Web Dev

## Prioridad

P1

## Contexto

La API publicada ya expone `POST /api/company-registration-requests` y QA la aprobo en TASK-133. Falta una UI para que una empresa envie solicitud desde `Mi empresa` o una seccion equivalente, sin activar login/invitaciones todavia.

## Objetivo

Implementar UI de solicitud de empresa usando el contrato final, sin login ni accept invite.

## Alcance

- En `Mi empresa`, agregar modo/formulario de solicitud de empresa cuando aplique.
- Campos:
  - nombre de empresa;
  - correo de empresa;
  - direccion;
  - telefono de empresa;
  - nombre de contacto;
  - correo de contacto;
  - telefono de contacto.
- Enviar a `POST /api/company-registration-requests`.
- Usar copy de `tasks/TASK-123-HANDOFF.md`.
- Mostrar estados:
  - solicitud enviada;
  - validaciones;
  - empresa/solicitud ya existente;
  - error generico.
- No implementar login.
- No implementar accept invite.
- No implementar upload real de logo.
- No mostrar ni pedir password.
- Mantener flujo operativo actual intacto.

## Fuera de alcance

- Auth/Entra.
- Invitaciones.
- Admin approve/reject.
- Logo upload real.
- Cambios API.

## Entregable

Crear `tasks/TASK-136-HANDOFF.md` con:

- Archivos modificados.
- Validacion local/publicada si aplica.
- Estados cubiertos.
- Riesgos.

## Validacion esperada

QA debe poder validar que una solicitud de empresa se puede crear desde la UI sin romper Operaciones, Mi empresa ni Reportes.
