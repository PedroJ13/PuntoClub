Equipo:
SQL DEV

Tarea completada:
TASK-008 - Preparar SQL ejecutable con seed minimo.

Archivos cambiados:
- database/seed.sql
- tasks/TASK-008-HANDOFF.md

SQL agregado o modificado:
- Nuevo script database/seed.sql.
- Inserta o actualiza la empresa piloto con:
  - id = 1
  - name = Cafe Central
  - points_percentage = 5.00
  - status = active
- Usa IDENTITY_INSERT solo cuando la empresa id 1 no existe.
- No inserta clientes, compras ni redenciones QA en el seed base.

Verificacion ejecutada:
- Revision estatica del orden de ejecucion:
  1. database/schema.sql
  2. database/seed.sql
- Confirmado que el seed respeta constraints de dbo.Companies:
  - points_percentage 5.00 cumple CK_Companies_points_percentage.
  - status active cumple CK_Companies_status.
  - name no es null.
- Confirmado que los datos base coinciden con docs/QA_TEST_PLAN.md para empresa piloto.
- Confirmado que clientes QA de docs/QA_TEST_PLAN.md quedan disponibles para ser creados por API/UI durante pruebas, sin conflicto por preseed.
- No ejecutado contra Azure SQL real porque no hay connection string ni base de datos configurada en esta tarea.

Resultado:
Seed minimo listo para desarrollo/piloto sin secretos.

Riesgos o pendientes:
- El script asume que la base nueva puede reservar company id 1 para la empresa piloto.
- Si una base existente ya tiene datos con id 1 de otra empresa, el script la actualizaria a Cafe Central; no usar sobre production con datos reales sin respaldo y confirmacion.
- QA debe crear Maria Soto y Carlos Mora mediante API/UI para validar los flujos de registro, duplicados, compras y redenciones.
- Backend/API debe configurar PILOT_COMPANY_ID = 1 como secreto/configuracion de ambiente, no en el frontend.

Siguiente recomendado:
Infra/Backend puede ejecutar database/schema.sql y luego database/seed.sql en la base local o Azure SQL del piloto. QA debe usar docs/QA_TEST_PLAN.md para crear clientes y movimientos desde la aplicacion.
