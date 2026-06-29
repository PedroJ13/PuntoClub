Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UI navegacion
Tarea: TASK-529 - Implementar UI local de submenus Mi empresa y Enviar campanas

Resultado:
- Se implemento submenu local en `Mi empresa` con vistas `Perfil`, `Logo`, `Acceso` y `Comunicaciones`.
- Se implemento submenu local en `Comunicaciones` con vistas `Enviar campanas`, `Configuracion`, `Clientes` e `Historial`.
- `Enviar campanas` queda como vista inicial del centro de comunicaciones, con formulario y preview visibles juntos.
- El envio real sigue bloqueado y no se agrego integracion API nueva.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-529-HANDOFF.md`

Detalle:
- `app/index.html`:
  - agrega navegacion secundaria dentro de `Mi empresa`.
  - separa paneles de empresa usando `data-company-panel`.
  - agrega panel puente `Comunicaciones` dentro de `Mi empresa` con entrada a `Enviar campanas`.
  - agrega navegacion secundaria dentro de `Comunicaciones`.
  - separa configuracion, envio, clientes e historial usando `data-communication-panel`.
  - renombra la vista principal de campanas a `Enviar campanas`.
- `app/src/app.js`:
  - agrega estado local para subseccion de empresa y vista de comunicaciones.
  - agrega `setCompanySubsection` y `setCommunicationView`.
  - conecta botones de submenus con `aria-selected`, clase activa y visibilidad por `hidden`.
  - el boton `Cambiar contrasena` abre la vista `Acceso`.
  - el puente de `Mi empresa > Comunicaciones` abre `Comunicaciones > Enviar campanas`.
- `app/styles.css`:
  - reutiliza el estilo de tabs para submenus locales.
  - agrega layout para el panel puente de comunicaciones.
  - agrega ajuste responsive para la nueva grilla.

Verificacion ejecutada:
- `node --check app/src/app.js`
- Validacion estatica con Node:
  - submenu de `Mi empresa` contiene `Perfil`, `Logo`, `Acceso`, `Comunicaciones`.
  - submenu de `Comunicaciones` contiene `Enviar campanas`, `Configuracion`, `Clientes`, `Historial`.
  - existen paneles `data-company-panel` y `data-communication-panel`.
  - existen funciones JS `setCompanySubsection` y `setCommunicationView`.
  - existen estilos `.section-tabs`, `.section-tab` y `.company-communications-grid`.
- Playwright headless local con servidor en memoria:
  - confirma estado inicial `Mi empresa > Perfil`.
  - confirma estado inicial `Comunicaciones > Enviar campanas`.
  - confirma que `Enviar campanas` muestra formulario y preview.
  - confirma que al abrir `Clientes`, se ocultan los paneles de envio.
  - confirma que `Mi empresa > Comunicaciones` muestra el panel puente.
  - Nota: Playwright imprimio resultado correcto, pero el proceso temporal quedo vivo y cerro por timeout del shell; no se uso como verificacion limpia principal.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- No hubo deploy.

Riesgos o pendientes:
- Falta QA visual con sesion real para confirmar espaciado final en desktop/mobile.
- La configuracion y campanas siguen siendo UI local/mock hasta que Backend/API implemente persistencia.
- El boton de envio real sigue deshabilitado por diseno.

Siguiente recomendado:
- QA local debe revisar navegacion de `Mi empresa` y `Comunicaciones` en desktop y mobile.
- Product / Architect / Release puede decidir si esta navegacion entra en el siguiente paquete de publicacion Web.

Movimiento de tablero sugerido:
- TASK-529 a Done / Needs Review.
