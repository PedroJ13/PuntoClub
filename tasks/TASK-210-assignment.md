# TASK-210 - Validar transicion despues de login exitoso

Equipo responsable: QA

## Contexto

TASK-209 corrige el hallazgo reportado por Product Owner: la pantalla muestra `Sesion iniciada.` y `Empresa activa`, pero al presionar `Entrar` permanece en login.

## Objetivo

Validar en publicado que una empresa con sesion activa o login exitoso puede llegar al panel operativo sin quedarse atrapada en la pantalla de login.

## Alcance

- Leer `tasks/TASK-209-HANDOFF.md`.
- Validar publicado con cuenta de empresa disponible o evidencia segura de Product Owner:
  - login con correo/password valido;
  - transicion al panel operativo;
  - refrescar con sesion activa;
  - cerrar sesion;
  - volver a login.
- Validar regresion basica:
  - `/api/me` sin sesion responde `401`;
  - operaciones privadas siguen protegidas sin sesion;
  - solicitud publica de empresa sigue disponible;
  - pantalla de invitacion sigue renderizando.
- No registrar passwords, cookies, tokens ni secretos.

## Entregable

Crear o actualizar `tasks/TASK-210-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
