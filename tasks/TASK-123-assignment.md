# TASK-123 - Definir copy de registro, invitacion y correos de empresa

## Equipo

Diseno / UX

## Prioridad

P1

## Contexto

Punto Club avanzara a multiempresa controlado. El flujo incluye:

- Solicitud/registro de empresa.
- Notificacion interna a `pj13eros_business@outlook.com`.
- Invitacion por correo a la empresa.
- Creacion de acceso con correo como usuario.
- Estados de invitacion pendiente, enviada, expirada, aceptada o rechazada.

Infra recomienda Azure Communication Services Email, pero aun no se crean recursos ni se configura dominio/remitente.

## Objetivo

Definir el texto UX y las plantillas base de email para el flujo de registro/invitacion, sin implementar UI ni enviar correos.

## Alcance

- Definir copy para UI:
  - formulario de solicitud de empresa;
  - solicitud recibida;
  - empresa existente;
  - invitacion enviada;
  - invitacion expirada/invalida;
  - acceso creado;
  - errores genericos.
- Definir plantilla de correo para invitacion a empresa:
  - asunto;
  - preheader opcional;
  - cuerpo texto simple;
  - CTA;
  - aviso de expiracion.
- Definir plantilla de notificacion interna a `pj13eros_business@outlook.com`:
  - asunto;
  - datos minimos de empresa/contacto;
  - accion esperada.
- Definir acuse opcional al solicitante si Product Owner lo aprueba.
- Mantener tono profesional, claro y breve.
- No incluir secretos ni links reales con tokens.

## Fuera de alcance

- Implementar frontend.
- Implementar backend.
- Crear recursos ACS Email.
- Diseñar branding visual final.

## Entregable

Crear `tasks/TASK-123-HANDOFF.md` con:

- Copy UI por estado.
- Plantilla email de invitacion.
- Plantilla email de notificacion interna.
- Recomendaciones de tono/errores.
- Dudas para Product / Architect / Release.

## Validacion esperada

Backend/API y Web Dev deben poder usar el handoff como base de mensajes sin inventar copy durante implementacion.
