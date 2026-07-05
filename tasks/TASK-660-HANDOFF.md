Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / UX imagen campana
Tarea completada: TASK-660 - Definir UX para imagen opcional en campanas

Resultado:
- Se definio UX para agregar, previsualizar, reemplazar y eliminar una imagen opcional en campanas promocionales.
- No se implemento UI.
- No se cambiaron contratos API.
- No se cambio flujo de envio ni reglas de destinatarios.

Principio UX:
- La imagen debe sentirse como mejora opcional, no como requisito.
- Crear una campana debe seguir siendo simple: nombre, asunto, mensaje, puntos y destinatarios.
- No agregar editor de imagen, cropper, galeria ni multiples imagenes en MVP.

Ubicacion en crear/editar campana:
- Dentro del formulario de campana, debajo del mensaje y antes de guardar.
- Bloque compacto:
  - titulo: `Imagen opcional`
  - ayuda breve: `JPG, PNG o WebP. Maximo 1 MB.`
  - accion principal: `Agregar imagen`
- Si ya hay imagen:
  - mostrar miniatura.
  - mostrar nombre de archivo y tamano.
  - acciones:
    - `Reemplazar`
    - `Eliminar`

Estados:
- Sin imagen:
  - bloque compacto con boton de carga.
  - no mostrar advertencias pesadas.
- Cargando:
  - indicador local.
  - bloquear solo acciones de imagen, no toda la pantalla.
- Imagen cargada:
  - miniatura visible.
  - mensaje breve: `Imagen agregada.`
- Imagen reemplazada:
  - actualizar miniatura.
  - mensaje breve: `Imagen reemplazada.`
- Imagen eliminada:
  - volver a estado sin imagen.
  - mensaje breve: `Imagen eliminada.`

Preview:
- Mantener el preview colapsado por default segun decision previa.
- En el encabezado colapsado del preview, si hay imagen, mostrar un indicador discreto:
  - `Incluye imagen`
- Al abrir preview:
  - mostrar imagen debajo del encabezado/marca y antes del texto de la campana.
  - mantener ancho maximo tipo email.
  - no agrandar demasiado el preview ni empujar destinatarios innecesariamente.
- Si no hay imagen:
  - preview funciona igual que hoy.

Email final:
- Ubicacion recomendada:
  - debajo del header/marca de Punto Club o empresa.
  - antes del cuerpo principal de la promocion.
- Tratamiento visual:
  - ancho maximo compatible con email.
  - bordes simples o sin borde.
  - no usar como fondo de texto.
  - no depender de la imagen para entender la promocion.
- Accesibilidad:
  - `alt` automatico desde nombre de campana.
  - opcion posterior: permitir editar texto alternativo si QA/PO lo pide.

Mensajes de error:
- Tipo no permitido:
  - `Usa una imagen JPG, PNG o WebP.`
- Tamano excedido:
  - `La imagen supera el limite de 1 MB.`
- Archivo vacio o danado:
  - `No pudimos leer la imagen. Intenta con otro archivo.`
- Error de carga:
  - `No se pudo guardar la imagen. Intenta de nuevo.`
- Sesion vencida:
  - `Tu sesion vencio. Inicia sesion para continuar.`
- Sin permisos:
  - `No tienes permiso para modificar esta campana.`

Confirmaciones:
- Reemplazar:
  - no requiere modal si la accion es explicita desde boton `Reemplazar`.
  - al seleccionar archivo nuevo, mostrar estado de carga y resultado.
- Eliminar:
  - usar confirmacion ligera si ya estaba guardada:
    - `Eliminar imagen de esta campana?`
  - copy secundario:
    - `La campana quedara sin imagen.`

Reglas para mantener simple el flujo:
- No exigir imagen para guardar campana.
- No poner la imagen dentro de la seleccion de destinatarios.
- No duplicar controles de imagen en el panel de envio.
- No mostrar configuracion tecnica de formato fuera del helper y errores.
- No permitir URL externa como imagen en MVP.

Impacto en Enviar campanas:
- Selector de campana guardada:
  - si la campana tiene imagen, puede mostrar un badge discreto `Imagen`.
- Preview colapsable:
  - al abrir, muestra la imagen.
- Boton `Enviar campana`:
  - no cambia de lugar ni de regla.
- Resultado post-envio:
  - no necesita repetir la imagen.

Criterios de aceptacion UX:
- Una empresa puede crear campana sin imagen.
- Una empresa puede agregar una imagen y verla en preview.
- Una empresa puede reemplazarla sin perder el texto de la campana.
- Una empresa puede eliminarla y seguir enviando la campana sin imagen.
- Los errores de formato/tamano son claros antes o durante la carga.
- El preview no queda visualmente saturado.
- El flujo de destinatarios y limite MVP de 5 no cambia.

Archivos cambiados:
- Solo este handoff:
  - `tasks/TASK-660-HANDOFF.md`

Verificacion ejecutada:
- Revision local de:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `chat-start/DISENO_UX.md`
  - `tasks/TASK-647-HANDOFF.md`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: Si la imagen se vuelve protagonista obligatoria, puede complicar innecesariamente el flujo MVP.
- P2: Algunos clientes de email bloquean imagenes por defecto; el mensaje debe seguir entendible sin imagen.
- P2: Si se permite imagen muy grande, empeora carga y entregabilidad percibida.

Siguiente recomendado:
- Product / Architect / Release debe decidir si aprueba la opcion de imagen opcional.
- Si se aprueba, Web Dev debe implementar UI despues de que Backend/API entregue contratos reales.
