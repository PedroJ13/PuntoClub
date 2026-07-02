Equipo: Web Dev
Modo de ejecucion: Auth / Mensajes de login
Tarea completada: TASK-685 - Mejorar mensaje cuando login no conserva sesion

Resultado:
- Se ajusto el flujo de login local para validar `/api/me` inmediatamente despues de `POST /api/company-auth/login`.
- Si login responde OK pero `/me` responde `401`, la UI ya no trata el caso como password incorrecto ni entra al panel con estado local falso.
- Se muestra mensaje especifico:
  - `No pudimos conservar la sesión en este navegador. Actualiza la página o revisa si el navegador está bloqueando cookies.`

Implementacion:
- `submitCompanyLogin()` ahora:
  - llama `api.loginCompany()`;
  - luego llama `api.getCurrentCompanyUser()`;
  - solo renderiza identidad y entra al panel si `/me` confirma sesion;
  - si `/me` devuelve `UNAUTHORIZED`, lanza error local `SESSION_NOT_PERSISTED`.
- `renderLoginError()` maneja `SESSION_NOT_PERSISTED` con mensaje seguro.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-685-HANDOFF.md`

Reglas preservadas:
- No se cambio Backend/API.
- No se cambio CORS, DNS, app settings ni flags.
- No se revelan datos sobre si el correo existe.
- No se modifico texto de password incorrecto.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- Falta QA publicado con navegador real/incognito.
- Si el navegador bloquea cookies cross-site, el usuario vera el nuevo mensaje hasta que Infra mueva la API a dominio same-site o proxy equivalente.
- El archivo `app/src/app.js` ya tenia cambios previos pendientes de TASK-680/TASK-681; este handoff corresponde solo al bloque de login y mensaje de sesion no persistida.
