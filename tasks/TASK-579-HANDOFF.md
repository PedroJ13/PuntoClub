Equipo: QA
Tarea validada: TASK-579 - Revalidar promociones publicadas tras correcciones P0/P1 / Reintento con sesion activa
Ambiente: Publicado `https://puntoclubcr.com` con sesion real/controlada abierta por Product Owner en navegador interno. API publicada `https://func-puntoclub-prod-br-001.azurewebsites.net`. Sin envio real de correos promocionales.
Resultado: bloqueado
Checks ejecutados:
- Lectura de contexto QA/proyecto: `AGENTS.md`, `chat-start/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md`, `docs/QA_TEST_PLAN.md`, handoffs `TASK-576`, `TASK-577`, `TASK-578`.
- `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md`: no existen en el workspace actual.
- `tasks/TASK-579.md` / `tasks/TASK-579-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Smoke publicado previo sin sesion: home `200`, `./styles.css` `200`, `./app-config.js` `200`, `./src/app.js` `200`.
- Validacion previa sin sesion contra API publicada para company `6`: listar campanas, crear campana, listar destinatarios, enviar campana y registrar baja promocional -> `401 UNAUTHORIZED`.
- Reintento con sesion activa en Web publicada: panel operativo muestra empresa autenticada `Aurisbel Pasteleria`, usuario de sesion visible, pill `Datos reales` y modulo `Enviar campanas`.
- Web publicada en `Enviar campanas`: formulario de campana cargado, preview visible, sin errores visibles de campana.
- Envio real promocional: boton visible `Envio real bloqueado`, deshabilitado; no se ejecuto envio real.
- Destinatarios publicados: tab `Clientes` carga lista de suscritos sin error; seleccion controlada de `Fatima Arraiz` como unico destinatario; `Guardar destinatarios` queda deshabilitado tras guardar; no se observaron errores de consola ni pantalla de 500.
- Historial publicado: tab `Historial` carga tabla `Historial local` con filas visibles.
- Baja promocional publicada: desde tab `Clientes`, `Fatima Arraiz` fue removida de `Suscritos`; en tab `Bajas` aparece con estado `Baja promocional`; seleccion vuelve a `0 seleccionados`.
- Intento de validar `companyId` distinto con sesion mediante API directa en pestana nueva: bloqueado por navegador con `net::ERR_BLOCKED_BY_CLIENT` antes de recibir respuesta HTTP.
Hallazgos:
- La sesion real/controlada ya funciona en Web publicada y la app opera con la empresa autenticada, no con mock.
- La seleccion de destinatarios en publicado no reproduce el 500 previo; se pudo seleccionar y guardar un destinatario controlado.
- Preview, historial y baja promocional funcionan visual/interactivamente en publicado.
- El envio real promocional sigue bloqueado por UI; no se enviaron correos reales.
- No se pudo completar el criterio explicito `companyId` distinto debe bloquearse con sesion, porque la llamada directa autenticada a la API publicada quedo bloqueada por el navegador antes de obtener `403 FORBIDDEN`.
P0/P1:
- Ningun P0/P1 funcional confirmado en los checks ejecutados.
- Bloqueo de alcance P1/P0 pendiente de evidencia: falta confirmar en publicado, con sesion, que una ruta de promociones con `companyId` distinto responde `403 FORBIDDEN`. El codigo publicado esperado valida ese caso, y localmente TASK-576 lo habia aprobado, pero este reintento no obtuvo evidencia HTTP publicada por bloqueo de herramienta/navegador.
P2/P3:
- P3 documental: no existen `tasks/TASK-579.md` ni `tasks/TASK-579-assignment.md`.
- P3 proceso: no existen `docs/OPERATING_STATUS.md` ni `docs/PROJECT_OPERATING_RULES.md` en el workspace actual.
Evidencia:
- API sin sesion:
  - `GET /api/companies/6/promotional-campaigns?limit=10&status=all` -> `401 UNAUTHORIZED`.
  - `POST /api/companies/6/promotional-campaigns` -> `401 UNAUTHORIZED`.
  - `GET /api/companies/6/promotional-recipients?limit=10&status=subscribed` -> `401 UNAUTHORIZED`.
  - `POST /api/companies/6/promotional-campaigns/1/send` -> `401 UNAUTHORIZED`.
  - `POST /api/companies/6/promotional-unsubscribe` -> `401 UNAUTHORIZED`.
- Web con sesion: cabecera `Aurisbel Pasteleria`, usuario visible, `Datos reales`, navegacion `Enviar campanas`.
- Campanas: preview visible; boton `Envio real bloqueado` disabled.
- Destinatarios: `Fatima Arraiz` seleccionada como unico destinatario; luego `Guardar destinatarios` disabled y sin errores de consola.
- Historial: tabla `Historial local` visible con filas.
- Baja: `Fatima Arraiz` ya no aparece en `Suscritos`; aparece en `Bajas` con etiqueta `Baja promocional`.
- CompanyId distinto: intento de abrir `https://func-puntoclub-prod-br-001.azurewebsites.net/api/me` en nueva pestana fue bloqueado por navegador con `net::ERR_BLOCKED_BY_CLIENT`, por lo que no hubo respuesta verificable.
Uso DB cloud: Si, motivo y alcance: QA publicada con sesion real/controlada en ambiente productivo; se uso la Web publicada para guardar seleccion de destinatario y registrar baja promocional del cliente controlado `Fatima Arraiz`. No hubo conexion SQL directa, no se ejecutaron scripts SQL, no se enviaron correos reales.
Riesgos o pendientes:
- La tarea no queda aprobada por falta de evidencia publicada del bloqueo `companyId` distinto con sesion.
- `Fatima Arraiz` quedo en baja promocional como parte de la prueba solicitada; si Product Owner requiere que vuelva a estar suscrita, debe decidirse una tarea o accion controlada de restauracion.
- Mantener bloqueado envio real promocional hasta decision explicita posterior.
Siguiente recomendado: Reintentar solo el check de seguridad `companyId` distinto con sesion usando una via permitida por el navegador/herramienta o un smoke API autorizado que pueda usar la sesion de forma segura sin exponer cookies ni secretos; si devuelve `403 FORBIDDEN`, Product / Release podria aprobar el paquete publicado.
