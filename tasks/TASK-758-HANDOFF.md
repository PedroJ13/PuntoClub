Equipo: QA
Tarea validada: TASK-758 - Validar limpieza de marcas de envio promocional
Ambiente: Web publicada `https://puntoclubcr.com/app?cb=task753`, sesion real/controlada de Aurisbel Pasteleria en navegador interno, fecha 2026-07-02 19:24 -06:00
Resultado: bloqueado

Checks ejecutados:
- Lectura de `tasks/TASK-756-HANDOFF.md`.
- Lectura de `tasks/TASK-757-HANDOFF.md`.
- Confirmacion con Product Owner durante la prueba: el script de limpieza aun no fue ejecutado.
- Validacion visual segura en `Enviar campanas` con sesion publicada.
- Seleccion local de destinatarios elegibles desde UI, sin guardar seleccion y sin enviar correos.
- Limpieza final de seleccion y restauracion de filtro `Suscritos`.

Hallazgos:
- La validacion post-limpieza no puede aprobarse porque la limpieza de TASK-757 no fue aplicada.
- TASK-757 solo preparo el script `database/operations/20260702_task757_clean_promotional_test_sends.sql` y declara explicitamente que no se ejecuto contra Azure SQL ni modifico datos reales.
- Se valido parcialmente que la pantalla `Enviar campanas` permite seleccionar destinatarios elegibles desde UI publicada.
- En filtro `Suscritos`, se observaron 10 tarjetas visibles con clientes suscritos y puntos conservados en la UI, por ejemplo Fatima Arraiz con 465 puntos y otros clientes con saldos visibles.
- `Seleccionar elegibles` habilito el boton de envio (`Enviar a 5`) sin errores visibles.
- No se hizo click en `Enviar`.
- Al finalizar, se limpio la seleccion: `0 seleccionados de 5`, boton `Enviar campana` deshabilitado.

P0/P1:
- P1 bloqueante de validacion: no existe precondicion de post-limpieza porque el script de limpieza aun no fue ejecutado. No se puede confirmar que se removieron marcas `campaignId + customerId`, ni que los clientes dejaron de estar marcados como ya enviados para campanas de prueba.

P2/P3:
- P3 observacion UI: al alternar filtros, `Todos` mostro temporalmente `No hay destinatarios para este filtro`; se restauro la vista usando `Suscritos`, que mostro 10 tarjetas. No se clasifica como bloqueo de TASK-758 porque el alcance principal depende de limpieza de datos no aplicada.

Evidencia:
- TASK-757-HANDOFF: `No se ejecuto contra Azure SQL. No se modificaron datos reales.`
- Confirmacion del Product Owner en chat: falta ejecutar el script.
- Sesion publicada activa: `Aurisbel Pasteleria`, usuario mostrado `eventos.aurisbel@gmail.com`.
- UI antes/despues de seleccion:
  - filtro `Suscritos`: 10 tarjetas visibles.
  - seleccion local: `Enviar a 5`, boton habilitado.
  - limpieza final: `0 seleccionados de 5`, boton `Enviar campana` deshabilitado.
- No se enviaron correos reales.
- No se cambiaron flags.
- No se ejecuto SQL desde QA.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada con sesion real/controlada contra datos reales de la empresa autenticada.
- Alcance: lectura indirecta desde la UI publicada y seleccion local de checkboxes en navegador. No se uso acceso directo a Azure SQL, no se ejecuto el script de limpieza, no se borraron/modificaron datos desde QA y no se enviaron correos reales.

Riesgos o pendientes:
- Pendiente ejecutar TASK-757 en ventana controlada por SQL DEV/Infra, primero con evidencia dry-run y luego apply confirmado si corresponde.
- Pendiente reintentar TASK-758 despues de aplicar la limpieza para confirmar:
  - marcas de envio de prueba removidas;
  - campanas afectadas reseteadas si aplica;
  - clientes/puntos/compras/canjes/membresias intactos;
  - bajas promocionales reales intactas;
  - destinatarios elegibles disponibles para nuevas pruebas sin bloqueo por duplicado.

Siguiente recomendado:
- Ejecutar la limpieza controlada de TASK-757 con el proceso aprobado y luego crear/reintentar una tarea QA post-limpieza. No aprobar TASK-758 hasta contar con evidencia de aplicacion real de la limpieza.
