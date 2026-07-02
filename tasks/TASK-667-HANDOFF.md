Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / UX imagen campana
Tarea completada: TASK-667 - Definir UX para imagen opcional en campanas

Resultado:
- Se definio UX para agregar, previsualizar, reemplazar y eliminar imagen opcional de campana, continuando desde `TASK-656`.
- No se implemento UI.
- No se cambiaron contratos API.
- No se cambio el flujo de envio.

Principio UX:
- La imagen es una mejora opcional, no un requisito.
- Crear una campana debe seguir siendo simple.
- No incluir editor, cropper, galeria ni multiples imagenes en MVP.

Ubicacion en crear/editar campana:
- Bloque `Imagen opcional` dentro del formulario de campana.
- Ubicarlo debajo del mensaje y antes de guardar.
- Helper corto:
  - `JPG, PNG o WebP. Maximo 1 MB.`
- Accion principal:
  - `Agregar imagen`

Estado con imagen cargada:
- Mostrar miniatura.
- Mostrar nombre de archivo y tamano.
- Acciones:
  - `Reemplazar`
  - `Eliminar`
- Mensaje positivo breve:
  - `Imagen agregada.`
  - `Imagen reemplazada.`
  - `Imagen eliminada.`

Preview:
- Mantener preview colapsado por default.
- Si la campana tiene imagen, mostrar indicador discreto en header colapsado:
  - `Incluye imagen`
- Al abrir preview:
  - imagen debajo del encabezado/marca y antes del texto de la campana;
  - ancho maximo tipo email;
  - no usar imagen como fondo de texto;
  - no agrandar tanto el preview que esconda destinatarios.

Correo final:
- Imagen debajo del header/marca y antes o cerca del mensaje principal.
- El texto del correo debe seguir entendible aunque el cliente bloquee imagenes.
- `alt` automatico desde nombre de campana o empresa.
- No incluir imagen como adjunto.

Mensajes de error:
- Tipo no permitido:
  - `Usa una imagen JPG, PNG o WebP.`
- Tamano excedido:
  - `La imagen supera el limite de 1 MB.`
- Archivo danado/vacio:
  - `No pudimos leer la imagen. Intenta con otro archivo.`
- Error de carga:
  - `No se pudo guardar la imagen. Intenta de nuevo.`
- Sesion vencida:
  - `Tu sesion vencio. Inicia sesion para continuar.`
- Sin permisos:
  - `No tienes permiso para modificar esta campana.`

Confirmaciones:
- Reemplazar:
  - no requiere modal si el usuario usa boton `Reemplazar`.
- Eliminar:
  - usar confirmacion ligera:
    - `Eliminar imagen de esta campana?`
    - `La campana quedara sin imagen.`

Reglas de simplicidad:
- No exigir imagen para guardar.
- No poner imagen dentro de seleccion de destinatarios.
- No duplicar controles de imagen en panel de envio.
- No permitir URL externa en MVP.
- No bloquear envio de campana sin imagen.

Criterios de aceptacion UX:
- Crear campana sin imagen sigue igual.
- Agregar imagen muestra miniatura y preview.
- Reemplazar imagen no borra texto de campana.
- Eliminar imagen deja la campana sin imagen.
- Error de formato/tamano es claro.
- Preview no se satura.
- Flujo de destinatarios y limite MVP de 5 no cambia.

Archivos cambiados:
- Solo este handoff:
  - `tasks/TASK-667-HANDOFF.md`

Verificacion ejecutada:
- Revision local/documental de:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `chat-start/DISENO_UX.md`
  - `tasks/TASK-656-HANDOFF.md`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: si la imagen se vuelve obligatoria, complicaria el MVP.
- P2: algunos clientes de email bloquean imagenes remotas.
- P2: imagenes pesadas afectan carga y percepcion de entregabilidad.

Siguiente recomendado:
- Esperar contratos Backend/API y decision de storage.
- Luego Web Dev puede implementar la UI en una tarea separada.
