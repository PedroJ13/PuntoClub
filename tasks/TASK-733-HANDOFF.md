Equipo: Product / Architect / Release
Modo de ejecucion: Promociones / Error handling
Tarea completada: TASK-733 - Definir manejo de destinatario duplicado en envio promocional

Resultado:
- Se definio el comportamiento funcional para el caso de destinatario duplicado en envio promocional.
- Se mantiene el bloqueo anti-duplicado por campana.
- Se confirma que el caso no es fallo de envio de correo, sino un bloqueo preventivo porque el cliente ya estaba asociado a esa campana.
- Se definio copy en espanol y estado visual esperado.

Decision:
- Mantener la restriccion de no duplicar `campaign_id + customer_id`.
- No permitir reenvio al mismo cliente en la misma campana en esta fase.
- No relajar SQL ni reglas backend.
- No borrar historial automaticamente.
- El usuario debe crear una nueva campana o seleccionar otra campana si quiere volver a enviar una promocion al mismo cliente.

Copy aprobado:
- Principal:
  - `Este cliente ya fue incluido en esta campana. Para volver a enviarle una promocion, crea una nueva campana o selecciona otra.`
- Alternativo si el estado permite distinguir preparado/no enviado:
  - `Este cliente ya esta preparado para esta campana. Revisa la seleccion actual antes de continuar.`
- Alternativo si ya fue enviado:
  - `Este cliente ya recibio esta campana. Para reenviarle, crea una nueva campana.`
- Fallback seguro:
  - `No pudimos preparar ese destinatario porque ya estaba incluido en esta campana.`

Estado visual definido:
- Mostrar en panel `Resultado`.
- Usar estilo informativo/advertencia.
- No mostrar texto tecnico en ingles.
- Mantener campana y destinatarios visibles.
- Refrescar destinatarios/historial si el flujo actual lo permite sin efectos colaterales.

Uso Azure SQL:
- No.
- Motivo: definicion funcional/documental sin acceso a datos.

Cambios de archivos:
- `tasks/TASK-733.md`
- `tasks/TASK-733-HANDOFF.md`

Riesgos o pendientes:
- Falta implementacion Web para mapear el error tecnico a copy de producto.
- Falta QA local para confirmar que el bloqueo sigue activo sin mostrar texto tecnico.

Siguiente recomendado:
- Crear tarea Web Dev para implementar el mapeo del mensaje.
- Crear tarea QA local para validar copy, bloqueo y flujo normal.
