Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Prueba real promociones
Tarea completada: TASK-584 - Autorizar prueba controlada de envio real promocional

Resultado:
- Se autoriza preparar la habilitacion controlada de envio real promocional.
- Esta tarea no ejecuta envio real.
- La prueba de envio real sera realizada por Product Owner desde la Web publicada, una vez que Ejecucion Tecnica habilite el mecanismo requerido.
- El alcance autorizado es piloto controlado, no envio masivo abierto.

Decision:
- Habilitar la posibilidad de enviar promociones reales desde el modulo `Enviar campanas`.
- Mantener el sender actual de Azure/ACS por costo y continuidad operativa.
- No enviar desde correos propios de las empresas en esta fase.
- El envio debe respetar destinatarios seleccionados por la empresa en la UI.

Regla de destinatarios:
- El envio real solo debe llegar a clientes marcados/seleccionados en la lista de destinatarios de la campana.
- Clientes no seleccionados no deben recibir el correo.
- Clientes en baja promocional no deben aparecer como elegibles ni recibir promociones.
- El limite MVP actual de destinatarios seleccionados debe mantenerse hasta nueva decision.
- Antes de enviar, la UI debe permitir revisar la seleccion y confirmar explicitamente el envio.

Empresa y prueba:
- Empresa: la empresa autenticada que opere la campana desde la Web publicada.
- Destinatarios: solo los clientes seleccionados con check en la campana.
- Limite maximo inicial: mantener el limite MVP existente de seleccion controlada.
- Product Owner realizara la prueba real desde la UI; no se autoriza a otros chats a enviar correos por API o scripts sin tarea adicional.

Sender:
- Usar Azure/ACS actual.
- Display/from debe mantenerse alineado a Punto Club y decisiones previas.
- Reply-to o nombre visible de empresa puede mantenerse segun configuracion existente, si ya esta implementado.

Evidencia esperada:
- Captura o descripcion del PO donde conste:
  - empresa usada;
  - nombre/asunto de campana;
  - destinatarios seleccionados;
  - confirmacion visual previa al envio;
  - correo recibido por al menos un destinatario controlado;
  - que no se envio a clientes no seleccionados.
- No exponer tokens, cookies, passwords, connection strings ni datos sensibles innecesarios.

Criterio de rollback / contencion:
- Si el envio llega a destinatarios no seleccionados, se debe deshabilitar inmediatamente el envio real promocional.
- Si falla ACS o aparece error no controlado, mantener el envio bloqueado y crear tarea Backend/API.
- Si se detecta riesgo de spam, volumen o costo, pausar la habilitacion y volver a decision Product / Architect / Release.

Uso Azure SQL:
- No.
- Motivo: decision funcional de alcance; no se consulto ni modifico DB real.

Riesgos o pendientes:
- Falta tarea de Ejecucion Tecnica para implementar/desbloquear el envio real con feature flag/control de confirmacion.
- Falta QA local/web de seguridad antes de que PO haga prueba real amplia.
- La prueba real debe empezar con destinatarios controlados y volumen minimo.

Siguiente recomendado:
- Crear tarea para Backend/API + Web Dev o Ejecucion Tecnica que habilite el envio real promocional bajo feature flag y confirmacion explicita, respetando solo destinatarios seleccionados.
