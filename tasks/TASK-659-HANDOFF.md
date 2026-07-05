Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / Revision visual
Tarea completada: TASK-659 - Revisar layout del panel Clientes en Enviar campanas

Resultado:
- Se reviso el layout del panel `Seleccionar destinatarios` dentro de `Enviar campanas`.
- Se definio recomendacion visual para tabs superiores, buscador, filtros y acciones rapidas.
- No se implementaron cambios.
- No se cambio API, SQL, ACS, flags ni reglas de envio.

Pantalla revisada:
- Modulo: `Enviar campanas`.
- Subvistas superiores:
  - `Enviar campanas`
  - `Clientes`
  - `Historial`
- Panel revisado:
  - `Seleccionar destinatarios`
  - contador de seleccion
  - botones `Seleccionar elegibles`, `Con puntos`, `Limpiar seleccion`
  - filtros `Todos`, `Suscritos`, `Bajas`, `No aptos`
  - buscador `Buscar destinatario`
  - lista de clientes/destinatarios

Diagnostico UX:
- El panel es entendible, pero la jerarquia actual puede sentirse desordenada porque el buscador aparece despues de las acciones y filtros.
- Para el usuario, buscar un destinatario es una accion primaria de orientacion antes de seleccionar.
- Los botones de seleccion rapida compiten visualmente con el contador y pueden ocupar demasiado ancho en mobile.
- Los tabs superiores estan bien como modelo, siempre que `Clientes` represente la vista de seleccion/listado y no saque al usuario del modulo de comunicaciones.

Decision recomendada:
- Mover el buscador mas arriba, inmediatamente debajo del titulo/copy del panel.
- Mantener el contador de seleccion visible despues del buscador.
- Agrupar acciones rapidas junto al contador, pero con menor peso visual.
- Dejar filtros debajo del bloque de busqueda/contador, como refinamiento secundario.
- Mantener lista de clientes como area principal.

Orden recomendado del panel:
1. Header:
   - titulo `Seleccionar destinatarios`
   - copy corto de regla: dados de baja visibles, no seleccionables; limite MVP.
2. Buscador:
   - label `Buscar destinatario`
   - placeholder `Nombre o correo`
3. Resumen y acciones:
   - `0 seleccionados de 5`
   - acciones compactas:
     - `Elegibles`
     - `Con puntos`
     - `Limpiar`
4. Filtros:
   - `Todos`
   - `Suscritos`
   - `Bajas`
   - `No aptos`
5. Lista de clientes.

Botones de seleccion rapida:
- Desktop:
  - pueden quedar alineados a la derecha del contador.
  - usar texto corto para evitar salto visual:
    - `Elegibles`
    - `Con puntos`
    - `Limpiar`
  - mantener tooltip/title si se necesita claridad extra.
- Mobile:
  - deben pasar a una fila propia bajo el contador.
  - ancho flexible, sin forzar tres botones comprimidos si no caben.
  - `Limpiar` puede quedar como accion secundaria menos prominente.

Buscador:
- Debe ir antes de filtros y acciones de seleccion masiva.
- Motivo:
  - el usuario primero reduce la lista;
  - luego decide seleccionar;
  - luego aplica filtros si necesita auditar elegibilidad.
- La busqueda no debe limpiar seleccion existente.
- Si hay seleccion fuera del filtro/busqueda actual, el contador debe seguir mostrando el total real seleccionado.

Tabs superiores:
- Mantener tabs `Enviar campanas`, `Clientes`, `Historial`.
- Recomendacion de copy futuro:
  - evaluar renombrar `Clientes` a `Destinatarios` si QA/PO reporta confusion, porque la vista no es CRM general sino seleccion de destinatarios.
- Los tabs deben mantenerse dentro del modulo `Enviar campanas`; no deben navegar a `Atender cliente`.

Claridad desktop:
- El panel queda claro si:
  - el buscador aparece arriba;
  - las acciones masivas no parecen el paso principal;
  - la lista conserva columnas compactas;
  - los badges de baja/no apto siguen visibles.
- Evitar repetir texto de baja si ya existe badge, para no alargar filas.

Claridad mobile:
- Riesgo principal: demasiados controles antes de ver la lista.
- Recomendacion mobile:
  - buscador full width;
  - contador debajo;
  - acciones rapidas en wrap natural;
  - filtros como chips en scroll/wrap;
  - filas de cliente compactas con nombre + correo juntos.

No recomendado:
- No mover los filtros arriba del buscador.
- No ocultar dados de baja; deben seguir visibles pero deshabilitados.
- No convertir acciones rapidas en envio real.
- No mezclar esta vista con `Mi empresa > Comunicaciones`.
- No cambiar backend ni reglas de elegibilidad.

Criterios de aceptacion para Web Dev futuro:
- Al entrar a `Clientes`, el primer control operativo visible debe ser el buscador o estar muy cerca del titulo.
- `Seleccionar elegibles`, `Con puntos` y `Limpiar seleccion` deben verse como acciones auxiliares, no como navegacion.
- La seleccion existente se conserva al buscar o filtrar.
- Mobile no debe obligar a hacer scroll excesivo antes de encontrar la lista.
- Los tabs superiores no deben sacar al usuario del modulo de comunicaciones.

Archivos cambiados:
- Solo este handoff:
  - `tasks/TASK-659-HANDOFF.md`

Verificacion ejecutada:
- Revision local de:
  - `AGENTS.md`
  - `docs/README.md`
  - `chat-start/DISENO_UX.md`
  - `app/index.html`
  - `app/styles.css`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P2: existe choque de numeracion. Este handoff reemplaza el contenido anterior de `TASK-659-HANDOFF.md`, que correspondia a Backend/API para contratos de imagen de campana.
- P2: si Product necesita conservar ese contrato Backend/API, conviene restaurarlo con otro numero de tarea o desde historial git antes de release.

Siguiente recomendado:
- Crear tarea Web Dev separada para implementar el reordenamiento visual del panel `Seleccionar destinatarios`.
