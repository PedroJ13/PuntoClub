# TASK-207 - Validar operacion interna con token real sin exponer secretos

Equipo responsable: PO Test

## Contexto

QA puede validar negativos sin token, pero no debe manejar ni publicar el valor real de `x-puntoclub-admin-token`. Para cerrar el flujo interno completo puede hacer falta evidencia de Product Owner usando el token por canal seguro.

Esta tarea depende de TASK-205 y TASK-206 publicados.

## Objetivo

Validar como Product Owner que el panel interno permite operar solicitudes de empresa con token real, sin exponer el token ni links de invitacion.

## Alcance

- Abrir la Web publicada.
- Entrar al panel `Admin empresas`.
- Ingresar el token interno real sin capturarlo ni pegarlo en handoff.
- Validar una ruta operativa segura:
  - listar solicitudes;
  - aprobar una solicitud de prueba si hay una disponible; o documentar que no hay pendientes;
  - rechazar una solicitud de prueba solo si existe una solicitud creada para eso;
  - reenviar una invitacion pendiente si aplica.
- Confirmar visualmente que la UI no muestra:
  - token interno;
  - token de invitacion;
  - link completo de invitacion;
  - cookies;
  - passwords;
  - connection strings.
- Evidencia permitida: capturas redaccionadas, IDs, estados, timestamps y mensajes de exito/error sin secretos.

## Entregable

Crear o actualizar `tasks/TASK-207-HANDOFF.md` con:

- Resultado: aprobado, bloqueado o no aprobado.
- Acciones ejecutadas.
- Evidencia redaccionada.
- Confirmacion explicita de que no se expuso el token interno ni link de invitacion.
- Pendientes para QA si aplica.
