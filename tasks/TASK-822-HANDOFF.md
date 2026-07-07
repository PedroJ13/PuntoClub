# TASK-822 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-07

Resultado:
- Decision aprobada: publicar API/Web para seleccion masiva de destinatarios promocionales.
- Se revisaron los handoffs TASK-819, TASK-820 y TASK-821.
- Alcance confirmado:
  - API elimina el limite server-side de 5 destinatarios.
  - Web elimina el limite visual de 5 destinatarios.
  - `Todos` queda como filtro/listado, no selecciona por si mismo.
  - `Seleccionar todos elegibles` marca todos los clientes elegibles visibles segun filtro/busqueda.
  - Clientes dados de baja, suprimidos o sin correo quedan visibles pero no seleccionables.
  - `Limpiar seleccion` limpia el contador y deshabilita envio cuando corresponde.
  - Confirmacion de envio muestra la cantidad real de destinatarios seleccionados.

Validaciones revisadas:
- Backend/API:
  - Sintaxis OK.
  - Test focal promociones: 23/23 pass.
  - Suite API completa: 179/179 pass.
- Web:
  - Sintaxis Web OK.
  - QA local/mock aprobada con seleccion de 9 destinatarios elegibles.

Decision:
- Aprobado avanzar con TASK-823 para commit y push controlado.
- Requiere QA publicada posterior para validar en ambiente real publicado.

Restricciones:
- No cambiar SQL.
- No cambiar ACS, sender ni flags.
- No enviar correos reales durante release.
- Mantener fuera archivos no relacionados y handoffs antiguos no solicitados.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y pruebas locales; no requirio datos reales ni migracion.

Riesgos o pendientes:
- El campo historico `recipient_limit` sigue existiendo en el modelo/contrato, pero ya no limita seleccion ni envio. Retirarlo completamente seria una tarea separada si Product lo decide.
- Validacion publicada queda pendiente despues del push.

Siguiente recomendado:
- Ejecutar TASK-823.
- Crear QA publicada para validar la seleccion masiva en Web real.
