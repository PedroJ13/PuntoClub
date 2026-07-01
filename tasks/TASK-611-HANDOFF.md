Equipo: Web Dev
Tarea completada: TASK-611 - Implementar refinamiento visual de campanas y destinatarios

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`

Implementacion:
- Se reemplazo la lista visual de campanas guardadas por:
  - buscador por nombre/asunto;
  - selector desplegable de campana seleccionada.
- Se agrego boton `Crear campana`.
- El formulario de nueva campana queda colapsable.
- Al crear una campana:
  - se guarda el borrador;
  - queda seleccionada automaticamente;
  - se colapsa el formulario;
  - se refresca preview y destinatarios.
- El preview queda siempre visible y basado en la campana seleccionada.
- El boton `Enviar campana` queda fuera del formulario colapsable para no depender de tener abierto el formulario.
- Se reorganizaron las acciones rapidas de destinatarios en un grupo:
  - `Seleccionar elegibles`
  - `Con puntos`
  - `Limpiar seleccion`
- Se compactaron filas de clientes:
  - email junto al nombre;
  - puntos en columna corta;
  - badge de estado conservado;
  - se evita repetir motivo de baja/suprimido cuando el badge ya lo comunica.

Reglas preservadas:
- No se cambio backend.
- No se cambiaron contratos API.
- No se activo envio real.
- No se agrego reenvio.
- Se mantiene limite de 5 destinatarios y seleccion manual.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css app\src\customerApi.js`
- Smoke local con `python -m http.server` en `app/`:
  - `GET http://127.0.0.1:4176/` => `200`
  - HTML contiene `communication-campaign-search`
  - HTML contiene `communication-new-campaign-button`

Resultado:
- Checks sintacticos aprobados.
- Smoke local aprobado.
- UI local queda preparada para QA visual.

Uso Azure SQL:
- No.
- Motivo: ajuste visual/local de frontend; no requiere datos reales.

Riesgos o pendientes:
- Falta QA visual con navegador en desktop/mobile.
- Falta validar flujo con API local autenticada si QA lo requiere.
- Publicacion queda para tarea posterior de release.

Siguiente recomendado:
- QA local de `Enviar campanas`:
  - seleccionar campana desde dropdown;
  - filtrar campanas;
  - abrir/cerrar `Crear campana`;
  - crear borrador y confirmar que queda seleccionado;
  - revisar preview visible;
  - usar acciones rapidas de destinatarios;
  - confirmar que bajas no repiten texto innecesario.
