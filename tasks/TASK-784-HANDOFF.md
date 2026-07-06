Equipo: Product / Architect / Release
Modo de ejecucion: API Web Release
Tarea completada: TASK-784 - Commit y push controlado del paquete cumpleanos

Resultado:
- Commit y push realizados.
- Workflow Web completado en success.
- Workflow API fallo en smoke publicado.
- Release no queda cerrado/aprobado porque API no paso verificacion.
- No se enviaron correos reales.
- No se cambiaron ACS, sender ni flags.

Commit publicado:
- `0046b94` - `Release birthday campaign package`

Push:
- Rama: `main`
- Remoto: `origin/main`
- Rango publicado: `f51c477..0046b94`
- Nota: tambien se publico el commit local previo `9d12c70` (`Record TASK-778 handoff`) porque ya estaba adelantado antes de TASK-784.

Archivos incluidos en el commit de cumpleanos:
- `api/src/functions/customers.js`
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `api/test/validators.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `database/migrations/20260705_birthdays_campaign_type.sql`
- `tasks/TASK-773-HANDOFF.md`
- `tasks/TASK-774-HANDOFF.md`
- `tasks/TASK-775-HANDOFF.md`
- `tasks/TASK-776-HANDOFF.md`
- `tasks/TASK-777-HANDOFF.md`
- `tasks/TASK-780-HANDOFF.md`
- `tasks/TASK-781-HANDOFF.md`
- `tasks/TASK-782-HANDOFF.md`
- `tasks/TASK-783-HANDOFF.md`

Validaciones locales antes del commit:
- `node --check` en archivos API/Web focales: aprobado.
- `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js`: 56/56 pass.
- `npx prettier --check ...`: aprobado.
- `git diff --check`: sin errores; solo avisos LF/CRLF.

Workflows:
- `Deploy Punto Club frontend`
  - Run: `28801837020`
  - Estado: `completed`
  - Resultado: `success`
- `Deploy Punto Club API`
  - Run: `28801837193`
  - Estado: `completed`
  - Resultado: `failure`

Fallo API observado:
- Step: `Smoke test stable API`
- Comando: `npm run smoke`
- Endpoint fallido:
  - `POST /companies/6/customers`
- Esperado:
  - HTTP `201`
- Recibido:
  - HTTP `500`
  - `{"error":{"code":"INTERNAL_ERROR","message":"Unexpected API error."}}`

Diagnostico probable:
- La migracion TASK-783 agrego el trigger `TR_Customers_birth_date_not_future` sobre `dbo.Customers`.
- El repositorio usa `INSERT ... OUTPUT INSERTED...` en `createCustomer`.
- SQL Server no permite `OUTPUT` directo sin `INTO` cuando la tabla objetivo tiene triggers habilitados.
- Esto explicaria el 500 del smoke al crear cliente despues de aplicar la migracion.
- Requiere correccion Backend/API y prueba con SQL real o prueba automatizada que cubra este caso.

Estado git al cierre:
- `main` y `origin/main` apuntan a `0046b94`.
- Queda sin commitear `tasks/TASK-779-HANDOFF.md`, no relacionado con el paquete cumpleanos.
- Este handoff `TASK-784-HANDOFF.md` queda local pendiente de commit en una tarea posterior de cierre/higiene.

Uso Azure SQL:
- No desde esta tarea.
- La migracion ya habia sido aplicada por TASK-783.
- La falla se detecto por workflow API publicado contra ambiente estable.

P0/P1:
- P1 abierto: API publicada no pasa smoke en registro de cliente (`POST /companies/6/customers` devuelve 500).

Riesgos o pendientes:
- La UI Web ya fue publicada, pero API no quedo validada por workflow.
- Registro de clientes puede estar afectado en ambiente publicado hasta corregir el endpoint.
- No ejecutar QA publicada de cumpleanos hasta corregir API y obtener workflow API success.

Siguiente recomendado:
- Crear tarea Backend/API para corregir `createCustomer` con tabla que tiene trigger, preferiblemente usando `OUTPUT ... INTO` o estrategia equivalente segura.
- Agregar prueba/regresion que cubra el caso de trigger + insert/update si aplica.
- Luego publicar hotfix API y revalidar workflows.
