Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UI imagen campana
Tarea completada: TASK-671 - Implementar UI de imagen opcional en campanas

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-671-HANDOFF.md`

Implementacion:
- Se agrego bloque `Imagen opcional` en el formulario de campaña.
- La UI permite:
  - seleccionar imagen;
  - previsualizar miniatura antes de guardar;
  - subir/agregar imagen;
  - reemplazar imagen existente;
  - eliminar imagen;
  - ver estado/error.
- El preview colapsable de campaña muestra la imagen cuando existe.
- El mock local soporta imagenes usando URL `blob:` del navegador.
- HTTP real llama los contratos aprobados:
  - GET/POST/DELETE image por campaña.

Validaciones Web:
- Tipo permitido:
  - PNG, JPG/JPEG, WebP.
- Tamano:
  - maximo 1 MB.
- Mensajes visibles:
  - tipo no permitido;
  - tamano excedido;
  - sesion/permisos/error controlado desde API.

Reglas preservadas:
- No se cambio seleccion manual de destinatarios.
- No se cambio limite MVP de 5.
- No se cambio API fuera de contratos aprobados.
- No se enviaron correos reales.
- No se cambiaron flags.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: en ambiente real, la UI requiere que API este publicada y que la migracion SQL exista.
- P2: validar visualmente desktop/mobile antes de publicar; no se ejecuto Playwright/screenshot en esta tarea.
- P2: si el navegador bloquea preview `blob:` en algun ambiente, mock local podria requerir ajuste menor.

Siguiente recomendado:
- QA local visual de:
  - crear campana sin imagen;
  - subir imagen valida;
  - reemplazar;
  - eliminar;
  - errores por tipo/tamano;
  - preview colapsable.
