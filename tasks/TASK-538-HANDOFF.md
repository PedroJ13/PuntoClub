Equipo: Diseno / UX
Modo de ejecucion: Navegacion / Menu lateral
Tarea: TASK-538 - Ajustar modelo UX de submenu colapsable en Mi empresa

Resultado:
- Se define que `Mi empresa` en el menu lateral debe comportarse como grupo colapsable.
- Se elimina el concepto de tabs internos dentro de `Mi empresa` para las vistas administrativas.
- Las vistas de empresa deben vivir como subitems del menu lateral:
  - `Perfil`
  - `Logo`
  - `Acceso`
  - `Membresias`
  - `Comunicaciones`
- `Enviar campañas` debe mantenerse como item principal separado del menu lateral.

Regla UX:
- `Mi empresa` es el contenedor de configuracion y administracion de la empresa.
- El usuario no debe ver tabs internos duplicando la navegacion del lateral.
- Al abrir `Mi empresa`, el submenu debe expandirse y entrar por defecto a `Perfil`.
- Al seleccionar cualquier subitem, la seccion visible sigue siendo `Mi empresa`, pero cambia la vista interna correspondiente.
- `Membresias` debe ser una vista propia dentro del submenu de `Mi empresa`.
- `Membresias` no debe aparecer dentro de todas las vistas/paneles de `Mi empresa`.
- `Comunicaciones` dentro de `Mi empresa` es una vista de contexto/configuracion, no reemplaza el item principal `Enviar campañas`.

Modelo de menu lateral:
- `Atender cliente`
- `Mi empresa`
  - `Perfil`
  - `Logo`
  - `Acceso`
  - `Membresias`
  - `Comunicaciones`
- `Reportes`
- `Enviar campañas`
- `Panel interno` cuando aplique

Estados esperados:
- `Mi empresa` puede mostrar estado activo cuando cualquiera de sus subitems esta activo.
- El submenu debe quedar expandido al estar en una vista de `Mi empresa`.
- `Enviar campañas` mantiene su propia seccion y no se mueve dentro de `Mi empresa`.
- El envio real de campañas sigue bloqueado.

Verificacion ejecutada:
- Revision de estructura actual de `Mi empresa`, `Membresias` y `Comunicaciones` en `app/index.html`.
- Revision de comportamiento actual de `setCompanySubsection` y `setActiveSection` en `app/src/app.js`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- No hubo deploy.

Riesgos o pendientes:
- Web Dev debe mover el host de configuracion de membresias a un panel propio para evitar que aparezca en todas las vistas.
- QA debe validar desktop/mobile que el submenu lateral sea claro y no duplique tabs.

Siguiente recomendado:
- TASK-539 implementa el submenu colapsable y retira tabs internos de `Mi empresa`.

Movimiento de tablero sugerido:
- TASK-538 a Done / Needs Review.
