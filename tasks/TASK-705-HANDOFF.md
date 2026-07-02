Equipo: QA
Modo de ejecucion: Comunicaciones / Regresion imagen nueva campana
Tarea validada parcialmente: TASK-705 - Validar imagen en nueva campana sin arrastre de estado

Resultado:
- QA local con mock aprobo el bug principal:
  - al abrir `Crear campaña` despues de una campaña con imagen, no se arrastra imagen;
  - no se arrastra preview;
  - no se arrastran errores;
  - el bloque queda deshabilitado antes de guardar;
  - el mensaje visible es `Guarda la campaña para agregar una imagen`;
  - despues de guardar el borrador, los controles de imagen quedan habilitados;
  - al agregar imagen mock, el preview la muestra.
- No se enviaron correos reales.
- No se uso Azure SQL.

Ambiente de prueba:
- Local static server temporal en `127.0.0.1`.
- `PUNTO_CLUB_USE_MOCK_API=true` inyectado en Playwright.
- Usuario mock:
  - `owner@mock.test`
- No se usaron credenciales reales.

Casos validados:
- Login mock y entrada a `Enviar campañas`.
- Abrir `Crear campaña` con estado limpio.
- Antes de guardar:
  - input de imagen deshabilitado;
  - boton `Agregar imagen` deshabilitado;
  - boton `Eliminar` deshabilitado;
  - preview de bloque sin imagen;
  - preview de correo sin `<img>`;
  - sin error visible;
  - mensaje: `Guarda la campaña para agregar una imagen`.
- Despues de guardar:
  - formulario permanece abierto;
  - input de imagen habilitado;
  - boton `Agregar imagen` habilitado;
  - boton `Eliminar` sigue deshabilitado hasta existir imagen.
- Imagen agregada en mock:
  - bloque muestra imagen;
  - preview de correo muestra imagen;
  - estado muestra `Imagen agregada.`
- Al ocultar y volver a abrir `Crear campaña`:
  - input vuelve a quedar deshabilitado;
  - no queda imagen previa;
  - preview de correo no tiene imagen;
  - no queda error anterior;
  - vuelve el mensaje `Guarda la campaña para agregar una imagen`.

Validaciones tecnicas:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`

No aprobado / pendiente:
- No se valido persistencia tras recargar pantalla con API real y Blob Storage porque esta tarea se ejecuto local con mock y sin credenciales reales publicadas.
- Requiere QA publicado posterior con sesion de empresa para confirmar:
  - subir imagen real;
  - recargar pantalla;
  - confirmar que la imagen persiste desde API/Blob;
  - no enviar correo real.

Uso Azure SQL:
- No.

P0/P1:
- No se detectan P0/P1 para el bug local de arrastre de estado.
