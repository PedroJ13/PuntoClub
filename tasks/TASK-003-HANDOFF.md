Equipo:
SQL DEV

Tarea completada:
TASK-003 - Proponer modelo SQL inicial para Azure SQL Database.

Archivos cambiados:
- database/schema.sql
- tasks/TASK-003-HANDOFF.md

SQL agregado o modificado:
- Tablas MVP:
  - dbo.Companies
  - dbo.Customers
  - dbo.Purchases
  - dbo.Redemptions
- Restricciones:
  - factura unica por empresa con UX_Purchases_company_invoice
  - customer pertenece a company con FK compuestas en Purchases y Redemptions
  - amount positivo
  - points_earned y points_redeemed positivos
  - points_percentage mayor que 0 y menor o igual que 100
  - status limitado a active/inactive
- Indices iniciales:
  - UX_Customers_company_phone
  - UX_Customers_company_email filtrado cuando email no es null
  - IX_Customers_company_name
  - IX_Purchases_customer_date
  - IX_Redemptions_customer_date
- Vista:
  - dbo.CustomerPointBalances para saldo calculado por compras menos redenciones
- Procedimiento:
  - dbo.RegisterRedemption para validar saldo con transaccion y bloqueo del cliente

Verificacion ejecutada:
- Revision estatica del script en orden de ejecucion.
- Confirmado que Companies se crea antes de Customers, y Customers antes de Purchases/Redemptions.
- Confirmado que factura duplicada por empresa queda bloqueada por indice unico.
- Confirmado que Purchases y Redemptions no pueden apuntar a un customer de otra company por FK compuesta (company_id, customer_id).
- Confirmado que el saldo puede calcularse con dbo.CustomerPointBalances.
- Agregadas consultas de validacion al final de database/schema.sql.
- No ejecutado contra Azure SQL real porque no hay connection string ni base de datos configurada en esta tarea.

Resultado:
Modelo SQL inicial propuesto y script creado para Azure SQL Database.

Riesgos o pendientes:
- La API debe usar dbo.RegisterRedemption o una transaccion equivalente; insertar directo en dbo.Redemptions saltaria la validacion de saldo.
- Backend/API debe definir el redondeo exacto de puntos_earned al convertir amount y points_percentage.
- La unicidad de cliente se propone por phone dentro de company y por email cuando existe; Product / Architect / Release debe confirmar si esta regla aplica al piloto.
- No se implementa borrado logico todavia; si se requiere, se debe agregar status o deleted_at antes de operar datos reales.
- updated_at no se actualiza automaticamente; puede resolverlo API o un trigger posterior si Product / Architect / Release lo aprueba.

Siguiente recomendado:
Backend/API debe tomar este modelo como base para TASK-004 y definir contratos que respeten company_id, usen factura unica por empresa y registren redenciones mediante dbo.RegisterRedemption.
