Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Definicion funcional
Tarea completada: TASK-656 - Definir imagen opcional en campanas promocionales

Objetivo:
- Permitir que una campana promocional tenga una imagen opcional para mejorar el impacto visual del correo.
- Mantener el MVP simple, seguro y razonable para entregabilidad.

Decision funcional MVP:
- La imagen se guarda por campana, no por envio.
- El envio usa la imagen vigente de la campana al momento de enviar.
- Si la empresa actualiza o elimina la imagen despues de un envio, eso no debe reescribir historicos de envio; el historial puede conservar metadata/snapshot si el modelo lo permite.
- La imagen es opcional.
- Si una campana no tiene imagen, el correo se envia solo con asunto, texto, puntos si aplica y footer de baja promocional.

Alcance de usuario:
- Al crear o editar una campana, la empresa puede:
  - subir una imagen;
  - ver preview antes de guardar/enviar;
  - reemplazar la imagen;
  - quitar la imagen;
  - guardar la campana sin imagen.
- La UI debe mostrar errores claros si la imagen no cumple formato o tamano.
- La imagen debe verse en:
  - formulario/preview de campana;
  - preview del correo;
  - correo promocional final.

Formatos permitidos MVP:
- `PNG`.
- `JPG/JPEG`.
- `WebP` solo si Infra/Backend confirma compatibilidad razonable con render de email y clientes objetivo.
- No permitir `SVG`, `GIF`, `HEIC`, archivos comprimidos ni PDFs.

Tamano maximo MVP:
- Recomendado: maximo `1 MB` por imagen.
- Recomendado adicional UX/API: advertir que imagenes livianas cargan mejor en correos.
- Si Infra/ACS o storage recomienda un limite menor, puede ajustarse antes de implementacion.

Dimensiones recomendadas:
- Orientacion horizontal o cuadrada.
- Recomendado para correo: ancho visual maximo 600 px.
- El backend o pipeline puede conservar el original validado; optimizacion/resize queda como mejora posterior si no existe hoy.
- La UI debe evitar que imagenes enormes rompan el preview.

Comportamiento en correo:
- No usar adjunto pesado.
- Preferir imagen hospedada y referenciada con URL segura en HTML del correo.
- La imagen debe aparecer debajo del texto principal o entre encabezado y mensaje, segun defina Diseno/UX.
- El texto del correo debe seguir funcionando aunque el cliente de correo bloquee imagenes.
- Debe incluir `alt text` basico, por ejemplo nombre de campana o nombre de empresa.

Persistencia funcional:
- Guardar metadata por campana:
  - ruta/blob path o identificador de storage;
  - nombre original;
  - content type;
  - tamano;
  - fecha de carga/actualizacion;
  - estado presente/eliminada si aplica.
- No guardar la imagen en SQL como varbinary en MVP.
- SQL debe guardar metadata, no el binario.

Seguridad:
- Validar server-side:
  - tipo MIME;
  - extension;
  - tamano;
  - magic bytes cuando sea viable;
  - pertenencia companyId/campana/sesion.
- No confiar en validacion del navegador.
- No exponer rutas internas ni secretos de storage.
- No permitir que una empresa vea o use imagenes de otra empresa.

Storage / URL:
- Infra debe decidir si se reutiliza el storage existente de logos con ruta separada o un contenedor/ruta nueva para campanas.
- Para email, se necesita URL resoluble por el cliente de correo.
- Si se usa proxy/API para servir imagen, debe considerar que clientes de correo no tendran sesion.
- Si se usa URL publica o SAS, debe definirse duracion/seguridad/costo.

Actualizacion y eliminacion:
- Reemplazar imagen debe:
  - validar nueva imagen;
  - actualizar metadata de campana;
  - dejar la campana usando la nueva imagen para futuros envios.
- Quitar imagen debe:
  - dejar la campana sin imagen para futuros envios;
  - no borrar historicos de envio.
- Limpieza de blobs antiguos:
  - deseable pero no bloqueante para MVP;
  - Infra puede proponer limpieza posterior o borrado inmediato seguro.

Fuera de alcance MVP:
- Galeria de imagenes reutilizables.
- Editor de imagen.
- Crop/resize avanzado.
- Multiples imagenes por campana.
- Adjuntos en correo.
- Analitica de apertura/click de imagen.
- Personalizacion de imagen por cliente.

Criterios de aceptacion funcional:
- Crear campana sin imagen sigue funcionando.
- Crear campana con imagen valida guarda metadata y muestra preview.
- Reemplazar imagen actualiza el preview y el correo futuro.
- Quitar imagen deja la campana sin imagen.
- Imagen invalida muestra error claro y no se guarda.
- Enviar campana con imagen incluye la imagen en el HTML del correo.
- Enviar campana sin imagen no falla.
- No se rompe baja promocional, puntos disponibles, limite MVP de 5 ni seleccion manual.

Riesgos:
- Entregabilidad: imagenes remotas pueden ser bloqueadas por clientes de correo.
- Privacidad/cache: algunos clientes cachean imagenes.
- Seguridad: URLs publicas mal definidas podrian exponer assets entre empresas.
- Costo: muchas imagenes grandes pueden aumentar storage/ancho de banda.
- Compatibilidad: WebP puede no renderizar igual en todos los clientes de correo.

Decisiones pendientes para tareas siguientes:
- Infra: estrategia de storage y URL usable en emails.
- SQL DEV: migracion de metadata de imagen por campana.
- Backend/API: endpoints y validaciones.
- Diseno/UX: ubicacion exacta en formulario, preview y correo.
- QA: matriz de formatos/tamanos y prueba de correo visual.

Uso Azure SQL:
- No.
- Motivo: definicion funcional; no se consultaron ni modificaron datos reales.

Cambios aplicados:
- Solo se crea `tasks/TASK-656-HANDOFF.md`.

Siguiente recomendado:
- Ejecutar tareas de Infra, SQL DEV, Backend/API y Diseno/UX para diseno tecnico antes de implementar.
