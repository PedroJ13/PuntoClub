Equipo: QA
Tarea validada: TASK-824 - Validar seleccion masiva publicada de destinatarios promocionales
Ambiente: Web publicada `https://puntoclubcr.com/app` con sesion real/controlada de Aurisbel. Fecha QA: 2026-07-07 10:08:08 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Se revisaron `tasks/TASK-821-HANDOFF.md` y `tasks/TASK-823-HANDOFF.md` para confirmar alcance local aprobado y deploy publicado.
- Se verifico sesion activa de Aurisbel Pasteleria en web publicada.
- Se valido que el bundle publicado ya muestra el flujo nuevo con `Seleccionar todos elegibles` y sin texto `de 5`, `limite de 5` o `limite de 5`.
- Se selecciono una campana comun existente (`Energia para el Lunes`) para preparar envio.
- Se valido que `Todos` funciona como filtro/listado y no selecciona por si mismo:
  - Antes: `0 seleccionados`.
  - Despues de `Todos`: `0 seleccionados`.
- Se valido `Seleccionar todos elegibles`:
  - Resultado visible: `17 seleccionados`.
  - Boton visible: `Enviar a 17`.
  - No aparecio limite de 5.
- Se valido `Limpiar seleccion`:
  - Resultado visible: `0 seleccionados`.
  - Boton de limpiar queda deshabilitado.
- Se abrio la confirmacion final sin aceptarla; no se confirmo envio real.
- Se revisaron filtros `Bajas` y `No aptos`:
  - Aurisbel mostraba KPI `BAJAS 0`.
  - Ambos filtros mostraron `No hay destinatarios para este filtro`.
  - No hubo destinatarios no elegibles visibles para intentar seleccion en publicado.
- Se recargo la vista para descartar cualquier modal pendiente y se confirmo sesion activa nuevamente.

Hallazgos:
- La seleccion masiva publicada funciona para mas de 5 destinatarios: `Seleccionar todos elegibles` marco `17 seleccionados` y preparo `Enviar a 17`.
- `Todos` solo lista/filtra; no selecciona automaticamente.
- `Limpiar seleccion` limpia el estado y vuelve a `0 seleccionados`.
- No se observaron bajas/suprimidos/sin correo en la data publicada de Aurisbel al momento de la prueba; los filtros `Bajas` y `No aptos` estaban vacios.
- No se enviaron correos reales.

P0/P1:
- Ninguno abierto.

P2/P3:
- P2: el modal final publicado de confirmacion mostro texto generico `Confirmar accion` con botones `Cancelar` y `Confirmar`, pero no repitio la cantidad real (`17`). La cantidad si estaba visible justo antes en el boton `Enviar a 17`, pero se recomienda alinear el modal con el criterio de aceptacion y mostrar la cantidad dentro de la confirmacion final.
- P3: la primera sesion abierta tenia estado visual previo con textos antiguos; despues de recarga/cache-buster la UI publicada correcta quedo visible. Riesgo menor para usuarios con sesion/bundle anterior hasta recargar.
- P3: no habia destinatarios no elegibles en Aurisbel publicado para observar checkboxes deshabilitados; TASK-821 lo cubrio en local/mock.

Evidencia:
- Sesion publicada: Aurisbel Pasteleria / datos reales.
- KPI publicado visible: `SUSCRITOS 17`, `BAJAS 0`, `PROMOCIONES Activas`.
- UI publicada sin limite historico:
  - `Seleccionar todos elegibles`: presente.
  - Texto `de 5`: ausente.
- Filtro `Todos`: `0 seleccionados` despues de aplicar filtro.
- Seleccion masiva: `17 seleccionados`, boton `Enviar a 17`.
- Limpieza: `0 seleccionados`.
- Filtros no elegibles:
  - `Bajas`: `No hay destinatarios para este filtro`.
  - `No aptos`: `No hay destinatarios para este filtro`.
- Confirmacion final: se abrio modal con `Cancelar` / `Confirmar`; no se acepto.
- Console errors relevantes durante el check: ninguno observado en el flujo principal.

Uso DB cloud: Si, motivo y alcance
- Si. La validacion fue en web publicada contra datos reales de Aurisbel.
- Alcance: navegacion, lectura de UI/KPIs/listados y preparacion de seleccion hasta confirmacion no aceptada.
- No se enviaron correos reales, no se confirmo envio, no se modificaron flags, no se tocaron datos por SQL directo.

Riesgos o pendientes:
- Mejorar copy del modal final para incluir cantidad real antes de confirmar un envio masivo.
- Revalidar no elegibles en publicado cuando exista al menos un cliente dado de baja, suprimido o sin correo en Aurisbel, o con un dataset controlado aprobado.
- Usuarios con bundle anterior pueden requerir recarga para ver la UI sin limite de 5.

Siguiente recomendado:
- Web Dev/Diseno UX deberia ajustar el modal final para mostrar `Vas a enviar a N destinatarios` antes de confirmar.
- Product / Architect / Release puede procesar este handoff como QA publicada aprobada con observaciones, sin P0/P1 abiertos.
