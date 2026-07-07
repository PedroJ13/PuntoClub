Equipo: QA
Tarea validada: TASK-808 - Validar limpieza de datos QA cumpleanos
Ambiente: Web publicada `https://puntoclubcr.com/app`, sesion real/controlada de Aurisbel Pasteleria, 2026-07-06 20:32 -06:00
Resultado: aprobado

Checks ejecutados:
- Se reviso el handoff de TASK-807 para confirmar alcance de limpieza: 3 clientes QA, 1 campana QA de cumpleanos y dependencias QA asociadas.
- En Web publicada se busco por `QA785`, `QA802` y telefonos QA usados en TASK-785/TASK-802.
- Se valido la lista publicada de campanas tras recargar la aplicacion.
- Se confirmo que las campanas reales `Nuevo - Nueva Bebida` y `Energia para el Lunes` siguen visibles.
- Se ejecuto smoke read-only sobre cliente real existente: ficha, puntos, controles de compra/canje y membresias visibles; no se registraron operaciones.
- Se valido que el selector de tipo de campana conserva `Comun` y `Cumpleanos`; al seleccionar `Cumpleanos` no aparecen errores visibles ni datos QA.
- Se revisaron errores de consola del navegador durante la prueba.
- No se ejecutaron envios reales.

Hallazgos:
- No se encontraron clientes QA en busquedas por prefijo ni por telefonos QA.
- Tras recargar la app, la campana QA `QA785...` ya no aparece en los selectores de envio ni de crear/actualizar campanas.
- En la primera inspeccion antes de recargar, el navegador aun mostraba estado viejo con la campana QA en memoria. Se descarto como cache/estado de sesion porque desaparecio despues de reload y las listas quedaron consistentes.
- Las campanas reales esperadas siguen visibles.
- El smoke de cliente real no mostro regresion visible en puntos, compra/canje ni membresias.
- El flujo visual de cumpleanos queda accesible sin errores visibles aunque no haya data QA de cumpleanos.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno abierto.

Evidencia:
- Busqueda `QA785`: 0 resultados, mensaje de no encontrados despues de esperar respuesta.
- Busqueda `QA802`: 0 resultados.
- Busqueda por telefonos QA de TASK-785/TASK-802: 0 resultados.
- Campanas publicadas despues de reload: `Energia para el Lunes - Energia para el Lunes · Comun` y `Nuevo - Nueva Bebida · Comun`.
- Campana QA de cumpleanos: ausente en selector de envio y selector de crear/actualizar.
- Smoke de cliente real: 1 resultado atendible, ficha cargada con area de puntos, controles de compra/canje y texto de membresias visibles; no se guardaron cambios.
- Consola del navegador: 0 errores relevantes durante la validacion.

Uso DB cloud: Si, motivo y alcance
- Si.
- Motivo: validacion post-limpieza en ambiente publicado contra datos reales ya limpiados por TASK-807.
- Alcance: Web publicada y consulta read-only/navegacion sobre datos visibles; no se crearon, modificaron ni eliminaron registros; no se enviaron correos.

Riesgos o pendientes:
- La validacion fue funcional/UI publicada; no se hizo nueva consulta directa a Azure SQL desde QA.
- Se observo estado cacheado inicial antes de reload, por lo que se recomienda recargar la app al validar limpiezas recientes en sesiones ya abiertas.

Siguiente recomendado:
- Product / Architect / Release puede cerrar TASK-808 y continuar con el ciclo siguiente. No quedan bloqueos QA para la limpieza de datos de cumpleanos.
