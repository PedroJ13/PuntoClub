Equipo: Product / Architect / Release
Modo de ejecucion: Promociones / Definicion funcional
Tarea completada: TASK-679 - Definir edicion y baja de campanas promocionales

Resultado:
- Se define el comportamiento funcional para editar y dar de baja campanas promocionales.
- Decision principal: no hacer borrado fisico en MVP operativo.
- Se recomienda implementar edicion controlada y baja logica/cancelacion para conservar trazabilidad.
- No se modifico codigo, SQL, API, Web ni configuracion cloud.

Contexto revisado:
- `AGENTS.md`
- `docs/README.md`
- Modelo actual de campanas en:
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`
  - `database/migrations/20260701_promotional_campaign_images.sql`
- Contrato/API actual en:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`
- UI actual en:
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`

Estado actual confirmado:
- Ya existe crear campana.
- Ya existe listar/seleccionar campana.
- Ya existe preview.
- Ya existe seleccionar destinatarios.
- Ya existe envio promocional controlado por feature flag.
- Ya existe agregar/reemplazar/eliminar imagen de campana para estados editables.
- No existe endpoint ni UI para editar datos de campana existente.
- No existe endpoint ni UI para eliminar/cancelar/archivar campana completa.

Estados actuales relevantes:
- `draft`
- `ready`
- `sending`
- `sent`
- `cancelled`
- `failed`

Decision funcional:
- Editar campana debe permitirse solo cuando la campana esta en estado:
  - `draft`
  - `ready`
- Editar campana debe bloquearse cuando la campana esta en estado:
  - `sending`
  - `sent`
  - `cancelled`
  - `failed`
- La campana enviada no debe poder alterarse porque representa evidencia del contenido que recibieron los clientes.
- Si una campana `failed` requiere reenviarse o corregirse, el flujo recomendado es duplicar/crear una nueva campana basada en la anterior, no editar la fallida.

Campos editables:
- Nombre interno.
- Asunto.
- Mensaje/body.
- Incluir puntos disponibles.
- Audiencia default si se conserva como metadata funcional.
- Imagen opcional asociada, usando el flujo existente de agregar/reemplazar/eliminar imagen.

Campos no editables desde UI normal:
- Empresa propietaria.
- Fecha de creacion.
- Usuario creador.
- Fecha de envio.
- Conteos historicos de destinatarios/enviados/fallidos/omitidos.
- Resultados de destinatarios.
- Historial de bajas promocionales.

Regla sobre destinatarios:
- La campana/plantilla y el envio siguen separados.
- Editar contenido no debe seleccionar destinatarios automaticamente.
- Si la campana esta `ready` porque tenia destinatarios preparados, al editar contenido debe decidirse una de estas dos rutas:
  - Recomendacion MVP: conservar destinatarios seleccionados pero mostrar aviso de que el contenido cambio y requiere confirmacion antes de enviar.
  - Alternativa mas estricta: limpiar destinatarios y volver a `draft`.
- Decision recomendada para MVP: conservar destinatarios y mantener estado `ready`, siempre que la UI muestre aviso claro y el boton de envio requiera confirmacion.

Regla sobre imagen:
- La imagen opcional se mantiene ligada a la campana.
- Si se edita contenido, la imagen activa se conserva.
- La imagen puede reemplazarse o eliminarse mientras la campana este en `draft` o `ready`.
- Al abrir edicion de una campana que ya tiene imagen, la UI debe mostrar la imagen actual en el formulario para que la empresa pueda revisarla antes de guardar.
- Desde la edicion debe poder:
  - ver la imagen actual
  - reemplazarla por una nueva imagen valida
  - quitarla si ya no aplica
- Si la campana no tiene imagen, la edicion debe mostrar estado `Sin imagen` y permitir agregar una.
- Imagen de campana `sent`, `sending`, `cancelled` o `failed` no debe modificarse desde UI normal.

Decision de baja:
- No implementar borrado fisico como accion normal de empresa.
- Implementar baja logica como `cancelled` para campanas que no se desean usar.
- Copy sugerido en UI:
  - Boton: `Archivar campana` o `Cancelar campana`
  - Confirmacion: `La campana dejara de aparecer en la lista activa, pero se conservara en el historial.`
- Recomendacion de termino:
  - Usar `Archivar` en UI si el objetivo principal es ocultarla de la lista activa.
  - Usar `Cancelar` en API/modelo porque el estado existente es `cancelled`.

Reglas para archivar/cancelar:
- Permitido para estados:
  - `draft`
  - `ready`
  - `failed`
- Bloqueado para estados:
  - `sending`
  - `sent`
  - `cancelled`
- Al archivar/cancelar:
  - actualizar `status = 'cancelled'`
  - actualizar `cancelled_at`
  - actualizar `updated_at`
  - no borrar destinatarios historicos
  - no borrar imagen metadata
  - no borrar blob fisico en esta fase
- Si se cancela una campana con destinatarios pendientes, esos destinatarios quedan como evidencia operativa y la campana no debe poder enviarse.

Regla de listado:
- Lista principal debe mostrar por defecto solo campanas activas:
  - `draft`
  - `ready`
  - `failed` si Product decide mantenerlas visibles para diagnostico
- Campanas `cancelled` deben quedar fuera de la lista activa por defecto.
- Debe existir filtro o vista de historial para ver:
  - `sent`
  - `cancelled`
  - `failed`
- Busqueda debe poder encontrar campanas por nombre/asunto dentro del filtro activo.

Regla de trazabilidad:
- No borrar fisicamente en MVP.
- Mantener evidencia de:
  - contenido de campana
  - imagen activa/inactiva segun metadata
  - destinatarios preparados
  - resultados de envio
  - fecha de cancelacion
- Cualquier borrado fisico futuro debe ser tarea admin separada con respaldo, decision explicita y criterio legal/operativo.

Contratos sugeridos para Backend/API:
- `PATCH /api/companies/{companyId}/promotional-campaigns/{campaignId}`
  - Actualiza campos editables.
  - Valida sesion de empresa.
  - Valida ownership por `companyId`.
  - Solo permite `draft` o `ready`.
  - Responde `409 PROMOTIONAL_CAMPAIGN_NOT_EDITABLE` si el estado no permite edicion.
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/cancel`
  - Baja logica/cancelacion.
  - Solo permite `draft`, `ready` o `failed`.
  - Responde con campana actualizada.
- No implementar `DELETE` fisico en MVP.

UX sugerida:
- Al seleccionar una campana, mostrar acciones:
  - `Editar`
  - `Archivar`
  - `Duplicar` como mejora posterior opcional
- `Editar` abre el formulario con valores actuales.
- Si la campana tiene imagen activa, `Editar` tambien muestra el preview de esa imagen dentro del formulario y mantiene disponibles las acciones `Reemplazar` y `Eliminar imagen` mientras el estado sea editable.
- Si la campana no tiene imagen, `Editar` muestra `Sin imagen` y permite `Agregar imagen`.
- Guardar cambios debe mantener seleccionada la campana actualizada.
- Si la campana no es editable, mostrar los campos en modo lectura y explicar:
  - `Esta campana ya no se puede editar porque fue enviada o cerrada.`
- `Archivar` requiere confirmacion.
- Despues de archivar, seleccionar la siguiente campana activa o dejar estado vacio con mensaje:
  - `Campana archivada. Puedes verla en Historial.`

Prioridad recomendada:
- P1: editar campana `draft/ready`.
- P1: archivar/cancelar campana `draft/ready/failed`.
- P2: filtro de historial para ver canceladas/enviadas/fallidas con claridad.
- P2: duplicar campana enviada/fallida para reutilizar contenido sin alterar evidencia.
- P3: borrado fisico admin, solo si aparece una necesidad real.

Uso Azure SQL:
- No.
- Motivo: definicion funcional sin cambios tecnicos ni consultas cloud.

Riesgos:
- Si se permite editar una campana ya enviada, se pierde evidencia de lo que recibio el cliente.
- Si se borra fisicamente, se puede romper trazabilidad de envios, destinatarios e imagenes.
- Si se cancela una campana con destinatarios preparados sin comunicarlo bien, el usuario puede pensar que esos destinatarios recibieron algo. La UI debe ser explicita.

Decision final:
- Programar edicion y baja logica.
- No programar eliminacion fisica para empresas en MVP.
- Mantener campanas enviadas bloqueadas.
- Mantener historial visible para trazabilidad.

Siguiente recomendado:
- Crear tareas separadas para Backend/API, Web Dev y QA local.
