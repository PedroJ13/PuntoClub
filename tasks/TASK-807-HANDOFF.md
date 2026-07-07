Equipo: SQL DEV
Modo de ejecucion: Datos / Limpieza controlada
Tarea completada: TASK-807 - Preparar y ejecutar limpieza controlada de datos QA cumpleanos

Resultado:
- Se preparo script operativo seguro con `@DryRun = 1` por defecto.
- Se ejecuto dry-run en Azure SQL.
- Los candidatos coincidieron con TASK-806/TASK-785/TASK-802.
- Se aplico limpieza con `@DryRun = 0` y `@ConfirmTask = N'TASK-807-APPLY'`.
- Limpieza aplicada y commiteada.
- No se borraron clientes reales.
- No se tocaron compras, canjes, puntos reales, membresias, preferencias promocionales, bajas promocionales, imagenes productivas ni campanas reales.
- No se cambio API, Web, ACS, sender ni flags.
- No se enviaron correos reales.

Script creado:
- `database/operations/20260707_task807_clean_birthday_qa_data.sql`

Alcance aplicado:
- Empresa: `company_id = 8`.
- Ventana QA: `2026-07-06T00:00:00` a `2026-07-08T23:59:59` UTC.
- Clientes QA eliminados: `3`.
  - `QA785 Cumple ...`, sin email, fecha `1990-07-06`.
  - `QA785 Sin Fecha ...`, sin email, actualizada a fecha `1991-07-06`.
  - `QA802 Cumple ...`, sin email, fecha `1990-07-07`.
- Campanas QA eliminadas: `1`.
  - Campana tipo `cumpleanos`, nombre/asunto QA de TASK-785, estado `draft`, sin imagen.
- Recipients promocionales eliminados: `0`.
- Imagenes promocionales eliminadas: `0`.
- Eventos operativos QA eliminados: `3`.
  - Solo `welcome`, `skipped`, sin `recipient_email`, sin `provider_message_id`, motivo `customer_without_email`.
- Mensajes operativos QA eliminados: `3`.
- Attempts operativos QA eliminados: `3`.
- Audit events QA eliminados: `3`.
  - Solo `customer.created`, `entity_type = customer`, metadata `emailProvided=false`.

Dry-run:
- Primer dry-run encontro:
  - `3` clientes QA candidatos.
  - `1` campana QA candidata.
  - `3` eventos operativos asociados.
  - `0` bloqueadores de compras/canjes/puntos/membresias/preferencias/bajas/promociones.
- Se hizo consulta read-only adicional para confirmar eventos operativos:
  - todos `skipped`;
  - sin correo destino;
  - sin provider message id;
  - motivo `customer_without_email`.
- Se hizo consulta read-only adicional para confirmar audit events:
  - todos `customer.created`;
  - metadata `emailProvided=false`.

Aplicacion:
- Hubo dos intentos detenidos antes del commit:
  - Primer intento: SQL rechazo DELETE por opciones SET requeridas por indices/computed columns. Se agregaron `ANSI_NULLS`, `ANSI_PADDING`, `ANSI_WARNINGS`, `ARITHABORT`, `CONCAT_NULL_YIELDS_NULL`, `QUOTED_IDENTIFIER` y `NUMERIC_ROUNDABORT`.
  - Segundo intento: SQL detecto FK de `OperationalAuditEvents`; se amplio el script para incluir solo audit QA seguro y bloquear cualquier otro tipo.
- Ambos intentos quedaron abortados por SQL antes de commit; dry-run posterior confirmo que los candidatos seguian presentes.
- Tercer intento aplico correctamente y reporto remanentes `0`.

Validacion posterior:
- Candidatos QA restantes:
  - clientes: `0`;
  - campana QA: `0`;
  - eventos operativos QA: `0`;
  - audit events QA: `0`.
- Compras/canjes para los IDs candidatos: `0`.
- Campanas productivas preservadas:
  - `Nuevo - Nueva Bebida`: `1`.
  - `Energía para el Lunes`: `1`.

Firewall y locks:
- Se creo regla temporal SQL firewall:
  - `tmp-task807-birthday-clean-200-229-6-68`
  - IP: `200.229.6.68`.
- Al retirar la regla, Azure bloqueo por lock `puntoclub-sqlserver-cannotdelete`.
- Se retiro temporalmente ese lock solo para borrar la regla.
- Se elimino la regla temporal.
- Se restauro el lock `puntoclub-sqlserver-cannotdelete` como `CanNotDelete`.
- Verificacion final:
  - regla temporal: `[]`;
  - lock restaurado: `puntoclub-sqlserver-cannotdelete`, `CanNotDelete`.

Uso Azure SQL:
- Si.
- Motivo: limpieza aprobada de datos QA reales en ambiente publicado.
- Alcance: dry-run, apply transaccional y validacion read-only posterior.

Riesgos o pendientes:
- La limpieza fue destructiva solo sobre datos QA identificados y dependencias QA necesarias para liberar FKs.
- No se eliminaron blobs fisicos porque no habia imagenes candidatas.
- Recomendado QA posterior: confirmar en Web publicada que ya no aparecen los clientes/campana QA de cumpleanos y que las campanas reales siguen visibles.
