Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-782 - Decidir aplicacion de migracion y publicacion del paquete cumpleanos

Resultado:
- Decision aprobada para avanzar con la aplicacion controlada de la migracion SQL de cumpleanos y, despues de eso, publicar API/Web.
- No se aplico SQL desde esta tarea.
- No se publico API/Web desde esta tarea.
- No se enviaron correos reales.
- No se cambiaron ACS, sender ni flags.

Handoffs revisados:
- TASK-773: definicion funcional de fecha de nacimiento, alertas y campanas de cumpleanos.
- TASK-774: migracion SQL versionada preparada en `database/migrations/20260705_birthdays_campaign_type.sql`; no aplicada en Azure SQL.
- TASK-775: Backend/API local implementado y validado; tests focales 56/56 aprobados.
- TASK-776: Web local implementado para fecha de nacimiento, indicador de datos incompletos, alerta de cumpleaneros y tipos de campana.
- TASK-777: QA local inicial no aprobado por P1 de selector de campanas de cumpleanos.
- TASK-780: Web corrigio el filtro del flujo dedicado de cumpleanos.
- TASK-781: QA local aprobado; sin P0/P1/P2/P3 abiertos.

Decision:
- Se autoriza continuar con TASK-783 para aplicar la migracion SQL en Azure SQL.
- Se autoriza continuar con TASK-784 solo despues de TASK-783 aprobado.
- La publicacion debe incluir API, Web, migracion SQL versionada, tests y handoffs relacionados.
- La validacion publicada debe quedar para QA en TASK-785.

Alcance aprobado:
- Fecha de nacimiento nullable para clientes.
- Indicador no bloqueante de datos incompletos cuando falta fecha de nacimiento.
- Actualizacion de fecha desde ficha/transaccion de cliente.
- Alerta de cumpleaneros del dia despues del login.
- Tipos de campana `comun` y `cumpleanos`.
- Backfill/default de campanas existentes como `comun`.
- Flujo manual de envio de campanas de cumpleanos:
  - selector limitado a campanas tipo `cumpleanos`;
  - destinatarios limitados a cumpleaneros del dia;
  - limite MVP de 5;
  - confirmacion manual;
  - sin envio automatico.
- Flujo normal de campanas comunes sin filtro de cumpleanos.

Condiciones para TASK-783:
- Leer guardrails de Azure SQL antes de conectar.
- Usar ventana corta de aplicacion.
- Validar columnas, constraints e indices despues de aplicar.
- Confirmar que campanas existentes quedan como `comun`.
- No borrar datos.
- No tocar clientes, puntos, compras, canjes, membresias, preferencias, imagenes promocionales, ACS, sender ni flags.

Condiciones para TASK-784:
- Ejecutar despues de TASK-783 aprobado.
- Incluir cambios API/Web/migracion/handoffs de TASK-773 a TASK-783.
- Excluir `debug.log`, `tmp/` y archivos no relacionados.
- Verificar workflows API y Web hasta success.
- No enviar correos reales.
- No cambiar flags.

Uso Azure SQL:
- No.
- Motivo: esta tarea fue decision de release; la aplicacion real queda delegada a TASK-783.

Riesgos o pendientes:
- La validacion hasta ahora fue local/mock; falta aplicar migracion y validar ambiente publicado.
- La migracion introduce columnas calculadas persistidas e indices; SQL DEV debe confirmar aplicacion limpia en Azure SQL.
- El dato de fecha de nacimiento debe mantenerse bajo el alcance de privacidad definido: no mostrar edad y no incluir fecha completa en correos.

Siguiente recomendado:
- Ejecutar TASK-783 con SQL DEV.
- Si TASK-783 aprueba, ejecutar TASK-784 para commit/push controlado.
- Despues de publicar, ejecutar TASK-785 con QA publicada.
