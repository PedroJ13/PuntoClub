Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-577 - Decidir publicacion de correcciones P0/P1 promociones

Resultado:
- Se revisaron los handoffs `TASK-573` a `TASK-576` junto con el antecedente QA `TASK-572`.
- QA publicado `TASK-572` habia dejado no aprobado el release por:
  - P0: endpoints de promociones operaban sin sesion de empresa.
  - P1: seleccion de destinatarios devolvia `500 INTERNAL_ERROR`.
  - P1: riesgo Web por uso de `PUNTO_CLUB_COMPANY_ID="1"` antes de sesion.
- Backend/API corrigio el P0 en `TASK-573`: promociones exigen sesion de empresa y validan que la ruta coincida con la empresa autenticada.
- Backend/API corrigio el P1 en `TASK-574`: errores SQL esperables de destinatarios promocionales se mapean a respuestas controladas.
- Web Dev corrigio el riesgo de empresa activa en `TASK-575`: promociones ya no cargan antes de sesion y usan la empresa activa de la sesion.
- QA local aprobo el paquete en `TASK-576`.

Decision:
- Aprobado publicar API y Web con las correcciones P0/P1 de promociones.
- La publicacion debe ser controlada por commit/push a `main`, dejando fuera `debug.log`.
- Despues de publicar, se requiere QA publicado con sesion real/controlada para confirmar seguridad, seleccion de destinatarios y uso de empresa activa.

Condiciones confirmadas:
- Envio real promocional sigue bloqueado.
- No se habilita envio masivo ni envio real de campanas.
- No se toca Azure SQL directamente desde esta decision.
- No se borra la campana QA creada en `TASK-572`.

Evidencia revisada:
- `tasks/TASK-573-HANDOFF.md`
- `tasks/TASK-574-HANDOFF.md`
- `tasks/TASK-575-HANDOFF.md`
- `tasks/TASK-576-HANDOFF.md`

Validacion base revisada:
- QA local `TASK-576`: aprobado.
- API focal: 17/17 OK.
- API completa: 150/150 OK.
- Web local/mock: carga de promociones solo post-login, seleccion de destinatarios OK, baja promocional OK, envio real bloqueado.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y QA local; no se requirio consultar ni modificar DB real.

Riesgos o pendientes:
- Falta QA publicado posterior al deploy.
- El P0/P1 sigue existiendo en publicado hasta que `TASK-578` complete push, workflows y deploy API/Web.
- El envio real promocional debe permanecer bloqueado hasta una decision explicita posterior.
