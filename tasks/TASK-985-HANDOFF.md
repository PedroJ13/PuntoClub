Equipo: Ejecucion Tecnica
Modo: Web Dev
Tarea completada: TASK-985 - Normalizar CTA publico en login

Resultado:
Se actualizo y publico en Web staging el CTA publico de `/login`: el link hacia registro ahora muestra `Solicitar acceso` y mantiene el destino `/company-registration`.

Texto ajustado:
- Antes: `Crear programa`
- Despues: `Solicitar acceso`

Publicacion staging:
- Rama: `staging`
- Commit Web: `57334ec` (`TASK-985 normalize login public CTA`)
- Workflow: `Deploy Punto Club frontend staging`
- Run: https://github.com/PedroJ13/PuntoClub/actions/runs/29172387189
- Resultado workflow: success
- URL validada: https://calm-coast-0fabaec0f.7.azurestaticapps.net/login

Archivos cambiados:
- app/index.html
- tasks/TASK-985-HANDOFF.md

Validacion ejecutada:
- `npx prettier --check app/index.html` - OK
- Busqueda focal `Crear programa|Solicitar acceso` en `app/index.html` y `app/src/app.js` - OK; no quedan apariciones de `Crear programa`.
- Smoke visual local de `/login` con Playwright en 1366x768, 1024x768 y 390x844 - OK:
  - `public-auth-mode` activo.
  - CTA visible `Solicitar acceso`.
  - href del CTA mantiene `/company-registration`.
  - formulario de login renderiza.
  - control `Recuperar acceso` renderiza.
  - sin overflow horizontal.
- Smoke visual publicado en staging de `/login` con Playwright en 1366x768, 1024x768 y 390x844 - OK con los mismos checks.
- `node --check app/src/app.js` no aplica; no se modifico JS.

Uso Azure SQL: No. Tarea Web/copy sobre archivo estatico y validacion visual; no requirio datos reales ni consultas SQL.

P0/P1:
- Ninguno detectado.

P2/P3:
- Ninguno detectado.

Riesgos o pendientes:
- No se toco produccion.
- No se tocaron API, SQL, auth, sesiones, password, correos, campanas, DNS, ACS ni flags.
- No se hicieron submits reales de login ni recuperacion de acceso.

Siguiente recomendado:
- QA focal en staging de `/login` para confirmar que el P2 de TASK-984 queda cerrado antes de decidir promocion a produccion de la oleada de copy publico.
