Equipo: QA
Tarea validada: TASK-521 - Revalidar UI local de comunicaciones despues de normalizacion
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; revision documental, checks locales y Playwright/headless contra servidor estatico local Python. Sin Azure, sin Azure SQL, sin API real, sin correos reales, sin commit, sin push y sin deploy.
Resultado: aprobado local con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `codex-project-templates/QA.md`, `tasks/TASK-519-HANDOFF.md` y `tasks/TASK-520-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-521-assignment.md`; se ejecuto el alcance indicado por el usuario y el seguimiento de TASK-519/TASK-520.
- `node --check app/src/app.js`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.
- `git diff --name-status -- app/index.html app/src/app.js app/styles.css api database package.json`.
- Servidor local con `python -m http.server` sobre `app/`.
- Playwright/headless local desktop `1366x900` y mobile `390x844`, activando la seccion local/mock de Comunicaciones para validar:
  - switches operativos;
  - bloqueo de campanas promocionales;
  - bloqueo de envio real;
  - textarea con body inicial restaurado desde JS;
  - preview;
  - incluir/quitar puntos disponibles;
  - footer de baja promocional;
  - filtros `Suscritos`, `Bajas`, `No aptos`;
  - historial local;
  - overflow horizontal basico.

P0/P1:
- No se encontraron P0/P1 abiertos.
- El envio real sigue bloqueado: `#communication-send-button.disabled = true` en desktop y mobile.
- Las campanas promocionales siguen bloqueadas: switch promocional `disabled = true` y copy con motivo `dominio promocional`, `baja` y `cuotas`.
- No hay cambios `api/**` ni `database/**` en el diff de la tarea.
- No se enviaron correos reales ni se conecto ACS/API real.

P2/P3:
- P3: `npx prettier --check app/index.html app/src/app.js app/styles.css` sigue marcando formato pendiente en `app/index.html` y `app/styles.css`. La normalizacion de TASK-520 mejoro el bloque, pero no cierra el criterio si Prettier sera gate formal.
- P3: la validacion interactiva estable se hizo activando la seccion local/mock de Comunicaciones dentro del DOM servido localmente, no con login real ni sesion autenticada completa. Esto es aceptable para la UI mock de TASK-518/TASK-520, pero queda pendiente smoke autenticado cuando exista flujo publicado/API real.

Evidencia:
- `node --check app/src/app.js`: OK.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`: OK; solo warnings LF/CRLF del entorno.
- `git diff --name-status -- app/index.html app/src/app.js app/styles.css api database package.json`:
  - `M app/index.html`;
  - `M app/src/app.js`;
  - `M app/styles.css`;
  - sin salida para `api/**` ni `database/**`.
- Playwright desktop y mobile:
  - `settingsHaveOperationalSwitches=true`;
  - `defaultBodyPresent=true`;
  - `sendDisabled=true`;
  - `promoCheckboxDisabled=true`;
  - `lockedHasReason=true`;
  - `previewHasSubject=true`;
  - `previewHasCustomer=true`;
  - `previewHasCompany=true`;
  - preview con puntos muestra `Puntos disponibles: 1 250 pts.`;
  - al desmarcar puntos, `previewHidesPointsWhenDisabled=true`;
  - `previewHasUnsubscribeFooter=true`;
  - `subscribedHasEmailAndPoints=true`;
  - `unsubscribedShowsBaja=true`;
  - `blockedShowsNoEmail=true`;
  - `historyHasStates=true`;
  - `horizontalOverflow=false`;
  - `pageErrors=[]`.
- El body inicial del textarea queda presente con variables `{{customer.name}}` y `{{company.name}}`, validando el ajuste de TASK-520.

Limitaciones:
- No se valido API real ni persistencia SQL de comunicaciones; siguen fuera de alcance porque TASK-518/TASK-520 son UI local/mock.
- No se validaron bloqueos server-side de campanas promocionales.
- No se envio correo real ni se uso ACS.
- No se valido ruta `/login` con sesion real; la interaccion se concentro en la seccion local de Comunicaciones.

Uso cloud/SQL: No. No se uso Azure, Azure SQL, GSC, Cloudflare, DNS, ACS real, API publicada ni servicios externos.

Siguiente recomendado:
- Si Prettier sera gate de commit/publicacion, devolver a Web Dev para normalizar `app/index.html` y `app/styles.css`.
- Si el equipo acepta el formato actual, Product / Architect / Release puede procesar TASK-521 como QA local aprobada con observaciones.
- Crear QA posterior cuando existan endpoints Backend/API para validar bloqueos server-side, cuotas, bajas persistentes y que fallos de correo no bloqueen transacciones reales.

Movimiento de tablero sugerido:
- Mover `TASK-521` a `Needs Review` para procesamiento por Product / Architect / Release.
