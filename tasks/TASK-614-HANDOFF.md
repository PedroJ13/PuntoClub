Equipo: Product / Architect / Release
Tarea completada: TASK-614 - Decidir publicacion del paquete UX promociones e historial de correos

Handoffs revisados:
- `TASK-608-HANDOFF.md`: Backend/API - endpoint seguro de historial de correos operativos.
- `TASK-609-HANDOFF.md`: Web Dev - pantalla de historial de correos operativos en Mi empresa > Comunicaciones.
- `TASK-610-HANDOFF.md`: Diseno / UX - refinamiento UX de campanas guardadas y destinatarios.
- `TASK-611-HANDOFF.md`: Web Dev - implementacion del refinamiento visual de campanas y destinatarios.
- `TASK-612-HANDOFF.md`: QA - validacion local de refinamiento UX de campanas y destinatarios.
- `TASK-613-HANDOFF.md`: QA - validacion local de historial de correos operativos.

Resultado de revision:
- QA local de UX promociones:
  - Estado: aprobado.
  - P0/P1 abiertos: ninguno.
  - Observacion: P3 documental por ausencia de archivo assignment/tarea local.
- QA local de historial de correos operativos:
  - Estado: aprobado con observaciones.
  - P0/P1 abiertos: ninguno.
  - Observaciones P3:
    - ausencia de archivo assignment/tarea local;
    - si falla la carga inicial silenciosa del panel, la tabla queda vacia sin error visible hasta presionar `Consultar`.
- Backend/API:
  - Endpoint nuevo requiere sesion autenticada.
  - Valida empresa efectiva contra sesion.
  - No expone secretos, stack traces ni payload ACS completo.
  - Suite API completa reportada: 159/159 OK.
- Web:
  - Historial operativo visible en `Mi empresa > Comunicaciones`.
  - Selector/busqueda de campanas, formulario colapsable y preview siempre visible implementados.
  - QA local desktop/mobile sin overflow horizontal.

Condiciones de release confirmadas:
- Sin envio real nuevo.
- Sin reenvio de correos.
- Sin cambios SQL.
- Sin uso de Azure SQL en QA local.
- Sin ACS real ni correos reales en QA local.
- El envio promocional real sigue dependiendo de controles existentes de confirmacion/feature flag; esta decision no activa flags.

Decision:
- Aprobado publicar como paquete combinado API/Web.
- Alcance aprobado:
  - API de consulta de historial de correos operativos.
  - UI de historial de correos operativos.
  - Refinamiento UX/UI de campanas guardadas, preview y destinatarios.
- Motivo:
  - QA local aprobo los flujos criticos.
  - No hay P0/P1 abiertos.
  - Los P3 son aceptables para release controlado y no bloquean publicacion.

No incluido en esta decision:
- No publicar cambios fuera del paquete TASK-608 a TASK-613.
- No activar envio real promocional desde Release.
- No habilitar reenvio de correos operativos.
- No ejecutar migraciones SQL.
- No cambiar feature flags de Azure.

Riesgos aceptados:
- P3 UX: error inicial silencioso del historial puede quedar sin mensaje visible hasta accion manual `Consultar`.
- Falta QA publicado posterior despues del deploy.
- La validacion de historial fue local/mock y tests; no se valido endpoint contra Azure SQL real en esta decision.

Siguiente recomendado:
- Crear tarea Product / Architect / Release para commit/push controlado del paquete combinado API/Web.
- Incluir handoffs `TASK-608` a `TASK-614`.
- Excluir `debug.log`.
- Despues de publicar, crear QA publicado para:
  - historial de correos operativos autenticado;
  - UX de campanas y destinatarios;
  - confirmacion de que no hay reenvio;
  - confirmacion de que envio real promocional no se activo por esta publicacion.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y QA local; no requirio consultar datos reales.
