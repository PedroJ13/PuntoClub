# TASK-181 - Validar operacion publicada con empresa autenticada

Equipo responsable: QA

## Contexto

TASK-177 cerro auth propia MVP con evidencia Product Owner. TASK-179 y TASK-180 deben conectar la operacion real con la empresa autenticada.

Esta tarea queda lista para ejecutarse despues de que Backend/API y Web Dev indiquen en sus handoffs que los cambios estan publicados o listos en ambiente publicado.

## Objetivo

Validar en ambiente publicado que la operacion usa la empresa de la sesion y que no hay regresion del flujo operativo principal.

## Alcance

- Iniciar sesion con usuario de empresa QA/controlado.
- Confirmar empresa/correo visible.
- Validar que operaciones funcionan bajo sesion:
  - buscar/registrar cliente;
  - registrar compra;
  - redimir puntos;
  - ver historial/resumen;
  - consultar reporte;
  - consultar auditoria si aplica.
- Confirmar que logout limpia sesion y que la UI queda en estado coherente.
- Validar que frontend no depende de `companyId` editable/enviado como autoridad.
- Confirmar que no se expone token, cookie ni password en UI/logs/handoff.
- Revisar regresion basica responsive desktop/mobile.

## Entregable

Crear o actualizar `tasks/TASK-181-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Flujos probados.
- Evidencia redaccionada.
- P0/P1/P2/P3 encontrados.
- Pendientes o bloqueos.
