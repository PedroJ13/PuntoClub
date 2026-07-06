Equipo: Product / Architect / Release
Modo de ejecucion: Cumpleanos / Definicion funcional
Tarea completada: TASK-773 - Definir flujo de fecha de nacimiento, alertas y campanas de cumpleanos

Resultado:
- Se define el alcance funcional MVP para fecha de nacimiento, alertas de cumpleanos y campanas tipificadas.
- No se implemento codigo.
- No se aplico SQL.
- No se cambio API, Web, ACS, sender ni flags.
- No se enviaron correos reales.

Decisiones funcionales:
- Agregar fecha de nacimiento a clientes como dato opcional en MVP.
- Para clientes nuevos:
  - mostrar campo `Fecha de nacimiento`;
  - permitir guardar cliente sin fecha;
  - si falta, mostrar indicador de datos incompletos.
- Para clientes existentes:
  - la fecha inicia en blanco/null;
  - se debe mostrar indicador de datos incompletos cuando el cliente no tenga fecha de nacimiento;
  - desde ficha/transaccion debe existir accion para completar/actualizar datos.
- La alerta de cumpleanos se calcula por dia/mes, no por edad.
- No se mostrara edad en MVP.
- Zona horaria funcional: Costa Rica (`America/Costa_Rica`).
- No habra envios automaticos de campanas de cumpleanos en MVP.
- El envio siempre requiere accion manual de la empresa.

Datos de cliente:
- Campo nuevo:
  - `birth_date` o equivalente en SQL/API;
  - nullable;
  - formato API recomendado: `YYYY-MM-DD`.
- Validaciones:
  - no aceptar fechas futuras;
  - permitir null/vacio;
  - no exigir ano real si SQL/API decide soportar solo dia/mes en futuro, pero para MVP se recomienda fecha completa nullable para simplicidad.
- Privacidad:
  - usar el dato solo para alertas/campanas de cumpleanos;
  - no mostrar edad;
  - no exponer fecha de nacimiento fuera del contexto de la empresa autenticada;
  - no incluir fecha completa en correos promocionales salvo decision futura.

Indicador de datos incompletos:
- Un cliente sin fecha de nacimiento debe mostrarse con estado visual no bloqueante:
  - copy sugerido: `Datos incompletos`;
  - icono/alerta visual amarilla;
  - accion sugerida: `Completar datos`.
- Debe aparecer al menos en:
  - ficha del cliente;
  - resultado/seleccion de cliente;
  - flujo donde se registra compra/canje si el cliente seleccionado no tiene fecha.
- No debe impedir compra, canje ni acumulacion de puntos.

Alerta de cumpleaneros del dia:
- Despues del login de empresa, si hay clientes que cumplen anos hoy, mostrar alerta tipo campanita/resumen.
- Contenido sugerido:
  - `Hay cumpleaneros hoy`;
  - contador de clientes;
  - accion `Enviar campana de cumpleanos`.
- La alerta debe considerar:
  - clientes de la empresa autenticada;
  - fecha de nacimiento con dia/mes igual a hoy en Costa Rica;
  - clientes con email valido para accion de envio;
  - excluir o marcar no elegibles si tienen baja promocional/supresion.
- Si no hay cumpleaneros, no mostrar alerta intrusiva.

Tipos de campana:
- Agregar tipo de campana promocional.
- Tipos MVP:
  - `comun`;
  - `cumpleanos`.
- Todas las campanas existentes deben quedar como `comun`.
- Al crear/actualizar campana, la empresa debe seleccionar tipo.
- Si no se selecciona tipo, default MVP: `comun`.

Flujo de envio de cumpleanos:
- Desde alerta de cumpleanos, el boton `Enviar campana de cumpleanos` lleva al modulo de envio de campanas.
- En ese flujo:
  - la lista de campanas debe mostrar solo campanas tipo `cumpleanos`;
  - la lista de clientes debe mostrar solo cumpleaneros del dia;
  - los clientes dados de baja/suprimidos deben aparecer deshabilitados o excluidos segun criterio actual de la UI, pero nunca seleccionables;
  - clientes sin email valido no deben ser seleccionables;
  - mantener confirmacion manual antes de enviar.
- El limite MVP de destinatarios se mantiene en 5, salvo decision posterior.
- No se cambia la regla anti-duplicado existente.
- No se cambia sender ni ACS.

Flujo normal de envio:
- Para campanas tipo `comun`, el flujo actual se mantiene.
- La limpieza reciente dejo solo `Nuevo - Nueva Bebida`; esa campana debe ser tratada como `comun` tras la migracion.
- El filtro de cumpleanos no debe afectar envio comun.

Criterios de aceptacion para SQL DEV:
- Preparar migracion versionada con:
  - fecha de nacimiento nullable en clientes;
  - tipo de campana en promociones con default `comun`;
  - constraint/check para tipos permitidos;
  - backfill de campanas existentes como `comun`;
  - estrategia de consulta por cumpleanos dia/mes.
- No aplicar Azure SQL sin decision posterior.

Criterios de aceptacion para Backend/API:
- Soportar birth date en crear/actualizar/listar cliente.
- Exponer indicador de datos incompletos.
- Exponer resumen/lista de cumpleaneros del dia por empresa autenticada.
- Soportar tipo de campana en create/update/list/preview/send.
- Filtrar envio de cumpleanos por:
  - campana tipo `cumpleanos`;
  - clientes cumpleaneros del dia;
  - email valido;
  - preferencia promocional permitida.
- No enviar correos reales en pruebas locales.

Criterios de aceptacion para Web Dev:
- Agregar fecha de nacimiento al registro/edicion de cliente.
- Mostrar indicador amarillo de datos incompletos.
- Permitir completar/actualizar datos desde ficha/transaccion.
- Mostrar alerta tipo campanita de cumpleaneros despues del login.
- Agregar selector de tipo en Crear/actualizar campanas.
- Desde la alerta, abrir flujo de envio de cumpleanos filtrado.
- Mantener flujo comun sin regresion.

Criterios de aceptacion para QA:
- Cliente nuevo con y sin fecha.
- Cliente existente sin fecha muestra datos incompletos.
- Actualizacion de fecha desde ficha/transaccion.
- Alerta de cumpleaneros del dia.
- Campana tipo `comun` y tipo `cumpleanos`.
- Envio de cumpleanos muestra solo campanas de cumpleanos y cumpleaneros del dia.
- No se envian correos reales.

Uso Azure SQL:
- No.
- Motivo: definicion funcional solamente.

Riesgos o pendientes:
- Validar si el almacenamiento de fecha completa es aceptable para privacidad del piloto; por ahora se define nullable y sin mostrar edad.
- Definir en UI final si clientes no elegibles por baja aparecen deshabilitados o se ocultan en el flujo de cumpleanos.
- Aplicacion de migracion SQL queda pendiente de decision posterior.

Siguiente recomendado:
- Ejecutar TASK-774 para migracion SQL local/versionada.
- Ejecutar TASK-775 y TASK-776 para API/Web local.
- Ejecutar TASK-777 para QA local.
