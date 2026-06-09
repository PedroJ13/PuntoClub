# TASK-203 - Crear panel interno de administracion de empresas

Equipo responsable: Web Dev

## Contexto

TASK-201 debe confirmar contratos Backend/API y TASK-202 debe definir UX minima. El objetivo es que Product Owner pueda gestionar solicitudes de empresa de forma controlada sin hacer llamadas manuales.

La autenticacion admin final con Entra sigue diferida. Para este MVP controlado se usa token interno temporal en memoria de la sesion del navegador.

## Objetivo

Implementar una UI interna minima para administrar solicitudes de empresa e invitaciones.

## Alcance

- Depende de TASK-201 y TASK-202.
- Crear una ruta/seccion interna, por ejemplo `Admin empresas` o ruta equivalente.
- Permitir ingresar `x-puntoclub-admin-token`:
  - no guardarlo en localStorage;
  - mantenerlo solo en memoria mientras la pagina esta abierta;
  - permitir limpiarlo.
- Listar solicitudes pendientes/recientes segun contrato disponible.
- Permitir aprobar solicitud.
- Permitir rechazar solicitud con motivo.
- Mostrar resultado de invitacion sin token/link raw.
- Permitir reenviar invitacion pendiente si el contrato lo soporta.
- Manejar errores:
  - token faltante;
  - token invalido;
  - solicitud ya procesada;
  - invitacion ya aceptada/expirada;
  - error API controlado.
- No mostrar secretos, tokens raw, links completos, cookies ni passwords.
- Mantener responsive basico.

## Entregable

Crear o actualizar `tasks/TASK-203-HANDOFF.md` con:

- Resultado.
- Ruta/seccion implementada.
- Contratos usados.
- Estados cubiertos.
- Pruebas ejecutadas.
- Pendientes o bloqueos.
