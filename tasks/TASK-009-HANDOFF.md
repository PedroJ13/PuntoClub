Equipo:
Backend/API

Tarea completada:
TASK-009 - Implementar base API contra SQL.

Archivos cambiados:
- api/package.json
- api/host.json
- api/local.settings.sample.json
- api/.gitignore
- api/src/functions/customers.js
- api/src/functions/purchases.js
- api/src/functions/redemptions.js
- api/src/lib/db.js
- api/src/lib/errors.js
- api/src/lib/http.js
- api/src/lib/repository.js
- api/src/lib/validators.js
- api/test/errors.test.js
- api/test/validators.test.js
- tasks/TASK-009-HANDOFF.md

Verificacion ejecutada:
- Pruebas unitarias locales con `node --test` para validaciones puras y mapeo de errores SQL.
- Verificado que `pointsEarned` se calcula server-side y se rechaza si viene desde frontend.
- Verificado mapeo de errores para `DUPLICATE_INVOICE`, `DUPLICATE_CUSTOMER` e `INSUFFICIENT_POINTS`.
- No se ejecuto contra Azure SQL real porque no hay `SQL_CONNECTION_STRING` configurado en el entorno local.

Resultado:
Se creo una base de Azure Functions Node para endpoints MVP:
- `GET /api/companies/{companyId}/customers`
- `POST /api/companies/{companyId}/customers`
- `POST /api/companies/{companyId}/purchases`
- `GET /api/companies/{companyId}/customers/{customerId}/balance`
- `GET /api/companies/{companyId}/customers/{customerId}/activity`
- `POST /api/companies/{companyId}/redemptions`

Riesgos o pendientes:
- Requiere instalar dependencias con `npm install` dentro de `api/` antes de ejecutar Azure Functions.
- Requiere `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID` configurados como variables de entorno; no se guardaron secrets.
- `authLevel` queda `anonymous` porque TASK-007 decidio empresa piloto unica y no auth final; el acceso debe limitarse operativamente hasta definir auth real.
- Redenciones usan `dbo.RegisterRedemption`; si la base no tiene el procedimiento, ese endpoint fallara hasta aplicar `database/schema.sql`.
- La respuesta de redencion obtiene el ultimo movimiento compatible despues de ejecutar el procedimiento; si se requiere id exacto garantizado, SQL DEV deberia ajustar el procedimiento para devolver `INSERTED.id`.

Siguiente recomendado:
Infra/Backend debe instalar dependencias, configurar variables locales y ejecutar `database/schema.sql` + `database/seed.sql` contra una base DEV para que QA pueda validar TASK-013.
