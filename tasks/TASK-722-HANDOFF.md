Equipo: QA
Tarea validada: TASK-722 - Revalidar sincronizacion UI campana editada publicada
Ambiente: Web publicada `https://puntoclubcr.com/app?task=717-resume` con sesion real/controlada de Aurisbel Pasteleria. API publicada via sesion del navegador. Fecha/hora QA: 2026-07-02 13:25:12 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-717-HANDOFF.md, tasks/TASK-719-HANDOFF.md, tasks/TASK-720-HANDOFF.md, tasks/TASK-721-HANDOFF.md.
- Nota de contexto: docs/OPERATING_STATUS.md, docs/PROJECT_OPERATING_RULES.md y tasks/TASK-722.md no existen en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Sesion publicada confirmada en Aurisbel Pasteleria, sin pedir ni registrar credenciales/cookies/tokens.
- Se abrio modulo `Enviar campanas`.
- Se uso la campana QA existente `campaignId=15`, que venia de TASK-717, para evitar crear datos adicionales innecesarios.
- Se selecciono una campana distinta en el panel Enviar (`campaignId=14`) y se edito `campaignId=15` desde el panel Crear/Editar para validar que no hubiera mezcla de seleccion.
- Se edito nuevamente `campaignId=15` mientras estaba seleccionada en Enviar para validar refresco automatico del preview.
- Se valido disponibilidad de gestion de imagen en campana editable y se ejecuto eliminacion de imagen.
- No se hizo click en `Enviar campana` ni se enviaron correos reales.

Hallazgos:
- Sin P0/P1/P2/P3 nuevos en el alcance validado.
- Observacion: el conector de navegador reporto timeout al hacer click en `Eliminar`, pero la accion si se aplico en la UI publicada. Se confirmo estado posterior `Imagen eliminada.`, preview sin imagen y boton `Agregar imagen` habilitado.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- Antes de editar con otra campana seleccionada para envio:
  - Enviar seleccionado: `QA717 sin imagen 1783016279562 - QA717 sin imagen 1783016279562` (`campaignId=14`).
  - Gestion editada: `campaignId=15`.
- Primera edicion publicada de `campaignId=15`:
  - nombre: `QA722 editada no mezcla 1783020094287`;
  - asunto: `Asunto QA722 no mezcla 1783020094287`;
  - mensaje: `Mensaje QA722 publicado no mezcla 1783020094287.`;
  - `includePoints=false`.
- Resultado despues de la primera edicion:
  - estado UI: `Campana actualizada.`;
  - formulario siguio editable: nombre/asunto/mensaje/includePoints habilitados;
  - boton principal: `Guardar cambios`;
  - input de imagen habilitado;
  - boton de imagen habilitado;
  - boton `Eliminar` habilitado;
  - lista Gestion mostro `QA722 editada no mezcla 1783020094287 - Asunto QA722 no mezcla 1783020094287`;
  - lista Enviar tambien actualizo la opcion de `campaignId=15`;
  - Enviar siguio seleccionado en `campaignId=14`, sin cambiar solo a la campana editada.
- Segunda edicion con `campaignId=15` seleccionada en Enviar:
  - nombre: `QA722 editada preview 1783020094287`;
  - asunto: `Asunto QA722 preview 1783020094287`;
  - mensaje: `Mensaje QA722 publicado preview actualizado 1783020094287.`;
  - `includePoints=true`.
- Resultado despues de la segunda edicion:
  - formulario siguio editable y con valores editados;
  - Gestion y Enviar quedaron seleccionados en `QA722 editada preview 1783020094287 - Asunto QA722 preview 1783020094287`;
  - preview mostro `Asunto QA722 preview 1783020094287`;
  - preview mostro `Mensaje QA722 publicado preview actualizado 1783020094287.`;
  - preview mostro puntos disponibles;
  - preview mantuvo imagen publica antes de eliminar:
    `https://api.puntoclubcr.com/api/public/promotional-campaign-images/E261B459-F13C-4A77-9902-7FE96D6E84D0`.
- Gestion de imagen:
  - antes de eliminar: imagen visible, input habilitado, boton de imagen habilitado, boton `Eliminar` habilitado;
  - despues de eliminar: estado `Imagen eliminada.`, preview con `imageCount=0`, input habilitado, boton `Agregar imagen` habilitado, boton `Eliminar` deshabilitado.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada solicitada explicitamente en `puntoclubcr.com` con sesion real/controlada.
- Alcance: edicion de campana QA existente `campaignId=15` y eliminacion de su imagen en ambiente publicado. No se consulto Azure SQL directamente desde QA y no se enviaron correos reales.

Riesgos o pendientes:
- `campaignId=15` queda como dato QA real en Aurisbel con:
  - nombre `QA722 editada preview 1783020094287`;
  - asunto `Asunto QA722 preview 1783020094287`;
  - mensaje `Mensaje QA722 publicado preview actualizado 1783020094287.`;
  - `includePoints=true`;
  - imagen eliminada.
- Reemplazo/carga de una nueva imagen no se ejecuto por limitacion del conector del navegador para seleccionar archivos locales en esta sesion publicada; si Product quiere evidencia visual de reemplazo real publicado, requiere apoyo manual de seleccion de archivo o una tarea focal adicional. El control de reemplazo/agregar quedo disponible y habilitado.
- Mantener la restriccion de no enviar correos promocionales reales salvo autorizacion explicita posterior.

Siguiente recomendado:
- Product/Release puede considerar cerrado el P1 de TASK-717 para sincronizacion UI publicada. Si se requiere restaurar imagen en `campaignId=15`, hacerlo como tarea focal o con apoyo manual del Product Owner.
