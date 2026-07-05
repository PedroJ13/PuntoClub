Equipo: QA
Tarea validada: TASK-616 - Validar paquete publicado UX promociones e historial de correos
Ambiente: Publicado en `https://puntoclubcr.com/app` con sesion real/controlada de Aurisbel Pasteleria. API publicada `func-puntoclub-prod-br-001`. Sin ejecucion de envio real ni reenvio.
Resultado: aprobado con observaciones
Checks ejecutados:
- Lectura de contexto base disponible: `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`.
- `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md`: no existen en este workspace.
- `tasks/TASK-616.md` / assignment local: no existe; se uso el alcance pegado por el Product Owner.
- Lectura de handoffs de release `TASK-614-HANDOFF.md` y `TASK-615-HANDOFF.md`.
- Validacion Web publicada con sesion activa en `https://puntoclubcr.com/app`.
- Validacion de `Mi empresa > Comunicaciones`: historial de correos operativos, filtros y ausencia de reenvio.
- Validacion de `Enviar campanas`: selector, busqueda, creacion de campana colapsable, preview, acciones rapidas y filas compactas.
- Confirmacion read-only de app setting publicado `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- Por instruccion del Product Owner, no se ejecuto prueba de envio real promocional ni confirmacion de envio.
Hallazgos:
- La sesion publicada carga correctamente con empresa `Aurisbel Pasteleria` e indicador `Datos reales`.
- `Mi empresa > Comunicaciones` muestra el bloque `Historial de correos operativos` con copy de consulta sin reenvio en MVP.
- El historial publicado incluye filtros `Desde`, `Hasta`, `Tipo`, `Estado` y `Buscar cliente`, mas accion `Consultar`.
- El historial cargo datos reales: 2 correos encontrados inicialmente.
- Filtro `Tipo=Compra`, `Estado=Enviado`, busqueda `stiven` retorno 1 resultado de compra enviado.
- Busqueda sin coincidencias retorno estado controlado: `0 correos encontrados` y mensaje `No hay correos operativos para los filtros seleccionados`.
- No se observaron acciones ni textos de `Reenviar`, `Reintentar` o envio nuevamente dentro del historial.
- `Enviar campanas` muestra selector de campanas, busqueda, boton para crear campana, preview y destinatarios.
- Se creo la campana QA publicada `QA TASK-616 917797` para validar el flujo colapsable; al guardar, el formulario quedo cerrado, la nueva campana quedo seleccionada y el preview mostro asunto/cuerpo TASK-616.
- La busqueda de campanas con `QA TASK-616` filtro la lista a la campana QA creada.
- Los destinatarios se muestran como tarjetas compactas con clase `communication-customer-card`.
- Hay clientes con `BAJA PROMOCIONAL` visibles y deshabilitados.
- `Seleccionar elegibles` marco 5 destinatarios por limite MVP, sin marcar dados de baja.
- `Con puntos` mantuvo seleccion valida de 5 destinatarios elegibles con puntos, sin marcar dados de baja.
- `Limpiar seleccion` volvio a `0 seleccionados de 5` y el boton regreso a `Enviar campana`.
- No se presiono el boton de envio ni se acepto confirmacion de envio.
P0/P1:
- Ninguno abierto para historial operativo ni UX de campanas/destinatarios.
P2/P3:
- P2: El app setting publicado `PROMOTIONAL_EMAIL_SEND_ENABLED` esta en `true`. Por alcance de TASK-616 y recordatorio del Product Owner, QA no ejecuto envio real; por tanto no se certifica en esta tarea que el envio real promocional este desactivado, solo que no fue ejecutado por QA.
- P3 documental: no existe archivo local `tasks/TASK-616.md` ni assignment especifico; se uso el alcance pegado en el chat.
Evidencia:
- Historial inicial: 2 correos encontrados; filas visibles de `Compra` y `Bienvenida`, estado `Enviado`, motivo `Sin errores`.
- Filtro historial `Compra + Enviado + stiven`: 1 correo encontrado; sin accion de reenvio.
- Filtro historial sin coincidencias: `0 correos encontrados` y mensaje vacio controlado.
- Campana creada: `QA TASK-616 917797 - QA TASK-616 sin envio real 917797`.
- Preview de campana: asunto y cuerpo `TASK-616` visibles, incluyendo puntos disponibles.
- Destinatarios antes de seleccion: 9 tarjetas, 2 bajas promocionales deshabilitadas, 0 seleccionados.
- `Seleccionar elegibles`: 5 seleccionados de 5, 0 dados de baja seleccionados.
- `Con puntos`: 5 seleccionados de 5, 0 dados de baja seleccionados.
- `Limpiar seleccion`: 0 seleccionados de 5.
- App setting read-only: `PROMOTIONAL_EMAIL_SEND_ENABLED=true`.
Uso DB cloud: Si, indirecto. La validacion se realizo sobre ambiente publicado con sesion real/controlada y datos reales; no se consulto Azure SQL directamente ni se ejecutaron comandos SQL. Alcance de escritura: creacion de una campana QA publicada. No se enviaron correos reales.
Riesgos o pendientes:
- La campana QA creada queda como dato de prueba en ambiente publicado.
- La prueba de envio real promocional queda fuera del alcance de esta QA y la ejecuta el Product Owner por fuera, segun instruccion explicita.
- Como el flag publicado de envio promocional esta activo, cualquier QA futura de envio debe mantenerse en ventana controlada y con destinatarios autorizados por Product Owner.
Siguiente recomendado: Product / Architect / Release puede procesar este handoff como QA publicado del paquete UX/historial. Si requiere cierre formal del estado de envio real, abrir o continuar una tarea PO separada de prueba controlada, sin mezclarla con TASK-616.
