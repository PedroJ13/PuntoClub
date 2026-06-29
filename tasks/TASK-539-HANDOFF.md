Equipo: Web Dev
Modo de ejecucion: Navegacion / Menu lateral
Tarea: TASK-539 - Implementar submenu colapsable de Mi empresa en menu lateral

Resultado:
- Se quito la navegacion por tabs internos dentro de `Mi empresa`.
- Se agrego submenu colapsable debajo de `Mi empresa` en el menu lateral.
- El submenu lateral de `Mi empresa` contiene:
  - `Perfil`
  - `Logo`
  - `Acceso`
  - `Membresías`
  - `Comunicaciones`
- `Membresías` ahora es una vista propia de `Mi empresa`.
- `membership-config-host` dejo de estar suelto dentro de toda la seccion y ahora usa `data-company-panel="memberships"`.
- `Enviar campañas` se mantiene como item principal separado del menu lateral.
- El envio real sigue bloqueado.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-539-HANDOFF.md`

Detalle:
- `app/index.html`:
  - reemplaza el boton simple `Mi empresa` por un grupo lateral con submenu.
  - elimina `company-subnav` interno.
  - agrega subitem `Membresías` bajo `Mi empresa`.
  - mueve `membership-config-host` dentro de `company-panel` como panel propio.
  - conserva `Enviar campañas` como item principal `data-section-target="communications"`.
- `app/src/app.js`:
  - agrega referencias a `company-nav-toggle` y `company-side-subnav`.
  - los subitems de `Mi empresa` abren la seccion `company` y cambian `data-company-panel`.
  - `Mi empresa` entra por defecto a `Perfil`.
  - `Membresías` se agrega como subseccion valida de empresa.
  - el submenu lateral se expande cuando `Mi empresa` esta activa y se oculta al salir.
  - el boton principal historico de `Membresías` queda tolerado si no existe.
- `app/styles.css`:
  - agrega estilos para grupo lateral, submenu y subitems.
  - conserva estilos existentes de tabs para otras superficies que los usan.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `npx prettier --check app/index.html app/styles.css`
- Validacion estatica con Node:
  - confirma que no existe `company-subnav`.
  - confirma que existe `company-side-subnav`.
  - confirma subitem `data-company-subsection="memberships"`.
  - confirma `membership-config-host` con `data-company-panel="memberships"`.
  - confirma item principal `Enviar campañas`.
  - confirma `communication-send-button` con `disabled`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- No hubo deploy.

Riesgos o pendientes:
- Falta QA visual local en desktop/mobile para confirmar espaciado del submenu lateral.
- La configuracion real de membresias sigue dependiendo del estado existente de API/datos; esta tarea solo reorganiza navegacion y visibilidad.
- El working tree ya contenia cambios previos de TASK-528/TASK-529/TASK-531/TASK-533.

Siguiente recomendado:
- QA local debe validar:
  - abrir `Mi empresa` expande submenu;
  - cada subitem muestra solo su vista;
  - `Membresías` no aparece en `Perfil`, `Logo`, `Acceso` ni `Comunicaciones`;
  - `Enviar campañas` sigue abriendo su seccion principal y mantiene envio real bloqueado.

Movimiento de tablero sugerido:
- TASK-539 a Done / Needs Review.
