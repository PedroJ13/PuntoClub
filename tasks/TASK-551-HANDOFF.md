Equipo: Web Dev
Modo de ejecucion: Calidad / Formato local
Tarea completada: TASK-551 - Normalizar formato Web de correos operativos

Resultado:
- Se ejecuto formato con Prettier sobre:
  - `app/src/app.js`
  - `app/src/customerApi.js`
- No se hicieron cambios funcionales intencionales.
- No se habilitaron promociones, campanas ni envio real desde la UI.

Verificacion ejecutada:
- `npx prettier --write app/src/app.js app/src/customerApi.js`
- `npx prettier --check app/src/app.js app/src/customerApi.js`
  - Resultado: OK, ambos archivos cumplen estilo Prettier.
- `node --check app/src/app.js`
  - Resultado: OK.
- `node --check app/src/customerApi.js`
  - Resultado: OK.

Notas:
- El diff contra `main` en estos archivos incluye cambios funcionales pendientes de tareas anteriores de correos operativos. Para esta tarea el alcance fue solamente normalizacion de formato sobre esos archivos.
- Los documentos `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este checkout local, por lo que se continuo con `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md` y `chat-start/WEB_DEV.md`.

Riesgos o pendientes:
- Pendiente publicacion posterior si Product / Architect / Release decide avanzar con el bloque Web/API de correos operativos.
- QA deberia validar el paquete funcional completo en la tarea de calidad/release correspondiente, no como parte de este ajuste de formato.
