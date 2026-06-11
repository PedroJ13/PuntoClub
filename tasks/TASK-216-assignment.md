# TASK-216 - Definir contratos para moderacion independiente de imagenes

Equipo responsable: Backend API

## Contexto

Cambio de regla de producto: aprobar servicio y aprobar imagenes son procesos separados.

Una vez un servicio esta aprobado, la empresa puede cargar imagenes asociadas. Administracion debe poder aprobar o declinar cada imagen por separado, sin afectar el servicio ni las demas imagenes.

## Objetivo

Definir contratos Backend/API para moderar imagenes individuales asociadas a un servicio.

## Alcance

- Leer `tasks/TASK-215-HANDOFF.md` si existe.
- Definir o revisar endpoints para:
  - listar imagenes pendientes por servicio;
  - aprobar una imagen individual;
  - rechazar/declinar una imagen individual con motivo opcional o requerido;
  - consultar imagenes aprobadas publicables.
- Confirmar reglas:
  - rechazar una imagen no cambia estado del servicio;
  - rechazar una imagen no afecta otras imagenes;
  - solo imagenes aprobadas se muestran publicamente;
  - imagenes pendientes/rechazadas quedan visibles en administracion.
- Definir errores esperados:
  - servicio no existe;
  - imagen no existe;
  - imagen no pertenece al servicio;
  - imagen ya procesada;
  - permisos insuficientes.
- No implementar codigo salvo que Product / Architect / Release lo pida luego.

## Entregable

Crear o actualizar `tasks/TASK-216-HANDOFF.md` con:

- Contratos propuestos.
- Reglas de negocio confirmadas.
- Estados y errores.
- Dependencias para Web Dev/QA.
