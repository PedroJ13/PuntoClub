Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / UX refinamiento
Tarea completada: TASK-647 - Definir refinamiento UX de envio de campanas

Decision UX:
- `Enviar campanas` debe priorizar la accion operativa:
  1. elegir campana guardada o crear borrador;
  2. seleccionar destinatarios;
  3. enviar con confirmacion;
  4. leer resultado.
- El preview queda como apoyo secundario, colapsado por default.
- La seleccion manual y el limite MVP de 5 destinatarios se mantienen sin cambios.

Layout recomendado:
- Panel principal `Enviar campanas`:
  - selector de campana guardada arriba;
  - formulario `Crear campana` colapsable como ya existe;
  - bloque de accion de envio debajo del selector/formulario;
  - mensaje de regla MVP junto al boton;
  - panel de resultado inmediatamente debajo del boton.
- Panel `Preview`:
  - colapsado por default;
  - boton `Ver preview` / `Ocultar preview`;
  - al abrir, muestra asunto, cuerpo, puntos y variables disponibles.
- Panel `Seleccionar destinatarios`:
  - mantiene conteo `0 seleccionados de 5`;
  - acciones rapidas visibles;
  - lista de clientes como foco principal de trabajo.

Boton `Enviar campana`:
- Debe permanecer en el panel principal, debajo de la campana seleccionada.
- Debe estar visualmente cerca del texto que explica:
  - requiere campana guardada;
  - requiere destinatarios seleccionados;
  - requiere confirmacion;
  - feature flag activo.
- No debe vivir dentro del preview.
- No debe quedar al final de una lista larga de destinatarios.

Resultado post-envio:
- Debe mostrarse en un panel propio debajo del boton `Enviar campana`.
- Debe tener jerarquia visual distinta al copy de ayuda.
- Debe conservar foco/scroll cuando aparece.
- Debe mostrar resumen y detalle por destinatario cuando exista.
- Debe quedar persistente hasta una nueva accion que limpie mensajes.

Jerarquia visual:
- Campana y envio: accion principal.
- Destinatarios: area de trabajo principal.
- Preview: apoyo consultable, colapsado para no apretar la pantalla.
- Variables disponibles: visibles solo cuando preview esta abierto.

Reglas preservadas:
- Seleccion manual de destinatarios.
- Limite MVP de 5 destinatarios.
- Dados de baja visibles pero no seleccionables.
- No cambiar API.
- No activar envio real desde UX.

Riesgos o pendientes:
- QA debe validar desktop/mobile para asegurar que el panel de resultado no empuje contenido de forma abrupta.
- Si PO necesita revisar preview siempre visible antes de enviar, se puede cambiar el default a expandido en una tarea posterior, pero la decision actual favorece reducir saturacion visual.
