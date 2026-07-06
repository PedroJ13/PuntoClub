Equipo: QA
Tarea validada: TASK-787 - Validar hotfix local de registro de cliente post-migracion
Ambiente: Local/mock y stubs de repositorio API. No se levanto Azure SQL, no se aplicaron migraciones, no se publico.
Resultado: aprobado

Checks ejecutados:
- Lectura de handoff TASK-786.
- Smoke focal `tmp/task787-qa.mjs`.
- Validacion de `validateCustomerPayload` con fecha valida y sin fecha.
- Validacion negativa de fecha futura `2999-01-01`.
- Validacion de `repository.createCustomer` con DB mock para confirmar `OUTPUT ... INTO @inserted` con y sin `birthDate`.
- Validacion de respuesta mapeada con `birthDate` nullable y `profileIncomplete`.
- Validacion mock API de creacion de cliente con fecha de nacimiento.
- Validacion mock API de creacion de cliente sin fecha de nacimiento.
- Validacion mock API de rechazo de fecha futura.
- Regresion mock API de busqueda por nombre/telefono.
- Regresion mock API de compra basica, saldo y canje basico.
- Checks tecnicos: `node --check`, `git diff --check`, `node --test api/test/repository-customer-search.test.js api/test/validators.test.js`, `npx prettier --check`.

Hallazgos:
- `createCustomer` queda validado con `OUTPUT INTO @inserted`, evitando el fallo esperado con triggers en `dbo.Customers`.
- Cliente con fecha valida queda con `birthDate` informado y `profileIncomplete: false`.
- Cliente sin fecha queda con `birthDate: null` y `profileIncomplete: true`.
- Fecha futura se rechaza con validacion sobre `birthDate`.
- Busqueda, compra, saldo, actividad y canje basico no presentan regresion en mock local.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- `tmp/task787-qa.mjs`: `ok: true`.
- Repositorio mock: 2 llamadas a `createCustomer`, una con `birth_date: null` y otra con `birth_date: 1990-07-06`; ambas con `DECLARE @inserted TABLE` y `OUTPUT INSERTED... INTO @inserted`.
- Mock API: cliente con fecha `1990-07-06` retorna `profileIncomplete: false`.
- Mock API: cliente sin fecha retorna `birthDate: null` y `profileIncomplete: true`.
- Mock API: compra de `10000` genera `500` puntos; canje de `100` deja saldo `400`; actividad contiene `purchase` y `redemption`.
- Unit tests focales: 39/39 pass.
- Prettier: `All matched files use Prettier code style!`
- `node --check` y `git diff --check`: sin errores; solo avisos LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- Validacion local/mock/stub segun alcance de la tarea.
- No se valido contra SQL Server real ni Azure SQL; la tarea indico no tocar Azure SQL.
- La correccion publicada debe validarse en tarea web/API publicada posterior si Product / Architect / Release decide publicar.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-787 como QA local aprobado y decidir el siguiente paso del ciclo local -> QA local -> decision de publicar.
