Equipo: QA
Tarea completada: TASK-038 - QA smoke UI/API despues de CORS
Archivos cambiados:
- tasks/TASK-038-HANDOFF.md

Verificacion ejecutada:
- Leido codex-project-templates/QA.md.
- Leido AGENTS.md.
- Leido tasks/TASK-038.md.
- Leido tasks/TASK-034-HANDOFF.md.
- Leido tasks/TASK-035-HANDOFF.md.
- Leido tasks/TASK-037-HANDOFF.md.
- Leido docs/MVP_RELEASE_STATUS.md.
- Verificado app/app-config.js:
  - API base: https://func-puntoclub-prod-br-001.azurewebsites.net
  - companyId: 1
  - mock API: false
- Levantada UI local con servidor estatico en http://127.0.0.1:4175.
- Ejecutado smoke de navegador real con Chrome headless/CDP contra la UI local.
- Validado desktop en navegador.
- Validado mobile smoke de overflow en viewport 390x780.
- Cerrado Chrome headless y detenido servidor local al terminar.

Resultado:
- Aprobado.
- La UI local consume la API estable desde navegador despues de CORS.
- No quedan P0/P1 abiertos para el flujo clientes cubierto por TASK-038.
- No se validaron compras/redenciones UI porque estan fuera de alcance.

Checks ejecutados:
- UI carga con fuente `API real`.
- Buscar/listar clientes inicial carga datos reales.
- Registrar cliente desde navegador: exitoso.
- Buscar por telefono del cliente creado: exitoso.
- Validar duplicado por telefono: muestra error operativo.
- Validar campos requeridos: muestra errores por campo.
- Desktop: sin overflow horizontal observado.
- Mobile 390x780: sin overflow horizontal observado en carga/listado.

Datos de prueba creados:
- Nombre: `QA Task038 1780497970254`
- Telefono: `+50697970254`
- Email: `qa-task038-1780497970254@puntoclub.test`

Evidencia:
- Estado inicial:
  - fuente: `API real`
  - listado inicial: 16 filas
  - feedback: vacio
  - sin overflow horizontal
- Registro:
  - mensaje: `Cliente registrado: QA Task038 1780497970254.`
  - busqueda autocompletada con `+50697970254`
  - listado filtrado muestra el cliente creado
- Duplicado:
  - mensaje: `Ya existe un cliente con ese telefono o email. Busquelo antes de registrar.`
- Campos requeridos:
  - mensaje general: `Revise los campos marcados.`
  - nombre: `El nombre es requerido y debe tener 160 caracteres o menos.`
  - telefono: `El telefono es requerido y debe tener 32 caracteres o menos.`
  - email: `El email debe tener un formato valido y 254 caracteres o menos.`
- Mobile:
  - fuente: `API real`
  - listado carga datos
  - sin overflow horizontal
- No se imprimieron secretos.
- No se abrieron reglas temporales de firewall.
- Servidor local y Chrome headless quedaron cerrados.

Hallazgos:
- No hay P0/P1 para el flujo clientes.
- P2: CORS esta habilitado solo para origenes locales `127.0.0.1:4173` y `127.0.0.1:4175`; antes de production debe cambiarse al origen real de Static Web Apps o same-origin.
- P2: `GET /settings` sigue reportado como pendiente por tareas anteriores; no afecta el flujo clientes validado aqui.

P0/P1:
- Ninguno abierto para el alcance TASK-038.

P2/P3:
- P2: CORS local de prueba debe reemplazarse por origen production.
- P2: `GET /settings` pendiente fuera del alcance.

Riesgos o pendientes:
- Si se prueba la UI en otro puerto local, CORS podria volver a bloquear hasta agregar ese origen.
- La validacion no cubre compras/redenciones UI.
- La validacion no cubre Static Web Apps production porque aun se uso UI local.

Siguiente recomendado:
- Product / Architect / Release puede marcar TASK-038 como aprobado.
- Habilitar siguiente tarea de UI/PO sobre origen estable o Static Web Apps cuando se defina despliegue frontend.
