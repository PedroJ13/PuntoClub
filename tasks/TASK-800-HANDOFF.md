Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-800 - Decidir publicacion del reset de flujo comun en Enviar campanas

Resultado:
- Decision aprobada para publicar el ajuste Web/UI del reset de flujo comun en `Enviar campañas`.
- Alcance limitado a Web/UI.
- No se cambia API.
- No se cambia SQL.
- No se cambia ACS, sender ni flags.
- No se envian correos reales.

Handoffs revisados:
- TASK-794:
  - QA publicada aprobo el P1 de destinatarios cumpleaneros con observacion P2.
  - Observacion P2: despues de entrar al flujo dedicado de cumpleaños, navegar fuera y volver a `Enviar campañas` podia mantener el filtro de cumpleaños hasta recargar.
- TASK-795:
  - Web Dev implemento un primer ajuste para restablecer flujo comun.
- TASK-796:
  - QA local no aprobo porque el menu lateral aun dejaba pegado el filtro de cumpleaños.
  - El subnav normal si restablecia correctamente.
- TASK-798:
  - Web Dev corrigio el reset desde menu lateral `Enviar campañas`.
  - La entrada normal vuelve a modo comun y selecciona campaña comun si existe.
  - El flujo dedicado desde alerta/boton de cumpleaños queda intacto.
- TASK-799:
  - QA local aprobo.
  - Menu lateral y subnav normal restablecen flujo comun sin recarga.
  - Flujo cumpleaños y flujo comun quedaron sin regresion.

Decision:
- Se autoriza ejecutar TASK-801.
- Publicar solo el cambio Web en `app/src/app.js` y handoffs relacionados.
- Verificar workflow Web hasta success.

Archivos esperados en TASK-801:
- `app/src/app.js`
- `tasks/TASK-793-HANDOFF.md`
- `tasks/TASK-794-HANDOFF.md`
- `tasks/TASK-795-HANDOFF.md`
- `tasks/TASK-796-HANDOFF.md`
- `tasks/TASK-798-HANDOFF.md`
- `tasks/TASK-799-HANDOFF.md`
- `tasks/TASK-800-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- `tasks/TASK-779-HANDOFF.md`
- archivos no relacionados

Condiciones:
- Ejecutar validaciones focales Web antes del commit.
- Pushear a `origin/main`.
- Verificar workflow Web hasta success.
- No ejecutar envio promocional real.

Uso Azure SQL:
- No.
- Motivo: decision de release Web/UI solamente.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- Falta publicar y validar en ambiente publicado.
- `tasks/TASK-800-HANDOFF.md` queda local pendiente de commit hasta TASK-801.

Siguiente recomendado:
- Ejecutar TASK-801.
- Luego ejecutar QA publicada corta del reset de flujo comun.
