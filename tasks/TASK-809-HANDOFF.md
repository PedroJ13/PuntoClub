Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-809 - Cerrar limpieza de datos QA cumpleanos

Resultado:
- Limpieza de datos QA del release de cumpleanos cerrada.
- SQL DEV aplico limpieza con `dry_run = 0`.
- QA publicada aprobo post-limpieza.
- No quedan clientes QA ni campana QA de cumpleaños visibles en Web publicada.
- Campanas reales siguen intactas.
- No se enviaron correos reales.

Handoffs procesados:
- TASK-806:
  - Definio alcance de limpieza y reglas de seguridad.
  - Prohibio borrar clientes reales, puntos, compras, canjes, membresias, preferencias, campañas reales, imagenes productivas y la campaña `Nuevo - Nueva Bebida`.
- TASK-807:
  - SQL DEV preparo script operativo seguro con `@DryRun = 1` por defecto.
  - Ejecuto dry-run en Azure SQL.
  - Confirmo candidatos esperados.
  - Aplico limpieza con `@DryRun = 0` y `@ConfirmTask = N'TASK-807-APPLY'`.
  - Valido remanentes `0`.
- TASK-808:
  - QA validó en Web publicada.
  - Confirmó que clientes/campaña QA ya no aparecen.
  - Confirmó que campañas reales siguen visibles.
  - No ejecutó envíos reales.

Script SQL:
- `database/operations/20260707_task807_clean_birthday_qa_data.sql`

Limpieza aplicada:
- Empresa:
  - `company_id = 8`
- Ventana QA:
  - `2026-07-06T00:00:00` a `2026-07-08T23:59:59` UTC
- Clientes QA eliminados:
  - `3`
- Campañas QA eliminadas:
  - `1`
- Recipients promocionales eliminados:
  - `0`
- Imagenes promocionales eliminadas:
  - `0`
- Eventos/mensajes/attempts operativos QA eliminados:
  - `3` de cada tipo, asociados a clientes sin correo y estado skipped.
- Audit events QA eliminados:
  - `3`, solo `customer.created` con metadata `emailProvided=false`.

Validacion SQL posterior:
- Clientes QA candidatos restantes:
  - `0`
- Campaña QA candidata restante:
  - `0`
- Eventos operativos QA restantes:
  - `0`
- Audit events QA restantes:
  - `0`
- Compras/canjes para IDs candidatos:
  - `0`
- Campañas productivas preservadas:
  - `Nuevo - Nueva Bebida`: `1`
  - `Energía para el Lunes`: `1`

Validacion QA publicada:
- Busqueda `QA785`:
  - `0` resultados.
- Busqueda `QA802`:
  - `0` resultados.
- Telefonos QA:
  - `0` resultados.
- Campaña QA cumpleaños:
  - ausente en selector de envio y selector de crear/actualizar.
- Campañas reales visibles:
  - `Nuevo - Nueva Bebida`
  - `Energía para el Lunes`
- Smoke de cliente real:
  - sin regresion visible en ficha, puntos, compra/canje ni membresias.

Uso Azure SQL:
- Si.
- Motivo:
  - TASK-807 aplicó limpieza aprobada de datos QA reales.
  - TASK-808 validó Web publicada contra datos reales ya limpiados.
- Guardrails:
  - SQL DEV usó dry-run previo.
  - SQL DEV usó transaccion y confirmacion explicita.
  - Regla temporal de firewall retirada.
  - Lock restaurado.
  - No se imprimieron secretos.

Riesgos residuales:
- QA observo que sesiones abiertas pueden mostrar estado cacheado hasta recargar; se recomienda reload al validar limpiezas recientes.
- No se hizo nueva consulta directa SQL desde QA; SQL DEV ya habia validado remanentes `0`.

Estado final:
- P0/P1/P2/P3 abiertos:
  - ninguno.
- Limpieza de datos QA de cumpleanos lista para higiene git.

Siguiente recomendado:
- Ejecutar TASK-810 para commitear script y handoffs de limpieza.
