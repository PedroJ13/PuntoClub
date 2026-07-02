Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Preview imagen
Tarea completada: TASK-681 - Mostrar imagen activa en preview de campana

Resultado:
- Se reviso el flujo de Enviar campañas para campanas con imagen activa.
- Se ajusto la UI para sincronizar la imagen que venga del endpoint de `preview` con la campana activa y con la miniatura del bloque `Imagen opcional`.
- Se preserva la imagen actual despues de enviar si la respuesta de envio trae `campaign` sin propiedad `image`, evitando que la UI olvide la miniatura/preview al actualizar estado.

Estados cubiertos:
- Sin imagen: el preview queda sin `<img>` y el bloque muestra `Sin imagen`.
- Con imagen: el preview usa `api.getCampaignImageUrl(image.imageUrl)` y muestra la imagen activa.
- Reemplazo: la imagen subida actualiza campana activa, lista y preview.
- Eliminacion: la imagen queda en `null`, se limpia miniatura y preview.
- Cambio de campana / recarga: `GET campaign` y `preview` vuelven a sincronizar imagen activa.
- Envio: no se pierde la imagen si la respuesta de envio no la incluye.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-681-HANDOFF.md`

Validacion ejecutada:
- `node --check app\src\app.js`
- `git diff --check`

Uso Azure SQL:
- No.

Correos reales / flags:
- No se enviaron correos reales.
- No se cambio API, SQL, ACS ni flags.

Pendientes / riesgos:
- P2: falta QA visual en navegador publicado/local con imagen real despues de que el paquete API/Web sea desplegado.
