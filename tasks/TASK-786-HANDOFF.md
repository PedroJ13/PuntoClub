Equipo: Backend/API
Modo de ejecucion: Hotfix / Cumpleanos
Tarea completada: TASK-786 - Corregir createCustomer con trigger en Customers

Archivos cambiados:
- `api/src/lib/repository.js`
- `api/test/repository-customer-search.test.js`
- `tasks/TASK-786-HANDOFF.md`

Ambiente:
- Local.
- No se cambio SQL real.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Implementacion:
- Se corrigio `createCustomer` para no usar `OUTPUT INSERTED...` directo sobre `dbo.Customers`.
- La insercion ahora usa `OUTPUT ... INTO @inserted` y luego `SELECT` desde la tabla variable.
- Se aplico la misma estrategia en `updateCustomer`, porque tambien opera sobre `dbo.Customers` y el trigger `TR_Customers_birth_date_not_future` puede afectar updates.
- Se conserva el contrato de respuesta con `birthDate` nullable y `profileIncomplete`.

Motivo tecnico:
- SQL Server no permite `OUTPUT` directo sin `INTO` cuando la tabla objetivo tiene triggers habilitados para esa accion.
- Despues de TASK-783, `dbo.Customers` tiene el trigger `TR_Customers_birth_date_not_future`, por lo que `POST /companies/{companyId}/customers` podia responder 500.

Prueba/regresion:
- Se agrego prueba en `api/test/repository-customer-search.test.js`:
  - `createCustomer uses OUTPUT INTO so Customers triggers do not break inserts`
- La prueba valida que el SQL generado declare tabla variable, use `OUTPUT ... INTO @inserted` y devuelva el registro creado desde `@inserted`.

Verificacion ejecutada:
- `node --check api/src/lib/repository.js`
- `node --check api/test/repository-customer-search.test.js`
- `node --test api/test/repository-customer-search.test.js`
- `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js`
- `npx prettier --check api/src/lib/repository.js api/test/repository-customer-search.test.js`

Resultado:
- Sintaxis OK.
- Tests de repositorio de clientes: 2/2 OK.
- Tests de validadores/promociones: 56/56 OK.
- Prettier OK.

Uso Azure SQL:
- No.
- Motivo: hotfix local de codigo y prueba unitaria; la tarea pidio no cambiar SQL real.

P0/P1:
- Ninguno abierto en local.

Riesgos o pendientes:
- Requiere publicacion Backend/API posterior para corregir el 500 en ambiente publicado.
- QA publicado debe validar alta de cliente con `birthDate` vacio y con fecha valida despues del deploy.
