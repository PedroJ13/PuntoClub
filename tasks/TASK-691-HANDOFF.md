Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UX imagen campana
Tarea completada: TASK-691 - Validar flujo de subida de imagen antes de enviar campana

Resultado:
- Se reviso el flujo Web de imagen opcional en Enviar campanas.
- Se ajusto la UX para que una imagen seleccionada localmente no se pueda asumir como imagen guardada.
- No se enviaron correos reales.
- No se cambiaron API, SQL, ACS, storage ni flags.

Cambios implementados:
- El texto del bloque `Imagen opcional` ahora indica que hay que seleccionar imagen y presionar `Agregar imagen` para guardarla antes de enviar.
- Al seleccionar un archivo valido, el estado visible ahora dice:
  - `Imagen seleccionada. Presiona Agregar imagen para guardarla antes de enviar.`
- Si hay un archivo seleccionado pendiente de subir:
  - el boton de envio queda deshabilitado;
  - el texto del boton cambia a `Guarda la imagen`;
  - si el usuario intenta enviar por alguna ruta, se muestra error claro:
    - `Hay una imagen seleccionada sin guardar. Presiona Agregar imagen o limpia la selección antes de enviar.`
- Despues de subir imagen correctamente:
  - se limpia el input local;
  - se muestra `Imagen agregada.`;
  - el preview vuelve a usar la imagen persistida del contrato `image.imageUrl`.
- Despues de eliminar imagen:
  - se actualiza estado de envio para no quedar con estado visual anterior.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `tasks/TASK-691-HANDOFF.md`

Validacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`

Uso Azure SQL:
- No.

Pendientes / riesgos:
- Falta QA real publicada con sesion de empresa para confirmar upload contra API/Blob Storage en navegador.
- No se probo envio real; queda intencionalmente fuera de alcance.
