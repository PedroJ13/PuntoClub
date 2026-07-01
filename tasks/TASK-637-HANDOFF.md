Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Error handling
Tarea completada: TASK-637 - Mejorar mensaje de error en envio promocional fallido

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-637-HANDOFF.md`

Implementacion:
- Se ajusto el manejo de error del flujo `sendPromotionalCampaign`.
- El catch de envio ahora llama `renderCommunicationCampaignError(error, { action: "send" })`.
- Si el API responde `INTERNAL_ERROR` o mensaje generico `Unexpected API error.`, la UI muestra:
  - `No pudimos confirmar el envío. No lo reintentes todavía; revisa el historial o contacta soporte para confirmar si hubo intento.`
- Si el API devuelve un mensaje controlado y no sensible, se muestra ese mensaje.
- El resto de errores de campanas conserva el comportamiento existente.

Reglas preservadas:
- No se cambiaron reglas de envio.
- No se activo ni desactivo ningun flag.
- No se reenviaron correos.
- No se cambiaron endpoints.
- No se agregaron dependencias.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\src\app.js`

Uso Azure SQL:
- No.
- Motivo: ajuste Web local de manejo de error; no requiere DB real.

Riesgos o pendientes:
- Falta QA local/publicado para observar el mensaje con un `500` real o mockeado.
- La causa raiz del `500` esta en Backend/API segun TASK-635; esta tarea solo mejora el mensaje al usuario.
- Publicacion queda para tarea de release posterior.
