# TASK-201 - Revisar contratos internos de administracion de empresas

Equipo responsable: Backend API

## Contexto

Punto Club ya tiene registro de empresas, invitaciones, auth propia, operacion autenticada, rate limiting y logo privado aprobados en publicado.

El siguiente bloque funcional es cerrar el ciclo administrable de empresas: revisar solicitudes, aprobar/rechazar y reenviar invitaciones sin depender de operaciones manuales tecnicas.

Actualmente los endpoints internos usan proteccion temporal con `x-puntoclub-admin-token`. Entra External ID sigue diferido.

## Objetivo

Confirmar que los contratos internos necesarios para una UI/admin operativa minima existen, estan documentados y publicados, o identificar gaps pequenos para cerrar antes de Web Dev.

## Alcance

- Revisar contratos y codigo para endpoints internos de:
  - listar solicitudes pendientes/recientes;
  - aprobar solicitud;
  - rechazar solicitud;
  - crear o consultar invitacion owner asociada;
  - reenviar invitacion pendiente.
- Confirmar proteccion con `x-puntoclub-admin-token`.
- Confirmar que respuestas no exponen token raw, token hash, cookies, passwords ni secretos.
- Confirmar estados y errores esperados:
  - sin token;
  - token invalido;
  - solicitud ya procesada;
  - invitacion pendiente/aceptada/expirada.
- Si falta un endpoint minimo para que Web Dev pueda construir panel, implementarlo con tests.
- No cambiar auth principal ni introducir Entra.

## Entregable

Crear o actualizar `tasks/TASK-201-HANDOFF.md` con:

- Resultado.
- Endpoints disponibles y contratos.
- Gaps encontrados o implementados.
- Pruebas ejecutadas.
- Pendientes o bloqueos para Web Dev/QA.
