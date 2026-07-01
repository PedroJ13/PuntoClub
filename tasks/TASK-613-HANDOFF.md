Equipo: QA
Tarea validada: TASK-613 - Validar historial local de correos operativos
Ambiente: Local/mock y tests API locales. Web servida en servidores efimeros `127.0.0.1` con `PUNTO_CLUB_USE_MOCK_API=true` inyectado en memoria. Sin Azure SQL, sin ACS real, sin correos reales.
Resultado: aprobado con observaciones
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`.
- `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md`: no existen en este workspace.
- `tasks/TASK-613.md` / `tasks/TASK-613-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Lectura de handoffs previos `TASK-608` y `TASK-609`.
- `node --check api\src\functions\operationalEmailHistory.js` -> OK.
- `node --check api\src\lib\repository.js` -> OK.
- `node --check api\src\lib\validators.js` -> OK.
- `node --check app\src\app.js` -> OK.
- `node --check app\src\customerApi.js` -> OK.
- `node --test test\operational-email-history.test.js test\operational-emails.test.js` en `api/` -> 9/9 OK.
- `npm test` en `api/` -> 159/159 OK.
- Verificacion puntual local del contrato de historial: filtros `from/to/type/status/search/limit`, rechazo 401 sin sesion, rechazo 403 por empresa distinta y uso de empresa de sesion cuando coincide.
- Smoke Web local/mock en `Mi empresa > Comunicaciones`: exito, filtros, vacio, cargando, error manual y responsive mobile.
Hallazgos:
- API local/tests valida filtros soportados de historial operativo: fecha desde/hasta, tipo, estado, busqueda y limite.
- API local/tests rechaza sin sesion con 401 y rechaza empresa de ruta distinta a empresa de sesion con 403 `FORBIDDEN`.
- API local/tests permite la consulta cuando empresa de ruta y empresa de sesion coinciden.
- UI `Mi empresa > Comunicaciones` muestra el bloque `Historial de correos operativos` con filtros Desde, Hasta, Tipo, Estado y Buscar cliente.
- Estado exito: el mock muestra 2 correos encontrados, incluyendo bienvenida enviada y compra omitida.
- Los motivos visibles son sanitizados: `Sin errores` y `Cliente sin correo`; no se muestran payloads ACS ni errores crudos.
- Filtro por tipo `purchase` devuelve solo compra omitida.
- Filtro por estado `sent` devuelve solo bienvenida enviada.
- Busqueda `jose` devuelve solo el registro asociado a Jose Vega.
- Busqueda sin coincidencia muestra estado vacio: `No hay correos operativos para los filtros seleccionados.` y `0 correos encontrados.`
- Estado cargando validado con mock lento: fila `Cargando historial...` y boton Consultar deshabilitado durante la consulta.
- Estado error manual validado con mock de fallo: mensaje `No pudimos cargar el historial de correos operativos.` y tabla en estado vacio controlado.
- Responsive mobile 390x844: filtros y tabla presentes, sin overflow horizontal.
- No se enviaron correos reales.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-613.md` ni `tasks/TASK-613-assignment.md`.
- P3 UX: si el fallo ocurre durante la carga inicial silenciosa del panel, la tabla queda vacia sin mostrar error hasta que la persona presiona `Consultar`; el error manual si se muestra correctamente.
Evidencia:
- Tests focales API: 9/9 OK.
- Suite API completa: 159/159 OK.
- Verificacion puntual contrato:
  - filtros normalizados: `from=2026-06-01`, `to=2026-07-01`, `type=redemption`, `status=failed`, `search=maria@example.com`, `limit=10`.
  - `unauthorized=true`, `forbidden=true`, `companyId=1`.
- UI exito: `2 correos encontrados.`
  - `Bienvenida Maria Soto maria@example.com Enviado Sin errores`.
  - `Compra Jose Vega Sin correo Omitido Cliente sin correo`.
- UI filtros:
  - Tipo `purchase`: 1 correo encontrado.
  - Estado `sent`: 1 correo encontrado.
  - Search `jose`: 1 correo encontrado.
  - Search `sin-coincidencia`: 0 correos encontrados.
- UI cargando: fila `Cargando historial...`, boton Consultar deshabilitado.
- UI error manual: `No pudimos cargar el historial de correos operativos.`
- Mobile 390x844: `horizontalOverflow=false`, filtros y tabla presentes.
Uso DB cloud: No. No se uso Azure SQL ni ambiente cloud; la validacion fue local/mock y tests unitarios/integracion local sin SQL real.
Riesgos o pendientes:
- No se levanto Azure SQL ni se ejecuto consulta contra DB real por instruccion explicita de la tarea.
- La validacion HTTP real del endpoint con datos persistidos queda para una tarea posterior si Product/Release decide usar ambiente local con DB controlada o publicar.
- Revisar si el error inicial silencioso debe mostrar mensaje visible al abrir `Mi empresa > Comunicaciones`.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff; si acepta el P3, avanzar a release/QA publicado del historial de correos operativos.
