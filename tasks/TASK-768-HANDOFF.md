Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Limpieza datos promocionales
Tarea completada: TASK-768 - Confirmar criterio final para conservar campana Nueva Bebida

Resultado:
- Se corrige el criterio de conservacion de la campana `Nuevo - Nueva Bebida`.
- El recipient correcto del envio reciente es `fatima2210@gmail.com`.
- El correo `pj13eros@hotmail.com` mencionado antes fue un error de referencia.
- Se confirma que SQL DEV puede aplicar la limpieza de las demas campanas promocionales de prueba usando este criterio corregido.
- No se aplico limpieza desde esta tarea.
- No se cambio API, Web, SQL, ACS, sender ni flags.
- No se enviaron correos reales.

Campana autorizada para conservar:
- `company_id = 8`
- `campaign_id = 19`
- `name = Nuevo`
- `subject = Nueva Bebida`
- Imagen activa esperada:
  - `active_image_public_id = D750ABD9-206B-456F-9345-8C42A03271C8`
- Envio reciente esperado:
  - recipient: `fatima2210@gmail.com`
  - provider: `acs-email`
  - envio reciente ya identificado por SQL DEV en TASK-764/TASK-766.

Decision:
- Autorizar una nueva ejecucion apply de la limpieza de campanas promocionales.
- SQL DEV debe conservar `campaign_id = 19`.
- SQL DEV debe eliminar las demas campanas promocionales de prueba y sus dependencias permitidas, segun el script y guardrails ya preparados.
- Si el script permite `@ExpectedRecentRecipientEmail`, usar `N'fatima2210@gmail.com'`.
- Si el script no usa ese parametro en apply, SQL DEV debe documentar validacion equivalente antes del commit.

Fuera de alcance / prohibido:
- No borrar ni modificar clientes.
- No tocar puntos.
- No tocar compras.
- No tocar canjes.
- No tocar membresias.
- No modificar `CustomerPromotionalEmailPreferences`.
- No borrar ni modificar `PromotionalUnsubscribeEvents`.
- No cambiar ACS, sender ni feature flags.
- No enviar correos reales.

Uso Azure SQL:
- No.
- Motivo: decision de Product / Architect / Release sin consulta ni modificacion directa de datos.

Riesgos o pendientes:
- TASK-766 quedo bloqueada correctamente por discrepancia de correo; esta decision la resuelve.
- Falta ejecutar apply con SQL DEV y luego QA publicada post-limpieza.
- Si el preflight nuevo muestra que `campaign_id = 19` ya no coincide con imagen/envio/recipient esperado, SQL DEV debe detenerse y no hacer COMMIT.

Siguiente recomendado:
- Ejecutar TASK-769 para aplicar limpieza con el criterio corregido.
- Ejecutar TASK-770 para validar en Web publicada que solo queda `Nuevo - Nueva Bebida`.
