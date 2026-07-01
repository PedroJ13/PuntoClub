Equipo: QA
Tarea validada: TASK-601 - Validar nuevo flujo publicado de campanas y envios sin envio real
Ambiente: Publicado en `https://puntoclubcr.com/app` con sesion real/controlada de Aurisbel Pasteleria. API publicada `func-puntoclub-prod-br-001`. Sin envio real de correos.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`.
- `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md`: no existen en este workspace.
- `tasks/TASK-601.md` / `tasks/TASK-601-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Lectura de handoffs previos `TASK-597`, `TASK-598`, `TASK-599`, `TASK-600`.
- Validacion Web publicada desktop en `Enviar campanas` con sesion activa.
- Validacion read-only del flag publicado `PROMOTIONAL_EMAIL_SEND_ENABLED=false`.
- Smoke responsive mobile con viewport 390x844, sin ejecutar envio.
Hallazgos:
- La pantalla publicada muestra el nuevo flujo separado: `Campanas guardadas`, `Preview` y `Seleccionar destinatarios`.
- Guardar una campana QA publicada (`QA TASK-601 704778`) agrega la plantilla guardada y no guarda destinatarios: contador queda `0 seleccionados de 5` y el boton queda `Enviar campana` deshabilitado.
- La campana guardada puede elegirse/prepararse y el preview muestra asunto, cuerpo y snapshot de puntos.
- Los destinatarios se seleccionan al momento de enviar, no al guardar la campana.
- `Seleccionar elegibles` marca 5 destinatarios por limite MVP y no marca clientes dados de baja ni checkboxes deshabilitados.
- `Con puntos` marca 5 destinatarios elegibles con puntos, sin incluir dados de baja.
- `Limpiar seleccion` desmarca todo y vuelve a `0 seleccionados de 5`.
- Los clientes dados de baja aparecen visibles con estado `Baja promocional` y checkbox deshabilitado.
- Con 5 seleccionados, el boton muestra `Enviar a 5`, confirmando que la accion usa la seleccion actual.
- En mobile no se observo overflow horizontal; se mantienen visibles campanas, destinatarios y acciones rapidas.
- A solicitud del Product Owner, QA no ejecuto ni confirmo prueba de envio real.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-601.md` ni `tasks/TASK-601-assignment.md`.
Evidencia:
- Sesion publicada: empresa visible `Aurisbel Pasteleria`, correo de sesion visible en UI, indicador `Datos reales`.
- Estado inicial en `Enviar campanas`: 4 campanas guardadas, `0 seleccionados de 5`, 2 bajas visibles/deshabilitadas, envio deshabilitado y copy de feature flag activo.
- Campana QA guardada: `campaignButtons=1` para `QA TASK-601 704778`, `checkedRecipients=0`, `selectedText=0 seleccionados de 5`, `sendButton=Enviar campana` deshabilitado.
- Preview: asunto/cuerpo QA visibles y snapshot de puntos presente.
- `Seleccionar elegibles`: `5 seleccionados de 5`, `disabledChecked=0`, `unsubscribedChecked=0`, boton `Enviar a 5`.
- `Limpiar seleccion`: `0 seleccionados de 5`, boton de limpiar deshabilitado, envio deshabilitado.
- `Con puntos`: `5 seleccionados de 5`, `checkedWithoutPoints=0`, `disabledChecked=0`, `unsubscribedChecked=0`.
- Responsive mobile 390x844: sin overflow horizontal, secciones y acciones rapidas visibles.
- Azure Functions app setting read-only: `PROMOTIONAL_EMAIL_SEND_ENABLED=false`.
Uso DB cloud: Si, indirecto. La validacion fue sobre ambiente publicado con sesion real/controlada y datos reales existentes; no se consulto Azure SQL directamente ni se ejecutaron comandos SQL. Alcance de escritura: creacion de una campana QA publicada. No se enviaron correos reales.
Riesgos o pendientes:
- La prueba de envio real queda fuera del alcance de QA por instruccion del Product Owner y debe ejecutarla el PO en una tarea/ventana controlada si decide avanzar.
- La campana QA creada queda como dato de prueba en ambiente publicado.
- Mantener `PROMOTIONAL_EMAIL_SEND_ENABLED=false` hasta decision explicita de Product / Release para pruebas reales.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y, si corresponde, abrir una tarea PO separada para prueba de envio real controlado sin cambiar el alcance de QA.
