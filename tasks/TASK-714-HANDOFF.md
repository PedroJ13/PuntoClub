Equipo: QA
Tarea validada: TASK-714 - Validar edicion real de campanas existentes
Ambiente: Local/mock en http://127.0.0.1:4182/login servido con app-config temporal `PUNTO_CLUB_USE_MOCK_API=true`. Playwright headless. Fecha QA: 2026-07-02.
Resultado: aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, tasks/TASK-711-HANDOFF.md, tasks/TASK-712-HANDOFF.md, tasks/TASK-713-HANDOFF.md.
- Nota de contexto: tasks/TASK-714.md no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Se creo servidor local temporal para servir `app/` con mock API, sin modificar app-config.js de producto.
- Login mock local y apertura de `Enviar campañas`.
- Confirmar separacion: el panel Enviar no contiene accion de crear campana.
- Crear campana nueva editable con `includePoints=true`.
- Agregar imagen inicial PNG controlada.
- Seleccionar esa campana en panel Enviar y confirmar preview inicial con asunto, mensaje, puntos e imagen.
- Seleccionar la misma campana en panel Crear/Editar y actualizar:
  - nombre interno;
  - asunto;
  - mensaje;
  - `includePoints=false`.
- Guardar cambios y confirmar status `Campaña actualizada.`.
- Confirmar que lista de gestion/lista de envio reflejan el nombre editado.
- Confirmar que preview del panel Enviar muestra asunto/mensaje editados y deja de mostrar `Puntos disponibles`.
- Reemplazar imagen con JPG controlado y confirmar que preview de Enviar conserva imagen.
- Eliminar imagen y confirmar que preview queda sin imagen.
- Restaurar imagen para continuar flujo de envio.
- Seleccionar destinatarios elegibles desde panel Enviar y confirmar boton `Enviar a 2`.
- Generar una campana enviada usando mock local para validar estado no editable, sin correos reales.
- Confirmar que campana enviada queda protegida:
  - nombre/asunto/mensaje deshabilitados;
  - checkbox incluir puntos deshabilitado;
  - input y boton de imagen deshabilitados;
  - boton guardar deshabilitado con texto `Campaña no editable`.
- Verificacion tecnica:
  - `node --check app/src/app.js`
  - `node --check app/src/customerApi.js`
  - `node --check api/src/functions/promotionalCampaigns.js`
  - `node --check api/src/lib/repository.js`
  - `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/test/promotional-campaigns.test.js`
  - `node --test api/test/promotional-campaigns.test.js`

Hallazgos:
- No se detectaron P0/P1/P2/P3 en el alcance local/mock validado.
- Observacion QA: para validar bloqueo de campañas enviadas se ejecuto envio mock local; no hubo correo real, ACS ni API publicada.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo.

Evidencia:
- Script temporal QA ejecutado: `tmp/task714-qa.mjs`.
- Resultado Playwright local/mock:
  - campaña editada: `QA714 editada ...`;
  - destinatarios: `2 destinatarios seleccionados para este envío.`;
  - boton envio: `Enviar a 2`;
  - preview actualizado sin puntos tras `includePoints=false`;
  - imagen en preview con `srcKind=blob` durante campana editable;
  - eliminar imagen deja preview sin imagen;
  - campaña enviada/no editable:
    - `nameDisabled=true`;
    - `subjectDisabled=true`;
    - `bodyDisabled=true`;
    - `includePointsDisabled=true`;
    - `imageInputDisabled=true`;
    - `uploadDisabled=true`;
    - `deleteDisabled=true`;
    - `saveDisabled=true`;
    - `saveText=Campaña no editable`.
- API focal:
  - `api/test/promotional-campaigns.test.js`: 18/18 OK, incluyendo update editable, rechazo de otra empresa y rechazo de campaña enviada.
- Archivos de imagen usados:
  - `tmp/task676/qa-campaign.png`
  - `tmp/task676/qa-replace.jpg`

Uso DB cloud: No. Validacion local/mock y tests unitarios; no se uso Azure SQL, no se consulto API publicada, no se tocaron datos reales y no se enviaron correos reales.

Riesgos o pendientes:
- Pendiente QA publicada despues de deploy API/Web para confirmar el mismo comportamiento contra API/Blob reales con sesion controlada.
- Mantener restriccion de no enviar correos promocionales reales salvo autorizacion explicita posterior.

Siguiente recomendado:
- Product / Release puede aceptar la edicion local de campanas existentes y avanzar a publicacion controlada. Luego ejecutar QA publicado focal de edicion/imagen sin envio real.
