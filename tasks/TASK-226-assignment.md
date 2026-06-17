# TASK-226 - Mejorar pagina publica de registro de empresa

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner espera que `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-registration` abra directamente la pantalla publica de registro de empresa, no la pantalla operativa de una empresa.

Tambien pidio que, despues de registrar una empresa, el formulario desaparezca y quede solo un estado de solicitud recibida.

## Objetivo

Ajustar la experiencia publica de registro de empresa para que sea clara, autocontenida y lista para enviar solicitudes reales.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-223-HANDOFF.md`, `tasks/TASK-224-HANDOFF.md` y `tasks/TASK-225-HANDOFF.md`.
- Ajustar `/company-registration` para mostrar directamente la pantalla de registro de empresa.
- Evitar que se vea la pantalla operativa/menu de empresa cuando la ruta es publica.
- Mejorar visual y copy del mensaje de solicitud recibida.
- Despues de solicitud exitosa:
  - ocultar o reemplazar el formulario;
  - mostrar resumen seguro de la solicitud;
  - ofrecer accion clara para enviar otra solicitud solo si Product/UX lo definio.
- Agregar campo/control de logo si Backend/API lo soporta.
- Mantener validaciones y estados de error claros.
- No exponer tokens ni datos sensibles.

## Entregable

Crear o actualizar `tasks/TASK-226-HANDOFF.md` con:

- Cambios realizados.
- Rutas/pantallas afectadas.
- Estados validados.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA.
