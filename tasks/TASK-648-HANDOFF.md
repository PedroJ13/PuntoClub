Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UX campanas
Tarea completada: TASK-648 - Implementar preview colapsable y resultado de envio mejor ubicado

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-648-HANDOFF.md`

Implementacion:
- Se movio el resultado/mensaje de envio a un panel propio debajo del boton `Enviar campana`.
- El panel de resultado queda oculto hasta que haya estado o error.
- El resultado post-envio mantiene foco/scroll usando el comportamiento existente.
- El preview queda colapsado por default.
- Se agrego boton `Ver preview` / `Ocultar preview`.
- El toggle sincroniza `aria-expanded` y `aria-controls`.
- Las variables disponibles quedan dentro del contenido colapsable del preview.
- El boton `Enviar campana` permanece en el panel principal, cerca del texto de regla MVP.

Reglas preservadas:
- No se cambio API.
- No se cambiaron reglas de envio.
- No se activaron ni desactivaron flags.
- No se cambiaron destinatarios.
- No se envio ningun correo real.
- Se mantiene seleccion manual y limite MVP de 5 destinatarios.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css`

Resultado:
- Validacion sintactica aprobada.
- Diff check aprobado.
- Cambio listo para QA visual local/publicado.

Uso Azure SQL:
- No.
- Motivo: ajuste de UI/UX local; no requiere datos reales.

Riesgos o pendientes:
- Falta QA visual desktop/mobile para confirmar que el preview colapsado y el panel de resultado reducen saturacion.
- Falta QA funcional con mock/API para confirmar que el resultado se mantiene visible despues de un envio simulado o real controlado.
- Publicacion queda para tarea de release posterior.
