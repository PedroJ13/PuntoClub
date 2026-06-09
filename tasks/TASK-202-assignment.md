# TASK-202 - Definir UX minima para panel interno de empresas

Equipo responsable: Diseno / UX

## Contexto

Se necesita una forma operativa y clara de revisar solicitudes de empresa, aprobar/rechazar y reenviar invitaciones. Esta UI sera interna/controlada, no SaaS publico completo.

La proteccion temporal sigue siendo `x-puntoclub-admin-token`; no se debe prometer login admin final todavia.

## Objetivo

Definir flujo, copy y estados minimos para un panel interno de administracion de empresas.

## Alcance

- Proponer estructura de pantalla para:
  - ingresar token interno temporal sin guardarlo de forma persistente;
  - listar solicitudes pendientes/recientes;
  - ver detalle de solicitud;
  - aprobar;
  - rechazar con motivo;
  - ver invitacion asociada sin exponer link/token;
  - reenviar invitacion pendiente.
- Definir copy para confirmaciones, errores y estados vacios.
- Incluir recomendaciones de seguridad:
  - no mostrar tokens;
  - no guardar token en localStorage;
  - no mostrar links completos;
  - no exponer secretos en handoff.
- Mantener diseño funcional, simple y consistente con Punto Club actual.
- No implementar codigo.

## Entregable

Crear o actualizar `tasks/TASK-202-HANDOFF.md` con:

- Flujo propuesto.
- Copy recomendado.
- Estados de UI.
- Reglas de seguridad UX.
- Dependencias para Web Dev.
