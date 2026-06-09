# TASK-204 - Validar panel interno de empresas publicado

Equipo responsable: QA

## Contexto

TASK-203 implementara panel interno para revisar/aprobar/rechazar solicitudes y reenviar invitaciones usando el token interno temporal. Esta validacion debe confirmar que el flujo funciona publicado sin exponer secretos.

## Objetivo

Validar en ambiente publicado el panel interno de administracion de empresas y sus controles de seguridad.

## Alcance

- Revisar handoffs TASK-201, TASK-202 y TASK-203.
- Validar que sin token o con token invalido no se puede operar.
- Validar con evidencia segura o ejecucion controlada:
  - listar solicitudes;
  - aprobar una solicitud de prueba;
  - rechazar una solicitud de prueba o validar estado si no hay solicitud disponible;
  - reenviar invitacion pendiente si aplica.
- Confirmar que UI no muestra:
  - token raw;
  - link completo de invitacion;
  - token de invitacion;
  - cookies;
  - passwords;
  - connection strings.
- Confirmar que el token interno no queda en localStorage.
- Revisar regresion basica:
  - solicitud publica de empresa;
  - invitacion/crear acceso;
  - operacion autenticada;
  - `Mi empresa`/logo.

## Entregable

Crear o actualizar `tasks/TASK-204-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
