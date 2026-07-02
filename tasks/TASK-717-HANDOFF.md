Equipo: QA
Tarea validada: TASK-717 - Validar separacion y edicion de campanas publicada
Ambiente: Publicado en https://puntoclubcr.com/app con sesion real/controlada de Aurisbel Pasteleria. API publicada https://api.puntoclubcr.com/api. Fecha/hora QA: 2026-07-02 12:23:38 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, tasks/TASK-714-HANDOFF.md, tasks/TASK-715-HANDOFF.md, tasks/TASK-716-HANDOFF.md.
- Nota de contexto: tasks/TASK-717.md no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Smoke publico sin sesion:
  - https://puntoclubcr.com/ responde 200.
  - https://puntoclubcr.com/app-config.js apunta a https://api.puntoclubcr.com.
  - bundle publicado contiene `updatePromotionalCampaign`.
  - bundle publicado contiene `managedPromotionalCampaign`.
  - GET https://api.puntoclubcr.com/api/me sin cookie responde 401 controlado.
- Sesion publicada confirmada con empresa Aurisbel Pasteleria.
- Se abrio `Enviar campañas`.
- Se confirmo separacion visible:
  - panel `Crear/Editar campaña` presente;
  - panel `Enviar campañas` presente;
  - panel Enviar no contiene accion `Nueva campaña`.
- Se creo campaña nueva sin imagen:
  - `QA717 sin imagen 1783016279562`;
  - aparece en selector de envio;
  - no desplazo la campaña previamente seleccionada para envio.
- Se creo campaña nueva con imagen:
  - `QA717 con imagen 1783016279562`;
  - aparece en selector de envio;
  - no desplazo la campaña previamente seleccionada para envio.
- Se agrego imagen PNG controlada con asistencia manual del Product Owner para seleccionar archivo:
  - archivo: tmp/task676/qa-campaign.png;
  - la UI mostro `Imagen agregada.`;
  - la URL publica generada respondio 200 image/png.
- Se intento editar la campaña existente con imagen:
  - nombre: `QA717 editada 1783016279562`;
  - asunto: `Asunto QA717 editada 1783016279562`;
  - mensaje: `Mensaje publicado editado TASK-717 sin puntos.`;
  - incluir puntos: desactivado.
- Se leyo el detalle autenticado de API para campaignId 15 en navegador, sin exponer cookies ni tokens.
- No se enviaron correos reales.

Hallazgos:
- P1: Despues de guardar cambios sobre la campaña editable `campaignId=15`, la UI mostro `Campaña actualizada.`, pero el panel `Crear/Editar campaña` quedo inconsistente:
  - boton: `Campaña no editable`;
  - campos nombre/asunto/mensaje deshabilitados;
  - nombre y asunto quedaron vacios en el formulario;
  - mensaje visible regreso a plantilla generica;
  - soporte visible: `Esta campaña ya no se puede editar. Puedes revisar su contenido e imagen.`;
  - lista de gestion y lista de envio seguian mostrando el nombre anterior `QA717 con imagen...`, no `QA717 editada...`.
- La API publicada contradice el estado de la UI: GET autenticado de `campaignId=15` devolvio `status=draft`, nombre/asunto/mensaje actualizados, `includePoints=false` e imagen activa. Por contrato, `draft` debe seguir siendo editable.
- Por el P1 anterior no se pudo aprobar el flujo publicado completo de edicion + reemplazo/eliminacion posterior de imagen desde UI.

P0/P1:
- P1 abierto: UI publicada marca una campaña `draft` recien editada como no editable y deja el formulario/listas desincronizados, aunque API persiste la edicion correctamente.

P2/P3:
- Ninguno nuevo.

Evidencia:
- Campaña sin imagen creada: `QA717 sin imagen 1783016279562`.
- Campaña con imagen creada: `QA717 con imagen 1783016279562`.
- Campaña con imagen: `campaignId=15`.
- URL publica de imagen:
  - `https://api.puntoclubcr.com/api/public/promotional-campaign-images/E261B459-F13C-4A77-9902-7FE96D6E84D0`
  - GET publico: 200 `image/png`, 68 bytes.
- API detail autenticado de `campaignId=15`:
  - `status=draft`;
  - `name=QA717 editada 1783016279562`;
  - `subject=Asunto QA717 editada 1783016279562`;
  - `bodyText=Mensaje publicado editado TASK-717 sin puntos.`;
  - `includePoints=false`;
  - `image.imageUrl=/api/public/promotional-campaign-images/E261B459-F13C-4A77-9902-7FE96D6E84D0`;
  - `recipients=[]`.
- UI inmediatamente despues de guardar:
  - `status=Campaña actualizada.`;
  - `saveText=Campaña no editable`;
  - `nameDisabled=true`;
  - `subjectDisabled=true`;
  - `bodyDisabled=true`;
  - `includeDisabled=true`;
  - `selectedManage=QA717 con imagen 1783016279562 - QA717 con imagen 1783016279562`;
  - listas no mostraban `QA717 editada...`.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada con sesion real/controlada sobre ambiente productivo.
- Alcance: creacion de dos campañas QA, carga de una imagen de campaña, edicion de contenido de campaignId 15 y lecturas UI/API para validar estado. No se consulto Azure SQL directamente desde QA y no se enviaron correos reales.

Riesgos o pendientes:
- Quedan datos QA reales en Aurisbel:
  - `QA717 sin imagen 1783016279562`;
  - `QA717 editada 1783016279562` / campaignId 15 con imagen activa.
- Pendiente Web Dev corregir sincronizacion de estado UI despues de `PATCH` exitoso para campañas `draft`.
- Pendiente revalidar reemplazar/eliminar imagen, preview con/sin imagen, seleccion de destinatarios y bloqueo de campañas no editables una vez corregido el P1.
- Mantener restriccion de no enviar correos promocionales reales salvo autorizacion explicita posterior.

Siguiente recomendado:
- Web Dev debe corregir la UI para que, tras `PATCH` exitoso de campaña editable, el formulario/listas mantengan la campaña como editable y reflejen nombre/asunto/mensaje actualizados. Luego repetir QA publicada focal sin envio real.
