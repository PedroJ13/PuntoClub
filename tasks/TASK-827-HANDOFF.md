# TASK-827 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-07

Resultado:
- Decision aprobada: publicar Web para el copy de confirmacion masiva.
- Se revisaron los handoffs TASK-825 y TASK-826.
- Alcance confirmado:
  - Web muestra la cantidad real en el mensaje final de confirmacion.
  - El copy diferencia singular/plural: `1 destinatario seleccionado` / `N destinatarios seleccionados`.
  - El nombre de la campana queda separado dentro del mensaje.
  - Se mantiene el aviso de que no se enviara a clientes no seleccionados ni dados de baja.
  - QA local valido conteos previos para 1, varios y todos los elegibles.
  - QA no acepto el envio y no hubo correos reales.

Decision:
- Aprobado avanzar con TASK-828 para commit y push controlado Web.
- Alcance de publicacion: Web/UI solamente.

Restricciones:
- No cambiar API.
- No cambiar SQL.
- No cambiar ACS, sender ni flags.
- No enviar correos reales durante release.
- Mantener fuera archivos no relacionados y handoffs antiguos no solicitados.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y ajuste Web local; no requirio datos reales ni migracion.

Riesgos o pendientes:
- QA local dejo P3: no capturo visualmente el dialogo nativo `window.confirm`, pero valido el contenido por codigo y los conteos previos en UI.
- Despues de publicar, conviene validar visualmente el dialogo publicado sin confirmar envio.

Siguiente recomendado:
- Ejecutar TASK-828.
