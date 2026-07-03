Equipo: QA
Tarea validada: TASK-753 - Validar subnavegacion publicada Crear / actualizar campanas
Ambiente: Web publicada `https://puntoclubcr.com/app?cb=task753`, sesion real/controlada de Aurisbel Pasteleria en navegador interno, fecha 2026-07-02 18:58 -06:00
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de `tasks/TASK-750-HANDOFF.md` y `tasks/TASK-752-HANDOFF.md`.
- Validacion en Web publicada con sesion activa.
- Recarga con cache-buster `https://puntoclubcr.com/app?cb=task753` para descartar bundle viejo de la pestana.
- Navegacion a `Enviar campanas`.
- Validacion de subnavs publicados.
- Validacion de separacion entre `Enviar campanas` y `Crear / actualizar campanas`.
- Creacion y edicion de campana publicada de QA.
- Validacion de controles de imagen y preview en `Crear / actualizar campanas`.
- Validacion de `Ir a Enviar campanas`.
- Validacion de selector, preview, destinatarios y boton de envio sin ejecutar envio real.
- Validacion responsive basica con viewport 390x844.
- Limpieza de seleccion de destinatario al finalizar.

Hallazgos:
- No se encontraron P0/P1.
- Tras recargar con cache-buster, la Web publicada muestra los cuatro subnavs: `Enviar campanas`, `Crear / actualizar campanas`, `Clientes`, `Historial`.
- `Crear/Editar campana` ya no queda visible dentro de `Enviar campanas`.
- En `Enviar campanas` se conserva selector de campana, preview, destinatarios y boton de envio.
- En `Crear / actualizar campanas` se valido formulario, selector, preview, boton `Ir a Enviar campanas` y controles de imagen visibles/habilitados.
- Se creo la campana `QA753 publicada 1783040204182`, luego se edito a `QA753 publicada 1783040204182 editada`.
- El preview de gestion se actualizo con `QA753 asunto 1783040204182 editado`.
- `Ir a Enviar campanas` navego correctamente a `Enviar campanas`, dejo seleccionada la campana editada y actualizo el preview de envio.
- Se selecciono un destinatario elegible solo para validar estado: el boton paso a `Enviar a 1`; no se hizo click en enviar.
- Al finalizar se uso `Limpiar seleccion`: quedo `0 seleccionados de 5` y boton `Enviar campana` deshabilitado.
- Responsive basico 390x844: cuatro subnavs visibles, seccion de comunicaciones visible y sin overflow horizontal detectable.

P0/P1:
- Ninguno.

P2/P3:
- P3 observacion: la primera lectura en la pestana existente mostraba bundle/estado anterior con solo 3 subnavs; al navegar a `https://puntoclubcr.com/app?cb=task753` cargo correctamente la version publicada nueva. Recomendado usar cache-buster o refresh fuerte durante QA post-deploy.
- P3 observacion: por limitacion del controlador del navegador interno no se pudo subir un archivo local desde el input de imagen. Se valido que, tras guardar la campana, el input y boton de imagen quedan visibles/habilitados, y que el preview de gestion funciona. La carga/reemplazo/eliminacion de imagen ya habia sido validada en tareas especificas previas.

Evidencia:
- Sesion activa: `Aurisbel Pasteleria`, usuario mostrado `eventos.aurisbel@gmail.com`.
- DOM publicado fresco contiene `Crear / actualizar campanas` e `Ir a Enviar campanas`.
- Subnavs observados: `send`, `manage`, `customers`, `history`.
- `Enviar campanas`: `manageTitleVisible=false`, `selector=true`, `previewToggle=true`, `recipients=true`, `sendButton=true`, `optionsCount=11`.
- `Crear / actualizar campanas`: formulario visible, selector visible, controles de imagen visibles, preview visible, `Ir a Enviar campanas` visible.
- Creacion publicada: status `Campaña guardada. Ahora puedes agregar una imagen o seleccionarla para envío.`
- Edicion publicada: status `Campaña actualizada.`, lista y preview actualizados.
- Envio sin ejecutar: seleccion temporal `1 seleccionado de 5`, boton `Enviar a 1`; luego limpieza confirmada con `0 seleccionados de 5`, boton deshabilitado.
- Responsive: viewport 390x844 con cuatro tabs visibles y overflow horizontal <= 0.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada con sesion real/controlada en `puntoclubcr.com`.
- Alcance: lectura de campanas/destinatarios reales de la empresa autenticada y creacion/edicion de un borrador QA promocional. No se uso acceso directo a Azure SQL, no se consultaron secretos, no se enviaron correos reales y no se cambiaron feature flags.

Riesgos o pendientes:
- Queda una campana de QA publicada creada/editada para evidencia: `QA753 publicada 1783040204182 editada`.
- No se ejecuto envio real.
- No se cambio ningun flag.
- No se hizo carga real de archivo de imagen en esta pasada por limitacion de herramienta; se validaron controles habilitados y preview.

Siguiente recomendado:
- Procesar TASK-753 como aprobado con observaciones. Si Product Owner requiere evidencia publicada especifica de subir/reemplazar/eliminar imagen dentro de este nuevo subnav, ejecutarla manualmente o con sesion asistida en una tarea focal separada, sin envio real.
