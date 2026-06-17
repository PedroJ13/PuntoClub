# TASK-223 - Definir ajustes UX del flujo empresa y admin

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Diseno/UX

## Contexto

Product Owner hizo una prueba visual del flujo de empresa y encontro fricciones en:

- `/company-registration` abre la app operativa en vez de mostrar directamente registro de empresa.
- Mensaje de solicitud recibida necesita mejor texto y presentacion.
- Despues de registrar empresa, el formulario no deberia seguir visible.
- Correos de solicitud y notificacion interna necesitan mejor formato visual y texto.
- `Admin empresas` aparece dentro de la misma pagina operativa y se siente mezclado.
- Al validar token interno, el panel de acceso deberia colapsar.
- La accion de aprobar deberia estar disponible desde el resumen y desde el detalle.
- El detalle de solicitud deberia abrir como panel lateral derecho.
- La confirmacion de aprobar no debe usar confirmacion nativa del navegador; debe ser un modal/confirmacion dentro de la app.
- El registro de empresa debe contemplar logo, que luego se mostrara visualmente en la pantalla operativa de esa empresa.

## Objetivo

Definir una propuesta UX/copy concreta y pequena para que Backend/API y Web Dev implementen sin ambiguedad.

## Alcance

- Revisar `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS.md` y pantallas actuales si hace falta.
- Definir comportamiento esperado para:
  - pagina publica de registro de empresa;
  - estado posterior a solicitud enviada;
  - correos de confirmacion e interno;
  - panel `Admin empresas`;
  - token interno activo/colapsado;
  - card resumen de solicitud;
  - drawer lateral de detalle;
  - modal de confirmacion de aprobacion;
  - captura/carga de logo en registro de empresa;
  - uso del logo en encabezado o area operativa de empresa.
- Entregar copy sugerido para mensajes principales.
- Mantener enfoque operativo, no rediseño completo de marca/colores.

## Entregable

Crear o actualizar `tasks/TASK-223-HANDOFF.md` con:

- Decisiones UX.
- Copy propuesto.
- Estados esperados.
- Recomendaciones por pantalla.
- Dependencias para Backend/API o Web Dev.
- Riesgos o pendientes.
