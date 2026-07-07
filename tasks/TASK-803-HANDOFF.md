Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-803 - Cerrar release de cumpleanos

Resultado:
- Release de cumpleaños cerrado como publicado y validado.
- Migracion SQL aplicada.
- API/Web publicados.
- Hotfix de trigger aplicado.
- Filtro de destinatarios cumpleañeros corregido.
- Reset de flujo comun publicado.
- QA publicada aprobo.
- No se enviaron correos reales.

Alcance funcional cerrado:
- Fecha de nacimiento nullable en clientes.
- Indicador no bloqueante de datos incompletos cuando falta fecha de nacimiento.
- Actualizacion de fecha de nacimiento desde ficha/transaccion.
- Alerta de cumpleañeros despues del login.
- Tipos de campaña `comun` y `cumpleanos`.
- Flujo dedicado de cumpleaños:
  - muestra solo campañas tipo `cumpleanos`;
  - muestra solo destinatarios elegibles que cumplen años hoy;
  - mantiene limite MVP de 5;
  - no envia automatico.
- Flujo comun:
  - mantiene campañas y destinatarios normales;
  - se restablece correctamente al volver desde navegacion normal.

Hitos procesados:
- TASK-773: definicion funcional aprobada.
- TASK-774: migracion SQL versionada preparada.
- TASK-775: Backend/API local implementado.
- TASK-776: Web local implementado.
- TASK-777: QA local inicial no aprobo por P1 en selector de campañas de cumpleaños.
- TASK-780: Web corrigio selector de campañas de cumpleaños.
- TASK-781: QA local aprobo.
- TASK-782: Product/Release aprobo aplicar migracion y publicar.
- TASK-783: SQL DEV aplico migracion en Azure SQL.
- TASK-784: primer release API/Web; Web success, API fallo por `POST /companies/6/customers` con 500.
- TASK-786/TASK-787: hotfix local de `OUTPUT ... INTO` aprobado.
- TASK-788/TASK-789: hotfix API publicado; workflow API success.
- TASK-785: QA publicada no aprobo por P1 de destinatarios cumpleañeros.
- TASK-790/TASK-791: fix local de destinatarios cumpleañeros aprobado.
- TASK-792/TASK-793: fix API/Web publicado; workflows API/Web success.
- TASK-794: QA publicada aprobo P1 corregido, con observacion P2 de reset de flujo.
- TASK-795/TASK-796: primer ajuste Web del reset; QA local no aprobo menu lateral.
- TASK-798/TASK-799: fix Web local del reset aprobado.
- TASK-800/TASK-801: fix Web publicado; workflow Web success.
- TASK-802: QA publicada aprobo reset de flujo comun.

Migracion SQL:
- Archivo:
  - `database/migrations/20260705_birthdays_campaign_type.sql`
- Aplicada en:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`
- Validado:
  - `dbo.Customers.birth_date` nullable;
  - columnas calculadas `birth_month` y `birth_day`;
  - trigger `TR_Customers_birth_date_not_future`;
  - `dbo.PromotionalCampaigns.campaign_type`;
  - constraints e indices;
  - campañas existentes como `comun`.

Publicaciones:
- `0046b94` - `Release birthday campaign package`
  - Web success.
  - API fallo en smoke, corregido posteriormente.
- `aa70dd6` - `Fix customer insert with birthday trigger`
  - API success.
- `47ffbba` - `Fix birthday campaign recipient filter`
  - API success.
  - Web success.
- `1cf23f6` - `Reset campaign send flow on navigation`
  - Web success.

QA publicada:
- TASK-785:
  - no aprobada por P1 de destinatarios cumpleañeros.
- TASK-794:
  - aprobada con observacion P2.
  - P1 de destinatarios cumpleañeros corregido.
- TASK-802:
  - aprobada.
  - reset de flujo comun publicado validado.

Datos QA creados en ambiente publicado:
- TASK-785:
  - se crearon dos clientes QA sin correo:
    - uno con fecha de nacimiento;
    - uno sin fecha de nacimiento;
  - se actualizo la fecha de nacimiento de uno;
  - se creo una campaña QA tipo `cumpleanos` sin imagen.
- TASK-802:
  - se creo un cliente QA sin correo con fecha de nacimiento `1990-07-07` para activar alerta sin disparar correo operativo.
- No se ejecutaron envios promocionales reales.
- No se enviaron correos reales.

Uso Azure SQL:
- Si.
- Motivo:
  - TASK-783 aplico migracion SQL aprobada.
  - QA publicada opero contra ambiente publicado.
- Guardrails:
  - SQL DEV retiro regla temporal de firewall.
  - Locks restaurados segun handoff TASK-783.
  - No se imprimieron secretos.

Riesgos residuales:
- Datos QA permanecen en ambiente publicado; no bloquean el release, pero si Product desea limpieza, debe crearse tarea SQL/QA controlada.
- No se valido envio real de campañas de cumpleaños; fuera de alcance y sin autorizacion explicita.
- La fecha de nacimiento se mantiene bajo alcance de privacidad MVP: no mostrar edad y no incluir fecha completa en correos salvo decision futura.

Estado final:
- P0/P1/P2/P3 abiertos: ninguno para el release de cumpleaños.
- Release de cumpleaños listo para cierre de higiene git.

Siguiente recomendado:
- Ejecutar TASK-804 para commitear handoffs de cierre.
