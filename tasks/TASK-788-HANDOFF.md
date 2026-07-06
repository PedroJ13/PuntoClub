Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-788 - Decidir publicacion del hotfix API registro de cliente

Resultado:
- Decision aprobada para publicar el hotfix API de registro/actualizacion de cliente.
- No se cambio SQL.
- No se cambio Web.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Handoffs revisados:
- TASK-784:
  - El paquete cumpleanos fue publicado en commit `0046b94`.
  - Workflow Web termino en success.
  - Workflow API fallo en smoke publicado.
  - Falla observada: `POST /companies/6/customers` esperaba `201` y recibio `500`.
- TASK-786:
  - Backend/API corrigio `createCustomer` para usar `OUTPUT ... INTO @inserted`.
  - Backend/API aplico la misma estrategia en `updateCustomer`.
  - Se agrego prueba/regresion en `api/test/repository-customer-search.test.js`.
  - Tests focales locales aprobados.
- TASK-787:
  - QA local/mock aprobo el hotfix.
  - Valido cliente con fecha, cliente sin fecha, rechazo de fecha futura, busqueda, compra, saldo y canje basico.

Decision:
- Se autoriza ejecutar TASK-789.
- El commit/push debe limitarse a:
  - `api/src/lib/repository.js`;
  - `api/test/repository-customer-search.test.js`;
  - handoffs `TASK-784`, `TASK-786`, `TASK-787` y `TASK-788`.
- Se debe excluir:
  - `debug.log`;
  - `tmp/`;
  - `tasks/TASK-779-HANDOFF.md`;
  - cambios no relacionados.

Motivo tecnico:
- Despues de TASK-783, `dbo.Customers` tiene el trigger `TR_Customers_birth_date_not_future`.
- SQL Server no permite `OUTPUT INSERTED...` directo sin `INTO` cuando la tabla objetivo tiene triggers habilitados.
- La correccion con `OUTPUT ... INTO @inserted` ataca el origen probable del 500 publicado.

Condiciones de publicacion:
- Verificar validaciones locales antes del commit.
- Pushear a `origin/main`.
- Verificar workflow API hasta completion success.
- Si el workflow API vuelve a fallar, documentar el error y crear tarea correctiva; no continuar con QA publicada de cumpleanos.

Uso Azure SQL:
- No.
- Motivo: decision de release; no se ejecuto SQL desde esta tarea.

P0/P1:
- P1 previo en API publicada queda pendiente hasta que TASK-789 confirme workflow API success.

Siguiente recomendado:
- Ejecutar TASK-789.
- Si TASK-789 aprueba, retomar TASK-785 para QA publicada de cumpleanos.
